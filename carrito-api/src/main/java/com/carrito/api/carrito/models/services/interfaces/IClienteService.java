package com.carrito.api.carrito.models.services.interfaces;

import java.util.List;

import com.carrito.api.carrito.models.entity.compra.Cliente;

public interface IClienteService {

    public List<Cliente> findAll();
    
    public Cliente findById(Long id);

    public Cliente findCliente(Cliente cliente);

    public Cliente VerifyCustomerExistence(Long dni);

    public Cliente save(Cliente cliente);

    public void delete(Long id);
}
