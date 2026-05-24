package com.example.tienda_zapas.Controlador;

import com.example.tienda_zapas.entidad.Provedor;
import com.example.tienda_zapas.entidad.Producto;
import com.example.tienda_zapas.entidad.Usuario;
import com.example.tienda_zapas.entidad.Pedido;

import com.example.tienda_zapas.Repositorio.ProvedorRepositorio;
import com.example.tienda_zapas.Repositorio.UsuarioRepositorio;
import com.example.tienda_zapas.Repositorio.ProductoRepositorio;
import com.example.tienda_zapas.Repositorio.PedidoRepositorio;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Controller
@RequestMapping("/admin")
public class AdminControlador {

    @Autowired
    private ProvedorRepositorio provedorRepo;

    @Autowired
    private UsuarioRepositorio usuarioRepo;

    @Autowired
    private ProductoRepositorio productoRepo;

    @Autowired
    private PedidoRepositorio pedidoRepo; 

    @GetMapping("/dashboard")
    public String verDashboard(HttpSession session, Model model) {
        String rol = (String) session.getAttribute("rol"); 
        if (rol == null || !rol.equals("ADMIN")) {
            return "redirect:/login";
        }

        // Pasamos los datos a la vista para mostrar las tablas
        
        model.addAttribute("proveedores", provedorRepo.findAll());
        model.addAttribute("usuarios", usuarioRepo.findAll());
        model.addAttribute("productos", productoRepo.findAll());
        model.addAttribute("pedidos", pedidoRepo.findAll()); 
        model.addAttribute("nuevoProvedor", new Provedor());
        model.addAttribute("nuevoProducto", new Producto());
        
        return "html/admin_dashboard";
    }

    // GESTIÓN PROVEEDORES
    
    @PostMapping("/provedor/guardar")
    public String guardarProvedor(@ModelAttribute Provedor provedor) {
        provedorRepo.save(provedor); 
        return "redirect:/admin/dashboard";
    }

    @PostMapping("/provedor/editar")
    public String editarProvedor(@RequestParam("id") Integer id, 
                                 @RequestParam("nombre") String nombre,
                                 @RequestParam("contacto") String contacto,
                                 @RequestParam("telefono") String telefono) {
        Optional<Provedor> provOpt = provedorRepo.findById(id);
        if (provOpt.isPresent()) {
            Provedor p = provOpt.get();
            p.setNombre(nombre);
            p.setTelefono(telefono);
            provedorRepo.save(p);
        }
        return "redirect:/admin/dashboard";
    }

    @GetMapping("/provedor/eliminar/{id}")
    public String eliminarProvedor(@PathVariable Integer id) {
        provedorRepo.deleteById(id);
        return "redirect:/admin/dashboard";
    }

    // GESTIÓN PRODUCTOS
    
    @PostMapping("/producto/guardar")
    public String guardarProducto(@ModelAttribute Producto producto) {
        productoRepo.save(producto);
        return "redirect:/admin/dashboard";
    }

    @PostMapping("/producto/editar")
    public String editarProducto(@RequestParam("id") Integer id,
                                 @RequestParam("nombre") String nombre,
                                 @RequestParam("marca") String marca,
                                 @RequestParam("precio") Double precio,
                                 @RequestParam("stock") Integer stock) {
        Optional<Producto> prodOpt = productoRepo.findById(id);
        if (prodOpt.isPresent()) {
            Producto p = prodOpt.get();
            p.setNombre(nombre);
            p.setMarca(marca);
            p.setPrecio(precio);
            productoRepo.save(p);
        }
        return "redirect:/admin/dashboard";
    }

    @GetMapping("/producto/eliminar/{id}")
    public String eliminarProducto(@PathVariable Integer id) {
        productoRepo.deleteById(id);
        return "redirect:/admin/dashboard";
    }
    
    // GESTIÓN USUARIOS 
    
    @PostMapping("/usuario/editar")
    public String editarUsuario(@RequestParam("id") Integer id,
                                @RequestParam("nombre") String nombre,
                                @RequestParam("apellido") String apellido,
                                @RequestParam("email") String email,
                                @RequestParam("password") String password, 
                                @RequestParam("rol") String rol) {
        Optional<Usuario> userOpt = usuarioRepo.findById(id);
        if (userOpt.isPresent()) {
            Usuario u = userOpt.get();
            u.setNombre(nombre);
            u.setApellido(apellido); 
            u.setEmail(email);
            u.setContrasena(password); 
            u.setRol(rol);
            
            usuarioRepo.save(u);
        }
        return "redirect:/admin/dashboard";
    }
    
    @GetMapping("/usuario/eliminar/{id}")
    public String eliminarUsuario(@PathVariable Integer id) {
        usuarioRepo.deleteById(id);
        return "redirect:/admin/dashboard";
    }

    // GESTIÓN COMPRAS

    @PostMapping("/compra/editar")
    public String editarCompra(@RequestParam("id") Integer id,
                               @RequestParam("direccion") String direccion,
                               @RequestParam("estado") String estado) {
        Optional<Pedido> compraOpt = pedidoRepo.findById(id);
        if (compraOpt.isPresent()) {
            Pedido c = compraOpt.get();
            c.setDireccionEntrega(direccion);
            c.setEstado(estado); 
            pedidoRepo.save(c);
        }
        return "redirect:/admin/dashboard";
    }

    @GetMapping("/compra/eliminar/{id}")
    public String eliminarCompra(@PathVariable Integer id) {
        pedidoRepo.deleteById(id);
        return "redirect:/admin/dashboard";
    }
}