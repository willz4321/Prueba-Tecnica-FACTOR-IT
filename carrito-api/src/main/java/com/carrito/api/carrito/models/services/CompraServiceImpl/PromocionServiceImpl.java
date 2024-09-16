package com.carrito.api.carrito.models.services.CompraServiceImpl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.carrito.api.carrito.models.dao.ICompraDao.IPromocionesDao;
import com.carrito.api.carrito.models.entity.compra.Promociones;
import com.carrito.api.carrito.models.services.interfaces.IPromocionService;

@Service
public class PromocionServiceImpl implements IPromocionService{
  
    private final IPromocionesDao promocionesDao;

    public PromocionServiceImpl(IPromocionesDao promocionesDao) {
        this.promocionesDao = promocionesDao;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Promociones> findAll() {
         return (List<Promociones>) promocionesDao.findAll();
    }
    
    @Override
    @Transactional
    public Promociones save(Promociones promo) {
      return promocionesDao.save(promo);
    }
}
