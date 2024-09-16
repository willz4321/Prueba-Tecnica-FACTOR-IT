package com.carrito.api.carrito.models.dao.ICompraDao;

import org.springframework.data.repository.CrudRepository;

import com.carrito.api.carrito.models.entity.compra.ProductoCompra;

public interface IProductoCompraDao extends CrudRepository<ProductoCompra, Long> {

}
