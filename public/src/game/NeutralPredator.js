// create a class for Dragon

import Phaser from '../lib/phaser.js'

export default class NeutralPredator extends Phaser.Physics.Arcade.Sprite
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
        this.speedo = 50
        this.AttackTime = 3500
        this.SpeedType = '(Moderate Speed)'
        this.PointsPossible = '(35)'


        this.visible = false

        this.active =true
        this.name = 'NeutralRunner'
        this.ActualName = 'Jaguar'
        this.fileName = 'NeutralRun'
    }
}