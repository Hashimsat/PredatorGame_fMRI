import Phaser from '../lib/phaser.js'

import {ScoreSubtraction,saveData} from "../Functions/GameFunctions.js";

export default class FailedSoundCheckEnding extends Phaser.Scene
{
    init(data){
        this.scale.setGameSize(1070,640)
        this.scale.updateBounds();

        this.ScoreVal = data.score;
        this.Max_lives = data.MaxLives
        this.trialcount = data.trialNumbers
        this.Discon = data.Discontinued
        this.trainVal = data.train
        this.MouseX = data.mousetrackX
        this.MouseY = data.mousetrackY
    }

    scoreNormalized
    NumberTrialsNotMoved

    constructor()
    {
        super('failedsoundcheck-end')
    }

    create() {

        const width = this.scale.width
        const height = this.scale.height

        if (this.trainVal === 0) {
            //console.log(this.MouseX)
            saveData(this)  //save data only for game scene and not for practice/training


        }


        this.add.text(width * 0.5, height * 0.4, 'Sound Check Not Passed', {
            fontSize: 25
        })
            .setOrigin(0.5)

        this.add.text(width * 0.5, height * 0.6, 'Thank You For Your Time :)', {
            fontSize: 25,
            color:'rgba(5,239,192,0.78)',
        })
            .setOrigin(0.5)

        this.add.text(width * 0.5, height * 0.8, 'The Prolific Code is: 146D6JKP ', {
            font: '25px Arial'
        })
            .setOrigin(0.5)


    }

}