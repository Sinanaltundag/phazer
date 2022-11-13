import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { IonPhaser } from "@ion-phaser/react";
import { GridEngine } from "grid-engine";

// var game = new Phaser.Game(config);

export default function App() {
  function preload() {
    this.load.image("tiles", "assets/cloud_tileset.png");
    this.load.tilemapTiledJSON(
      "cloud-city-map",
      "assets/cloud_city_bridge_only.json"
    );
  
    this.load.spritesheet("player", "assets/characters.png", {
      frameWidth: 52,
      frameHeight: 72,
    });
  }
  
  function create() {
    const tilemap = this.make.tilemap({ key: "cloud-city-map" });
    tilemap.addTilesetImage("cloud_tileset", "tiles");
    for (let i = 0; i < tilemap.layers.length; i++) {
      const layer = tilemap.createLayer(i, "cloud_tileset", 0, 0);
      layer.scale = 3;
    }
    const playerSprite = this.add.sprite(0, 0, "player");
    playerSprite.scale = 1.5;
    this.cameras.main.startFollow(playerSprite, true);
    this.cameras.main.setFollowOffset(-playerSprite.width, -playerSprite.height);
  
    const gridEngineConfig = {
      characters: [
        {
          id: "player",
          sprite: playerSprite,
          walkingAnimationMapping: 2,
          startPosition: { x: 5, y: 4 },
          charLayer: "ground",
        },
      ],
    };
  
    this.gridEngine.create(tilemap, gridEngineConfig);
  
    this.gridEngine.setTransition({ x: 5, y: 9 }, "ground", "bridge");
    this.gridEngine.setTransition({ x: 5, y: 10 }, "bridge", "ground");
    window.__GRID_ENGINE__ = this.gridEngine;
  }
  
  function update() {
    const cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
      if (cursors.left.getDuration() < 100) {
        this.gridEngine.turnTowards("player", "left");
      } else {
      this.gridEngine.move("player", "left");
      }
    } else if (cursors.right.isDown) {
      this.gridEngine.move("player", "right");
    } else if (cursors.up.isDown) {
      this.gridEngine.move("player", "up");
    } else if (cursors.down.isDown) {
      this.gridEngine.move("player", "down");
    }
    // if (this.cursors.left.isDown) {
    //   if (this.cursors.left.getDuration() < 150) {
    //     this.gridEngine.turnTowards("player", "left")
    //   } else {
    //     this.gridEngine.move("player", "left")
    //   }
    // } else if (this.cursors.right.isDown) {
    //   if (this.cursors.right.getDuration() < 150) {
    //     this.gridEngine.turnTowards("player", "right")
    //   } else {
    //     this.gridEngine.move("player", "right")
    //   }
    // } else if (this.cursors.up.isDown) {
    //   if (this.cursors.up.getDuration() < 150) {
    //     this.gridEngine.turnTowards("player", "up")
    //   } else {
    //     this.gridEngine.move("player", "up")
    //   }
    // } else if (this.cursors.down.isDown) {
    //   if (this.cursors.down.getDuration() < 150) {
    //     this.gridEngine.turnTowards("player", "down")
    //   } else {
    //     this.gridEngine.move("player", "down")
    //   }
    // }
    const _this = this;
        this.game.events.on("myEvent2", function (data) {
          if (data==="down-left") {
            _this.gridEngine.move("player", "down");
          } else if (data==="down-right") {
            _this.gridEngine.move("player", "right");
          } else if (data==="up-left") {
            _this.gridEngine.move("player", "left");
          } else if (data==="up-right") {
            _this.gridEngine.move("player", "up");
          }
         });
    this.game.events.on("turnEvent", function (data) {
      if (data==="turn-up-left") {
        console.log("turn up");
        _this.gridEngine.turnTowards("player", "up");
      }});
  }
// let upperText;
  const config = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    scene: {
      preload,
      create,
      update,
    },
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
  const [initialize, setInitialize] = useState(true);
  const [currentGame, setCurrentGame] = useState(null);
  const [game, setGame] = useState(config);
  const gameRef = useRef(null);
  const game1 = () => {
    gameRef.current?.getInstance().then((instance) => {
      setCurrentGame(instance);
    });
  };

  useEffect(() => {
    if (initialize) {
      game1();
    }
  }, [initialize]);
  console.log(currentGame);
  
  // Call `setInitialize` when you want to initialize your game! :)
  const destroy = async () => {
    if (gameRef.current) {
      // gameRef.current.getInstance().then(game=> game.plugins.removeScenePlugin('GridEngine'))
      await currentGame.plugins.removeScenePlugin("GridEngine");
      gameRef.current.destroy();
    }
    setInitialize(false);
  };
  return (
    <>
      <IonPhaser game={game} ref={gameRef} initialize={initialize} />
      {/* <button onClick={() => setGame(config)}>Change Level Back</button> */}
      <button onClick={() => setInitialize(true)}>Initialize</button>
      <button onClick={destroy}>Destroy</button>
      <button onClick={() => currentGame?.events.emit("myEvent", "hello everybody")}>
        say hello console
      </button>
      {/* <button onClick={() => currentGame?.events.emit("myEvent3", "hello everybody")}>
        say hello upper
      </button> */}
      <div>
      <button onClick={() => currentGame?.events.emit("myEvent2", "up-left")} >Up Left</button>
      <button onClick={() => currentGame?.events.emit("myEvent2", "up-right")} >Up Right</button>
      <button onClick={() => currentGame?.events.emit("myEvent2", "down-left")} >Down Left</button>
      <button onClick={() => currentGame?.events.emit("myEvent2", "down-right")}>Down Right</button>
      <button onClick={() => currentGame?.events.emit("turnEvent", "turn-up-left")}>Turn Up-Left</button>
      <button onClick={() => currentGame?.events.emit("setSpeed", 4)}>Set Speed 2X</button>
      <button onClick={() => currentGame?.events.emit("setSpeed", 2)}>Set Speed Normal</button>

      </div>
    </>
  );
}
