package com.carrito.api.carrito.config;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import com.carrito.api.carrito.models.dao.ICompraDao.IClienteDao;
import com.carrito.api.carrito.models.dao.ICompraDao.ICompraDao;
import com.carrito.api.carrito.models.entity.compra.Cliente;
import com.carrito.api.carrito.models.entity.compra.Compra;
import com.carrito.api.carrito.models.entity.enums.TipoCliente;

@Configuration
@EnableScheduling
public class SchedulingConfig {
    
    private final IClienteDao clienteDao;
    private final ICompraDao compraDao;

    public SchedulingConfig(IClienteDao clienteDao, ICompraDao compraDao) {
        this.clienteDao = clienteDao;
        this.compraDao = compraDao;
    }

    @Scheduled(cron = "0 0 0 1 * *")
    public void performScheduledTask() {
        List<Cliente> results = (List<Cliente>) clienteDao.findAll();

        for (Cliente cliente : results) {
            processCliente(cliente);
        }
    }

    private void processCliente(Cliente cliente) {
        try {
            Optional<Cliente> existingClienteOpt = clienteDao.findByDni(cliente.getDni());

            if (existingClienteOpt.isPresent()) {
                Cliente clienteExistente = existingClienteOpt.get();

                LocalDate now = LocalDate.now();
                LocalDate startOfCurrentMonth = now.withDayOfMonth(1);
                LocalDate startOfPreviousMonth = startOfCurrentMonth.minusMonths(1);

                Date startDateCurrentMonth = Date.from(startOfCurrentMonth.atStartOfDay(ZoneId.systemDefault()).toInstant());
                Date startDatePreviousMonth = Date.from(startOfPreviousMonth.atStartOfDay(ZoneId.systemDefault()).toInstant());

                List<Compra> compras = compraDao.findByClienteId(clienteExistente.getId());

                if (clienteExistente.getTipo() != TipoCliente.VIP) {
                    BigDecimal totalCompras = compras.stream()
                        .filter(compra -> compra.getFecha().after(startDateCurrentMonth))
                        .map(Compra::getTotal)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                    if (totalCompras.compareTo(new BigDecimal(10000)) > 0) {
                        clienteExistente.setTipo(TipoCliente.VIP);
                        clienteExistente.setAntiguedad(calculateAntiguedad(clienteExistente.getFechaVip(), TipoCliente.VIP));
                        clienteExistente.setFechaVip(new Date());
                        clienteExistente.setFechaComun(startDatePreviousMonth);
                        clienteDao.save(clienteExistente);
                    }
                } else {
                
                    boolean hasRecentPurchases = compras.stream()
                        .anyMatch(compra -> compra.getFecha().after(startDatePreviousMonth));
                
                        clienteExistente.setAntiguedad(calculateAntiguedad(clienteExistente.getFechaVip(), TipoCliente.VIP));
                    if (!hasRecentPurchases) {
                        clienteExistente.setTipo(TipoCliente.COMUN);
                        clienteExistente.setAntiguedad(calculateAntiguedad(clienteExistente.getFechaComun(), TipoCliente.COMUN));
                        clienteExistente.setFechaComun(new Date());
                        clienteExistente.setFechaVip(null);
                    }
                    clienteDao.save(clienteExistente);
                }
                
            }

        } catch (Exception e) {
            throw new RuntimeException("Error al procesar el cliente", e);
        }
    }

    private String calculateAntiguedad(Date fechaInicio, TipoCliente tipo) {

        if (fechaInicio == null) {
            return "0 MESES"; 
        }
    
        Calendar startCal = Calendar.getInstance();
        startCal.setTime(fechaInicio);
    
        Calendar nowCal = Calendar.getInstance();
    
        int yearsDifference = nowCal.get(Calendar.YEAR) - startCal.get(Calendar.YEAR);
        int monthsDifference = nowCal.get(Calendar.MONTH) - startCal.get(Calendar.MONTH);
    
        if (yearsDifference == 0 && monthsDifference == 0) {
            return "0 MESES";
        }

        int totalMonths = yearsDifference * 12 + monthsDifference;
    
        return totalMonths + " MESES";
    }
}