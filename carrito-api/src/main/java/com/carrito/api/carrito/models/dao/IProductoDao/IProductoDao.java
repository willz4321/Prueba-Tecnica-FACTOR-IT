package com.carrito.api.carrito.models.dao.IProductoDao;

import org.springframework.data.repository.CrudRepository;

import com.carrito.api.carrito.models.entity.producto.Producto;

public interface IProductoDao extends CrudRepository<Producto, Long> {

}
