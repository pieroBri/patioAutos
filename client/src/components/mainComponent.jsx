import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io('http://localhost:4000', {autoConnect: false});

const listadoRuts = {
    '20251778-1': { nombre: 'Seba', cargo: '0'},
    '20479124-4': { nombre: 'Piero', cargo: '1'},
};

export const AdminComponent = ({ flag }) => {
    const rutUsuario = window.localStorage.getItem('rutUsuario');
    if (flag) {
        if (rutUsuario in listadoRuts) {
            if (listadoRuts[rutUsuario].cargo === '0') {
                return (
                    <div>
                        <h1>{rutUsuario} </h1>
                        <p>This is the user component.</p>
                    </div>
                );
            }
            if (listadoRuts[rutUsuario].cargo === '1') {        
                return (
                    <div>
                        <h1>{rutUsuario} </h1>
                        <p>This is the admin component.</p>
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