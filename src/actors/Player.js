import Phaser from 'phaser'

import { images } from '../enum/assetEnum'


export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture = images.dude.key) {
    super(scene, x, y, texture)
    // two lins to add physics to the sprite
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.create(scene)
    return this;
  }

  create(scene) {
    this.setCollideWorldBounds(true)
    this.setBounce(0.2)
    this.setKeybinds()

    // bind additional keys to actions (default arrow keys. This adds WASD)
    scene.cursors = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
  }

  
  update(cursors) {
    if (cursors.left.isDown) {
      this.setVelocityX(-160)
      this.anims.play('left', true)
    } else if (cursors.right.isDown) {
      this.setVelocityX(160)
      this.anims.play('right', true)
    } else {
      this.setVelocityX(0)
      this.anims.play('turn')
    }

    if (cursors.up.isDown && this.body.touching.down) {
      this.setVelocityY(-330)
    }
  }

  // bind spritesheet frames to actions
  setKeybinds() {
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
  }
}
