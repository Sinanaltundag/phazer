// import { useState } from 'react';
import './App.css';
// import { Phaser3GameComponent } from './components/10_phaserextend';
// import IonEx from './components/ionexample';
// import PhaserSimple from './components/PhaserSimple';
// import Isometric from './components/isometric';
// import IsometricClass from './components/IsometricClass';
// import Simple from './components/Simple';
// import PlayerFuncs from './components/PlayerFuncs';
// import UpCamera from './components/UpCamera';
// import NewMap from './components/NewMap';
// import NewMapOrthogonal from './components/NewMapOrthogonal';
// import Characters from './components/Characters';
// import Layers from './components/Layers';
import Straight from './components/Straight';
import Carousel from './components/carousel';

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
      {/* <NewMap/> */}
      {/* <NewMapOrthogonal/> */}
      {/* <Characters/> */}
      {/* <Layers/> */}
      <Straight/>
      {/* <Phaser3GameComponent/> */}
      {/* <Carousel/> */}
    </div>
  );
}

export default App;
