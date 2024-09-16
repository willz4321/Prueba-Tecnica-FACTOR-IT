import { Link, Navigate } from "react-router-dom";
import { formatPriceWithCommas, usePurchaseStore } from "../../../hooks";
import { useEffect, useState } from "react";

export const BuyDetails = () => {
  const {clienteCompra, startPostOrder, StarResetPurchase} = usePurchaseStore()
  const productosSeleccionados = clienteCompra.listaProductos
  const compra = clienteCompra
  const [redirectToTienda, setRedirectToTienda] = useState(false);
  

  useEffect(() => {
    if (productosSeleccionados.length === 0) {
      setRedirectToTienda(true);
    }
  }, [productosSeleccionados]);

  // Redirige a la página /tienda si el carrito está vacío
  if (redirectToTienda) {
    return <Navigate to="/" />;
  } 
   
  return (
    <div className="container vh-100">
      <h1 className="pt-4">Detalles de la compra</h1>
      <div className="row">
        <div className="col-md-7 pt-4 card text-bg-light mb-3 card-header vh-50" style={{maxHeight: '460px', overflow: 'auto' }}>
          <Link type="button" className="link-info d-flex justify-content-end text-decoration-none" to="/carrito">
            Editar
          </Link>
          <h4>Datos de facturación:</h4>
          <p>
            Nombre: {compra.cliente.nombre} {compra.cliente.apellido}
          </p>
          <p>Documento: {compra.cliente.dni}</p>
          <p>Dirección de Calle: {compra.datosCompra.calle}</p>
          <p>Tipo de Hogar: {compra.datosCompra.hogar}</p>
          <p>Código Postal: {compra.datosCompra.cp}</p>
          <p>Región/Provincia: {compra.datosCompra.provincia}</p>
          <p>Localidad: {compra.datosCompra.localidad}</p>
          <p>Teléfono: {compra.telefono}</p>
          <p>Correo Electrónico: {compra.email}</p>
          <p>Comentarios o Detalles de Compra: {compra.datosCompra.comentarios}</p>
        </div>
        <div className="col-md-5 mx-auto mt-5" style={{maxHeight: '460px'}}>
          <div className="list-group h-75 overflow-auto">
            <h4>Productos seleccionados:</h4>
            {productosSeleccionados.map((producto) => (
              <div key={producto.nombre} className=" list-group-item justify-content-between border-bottom-0 border-top-0 ">
                <div className="row align-items-center ">
                  <div className="col-md-3">
                    <img src={producto.imagen} alt={producto.nombre} className="img-listBuys" />
                  </div>
                  <div className="col-md-6">
                    <div>
                      <h6 className="d-flex ">{`${producto.nombre} - ${producto.talle}`}</h6>
                    </div>
                  </div>
                  <div className="col-md-1">
                    <p>{producto.cantidad}</p>
                  </div>
                  <div className="col-md-1">
                    <p>${formatPriceWithCommas(producto.precio * producto.cantidad)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="list-group-item align-items-end">
            <div className="row align-items-center">
              <div className="col-md-6">
                <h6>Total:</h6>
              </div>
              <div className="col-md-6">
                <p> 
                  {compra.total === compra.totalSinDescuento 
                    ? formatPriceWithCommas(compra.total) 
                    : (
                        <>
                          <s>{formatPriceWithCommas(compra.totalSinDescuento)}</s> 
                          &nbsp;
                          {formatPriceWithCommas(compra.total)}
                        </>
                      )
                  } 
                </p>
              </div>
            </div>
          </div>
          <div className="row justify-content-star p-2">
            <button className="col-3 btn btn-dark m-2 p-0 h-100" onClick={StarResetPurchase}>
              <Link className="btn-link d-block w-100 h-100"
              to="/"
               style={{ textDecoration: 'none', color: 'white' }}>
                Anular compra
              </Link>
            </button>
            <button className="col-3 btn btn-secondary m-2 p-0 h-100" onClick={startPostOrder}>
              <Link className="btn-link d-block w-100 h-100"
              to={{pathname: "/",state: { compra, productosSeleccionados }}}
               style={{ textDecoration: 'none', color: 'white' }}>
                Enviar
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


