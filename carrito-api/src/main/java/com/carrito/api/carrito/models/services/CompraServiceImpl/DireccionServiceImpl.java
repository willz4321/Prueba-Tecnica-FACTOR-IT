package com.carrito.api.carrito.models.services.CompraServiceImpl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.carrito.api.carrito.models.dao.ICompraDao.IDireccionDao;
import com.carrito.api.carrito.models.entity.compra.Direccion;
import com.carrito.api.carrito.models.services.interfaces.IDireccionService;

@Service
public class DireccionServiceImpl implements IDireccionService {

    private final IDireccionDao direccionDao;

    public DireccionServiceImpl(IDireccionDao direccionDao) {
        this.direccionDao = direccionDao;
    }


    @Override
    @Transactional(readOnly = true)
    public List<Direccion> findAll() {
        return (List<Direccion>) direccionDao.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Direccion findById(Long id) {
       return direccionDao.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public Direccion save(Direccion dir) {
        return direccionDao.save(dir);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        direccionDao.deleteById(id);

    }
}
