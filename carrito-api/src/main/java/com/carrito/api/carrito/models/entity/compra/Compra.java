package com.carrito.api.carrito.models.entity.compra;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "compra")
public class Compra{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long telefono;
    private BigDecimal totalSinDescuento;
    private BigDecimal total;
    private String email;
    private String descuento;
    private Date fecha;
    
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "direccion_id")
    private Direccion datosCompra;

    @OneToMany(mappedBy = "compra", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductoCompra> listaProductos;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTelefono() {
        return telefono;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTelefono(Long telefono) {
        this.telefono = telefono;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }
    
    public Direccion getDatosCompra() {
        return datosCompra;
    }

    public void setDatosCompra(Direccion datosCompra) {
        this.datosCompra = datosCompra;
    }

    public String getDescuento() {
        return descuento;
    }

    public void setDescuento(String descuento) {
        this.descuento = descuento;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public List<ProductoCompra> getListaProductos() {
        return listaProductos;
    }

    public void setListaProductos(List<ProductoCompra> listaProductos) {
        this.listaProductos = listaProductos;
    }

    public BigDecimal getTotalSinDescuento() {
        return totalSinDescuento;
    }

    public void setTotalSinDescuento(BigDecimal totalSinDescuento) {
        this.totalSinDescuento = totalSinDescuento;
    }
}

