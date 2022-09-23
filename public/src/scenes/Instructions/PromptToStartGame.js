import Phaser from '../../lib/phaser.js'

export default class PromptToStartGame extends Phaser.Scene {

    init(data) {
        this.playerImage = data.playerImageKey
    }

    constructor() {
        super('PromptStartGame')
    }

    create(){

        const width = this.scale.width
        const height = this.scale.height

        var PromptText = this.add.text(width * 0.5, height * 0.2,'Training Ended!',{fontSize: 30,align: 'center'}).setOrigin(0.5)

        this.add.text(width * 0.5, height * 0.5,'Time to wander out in the jungle'+ '\nand get some water',{fontSize: 30,align: 'center'})
            .setOrigin(0.5);

        const StartButton= this.add.text(500, 550, 'Start', { fill: '#0f0' });
        StartButton.setScale(1.5)
        StartButton.setInteractive().on('pointerdown', () => this.scene.start('gameScene',{ playerImageKey: this.playerImage}))
            .on('pointerover', () => this.ButtonHoverState(StartButton) )
            .on('pointerout', () => this.ButtonRestState(StartButton) );

        const BackButton= this.add.text(75, 550, 'Back To Menu', { fill: '#0f0' });
        BackButton.setScale(1.5)
        BackButton.setInteractive().on('pointerdown', () => this.scene.start('Menu',{ playerImageKey: this.playerImage}))
            .on('pointerover', () => this.ButtonHoverState(BackButton) )
            .on('pointerout', () => this.ButtonRestState(BackButton) );
    }

    ButtonHoverState(Button){
        Button.setStyle({ fill: '#ff0'});   //Button Colour changes when mouse hovers over this button
    }

    ButtonRestState(Button){
        Button.setStyle({ fill: '#0f0' });

    }

}