package com.example.tienda_zapas.Repositorio;

import com.example.tienda_zapas.entidad.CarritoItem;
import com.example.tienda_zapas.entidad.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import jakarta.transaction.Transactional;
import java.util.List;

@Repository
public interface CarritoItemRepositorio extends JpaRepository<CarritoItem, Long> {
    List<CarritoItem> findByUsuario(Usuario usuario);
    
    @Transactional
    void deleteByUsuario(Usuario usuario);
}