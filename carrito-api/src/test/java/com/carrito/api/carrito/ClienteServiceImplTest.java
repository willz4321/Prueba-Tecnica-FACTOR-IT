package com.carrito.api.carrito;

import static org.junit.Assert.assertNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.junit.Test;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;

import com.carrito.api.carrito.models.dao.ICompraDao.IClienteDao;
import com.carrito.api.carrito.models.dao.ICompraDao.ICompraDao;
import com.carrito.api.carrito.models.entity.compra.Cliente;
import com.carrito.api.carrito.models.entity.compra.Compra;
import com.carrito.api.carrito.models.entity.enums.TipoCliente;
import com.carrito.api.carrito.models.services.CompraServiceImpl.ClienteServiceImpl;

import jakarta.transaction.Transactional;

@RunWith(MockitoJUnitRunner.class)
public class ClienteServiceImplTest {

    @InjectMocks
    private ClienteServiceImpl clienteService;

    @Mock
    private IClienteDao clienteDao;

    @Mock
    private ICompraDao compraService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testFindAll() {
        List<Cliente> clientes = Arrays.asList(
            new Cliente(1L, "Cliente1", "Apellido1", 12345678L, TipoCliente.COMUN),
            new Cliente(2L, "Cliente2", "Apellido1", 87654321L, TipoCliente.VIP)
        );


        when(clienteDao.findAll()).thenReturn(clientes);

        List<Cliente> resultado = clienteService.findAll();

        assertEquals(2, resultado.size());
        assertEquals("Cliente1", resultado.get(0).getNombre());
        assertEquals("Cliente2", resultado.get(1).getNombre());
    }

    @Test
    public void testFindById() {
        Cliente cliente = new Cliente(1L, "Cliente1", "Apellido1", 12345678L, TipoCliente.COMUN);
        when(clienteDao.findById(1L)).thenReturn(Optional.of(cliente));

        Cliente resultado = clienteService.findById(1L);

        assertEquals("Cliente1", resultado.getNombre());

        when(clienteDao.findById(2L)).thenReturn(Optional.empty());
        Cliente resultadoNoExistente = clienteService.findById(2L);

        assertNull(resultadoNoExistente);
    }

    @Test
    public void testSave() {
        Cliente cliente = new Cliente(1L, "Cliente1", "Apellido1", 12345678L, TipoCliente.COMUN);
        when(clienteDao.save(cliente)).thenReturn(cliente); 
    
        Cliente resultado = clienteService.save(cliente);
    
        assertNotNull(resultado); 
        assertEquals("Cliente1", resultado.getNombre()); 
    }
    

    @Test
    public void testDelete() {
        clienteService.delete(1L);
        verify(clienteDao, times(1)).deleteById(1L);
    }

    @Test
    public void testFindCliente() {
        // Configurar datos de prueba
        Cliente cliente = new Cliente(1L, "Cliente1", "Apellido1", 12345678L, TipoCliente.COMUN);
        
        // Configurar mocks
        when(clienteDao.findByDni(cliente.getDni())).thenReturn(Optional.of(cliente));
        when(clienteDao.save(any(Cliente.class))).thenAnswer(invocation -> invocation.getArgument(0));
        
       Date fecha = Date.from(Instant.now());
        Compra compra = new Compra();
        compra.setId(1L);
        compra.setCliente(cliente);
        compra.setFecha(fecha);
        compra.setTotal(new BigDecimal(15000)); // Total mayor a 10000

        // Configurar mocks para compras
        when(compraService.findByClienteId(cliente.getId())).thenReturn(Arrays.asList(compra));
        
        // Ejecutar método findCliente
        Cliente cliente2 = clienteService.findCliente(cliente);

        // Verificar que resultado no es nulo
        Assertions.assertNotNull(cliente2, "El cliente retornado no debe ser nulo.");
        System.out.println("Tipo de cliente: " + cliente2.getTipo());
        // Verificar que el tipo de cliente es VIP
        Assertions.assertEquals(TipoCliente.VIP, cliente2.getTipo(), "El cliente debería ser VIP.");
    }
    
    @Test
    @Transactional
    public void testVerifyCustomerExistence() {
        Cliente cliente = new Cliente(1L, "Cliente1", "Apellido1", 12345678L, TipoCliente.VIP);

        // Mock for clienteDao
        when(clienteDao.findByDni(12345678L)).thenReturn(Optional.of(cliente));

        // Prepare dates
        LocalDate now = LocalDate.now();

        Compra compraActual = new Compra();
        compraActual.setFecha(Date.from(now.minusDays(10).atStartOfDay(ZoneId.systemDefault()).toInstant()));
        compraActual.setTotal(new BigDecimal("15000"));
        
        Compra compraAnterior = new Compra();
        compraAnterior.setFecha(Date.from(now.minusDays(40).atStartOfDay(ZoneId.systemDefault()).toInstant()));
        compraAnterior.setTotal(new BigDecimal("3000"));
        
        when(compraService.findByClienteId(1L)).thenReturn(Arrays.asList(compraActual, compraAnterior));

        // Test customer remains VIP
        Cliente resultCliente = clienteService.VerifyCustomerExistence(12345678L);
        assertEquals(TipoCliente.VIP, resultCliente.getTipo());

        // Change purchase data to test demotion
        Compra compraDesactualizada = new Compra();
        compraDesactualizada.setFecha(Date.from(now.minusDays(60).atStartOfDay(ZoneId.systemDefault()).toInstant()));
        compraDesactualizada.setTotal(new BigDecimal("2000"));

        when(compraService.findByClienteId(1L)).thenReturn(Arrays.asList(compraDesactualizada));

        // Test customer is demoted to COMUN
        resultCliente = clienteService.VerifyCustomerExistence(12345678L);
        assertEquals(TipoCliente.COMUN, resultCliente.getTipo());
    }
}