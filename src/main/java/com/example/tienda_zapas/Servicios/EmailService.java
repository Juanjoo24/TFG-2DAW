package com.example.tienda_zapas.Servicios;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarEmail(String aQuien, String total, String detallesPedido) {
        String destinatario = (aQuien != null) ? aQuien : "";
        String listaProductos = (detallesPedido != null) ? detallesPedido : "Detalles no disponibles";
        String precioTotal = (total != null) ? total : "0.00";

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom("tienda@zapajuan.com");
        msg.setTo(destinatario); 
        msg.setSubject("¡Pedido Confirmado en ZapaJuan!");
        
        String contenido = "¡Hola! Gracias por comprar en nuestra tienda.\n\n" +
                           "Has comprado:\n" + listaProductos + "\n" +
                           "Total pagado: " + precioTotal + "€\n\n" +
                           "¡Esperamos que las disfrutes!";
        
        msg.setText(contenido);
        
        System.out.println("Enviando correo a " + destinatario + "...");
        
        mailSender.send(msg);
        
        System.out.println("¡Correo enviado con éxito a Mailtrap!");
    }
}