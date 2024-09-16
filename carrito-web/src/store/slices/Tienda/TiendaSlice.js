import { createSlice } from '@reduxjs/toolkit';

export const TiendaSlice = createSlice({
  name: 'Tienda',
  initialState: {
    productos: [],
    promociones: [],
    clienteCompra: {
      totalSinDescuento: 0,
      total: 0,
      numero_de_productos: 0,
      descuento: 'COMUN',
      fecha: new Date().getTime(),  
      listaProductos: [],
      datosCompra: {},
      cliente: {} 
    },
    Compras: [],
    tipoProducto: '',
    isActive : false,
  },
  reducers: {
    setActivecartTrue: (state) => {
      state.isActive = true
    },
    setActivecartFalse: (state) => {
      state.isActive = false
    },
    setBuysList: (state, {payload}) => {
        state.Compras = payload
    }, 
    tipoProductoSelect: (state, action) => {
        state.tipoProducto =action.payload;
     },
    setDetailsBuys: (state, action) => {
      const {nombre, apellido, dni, telefono, email, ...rest} = action.payload;
      state.clienteCompra.datosCompra = rest;
      state.clienteCompra.cliente= {nombre, apellido, dni};
      state.clienteCompra ={...state.clienteCompra, telefono, email}
    },
    setProductList: (state, {payload}) => {
      state.productos = payload;
    },
    setItemBuys: (state, action) => {
      const { id_producto, talle, cantidad, precio } = action.payload; 
      const existingProduct = state.clienteCompra.listaProductos.find(
        (producto) => producto.id_producto === id_producto && producto.talle === talle
      );
    
      if (existingProduct) {
        existingProduct.cantidad += cantidad;
      } else {
        state.clienteCompra.listaProductos.push(action.payload);
      }
    
      state.clienteCompra.totalSinDescuento += cantidad * precio; 
      state.clienteCompra.numero_de_productos += cantidad;
    
      // Condición para 4 productos
      if (state.clienteCompra.numero_de_productos === 4) {
        state.clienteCompra.total = state.clienteCompra.totalSinDescuento * 0.75;
      } 
      // Condición para 10 o más productos
      else if (state.clienteCompra.numero_de_productos >= 10) {
        switch (state.clienteCompra.descuento) {
          case 'VIP':
            let menorValor = state.clienteCompra.listaProductos.reduce((min, producto) => 
              producto.precio < min.precio ? producto : min, state.clienteCompra.listaProductos[0]
            );
            
            state.clienteCompra.total = state.clienteCompra.totalSinDescuento - 500 - menorValor.precio;
            break;
          case 'COMUN':
            state.clienteCompra.total = state.clienteCompra.totalSinDescuento - 100;
            break; 
          case 'PROMOCION':
            state.clienteCompra.total = state.clienteCompra.totalSinDescuento - 300;
            break;  
          default:
            break;
        }
      } 
      // Caso por defecto si no hay descuentos aplicables
      else {
        state.clienteCompra.total += (cantidad * precio);
      }
    
      // Verifica o establece el relog
      if (!state.clienteCompra.relog || state.clienteCompra.relog == null) {
        state.clienteCompra.relog = Date.now() + 1 * 60 * 10000; // 10 minutos
      }
    },           
    removeItemFromBuys: (state, action) => {
      const { id_producto, talle } = action.payload;
    
      const productosEliminados = state.clienteCompra.listaProductos.filter((producto) => {
        const isDifferentProduct = producto.id_producto !== id_producto || producto.talle !== talle;
    
        if (!isDifferentProduct) {
          // Restamos la cantidad y el precio del producto eliminado del totalSinDescuento
          state.clienteCompra.numero_de_productos -= producto.cantidad;
          state.clienteCompra.totalSinDescuento -= producto.cantidad * producto.precio;
        }
    
        return isDifferentProduct;
      });
    
      state.clienteCompra.listaProductos = productosEliminados;
    
      // Volvemos a aplicar la lógica de promociones, similar a setItemBuys
      if (state.clienteCompra.numero_de_productos === 4) {
        state.clienteCompra.total = state.clienteCompra.totalSinDescuento * 0.75;
      } else if (state.clienteCompra.numero_de_productos >= 10) {
        switch (state.clienteCompra.descuento) {
          case 'VIP':
            let menorValor = state.clienteCompra.listaProductos.reduce((min, producto) => 
              producto.precio < min.precio ? producto : min, state.clienteCompra.listaProductos[0]
            );
            state.clienteCompra.total = state.clienteCompra.totalSinDescuento - 500 - menorValor.precio;
            break;
          case 'COMUN':
            state.clienteCompra.total = state.clienteCompra.totalSinDescuento - 100;
            break;
          case 'PROMOCION':
            state.clienteCompra.total = state.clienteCompra.totalSinDescuento - 300;
            break;
          default:
            break;
        }
      } else {
        // Si no hay promociones aplicables, restablecemos el total sin descuentos
        state.clienteCompra.total = state.clienteCompra.totalSinDescuento;
      }

            if (state.clienteCompra.numero_de_productos === 0) {
              state.clienteCompra.relog = null; 
            }
    },
    
    
    resetPurchase: (state) => {
      state.clienteCompra = {
        totalSinDescuento: 0,
        total: 0,
        numero_de_productos: 0,
        fecha: new Date().getTime(),  
        listaProductos: [],
        datosCompra: {},
        cliente: {} 
      }
    },
    setRelogUpdate: (state, {payload}) => {
      if (payload != 0) {
        state.clienteCompra.relog = payload
      } else {
        state.clienteCompra.relog = null
        state.clienteCompra.listaProductos = []
      }
    },
    setClienteBuy: (state, {payload}) => {
      state.clienteCompra.cliente = payload;
    },
    setPromoList: (state, {payload}) => {
      state.promociones = payload;
    },
    saveDiscount: (state, {payload}) => {
      state.clienteCompra.descuento = payload;
    }
  },
});

export const {
  setBuysList,
  setItemBuys,
  setPromoList,
  startLoading, 
  saveDiscount,
  setClienteBuy,
  resetPurchase,
  setProductList,
  setRelogUpdate,
  setDetailsBuys,
  setActivecartTrue,
  setActivecartFalse,
  removeItemFromBuys,
  tipoProductoSelect,
} = TiendaSlice.actions;
