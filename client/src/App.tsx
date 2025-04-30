import { useState} from 'react';
import React from 'react';
import { PrimeReactProvider } from 'primereact/api';
import LoginManager, {AdminComponent} from './components/mainComponent';

//const socket = io('http://localhost:4000');
const App = () => {
  
  const [flagLobby, setFlagLobby] = useState(false);

  function cambioDeFlag(value: boolean) {
      setFlagLobby(value);
      console.log('valor de la flag es: ', flagLobby);
  };

  return (
    <div className='App'>
      <PrimeReactProvider>
        <LoginManager cambioDeFlag={cambioDeFlag} flag={flagLobby} />
        <AdminComponent flag={flagLobby} />
      </PrimeReactProvider>
    </div>
  );
}

export default App
