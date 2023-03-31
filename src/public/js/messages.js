const socket = io()
let user;

const chatBox = document.getElementById('chatBox')
const log = document.getElementById('log')

// Primera parte: Asignar nombre de usuario
Swal.fire({
    icon: "info",
    title: 'Introduce tu nombre de usuario:',
    input: 'text',
    color: "#716add",
    // inputAttributes: {
    //   autocapitalize: 'off'
    // },
    showCancelButton: false,
    confirmButtonText: 'Crear',
    allowOutsideClick: false,
    inputValidator: (value) => {
        if (!value) {
            return "Escribe tu nombre primero!"
        } else {
            // Aqui empieza el soquete
            socket.emit("userConnected", { user: value })
        };
    }
}).then((result) => {
    user = result.value
    Swal.fire({
        title: 'Sesion Iniciada.',
        text: `Bienvenido ${user}!!`
    })
})

// Enviar un mensaje

chatBox.addEventListener('keyup', evt => {
    if (evt.key == 'Enter') {
        if (chatBox.value.trim().length > 0) {
            socket.emit('message', {
                user: user,
                message: chatBox.value
            })
            chatBox.value=''
        }
    }
})

// Recibir un mensaje

socket.on('refreshLogs', data => {
    let logs = '';

    data.logs.forEach(log => {
        logs += `<strong>${log.user}</strong>: ${log.message}
        <br/><br/>`
    });

    log.innerHTML = logs
})

socket.on('NewUserConected', message => {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: 'success',
        title: message
    })
})