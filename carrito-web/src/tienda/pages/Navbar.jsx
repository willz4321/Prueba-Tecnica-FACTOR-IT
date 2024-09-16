import { Link } from "react-router-dom"
import { CarritoDesplegable} from "./carrito";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { tipoProductoSelect } from "../../store/slices/Tienda/TiendaSlice";
import { usePurchaseStore } from "../../hooks";
import { Relog } from "../components/Relog";
import { cn } from "../../lib/utils"
import { 
  Toaster,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
 } from "../../components";



export const Navbar = () => {
    const {clienteCompra, isActive, startActiveCart} = usePurchaseStore();
    const menuRef = useRef(null);
    const dispatch = useDispatch()
    const productosLista = clienteCompra.listaProductos;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && isActive) {
        startActiveCart(); 
      }
    };
    document.addEventListener("mousedown", handleClickOutside); 

    return () => {
      document.removeEventListener("mousedown", handleClickOutside); 
    };
  }, [isActive]);

  const handleTipoProductoSelect = (tipo) => {
    dispatch(tipoProductoSelect(tipo));
  };

  return (
    <>
    <NavigationMenu className="w-full bg-light !max-w-none">
      <div className="container-fluid flex items-center justify-between">
        {/* Logo */}
        <Link href="/" passHref>
          <a>
            <img
              src="/assets/logo-tienda.png"
              alt="logo"
              style={{ width: "100px", height: "100px" }}
            />
          </a>
        </Link>

        {/* Menú */}
        <NavigationMenuList className="flex mx-auto mb-2 mb-lg-0">
          <NavigationMenuItem>
          <NavigationMenuTrigger>
          <Link to="/list" className="nav-link active text-navbar" onClick={() => handleTipoProductoSelect('PANTALONES')}>PANTALONES</Link>
          </NavigationMenuTrigger>
          </NavigationMenuItem>

          <NavigationMenuItem>
          <NavigationMenuTrigger>
          <Link to="/list" className="nav-link active text-navbar" onClick={() => handleTipoProductoSelect('CAMISAS')}>CAMISAS</Link>
          </NavigationMenuTrigger>
          </NavigationMenuItem>

          <NavigationMenuItem>
          <NavigationMenuTrigger>
          <Link to="/list" className="nav-link active text-navbar" onClick={() => handleTipoProductoSelect('ABRIGOS')}>ABRIGOS</Link>
          </NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>

        {/* Carrito y Cronómetro */}
        <div className="flex items-center">
          {/* Cronómetro */}
          <Relog />

          {/* Carrito */}
          <div
            onClick={() => startActiveCart()} style={{ paddingLeft: "15px" }}
            className="ml-4 cursor-pointer"
          >
             <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-cart"
              viewBox="0 0 16 16"
              style={{ transform: "translateX(-10px)", cursor: "pointer" }}
              name="carrito-logo"
            >
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
            </svg>
          </div>
        </div>
      </div>
    </NavigationMenu>
      {/* Menú desplegable del carrito */}
      {isActive && (
        <div className={`carrito-container ${isActive ? "active" : ""}`}>
          <div className="carrito-overlay" ref={menuRef}>
            <CarritoDesplegable />
            <div className="lista-carrito-derecha pt-5">
              {productosLista.length > 0 && (
                <>
                  {/* Botón "Ver Carrito" */}
                  <Link to="/listaCompra" className="btn btn btn-outline-light" onClick={startActiveCart}>
                    Ver Carrito
                  </Link>
                  {/* Botón "Finalizar Compra" */}
                  <Link to="/carrito" className="btn btn-outline-info" onClick={startActiveCart}>
                    Finalizar Compra
                  </Link>
                </>
              )}
            </div>
            {productosLista.length <= 0 && <h3 className="carrito-vacio">El carrito está vacío</h3>}
          </div>
        </div>
      )}
    </>
  );
}
