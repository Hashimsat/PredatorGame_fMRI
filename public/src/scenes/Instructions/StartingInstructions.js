import Phaser from '../../lib/phaser.js'

import {LoadingBar} from "../../Functions/GameUtils.js";

export default class StartingInstructions extends Phaser.Scene {

    NextCount = 1;  //By default first slide of instructions shown
    SlideName

    init(data) {
        this.playerImage = data.playerImageKey
        this.scale.setGameSize(1070,640)
        this.scale.updateBounds();
    }

    constructor() {
        super('StartingInstruct')
    }

    preload() {
        this.load.image('Slide1','assets/Resize1.png')
        this.load.image('Slide2','assets/Resize2.png')
        this.load.image('Slide3','assets/Resize3.png')
        this.load.image('Slide4','assets/Resize4.png')
        this.load.image('Slide5','assets/Resize5.png')
        this.load.image('Slide6','assets/Resize6.png')

    }

    create() {


        const sc_widt = this.scale.width / 2
        const sc_high = this.scale.height / 2

       // console.log('Width and height are',sc_widt,sc_high)
        var Instruct1 = this.add.image(sc_widt,sc_high,'Slide1')

        if (this.NextCount > 1 && this.NextCount<7){
            Instruct1.destroy()     //default slide is destroyed and we move to next slide
            var Instruct = this.add.image(sc_widt,sc_high,`${this.SlideName}`)
        }
        //if this.Next = 0, it means player wants to get to Menu
        if(this.NextCount === 0){
            this.NextCount = 1
            this.scene.start('ChooseAvatar',{ playerImageKey: this.playerImage,reload:1})
        }

        if(this.NextCount===7){
            this.NextCount = 1
            this.scene.start('TrainingPredatorMean',{ playerImageKey: this.playerImage})  //Start Training after 6th Next
        }

        const NextButton= this.add.text(900, 575, 'Next', { fill: '#0f0' });
        NextButton.setScale(1.5)
        NextButton.setInteractive().on('pointerdown', () => this.ShowNextSlide())
            .on('pointerover', () => this.ButtonHoverState(NextButton) )
            .on('pointerout', () => this.ButtonRestState(NextButton) );

        const BackButton= this.add.text(75, 575, 'Back', { fill: '#0f0' });
        BackButton.setScale(1.5)
        BackButton.setInteractive().on('pointerdown', () => this.ShowPreviousSlide())
            .on('pointerover', () => this.ButtonHoverState(BackButton) )
            .on('pointerout', () => this.ButtonRestState(BackButton) );




    }


    ShowNextSlide(){
        this.NextCount = this.NextCount + 1
        this.SlideName = 'Slide'+String(this.NextCount)
        this.time.delayedCall(10, this.scene.restart(), [], this)


    }

    ShowPreviousSlide(){
        this.NextCount = this.NextCount - 1
        this.SlideName = 'Slide'+String(this.NextCount)
        this.time.delayedCall(10, this.scene.restart(), [], this)
    }

    ButtonHoverState(Button){
        Button.setStyle({ fill: '#ff0'});   //Button Colour changes when mouse hovers over this button
    }

    ButtonRestState(Button){
        Button.setStyle({ fill: '#0f0' });

    }

}