package com.carrito.api.carrito.models.services.interfaces;

import java.util.List;

import org.springframework.stereotype.Service;

import com.carrito.api.carrito.models.entity.producto.Producto;

@Service
public interface IProductoService {

    public List<Producto> findAll();

    public Producto findById(Long id);

    public Producto save(Producto compra);

    public void delete(Long id);
}
