// create a class for Wolf

import Phaser from '../lib/phaser.js'

export default class Snow extends Phaser.Physics.Arcade.Sprite
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

        this.setScale(0.25)
        this.speedo = 30
        this.visible = false
        this.active =true
        this.name = 'SnowyRunner'
        this.ActualName = 'Leopard'
        this.AttackTime = 3000
        this.SpeedType = '(Moderate)'
        this.PointsPossible = '(30)'

        //this.scene.add.existing(this);
    }
}