package com.example.tienda_zapas.Controlador;

import com.example.tienda_zapas.entidad.Usuario;
import com.example.tienda_zapas.Repositorio.UsuarioRepositorio;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class UsuarioControlador {

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @GetMapping("/")
    public String index() {
        return "html/index";
    }

    @GetMapping("/bienvenida")
    public String paginaBienvenida(HttpSession session, Model model) {
        String usuario = (String) session.getAttribute("nombreUsuario");
        if (usuario == null) return "redirect:/login";
        model.addAttribute("nombreUsuario", usuario);
        return "html/bienvenida";
    }

    @GetMapping("/confirmacion")
    public String verConfirmacion(HttpSession session, Model model) {
        // Verificamos que el usuario esté logueado
        String nombreUsuario = (String) session.getAttribute("nombreUsuario");
        if (nombreUsuario == null) return "redirect:/login";

        Usuario u = usuarioRepositorio.findByUsuario(nombreUsuario);
        
        if (u != null) {
            model.addAttribute("nombreUsuario", u.getUsuario());
           
        }

        return "html/confirmacion";
    }

    @GetMapping("/login")
    public String mostrarLogin(@RequestParam(required = false) String error, Model model) {
        if (error != null) model.addAttribute("error", "Usuario o contraseña incorrectos");
        return "html/login";
    }

    @PostMapping("/login")
    public String procesarLogin(@RequestParam String username,
                                @RequestParam String password,
                                HttpSession session) {
        Usuario u = usuarioRepositorio.findByUsuario(username);
        if (u == null || !u.getContrasena().equals(password)) {
            return "redirect:/login?error";
        }
        session.setAttribute("nombreUsuario", u.getUsuario());
        session.setAttribute("usuarioId", u.getId());
        session.setAttribute("rol", u.getRol());
        if ("ADMIN".equals(u.getRol())) {
            return "redirect:/admin/dashboard"; 
        }
        return "redirect:/bienvenida";
    }

    @GetMapping("/logout")
    public String cerrarSesion(HttpSession session) {
        session.invalidate(); 
        return "redirect:/";
    }

    // --- MÉTODOS DE PERFIL ---

    @GetMapping("/perfil")
    public String verPerfil(HttpSession session, Model model) {
        String nombreUsuario = (String) session.getAttribute("nombreUsuario");
        if (nombreUsuario == null) return "redirect:/login";

        Usuario u = usuarioRepositorio.findByUsuario(nombreUsuario);
        if (u != null) {
            model.addAttribute("usuario", u);
            model.addAttribute("nombreUsuario", u.getUsuario());
            model.addAttribute("nombre", u.getNombre());
            model.addAttribute("apellido", u.getApellido());
            model.addAttribute("email", u.getEmail());
            return "html/perfil"; 
        }
        return "redirect:/login";
    }

    @PostMapping("/perfil/guardar")
    public String guardarCambiosPerfil(@RequestParam String nombre,
                                       @RequestParam String apellido,
                                       @RequestParam String email,
                                       @RequestParam(required = false) String password,
                                       HttpSession session) {
        
        String nombreUsuario = (String) session.getAttribute("nombreUsuario");
        if (nombreUsuario == null) return "redirect:/login";

        Usuario u = usuarioRepositorio.findByUsuario(nombreUsuario);

        if (u != null) {
            u.setNombre(nombre);
            u.setApellido(apellido);
            u.setEmail(email);
            
            // Si el usuario escribió una nueva contraseña, la actualizamos
            if (password != null && !password.isEmpty()) {
                u.setContrasena(password);
            }

            usuarioRepositorio.save(u);
        }

        return "redirect:/perfil?exito";
    }

    // --- MÉTODOS DE REGISTRO ---

    @GetMapping("/register")
    public String mostrarRegistro(Model model) {
        model.addAttribute("usuarioForm", new Usuario());
        return "html/register";
    }

    @PostMapping("/usuarios/registrar")
    public String guardarUsuario(@ModelAttribute("usuarioForm") Usuario usuario, HttpSession session) {
        if (usuario.getRol() == null) {
            usuario.setRol("CLIENTE");
        }
        usuarioRepositorio.save(usuario);
        session.setAttribute("nombreUsuario", usuario.getUsuario());
        session.setAttribute("usuarioId", usuario.getId());
        session.setAttribute("rol", usuario.getRol());
        return "redirect:/bienvenida";
    }
}