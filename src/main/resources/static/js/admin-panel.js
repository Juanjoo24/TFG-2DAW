$(document).ready(function() {
    $('#tablaCompras').DataTable();
    $('#tablaUsuarios').DataTable();
    $('#tablaProveedores').DataTable();
    $('#tablaZapatillas').DataTable();
});

function abrirEditarCompra(btn) {
    document.getElementById('edit-compra-id').value = btn.getAttribute('data-id');
    document.getElementById('edit-compra-direccion').value = btn.getAttribute('data-direccion');
    document.getElementById('edit-compra-estado').value = btn.getAttribute('data-estado');
    new bootstrap.Modal(document.getElementById('modalEditarCompra')).show();
}

function abrirEditarUsuario(btn) {
    document.getElementById('edit-user-id').value = btn.getAttribute('data-id');
    document.getElementById('edit-user-nombre').value = btn.getAttribute('data-nombre');
    document.getElementById('edit-user-apellido').value = btn.getAttribute('data-apellido');
    document.getElementById('edit-user-email').value = btn.getAttribute('data-email');
    document.getElementById('edit-user-password').value = btn.getAttribute('data-password');
    document.getElementById('edit-user-rol').value = btn.getAttribute('data-rol');
    new bootstrap.Modal(document.getElementById('modalEditarUsuario')).show();
}

function abrirEditarProveedor(btn) {
    document.getElementById('edit-prov-id').value = btn.getAttribute('data-id');
    document.getElementById('edit-prov-nombre').value = btn.getAttribute('data-nombre');
    document.getElementById('edit-prov-correo').value = btn.getAttribute('data-correo');
    document.getElementById('edit-prov-telefono').value = btn.getAttribute('data-telefono');
    new bootstrap.Modal(document.getElementById('modalEditarProveedor')).show();
}

function abrirEditarProducto(btn) {
    document.getElementById('edit-prod-id').value = btn.getAttribute('data-id');
    document.getElementById('edit-prod-nombre').value = btn.getAttribute('data-nombre');
    document.getElementById('edit-prod-marca').value = btn.getAttribute('data-marca');
    document.getElementById('edit-prod-modelo').value = btn.getAttribute('data-modelo');
    document.getElementById('edit-prod-talla').value = btn.getAttribute('data-talla');
    document.getElementById('edit-prod-precio').value = btn.getAttribute('data-precio');
    new bootstrap.Modal(document.getElementById('modalEditarProducto')).show();
}