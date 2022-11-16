// import { useState } from 'react';
import './App.css';
// import IonEx from './components/ionexample';
// import PhaserSimple from './components/PhaserSimple';
// import Isometric from './components/isometric';
// import IsometricClass from './components/IsometricClass';
// import Simple from './components/Simple';
// import PlayerFuncs from './components/PlayerFuncs';
// import UpCamera from './components/UpCamera';
import NewMap from './components/NewMap';
// import NewMapOrthogonal from './components/NewMapOrthogonal';

function App() {
  // const [start, setStart] = useState(false);
  return (
    <div className="App">
      {/* <IsometricClass /> */}
      {/* <Isometric/> */}
      {/* {start?<IonEx/>:<Simple />}
      <button onClick={()=>setStart(!start)}>Start</button> */}
      {/* <IonEx/> */}
      {/* <PhaserSimple/> */}
      {/* <PlayerFuncs/> */}
      {/* <UpCamera/> */}
      <NewMap/>
      {/* <NewMapOrthogonal/> */}
    </div>
  );
}

export default App;
