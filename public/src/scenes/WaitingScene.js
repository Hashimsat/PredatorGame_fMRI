import Phaser from '../lib/phaser.js'



export default class WaitingScene extends Phaser.Scene {



    init(data) {
        this.PredatorNum = data.predatorNum
        this.playerImage = data.playerImageKey
        this.sceneName = data.sceneName

    }

    constructor()
    {
        super('Wait')
    }

    preload() {

        this.load.image('Black','assets/Black.png')
        this.load.image('Predator','assets/PredatorBW.png')


    }

    create(){

        const sc_widt = this.scale.width / 2
        const sc_high = this.scale.height / 2
        this.add.image(sc_widt,sc_high,'Black').setScale(1.1)

        this.add.image(sc_widt,sc_high,'Predator').setScale(0.35)



        this.time.addEvent({ //,
            delay: 2500,   // addJitter 1.5 to 2.5 secs,
            callback: () => {
                this.scene.stop('Wait')
                this.scene.resume(this.sceneName)


            },
            loop: false
        });




    }






}