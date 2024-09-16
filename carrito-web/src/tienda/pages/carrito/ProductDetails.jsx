import { useEffect, useState } from 'react';
import {  useParams } from 'react-router-dom';
import { formatPriceWithCommas, useProductStore, usePurchaseStore } from '../../../hooks';
import { Navigate } from "react-router-dom";
export const ProductDetails = () => {
  const {productos} = useProductStore();
  const {startAddProduct, startActiveCart} = usePurchaseStore();
  const { id } = useParams();
  const productoSeleccionado = productos?.find((producto) => producto.id === Number(id))
  const [redirectToTienda, setRedirectToTienda] = useState(false);

  const [detallesProducto, setDetallesProductos] = useState({
     cantidad: 1,
     talle: '',

  })

  const updateDetailsProduct = (campo, valor) => {
    setDetallesProductos((prevDetalles) => ({
      ...prevDetalles,
      [campo]: valor,
    }));
  };


  const handleCantidadChange = (action) => {
    const nuevoValor = detallesProducto.cantidad;
    if (action === 'incrementar') {
      updateDetailsProduct('cantidad', nuevoValor +1)
    } else if (action === 'reducir' && detallesProducto.cantidad > 1) {
      updateDetailsProduct('cantidad', nuevoValor -1)
    }
  };

  useEffect(() => {
    if (!productoSeleccionado) {
      setRedirectToTienda(true);
    }
  }, [productoSeleccionado]);

  if (redirectToTienda) {
    return <Navigate to="/" />;
  }

  return (
    <>
    <div className="container">
      <div className="row">
        <div className="col-md-7 img-prod">
          <img src={productoSeleccionado?.imagen} alt={productoSeleccionado?.nombre} className="img-fluid w-100 h-100" />
        </div>
        <div className="col-md-4 d-flex flex-column ms-5 mt-5 position-sticky" style={{margin: '0px',  position: "relative", top: '40px'}}>
          <h1>{productoSeleccionado?.nombre}</h1>
          <h4 className='text-secondary'>${formatPriceWithCommas(productoSeleccionado?.precio || 0 )}</h4>
          <ul className='mt-4'>        
              <li className='text-secondary mt-1' key={productoSeleccionado?.descripcion}>{productoSeleccionado?.descripcion}</li>
          </ul>

          <div className='text-secondary mt-2'>
            <h4 className="d-inline">Talle: </h4>
            <h5 className="d-inline">{detallesProducto.talle}</h5>
          </div>

          <ul className='ps-0'>
              {productoSeleccionado?.talles.map((talleP, index) => (
                <div key={index} className="btn-group mt-4 " role="group" aria-label="Basic radio toggle button group" style={{ marginLeft: '15px' }}>
                  <input
                    type="radio"
                    className="btn-check"
                    name="options-base"
                    id={`option${index + 4}`}
                    autoComplete="off"
                    checked={detallesProducto.talle === talleP}
                    onChange={() => updateDetailsProduct('talle',talleP)}
                  />
                  <label className={`btn ${detallesProducto.talle === talleP ? ' selected-talle' : 'btn-outline-secondary'}`} htmlFor={`option${index + 4}`}>
                    {talleP}
                  </label>
                </div>
              ))}
          </ul>

          <div className="d-flex align-items-center">
            <div className="quantity d-flex align-items-center">
              <span onClick={() => handleCantidadChange('reducir')} style={{ cursor: 'pointer' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </span>
              <input
                type="number"
                id="quantity_64bae375bb7b4"
                className="input-text qty text no-arrows"
                name="quantity"
                value={detallesProducto.cantidad}
                aria-label="Cantidad de productos"
                size="4"
                min="1"
                max="3"
                step="1"
                placeholder=""
                inputMode="numeric"
                autoComplete="off"
                readOnly
              />
              <span onClick={() => handleCantidadChange('incrementar')} style={{ cursor: 'pointer' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </span>
            </div>

            <div className='p-4 vw-100'>
            <button type="button" className="btn btn-dark w-100" style={{height: '50px'}} 
               onClick={() => {startAddProduct(productoSeleccionado, detallesProducto); setDetallesProductos({cantidad: 1, talle: ''}); startActiveCart()}}
               disabled={!detallesProducto.talle}>Añadir al carrito</button>
            </div>        
          </div>
        </div>
      </div>
    </div>
    </>  
  );
};
