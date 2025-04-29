/* EN ESTE ARCHIVO SE MANEJA LA LOGICA DE CONEXIONES UTILIZANDO EL SOCKET.
EVENTOS DE CONEXION Y DESCONEXION VAN EN SERVER.JS*/

// const listadoRuts = {
//     '12345678-9': { nombre: 'Juan', rut: '12345678-9' },
//     '98765432-1': { nombre: 'Maria', rut: '98765432-1' },
//     '11111111-1': { nombre: 'Pedro', rut: '11111111-1' },
//     '22222222-2': { nombre: 'Ana', rut: '22222222-2' },
//     '33333333-3': { nombre: 'Luis', rut: '33333333-3' },
//     '44444444-4': { nombre: 'Laura', rut: '44444444-4' },
// };

const listadoRuts = {
    '20251778-1': { nombre: 'Seba'},
    '20479124-4': { nombre: 'Piero'},
};

const reservas = [];

const obs = {
    emisor: '',
    mensaje: '',
};

function manejoReservas(socket, io) {
    socket.on('agregarReserva', (data) => {
        //console.log('agregarAuto', data);


        
        const nuevaReserva = {
            hora: data.hora,
            patente: data.patente,
            obs: [],
            estado: 'Pendiente',
        };

        reservas.push(nuevaReserva);
        io.emit('updateListaReservas', reservas);
    });
    
    socket.on('obtenerReservas', () => {
        socket.emit('listaReservas', reservas);
    });

    socket.on('editarEstadoReserva', (data) => {
        //console.log('editarestadoReserva', data);
        const { index, estado } = data;
        if (reservas[index]) {
            reservas[index].estado = estado;
            io.emit('updateListaReservas', reservas);
        }
    });

    socket.on('editarObsReserva', (data) => {
        const { index, obs } = data;
        console.log('editarObsReserva', data);
        if (reservas[index]) {
            reservas[index].obs = obs;
            io.emit('updateListaReservas', reservas);
        }
    });
}

module.exports = manejoReservas;