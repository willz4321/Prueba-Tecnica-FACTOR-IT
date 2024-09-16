package com.carrito.api.carrito.models.services.interfaces;

import java.util.List;

import com.carrito.api.carrito.models.entity.compra.Promociones;

public interface IPromocionService {
     public List<Promociones> findAll();

     public Promociones save(Promociones promo);
}
