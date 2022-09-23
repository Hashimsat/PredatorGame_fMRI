import HeadphonesCheck from "../Functions/headphonesCheck.js";
import Phaser from "../lib/phaser.js";

// taken from: https://github.com/ChaitLabUCL/HeadphoneCheck_Test

export default class CheckHeadphone extends Phaser.Scene {

    init(data){
        this.sceneName = data.scenename
    }

    constructor() {
        super('Checkheadphone')}

    headphonesCheck

    preload(){}

    create(){

        //console.log(this.sceneName)

        if ( !this.sceneName){
            // Headphone check to be called first when the game starts, and secondly after block3.
            // For first call, the scene name is NaN so we go to chooseAvatar scene if headphone check passed
            // console.log('Is Nan true')
            this.sceneName = 'ChooseAvatar'
        }
        // console.log(this.sceneName)

        this.headphonesCheck = new HeadphonesCheck();
        // headphonesCheck.checkHeadphones()
        // console.log(this.headphonesCheck)

        this.headphonesCheck.checkHeadphones(this);



        // Optional: function to display the result after completing the test.
        function showResult(result) {
            let resultMessage = result ? 'Pass' : 'Fail';
            $('body').append('<div id="testResults" style="width: 100%; text-align: center; font-size: 3em;"></div>');
            $('#testResults')
                .append('<p style="margin-top: 1em;">' + resultMessage + '</p>')
                .append('<p>' + this.headphonesCheck.attemptRecord[this.headphonesCheck.attemptCount].numberCorrect + ' out of 6 correct<br>after ' + this.headphonesCheck.attemptCount + ' attempt(s).<br>(The pass mark is 6.)</p>')
                .append('<p><a href="https://sijiazhao.github.io/headphonecheck/">Go back to the Headphone Check homepage</a></p>');
        }

// Perform the check (optional: call the showResult function when finished).
        //headphonesCheck.checkHeadphones(this.showResult(result,headphonesCheck));
    }

    update(){

        // if (this.headphonesCheck.isHeadphones){
        //     this.scene.start('ChooseAvatar')
        // }
    }



    //     let resultMessage = result ? 'Pass' : 'Fail';
    //     $('body').append('<div id="testResults" style="width: 100%; text-align: center; font-size: 3em;"></div>');
    //     $('#testResults')
    //         .append('<p style="margin-top: 1em;">' + resultMessage + '</p>')
    //         .append('<p>' + headphonesCheck.attemptRecord[headphonesCheck.attemptCount].numberCorrect + ' out of 6 correct<br>after ' + headphonesCheck.attemptCount + ' attempt(s).<br>(The pass mark is 6.)</p>')
    //         .append('<p><a href="https://sijiazhao.github.io/headphonecheck/">Go back to the Headphone Check homepage</a></p>');
    // }

    export
}



