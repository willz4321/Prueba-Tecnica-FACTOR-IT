package com.carrito.api.carrito.controllers.responose;

import java.util.List;

import com.carrito.api.carrito.models.entity.compra.Compra;

public class GetComprasResponse {
    private List<Compra> compras;

    public List<Compra> getCompras() {
        return compras;
    }

    public void setCompras(List<Compra> compras) {
        this.compras = compras;
    }
}
