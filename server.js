// Esto seria el manejo de GET Y POST

const express = require('express');
const app = express();
app.use(express.json());

let usuarios = []; // Arreglo donde se almacenarán los usuarios

// Endpoint POST para agregar un usuario
app.post('/usuarios', (req, res) => {
	const nuevoUsuario = req.body; // Recibe el nuevo usuario del cuerpo del POST
	nuevoUsuario.id = usuarios.length + 1; // Asignar un ID único
	usuarios.push(nuevoUsuario); // Agregar el usuario al arreglo
	res.status(201).send(`Usuario agregado con ID: ${nuevoUsuario.id}`);
});

// Endpoint GET para obtener un usuario por ID
app.get('/usuarios/:id', (req, res) => {
	const id = parseInt(req.params.id); // Obtener el ID desde los parámetros de la URL
	const usuario = usuarios.find((u) => u.id === id); // Buscar el usuario por ID
	if (usuario) {
		res.json(usuario); // Si se encuentra, se devuelve el usuario
	} else {
		res.status(404).send('Usuario no encontrado'); // Si no se encuentra, error 404
	}
});

// Iniciar el servidor
app.listen(3000, () => {
	console.log('Servidor corriendo en el puerto 3000');
});

// SOCKET PARA UN SOLO CLIENTE

io.on('connection', (socket) => {
	console.log('Cliente conectado:', socket.id);

	// Enviar un mensaje a un cliente específico
	socket.on('privado', (data) => {
		const destinatarioId = data.id;
		const mensaje = data.mensaje;
		io.to(destinatarioId).emit('mensajePrivado', mensaje);
	});
});
