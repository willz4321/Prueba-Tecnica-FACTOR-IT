package com.carrito.api.carrito.models.services.CompraServiceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.carrito.api.carrito.models.dao.ICompraDao.ICompraDao;
import com.carrito.api.carrito.models.entity.compra.Cliente;
import com.carrito.api.carrito.models.entity.compra.Compra;
import com.carrito.api.carrito.models.entity.compra.Direccion;
import com.carrito.api.carrito.models.entity.compra.ProductoCompra;
import com.carrito.api.carrito.models.services.interfaces.IClienteService;
import com.carrito.api.carrito.models.services.interfaces.ICompraService;
import com.carrito.api.carrito.models.services.interfaces.IDireccionService;
import com.carrito.api.carrito.models.services.interfaces.IProductoCompService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CompraServiceImpl implements ICompraService {


    private final ICompraDao CompraDao;
    private final IProductoCompService productoCompService;
    private final IDireccionService direccionService;
    private final IClienteService clienteService;
    private static final Logger logger = LoggerFactory.getLogger(CompraServiceImpl.class);

    public CompraServiceImpl(ICompraDao CompraDao, IProductoCompService productoCompService, IDireccionService direccionService, IClienteService clienteService) {
        this.CompraDao = CompraDao;
        this.productoCompService = productoCompService;
        this.direccionService = direccionService;
        this.clienteService = clienteService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Compra> findAll() {
        return (List<Compra>) CompraDao.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Compra> findByCliente(Long clienteId) {
        return (List<Compra>) CompraDao.findByClienteId(clienteId);
    }

    @Override
    @Transactional(readOnly = true)
    public Compra findById(Long id) {
        return CompraDao.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public Compra save(Compra compra) {
        try {
            // Guardar Direccion
            Direccion datos = direccionService.save(compra.getDatosCompra());
            compra.setDatosCompra(datos); 
            
            // Guardar Cliente
            Cliente cliente = clienteService.findCliente(compra.getCliente());
            compra.setCliente(cliente);  
        
            List<ProductoCompra> productoCompras = compra.getListaProductos()
                                                        .stream()
                                                        .map(productoCompra -> {
                                                            try {
                                                                productoCompra.setCompra(compra);  
                                                                return productoCompService.save(productoCompra); 
                                                            } catch (Exception e) {
                                                                // Manejo de excepción específico para ProductoCompra
                                                                throw new RuntimeException("Error al guardar ProductoCompra", e);
                                                            }
                                                        })
                                                        .collect(Collectors.toList());
            compra.setListaProductos(productoCompras);  
            
            return CompraDao.save(compra); 
        } catch (Exception e) {
            logger.error("Error al guardar Compra", e);
            throw new RuntimeException("Error al guardar Compra", e);
        }
    }
    

    @Override
    @Transactional
    public void dalete(Long id) {
        CompraDao.deleteById(id);
    }
}
