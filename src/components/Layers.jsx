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

  // function createObjects(collisionGroups) {
  //   const player = this.physics.add.sprite(100, 100, "player");
  //   player.setCollideWorldBounds(true);
  //   player.body.setGravityY(300);
  //   player.body.setSize(16, 16);
  //   player.body.setOffset(8, 8);
  //   player.body.setBounce(0.2);
  //   player.body.setDragX(1000);
  //   player.body.setCollideWorldBounds(true);
  //   player.body.setCollisionGroup(collisionGroups.player);
  //   player.body.collides([collisionGroups.platforms, collisionGroups.spikes]);
  //   player.body.onWorldBounds = true;

  //   createPlayerAnimation.call(this, "idle", 0, 0);
  //   createPlayerAnimation.call(this, "run", 1, 3);
  //   createPlayerAnimation.call(this, "jump", 4, 4);
  //   createPlayerAnimation.call(this, "fall", 5, 5);
  //   createPlayerAnimation.call(this, "hurt", 6, 6);

  //   player.anims.play("idle");

  //   return { player };

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
  function tintTile(tilemap, row, col, color) {
    for (let i = 0; i < tilemap.layers.length; i++) {
      tilemap.layers[i].tilemapLayer.layer.data[row][col].tint = color;
    }
  }
  function hasTrigger(tilemap, position) {
    return tilemap.layers.some((layer) => {
      const tile = tilemap.getTileAt(position.x, position.y, false, layer.name);
      return tile?.properties?.trigger;
    });
  }
  function hasColorTrigger(tilemap, position, colorProps, direction) {
    return tilemap.layers.some((layer) => {
      let tile;
      if (direction === "up-right") {
        tile = tilemap.getTileAt(
          position.x,
          position.y - parseInt(colorProps.range),
          false,
          layer.name
        );
      } else if (direction === "down-right") {
        tile = tilemap.getTileAt(
          position.x + parseInt(colorProps.range),
          position.y,
          false,
          layer.name
        );
      } else if (direction === "down-left") {
        tile = tilemap.getTileAt(
          position.x,
          position.y + parseInt(colorProps.range),
          false,
          layer.name
        );
      } else if (direction === "up-left") {
        tile = tilemap.getTileAt(
          position.x - parseInt(colorProps.range),
          position.y,
          false,
          layer.name
        );
      }
      return tile?.properties?.color === colorProps.color;
    });


  }

  let upperText;
  // let draggable;
  // let sabit;
  const config = {
    // scale: {
    //   // mode: Phaser.Scale.FIT,
    //   autoCenter: Phaser.Scale.CENTER_BOTH,
    // },
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    scene: {
      preload: function () {
        this.load.image("iso-tile", "assets/onelayer/ground3.png");
        this.load.image("drag", "assets/rock.png");
        this.load.image("drag2", "assets/rock.png");
        // this.load.image("sabit", "assets/rock.png");
        this.load.tilemapTiledJSON(
          "iso-tileset",
          "assets/onelayer/layers2.json"
        );
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

        this.ddraggable = this.add.sprite(0, 0, "drag");
        this.ddraggable.scale = 0.5;
        this.ddraggable.setInteractive();
        this.input.setDraggable(this.ddraggable);
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

        tintTile(cloudCityTilemap, 0, 4, 0xff0000);

        // console.log(this);
        upperText = this.add.text(-50, -30, "position", {
          fontSize: "20px",
          color: "#fff",
        });
        const container = this.add.container(0, 0, [
          playerSprite,
          // this.facingDirectionText,
          upperText,
        ]);
        this.cameras.main.startFollow(container, true);
        this.cameras.main.setFollowOffset(
          -playerSprite.width,
          -playerSprite.height
        );

        // this.cameras.main.setZoom(0.55);
        // this.cameras.main.centerOn(70, 0);
        // this.cameras.main.setBackgroundColor("#ffffff");

        // this.game.events.on("myEvent", function (data) {
        //   console.log(data);

        // });

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
              // charLayer: 0, //! this is the layer for the sprite
            },
          ],
        };
        this.gridEngine.create(cloudCityTilemap, gridEngineConfig);
        this.gridEngine.movementStarted().subscribe(({ direction }) => {
          playerSprite.anims.play(direction);
        });
        const _this = this;
        this.detectColor = { color: "blue", range: 1 };
        this.gridEngine
          .positionChangeFinished()
          .subscribe(({ charId, exitTile, enterTile }) => {
            const direction = _this.gridEngine.getFacingDirection("player");
            // console.log(charId, exitTile,enterTile );
            // console.log(direction);
            // if (hasTrigger(cloudCityTilemap, enterTile)) {
            //   console.log("triggered");
            // }
            // if (hasTrigger(cloudCityTilemap, exitTile)) {
            //   console.log("distriggered");
            // }
            if (
              hasColorTrigger(
                cloudCityTilemap,
                enterTile,
                this.detectColor,
                direction
              )
            ) {
              console.log(this.detectColor);
            }
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
        this.gridEngine.addLabels("player", ["red"]);
        // console.log(this.gridEngine.hasCharacter("Draggable"));
        const label = this.gridEngine.getLabels("player");

        console.log(label);

        console.log(this.gridEngine.collidesWithTiles("player"));
        console.log(this.gridEngine.getCharactersAt({ x: 4, y: 0 }, "trees"));
        // console.log(this.gridEngine.getLabels("Draggable"));
        console.log(this.gridEngine.getCharLayer("player"));
        // console.log(this.gridEngine.movementStopped());
        // console.log(this.gridEngine.movementStarted());
      },

      update: function () {
        const cursors = this.input.keyboard.createCursorKeys();
        if (cursors.left.isDown) {
          this.gridEngine.move("player", "up-left");
          // console.log(this.gridEngine.movementStarted());
          // console.log(this.gridEngine.movementStopped());
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
          if (data === "down-left") {
            _this.gridEngine.move("player", "down-left");
          } else if (data === "down-right") {
            _this.gridEngine.move("player", "down-right");
          } else if (data === "up-left") {
            _this.gridEngine.move("player", "up-left");
          } else if (data === "up-right") {
            _this.gridEngine.move("player", "up-right");
          }
        });
        this.game.events.on("moveTo", function (data) {
          const position = _this.gridEngine.getPosition("player");
          console.log(position);
          console.log(data);
          if (data.dir === "down-left") {
            if (position.y + data.y > 9) {
              _this.gridEngine.moveTo("player", { x: position.x, y: 10 });
            } else {
              _this.gridEngine.moveTo("player", {
                x: position.x,
                y: position.y + data.y,
              });
            }
          } else if (data.dir === "down-right") {
            if (position.y + data.y > 9) {
              _this.gridEngine.moveTo("player", { x: 9, y: position.y });
            } else {
              _this.gridEngine.moveTo("player", {
                x: position.x + data.x,
                y: position.y,
              });
            }
          } else if (data.dir === "up-left") {
            if (position.y - data.y < 0) {
              _this.gridEngine.moveTo("player", { x: 0, y: position.y });
            } else {
              _this.gridEngine.moveTo("player", {
                x: position.x - data.x,
                y: position.y,
              });
            }
          } else if (data.dir === "up-right") {
            if (position.y - data.y < 0) {
              _this.gridEngine.moveTo("player", { x: position.x, y: 0 });
            } else {
              _this.gridEngine.moveTo("player", {
                x: position.x,
                y: position.y - data.y,
              });
            }
          }
        });
        this.game.events.on("colorEvent", function (data) {
          _this.detectColor = data;
        });
        this.game.events.on("setBackground", function (data) {
          console.log(upperText);
          upperText.setStyle({
            color: data.color,
            });
          _this.cameras.main.setBackgroundColor(data.bgColor);
        });
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
          if (data === "turn-up-left") {
            _this.gridEngine.turnTowards("player", "up-right");
          }
        });

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

        if (
          this.gridEngine.getPosition("player").x === 0 &&
          this.gridEngine.getPosition("player").y === 2 &&
          this.gridEngine.getFacingDirection("player") === "down-left"
        ) {
          upperText.text = "Yol bitti. Dönüş yapılıyor";
          // this.gridEngine.setSprite("player", this.newPlayerSprite);
        } else if (
          this.gridEngine.getPosition("player").x === 0 &&
          this.gridEngine.getPosition("player").y === 2 &&
          this.gridEngine.getFacingDirection("player") === "up-left"
        ) {
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
  const [currentColor, setCurrentColor] = useState("blue");
  const [currentRange, setCurrentRange] = useState("1");
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
      <button
        onClick={() => currentGame?.events.emit("myEvent", "hello everybody")}
      >
        say hello console
      </button>
      {/* <button onClick={() => currentGame?.events.emit("myEvent3", "hello everybody")}>
        say hello upper
      </button> */}
      <div>
        <button onClick={() => currentGame?.events.emit("myEvent2", "up-left")}>
          Up Left
        </button>
        <button
          onClick={() => currentGame?.events.emit("myEvent2", "up-right")}
        >
          Up Right
        </button>
        <button
          onClick={() => currentGame?.events.emit("myEvent2", "down-left")}
        >
          Down Left
        </button>
        <button
          onClick={() => currentGame?.events.emit("myEvent2", "down-right")}
        >
          Down Right
        </button>
        <button
          onClick={() => currentGame?.events.emit("turnEvent", "turn-up-left")}
        >
          Turn Up-Left
        </button>
        <button onClick={() => currentGame?.events.emit("setSpeed", 4)}>
          Set Speed 2X
        </button>
        <button onClick={() => currentGame?.events.emit("setSpeed", 2)}>
          Set Speed Normal
        </button>
        <button
          onClick={() =>
            currentGame?.events.emit("moveTo", { dir: "down-left", y: 2 })
          }
        >
          Move To Down-left
        </button>
        <button
          onClick={() =>
            currentGame?.events.emit("moveTo", { dir: "down-right", x: 5 })
          }
        >
          Move To Down-left
        </button>
        <button
          onClick={() =>
            currentGame?.events.emit("moveTo", { dir: "up-left", x: 8 })
          }
        >
          Move To Down-left
        </button>
        <button
          onClick={() =>
            currentGame?.events.emit("moveTo", { dir: "up-right", y: 5 })
          }
        >
          Move To Down-left
        </button>
          <div>
          <p>Color detection</p>
        <label htmlFor="color">Select Color</label>
        <select
          name="color"
          id="color"
          onChange={(e) => {
            setCurrentColor(e.target.value);
            currentGame?.events.emit("colorEvent", {
              color: e.target.value,
              range: currentRange,
            });
          }}
          >
          <option value="blue">Blue</option>
          <option value="red">Red</option>
        </select>
        <label htmlFor="range">Select Range</label>
        <select
          name="range"
          id="range"
          onChange={(e) => {
            setCurrentRange(e.target.value);
            currentGame?.events.emit("colorEvent", {
              color: currentColor,
              range: e.target.value,
            });
          }}
          >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
          </div>
          <button
          onClick={() =>
            currentGame?.events.emit("setBackground", {bgColor: "#000000", color: "#ffffff"})
          }
          >
            Set Background Night
          </button>
          <button
          onClick={() =>
            currentGame?.events.emit("setBackground", {bgColor:"#c9f6ff", color:"#000000"})
          }
          >
            Set Background DayTime
          </button>
      </div>
    </>
  );
}
