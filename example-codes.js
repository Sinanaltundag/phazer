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

const configFocus = {
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  scene: {
    preload,
    create: function () {
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

      this.game.events.on("myEvent", function (data) {
        console.log(this.currentGame?.current);
      });
      // upperText = this.add.text(-20, -10, "Player 1");
      // upperText.setColor("#000000");
      // upperText.setShadow(1, 1, "#ffffff", 2);
      // upperText.setFontSize(20);
      // const container = this.add.container(0, 0, [playerSprite, upperText]);
      // container.setDepth(100);
      // container.setSize(32, 32);
      this.cameras.main.setFollowOffset(
        -playerSprite.width,
        -playerSprite.height
      );

      createPlayerAnimation.call(this, "up-right", 26, 29);
      createPlayerAnimation.call(this, "down-right", 36, 39);
      createPlayerAnimation.call(this, "down-left", 6, 9);
      createPlayerAnimation.call(this, "up-left", 16, 19);

      const gridEngineConfig = {
        characters: [
          {
            id: "player",
            // container,
            sprite: playerSprite,
            startPosition: {
              x: lastPosition.x,
              y: lastPosition.y,
            },
            offsetY: -9,
            walkingAnimationEnabled: false,
            speed: 2,
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
      this.gridEngine
        .positionChangeFinished()
        .subscribe(({ charId, exitTile, enterTile }) => {
          setLastPosition(enterTile);
        });
      //  vm.postGame(exportCurrentGameArea);
    },

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

const configFixed = {
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  scene: {
    preload,
    create: function () {
      const cloudCityTilemap = this.make.tilemap({ key: "iso-map" });
      cloudCityTilemap.addTilesetImage("iso-tileset", "tiles");
      for (let i = 0; i < cloudCityTilemap.layers.length; i++) {
        const layer = cloudCityTilemap.createLayer(i, "iso-tileset", 0, 0);
        layer.scale = 3;
      }
      const playerSprite = this.add.sprite(0, 0, "player");
      playerSprite.scale = 3;

      this.cameras.main.setZoom(0.55);
      this.cameras.main.centerOn(100, 0);
      // this.cameras.main.setBackgroundColor("#ccccff");

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
            sprite: playerSprite,
            startPosition: {
              x: lastPosition.x,
              y: lastPosition.y,
            },
            offsetY: -9,
            walkingAnimationEnabled: false,
            speed: 2,
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
      this.gridEngine
        .positionChangeFinished()
        .subscribe(({ charId, exitTile, enterTile }) => {
          setLastPosition(enterTile);
        });
    },

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
const configNew = {
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    // autoCenter: Phaser.Scale.CENTER_VERTICALLY,
  },
  width: 480,
  height: 360,

  type: Phaser.AUTO,
  scene: {
    preload,
    create: function () {
      const cloudCityTilemap = this.make.tilemap({
        key: "layers-map",
      });
      cloudCityTilemap.addTilesetImage("layers-map", "ground2");
      for (let i = 0; i < cloudCityTilemap.layers.length; i++) {
        const layer = cloudCityTilemap.createLayer(i, "layers-map", 0, 0);
        layer.scale = 0.75;
      }
      const playerSprite = this.add.sprite(0, 0, "player");
      playerSprite.scale = 2;
      this.draggable = this.add.sprite(0, 0, "rock");
      this.draggable.scale = 0.5;
      this.draggable.setInteractive();
      this.input.setDraggable(this.draggable);
      this.input.on("drag", function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
      });
      upperText = this.add.text(-50, -50, "", {
        fontSize: "24px",
        color: "#fff",
      });
      const container = this.add.container(0, 0, [
        playerSprite,
        // this.facingDirectionText,
        upperText,
      ]);

      this.input.on("dragstart", function (pointer, gameObject) {
        gameObject.setTint(0xff0000);
      });
      this.input.on("dragend", function (pointer, gameObject) {
        gameObject.clearTint();
      });
      this.cameras.main.setZoom(0.6);
      this.cameras.main.centerOn(40, 140);
      // this.cameras.main.setBackgroundColor("#ffffff");
      this.input.on("wheel", function (pointer, gameObject, deltaX, deltaY) {
        console.log(deltaX, deltaY, pointer, gameObject);
        if (
          _this.cameras.main.zoom - deltaY * 0.005 > 0.6 &&
          _this.cameras.main.zoom - deltaY * 0.005 < 2
        ) {
          _this.cameras.main.zoom -= deltaY * 0.005;
          this.cameras.main.startFollow(container, true);
          this.cameras.main.setFollowOffset(
            -playerSprite.width,
            -playerSprite.height
          );
        }
        if (_this.cameras.main.zoom - deltaY * 0.005 <= 0.6) {
          this.cameras.main.stopFollow();
          this.cameras.main.centerOn(40, 140);
        }
      });
      this.game.events.on("myEvent", function (data) {
        console.log(data);
      });

      // createPlayerAnimation.call(this, "up-right", 26, 29);
      // createPlayerAnimation.call(this, "down-right", 36, 39);
      // createPlayerAnimation.call(this, "down-left", 6, 9);
      // createPlayerAnimation.call(this, "up-left", 16, 19);

      const gridEngineConfig = {
        characters: [
          {
            id: "player",
            sprite: playerSprite,
            startPosition: {
              x: lastPosition.x,
              y: lastPosition.y,
            },
            offsetY: -20,
            // walkingAnimationEnabled: false,
            speed: 2,
            container,
            // charLayer: 0,
            walkingAnimationMapping: {
              "up-left": {
                leftFoot: 18,
                standing: 15,
                rightFoot: 16,
              },
              "up-right": {
                leftFoot: 26,
                standing: 25,
                rightFoot: 28,
              },
              "down-left": {
                leftFoot: 6,
                standing: 5,
                rightFoot: 8,
              },
              "down-right": {
                leftFoot: 36,
                standing: 35,
                rightFoot: 38,
              },
            },
          },
        ],
      };
      this.gridEngine.create(cloudCityTilemap, gridEngineConfig);
      // this.gridEngine.movementStarted().subscribe(({ direction }) => {
      //     playerSprite.anims.play(direction);
      // });

      // this.gridEngine.movementStopped().subscribe(({ direction }) => {
      //     playerSprite.anims.stop();
      //     playerSprite.setFrame(getStopFrame(direction));
      // });

      this.gridEngine.directionChanged().subscribe(({ direction }) => {
        playerSprite.setFrame(getStopFrame(direction));
      });

      const _this = this;
      this.detectColor = { color: "blue", range: 1 };
      this.gridEngine
        .positionChangeFinished()
        .subscribe(({ charId, exitTile, enterTile }) => {
          setLastPosition(enterTile);
          const direction = _this.gridEngine.getFacingDirection("player");
          if (
            hasColorTrigger(
              cloudCityTilemap,
              enterTile,
              this.detectColor,
              direction
            )
          ) {
            upperText.text = "You found a " + this.detectColor.color + " cube";
          } else {
            upperText.text = "";
          }
        });
      this.game.events.on("changeCharEvent", function (data) {
        const dir = _this.gridEngine.getFacingDirection("player");
        if (dir === "down-right") {
          playerSprite.setTexture(data, 35);
        } else if (dir === "down-left") {
          playerSprite.setTexture(data, 5);
        } else if (dir === "up-right") {
          playerSprite.setTexture(data, 25);
        } else if (dir === "up-left") {
          playerSprite.setTexture(data, 15);
        } else {
          playerSprite.setTexture(data, 0);
        }
      });

      this.game.events.on("shakeChar", function (data) {
        if (data > 0) {
          _this.cameras.main.shake(400, 0.001 * data);
          playerSprite.setTint(0xff0000);
          setTimeout(() => {
            playerSprite.clearTint();
          }, 400);
        }
        DeviceSensorData.setIsShake(true);
      });
      this.game.events.on("lightEvent", function (data) {
        _this.cameras.main.setBackgroundColor(
          `rgb(${data},${data * 2},${data * 2})`
        );
      });

      this.game.events.on("restartEvent", function () {
        _this.scene.restart();
      });
    },

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
const configOrtogonal = {
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  scene: {
    preload: function () {
      this.load.image("tiles", roadTiles);
      this.load.tilemapTiledJSON("road-map", ortogonalJson);
      this.load.spritesheet("player", characterSet, {
        frameWidth: 52,
        frameHeight: 72,
      });
    },
    create: function () {
      const cloudCityTilemap = this.make.tilemap({ key: "road-map" });
      cloudCityTilemap.addTilesetImage("cloud_tileset", "tiles");
      for (let i = 0; i < cloudCityTilemap.layers.length; i++) {
        const layer = cloudCityTilemap.createLayer(i, "cloud_tileset", 0, 0);
        layer.scale = 1;
      }

      const playerSprite = this.add.sprite(0, 0, "player");
      playerSprite.scale = 1;

      this.cameras.main.startFollow(playerSprite, true);
      this.cameras.main.setFollowOffset(
        -playerSprite.width,
        -playerSprite.height
      );
      // this.cameras.main.setZoom(0.50);
      // this.cameras.main.centerOn(100, 0);
      // this.cameras.main.setBackgroundColor("#ffffff");

      this.game.events.on("myEvent", function (data) {
        console.log(data);
      });

      // createPlayerAnimation.call(this, "up-right", 26, 29);
      // createPlayerAnimation.call(this, "down-right", 36, 39);
      // createPlayerAnimation.call(this, "down-left", 6, 9);
      // createPlayerAnimation.call(this, "up-left", 16, 19);

      const gridEngineConfig = {
        characters: [
          {
            id: "player",
            sprite: playerSprite,
            walkingAnimationMapping: 2,
            startPosition: {
              x: lastPosition.x,
              y: lastPosition.y,
            },
            // startPosition: { x: 0, y: 0 },
            // offsetY: -9,
            // walkingAnimationEnabled: false,
            // speed: 2,
          },
        ],
      };
      this.gridEngine.create(cloudCityTilemap, gridEngineConfig);
      this.gridEngine
        .positionChangeFinished()
        .subscribe(({ charId, exitTile, enterTile }) => {
          setLastPosition(enterTile);
        });
    },

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

// this.game.events.on("moveBackwardEvent", function () {
//     const dir = _this.gridEngine.getFacingDirection("player");
//     if (dir === "down-right") {
//         _this.gridEngine.move("player", "up-left");
//     } else if (dir === "down-left") {
//         _this.gridEngine.move("player", "up-right");
//     } else if (dir === "up-right") {
//         _this.gridEngine.move("player", "down-left");
//     } else if (dir === "up-left") {
//         _this.gridEngine.move("player", "down-right");
//     }
// });
// console.log(this.gridEngine.collidesWithTiles("player"));
// this.gridEngine.positionChangeStarted().subscribe(({ charId, exitTile, enterTile }) => {
//     if (this.gridEngine.collidesWithTiles("player")) {
//         _this.anims.create({
//             key: "player-walk",
//             frames: _this.anims.generateFrameNumbers("player", { start: 6, end: 10 }),
//             frameRate: 10,
//             repeat: -1
//         });
//         playerSprite.anims.play("player-walk", true);
//     } else {
//         console.log("stop");
//     }

// });
// this.gridEngine.positionChangeFinished().subscribe(({ charId, exitTile, enterTile }) => {
//     playerSprite.anims.stop();
// });

// this.game.events.on("lightEvent", function (data) {
//     _this.cameras.main.setBackgroundColor(
//         `rgb(${data},${data * 2},${data * 2})`
//     );
// });

// class SceneA extends Phaser.Scene {
//     constructor() {
//         super("SceneA");
//     }

//     preload= preload;

//     create() {
//         // this.scene.add("SceneB", SceneB, true, { x: 400, y: 300 });
//         this.input.keyboard.on("keydown", (event) => {
//             if (event.key === "Enter") {
//                 this.scene.launch("SceneB", { x: 400, y: 300 });
//             }
//         });

//     }
// }

// class SceneB extends Phaser.Scene {
//     constructor() {
//         super("SceneB");
//     }

//     create(data) {
//         this.add.text(data.x, data.y, "Hello World");
//         this.input.keyboard.on("keydown", (event) => {
//             if (event.key === "Enter") {
//                 this.scene.launch("SceneA", { x: 400, y: 300 });
//                 this.scene.stop("SceneB");
//             }
//         });
//     }
// }

// const configScene = {
//     type: Phaser.AUTO,
//     width: 800,
//     height: 600,

//     scene: [SceneA, SceneB],
// };

// this.game.events.on("moveBackwardEvent", function () {
//     const dir = _this.gridEngine.getFacingDirection("player");
//     if (dir === "down-right") {
//         _this.gridEngine.move("player", "up-left");
//     } else if (dir === "down-left") {
//         _this.gridEngine.move("player", "up-right");
//     } else if (dir === "up-right") {
//         _this.gridEngine.move("player", "down-left");
//     } else if (dir === "up-left") {
//         _this.gridEngine.move("player", "down-right");
//     }
// });
// console.log(this.gridEngine.collidesWithTiles("player"));
// this.gridEngine.positionChangeStarted().subscribe(({ charId, exitTile, enterTile }) => {
//     if (this.gridEngine.collidesWithTiles("player")) {
//         _this.anims.create({
//             key: "player-walk",
//             frames: _this.anims.generateFrameNumbers("player", { start: 6, end: 10 }),
//             frameRate: 10,
//             repeat: -1
//         });
//         playerSprite.anims.play("player-walk", true);
//     } else {
//         console.log("stop");
//     }

// });
// this.gridEngine.positionChangeFinished().subscribe(({ charId, exitTile, enterTile }) => {
//     playerSprite.anims.stop();
// });

{
  /* <button
                onClick={() => {
                    setCurrentWidth(600);
                }
                }
                >deneme</button> */
}
{
  /* <div>
                    {initialize ? (
                        <button
                            style={{
                                position: "absolute",
                                top: "0",
                                left: "0",
                                width: "70px",
                                height: "70px",
                                borderRadius: "50%",
                                zIndex: "1000",
                                margin: "10px",
                                border: "none",
                                backgroundColor: `${
                                    currentChar === "player"
                                        ? "lightgreen"
                                        : "lightblue"
                                }`,
                            }}
                            onClick={() => {
                                if (currentChar === "player") {
                                    currentGame?.events.emit(
                                        "changeCharEvent",
                                        "player2"
                                    );
                                    setCurrentChar("player2");
                                } else {
                                    currentGame?.events.emit(
                                        "changeCharEvent",
                                        "player"
                                    );
                                    setCurrentChar("player");
                                }
                            }}
                        >
                            {currentChar === "player"
                                ? "Turn on Lights"
                                : "Turn off Lights"}
                        </button>
                    ) : null}
                </div> */
}

//? color detection example
{
  /* <div>
                    <p>Color Detection</p>
                    <label htmlFor="color">Select Color </label>
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
                    <label htmlFor="range"> Select Range </label>
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
                </div> */
}

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

const changeNight = () => {
  if (isNight) {
      currentGame?.events.emit("setBackground", {
          bgColor: "#E5F0FF",
          color: "#000000",
      });
      setIsNight(false);
  } else {
      currentGame?.events.emit("setBackground", {
          bgColor: "#000000",
          color: "#ffffff",
      });
      setIsNight(true);
  }
};

const ztechTilemap = this.make.tilemap({
  key: activeMapItems.mapTitle,
});
ztechTilemap.addTilesetImage(activeMapItems.mapTitle, activeMapItems.tilesetTitle);
// const background = this.add.image(0, 0, "motion-bg");
// background.z = -100;

for (let i = 0; i < ztechTilemap.layers.length; i++) {
  const layer = ztechTilemap.createLayer(i, activeMapItems.mapTitle, 0, 0);
  layer.scale = 1.6;
}

const handleMapChange = async (map) => {
  await destroy().then(() => {
      setInitialize(false);
         setActiveMapItems({
             mapJson: emptySetJson,
             mapTitle: "empty-map",
             mapImage: emptySet,
             tilesetTitle: "empty-set",
             playerSprite: isochar2,
             npcSprite: coinSpriteSheet,
             // game: configEmpty,
         })
         console.log("destroyed");
      }).then(() => {
          setGame(configEmpty);
      }).then(() => {
          console.log("gameRef: " + activeMapItems.mapTitle);
          setInitialize(false);
      });
          console.log("gameRef: " + activeMapItems.mapTitle);
          setInitialize(false);
          if (gameRef?.current?.className === "hydrated" && activeMapItems.mapTitle === "empty-map") {
              setInitialize(true);
          } else {
              setInitialize(false);
          }
      console.log("game: " + activeMapItems.mapTitle);
      
  }

    // function generateCoin(row, col, coinSprite) {
    //     const coin = {
    //         id: "coin" + row + col,
    //         sprite: coinSprite,
    //         startPosition: {
    //             x: col,
    //             y: row,
    //         },
    //         collides: false,
    //     };
    //     return coin;
    // }

    function hasTrigger(tilemap, position, propertyName) {
      return tilemap.layers.some((layer) => {
          const tile = tilemap.getTileAt(
              position.x,
              position.y,
              false,
              layer.name
          );
          const tileProperty = tile?.properties[propertyName];
          // if (tile?.properties?.coin_trigger) {
          //     tile.properties.coin_trigger = false;
          // }
          return tileProperty;
      });
  }

                      // const walkMap =
                    //     _this.gridEngine.getWalkingAnimationMapping("player");
                    // if (walkMap["up-left"]["leftFoot"] === 1) {
                    //     _this.gridEngine.move("player", dir);
                    // } else {
                    //     _this.gridEngine.setWalkingAnimationMapping("player", {
                    //         "up-left": {
                    //             leftFoot: 1,
                    //             standing: 0,
                    //             rightFoot: 2,
                    //         },
                    //         "up-right": {
                    //             leftFoot: 1,
                    //             standing: 0,
                    //             rightFoot: 2,
                    //         },
                    //         "down-left": {
                    //             leftFoot: 1,
                    //             standing: 0,
                    //             rightFoot: 2,
                    //         },
                    //         "down-right": {
                    //             leftFoot: 1,
                    //             standing: 0,
                    //             rightFoot: 2,
                    //         },
                    //     });
                    //     switch (dir) {
                    //         case "up-left":
                    //             dir = "down-right";
                    //             break;
                    //         case "up-right":
                    //             dir = "down-left";
                    //             break;
                    //         case "down-left":
                    //             dir = "up-right";
                    //             break;
                    //         case "down-right":
                    //             dir = "up-left";
                    //             break;
                    //     }
                    // }

                       // const walkMap =
                    //     _this.gridEngine.getWalkingAnimationMapping("player");
                    // if (walkMap["up-left"]["leftFoot"] === 36) {
                    //     _this.gridEngine.move("player", dir);
                    // } else {
                    //     _this.gridEngine.setWalkingAnimationMapping("player", {
                    //         "up-left": {
                    //             leftFoot: 1,
                    //             standing: 0,
                    //             rightFoot: 2,
                    //         },
                    //         "up-right": {
                    //             leftFoot: 1,
                    //             standing: 0,
                    //             rightFoot: 2,
                    //         },
                    //         "down-left": {
                    //             leftFoot: 1,
                    //             standing: 0,
                    //             rightFoot: 2,
                    //         },
                    //         "down-right": {
                    //             leftFoot: 1,
                    //             standing: 0,
                    //             rightFoot: 2,
                    //         },
                    //     });
                    //     switch (dir) {
                    //         case "down-right":
                    //             dir = "up-left";
                    //             break;
                    //         case "down-left":
                    //             dir = "up-right";
                    //             break;
                    //         case "up-right":
                    //             dir = "down-left";
                    //             break;
                    //         case "up-left":
                    //             dir = "down-right";
                    //             break;
                    //     }
                    // }

                    this.gridEngine
                    .directionChanged()
                    .subscribe(({ direction }) => {
                        playerSprite.setFrame(
                            getStopFrame(direction, isForward)
                        );
                        // playerSprite.anims.play(direction + "-turn", false);
                        // playerSprite.on("animationcomplete", () => {
                        //     console.log("animationcomplete", direction)
                        //   playerSprite.setFrame(getStopFrame(direction, isForward));
                        // }
                        // );
                    });
                // this.gridEngine.directionChanged().subscribe(({ direction }) => {
                //     const walkMap =
                //         this.gridEngine.getWalkingAnimationMapping("player");
                //     playerSprite.anims.play(walkMap[direction].standing, true);
                //     // playerSprite.setFrame(getStopFrame(direction));
                // });
                // const line1 = new Phaser.Geom.Line(0, 0, 100, 100);
                // const line2 = new Phaser.Geom.Line(0, 0, 100, 100);
                const handleMapChange = async (map) => {
                  console.log(map);
                  const ok = await destroy();
                  if (ok) {
                      setGame(mapGenerator("empty-set", "empty-map"));
                      setInitialize(true);
                  }
                  // await destroy().then(() => {
                  //     setInitialize(false);
                  //        setActiveMapItems({
                  //            mapJson: emptySetJson,
                  //            mapTitle: "empty-map",
                  //            mapImage: emptySet,
                  //            tilesetTitle: "empty-set",
                  //            playerSprite: isochar2,
                  //            npcSprite: coinSpriteSheet,
                  //            // game: configEmpty,
                  //        })
                  //        console.log("destroyed");
                  //     }).then(() => {
                  //         setGame(configEmpty);
                  //     }).then(() => {
                  //         console.log("gameRef: " + activeMapItems.mapTitle);
                  //         setInitialize(false);
                  //     });
                  //         console.log("gameRef: " + activeMapItems.mapTitle);
                  //         setInitialize(false);
                  //         if (gameRef?.current?.className === "hydrated" && activeMapItems.mapTitle === "empty-map") {
                  //             setInitialize(true);
                  //         } else {
                  //             setInitialize(false);
                  //         }
                  //     console.log("game: " + activeMapItems.mapTitle);
              };

              
              const restartGame = async () => {
                const ok = await destroy();
                if (ok) {
                    setInitialize(true);
                }
            };
        
<input
                    type="range"
                    min="0"
                    max="100"
                    value={range}
                    onChange={(e) => {
                      setRange(e.target.value);
                      if (title === "Light Level") {
                        console.log("light level changed"+e.target.value);
                        DeviceSensorData.setLightLevel(parseInt(e.target.value));
                      }
                      if (title === "Sound Level") {
                        console.log("Sound Level changed"+e.target.value);
                        DeviceSensorData.setSoundLevel(parseInt(e.target.value));
                      }
                      if (title === "Shake Level") {
                        console.log("Shake Level"+e.target.value);
                        DeviceSensorData.setShakeLevel(parseInt(e.target.value));
                      }
                    }}
                    id="myRange"
                    // orient="vertical"
                    step={1}
                    color="red"
                    className={classNames(styles.slider)}
                    style={{
                        background: title === "Light Level" ? `linear-gradient(to right, rgb(${range*0.5}, 0,${range * 2.5} ) 0%, rgb(${range * 2.5}, 0, ${range*0.5}) ${range}%, rgb(255, 255, 255) ${range}%, rgb(255, 255, 255) 100%)`: title === "Shake Level" ? `  linear-gradient(to right, rgb(${range*0.5},200, ${range * 2.5} ) 0%, rgb(${range * 2.5}, 0, ${range*0.5}) ${range}%, rgb(255, 255, 255) ${range}%, rgb(255, 255, 255) 100%)` : `  linear-gradient(to right, rgb(0, ${range * 2.5}, ${range*0.5}) 0%, rgb(${range * 2.5}, 0, ${range*0.5}) ${range}%, rgb(255, 255, 255) ${range}%, rgb(255, 255, 255) 100%)`,
                    }}
                    // style={{
                    //     appearance: "slider-vertical",
                    //     height: 150,
                    //     width: 25,
                    //     marginBottom: 16,
                    //     marginLeft: 5,
                    //     color: "red",
                    //     margin: 0,
                    //     writingMode: "bt-rl",
                    //     position: "relative",
                    //     transition: "background 0.5s ease-in-out",
                    //     accentColor: `rgb(${range * 2.5}, 0, ${range*0.5})`,
                        
                    // }}
                    // list="tickmarks"
                />
                {/* <img
                    src={title==="Light Level"? LightBulbOff : title === "Shake Level" ? ShakeIconOff: SoundIconOff }
                    alt=""
                    className={classNames(styles.sliderIconDown)}
                /> */}
                
                {/* <datalist id="tickmarks">
                    <option value="0"></option>
                    <option value="100"></option>
                </datalist>
                <label
                    style={{
                        position: "relative",
                        top: 0,
                        left: 0,
                        writingMode: "bt-rl",
                        fontSize: 12,
                        fontWeight: "bold",
                        margin: 0,
                        padding: 0,
                    }}
                >
                    {title}
                </label> */}
            </div>
            {/* <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: 168,
                    marginTop: 36,
                    marginRight: 5,
                    marginLeft: 0,

                }}
            >
                <div>
                    <p style={{ fontSize: 10 }}>100</p>
                </div>
                <div>
                    <p style={{ fontSize: 10 }}>50</p>
                </div>
                <div>
                    <p style={{ fontSize: 10 }}>0</p>
                </div>
            </div> */}

 {/* <div
                    itemType="button"
                    onClick={() => {
                        if (currentChar === "player") {
                            currentGame?.events.emit(
                                "changeCharEvent",
                                "player2"
                            );
                            setCurrentChar("player2");
                        } else {
                            currentGame?.events.emit(
                                "changeCharEvent",
                                "player"
                            );
                            setCurrentChar("player");
                        }
                    }}
                >
                    <img
                        src={is3d ? Icon2d : Icon3d}
                        alt="3d"
                        className={classNames(styles.stageBtnImg)}
                    />
                </div> */}
                </div>
                {/* <div className={classNames(styles.btnGroup)}>
                    <button
                        className={classNames(styles.btnItem)}
                        onClick={() =>
                            currentGame?.events.emit("teleportEvent", {
                                x: 0,
                                y: 7,
                            })
                        }
                    >
                        Level 1
                    </button>
                    <button
                        className={classNames(styles.btnItem)}
                        onClick={() =>
                            currentGame?.events.emit("teleportEvent", {
                                x: 5,
                                y: 5,
                            })
                        }
                    >
                        Level 2
                    </button>
                    <button
                        className={classNames(styles.btnItem)}
                        onClick={() =>
                            currentGame?.events.emit("teleportEvent", {
                                x: 7,
                                y: 6,
                            })
                        }
                    >
                        Level 3
                    </button>
                    <button
                        className={classNames(styles.btnItem)}
                        onClick={() =>
                            currentGame?.events.emit("teleportEvent", {
                                x: 0,
                                y: 3,
                            })
                        }
                    >
                        Level 4
                    </button>
                </div> */}


//? example of how to use the slider component
{
  /* 
   <div className={classNames(styles.switchGroup)}>
                      <label
                          htmlFor="lightLevel"
                          className={classNames(styles.switchLabel)}
                      >
                          Gece/Gündüz
                      </label>
                      <Switch
                          name={"lightLevel"}
                          value={lightLevel}
                          onChangeHandler={onLightChange}
                          backgroundColor="#fff64f"
                          imgChecked={LightBulb}
                          imgUnchecked={LightBulbOff}
                          />
                  
                      <label
                          htmlFor="switchSound"
                          className={classNames(styles.switchLabel)}
                      >
                          Ses Aç/Sessiz
                      </label>
                      <Switch
                          name={"switchSound"}
                          value={soundLevel}
                          onChangeHandler={onSoundChange}
                          backgroundColor="#9d00c9"
                          imgChecked={SoundIcon}
                          imgUnchecked={SoundIconOff}
                          />
                  
                      <label
                          htmlFor="switchShake"
                          className={classNames(styles.switchLabel)}
                      >
                          Sallan/Dur
                      </label>
                      <Switch
                          name={"switchShake"}
                          value={shakeLevel}
                          onChangeHandler={onShakeChange}
                          backgroundColor="#02a000"
                          imgChecked={ShakeIcon}
                          imgUnchecked={ShakeIconOff}
                          />
                          
                  <label
                      htmlFor="switch3d"
                      className={classNames(styles.switchLabel)}
                  >
                      Düz/İzometrik
                  </label>
                  <Switch
                      name={"switch3d"}
                      value={is3d}
                      onChangeHandler={on3dChange}
                      backgroundColor="#7077ff"
                      imgChecked={Icon3d}
                      imgUnchecked={Icon2d}
                      />
                      
                      <label htmlFor="initialize"
                          className={classNames(styles.switchLabel)}
                      >Aç/Kapa</label>
                      <Switch
                          name={"initialize"}
                          value={initialize}
                          onChangeHandler={onRestartHandler}
                          backgroundColor="#7077ff"
                          imgChecked={LightBulb}
                          imgUnchecked={LightBulbOff}
                          checked={initialize}
                          />

                      
              </div>
              <div className={classNames(styles.sliderGroup)}>
                  <Slider
                      range={lightLevel}
                      setRange={setLightLevel}
                      title={"Light Level"}
                  />
                  <Slider
                      range={soundLevel}
                      setRange={setSoundLevel}
                      title={"Sound Level"}
                  />
                  <Slider
                      range={shakeLevel}
                      setRange={setShakeLevel}
                      title={"Shake Level"}
                  />
              </div>
              --------------------------------
  <div>
      <div className="speed">
              <button
              style={{
                  backgroundColor: currentGame === 'speed' ? 'red' : 'white',
              }}
                  onClick={() => currentGame?.events.emit("speedEvent", 4)}
              >
                  Set Speed 2X
              </button>
              <button
                  onClick={() => currentGame?.events.emit("speedEvent", 2)}
              >
                  Set Speed Normal
              </button>
          </div>
          <div className="movements">
              <div>
                  <button
                      onClick={() =>
                          currentGame?.events.emit("moveEvent", "up-left")
                      }
                  >
                      Up Left
                  </button>
                  <button
                      onClick={() =>
                          currentGame?.events.emit("moveEvent", "up-right")
                      }
                  >
                      Up Right
                  </button>
                  <button
                      onClick={() =>
                          currentGame?.events.emit("moveEvent", "down-left")
                      }
                  >
                      Down Left
                  </button>
                  <button
                      onClick={() =>
                          currentGame?.events.emit("moveEvent", "down-right")
                      }
                  >
                      Down Right
                  </button>
                  <button
                      onClick={() =>
                          currentGame?.events.emit("moveEvent", "up-left")
                      }
                  >
                      Move Up Left
                  </button>
                  <button
                      onClick={() =>
                          currentGame?.events.emit("moveEvent", "up-right")
                      }
                  >
                      Move Up Right
                  </button>
                  <button
                      onClick={() =>
                          currentGame?.events.emit("moveEvent", "down-left")
                      }
                  >
                      Move Down Left
                  </button>
                  <button
                      onClick={() =>
                          currentGame?.events.emit("moveEvent", "down-right")
                      }
                  >
                      Move Down Right
                  </button>
                  <button
                      onClick={() =>
                          currentGame?.events.emit("moveToEvent", {
                              dir: "down-left",
                              step: 2,
                          })
                      }
                  >
                      Move To Down Left 2 Steps
                  </button>
                  <button
                      onClick={() =>
                          currentGame?.events.emit("moveToEvent", {
                              dir: "down-right",
                              step: 2,
                          })
                      }
                  >
                      Move To Down Right 2 Steps
                  </button>
                  <button
                      onClick={() =>
                          currentGame?.events.emit("moveToEvent", {
                              dir: "up-left",
                              step: 2,
                          })
                      }
                  >
                      Move To Up Left 2 Steps
                  </button>
                  <button
                      onClick={() =>
                          currentGame?.events.emit("moveToEvent", {
                              dir: "up-right",
                              step: 2,
                          })
                      }
                  >
                      Move To Up Right 2 Steps
                  </button>
              </div>
              <div>
                  <button
                      onClick={() =>
                          currentGame?.events.emit("moveEvent", "stop")
                      }
                  >
                      Stop
                  </button>
                  <button
                      onClick={() =>
                          currentGame?.events.emit("moveEvent", "up")
                      }
                  >
                      Move Up
                  </button>
                  <button
                      onClick={() =>
                          currentGame?.events.emit("moveEvent", "down")
                      }
                  >
                      Move Down
                  </button>
                  <button
                      onClick={() =>
                          currentGame?.events.emit("moveEvent", "left")
                      }
                  >
                      Move Left
                  </button>
                  <button
                      onClick={() =>
                          currentGame?.events.emit("moveEvent", "right")
                      }
                  >
                      Move Right
                  </button>
              </div>
              <div className="turns">
                  <button
                      onClick={() =>
                          currentGame?.events.emit("turnEvent", "up-left")
                      }
                  >
                      Turn Up-Left
                  </button>
                  <button
                      onClick={() =>
                          currentGame?.events.emit("turnEvent", "up-right")
                      }
                  >
                      Turn Up-Right
                  </button>
                  <button
                      onClick={() =>
                          currentGame?.events.emit("turnEvent", "down-left")
                      }
                  >
                      Turn Down-Left
                  </button>
                  <button
                      onClick={() =>
                          currentGame?.events.emit("turnEvent", "down-right")
                      }
                  >
                      Turn Down-Right
                  </button>
                  <button
                      onClick={() =>
                          currentGame?.events.emit("turnEvent", "up")
                      }
                  >
                      Turn Up
                  </button>
                  <button
                      onClick={() =>
                          currentGame?.events.emit("turnEvent", "down")
                      }
                  >
                      Turn Down
                  </button>
                  <button
                      onClick={() =>
                          currentGame?.events.emit("turnEvent", "left")
                      }
                  >
                      Turn Left
                  </button>
                  <button
                      onClick={() =>
                          currentGame?.events.emit("turnEvent", "right")
                      }
                  >
                      Turn Right
                  </button>
              </div>
          </div> 
          </div>*/
}

// teleport with fading effect
// this.tweens.add({
//     targets: playerSprite,
//     alpha: 0,
//     duration: 1000,
//     ease: "Linear",
//     onComplete: () => {
//         this.gridEngine.setPosition("player", {
//             x: teleportCoords.exit.x,
//             y: teleportCoords.exit.y,
//         });
//         playerSprite.alpha = 1;
//     },
// });