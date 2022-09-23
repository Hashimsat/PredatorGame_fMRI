// create a class for Cheetah

import Phaser from '../lib/phaser.js'

export default class Cheetah extends Phaser.Physics.Arcade.Sprite
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
        this.speedo = 50
        this.name = 'CheeRunner'
        this.ActualName = 'Cheetah'
        this.AttackTime = 900 //850  //1900 is time after torch placement after which animal arrives
        this.SpeedType = '(Fast)'
        this.PointsPossible = '(10)'

        this.visible = false
        this.active =true

    }









}