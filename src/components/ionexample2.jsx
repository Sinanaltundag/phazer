import React, { useState, useEffect, useRef } from "react";
import Phaser from "phaser";
import { IonPhaser } from "@ion-phaser/react";
import { GridEngine } from "grid-engine";

// import './App.css'

class MainScene extends Phaser.Scene {
  preload() {
    this.load.image("tiles", "assets/iso_tile.png");
    this.load.tilemapTiledJSON("iso-map", "assets/isometric.json");
    this.load.spritesheet("player", "assets/iso_char.png", {
      frameWidth: 15,
      frameHeight: 32,
    });
    // this.load.plugin("GridEngine", "grid-engine/dist/GridEngine.min.js", true);
    // if (this.plugins.get("GridEngine")) {
    //   // this.plugins.installScenePlugin("GridEngine", GridEngine, "gridEngine", this);
    //   //   // this.plugins.installScenePlugin("GridEngine", GridEngine, "gridEngine");
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
      //   // this.scene.start("gridEngine", gridEngineConfig);
      //    this.game = new Phaser.Game(gameConfig);
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

  const gameConfig = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
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
  const gameRef = useRef();
  const [game, setGame] = useState();
  const [initialize, setInitialize] = useState(false);

  const destroy = () => {
    // gameRef.current?.game.plugins.scene.splice(0, 1);
    gameRef.current?.destroy();
    setInitialize(false);
    setGame(undefined)
  };

    useEffect(function call()  {
      if (initialize) {
          setGame(gameConfig)
      }

  }, [initialize])
  // console.log(gameConfig);

  const Start = () => {
    // setGame(gameConfig);
    setInitialize(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        {initialize ? (
          <>
            <IonPhaser ref={gameRef} game={game} initialize={initialize} onMouseDown={destroy}/>
            <div onClick={destroy} className="flex destroyButton">
              <a href="#1" className="bttn">
                Destroy
              </a>
            </div>
          </>
        ) : (
          <>
            <div onClick={() => Start()} className="flex">
              <a href="#1" className="bttn">
                Initialize
              </a>
            </div>
          </>
        )}
      </header>
    </div>
  );
}
