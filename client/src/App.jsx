import { useState} from 'react';
import LoginManager, {AdminComponent} from './components/mainComponent';

//const socket = io('http://localhost:4000');
function App() {
  
  const [flagLobby, setFlagLobby] = useState(false);

  function cambioDeFlag(value) {
      setFlagLobby(value);
      console.log('valor de la flag es: ', flagLobby);
  }
  return (
    <div className='App'>
      <LoginManager cambioDeFlag={cambioDeFlag} flag={flagLobby} />
      <AdminComponent flag={flagLobby} />
    </div>
  );
}

export default App
