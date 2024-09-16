package com.carrito.api.carrito.models.dao.ICompraDao;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.carrito.api.carrito.models.entity.compra.Cliente;

public interface IClienteDao extends CrudRepository<Cliente, Long>{

    Optional<Cliente> findByDni(Long dni);
}
