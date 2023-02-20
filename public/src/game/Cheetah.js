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



        this.setScale(0.22)
        this.speedo = 50
        this.name = 'CheeRunner'
        this.fileName = 'CheetaRun'
        this.ActualName = 'Cheetah'
        this.AttackTime = 1500 //850  //1900 is time after torch placement after which animal arrives
        this.SpeedType = '(Fast Speed)'
        this.PointsPossible = '(15)'

        this.visible = false
        this.active =true

    }









}