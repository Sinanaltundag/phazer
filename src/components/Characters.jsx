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
  // function createTurnAnimation(name, startFrame, endFrame) {
  //   this.anims.create({
  //     key: name,
  //     frames: this.anims.generateFrameNumbers("player", {
  //       start: startFrame,
  //       end: endFrame,
  //     }),
  //     frameRate: 5,
  //     repeat: -1,
  //     yoyo: false,
  //   });
  // }



  function getStopFrame(direction) {
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
let upperText;
let draggable;
  const config = {

    width: 800,
    height: 600,
    type: Phaser.AUTO,
    scene: {
      preload: function () {
        this.load.image("iso-tile", "assets/onelayer/ground.png");
        this.load.image("drag", "assets/rock.png");
        this.load.tilemapTiledJSON("iso-tileset", "assets/onelayer/onelayer.json");
        this.load.spritesheet("player", "assets/iso_char.png", {
          frameWidth: 15,
          frameHeight: 32,
        });
        // this.load.spritesheet("player2", "assets/iso_char.png", {
        //   frameWidth: 15,
        //   frameHeight: 32,
        // });
      },
      create: function () {
        const cloudCityTilemap = this.make.tilemap({ key: "iso-tileset" });
        cloudCityTilemap.addTilesetImage("iso-tileset", "iso-tile");
        for (let i = 0; i < cloudCityTilemap.layers.length; i++) {
          const layer = cloudCityTilemap.createLayer(i, "iso-tileset", 0, 0);
          layer.scale = 1;
        }
        const playerSprite = this.add.sprite(0, 0, "player");
        playerSprite.scale = 2;

        draggable = this.add.sprite(0, 0, "drag");
        draggable.scale = 0.5;
        draggable.setInteractive();
        this.input.setDraggable(draggable);
        this.input.on("drag", function (pointer, gameObject, dragX, dragY) {
          gameObject.x = dragX;
          gameObject.y = dragY;
        });
        this.input.on("dragstart", function (pointer, gameObject) {
          gameObject.setTint(0xff0000);
        });
        this.input.on("dragend", function (pointer, gameObject) {
          gameObject.clearTint();
        });

        
        // draggable.scale = 0.3;
        // draggable.anchor.set(0.5);
        // draggable.inputEnabled = true;
        // draggable.input.enableDrag();
        // draggable.input.enableSnap(32, 32, false, true);
        // draggable.input.allowHorizontalDrag = false;
        // draggable.input.allowVerticalDrag = false;
        // draggable.input.boundsRect = new Phaser.Geom.Rectangle(0, 0, 800, 600);
        // draggable.input.setDragLock(true, false);
        // this.facingDirectionText = this.add.text(-60, -30, "direction", {
        //   fontSize: "20px",
        //   fill: "white",
        //  });
         console.log(this);
        upperText = this.add.text(-50, -30, "position", {
          fontSize: "20px",
          fill: "white",
          });
        const container = this.add.container(0, 0, [
          playerSprite,
          // this.facingDirectionText,
          upperText,
        ]);
        this.cameras.main.startFollow(container, true);
        this.cameras.main.setFollowOffset(-playerSprite.width, -playerSprite.height);

        // this.cameras.main.setZoom(0.55);
        // this.cameras.main.centerOn(70, 0);
        this.cameras.main.setBackgroundColor("white");

        this.game.events.on("myEvent", function (data) {
           console.log(data);
           
          });
  
          createPlayerAnimation.call(this, "up-right", 26, 29);
          createPlayerAnimation.call(this, "down-right", 36, 39);
          createPlayerAnimation.call(this, "down-left", 6, 9);
          createPlayerAnimation.call(this, "up-left", 16, 19);
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
            // {
            //   id: "Draggable",
            //   sprite: draggable, //! this is the sprite but if container used  it will cause error
            //   // offsetY: -5, //! this is the offset for the sprite but it causes a bug
            //   startPosition: { x: 2, y: 2 },
            //   walkingAnimationEnabled: false,
            //   speed: 2,
            //   draggable: true,
              
            // },
            

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
        console.log(this.gridEngine.hasCharacter("Draggable"));
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
            if ( position.y+data.y > 9) {
              _this.gridEngine.moveTo("player", {x:position.x , y:10});
            } else {
            _this.gridEngine.moveTo("player", {x:position.x , y:position.y+data.y});
            }
          } else if (data.dir==="down-right") {
            if ( position.y+data.y > 9) {
              _this.gridEngine.moveTo("player", {x:9 , y:position.y});
            } else {
            _this.gridEngine.moveTo("player", {x:position.x+data.x , y:position.y});
            }
          } else if (data.dir==="up-left") {
            if ( position.y-data.y < 0) {
              _this.gridEngine.moveTo("player", {x:0 , y:position.y});
            } else {
            _this.gridEngine.moveTo("player", {x:position.x-data.x , y:position.y});
            }
          } else if (data.dir==="up-right") {
            if ( position.y-data.y < 0) {
              _this.gridEngine.moveTo("player", {x:position.x , y:0});
            } else {
            _this.gridEngine.moveTo("player", {x:position.x , y:position.y-data.y});
            }
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
            _this.gridEngine.turnTowards("player", "up-right");
          }});

        //  upperText.text = `isMoving: ${this.gridEngine.isMoving("player")}`;
         this.game.events.on("myEvent3", function (data) {
          console.log(data);
        });
        // this.facingDirectionText.text = `Direction: ${this.gridEngine.getFacingDirection(
        //   "player"
        // )}`;
        // upperText.text = `Position: (${
        //   this.gridEngine.getPosition("player").x
        // })`;

        if (this.gridEngine.getPosition("player").x === 0 && this.gridEngine.getPosition("player").y === 2 && this.gridEngine.getFacingDirection("player") === "down-left") {
          upperText.text = "Yol bitti. Dönüş yapılıyor";
          // this.gridEngine.setSprite("player", this.newPlayerSprite);
        } else if (this.gridEngine.getPosition("player").x === 0 && this.gridEngine.getPosition("player").y === 2 && this.gridEngine.getFacingDirection("player") === "up-left") {
          upperText.text = "Yol bitti. Dönüş yapılıyor";
        } else {
          upperText.text = `Position: (${
            this.gridEngine.getPosition("player").x
          }, ${this.gridEngine.getPosition("player").y})`;
        }

        
        // upperText.text = `Position: (${
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
  // console.log(currentGame);
  
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
      <button onClick={() => currentGame?.events.emit("moveTo", {dir:"down-right", x: 5})}>Move To Down-left</button>
      <button onClick={() => currentGame?.events.emit("moveTo", {dir:"up-left", x: 8})}>Move To Down-left</button>
      <button onClick={() => currentGame?.events.emit("moveTo", {dir:"up-right", y: 5})}>Move To Down-left</button>

      </div>
    </>
  );
}
