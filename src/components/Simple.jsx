import React, { useRef, useState } from 'react'
import Phaser from 'phaser'
import { IonPhaser } from '@ion-phaser/react'

const game = {
    width: 200,
    height: 200,
    type: Phaser.AUTO,
    scene: {
      init: function() {
        this.cameras.main.setBackgroundColor('#24252A')
      },
      create: function() {
        this.helloWorld = this.add.text(
          this.cameras.main.centerX, 
          this.cameras.main.centerY, 
          "Hello World", { 
            font: "1rem Arial", 
            fill: "#ffffff" 
          }
        );
        this.helloWorld.setOrigin(0.5);
      },
      update: function() {
        this.helloWorld.angle += 1;
      }
    }
  }           

const Simple = () => {
    const gameRef = useRef(null)
    const [initialize, setInitialize] = useState(false)

    const destroy = () => {
        if (gameRef.current) {
            gameRef.current.destroy()
        }
        setInitialize(false)
    }

  return (
    <div>
        <IonPhaser game={game} initialize={initialize} ref={gameRef} />
        <button onClick={() => setInitialize(true)}>Start</button>
        <button onClick={destroy}>Destroy</button>
    </div>
  )
}

export default Simple