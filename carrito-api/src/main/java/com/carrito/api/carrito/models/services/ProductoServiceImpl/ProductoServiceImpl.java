package com.carrito.api.carrito.models.services.ProductoServiceImpl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.carrito.api.carrito.models.dao.IProductoDao.IProductoDao;
import com.carrito.api.carrito.models.entity.producto.Producto;
import com.carrito.api.carrito.models.services.interfaces.IProductoService;

@Service
public class ProductoServiceImpl implements IProductoService {


    private final IProductoDao productoDao;

    public ProductoServiceImpl(IProductoDao productoDao) {
        this.productoDao = productoDao;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Producto> findAll() {
        return (List<Producto>) productoDao.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Producto findById(Long id) {
        return productoDao.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public Producto save(Producto Producto) {
        return productoDao.save(Producto);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        productoDao.deleteById(id);
    }    
}
