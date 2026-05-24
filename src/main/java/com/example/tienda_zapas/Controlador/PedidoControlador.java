package com.example.tienda_zapas.Controlador;

import com.example.tienda_zapas.entidad.Pedido;
import com.example.tienda_zapas.Repositorio.PedidoRepositorio;
import com.example.tienda_zapas.Repositorio.UsuarioRepositorio;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoControlador {

    @Autowired
    private PedidoRepositorio pedidoRepositorio;

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @PostMapping("/guardar")
    public ResponseEntity<?> guardarPedido(@RequestBody Map<String, Object> payload, HttpSession session) {
        try {
            
            String email = (String) payload.get("emailCliente");
            String direccion = (String) payload.get("direccionEntrega");
            
            Double total = Double.valueOf(payload.get("total").toString());
            
            System.out.println("Procesando pedido para: " + email);
            System.out.println("Total: " + total + "€");

            // Creamos el objeto Pedido para guardarlo en la base de datos
            Pedido pedido = new Pedido();
            pedido.setEmailCliente(email);
            pedido.setDireccionEntrega(direccion);
            pedido.setTotal(total);
            pedido.setFecha(LocalDateTime.now());
            pedido.setEstado("PAGADO");

            Integer usuarioId = (Integer) session.getAttribute("usuarioId");
            if (usuarioId != null) {
                usuarioRepositorio.findById(usuarioId).ifPresent(pedido::setUsuario);
            }

            pedidoRepositorio.save(pedido);

            System.out.println("Pedido guardado correctamente en base de datos.");

            return ResponseEntity.ok().body("Pedido guardado con éxito");

        } catch (Exception e) {
            System.out.println("Error al guardar el pedido: " + e.getMessage());
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}