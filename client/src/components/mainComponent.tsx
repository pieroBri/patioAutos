import { useEffect, useState } from "react";
import React from "react";
import { io } from "socket.io-client";
import { Button } from 'primereact/button';
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ReservaCSV } from "../interfaces/archivos"
import { InputTextarea } from "primereact/inputtextarea";
import { Dialog } from "primereact/dialog";

import { modificarFormatoHora, validarFormatoPatente } from "../scripts/metodos";
import Papa from "papaparse";
import { ColorPicker } from "primereact/colorpicker";
import { Divider } from "primereact/divider";
import { validarFormatoHora } from "../scripts/metodos";


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

const socket = io('http://localhost:4000', {autoConnect: false});

const listadoRuts: Record<string, { nombre: string; cargo: string }> = {
    '20251778-1': { nombre: 'Seba', cargo: '0' },
    '20479124-4': { nombre: 'Piero', cargo: '1' },
    '12345678-9': { nombre: 'Juan', cargo: '1' },
};

export const AdminComponent = ({ flag }: { flag: boolean }) => {
    const rutUsuario = window.localStorage.getItem('rutUsuario') ?? '';
    const [observacion, setObservacion] = useState<string>(''); // Estado para la observación
    const [listaReservaDeAutos, setListaReservaDeAutos] = useState<Reserva[]>([]); // Estado para la lista de reservas con interfaz
    const [visible, setVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState('');
    const [arrayObservaciones, setArrayObservaciones] = useState<Observacion[]>([]); // Estado para las observaciones

    useEffect(() => {
        if (flag) {
             // Solicitar las reservas al servidor
             socket.emit('obtenerReservas');

             // Escuchar la respuesta del servidor con las reservas
             socket.on('listaReservas', (reservas: Reserva[]) => {
                 console.log('Reservas recibidas:', reservas);
                 setListaReservaDeAutos(reservas);
             });
 
             // Escuchar actualizaciones en tiempo real de las reservas
             socket.on('updateListaReservas', (reservas: Reserva[]) => {
                setListaReservaDeAutos(reservas);
             });

             socket.on('observacionAgregada', (reservas: Reserva[]) => {
                setListaReservaDeAutos(reservas);
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
        const hora = (document.getElementById("hora") as HTMLInputElement).value;
        const patente = (document.getElementById("patente") as HTMLInputElement).value.toLocaleUpperCase();

        if(!validarFormatoHora(hora)){
            alert("Formato de hora incorrecto")
            return
        }

        if(!validarFormatoPatente(patente)){
            alert("Formato de patente incorrecto")
            return
        }
        console.log('hora', hora);
        console.log('patente', patente);

        // setListaAutos((prevAutos) => [
        //     ...prevAutos,
        //     { hora, patente, obs },
        // ]);

        socket.emit('agregarReserva', { hora, patente });

    }

    const editarEstado = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id_auto = e.target.parentElement?.id || ""; 
        const estado = e.target.value;

        console.log('id', id_auto);
        console.log('estado', estado);

        socket.emit('editarEstadoReserva', { index: id_auto, estado: estado });
    }
    
    const agregarObservación = (patente: string) => {
        console.log('agregarObservacion', patente, observacion);
        if(!observacion){
            alert("ingrese observación")
            return
        }; // Si no hay observacion no se agrega nada
        socket.emit('agregarObservacion', { patente: patente, emisor: rutUsuario, mensaje: observacion });
        setObservacion('');
        setVisible(false);
        setModalVisible('');
    }

    const mostrarModal = (patente: string, data: Observacion[]) => {
        setArrayObservaciones(data);
        setModalVisible(patente);
        setVisible(true);
    }

    if (flag) {
        if (rutUsuario in listadoRuts) {
            if (listadoRuts[rutUsuario].cargo === '0') {
                return (
                    <div>
                        <h1>{listadoRuts[rutUsuario].nombre} </h1>
                        
                        {listaReservaDeAutos.map((auto, index) => (
                            <div
								key={index}
								id={index.toString()}
								className="flex p-3 gap-2 border-1 border-round-xl mb-3"
								style={{borderColor: "#ffdf00"}}
							>
                                <p className="p-2">Hora: {auto.hora}</p>
                                <p className="p-2">Patente: {auto.patente}</p>
                                <p className="p-2">Observaciones: </p>
                                <InputTextarea
									className="p-inputtext-lg"
                                    style={{
										borderRadius: '12px',
										backgroundColor: "#222222",
										borderColor:"#f8f32b",
										fontSize: '16px'
									}}
                                    placeholder='Observacion'
                                    value={auto.observaciones.map((obs) => `${listadoRuts[obs.emisor].nombre}: ${obs.mensaje}`).join('\n')}
                                    readOnly cols={30}
								/>
                                <div className="p-3 bg-yellow">
                                	<Button 
										label="Agregar observación"
										icon="pi pi-comments"
										className=""
										style={{
											backgroundColor: "#222222",
											borderColor:"f8f32b",
											border:"2px solid #f8f32b",
											color: "#ffffff"
										}}
										onClick={()=>setModalVisible(auto.patente)}
									/>
									<Dialog
										visible={modalVisible === auto.patente} // valida que el modal sea visible y que el id del auto sea el mismo que el del modal
										modal
                                        dismissableMask
                                        draggable={false}
                                        header="Agregar Observación"
										onHide={() => {if (modalVisible != auto.patente) return; setModalVisible(''); }}
									>
                                        <div 
                                            className="flex flex-column px-8 py-5 gap-4"
                                            style={{
                                                borderRadius: '12px',
                                                backgroundColor: "#111111",
                                                borderColor:"#f8f32b"
                                            }}
                                        >
                                        
                                            <InputText
                                                defaultValue={''}
                                                style={{
                                                    borderRadius: '12px',
                                                    backgroundColor: "#131313",
                                                    borderColor:"#f8f32b"
                                                }}
                                                onChange={(e) => setObservacion(e.target.value)}
                                                className="mx-10"
                                            />
                                            <Button
                                                label="Enviar"
                                                style={{
                                                    borderRadius: '12px',
                                                    backgroundColor: "#171717",
                                                    borderColor:"#f8f32b", color:"#8a8a8a"
                                                }}
                                                onClick={() => agregarObservación(auto.patente)}
                                            />
                                        </div>
                                    </Dialog>

                                    

                                    {/*<InputText
                                        className="p-inputtext-lg"
                                        type="text"
                                        placeholder='Observacion'
                                        defaultValue=''
                                        onChange={(e) => setObservacion(e.target.value)}
                                    />
                                    <Button label="submit" className="p-button-warning p-button-lg" onClick={() => agregarObservación(auto.patente)}></Button>*/}
                                </div>
                                {/* <p className="p-2">Observación: <InputText value={auto.obs} onChange={editarObservación} /></p> */}
                                <select 
                                    name="estado" 
                                    defaultValue={auto.estado || "Pendiente"} 
                                    onChange={editarEstado}
									className="border-1 border-blue-400 px-2"
                                >
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="En preparación">En preparación</option>
                                    <option value="Disponible">Disponible</option>
                                    <option value="Entregado">Entregado</option>
                                </select>
                            </div>
                        ))}
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
										className="w-full p-inputtext-sm surface-900 text-white border-1 border-blue-400 px-4"
									/>
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
									value={listaReservaDeAutos}
									rowGroupMode="rowspan" 
									groupRowsBy="hora"
									sortField="hora"
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
									>
									</Column>

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
									>
									</Column>

									<Column
										body={(rowData: Reserva) => (
											<div>
												<Button label="Show" icon="pi pi-external-link" onClick={()=>mostrarModal(rowData.patente, rowData.observaciones)} />
											</div>
										)}
										header="Observacion"
										style={{
											borderRight: "1px solid rgba(255, 255, 255, 0.2)",
											background: "rgba(20, 20, 20, 0.7)",
										}}
										headerStyle={{
											background: "rgba(0, 100, 200, 0.3)",
											color: "white",
										}}
									>
									</Column>

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
									>
									</Column>
								</DataTable>
                                <Dialog
                                    header="Observaciones"
                                    dismissableMask
                                    draggable={false}
                                    visible={visible} // valida que el modal sea visible y que el id del auto sea el mismo que el del modal
                                    onHide={() => {if (!visible) return; setVisible(false);}}
                                >
                                <div 
                                    className="flex flex-column px-8 py-5 gap-4"
                                    style={{ 
                                        borderRadius: '12px',
                                        backgroundColor: "#111111", 
                                        borderColor:"#f8f32b" 
                                    }}
                                >
                                
                                {
                                    arrayObservaciones.length > 0 ? (
                                        <InputTextarea
                                            autoResize
                                            style={{ 
                                                borderRadius: '12px', 
                                                backgroundColor: "#222222", 
                                                borderColor:"#f8f32b", 
                                                fontSize: '18px', 
                                                width: '50vw'
                                            }}
                                            className="p-inputtext-lg"
                                            value={arrayObservaciones.map((obs) => `${listadoRuts[obs.emisor].nombre}: ${obs.mensaje}`).join('\n')}
                                            readOnly cols={30}
                                        />
                                    ) : (
                                        <p className="text-white">No hay observaciones</p>
                                    )
                                }
                                </div>
                                </Dialog>
                            </div>
							{/* Cierre del div de la tabla */}
                        </Card>
                    </div>
                );
            }
        }
    }
}

function LoginManager({ cambioDeFlag, flag }: { cambioDeFlag: (value: boolean) => void, flag: boolean }) {

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
    },[]);

    const [rutUsuario, setRutUsuario] = useState('');

    const conectarSocket = () => {
        if (listadoRuts[rutUsuario]) {
			socket.connect();
			socket.emit('ingreso', rutUsuario);
			window.localStorage.setItem('rutUsuario', rutUsuario);
        }else {
            alert('Rut no valido');
        }
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
                    <Button 
						label="Enter"
						className="p-button-primary p-button-lg"
						onClick={conectarSocket}
					>
					</Button>
                </div>
            </div>
        );
    }
}


export const FileUploadComponent: React.FC = () => {
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; // Verifica si hay un archivo seleccionado
        if (file) {
            if (file.type === "text/csv") {
                const reader = new FileReader();
                reader.onload = (e: ProgressEvent<FileReader>) => {
                    const csvData = e.target?.result as string; // Asegúrate de que el resultado sea una cadena
                    console.log(csvData)
                    Papa.parse(csvData, {
                        header: true, // Si el archivo tiene encabezados
                        skipEmptyLines: true,
                        complete: (result:  Papa.ParseResult<any>) => {
                            console.log("Datos del CSV:", result.data);
                            // Aquí puedes operar con los datos del CSV
                            result.data.forEach((fila: any) => {
                                console.log('sucursalSalida', fila);
                                 // Aqui el objeto fila tiene los campos en el formtato de la interfaz ReservaCSV
                                 // Pero por algun motivo no se puede acceder a los campos de la interfaz con el nombre tal cual, tiene que ser con el nombre de la columna del csv

                                 /**
                                  deberia ser algo como esto:
                                    const reserva: Reserva= {
                                        hora: fila['sucursalSalida'],
                                        patente: fila.[patente],
                                        observaciones: [],
                                        estado: 'Pendiente',
                                  */
                                const horaa: string = modificarFormatoHora(fila["Suc. Salida"]);
                                console.log('hora', fila["Suc. Salida"]);
                                const reserva: Reserva= {
                                    hora: horaa,
                                    patente: fila["Patente"],
                                    observaciones: [],
                                    estado: 'Pendiente',
                                };
                                socket.emit('agregarReserva', reserva);
                                console.log('reserva', reserva);
                            });
                        },
                        error: (error: Error) => {
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