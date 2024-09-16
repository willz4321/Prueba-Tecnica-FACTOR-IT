package com.carrito.api.carrito.models.dao.ICompraDao;

import org.springframework.data.repository.CrudRepository;

import com.carrito.api.carrito.models.entity.compra.Direccion;

public interface IDireccionDao extends CrudRepository<Direccion, Long> {

}
