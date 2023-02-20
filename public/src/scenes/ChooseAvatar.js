import Phaser from '../lib/phaser.js'

import {LoadingBar} from "../Functions/GameUtils.js";

// scene that allows participants to choose their own avatars

export default class ChooseAvatar extends Phaser.Scene {

    init(data){
        this.reload = data.reload;  //to control if preload (loading) is run or not, we don't need it if we come back from StartingInstruct

        // this.scale.setGameSize(640,640)  //set game screen size
        // this.scale.updateBounds();
    }

    constructor() {
        super('ChooseAvatar')
    }


    preload() {

        if (this.reload != 1) {    //play the game loading bar only if we aren't returning back from the instructions
            LoadingBar(this)
        }

        // load character assets/png images to be used later

        this.load.spritesheet('femaleCharacter', 'assets/Female_char.png', {frameWidth: 345, frameHeight: 850})
        this.load.spritesheet('Check', 'assets/Check.png', {frameWidth: 350, frameHeight: 810})
    }

    create() {

        const width = this.scale.width
        const height = this.scale.height




        this.add.text(width * 0.5, height * 0.3, 'Please Choose Your Avatar', {
            fontSize: 35
        })
            .setOrigin(0.5)

        // Go to Menu or Start Training when the avatar is clicked on, also send the name of file that contains chosen avatar to the next scene

        const female = this.add.sprite( width/2 - 100, height/2 + 100, 'femaleCharacter')
            .setInteractive().setScale(0.38)
            .on('pointerdown', () => this.scene.start('Menu', { playerImageKey: 'Female_char.png' }));
        female.setFrame(0)


        const Boy = this.add.sprite( width/2 + 100, height/2 + 80, 'Check')
            .setInteractive().setScale(0.4)
            .on('pointerdown', () => this.scene.start('Menu', { playerImageKey: 'Check.png' }));
        Boy.setFrame(0)
    }


}
