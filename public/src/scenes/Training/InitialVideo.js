import Phaser from '../../lib/phaser.js'

export default class InitialVideo extends Phaser.Scene {

    Video

    init(data) {
        this.playerImage = data.playerImageKey
        this.scale.setGameSize(1070,640)
        this.scale.updateBounds();
    }

    constructor() {
        super('VideoInitial')
    }

    preload() {

        this.load.video('training_start','assets/VideoStart.mp4')

    }

    create() {


        const sc_widt = this.scale.width / 2
        const sc_high = this.scale.height / 2
        this.Video = this.add.video(sc_widt,sc_high,'training_start')

        this.Video.play(false)

        // console.log(this.Video.isPlaying, this.Video)






        // const NextButton = this.add.text(900, 575, 'Next', {fill: '#0f0'});
        // NextButton.setScale(1.5)
        // NextButton.setInteractive().on('pointerdown', () => this.scene.start('TrainingPredatorVar', {playerImageKey: this.playerImage}))
        //     .on('pointerover', () => this.ButtonHoverState(NextButton))
        //     .on('pointerout', () => this.ButtonRestState(NextButton));
        //
        // const BackButton = this.add.text(75, 575, 'Back', {fill: '#0f0'});
        // BackButton.setScale(1.5)
        // BackButton.setInteractive().on('pointerdown', () => this.scene.start('FirstInstruct', {playerImageKey: this.playerImage}))
        //     .on('pointerover', () => this.ButtonHoverState(BackButton))
        //     .on('pointerout', () => this.ButtonRestState(BackButton));

        // }




    }

    update() {


        if (!this.Video.isPlaying()) {
            this.scene.start('StartingInstruct', {playerImageKey: this.playerImage})

            // console.log('running')
        }

    }


    ButtonHoverState(Button){
        Button.setStyle({ fill: '#ff0'});   //Button Colour changes when mouse hovers over this button
    }

    ButtonRestState(Button){
        Button.setStyle({ fill: '#0f0' });

    }

}