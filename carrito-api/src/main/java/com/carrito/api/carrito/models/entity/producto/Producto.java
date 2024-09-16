package com.carrito.api.carrito.models.entity.producto;

import java.math.BigDecimal;
import java.util.List;

import com.carrito.api.carrito.models.entity.enums.Talle;
import com.carrito.api.carrito.models.entity.enums.Tipo;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "productos")
public class Producto{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Tipo tipo;
    private String nombre;
    private BigDecimal precio;
    private String descripcion;
    private List<Talle> talles;
    private String imagen;
   
    public Producto(){

    }
    
    public Producto(Long id, Tipo tipo, String nombre, BigDecimal precio, String descripcion, List<Talle> talles, String imagen) {
        this.id = id;
        this.tipo = tipo;
        this.nombre = nombre;
        this.precio = precio;
        this.descripcion = descripcion;
        this.talles = talles;
        this.imagen = imagen;
    }
    
    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }


    public Tipo getTipo() {
        return tipo;
    }

    public void setTipo(Tipo tipo) {
        this.tipo = tipo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public List<Talle> getTalles() {
        return talles;
    }

    public void setTalles(List<Talle> talles) {
        this.talles = talles;
    }

}
