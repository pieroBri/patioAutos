import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io('http://localhost:4000', {autoConnect: false});

const listadoRuts = {
    '20251778-1': { nombre: 'Seba', cargo: '0'},
    '20479124-4': { nombre: 'Piero', cargo: '1'},
};

export const AdminComponent = ({ flag }) => {
    const rutUsuario = window.localStorage.getItem('rutUsuario');
    const [listaAutos, setListaAutos] = useState([]);

    function agregarAuto() {
        console.log('agregarAuto');
        const hora = document.getElementById('hora').value;
        const patente = document.getElementById('patente').value;   
        const obs = document.getElementById('obs').value;

        console.log('hora', hora);
        console.log('patente', patente);
        console.log('obs', obs);

        setListaAutos((prevAutos) => [
            ...prevAutos,
            { hora, patente, obs },
        ]);

    }

    if (flag) {
        if (rutUsuario in listadoRuts) {
            if (listadoRuts[rutUsuario].cargo === '0') {
                return (
                    <div>
                        <h1>{rutUsuario} </h1>
                        <div>
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
                    <div>
                        <div>
                            <h1>{listadoRuts[rutUsuario].nombre} </h1>
                            <input type="text" id="hora" placeholder="Hora" />
                            <input type="text" id="patente" placeholder="Patente" />
                            <input type="text" id="obs" placeholder="Observación"/>
                            <button onClick={agregarAuto}>Agregar Auto</button>
                            <p>This is the admin component.</p>
                        </div>
                        <div>
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

export default LoginManager;
// export default App;