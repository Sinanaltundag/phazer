import { useState } from 'react';
import './App.css';
import IonEx from './components/ionexample';
import IonEx2 from './components/ionexample2';
// import PhaserSimple from './components/PhaserSimple';
// import Isometric from './components/isometric';
// import IsometricClass from './components/IsometricClass';
// import Simple from './components/Simple';

function App() {
  // const [start, setStart] = useState(false);
  return (
    <div className="App">
      {/* <IsometricClass /> */}
      {/* <Isometric/> */}
      {/* {start?<IonEx/>:<Simple />}
      <button onClick={()=>setStart(!start)}>Start</button> */}
      {/* <IonEx/> */}
      <IonEx2/>
      {/* <PhaserSimple/> */}
    </div>
  );
}

export default App;
