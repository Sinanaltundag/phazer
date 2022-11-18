import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { IonPhaser } from "@ion-phaser/react";
import { GridEngine } from "grid-engine";


// var game = new Phaser.Game(config);

export default function App() {

  function createPlayerAnimation(name, startFrame, endFrame) {
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

  function getStopFrame(direction) {
    switch (direction) {
      case "up-right":
        return 16;
      case "down-right":
        return 0;
      case "down-left":
        return 5;
      case "up-left":
        return 15;
      default:
        return 0;
    }
  }
// let upperText;
  const config = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    scene: {
      preload: function () {
        this.load.image("iso-tile", "assets/onelayer/ground.png");
        
        this.load.tilemapTiledJSON("iso-tileset", "assets/onelayer/onelayer.json");
        this.load.spritesheet("player", "assets/tank.png", {
          frameWidth: 128,
          frameHeight: 128,
        });
      },
      create: function () {
        const cloudCityTilemap = this.make.tilemap({ key: "iso-tileset" });
        cloudCityTilemap.addTilesetImage("iso-tileset", "iso-tile");
        for (let i = 0; i < cloudCityTilemap.layers.length; i++) {
          const layer = cloudCityTilemap.createLayer(i, "iso-tileset", 0, 0);
          layer.scale = 1;
        }
        const playerSprite = this.add.sprite(0, 0, "player");
        playerSprite.scale = 0.5;
        
        // this.facingDirectionText = this.add.text(-60, -30, "direction", {
        //   fontSize: "20px",
        //   fill: "white",
        //  });
         console.log(this);
        const facingPositionText = this.add.text(-50, -30, "position", {
          fontSize: "20px",
          fill: "white",
          });
        const container = this.add.container(0, 0, [
          playerSprite,
          // this.facingDirectionText,
          facingPositionText,
        ]);
        this.cameras.main.startFollow(container, true);
        this.cameras.main.setFollowOffset(-playerSprite.width, -playerSprite.height);

        // this.cameras.main.setZoom(0.55);
        // this.cameras.main.centerOn(70, 0);
        this.cameras.main.setBackgroundColor("white");

        this.game.events.on("myEvent", function (data) {
           console.log(data);
           
          });
  
        createPlayerAnimation.call(this, "up-right", 14, 14);
        createPlayerAnimation.call(this, "down-right", 13, 13);
        createPlayerAnimation.call(this, "down-left", 3, 3);
        createPlayerAnimation.call(this, "up-left", 16, 16);
          
        const gridEngineConfig = {
          characters: [
            {
              id: "player",
              // sprite: playerSprite, //! this is the sprite but if container used  it will cause error
              // offsetY: -5, //! this is the offset for the sprite but it causes a bug
              startPosition: { x: 0, y: 0 },
              offsetX: 50,
              walkingAnimationEnabled: false,
              speed: 4,
              container,
            },
          ],
        };
        this.gridEngine.create(cloudCityTilemap, gridEngineConfig);
        this.gridEngine.movementStarted().subscribe(({ direction }) => {
          playerSprite.anims.play(direction);
        });

        this.gridEngine.movementStopped().subscribe(({ direction }) => {
          playerSprite.anims.stop();
          playerSprite.setFrame(getStopFrame(direction));
        });

        this.gridEngine.directionChanged().subscribe(({ direction }) => {
          playerSprite.setFrame(getStopFrame(direction));
        });
         // EXPOSE TO EXTENSION
        window.__GRID_ENGINE__ = this.gridEngine;
      },

      update: function () {
        const cursors = this.input.keyboard.createCursorKeys();
        if (cursors.left.isDown) {
          this.gridEngine.move("player", "up-left");
        } else if (cursors.right.isDown) {
          this.gridEngine.move("player", "down-right");
        } else if (cursors.up.isDown) {
          this.gridEngine.move("player", "up-right");
        } else if (cursors.down.isDown) {
          for (let index = 0; index < 5; index++) {
            
            this.gridEngine.move("player", "down-left");
          }
        }
        const _this = this;
        this.game.events.on("myEvent2", function (data) {
          if (data==="down-left") {
            _this.gridEngine.move("player", "down-left");
          } else if (data==="down-right") {
            _this.gridEngine.move("player", "down-right");
          } else if (data==="up-left") {
            _this.gridEngine.move("player", "up-left");
          } else if (data==="up-right") {
            _this.gridEngine.move("player", "up-right");
          }
         });
         this.game.events.on("moveTo", function (data) {
          const position = _this.gridEngine.getPosition("player")
          console.log(position);
          console.log(data);
          if (data.dir==="down-left") {
            _this.gridEngine.moveTo("player", {x:7 , y:4});
          }
          });
        //  facingDirectionText.text = `facingDirection: ${this.gridEngine.getFacingDirection(
        //   "player"
        // )}`;
        // console.log(this.gridEngine.getFacingDirection("player"));
        // console.log(this.create());
        //  this.create.facingDirectionText.text = `facingDirection: ${this.gridEngine.getFacingDirection(
        //   "player"
        // )}`;
        //* change speed function
        this.game.events.on("setSpeed", function (data) {
          _this.gridEngine.setSpeed("player", data);
          });
        // * change rotation function
        this.game.events.on("turnEvent", function (data) {
          if (data==="turn-up-left") {
            _this.gridEngine.turnTowards("player", "up-left");
          }});

        //  upperText.text = `isMoving: ${this.gridEngine.isMoving("player")}`;
         this.game.events.on("myEvent3", function (data) {
          console.log(data);
        });
        // this.facingDirectionText.text = `Direction: ${this.gridEngine.getFacingDirection(
        //   "player"
        // )}`;
        // this.facingPositionText.text = `Position: (${
        //   this.gridEngine.getPosition("player").x
        // }, ${this.gridEngine.getPosition("player").y})`;
      },
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
      <button onClick={() => currentGame?.events.emit("moveTo", {dir:"down-left", y: 2})}>Move To Down-left</button>

      </div>
    </>
  );
}
