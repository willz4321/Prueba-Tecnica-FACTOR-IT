package com.carrito.api.carrito;



import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.junit.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;

import com.carrito.api.carrito.models.dao.ICompraDao.ICompraDao;
import com.carrito.api.carrito.models.entity.compra.Cliente;
import com.carrito.api.carrito.models.entity.compra.Compra;
import com.carrito.api.carrito.models.entity.compra.Direccion;
import com.carrito.api.carrito.models.entity.enums.TipoCliente;
import com.carrito.api.carrito.models.services.CompraServiceImpl.CompraServiceImpl;
import com.carrito.api.carrito.models.services.interfaces.IClienteService;
import com.carrito.api.carrito.models.services.interfaces.IDireccionService;
import com.carrito.api.carrito.models.services.interfaces.IProductoCompService;

import jakarta.transaction.Transactional;

@RunWith(MockitoJUnitRunner.class)
public class CompraServiceTest {

    @Mock
    private ICompraDao compraDao;

    @Mock
    private IProductoCompService productoCompService;

    @Mock
    private IDireccionService direccionService;

    @Mock
    private IClienteService clienteService;

    @InjectMocks
    private CompraServiceImpl compraService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @Transactional
    public void testFindByCliente() {
        Cliente cliente = new Cliente(1L, "Cliente1", "Apellido1", 12345678L, TipoCliente.VIP);
        Compra compra1 = new Compra();
        compra1.setCliente(cliente);
        compra1.setFecha(Date.from(LocalDate.now().minusDays(10).atStartOfDay(ZoneId.systemDefault()).toInstant()));
        compra1.setTotal(new BigDecimal("15000"));
        
        Compra compra2 = new Compra();
        compra2.setCliente(cliente);
        compra2.setFecha(Date.from(LocalDate.now().minusDays(30).atStartOfDay(ZoneId.systemDefault()).toInstant()));
        compra2.setTotal(new BigDecimal("3000"));
        
        when(compraDao.findByClienteId(1L)).thenReturn(Arrays.asList(compra1, compra2));

        List<Compra> compras = compraService.findByCliente(1L);

        assertNotNull(compras, "La lista de compras no debe ser nula");
        assertEquals(2, compras.size(), "Debe haber 2 compras");
        assertEquals(compra1, compras.get(0), "La primera compra no es la esperada");
    }

    @Test
    @Transactional
    public void testFindById() {
        Compra compra = new Compra();
        compra.setId(1L);

        when(compraDao.findById(1L)).thenReturn(Optional.of(compra));

        Compra resultCompra = compraService.findById(1L);

        assertNotNull(resultCompra, "La compra no debe ser nula");
        assertEquals(1L, resultCompra.getId(), "El ID de la compra no es el esperado");
    }

    @Test
    @Transactional
    public void testSave() {
        Cliente cliente = new Cliente(1L, "Cliente1", "Apellido1", 12345678L, TipoCliente.VIP);
        Direccion direccion = new Direccion();
        Compra compra = new Compra();
        compra.setCliente(cliente);
        compra.setDatosCompra(direccion);
        compra.setListaProductos(Arrays.asList());

        when(clienteService.findCliente(cliente)).thenReturn(cliente);
        when(direccionService.save(direccion)).thenReturn(direccion);
        when(compraDao.save(compra)).thenReturn(compra);

        Compra savedCompra = compraService.save(compra);

        assertNotNull(savedCompra, "La compra guardada no debe ser nula");
        verify(compraDao, times(1)).save(compra);
    }

    @Test
    @Transactional
    public void testDelete() {
        Long id = 1L;
        doNothing().when(compraDao).deleteById(id);

        compraService.dalete(id);

        verify(compraDao, times(1)).deleteById(id);
    }
}