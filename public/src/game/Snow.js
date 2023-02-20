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

        this.setScale(0.22)
        this.speedo = 30
        this.visible = false
        this.active =true
        this.name = 'SnowyRunner'
        this.ActualName = 'Leopard'
        this.fileName = 'SnowRun'
        this.AttackTime = 3500
        this.SpeedType = '(Moderate Speed)'
        this.PointsPossible = '(35)'

        //this.scene.add.existing(this);
    }
}