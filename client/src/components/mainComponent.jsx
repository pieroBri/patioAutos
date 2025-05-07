import { useEffect, useState } from "react";
import React from "react";
import { io } from "socket.io-client";
import { Button } from 'primereact/Button';
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/Card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Papa from "papaparse";

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
        const obs = '';

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
                    <div className="flex justify-content-center align-items-center min-h-screen bg-black">
                        <Card
                            className="w-11 md:w-8 lg:w-6 border-1 border-round-xl border-white-alpha-20"
                            style={{ background: "rgba(0,0,0,0.8)" }}
                        >
                            <h1>{listadoRuts[rutUsuario].nombre} </h1>
                            {/* Form Section */}

                            <div className="flex flex-column md:flex-row gap-3 mb-4 justify-content-center">
                                <span className="p-input-icon-left w-full md:w-4">
                                    <i className="pi pi-clock px-1" />
                                    <InputText
                                    id="hora"
                                    placeholder="Hora"
                                    className="w-full p-inputtext-sm surface-900 text-white border-1 border-blue-400 px-4"/>
                                </span>
                                <span className="p-input-icon-left w-full md:w-4">
                                    <i className="pi pi-id-card px-1" />
                                    <InputText
                                    id="patente"
                                    placeholder="Patente"
                                    className="w-full p-inputtext-sm surface-900 text-white border-1 border-blue-400 px-4"
                                    />
                                </span>
                                <Button
                                    label="Agregar"
                                    icon="pi pi-plus"
                                    onClick={agregarAuto}
                                    className="p-button-sm w-full md:w-2 border-1 border-yellow-400"
                                    style={{ background: "rgba(204, 204, 44)" }}
                                />
                                <FileUploadComponent />
                            </div>

                            {/* Table Section */}
                            <div className="mt-4">
                            <DataTable
                                value={listaAutos}
                                showGridlines
                                stripedRows
                                className="text-white"
                                style={{
                                background: "rgba(30, 30, 30, 0.7)",
                                borderRadius: "8px",
                                border: "1px solid rgba(255, 255, 255, 0.2)",
                                }}
                            >
                                <Column
                                field="hora"
                                header="Hora"
                                style={{
                                    borderRight: "1px solid rgba(255, 255, 255, 0.2)",
                                    background: "rgba(20, 20, 20, 0.7)",
                                }}
                                headerStyle={{
                                    background: "rgba(0, 100, 200, 0.3)",
                                    color: "white",
                                }}
                                />
                                <Column
                                field="patente"
                                header="Patente"
                                style={{
                                    borderRight: "1px solid rgba(255, 255, 255, 0.2)",
                                    background: "rgba(20, 20, 20, 0.7)",
                                }}
                                headerStyle={{
                                    background: "rgba(0, 100, 200, 0.3)",
                                    color: "white",
                                }}
                                />
                                <Column
                                field="observacion"
                                header="Observacion"
                                style={{
                                    borderRight: "1px solid rgba(255, 255, 255, 0.2)",
                                    background: "rgba(20, 20, 20, 0.7)",
                                }}
                                headerStyle={{
                                    background: "rgba(0, 100, 200, 0.3)",
                                    color: "white",
                                }}
                                />
                                <Column
                                field="estado"
                                header="Estado"
                                style={{
                                    background: "rgba(20, 20, 20, 0.7)",
                                }}
                                headerStyle={{
                                    background: "rgba(0, 100, 200, 0.3)",
                                    color: "white",
                                }}
                                />
                            </DataTable>
                                {/* {listaAutos.map((auto, index) => (
                                    <div key={index}>
                                        <p>Hora: {auto.hora}</p>
                                        <p>Patente: {auto.patente}</p>
                                        <p>Observación: {auto.obs}</p>
                                    </div>
                                ))} */}
                            </div>
                        </Card>
                        
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
            <div className="flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <div className="p-inputgroup" style={{ maxWidth: "500px" }}>
                    <InputText
                        className="p-inputtext-lg"
                        type="text"
                        placeholder='Rut Usuario'
                        value={rutUsuario}
                        onChange={(e) => setRutUsuario(e.target.value)}
                        />
                    <Button label="Enter" className="p-button-primary p-button-lg" onClick={conectarSocket}></Button>
                </div>
            </div>
        );
    }
}


export const FileUploadComponent = () => {
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type === "text/csv") {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const csvData = e.target.result;
                    Papa.parse(csvData, {
                        header: true, // Si el archivo tiene encabezados
                        skipEmptyLines: true,
                        complete: (result) => {
                            console.log("Datos del CSV:", result.data[1]["Categor�a"]);
                            // Aquí puedes operar con los datos del CSV
                            result.data.forEach((fila) => {
                                let reserva = {
                                    hora: fila["Suc. Salida"],
                                    patente: fila["Patente"],
                                    obs: '',
                                }
                                socket.emit('agregarReserva', reserva);
                                console.log('reserva', reserva);
                            });

                        },
                        error: (error) => {
                            console.error("Error al leer el archivo CSV:", error);
                        },
                    });
                };
                reader.readAsText(file);
            } else {
                console.error("Por favor, sube un archivo .csv");
            }
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