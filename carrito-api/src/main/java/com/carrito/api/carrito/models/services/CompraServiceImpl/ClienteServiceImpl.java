package com.carrito.api.carrito.models.services.CompraServiceImpl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.carrito.api.carrito.models.dao.ICompraDao.IClienteDao;
import com.carrito.api.carrito.models.dao.ICompraDao.ICompraDao;
import com.carrito.api.carrito.models.entity.compra.Cliente;
import com.carrito.api.carrito.models.entity.compra.Compra;
import com.carrito.api.carrito.models.entity.enums.TipoCliente;
import com.carrito.api.carrito.models.services.interfaces.IClienteService;

@Service
public class ClienteServiceImpl implements IClienteService{
    
    private final IClienteDao clienteDao;
    private final ICompraDao compraService;
    
    public ClienteServiceImpl(IClienteDao clienteDao, ICompraDao compraService) {
        this.clienteDao = clienteDao;
        this.compraService = compraService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Cliente> findAll() {
       return (List<Cliente>) clienteDao.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Cliente findById(Long id) {
      return clienteDao.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public Cliente save(Cliente cliente) {
      return clienteDao.save(cliente);
    }

    @Override
    @Transactional
    public void delete(Long id) {
       clienteDao.deleteById(id);
    }

    @Override
    @Transactional
    public Cliente findCliente(Cliente cliente) {
        try {
            Optional<Cliente> existingCliente = clienteDao.findByDni(cliente.getDni());
    
            if (existingCliente.isPresent()) {
                Cliente clienteExistente = existingCliente.get();
    
                LocalDate now = LocalDate.now();
                LocalDate startOfCurrentMonth = now.withDayOfMonth(1);
                LocalDate startOfPreviousMonth = startOfCurrentMonth.minusMonths(1);
    
                Date startDateCurrentMonth = Date.from(startOfCurrentMonth.atStartOfDay(ZoneId.systemDefault()).toInstant());
                Date startDatePreviousMonth = Date.from(startOfPreviousMonth.atStartOfDay(ZoneId.systemDefault()).toInstant());
    
                // Obtiene todas las compras del cliente
                List<Compra> compras = compraService.findByClienteId(clienteExistente.getId());
    
                // Verifica si el cliente es VIP
                if (clienteExistente.getTipo() != TipoCliente.VIP) {
                    BigDecimal totalCompras = compras.stream()
                        .filter(compra -> compra.getFecha().after(startDateCurrentMonth)) 
                        .map(Compra::getTotal)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
    
                    if (totalCompras.compareTo(new BigDecimal(10000)) > 0) {
                        clienteExistente.setTipo(TipoCliente.VIP);
                        clienteExistente.setAntiguedad(calculateAntiguedad(clienteExistente.getFechaVip(), TipoCliente.VIP));
                        clienteExistente.setFechaVip(new Date());
                        clienteExistente = clienteDao.save(clienteExistente);
                    }
                } else {
                    // Si el cliente ya es VIP, verifica si ha realizado compras en el mes actual o anterior
                    boolean hasRecentPurchases = compras.stream()
                        .anyMatch(compra -> compra.getFecha().after(startDatePreviousMonth));
    
                    // Si no tiene compras recientes, despromociona a COMUN
                    if (!hasRecentPurchases) {
                        clienteExistente.setTipo(TipoCliente.COMUN);
                        clienteExistente.setAntiguedad(calculateAntiguedad(clienteExistente.getFechaComun(), TipoCliente.COMUN));
                        clienteExistente.setFechaVip(null);
                        clienteExistente =  clienteDao.save(clienteExistente);
                    }
                }
    
                return clienteExistente;
            } else {
                cliente.setTipo(TipoCliente.COMUN);
                cliente.setAntiguedad(calculateAntiguedad(cliente.getFechaComun(), TipoCliente.COMUN));
                return clienteDao.save(cliente);
            }
        } catch (Exception e) {
       
            throw new RuntimeException("Error al encontrar o guardar Cliente", e);
        }
    }   
    
    @Override
    @Transactional
    public Cliente VerifyCustomerExistence(Long dni) {
        Optional<Cliente> cliente = clienteDao.findByDni(dni);
    
        if (cliente.isPresent()) {
            Cliente clienteExistente = cliente.get();
    
            if (clienteExistente.getTipo() == TipoCliente.VIP) {                
                LocalDate now = LocalDate.now();
                LocalDate startOfCurrentMonth = now.withDayOfMonth(1);
                LocalDate startOfPreviousMonth = startOfCurrentMonth.minusMonths(1);
                
                Date startDateCurrentMonth = Date.from(startOfCurrentMonth.atStartOfDay(ZoneId.systemDefault()).toInstant());
                Date startDatePreviousMonth = Date.from(startOfPreviousMonth.atStartOfDay(ZoneId.systemDefault()).toInstant());
    
                List<Compra> compras = compraService.findByClienteId(clienteExistente.getId());
    
                // Verifica si realizó compras en el mes anterior
                boolean hasPurchasesInPreviousMonth = compras.stream()
                    .anyMatch(compra -> compra.getFecha().after(startDatePreviousMonth) && compra.getFecha().before(startDateCurrentMonth));
    
                // Verifica si realizó compras en el mes actual y si el total supera los 10,000
                BigDecimal totalComprasEnMesActual = compras.stream()
                    .filter(compra -> compra.getFecha().after(startDateCurrentMonth))
                    .map(Compra::getTotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
    
                boolean hasPurchasesInCurrentMonth = totalComprasEnMesActual.compareTo(BigDecimal.ZERO) > 0;
                boolean totalMayorA10000 = totalComprasEnMesActual.compareTo(new BigDecimal(10000)) > 0;
    
                // Si no realizó compras ni en el mes anterior ni en el mes actual, pasa a COMUN
                if (!hasPurchasesInPreviousMonth && !hasPurchasesInCurrentMonth) {
                    clienteExistente.setTipo(TipoCliente.COMUN);
                    clienteExistente.setAntiguedad("FUE VIP EL MES PASADO");
                    clienteDao.save(clienteExistente);
                } 
                // Si realizó compras en el mes actual y superan los $10,000, sigue siendo VIP
                else if (totalMayorA10000) {
                    clienteExistente.setTipo(TipoCliente.VIP);
                    clienteDao.save(clienteExistente);
                }
            }else {
                LocalDate now = LocalDate.now();
                LocalDate startOfCurrentMonth = now.withDayOfMonth(1);

                Date startDateCurrentMonth = Date.from(startOfCurrentMonth.atStartOfDay(ZoneId.systemDefault()).toInstant());
                // Busca todas las compras del cliente
                List<Compra> compras = compraService.findByClienteId(clienteExistente.getId());

                BigDecimal totalCompras = compras.stream()
                .filter(compra -> compra.getFecha().after(startDateCurrentMonth)) 
                .map(Compra::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

            if (totalCompras.compareTo(new BigDecimal(10000)) > 0) {
                clienteExistente.setTipo(TipoCliente.VIP);
                clienteExistente = clienteDao.save(clienteExistente);
            }
            }
    
            return clienteExistente;  
        } else {
            return cliente.get();
        }
    }
     
    private String calculateAntiguedad(Date fechaInicio, TipoCliente tipo) {

    if (fechaInicio == null) {
        return "0 MESES"; // Si no hay fecha registrada, el cliente es nuevo en este tipo
    }

    Calendar startCal = Calendar.getInstance();
    startCal.setTime(fechaInicio);

    Calendar nowCal = Calendar.getInstance();

    int yearsDifference = nowCal.get(Calendar.YEAR) - startCal.get(Calendar.YEAR);
    int monthsDifference = nowCal.get(Calendar.MONTH) - startCal.get(Calendar.MONTH);

    // Si es el mismo mes y año, devolver 0 MESES
    if (yearsDifference == 0 && monthsDifference == 0) {
        return "0 MESES";
    }

    // Calcula la diferencia total en meses
    int totalMonths = yearsDifference * 12 + monthsDifference;

    return totalMonths + " MESES";
 }
}
