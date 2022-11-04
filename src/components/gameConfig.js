import Phaser from "phaser";
import { GridEngine } from "grid-engine";

export  const gameConfig = (scene) => {
    return {
      width: 800,
      height: 600,
      type: Phaser.AUTO,
      scene: scene,
      plugins: {
        scene: [
          {
            key: "GridEngine",
            plugin: GridEngine,
            mapping: "gridEngine",
          },
        ],
      },
    }
    };