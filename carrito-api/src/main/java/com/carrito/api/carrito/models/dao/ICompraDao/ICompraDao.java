package com.carrito.api.carrito.models.dao.ICompraDao;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.carrito.api.carrito.models.entity.compra.Compra;



public interface ICompraDao extends CrudRepository<Compra, Long> {
    
    List<Compra> findByClienteId(Long clienteId);
}
