import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { IonPhaser } from "@ion-phaser/react";
import { GridEngine } from "grid-engine";

// var game = new Phaser.Game(config);

export default function App() {

  const [isStopped, setIsStopped] = useState(true);

  function createPlayerAnimation(
    name,
    startFrame,
    endFrame,
    frameRate,
    spriteName
  ) {
    this.anims.create({
      key: name,
      frames: this.anims.generateFrameNumbers( spriteName , {
        start: startFrame,
        end: endFrame,
      }),
      frameRate: frameRate,
      repeat: -1,
      yoyo: false,
    });
  }

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

  function isPositionAllowed(tilemap, position) {
    return tilemap.layers.every((layer) => {
      const tile = tilemap.getTileAt(position.x, position.y, false, layer.name);
      return tile?.properties?.allowed;
    });
  }
  let moveResult = new Promise((resolve, reject, func) => {
    resolve = func;
  });
  let aaa = 1;
  let spr;
  let playerSprite;
  let upperText;
  // let draggable;
  // let sabit;
  const config = {
    scale : {
      mode: Phaser.Scale.Zoom,

      // autoCenter: Phaser.Scale.CENTER_BOTH,
    },
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
        this.load.image("rock", "assets/rock.png");
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
        this.load.spritesheet("player2", "assets/iso_char_light.png", {
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
        playerSprite = this.add.sprite(0, 0, "player");
        playerSprite.scale = 2;

        spr= this.add.sprite(0, 0, "player2");
        spr.scale = 1.5;
        // this.playerSprite2 = this.add.sprite(0, 0, "player2");
        // playerSprite2.scale = 2;
        // playerSprite2.visible = false;

        this.rock = this.add.sprite(0, 0, "rock");
        this.rock.scale = 0.5;
        
        this.rock.setInteractive();
        this.input.setDraggable(this.rock);
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

        this.input.on("gameout", function (pointer, gameObject) {
          console.log("gameout");
        });

        this.input.on("wheel", function (pointer, gameObject, deltaX, deltaY) {
          console.log(deltaX, deltaY, pointer, gameObject);
          if ( _this.cameras.main.zoom + deltaY * 0.005 > 0.9 && _this.cameras.main.zoom + deltaY * 0.005 < 5) {
            _this.cameras.main.zoom += deltaY * 0.005;
            _this.cameras.main.centerOn(110, 110);
            // _this.cameras.main.setAlpha(0.5);
            // _this.cameras.main.setScroll(0, 90);
            // _this.cameras.main.setZoom(1.5);
            console.log(_this.cameras.main.centerX); 
            // _this.cameras.main.setFollowOffset(110, -110);
            // _this.cameras.main.height = 500;
            _this.cameras.main.setOrigin(0.5, 0.5);
          }
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

        createPlayerAnimation.call(
          this,
          "up-right",
          26,
          29,
          10,
          "player",
        );
        
        createPlayerAnimation.call(
          this,
          "down-right",
          36,
          39,
          10,
          "player",
          );
          createPlayerAnimation.call(
            this,
            "down-left",
            6,
            9,
            5,
            "player",
            );
            createPlayerAnimation.call(
              this,
              "up-left",
              16,
              19,
              5,
              "player",
              );

          
          const gridEngineConfig = {
            characters: [
            {
              id: "player",
              sprite: playerSprite, //! this is the sprite but if container used  it will cause error
              // offsetY: -5, //! this is the offset for the sprite but it causes a bug
              startPosition: { x: 0, y: 0 },
              offsetY: -20,
              // walkingAnimationMapping: {
              //   "up-left": {
              //     leftFoot: 18,
              //     standing: 15,
              //     rightFoot: 16,
              //   },
              //   "up-right": {
              //     leftFoot: 26,
              //     standing: 25,
              //     rightFoot: 28,
              //   },
              //   "down-left": {
              //     leftFoot: 6,
              //     standing: 5,
              //     rightFoot: 8,
              //   },
              //   "down-right": {
              //     leftFoot: 36,
              //     standing: 35,
              //     rightFoot: 38,
              //   },
              // },
              walkingAnimationEnabled: false,
              speed: 4,
              // container,
              // charLayer: 0, //! this is the layer for the sprite
            },
            // {
            //   id: "player2",
            //   sprite: playerSprite2,
            //   startPosition: { x: 0, y: 0 },
            //   offsetX: 50,
            //   walkingAnimationEnabled: false,
            //   speed: 4,
            // },
          ],
        };
        this.gridEngine.create(cloudCityTilemap, gridEngineConfig);
        const _this = this;
        this.detectColor = { color: "blue", range: 1 };
        this.gridEngine
        .movementStarted()
          .subscribe(({ direction, character }) => {
            setPosition(true);
          });
        playerSprite.on("animationcomplete", function () {
          console.log("animationcomplete");
        });
        

        // function straightMove(step) {
          //   const hedef = _this.gridEngine.getPosition("player");
          //   // console.log("hedef",hedef);
          //   this.gridEngine.movementStopped().subscribe(({ charId, direction }) => {
            //     const enterTile = _this.gridEngine.getPosition("player");
            //     console.log("enterTile",enterTile.x+1,enterTile.y+1);
        //     if (enterTile.x!==hedef.x+1) {
        //     _this.gridEngine.move("player", direction);
        //     }
        //   });
        // }
        // this.straightMove = straightMove.bind(this)
        // this.straightMove(3)
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
            // _this.gridEngine.stopMovement("player");
            // _this.gridEngine.move("player", "down-right");
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
            setPosition(false);
            // return { charId, exitTile, enterTile };
          });
        //   this.game.events.on("isPositionChanged", function () {
        //     _this.gridEngine.positionChangeFinished().subscribe(({ charId, exitTile, enterTile }) => {
        //       setPosition(enterTile);
        //   });
        // });

        // this.input.keyboard.on("keydown", (event) => {
        //   if (event.key === "a") {
        //     console.log("character adding");
        //     // this.gridEngine.removeCharacter("player");
        //     playerSprite.destroy();
        //     // playerSprite.destroy();
        //     this.gridEngine.removeCharacter("player");
        //     this.gridEngine.addCharacter("player", {
        //       sprite: playerSprite2,
        //       startPosition: { x: 5, y: 0 },
        //       offsetX: 50,
        //       walkingAnimationEnabled: false,
        //       speed: 4,
        //       charLayer: 0,
        //     });
        //     // console.log(this.gridEngine.getCharacter("player2"));

        //   }
        // });
        this.game.events.on("changeChar", function (data) {
          console.log(data);
          // const dir = _this.gridEngine.getFacingDirection("player");
          // playerSprite.anims.play("down-right");
          // const player2 = _this.add.sprite(0, 0, "player2");
          const player2 = _this.gridEngine.getSprite("player");
          console.log(player2);
          // const playerSprite2 = _this.add.sprite(0, 0, "player2");
          _this.gridEngine.setSprite("player", playerSprite);
          createPlayerAnimation.call(
            _this,
            "up-left",
            16,
            19,
            5,
            "player2",
            );
          // _this.gridEngine.removeCharacter("player");
          // _this.gridEngine.addCharacter("player", {
          //   sprite: playerSprite2,
          //   startPosition: { x: 5, y: 0 },
          //   offsetX: 50,
          //   walkingAnimationEnabled: false,
          //   speed: 4,
          //   charLayer: 0,
          // });
          // if (dir === "down-right") {
          //   playerSprite.setTexture(data, 35);
          // } else if (dir === "down-left") {
          //   playerSprite.setTexture(data, 5);
          // } else if (dir === "up-right") {
          //   playerSprite.setTexture(data, 25);
          // } else if (dir === "up-left") {
          //   playerSprite.setTexture(data, 15);
          // } else {
          //   playerSprite.setTexture(data, 0);
          // }
        });

        this.game.events.on("moveTo", function (data) {
          aaa += 1;
          console.log(aaa);
          const position = _this.gridEngine.getPosition("player");

          if (data.dir === "down-left") {
              _this.gridEngine.moveTo(
                "player",
                { x: position.x, y: data.y + position.y },
                {
                  noPathFoundStrategy: "CLOSEST_REACHABLE",
                  pathBlockedStrategy: "STOP",
                  isPositionAllowedFn: (pos) => {
                    console.log(pos);
                    return pos.x === position.x;
                  }
                }
                );
          } else if (data.dir === "down-right") {
            if (position.x + data.x < 10) {
              _this.gridEngine.moveTo("player", {
                x: position.x + data.x,
                y: position.y,
              },
              {
                noPathFoundStrategy: "CLOSEST_REACHABLE",
                pathBlockedStrategy: "STOP",
                isPositionAllowedFn: (pos) => {
                  console.log(pos);
                  return pos.y === position.y;
                }
              });
            }
          } else if (data.dir === "up-left") {
            if (position.x - data.x >= 0) {
              _this.gridEngine.moveTo("player", {
                x: position.x - data.x,
                y: position.y,
              },
              {
                noPathFoundStrategy: "CLOSEST_REACHABLE",
                pathBlockedStrategy: "STOP",
                isPositionAllowedFn: (pos) => {
                  console.log(pos);
                  return pos.y === position.y;
                }
              });
            }
          } else if (data.dir === "up-right") {
            if (position.y - data.y >= 0) {
              _this.gridEngine.moveTo("player", {
                x: position.x,
                y: position.y - data.y,
              },
              {
                noPathFoundStrategy: "CLOSEST_REACHABLE",
                pathBlockedStrategy: "STOP",
                isPositionAllowedFn: (pos) => {
                  console.log(pos);
                  return pos.x === position.x;
                }
              });
            }
          }
        });
        this.gridEngine.movementStarted().subscribe(({ direction }) => {
          this.gridEngine.getSprite("player").anims.play(direction);
          // spr.anims.play(direction);
        });
        this.gridEngine
        .movementStopped().subscribe(({ direction, character }) => {
          moveResult = direction;
          
        });
        _this.gridEngine.movementStopped().subscribe(({ direction }) => {
          setIsStopped(true);
        });
        _this.gridEngine.movementStarted().subscribe(({ direction }) => {
          setIsStopped(false);
        });

          // animations.call(_this, "player2");
          // console.log(_this.gridEngine.getSprite("player"))
          // _this.gridEngine.setSprite("player", playerSprite2);
          // _this.gridEngine.setWalkingAnimationMapping("player", {
          //   "up-left": {
          //     leftFoot: 18,
          //     standing: 15,
          //     rightFoot: 16,
          //   },

          // });

        this.gridEngine.movementStopped().subscribe(({ direction }) => {
          this.gridEngine.getSprite("player").anims.stop();
          this.gridEngine.getSprite("player").setFrame(getStopFrame(direction));
          // playerSprite.anims.stop();
          // spr.anims.stop();
          // spr.setFrame(getStopFrame(direction));
        });

        this.gridEngine.directionChanged().subscribe(({ direction }) => {
          this.gridEngine.getSprite("player").setFrame(getStopFrame(direction));
          // spr.setFrame(getStopFrame(direction));
        });

        this.gridEngine.addLabels("player", ["red"]);
        // console.log(this.gridEngine.hasCharacter("Draggable"));
        const label = this.gridEngine.getLabels("player");

        console.log(label);
        console.log(playerSprite);

        console.log(this.gridEngine.collidesWithTiles("player"));
        console.log(this.gridEngine.getCharactersAt({ x: 4, y: 0 }, "trees"));
        // console.log(this.gridEngine.getLabels("Draggable"));
        console.log(this.gridEngine.getCharLayer("player"));
        // console.log(this.gridEngine.movementStopped());
        // console.log(this.gridEngine.movementStarted());
      },

      update: async function () {
        const _this = this;
        const cursors = this.input.keyboard.createCursorKeys();
        const spaceBar = this.input.keyboard.addKey(
          Phaser.Input.Keyboard.KeyCodes.SPACE
        );
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
            // const  aaa= await this.gridEngine.movementStopped();
            // console.log(aaa);
          }
        } else if (spaceBar.isDown) {
          // console.log(this.gridEngine.getSprite("player"));
        //   createPlayerAnimation.call(
        //     _this,
        //     "up-right",
        //     26,
        //     29,
        //     10,
        //     "player2",
        //     );
        //     createPlayerAnimation.call(
        //       _this,
        //       "up-left",
        //       16,
        //       19,
        //       5,
        //       "player2",
        //       );
        // createPlayerAnimation.call(
        //   _this,
        //   "down-left",
        //   6,
        //   9,
        //   5,
        //   "player2",
        //   );
          // createPlayerAnimation.call(
          //   this,
          //   "down-right",
          //   36,
          //   39,
          //   10,
          //   "player2",
          //   );
          this.anims.create({
            key: "up-right",
            frames: this.anims.generateFrameNumbers("player2", {
              start: 26,
              end: 29,
            }),
            frameRate: 10,
            repeat: -1,
          });
            spr.setTexture("player2");
            spr.anims.play("down-right");
            this.gridEngine.setSprite("player", spr);
            playerSprite.visible=false;
            // this.gridEngine.stop("player");
        }
        this.game.events.on("myEvent2", function (data) {
          if (data.direction === "down-left") {
            _this.gridEngine.move("player", "down-left");
          } else if (data.direction === "down-right") {
            _this.gridEngine.move("player", "down-right");
          } else if (data.direction === "up-left") {
            _this.gridEngine.move("player", "up-left");
          } else if (data.direction === "up-right") {
            _this.gridEngine.move("player", "up-right");
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

        // if (
        //   this.gridEngine.getPosition("player").x === 0 &&
        //   this.gridEngine.getPosition("player").y === 2 &&
        //   this.gridEngine.getFacingDirection("player") === "down-left"
        // ) {
        //   upperText.text = "Yol bitti. Dönüş yapılıyor";
        //   // this.gridEngine.setSprite("player", this.newplayerSprite);
        // } else if (
        //   this.gridEngine.getPosition("player").x === 0 &&
        //   this.gridEngine.getPosition("player").y === 2 &&
        //   this.gridEngine.getFacingDirection("player") === "up-left"
        // ) {
        //   upperText.text = "Yol bitti. Dönüş yapılıyor";
        // } else {
        //   upperText.text = `Position: (${
        //     this.gridEngine.getPosition("player").x
        //   }, ${this.gridEngine.getPosition("player").y})`;
        // }

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
  const [position, setPosition] = useState(null);
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
        <button
          onClick={() =>
            currentGame?.events.emit("myEvent2", {
              direction: "up-left",
              step: 1,
            })
          }
        >
          Up Left
        </button>
        <button
          onClick={() => {
            currentGame?.events.emit("myEvent2", {
              direction: "up-right",
              step: 1,
            });
          }}
        >
          Up Right
        </button>
        <button
          onClick={() =>
            currentGame?.events.emit("myEvent2", {
              direction: "down-left",
              step: 1,
            })
          }
        >
          Down Left
        </button>
        <button
          onClick={() => {
            currentGame?.events.emit("myEvent2", {
              direction: "down-right",
              step: 1,
            });
          }}
        >
          Down Right
        </button>
        <button
          onClick={() => {
            currentGame?.events.emit("turnEvent", "turn-up-left");
          }}
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
          onClick={() =>{
            currentGame?.events.emit("moveTo", { dir: "down-left", y: 4 })
           console.log("moveee",moveResult) ;
          }
          }
        >
          Move To Down-left
        </button>
        <button
          onClick={() =>{
            currentGame?.events.emit("moveTo", { dir: "down-right", x: 4 })
           console.log("moveee",moveResult) ;
          }
          }
        >
          Move To Down-right
        </button>
        <button
          onClick={() =>
            currentGame?.events.emit("moveTo", { dir: "up-left", x: 2 })
          }
        >
          Move To Up-left
        </button>
        <button
          onClick={() =>
            currentGame?.events.emit("moveTo", { dir: "up-right", y: 2 })
          }
        >
          Move To Up-right
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
            currentGame?.events.emit("setBackground", {
              bgColor: "#000000",
              color: "#ffffff",
            })
          }
        >
          Set Background Night
        </button>
        <button
          onClick={() =>
            currentGame?.events.emit("setBackground", {
              bgColor: "#c9f6ff",
              color: "#000000",
            })
          }
        >
          Set Background DayTime
        </button>
        <button
          onClick={() => currentGame?.events.emit("changeChar", "player2")}
        >
          Change Character
        </button>
        <button
          onClick={() => currentGame?.events.emit("changeChar", "player")}
        >
          Change Character Back
        </button>
      </div>
    </>
  );
}
