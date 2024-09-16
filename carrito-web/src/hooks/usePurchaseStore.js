import { useEffect, useState } from 'react';
import { compraApi, clienteApi, promocionesApi } from '../api';
import { useDispatch, useSelector } from 'react-redux';
import { removeItemFromBuys, resetPurchase, saveDiscount, setActivecartFalse, setActivecartTrue, setBuysList, setClienteBuy, setDetailsBuys, setItemBuys, setPromoList, setRelogUpdate } from '../store';
import { useToast } from './use-toast';
import { ToastAction } from '../components';

export const usePurchaseStore = () => {
  const { Compras, clienteCompra, isActive, promociones } = useSelector(state => state.Tienda);  
  const [redirectToDetails, setRedirectToDetails] = useState(false);
  const { toast } = useToast()
  const dispatch = useDispatch();

  const starGetPurchase = async () => {
    try {
      const response = await compraApi.get();
      dispatch(setBuysList(response.data)); 
    
    } catch (error) {
      console.error('Error al obtener Compras:', error.data);
    }
  };

  const starGetClient = async (dni) => {
      try {
        const response = await clienteApi.get(`/${dni}`)
        dispatch(setClienteBuy(response.data))
        if (response.data.tipo == 'VIP') {
          toast({
            title: "VIP",
            description: "Eres usuario vip tienes un descuento!",
            action: (
              <ToastAction altText="ok">OK</ToastAction>
            ),
          })
        }
      } catch (error) {
        console.error(error)
      }
  }
  
  const starGetPromos = async () => {
    try {
      const response = await promocionesApi.get();
      dispatch(setPromoList(response.data)); 
    
    } catch (error) {
      console.error('Error al obtener promociones:', error.data);
    }
  }
  const startPostOrder = async () => {
    const {relog, ...compra} = clienteCompra;
    try {
      await compraApi.post('', compra);
      toast({
        title: "COMPRA REALIZADA",
        description: "Su pedido fue procesado con exito!",
        action: (
          <ToastAction altText="ok">OK</ToastAction>
        ),
      })
      dispatch(resetPurchase());
    } catch (error) {
      console.error('Error al realizar compra:', error.response.data);
      toast({
        title: "ERROR",
        description: `No se pudo procesar la compra Error: ${error.response.data}`,
        action: (
          <ToastAction altText="ok">OK</ToastAction>
        ),
      })
    }
  };
  
  const StarResetPurchase = () => {
    dispatch(resetPurchase());
    toast({
      title: "PERFECTO",
      description: `Carrito eliminado`,
      action: (
        <ToastAction altText="ok">OK</ToastAction>
      ),
    })
  };
  const actualizarCompra = async (id, datosCompra) => {
    try {
      await compraApi.put(`/${id}`, datosCompra);
     
      fetchCompra();
    } catch (error) {
      console.error('Error al actualizar compra:', error);
    }
  };

  // Función para eliminar un producto
  const eliminarCompra = async (id) => {
    try {
      await compraApi.delete(`/${id}`);
      // Actualizar la lista de productos después de eliminar uno
      fetchCompra();
    } catch (error) {
      console.error('Error al eliminar la compra:', error);
    }
  };

  const startAddProduct = (productoSeleccionado, detallesProducto) => {
    const {talles, id, ...rest} = productoSeleccionado
    const productoParaCarrito = {
      ...rest, 
      id_producto : productoSeleccionado.id,
      ...detallesProducto
     }
      
    dispatch(setItemBuys(productoParaCarrito));

  };

  const startActiveCart =() => {
    if (!isActive) {
       dispatch(setActivecartTrue())
    }else{
      dispatch(setActivecartFalse())
    }
  }

  const startSaveDateBuy = async (e, formData) => {
    e.preventDefault();
    dispatch(setDetailsBuys(formData));
    setRedirectToDetails(true)
  }
 
  const startSaveDiscount = async (tipo, dni) => {
    try {
      if (tipo === 'PROMO') {
        dispatch(saveDiscount('PROMOCION'))
        toast({
          title: "PERFECTO",
          description: `Se agrego la promo de $300 al carrito`,
          action: (
            <ToastAction altText="ok">OK</ToastAction>
          ),
        })
      }else if (tipo === 'VIP') {
        const response = await clienteApi.get(`/${dni}`)
        dispatch(setClienteBuy(response.data))
        if (response.data.tipo == 'VIP') {
          dispatch(saveDiscount('VIP'))
          toast({
            title: "VIP",
            description: "Eres usuario vip tienes un descuento al llevar 10 productos o mas!",
            action: (
              <ToastAction altText="ok">OK</ToastAction>
            ),
          })
        } else{
          toast({
            title: "INFO!",
            description: "Si tienes un total de compras mayor a $10.000 seras cliente VIP en la proxima compra",
            action: (
              <ToastAction altText="ok">OK</ToastAction>
            ),
          })
        }
      }
       
    } catch (error) {
      toast({
        title: "INFO!",
        description: "Si tienes un total de compras mayor a $10.000 seras cliente VIP en la proxima compra",
        action: (
          <ToastAction altText="ok">OK</ToastAction>
        ),
      })
    }
  }

  const StartRemoveItem = async (id_producto, talle) => {
     try {
      dispatch(removeItemFromBuys({ id_producto, talle }));
     } catch (error) {
      
     }
  }

  return {
    //Funciones
    starGetPromos,
    starGetClient,
    startPostOrder,
    eliminarCompra,
    StartRemoveItem,
    starGetPurchase,
    startActiveCart,
    startAddProduct,
    startSaveDateBuy,
    actualizarCompra,
    startSaveDiscount,
    StarResetPurchase,

    //Atributos
    Compras,
    isActive,
    promociones,
    clienteCompra,
    redirectToDetails
  };
};
