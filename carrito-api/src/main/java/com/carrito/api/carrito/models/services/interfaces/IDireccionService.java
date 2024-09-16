package com.carrito.api.carrito.models.services.interfaces;

import java.util.List;

import com.carrito.api.carrito.models.entity.compra.Direccion;

public interface IDireccionService {

    public List<Direccion> findAll();

    public Direccion findById(Long id);

    public Direccion save(Direccion dir);

    public void delete(Long id);
}
