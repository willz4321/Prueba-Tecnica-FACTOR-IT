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
  Button,
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
    <NavigationMenu className="w-full bg-light !max-w-none p-3">
      <div className="container-fluid flex items-center justify-between">
        {/* Logo */}
        <Link to="/clientes" passHref>
       <Button className="flex items-center" variant="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            width="30"
            viewBox="0 0 640 512"
          >
            <path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z"/>
          </svg>
        </Button>
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
