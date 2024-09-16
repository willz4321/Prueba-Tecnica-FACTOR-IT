import { formatPriceWithCommas, usePurchaseStore } from '../../../hooks';
import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const CartList = () => {
  const {clienteCompra, StartRemoveItem} = usePurchaseStore()
  const productosSeleccionados = clienteCompra.listaProductos;
  const [redirectToTienda, setRedirectToTienda] = useState(false);

  const total = clienteCompra.total
  const totalCompra = clienteCompra.totalSinDescuento
  const cantidad = clienteCompra.numero_de_productos

   useEffect(() => {
    if (productosSeleccionados.length === 0) {
      setRedirectToTienda(true);
    }
  }, [productosSeleccionados]);

  if (redirectToTienda) {
    return <Navigate to="/" />;
  }

  const PromotionCurrent = () => {
    if (cantidad === 4) {
      return (
        <>
          <p className='col-8 p-2 text-secondary'>25% DE DESC. POR LLEVAR 4 PRODUCTOS</p>  
          <p className='col'>${formatPriceWithCommas((totalCompra * 0.25))}</p>
        </>
      );
    } else if (cantidad >= 10) {
      switch (clienteCompra.descuento) {
        case 'VIP':
          let menorValor = clienteCompra.listaProductos.reduce((min, producto) => 
            producto.precio < min.precio ? producto : min, clienteCompra.listaProductos[0]
          );
          return (
            <>
              <p className='col-12 p-2 text-secondary text-center'>DESCUENTO CLIENTE VIP</p>  
              <p className='col.-12 d-flex justify-end'>-${formatPriceWithCommas((menorValor.precio))}</p>
              <p className='col-12 d-flex justify-end'>-${formatPriceWithCommas((500))}</p>
            </>
          );

        case 'COMUN':
          return (
            <>
              <p className='col-8 p-2 text-secondary'>DESCUENTO POR MAYOR</p>  
              <p className='col'>-${formatPriceWithCommas((100))}</p>
            </>
          ); 
        case 'PROMOCION':  
          return (
            <>
              <p className='col-8 p-2 text-secondary'>DESCUENTO DIA DE PROMOCIÓN</p>  
              <p className='col'>-${formatPriceWithCommas((300))}</p>
            </>
          );
        default:
          break;
      }
    } else {
      return (
        <>
          <p className='col-8 p-2 text-secondary'>SIN PROMOCIÓN</p>  
          <p className='col'>-${formatPriceWithCommas(0)}</p>
        </>
      );
    }
  };
  
  return (
   
    <div >
      <h1 className="p-5 w-100 d-flex justify-content-center">Carrito</h1>
       <div className="row p-3 border-dark">
      <div className="col-8 list-group lista-carrito-izquierda ">
        {productosSeleccionados.map((producto) => (
          <div key={producto.nombre} className="list-group-item border-start-0 border-end-0">
            <div className="row align-items-center">
              <div className="col-md-2">
                <img src={producto.imagen} alt={producto.nombre} className="img-listBuys" />
              </div>
              <div className="col-md-4">
                <div>
                  <h6 className="d-flex">{`${producto.nombre} - ${producto.talle}`}</h6>
                </div>
              </div>
              <div className="col-md-2">
                <p>{producto.cantidad}</p>
              </div>
              <div className="col-md-2">
                <p>${formatPriceWithCommas(producto.precio * producto.cantidad)}</p>
              </div>
              <div className="col-md-1">
              <svg xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              onClick={() => StartRemoveItem(producto.id_producto, producto.talle)}
              className="eliminar-btn-list"
              >
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
            </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="col-3 m-1 p-1 " style={{ height: "100vh", position: "relative" }}>
      <div className="list-group-item align-items-end card border-dark w-100 position-sticky" style={{ top: '50px' }}>
          <ul className="list-group list-group-flush">
            <h4 className="list-group-item">Total del carrito</h4>
            <div className="row list-group-item d-flex align-items-center">
                  <p className='col-8 fs-4 text-secondary'>Subtotal</p>
                  <p className='col'>${formatPriceWithCommas(totalCompra)}</p>
            </div>
            <li className="list-group-item">
              <p className="fs-5 text-secondary">ENVIO</p>  
              <p className="text-secondary">Envio gratis</p>
            </li>
            <li className="row list-group-item d-flex align-items-center">
              <PromotionCurrent />
            </li>
            <li className="row list-group-item d-flex align-items-center">
              <p className='col-8 p-2 fs-4 text-secondary'>Total</p>  
              <p className='col '>${formatPriceWithCommas(total)}</p>
            </li>
          </ul>
              <div className="card-footer">
              
                <Link to="/carrito" style={{textDecoration: 'none', color:'white'}}>
                    <button type="button"  className="btn btn-dark w-100 ">
                     Finalizar compra
                    </button> 
                </Link>
         
              </div>
              </div>
          </div>
       </div>
      </div>
  );
};
