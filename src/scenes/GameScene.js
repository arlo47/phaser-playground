import Phaser from 'phaser'

import ScoreLabel from '../ui/ScoreLabel'
import BombSpawner from './BombSpawner'
import { images } from '../enum/assetEnum'

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('game-scene')
    this.gameOver = false
  }

  preload() {
    // bind out images to assets in the assets folder
    // the public folder is the root for assets
    this.load.image(images.sky.key, images.sky.path)
    this.load.image(images.ground.key, images.ground.path)
    this.load.image(images.star.key, images.star.path)
    this.load.image(images.bomb.key, images.bomb.path)

    // create a spritesheet from dude.png and give it the dude key
    // this allows us to set frame changes on key presses
    this.load.spritesheet(images.dude.key,
      images.dude.path,
      { frameWidth: 32, frameHeight: 48 }
    )
  }

  // instantiate our scene
  create() {
    // add background images to our scene
    this.add.image(400, 300, 'sky')
    // dimensions of the platforms are created in createPlatforms.
    // return it so we can add collider physics to them
    const platforms = this.createPlatforms()
    const player = this.createPlayer()
    this.stars = this.createStars()

    this.ScoreLabel = this.createScoreLabel(16, 16, 0)
    this.bombSpawner = new BombSpawner(this, 'bomb')
    const bombsGroup = this.bombSpawner.group

    // add collider physics between player & platforms
    this.physics.add.collider(player, platforms)
    // add collider physics between stars & platforms
    this.physics.add.collider(this.stars, platforms)
    // add overlap physics between player and stars
    // 3rd param defines functionality on overlap
    this.physics.add.overlap(player, this.stars, this.collectStar, null, this)
    this.physics.add.collider(bombsGroup, platforms)
    // handling gameover
    this.physics.add.collider(this.player, bombsGroup, this.hitBomb, null, this)

    // bind keys to actions
    this.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
  }

  collectStar(player, star) {
    star.disableBody(true, true)
    this.ScoreLabel.add(10)

    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate((child) => {
        child.enableBody(true, child.getIndexList, 0, true, true)
      })
    }

    this.bombSpawner.spawn(player.x)
  }

  update() {

    if (this.gameOver) {
      return
    }

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160)
      this.player.anims.play('left', true)
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160)
      this.player.anims.play('right', true)
    } else {
      this.player.setVelocityX(0)
      this.player.anims.play('turn')
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330)
    }
  }

  hitBomb(player, bomb) {
    this.physics.pause()
    player.setTint(0xff0000)
    player.anims.play('turn')
    this.gameOver = true
  }

  createScoreLabel(x, y, score) {
    const style = { fontSize: '32px', fill: '#000' }
    const label = new ScoreLabel(this, x, y, score, style)

    this.add.existing(label)
    return label
  }

  createStars() {
    const stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    })

    stars.children.iterate((c) => {
      // case child to Arcade Sprite Physics using JSDoc.
      // we do this to get rid of the error on child.setBounceY.
      // the iterate function is on the GameObject & VSCode does not know
      // we are looping over Arcade Physics Sprites, so it does not know
      // child has the setBounceY method.
      const child = (/** @type {Phaser.Physics.Arcade.Sprite} */(c))
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
    })

    return stars;
  }

  createPlatforms() {
    const platforms = this.physics.add.staticGroup()

    platforms.create(400, 568, 'ground').setScale(2).refreshBody()

    platforms.create(600, 400, 'ground')
    platforms.create(50, 250, 'ground')
    platforms.create(750, 220, 'ground')

    // return platforms so physics can be added in create()
    return platforms
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