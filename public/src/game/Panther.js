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
        this.setScale(0.22)
        this.speedo = 100
        this.AttackTime = 5500
        this.SpeedType = '(Slow Speed)'
        this.PointsPossible = '(55)'


        this.visible = false

        this.active =true
        this.name = 'PantherRunner'
        this.ActualName = 'Panther'
        this.fileName = 'PantherRun'
    }
}