import { Navigate, Route, Routes } from "react-router-dom";
import {
  Navbar,
  ProductCategory,
  Footer,
  BuyDetails,
  ProductDetails,
  SendPurchase,
  CartList
} from "../pages";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Input
} from "../../components"
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { useProductStore, usePurchaseStore } from "../../hooks";
import moment from "moment";
import { Client } from "../pages/Client";

const WithNavbar = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

WithNavbar.propTypes = {
  children: PropTypes.node.isRequired,
};

export const TiendaRoutes = () => {
  const {productos, starGetProducts} = useProductStore();
  const {Compras, promociones, clienteCompra, clientes, starGetPurchase, starGetPromos, startSaveDiscount, starGetCLients} = usePurchaseStore()
  const [dni, setDni] = useState('')
  const [showPromo, setShowPromo] = useState('')
  useEffect(() => {
    if (productos.length == 0) {starGetProducts()}
    if (Compras.length == 0) {starGetPurchase()} 
    if (promociones.length == 0) {starGetPromos()} 
    if (clientes.length ==0) {starGetCLients()}
  }, [])
  
   useEffect(() => {
    const fechaActual = moment().startOf('day');
    if (promociones.length !== 0 && clienteCompra.descuento == 'COMUN') {
      const promocion = promociones.find(pr => {
        const fechaPromocion = moment(pr.fecha);
        return fechaPromocion.isSame(fechaActual, 'day');
      });
    
      if (promocion) {
        setShowPromo('PROMO')
      } else {
        setShowPromo('VIP')
      }
    }else{
      setShowPromo('VIP')
    }
   }, [promociones])
   
   const handlePromo = async(resp) => {
       if (resp === 'PROMO') {
         setShowPromo('')
         await startSaveDiscount('PROMO', dni)
       } else if (resp === 'VIP') {
         setShowPromo('')
         await startSaveDiscount('VIP', dni)
       }else{
         setShowPromo('')
       }
     
       if (showPromo === 'cancelar' || showPromo === 'PROMO') {        
         setTimeout(() => {
           setShowPromo('VIP');
         }, 3000);
       }
   }

  return (
    <article>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"></link>
      <Routes>
        {/* Rutas con Navbar */}
        <Route path="/" element={<WithNavbar><ProductCategory /></WithNavbar>} />
        <Route path="carrito" element={<WithNavbar><SendPurchase /></WithNavbar>} />
        <Route path="details" element={<WithNavbar><BuyDetails /></WithNavbar>} />
        <Route path="producto/:id" element={<WithNavbar><ProductDetails /></WithNavbar>} />

        <Route path="listaCompra" element={<WithNavbar><CartList /></WithNavbar>} />
        <Route path="clientes" element={<WithNavbar><Client /></WithNavbar>} />

        {/* Redirección para rutas no encontradas */}
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>

      <AlertDialog open={showPromo == 'PROMO' ? true : false} onOpenChange={() => setShowPromo('')}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¡Promoción Especial!</AlertDialogTitle>
              <AlertDialogDescription>
                ¡Tienes una promoción especial para hoy! Aprovecha el descuento de $300 en el total de tu cuenta.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button variant='outline' onClick={() => handlePromo('PROMO')}>Aceptar</Button>
              <Button variant='destructive' onClick={() => handlePromo('cancelar')}>Rechazar</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showPromo == 'VIP' ? true : false} onOpenChange={() => setShowPromo('')}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Ya compraste anteriormente?</AlertDialogTitle>
              <AlertDialogDescription>
                <section className="d-flex items-center">
                  <strong className="w-[35%]">Ingresa tu DNI:</strong>
                  <Input 
                  type="number" 
                  placeholder="Documento" 
                  className='w-[65%] no-arrows'
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                />
                </section>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>

              <Button variant='outline' onClick={() => handlePromo('VIP')}>Verificar</Button>
              <Button variant='destructive' onClick={() => handlePromo('cancelarVIP')}>Rechazar</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </article>
  );
};
