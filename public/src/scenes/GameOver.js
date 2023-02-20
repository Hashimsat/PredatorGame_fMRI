import Phaser from '../lib/phaser.js'

import {ScoreSubtraction,saveData} from "../Functions/GameFunctions.js";

export default class GameOver extends Phaser.Scene
{
    init(data) {
        this.ScoreVal = data.score;
        this.Max_lives = data.MaxLives
        this.trialcount = data.trialNumbers
        this.Discon = data.Discontinued
        this.MouseX = data.mousetrackX
        this.MouseY = data.mousetrackY

        // this.scale.setGameSize(1070,640)
        // this.scale.updateBounds();
    }

    constructor()
    {
        super('game-over')
    }

    scoreNormalized
    NumberTrialsNotON

    create()
    {

        const width = this.scale.width
        const height = this.scale.height
        const BlockLimit = 6;    //Number of blocks; 30 trials per block


        saveData(this)



        if (this.cache.game.blockNum < BlockLimit) {

            this.add.text(width * 0.5, height * 0.1, `Block ${this.cache.game.blockNum} of ${BlockLimit} Completed!`, {
                fontSize: 40
            })
                .setOrigin(0.5)

            this.add.text(width * 0.5, height * 0.25, 'Total Score In This Block:' + this.ScoreVal, {
                fontSize: 25
            })
                .setOrigin(0.5)

            this.add.text(width * 0.5, height * 0.35, 'Trials Played:' + this.trialcount, {
                fontSize: 25
            })
                .setOrigin(0.5)

            this.add.text(width * 0.5, height * 0.45, 'Trials where Flame Was Not Turned On:' + this.NumberTrialsNotON, {
                fontSize: 25
            })
                .setOrigin(0.5)


            // this.add.text(width * 0.5, height * 0.55, 'Final Score:' + this.scoreNormalized, {
            //     fontSize: 25
            // })
            //     .setOrigin(0.5)

            this.add.text(width * 0.5, height * 0.6, 'Highscore: ' + this.game.highscore, {
                fontSize: 25,
                color: 'rgba(13,239,5)'
            })
                .setOrigin(0.5)



            this.add.text(width * 0.5, height * 0.9, 'Press SpaceBar to Play Next Block', {
                fontSize: 20
            })
                .setOrigin(0.5)

            //Clear cache before restart
            this.cache.game.dataKeys.forEach(k => {
                this.cache.game.data[k] = [];
            });


            this.input.keyboard.once('keydown-SPACE', () => {
                // update date and time, so data isn't overwritten on game restart
                var today = new Date();

                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                var time = today.getHours() + "." + today.getMinutes() + "." + today.getSeconds();
                this.game.date = date;
                this.game.time = time;
                this.cache.game.blockNum = this.cache.game.blockNum + 1

                // Call headphone check in the middle of game

                if (this.cache.game.blockNum-1 == Math.round(BlockLimit/2)){

                    window.alert('Time for another Sound Check!')
                    this.scene.start('Checkheadphone',{ scenename: 'gameScene' })
                }

                else{
                    this.scene.start('gameScene')
                }
                // console.log('Block Number is',this.cache.game.blockNum)


            })

            this.input.keyboard.once('keydown-SPACE', () => {

            })




        }

        else if (this.cache.game.blockNum >= BlockLimit){

            this.add.text(width * 0.5, height * 0.1, 'Game Completed!', {
                fontSize: 40,
                color: 'green',
            }).setOrigin(0.5)


            this.add.text(width * 0.5, height * 0.25, 'Score in Final Block:'+ this.scoreNormalized , {
                fontSize: 25
            })
                .setOrigin(0.5)

            this.add.text(width * 0.5, height * 0.4, 'Highscore: ' + this.game.highscore, {
                fontSize: 25,
                color: 'rgb(13,239,5)'
            })
                .setOrigin(0.5)

            this.add.text(width * 0.5, height * 0.65,'Thank You For Taking Part in This Study', {
                fontSize: 25,
                color: 'rgba(5,239,192,0.78)'
            })
                .setOrigin(0.5)

            this.add.text(width * 0.5, height * 0.8, 'The Prolific Completion Code is: 86695121 ', {
                font: '25px Arial'
            })
                .setOrigin(0.5)




            //Clear cache before restart
            this.cache.game.dataKeys.forEach(k => {
                this.cache.game.data[k] = [];
            })
        }


    }


    // async saveData() {
    //
    //
    //     [this.scoreNormalized,this.NumberTrialsNotMoved] = ScoreSubtraction(this,this.cache.game.data.Totalscore[this.trialcount-1],this.cache.game.data.torchMoved)
    //
    //     if (this.game.highscore < this.scoreNormalized){
    //         this.game.highscore = this.scoreNormalized;
    //     }
    //
    //
    //
    //     var Block = 'Block ' + this.cache.game.blockNum.toString()
    //
    //     this.cache.game.db.collection("Tasks").doc('PilotTask').collection('Subjects').doc(this.cache.game.uid).collection('Game '+this.cache.game.StartTime+' '+this.cache.game.StartDate).doc(Block + ' '+this.cache.game.time).set(this.cache.game.data);
    //     this.cache.game.db.collection("Tasks").doc('PilotTask').collection('Subjects').doc(this.cache.game.uid).collection('Game '+this.cache.game.StartTime+' '+this.cache.game.StartDate).doc(Block + ' '+this.cache.game.time).update({
    //         subjectID: this.cache.game.subjectID,
    //         date: new Date().toLocaleDateString(),
    //         time: new Date().toLocaleTimeString(),
    //         Discontinued: this.Discon,
    //         BlockNumber: this.cache.game.blockNum,
    //         HighScore: this.game.highscore,
    //     })
    //
    //
    // }







}

