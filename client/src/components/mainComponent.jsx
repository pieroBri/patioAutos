import { useEffect, useState } from "react";
import React from "react";
import { io } from "socket.io-client";

const socket = io('http://localhost:4000', {autoConnect: false});

const listadoRuts = {
    '20251778-1': { nombre: 'Seba', cargo: '0'},
    '20479124-4': { nombre: 'Piero', cargo: '1'},
    '12345678-9': { nombre: 'Juan', cargo: '1' },
};

export const AdminComponent = ({ flag }) => {
    const rutUsuario = window.localStorage.getItem('rutUsuario');
    const [listaAutos, setListaAutos] = useState([]);

    useEffect(() => {
        if (flag) {
             // Solicitar las reservas al servidor
             socket.emit('obtenerReservas');

             // Escuchar la respuesta del servidor con las reservas
             socket.on('listaReservas', (reservas) => {
                 console.log('Reservas recibidas:', reservas);
                 setListaAutos(reservas);
             });
 
             // Escuchar actualizaciones en tiempo real de las reservas
             socket.on('updateListaReservas', (reservas) => {
                 setListaAutos(reservas);
             });
 
             return () => {
                 socket.off('listaReservas');
                 socket.off('updateListaReservas');
             };
        }
        
    }, [flag]);

    // socket.on('updateListaReservas', (reservas) => {
    //     setListaAutos(reservas);
    // });
    function agregarAuto() {
        console.log('agregarAuto');
        const hora = document.getElementById('hora').value;
        const patente = document.getElementById('patente').value;   
        const obs = document.getElementById('obs').value;

        console.log('hora', hora);
        console.log('patente', patente);
        console.log('obs', obs);

        // setListaAutos((prevAutos) => [
        //     ...prevAutos,
        //     { hora, patente, obs },
        // ]);

        socket.emit('agregarReserva', { hora, patente, obs });

    }

    if (flag) {
        if (rutUsuario in listadoRuts) {
            if (listadoRuts[rutUsuario].cargo === '0') {
                return (
                    <div>
                        <h1>{rutUsuario} </h1>
                        <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid black', padding: '10px' }}>
                            {listaAutos.map((auto, index) => (
                                <div key={index}>
                                    <p>Hora: {auto.hora}</p>
                                    <p>Patente: {auto.patente}</p>
                                    <p>Observación: {auto.obs}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }
            if (listadoRuts[rutUsuario].cargo === '1') {        
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid black', padding: '10px' }}>
                        <h1>{listadoRuts[rutUsuario].nombre} </h1>
                        <div>
                            <input type="text" id="hora" placeholder="Hora" />
                            <input type="text" id="patente" placeholder="Patente" />
                            <input type="text" id="obs" placeholder="Observación"/>
                            <button onClick={agregarAuto}>Agregar Auto</button>
                            <p>This is the admin component.</p>
                        {/* <FileUploadComponent /> */}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid black', padding: '10px' }}>
                            {listaAutos.map((auto, index) => (
                                <div key={index}>
                                    <p>Hora: {auto.hora}</p>
                                    <p>Patente: {auto.patente}</p>
                                    <p>Observación: {auto.obs}</p>
                                </div>
                            ))}
                        </div>
                        
                    </div>
                );
            }
        }
    }
}

function LoginManager({ cambioDeFlag, flag}) {

    useEffect(() => {
        socket.on('connect', () => {
            cambioDeFlag(true);
            console.log('Connected to server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const [rutUsuario, setRutUsuario] = useState('');

    const conectarSocket = () => {
        socket.connect();
        socket.emit('ingreso', rutUsuario);
        window.localStorage.setItem('rutUsuario', rutUsuario);
    }
    if (flag === false) {
        return (
            <div className='App'>
              <input
                type="text"
                placeholder='Rut Usuario'
                value={rutUsuario}
                onChange={(e) => setRutUsuario(e.target.value)}
                />
              <button onClick={conectarSocket}>Enviar</button>
            </div>
        );
    }
}


export const FileUploadComponent = () => {
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log("Archivo seleccionado:", file.name);
            // Aquí puedes manejar el archivo, como enviarlo a un servidor
        }
    };

    return (
        <div>
            <h2>Subir Archivo</h2>
            <input type="file" onChange={handleFileUpload} />
        </div>
    );
};

export default LoginManager;
// export default App;