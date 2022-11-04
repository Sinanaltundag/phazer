import React, { useState, useEffect, useRef } from "react";
import Phaser from "phaser";
import { IonPhaser } from "@ion-phaser/react";
import { GridEngine } from "grid-engine";
import { GameComponent, useEventListener, useEventEmitter } from 'phaser-react-tools'
// import './App.css'

class MainScene extends Phaser.Scene {
  preload() {
    this.load.image("tiles", "assets/iso_tile.png");
    this.load.tilemapTiledJSON("iso-map", "assets/isometric.json");
    this.load.spritesheet("player", "assets/iso_char.png", {
      frameWidth: 15,
      frameHeight: 32,
    });
    // if (!this.plugins.get("GridEngine")) {
    //   // this.plugins.installScenePlugin("GridEngine", GridEngine, "gridEngine", this);
    //   //   this.plugins.installScenePlugin("GridEngine", GridEngine, "gridEngine");
    //     this.load.plugin(
    //         "GridEngine",
    //         GridEngine,
    //         true
    //       );
    //     }
      }
      
      create() {
    const cloudCityTilemap = this.make.tilemap({ key: "iso-map" });
    cloudCityTilemap.addTilesetImage("iso-tileset", "tiles");
    for (let i = 0; i < cloudCityTilemap.layers.length; i++) {
      const layer = cloudCityTilemap.createLayer(i, "iso-tileset", 0, 0);
      layer.scale = 3;
    }
    const playerSprite = this.add.sprite(0, 0, "player");
    playerSprite.scale = 3;
    this.cameras.main.startFollow(playerSprite, true);
    this.cameras.main.setFollowOffset(
      -playerSprite.width,
      -playerSprite.height
    );

    this.createPlayerAnimation.call(this, "up-right", 26, 29);
    this.createPlayerAnimation.call(this, "down-right", 36, 39);
    this.createPlayerAnimation.call(this, "down-left", 6, 9);
    this.createPlayerAnimation.call(this, "up-left", 16, 19);

    const gridEngineConfig = {
      characters: [
        {
          id: "player",
          sprite: playerSprite,
          startPosition: { x: 0, y: 0 },
          offsetY: -9,
          walkingAnimationEnabled: false,
          speed: 2,
        },
      ],
    };
    console.log(this);

    this.input.on("pointerdown", () => {
      this.sys.game.destroy(true);
      this.sys.game.plugins.removeScenePlugin("GridEngine");
      // this.game.plugins.remove(GridEngine);
      document.addEventListener("mousedown", function newgame() {
        // this.scene.start("gridEngine", gridEngineConfig);
         this.game = new Phaser.Game(gameConfig);
        document.removeEventListener("mousedown", newgame);
      });
    });

    this.gridEngine.create(cloudCityTilemap, gridEngineConfig);
    this.gridEngine.movementStarted().subscribe(({ direction }) => {
      playerSprite.anims.play(direction);
    });

    this.gridEngine.movementStopped().subscribe(({ direction }) => {
      playerSprite.anims.stop();
      playerSprite.setFrame(this.getStopFrame(direction));
    });

    this.gridEngine.directionChanged().subscribe(({ direction }) => {
      playerSprite.setFrame(this.getStopFrame(direction));
    });
  }

  update() {
    const cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
      this.gridEngine.move("player", "up-left");
    } else if (cursors.right.isDown) {
      this.gridEngine.move("player", "down-right");
    } else if (cursors.up.isDown) {
      this.gridEngine.move("player", "up-right");
    } else if (cursors.down.isDown) {
      this.gridEngine.move("player", "down-left");
    }
  }
  createPlayerAnimation(name, startFrame, endFrame) {
    this.anims.create({
      key: name,
      frames: this.anims.generateFrameNumbers("player", {
        start: startFrame,
        end: endFrame,
      }),
      frameRate: 5,
      repeat: -1,
      yoyo: false,
    });
  }

  getStopFrame(direction) {
    switch (direction) {
      case "up-right":
        return 25;
      case "down-right":
        return 35;
      case "down-left":
        return 5;
      case "up-left":
        return 15;
      default:
        return 0;
    }
  }
}

const gameConfig = {
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  // scale: {
  //   mode: Phaser.Scale.FIT,
  //   autoCenter: Phaser.Scale.CENTER_BOTH,
  //   width: 800,
  //   height: 600,
  // },

  scene: MainScene,
  plugins: {
    scene: [
      {
        key: "GridEngine",
        plugin: GridEngine,
        mapping: "gridEngine",
      },
    ],
  },
};


export default function IonEx() {
  const gameConfig2 = {
    width: 200,
    height: 200,
    type: Phaser.AUTO,
    scene: {
      init: function () {
        this.cameras.main.setBackgroundColor("#24252A");
      },
      create: function () {
        this.helloWorld = this.add.text(
          this.cameras.main.centerX,
          this.cameras.main.centerY,
          "Hello World",
          {
            font: "1rem Arial",
            fill: "#ffffff",
          }
        );
        this.helloWorld.setOrigin(0.5);
      },
      update: function () {
        this.helloWorld.angle += 1;
      },
    },
  };



  const gameRef = useRef();
  const [game, setGame] = useState(gameConfig);
  const [initialize, setInitialize] = useState(true);

  const destroy = () => {
    console.log(gameRef.current);
    gameRef.current?.game.plugins.scene.splice(0, 1);
    gameRef.current?.destroy();
    // console.log(gameConfig);
    setInitialize(false);
    // setGame(null)
  };

  //   useEffect(() => {
  //     if (initialize) {
  //         setGame(gameConfig2)
  //     }
  // }, [initialize])
  // console.log(gameConfig);

  const Start = () => {
    setGame(gameConfig);
    setInitialize(true);
  };
  const StartOther = () => {
    setGame(gameConfig2);
    setInitialize(true);
  };
  const events = {
    ON_UPDATE: 'ON_UPDATE',
    ON_BUTTON_CLICK: 'ON_BUTTON_CLICK'
  }
  const [frame, setFrame] = useState(0)
  const emit = useEventEmitter(events.ON_BUTTON_CLICK)
  useEventListener(events.ON_UPDATE, (event) => {
    setFrame((frame) => (frame += 1))
  })
  return (
    <div className="App">
      <header className="App-header">
        {initialize ? (
          <>
            {/* <IonPhaser ref={gameRef} game={game} initialize={initialize} /> */}
            <GameComponent config={gameConfig2} >
              <div>
              <button
      onClick={() => {
        emit('Button clicked!')
      }}
    >
      Emit game event
    </button>
              </div>

            </GameComponent>
            <div onClick={destroy} className="flex destroyButton">
              <a href="#1" className="bttn">
                Destroy
              </a>
            </div>
          </>
        ) : (
          <>
            {/* <img src={logo} className="App-logo" alt="logo" /> */}
            <div onClick={() => Start()} className="flex">
              <a href="#1" className="bttn">
                Initialize
              </a>
            </div>
            <button onClick={() => StartOther()}>Start Other</button>
          </>
        )}
      </header>
    </div>
  );
}
