import Phaser from "phaser"
import React, { useEffect, useState } from "react"

/** @tutorial I made this! This answers how you get your image. */
import logoImage from "../assets/rock.png"


class ExampleScene2 extends Phaser.Scene {
    constructor() {
        super({ key: 'ExampleScene2' })
    }
    preload() {
      this.load.image("logo", "assets/water.png")
    }
    create() {
      // You made this!
      const text = this.add.text(250, 250, "Phaser")
      text.setInteractive({ useHandCursor: true })
      this.add.image(400, 300, "logo")
      /** @tutorial I made this! */
      // Get all that lovely dataState into your scene,
      let { clickCount } = this.registry.getAll()
      text.on("pointerup", () => {
        // This will trigger the "changedata" event handled by the component.
        this.registry.merge({ clickCount: clickCount++ })
      })
      // This will trigger the scene as now being ready.
      this.game.events.emit("READY", true)
    }
  }

/** @tutorial I made this! Use a functional React component and `useEffect` hook.*/
export const Phaser3GameComponent = ({ someState }) => {
  // Optional: useful to delay appearance and avoid canvas flicker.
  const [isReady, setReady] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  // Just an example... do what you do here. 
  const dataService = (changedState) => {
    // I'm not sure how to use stores, but you'll know better what to do here.
    // store.dispatch(
    //   {
    //     ...someState,
    //     ...changedState,
    //   },
    //   { type: ACTION_TYPE }
    // )
  }
  // This is where the fun starts. 
  useEffect(() => {
    const config = {
      callbacks: {
        preBoot: game => {
          // A good way to get data state into the game.
          game.registry.merge(someState)
          // This is a good way to catch when that data changes.
          game.registry.events.on("changedata", (par, key, val, prevVal) => {
            // Simply call whatever functions you want outside.
            dataService({ [key]: val })
          })
        },
      },
      type: Phaser.AUTO,
      parent: "phaser-example",
      width: 800,
      height: 600,
      scene: [ExampleScene, ExampleScene2],
    }
    let game = new Phaser.Game(config)
    // Triggered when game is fully READY.
    game.events.on("READY", setReady)
    // If you don't do this, you get duplicates of the canvas piling up.
    return () => {
      setReady(false)
      game.destroy(true)
    }
  }, []) // Keep the empty array otherwise the game will restart on every render.
  return (
    <div id="phaser-example" className={isReady ? "visible" : "invisible"} />
  )
}

export default class ExampleScene extends Phaser.Scene {
  preload() {
    this.load.image("logo", "assets/rock.png")
  }
  create() {
    // You made this!
    const text = this.add.text(250, 250, "Phaser")
    text.setInteractive({ useHandCursor: true })
    this.add.image(400, 300, "logo")
    /** @tutorial I made this! */
    // Get all that lovely dataState into your scene,
    let { clickCount } = this.registry.getAll(0)
    text.on("pointerup", () => {
      // This will trigger the "changedata" event handled by the component.
      this.registry.merge({ clickCount: clickCount++ })
      console.log("clickCount", clickCount)
      this.scene.start("ExampleScene2")
    })
    // This will trigger the scene as now being ready.
    this.game.events.emit("READY", true)
    this.game.events.on("pointerdown", () => {
        this.scene.start("ExampleScene2")
    })

  }
}

