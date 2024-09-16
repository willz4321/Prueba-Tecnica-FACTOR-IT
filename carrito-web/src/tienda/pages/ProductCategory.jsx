import { Link } from "react-router-dom";
import { formatPriceWithCommas, useProductStore } from "../../hooks";
import { useState } from "react";


export const ProductCategory = () => {
  const {productos, tipoProducto} = useProductStore();

  return (
    <>
      <div className="col-lg-8">
        <div className="padding-title">
          <h1 style={{ fontSize: '4rem' }}>
            {tipoProducto}
          </h1>
        </div>
      </div>

      <div>
      <ul className="product-list">
          { tipoProducto != '' ? (productos
            .filter((producto) => producto.tipo == tipoProducto)
            .map((producto) => (
              <li className="product-item mt-2" key={producto.id}>
                <div className="col d-flex flex-column align-items-start">
                  <Link to={`/producto/${producto.id}`}> {/* Pasar el ID del producto como parámetro de la URL */}
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="img-new"
                    />
                  </Link>
                  <div >
                    <h5 className="text-start">{producto.nombre}</h5>
                    <h6 className="text-start text-secondary">${formatPriceWithCommas(producto.precio)}</h6>
                  </div>
                </div>
              </li>
            ))) : 
            (productos
              .map((producto) => (
                <li className="product-item mt-2" key={producto.id}>
                  <div className="col d-flex flex-column align-items-start">
                    <Link to={`/producto/${producto.id}`}> {/* Pasar el ID del producto como parámetro de la URL */}
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="img-new"
                      />
                    </Link>
                    <div >
                      <h5 className="text-start">{producto.nombre}</h5>
                      <h6 className="text-start text-secondary">${formatPriceWithCommas(producto.precio)}</h6>
                    </div>
                  </div>
                </li>
              )))
            }
        </ul>
      </div>



    </>
  );
}
