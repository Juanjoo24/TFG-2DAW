package com.example.tienda_zapas.Controlador;

import com.example.tienda_zapas.entidad.Pedido;
import com.example.tienda_zapas.Repositorio.PedidoRepositorio;
import com.example.tienda_zapas.Repositorio.UsuarioRepositorio;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoControlador {

    @Autowired
    private PedidoRepositorio pedidoRepositorio;

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @PostMapping("/guardar")
    @SuppressWarnings("unchecked") 
    public ResponseEntity<?> guardarPedido(@RequestBody Map<String, Object> payload, HttpSession session) {
        try {
            
            String email = (String) payload.get("emailCliente");
            String direccion = (String) payload.get("direccionEntrega");
            
            // Convertimos el total a double
            Double total = Double.valueOf(payload.get("total").toString());
            
            // Sacamos la lista de zapas del carrito
            List<Map<String, Object>> articulos = (List<Map<String, Object>>) payload.get("articulos");

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

            // Guardamos el pedido
            pedidoRepositorio.save(pedido);

            // Montamos la lista de productos para el texto del email
            StringBuilder detalles = new StringBuilder();
            detalles.append("Has comprado:\n");
            if (articulos != null) {
                for (Map<String, Object> art : articulos) {
                    detalles.append("- ").append(art.get("nombre")).append(" (").append(art.get("precio")).append("€)\n");
                }
            }

            // El bloque try-catch queda vacío de servicios de correo para que no envíe nada
            try {
                // Se elimina la llamada a emailService.enviarEmail
                System.out.println("Pedido procesado internamente (envío de email omitido).");
            } catch (Exception e) {
                System.out.println("el mail ha fallado pero el pedido se ha guardado: " + e.getMessage());
            }

            return ResponseEntity.ok().body("Pedido guardado con éxito");

        } catch (Exception e) {
            System.out.println("Error crítico en el controlador: " + e.getMessage());
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}