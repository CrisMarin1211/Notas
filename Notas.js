/////////////// API ////////////////////

// Creación de ENDPOINTS - GET - POST

const express = require('express');
const app = express();
const port = 3000;

// Middleware para leer JSON del body de la petición
app.use(express.json());

// Endpoint GET: Para obtener información
app.get('/api/data', (req, res) => {
	res.json({ message: 'Hola, este es un GET!' });
});

// Endpoint POST: Para enviar datos al servidor
app.post('/api/data', (req, res) => {
	const { name } = req.body; // Obteniendo datos del cliente
	res.json({ message: `Hola, ${name}! Has enviado un POST.` });
});

// Iniciar el servidor
app.listen(port, () => {
	console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Para llamarlos

// GET con fetch de API en el cliente

fetch('http://localhost:3000/api/data')
	.then((response) => response.json())
	.then((data) => console.log(data)); // Muestra el mensaje en la consola

// POST con fetch de API en el cliente

fetch('http://localhost:3000/api/data', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({ name: 'Carlos' }),
})
	.then((response) => response.json())
	.then((data) => console.log(data)); // Muestra la respuesta del servidor

//////////////7 SOCKET.IO ///////////////////

// Utilizar Socket.Io

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

//const app = express();
const server = http.createServer(app);
const io = socketIO(server);

//const port = 3000;

// Cuando un cliente se conecta
io.on('connection', (socket) => {
	console.log('Nuevo cliente conectado:', socket.id);

	// Enviar un mensaje a todos los clientes
	socket.emit('message', 'Bienvenido!');

	// Escuchar un evento del cliente
	socket.on('sendMessage', (message) => {
		console.log(`Mensaje del cliente: ${message}`);
		// Enviar el mensaje a todos los clientes conectados
		io.emit('message', message);
	});

	// Cuando un cliente se desconecta
	socket.on('disconnect', () => {
		console.log('Cliente desconectado:', socket.id);
	});
});

// Iniciar el servidor
server.listen(port, () => {
	console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Llamadas con socket en el cliente - HTML

// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>Socket.io Chat</title>
// </head>
// <body>
//   <h1>Chat en tiempo real</h1>
//   <input id="messageInput" type="text" placeholder="Escribe tu mensaje">
//   <button onclick="sendMessage()">Enviar</button>

//   <div id="messages"></div>

//   <script src="/socket.io/socket.io.js"></script>
//   <script>
//     const socket = io('http://localhost:3000');

//     // Escuchar el mensaje del servidor
//     socket.on('message', (message) => {
//       const messagesDiv = document.getElementById('messages');
//       const newMessage = document.createElement('p');
//       newMessage.innerText = message;
//       messagesDiv.appendChild(newMessage);
//     });

//     // Enviar mensaje al servidor
//     function sendMessage() {
//       const messageInput = document.getElementById('messageInput');
//       const message = messageInput.value;
//       socket.emit('sendMessage', message);
//     }
//   </script>
// </body>
// </html>

///////////// IDENTIFICAR A LOS CLIENTES Y ENVIAR UN MENSAJE A UN CLIENTE EN ESPECIFICO ////////////

// Si quieres enviar un mensaje a un cliente específico, puedes usar el socket.id para identificar a cada cliente.

//  Servidor: Enviar un mensaje a un cliente específico

io.on('connection', (socket) => {
	console.log('Nuevo cliente conectado:', socket.id);

	// Enviar mensaje a un cliente específico
	socket.emit('message', `Hola cliente ${socket.id}, bienvenido!`);

	// Escuchar el evento "privado"
	socket.on('privateMessage', (data) => {
		const { to, message } = data;
		io.to(to).emit('message', `Mensaje privado: ${message}`);
	});

	socket.on('disconnect', () => {
		console.log('Cliente desconectado:', socket.id);
	});
});

// Cliente: Enviar mensaje privado

// Enviar mensaje privado a un cliente
function sendPrivateMessage(toClientId, message) {
	socket.emit('privateMessage', { to: toClientId, message });
}

// PARA ENVIAR UN MENSAJE PRIVADO A UN CLIENTE EN ESPECIFICO - IO.TO

io.on('connection', (socket) => {
	console.log('Nuevo cliente conectado:', socket.id);

	// Enviar un mensaje al cliente que se acaba de conectar
	socket.emit('message', `Hola cliente ${socket.id}, bienvenido!`);

	// Recibir un mensaje privado para un cliente específico
	socket.on('privateMessage', (data) => {
		const { to, message } = data; // 'to' es el ID del cliente destinatario
		console.log(`Mensaje privado de ${socket.id} para ${to}: ${message}`);

		// Enviar el mensaje solo al cliente con el ID 'to'
		io.to(to).emit('message', `Mensaje privado de ${socket.id}: ${message}`);
	});

	// Cuando un cliente se desconecta
	socket.on('disconnect', () => {
		console.log('Cliente desconectado:', socket.id);
	});
});

server.listen(port, () => {
	console.log(`Servidor corriendo en http://localhost:${port}`);
});
