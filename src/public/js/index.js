// Configuracion del socket del lado del cliente
const socket = io();

socket.emit('msg', 'Hola soy el cliente!')

Swal.fire({
    icon: 'success',
    title: 'Hola!',
    text: 'Haz entrado en nuestro chat!'
})
