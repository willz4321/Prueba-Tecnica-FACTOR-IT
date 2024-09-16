package com.carrito.api.carrito.models.services.CompraServiceImpl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.carrito.api.carrito.models.dao.ICompraDao.IProductoCompraDao;
import com.carrito.api.carrito.models.entity.compra.ProductoCompra;
import com.carrito.api.carrito.models.services.interfaces.IProductoCompService;

@Service
public class ProdCServiceImpl implements IProductoCompService {

    private final IProductoCompraDao productoCompraDao;

    public ProdCServiceImpl(IProductoCompraDao productoCompraDao) {
        this.productoCompraDao = productoCompraDao;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductoCompra> findAll() {
        return (List<ProductoCompra>) productoCompraDao.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public ProductoCompra findById(Long id) {
      return productoCompraDao.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public ProductoCompra save(ProductoCompra pc) {
        return productoCompraDao.save(pc);
    }
}
