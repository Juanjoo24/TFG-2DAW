package com.example.tienda_zapas.Controlador;

import com.example.tienda_zapas.entidad.CarritoItem;
import com.example.tienda_zapas.entidad.Usuario;
import com.example.tienda_zapas.Repositorio.CarritoItemRepositorio;
import com.example.tienda_zapas.Repositorio.UsuarioRepositorio;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/carrito")
public class CarritoApiController {

    @Autowired
    private CarritoItemRepositorio carritoItemRepositorio;

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @GetMapping
    public ResponseEntity<?> obtenerCarrito(HttpSession session) {
        String username = (String) session.getAttribute("nombreUsuario");
        if (username == null) return ResponseEntity.status(401).body("No logueado");

        Usuario u = usuarioRepositorio.findByUsuario(username);
        List<CarritoItem> items = carritoItemRepositorio.findByUsuario(u);
        return ResponseEntity.ok(items);
    }

    @PostMapping("/add")
    public ResponseEntity<?> añadirAlCarrito(@RequestBody Map<String, Object> payload, HttpSession session) {
        String username = (String) session.getAttribute("nombreUsuario");
        if (username == null) return ResponseEntity.status(401).body("No logueado");

        Usuario u = usuarioRepositorio.findByUsuario(username);
        String nombre = (String) payload.get("nombre");
        Double precio = Double.parseDouble(payload.get("precio").toString());

        CarritoItem nuevoItem = new CarritoItem(nombre, precio, u);
        carritoItemRepositorio.save(nuevoItem);

        // Devolvemos el tamaño actual del carrito para actualizar el contador en JS
        long size = carritoItemRepositorio.findByUsuario(u).size();
        return ResponseEntity.ok(Map.of("success", true, "carritoSize", size));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarItem(@PathVariable Long id, HttpSession session) {
        String username = (String) session.getAttribute("nombreUsuario");
        if (username == null) return ResponseEntity.status(401).body("No logueado");

        carritoItemRepositorio.deleteById(id);
        return ResponseEntity.ok(Map.of("success", true));
    }
    
    @DeleteMapping("/vaciar")
    public ResponseEntity<?> vaciarCarrito(HttpSession session) {
        String username = (String) session.getAttribute("nombreUsuario");
        if (username == null) return ResponseEntity.status(401).body("No logueado");

        Usuario u = usuarioRepositorio.findByUsuario(username);
        // Borramos todos los items asociados al usuario
        carritoItemRepositorio.deleteByUsuario(u);
        
        return ResponseEntity.ok(Map.of("success", true));
    }
}