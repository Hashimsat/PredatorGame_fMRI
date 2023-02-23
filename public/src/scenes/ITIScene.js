import Phaser from '../lib/phaser.js'


export default class ITIScene extends Phaser.Scene {

    init(data) {
        this.PredatorNum = data.predatorNum
        this.playerImage = data.playerImageKey

    }

    constructor()
    {
        super('ITI')
    }

    preload() {

        this.load.image('ITI_BG','assets/ITI_Fixation.png')

    }

    create(){

        const sc_widt = this.scale.width / 2
        const sc_high = this.scale.height / 2
        this.add.image(sc_widt,sc_high,'ITI_BG').setScale(1.1)


        this.time.addEvent({ //,
            delay: 3500,   // addJitter 4 to 6 secs (ITI)
            callback: () => {
                this.scene.stop('ITI')
                this.scene.start('gameScene',{ playerImageKey: this.playerImage})
                // this.scene.resume('gameScene')


            },
            loop: false
        });




    }






}