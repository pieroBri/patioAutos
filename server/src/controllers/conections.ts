/* EN ESTE ARCHIVO SE MANEJA LA LOGICA DE CONEXIONES UTILIZANDO EL SOCKET.
EVENTOS DE CONEXION Y DESCONEXION VAN EN SERVER.JS*/

import { Server, Socket } from "socket.io";

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

interface Observacion {
    emisor: string;
    mensaje: string;
}

interface Reserva {
    hora: string;
    patente: string;
    observaciones: Observacion[];
    estado: string;
}

const reservas: Reserva[] = [];

function manejoReservas(socket: Socket, io: Server) {
    socket.on('agregarReserva', (data : { hora: string; patente: string }) => {

        const nuevaReserva: Reserva = {
            hora: data.hora,
            patente: data.patente,
            observaciones: [],
            estado: 'Pendiente',
        };

        reservas.push(nuevaReserva);
        io.emit('updateListaReservas', reservas);
    });
    
    socket.on('obtenerReservas', () => {
        socket.emit('listaReservas', reservas);
    });

    socket.on('editarEstadoReserva', (data: { index: number; estado: string }) => {
        const { index, estado } = data;
        if (reservas[index]) {
          reservas[index].estado = estado;
          io.emit('updateListaReservas', reservas);
        }
      });

    socket.on('agregarObservacion', (data: { patente: string; emisor: string; mensaje: string }) => {
        const nuevaObservacion: Observacion = {
            emisor: data.emisor,
            mensaje: data.mensaje,
        };
        console.log('---------------agregarObservacion', data);
        //const { patente, observacion } = data;
        const reserva = reservas.find((r) => r.patente === data.patente);
        if (reserva) {
            reserva.observaciones.push(nuevaObservacion); // Agregar observación al array
            io.emit('observacionAgregada', { patente: data.patente, nuevaObservacion}); // Notificar al cliente
        }
    });

    // socket.on('editarObsReserva', (data) => {
    //     const { index, obs } = data;
    //     console.log('editarObsReserva', data);
    //     if (reservas[index]) {
    //         reservas[index].obs = obs;
    //         io.emit('updateListaReservas', reservas);
    //     }
    // });
}

export default manejoReservas;