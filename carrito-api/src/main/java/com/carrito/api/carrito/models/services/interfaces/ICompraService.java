package com.carrito.api.carrito.models.services.interfaces;

import java.util.List;

import com.carrito.api.carrito.models.entity.compra.Compra;

public interface ICompraService {

    public List<Compra> findAll();

    public List<Compra> findByCliente(Long clienteId);

    public Compra findById(Long id);

    public Compra save(Compra compra);

    public void dalete(Long id);
}
