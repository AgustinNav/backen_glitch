import express from 'express'
import handlebars from 'express-handlebars'
import _dirname from './utils.js'
import viewRouter from './routes/view.router.js'

import { Server } from 'socket.io'

const app = express()
const PORT = process.env.PORT || 8080

const logs = []
// Prepara la configuracion del servidor para recibir objetos JSON.

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Configuramos Handlebars
app.engine('handlebars', handlebars.engine())   // Motor
app.set('views', _dirname + "/views")          // Direccion de las vistas
app.set('view engine', 'handlebars')          // Extension de los archivos

// Declaramos uso de archivos estaticos
app.use(express.static(_dirname + '/public'))


// Declaramos el router
app.use('/', viewRouter)



const httpServer = app.listen(PORT, () => {
    console.log("Servidor corriendo en el puerto: " + PORT);
})

// Creamos el servidor para sockets viviendo dentro del servidor principal
const socketServer = new Server(httpServer)

// Abrimos el canal de comunicacions
socketServer.on('connection', socket => {
    
    // Aqui recibimos el nombre del usuario:
    socket.on('userConnected', data => {
        let message = `Nuevo usuario conectado: ${data.user}`
        socket.broadcast.emit("NewUserConected", message)
    })

    socket.on('message', data => {
        logs.push(data)
        socketServer.emit('refreshLogs', {logs})
    })

})