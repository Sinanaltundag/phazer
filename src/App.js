import './App.css';
// import PhaserSimple from './components/PhaserSimple';
import Isometric from './components/isometric';
// import IsometricClass from './components/IsometricClass';
import Simple from './components/Simple';

function App() {
  return (
    <div className="App">
      {/* <IsometricClass /> */}
      <Isometric/>
      <Simple/>
      {/* <PhaserSimple/> */}
    </div>
  );
}

export default App;
