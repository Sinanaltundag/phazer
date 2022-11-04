import React, { useRef, useState } from 'react'
import Phaser from 'phaser'
import { IonPhaser } from '@ion-phaser/react'
import { GridEngine } from 'grid-engine';


// var game = new Phaser.Game(config);


  


  
  
  export default function App () {
    const [speed, setSpeed] = useState(2)
    
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

  const config = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    scene: {
      preload: function () {
        this.load.image("tiles", "assets/iso_tile.png");
    this.load.tilemapTiledJSON("iso-map", "assets/isometric.json");
    this.load.spritesheet("player", "assets/iso_char.png", {
      frameWidth: 15,
      frameHeight: 32,
    });
      },
      create: function() {
        const cloudCityTilemap = this.make.tilemap({ key: "iso-map" });
    cloudCityTilemap.addTilesetImage("iso-tileset", "tiles");
    for (let i = 0; i < cloudCityTilemap.layers.length; i++) {
      const layer = cloudCityTilemap.createLayer(i, "iso-tileset", 0, 0);
      layer.scale = 3;
    }
    const playerSprite = this.add.sprite(0, 0, "player");
    playerSprite.scale = 3;
    this.cameras.main.startFollow(playerSprite, true);
    this.cameras.main.setFollowOffset(-playerSprite.width, -playerSprite.height);
  
    createPlayerAnimation.call(this, "up-right", 26, 29);
    createPlayerAnimation.call(this, "down-right", 36, 39);
    createPlayerAnimation.call(this, "down-left", 6, 9);
    createPlayerAnimation.call(this, "up-left", 16, 19);
  
    const gridEngineConfig = {
      characters: [
        {
          id: "player",
          sprite: playerSprite,
          startPosition: { x: 0, y: 0 },
          offsetY: -9,
          walkingAnimationEnabled: false,
          speed: speed,
        },
      ],
      
    };
    console.log(speed)
    this.game.events.on("speed", () => {
      console.log(speed)
    });
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
      },

      update: function() {
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
      },
    },
      plugins: {
          scene: [
              {
              key: 'GridEngine',
              plugin: GridEngine,
              mapping: 'gridEngine'
              },
          ],
        },
      }



  const [game, setGame] = useState(config)
  const gameRef = useRef(null)
  // Call `setInitialize` when you want to initialize your game! :)
  const [initialize, setInitialize] = useState(false)
  const destroy = () => {
    if (gameRef.current) {
      // game.plugins.scene.destroy('GridEngine')
      // gameRef.current.plugins.removeScenePlugin('GridEngine')
      console.log(gameRef.current.game.plugins.scene)
      gameRef.current.destroy()
    }
    setInitialize(false)
  }
  return (
    <>
    
      <IonPhaser game={game}  ref={gameRef} initialize={initialize}/>
      <button onClick={() => setSpeed(speed + 1)}>Speed Up</button>
      <button onClick={() => setSpeed(speed - 1)}>Speed Down</button>
      <button onClick={() => setGame(config)}>Change Level Back</button>
      <button onClick={() => setInitialize(true)}>Initialize</button>
      <button onClick={destroy}>Destroy</button>
    </>
  )
}