package com.carrito.api.carrito.models.services.interfaces;

import java.util.List;

import com.carrito.api.carrito.models.entity.compra.ProductoCompra;

public interface IProductoCompService {

    List<ProductoCompra> findAll();

    public ProductoCompra findById(Long id);

    public ProductoCompra save(ProductoCompra dir);

}
