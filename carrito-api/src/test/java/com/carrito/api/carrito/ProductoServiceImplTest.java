package com.carrito.api.carrito;

import static org.junit.Assert.assertNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;

import com.carrito.api.carrito.models.dao.IProductoDao.IProductoDao;
import com.carrito.api.carrito.models.entity.producto.Producto;
import com.carrito.api.carrito.models.services.ProductoServiceImpl.ProductoServiceImpl;

@RunWith(MockitoJUnitRunner.class)
public class ProductoServiceImplTest {

    @InjectMocks
    private ProductoServiceImpl productoService;

    @Mock
    private IProductoDao productoDao;

    @Test
    public void testFindAll() {
        // Simular el comportamiento del repositorio

        List<Producto> productos = Arrays.asList(
            new Producto(1L, null, "Producto1", new BigDecimal("100.00"), null, null, null),
            new Producto(2L, null, "Producto2", new BigDecimal("200.00"), null, null, null)
        );
        
        Mockito.when(productoDao.findAll()).thenReturn(productos);

        // Ejecutar el método del servicio
        List<Producto> resultado = productoService.findAll();

        // Verificar el resultado
        assertEquals(2, resultado.size());
        assertEquals("Producto1", resultado.get(0).getNombre());
        assertEquals("Producto2", resultado.get(1).getNombre());
    }

    @Test
    public void testFindById() {
    Producto producto = new Producto(1L, null, "Producto1", new BigDecimal("100.00"), null, null, null);
    Mockito.when(productoDao.findById(1L)).thenReturn(Optional.of(producto));

    Producto resultado = productoService.findById(1L);

    assertEquals("Producto1", resultado.getNombre());

    Mockito.when(productoDao.findById(2L)).thenReturn(Optional.empty());
    Producto resultadoNoExistente = productoService.findById(2L);

    assertNull(resultadoNoExistente);
    }

    @Test
    public void testSave() {
        Producto producto = new Producto(1L, null, "Producto1", new BigDecimal("100.00"), null, null, null);
        Mockito.when(productoDao.save(producto)).thenReturn(producto);

        Producto resultado = productoService.save(producto);

        assertNotNull(resultado);
        assertEquals("Producto1", resultado.getNombre());
    }
   
    @Test
    public void testDelete() {
        productoService.delete(1L);
        Mockito.verify(productoDao, Mockito.times(1)).deleteById(1L);
    }

}