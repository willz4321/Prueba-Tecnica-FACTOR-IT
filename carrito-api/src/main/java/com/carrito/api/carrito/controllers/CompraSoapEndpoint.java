package com.carrito.api.carrito.controllers;

import java.util.List;

import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import com.carrito.api.carrito.controllers.responose.GetComprasResponse;
import com.carrito.api.carrito.models.entity.compra.Cliente;
import com.carrito.api.carrito.models.entity.compra.Compra;
import com.carrito.api.carrito.models.entity.compra.Promociones;
import com.carrito.api.carrito.models.entity.producto.Producto;
import com.carrito.api.carrito.models.services.interfaces.IClienteService;
import com.carrito.api.carrito.models.services.interfaces.ICompraService;
import com.carrito.api.carrito.models.services.interfaces.IProductoService;
import com.carrito.api.carrito.models.services.interfaces.IPromocionService;

@Endpoint
public class CompraSoapEndpoint {

    private static final String NAMESPACE_URI = "http://carrito.api.com/ws/compras";

    private final ICompraService compraService;
    private final IProductoService productoService;
    private final IPromocionService promocionService;
    private final IClienteService clienteService;

    public CompraSoapEndpoint(ICompraService compraService, IProductoService productoService,
                              IPromocionService promocionService, IClienteService clienteService) {
        this.compraService = compraService;
        this.productoService = productoService;
        this.promocionService = promocionService;
        this.clienteService = clienteService;
    }


    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getComprasRequest")
    @ResponsePayload
    public GetComprasResponse getCompras() {
        GetComprasResponse response = new GetComprasResponse();
        response.setCompras(compraService.findAll()); // Assuming findAll returns a List<Compra>
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getProductoRequest")
    @ResponsePayload
    public List<Producto> getProductos() {
        return productoService.findAll();
    }
    
    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getCompraByIdRequest")
    @ResponsePayload
    public Compra getCompraById(@RequestPayload Long id) {
        return compraService.findById(id);
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "saveCompraRequest")
    @ResponsePayload
    public Compra saveCompra(@RequestPayload Compra compra) {
        return compraService.save(compra);
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "deleteCompraRequest")
    @ResponsePayload
    public String deleteCompra(@RequestPayload Long id) {
        try {
            compraService.dalete(id);
            return "Compra eliminada con éxito";
        } catch (Exception e) {
            return "Error al eliminar la compra: " + e.getMessage();
        }
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getPromocionesRequest")
    @ResponsePayload
    public List<Promociones> getPromociones() {
        return promocionService.findAll();
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getClienteByDniRequest")
    @ResponsePayload
    public Cliente getClienteByDni(@RequestPayload Long dni) {
        return clienteService.VerifyCustomerExistence(dni);
    }
}