import Phaser from 'phaser'

import { images } from '../enum/assetEnum'


export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, images.key.dude)
    const player = this.createPlayer();
    return player
  }

  // generate player
  createPlayer() {
    // select sprite for player, add physics to it.
    const player = this.player = this.physics.add.sprite(100, 450, 'dude')
    this.player.setBounce(0.2)
    this.player.setCollideWorldBounds(true)
    
    // keybind sprite frame changes to moving left
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    })

    // keybind sprite frame changes to turning around
    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    })

    // keybind sprite frame changes to moving right
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    })
  
    // return player so it can be physics can be added in create()
    return player;
  }
}
