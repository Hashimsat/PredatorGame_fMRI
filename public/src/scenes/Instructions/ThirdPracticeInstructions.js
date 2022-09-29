import Phaser from '../../lib/phaser.js'

export default class ThirdPracticeInstructions extends Phaser.Scene {

    init(data) {
        this.playerImage = data.playerImageKey
        this.scale.setGameSize(1070,640)
        this.scale.updateBounds();
    }

    constructor() {
        super('ThirdInstruct')
    }

    preload() {

        this.load.image('Slide9','assets/Resize9.png')

    }

    create() {


        const sc_widt = this.scale.width / 2
        const sc_high = this.scale.height / 2
        var Instruct1 = this.add.image(sc_widt,sc_high,'Slide9')


        const NextButton= this.add.text(900, 575, 'Next', { fill: '#0f0' });
        NextButton.setScale(1.5)
        NextButton.setInteractive().on('pointerdown', () => this.scene.start('TrainingDifferentPreds',{ playerImageKey: this.playerImage}))
            .on('pointerover', () => this.ButtonHoverState(NextButton) )
            .on('pointerout', () => this.ButtonRestState(NextButton) );

        const BackButton= this.add.text(75, 575, 'Back', { fill: '#0f0' });
        BackButton.setScale(1.5)
        BackButton.setInteractive().on('pointerdown', () => this.scene.start('SecondInstruct',{ playerImageKey: this.playerImage}))
            .on('pointerover', () => this.ButtonHoverState(BackButton) )
            .on('pointerout', () => this.ButtonRestState(BackButton) );




    }

    update(){

    }


    ButtonHoverState(Button){
        Button.setStyle({ fill: '#ff0'});   //Button Colour changes when mouse hovers over this button
    }

    ButtonRestState(Button){
        Button.setStyle({ fill: '#0f0' });

    }

}