// create a class for Dragon

import Phaser from '../lib/phaser.js'

export default class Panther extends Phaser.Physics.Arcade.Sprite
{
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {string} texture
     */
    constructor(scene, x, y, texture)
    {
        super(scene, x, y, texture)
        //this.scene.physics.add.sprite(x, y, 'texture');
        this.setScale(0.25)
        this.speedo = 100
        this.AttackTime = 5000
        this.SpeedType = '(Slow)'
        this.PointsPossible = '(50)'


        this.visible = false

        this.active =true
        this.name = 'PantherRunner'
        this.ActualName = 'Panther'
        this.fileName = 'PantherRun'
    }
}