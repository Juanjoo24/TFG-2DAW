package com.example.tienda_zapas.entidad;

import jakarta.persistence.*;

@Entity
@Table(name = "carrito_items")
public class CarritoItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private Double precio;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    // --- Constructores ---
    public CarritoItem() {}

    public CarritoItem(String nombre, Double precio, Usuario usuario) {
        this.nombre = nombre;
        this.precio = precio;
        this.usuario = usuario;
    }

    public Long getId() { 
        return id; 
    }

    public void setId(Long id) { 
        this.id = id; 
    }


    public String getNombre() { 
        return nombre; 
    }

    public void setNombre(String nombre) { 
        this.nombre = nombre; 
    }


    public Double getPrecio() { 
        return precio; 
    }

    public void setPrecio(Double precio) { 
        this.precio = precio; 
    }


    public Usuario getUsuario() { 
        return usuario; 
    }

    public void setUsuario(Usuario usuario) { 
        this.usuario = usuario; 
    }
}