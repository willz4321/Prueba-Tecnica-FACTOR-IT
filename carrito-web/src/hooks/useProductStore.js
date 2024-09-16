
import { productosApi } from '../api'
import { useDispatch, useSelector } from 'react-redux';
import { setDetailsProduct, setProductList } from '../store';

export const useProductStore = () => {
  const { productos, tipoProducto } = useSelector(state => state.Tienda);  
  const dispatch = useDispatch();

  const starGetProducts = async () => {
   try {
      const response = await productosApi.get()
      dispatch(setProductList(response.data));
    } catch (error) {
      console.error('Error al obtener los productos:', error.data);
    }
  }


  return {
    //funciones
    starGetProducts,

    //Atributos
    productos,
    tipoProducto
  };
};