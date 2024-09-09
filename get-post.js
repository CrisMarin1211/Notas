// hacer POST en el server

fetch('http://localhost:3000/usuarios', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({
		nombre: 'Juan',
		email: 'juan@example.com',
	}),
})
	.then((response) => response.text())
	.then((data) => console.log(data));

// Hacer GET

fetch('http://localhost:3000/usuarios/1')
	.then((response) => response.json())
	.then((data) => console.log(data));

// Hacer la solicitud GET para obtener el usuario con ID 1

fetch('http://localhost:3000/usuarios/1')
	.then((response) => {
		if (response.ok) {
			return response.json();
		} else {
			throw new Error('Usuario no encontrado');
		}
	})
	.then((usuario) => {
		// Pintar el nombre del usuario en el título
		const titulo = document.getElementById('titulo');
		titulo.textContent = `Nombre del usuario: ${usuario.nombre}`;
	})
	.catch((error) => {
		// Mostrar error si no se encuentra el usuario
		const titulo = document.getElementById('titulo');
		titulo.textContent = error.message;
	});

// SOCKET  PARA UN SOLO CLIENTE

const socket = io('http://localhost:3000');

// Enviar un mensaje privado
const destinatarioId = 'ID_DEL_OTRO_CLIENTE';
socket.emit('privado', { id: destinatarioId, mensaje: 'Hola cliente específico' });

// Recibir mensaje privado
socket.on('mensajePrivado', (data) => {
	console.log('Mensaje privado recibido:', data);
});
