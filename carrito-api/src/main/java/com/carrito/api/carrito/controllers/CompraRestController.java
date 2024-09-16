package com.carrito.api.carrito.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carrito.api.carrito.models.entity.compra.Compra;
import com.carrito.api.carrito.models.entity.compra.Promociones;
import com.carrito.api.carrito.models.entity.producto.Producto;
import com.carrito.api.carrito.models.services.interfaces.ICompraService;
import com.carrito.api.carrito.models.services.interfaces.IProductoService;
import com.carrito.api.carrito.models.services.interfaces.IPromocionService;


import com.carrito.api.carrito.models.services.interfaces.IClienteService;



@CrossOrigin(origins = { "http://localhost:3000" })
@RestController
@RequestMapping("/api")
public class CompraRestController {

    private final ICompraService compraService;
    private final IProductoService productoService;
    private final IPromocionService promocionService;
    private final IClienteService clienteService;

    public CompraRestController(IPromocionService promocionService, ICompraService compraService, IProductoService productoService, IClienteService clienteService) {
        this.compraService = compraService;
        this.productoService = productoService;
        this.promocionService = promocionService;
        this.clienteService = clienteService;
    }


    //METODOS DE PRODUCTOS
    @GetMapping("/productos")
    public List<Producto> indexP() {
        return productoService.findAll();
    }
   
    //METODOS DE COMPRA
    @GetMapping("/compras")
    public List<Compra> index() {
        return compraService.findAll();
    }

    @GetMapping("/compras/{id}")
    public Compra show(@PathVariable Long id) {
        return compraService.findById(id);
    }

    @PostMapping("/compras")
    public ResponseEntity<Object> saveCompra(@RequestBody Compra compra) {
             
        try {
            return ResponseEntity.ok(compraService.save(compra));
                        
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Error al procesar compra: " + e.getMessage());
        }
    }

    @DeleteMapping("/compras/{id}")
    public ResponseEntity<Object> deleteC(@PathVariable Long id) {
        try {
            compraService.dalete(id);
            return ResponseEntity.ok("Compra eliminada");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Error al eliminar la Compra" + e.getMessage());
        }
      
    }

    //PRMOCIONES
    @GetMapping("/promociones")
    public List<Promociones> indexPr() {
        return promocionService.findAll();
    }

    //METODOS DE CLIENTE
    @GetMapping("/cliente/{dni}")
    public ResponseEntity<Object>  getClienteByID(@PathVariable Long dni) {
        try {
            return ResponseEntity.ok(clienteService.VerifyCustomerExistence(dni));
                        
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Error al buscar cliente: " + e.getMessage());
        }
    }
    
}
