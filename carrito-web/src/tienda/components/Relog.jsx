import {useState, useEffect} from 'react'
import { usePurchaseStore } from '../../hooks';
import { setRelogUpdate } from '../../store';
import { useDispatch } from 'react-redux';
import { ToastAction } from '@radix-ui/react-toast';
import { useToast } from '../../hooks';

export const Relog = () => {
    const { clienteCompra } = usePurchaseStore();
    const relog = clienteCompra.relog;
    const [timeLeft, setTimeLeft] = useState(0); 
    const { toast } = useToast()
    const dispatch = useDispatch();


    useEffect(() => {
      if (relog && relog > 0) {
        const interval = setInterval(() => {
          const currentTime = Date.now();
          const newTimeLeft = relog - currentTime;
          if (newTimeLeft > 0) {
            setTimeLeft(newTimeLeft);
          } else {
            setTimeLeft(0);
            clearInterval(interval); 
            dispatch(setRelogUpdate(0)); 
            toast({
                title: "EL CARRITO SE LIMPIO",
                description: "Si no procesas el pedido tu carrito se eliminara",
                action: (
                  <ToastAction altText="ok">OK</ToastAction>
                ),
              })
          }
        }, 1000);
  
        return () => clearInterval(interval);
      } else {
        setTimeLeft(0)
      }
    }, [relog, dispatch]);

    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
      };
    return (
        <>
            {timeLeft > 0 && (
            <div className="navbar-text me-3">
                Tiempo restante: {formatTime(timeLeft)}
            </div>
            )}
        </>
    );
  };
  