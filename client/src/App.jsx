import { io } from 'socket.io-client';

const socket = io('http://localhost:4000', {autoConnect: false});
function App() {

  return (
    <div className='App'>
      <h2>Hola Probando react</h2>
      <button onClick={ () => { socket.connect()}}>Conectar</button>
    </div>
    
  );
}

export default App
