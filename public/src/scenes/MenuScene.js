import Phaser from '../lib/phaser.js'

export default class MenuScene extends Phaser.Scene {

    init(data) {
        this.playerImage = data.playerImageKey
    }

    constructor() {
        super('Menu')
    }
    
    create(){
        const width = this.scale.width
        const height = this.scale.height

        console.log(width,height)

        this.add.text(width * 0.5, height * 0.2, 'MENU', {
            fontSize: 40,
            fill:'#d5f3f7'
        }).setOrigin(0.5)



        const StartGame= this.add.text(width * 0.5, height * 0.5, 'Start Game', { fontSize:25,fill: '#F38BE3' });
        StartGame.setInteractive().on('pointerdown', () => this.scene.start('gameScene',{ playerImageKey: this.playerImage}))
            .on('pointerover', () => this.ButtonHoverState(StartGame))
            .on('pointerout', () => this.ButtonRestState(StartGame))
            .setOrigin(0.5);

        const StartInstruction= this.add.text(width * 0.5, height * 0.7, 'Go To Instructions and Tutorial', { fontSize:25,fill: '#F38BE3' });
        StartInstruction.setInteractive().on('pointerdown', () => this.scene.start('TrainingTaskDesign',{ playerImageKey: this.playerImage}))
            .on('pointerover', () => this.ButtonHoverState(StartInstruction) )
            .on('pointerout', () => this.ButtonRestState(StartInstruction))
            .setOrigin(0.5);


        this.add.text(width * 0.5, height * 0.9, 'Press Esc to Exit at any time', {
            fontSize: 15,
            fill:'#d5f3f7'
        }).setOrigin(0.5)
    }

    ButtonHoverState(Button){
        Button.setStyle({ fill: '#ff0'});   //Button Colour changes when mouse hovers over this button
    }

    ButtonRestState(Button){
        Button.setStyle({ fill: '#F38BE3' });

    }



}