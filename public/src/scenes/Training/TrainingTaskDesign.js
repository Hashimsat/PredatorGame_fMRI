

import Phaser from '../../lib/phaser.js'
import {
    moveTorchOnCircle,
    RunAnimation,
    MovingText,Alarm, TrainingPromptToMoveTorch,PromptToTurnTorchOn,
} from "../../Functions/GameFunctions.js";

import {InitializeGameObjects,preloadInit} from "../../Functions/GameUtils.js";

import Panther from '../../game/Panther.js'

export default class TrainingGameDesign extends Phaser.Scene {




    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors

    //variable for whether its training or testing
    train = 1

    // variables used for moving torch around circle
    radius = 150
    torchMovement = 0
    torch_initiation = 0;



    //torch initialization variables
    MinimumFlameSize=15/100

    //torch and fire
    torch_handle; torch_smoke

    Predator_Speed = 300  //currently this is the speed at which predators appear
    Predator_PredefinedMean = [120,120,120,120,120,315,315,315,315,315]
    Predator_PredefinedTypes = [2,2,2,2,2,2,2,2,2,2]
    Predator_ActualMean = [120,315]


    //Get center of image
    sc_widt
    sc_high

    //score and lives counter
    score = 0
    ScoreIncrement = 0

    //trial number
    trialNum=0
    FirstTime = true

    //start point of predator
    startx
    starty
    MeanAngle

    //variables to store location of torch position on and place of predator arrival in previous trial
    Prev_torch_x = null
    Prev_torch_y = null
    Prev_torch_angle
    Prev_predator_x
    Prev_predator_y
    Prev_predator_angle
    Prev_Player_Finalx
    Prev_Player_Finaly

    // Prompt text var
    Prompt; PredatorText; TorchonPrompt

    // Additional Predator Variables
    PredType


    /** @type {Phaser.Physics.Arcade.Sprite} */
    Torch

    /** @type {Phaser.Physics.Arcade.Sprite} */
    Player

    /** @type {Phaser.Physics.Arcade.Sprite} */
    predator

    init(data) {
        this.playerImage = data.playerImageKey

        this.scale.setGameSize(640,640)
        this.scale.updateBounds();

    }

    constructor() {
        super('TrainingTaskDesign')
    }

    preload(){
        preloadInit(this,this.trialNum)
    }


    create() {
        let CurrentPredatorAngle
        let circle
        RunAnimation(this)    //preload all animations

        //initialize data variables
        this.torchMovement = 0 //torch not moved initially



        //training trial number
        this.trialNum = this.trialNum + 1

        // if (this.trialNum>1){
        //     this.FirstTime = false
        // }


        InitializeGameObjects(this)

        ///

        this.time.addEvent({
            delay: 50,
            callback: () => {
                this.Prompt = TrainingPromptToMoveTorch(this)
                //PredatorWarning(scene,predatorObject.ActualName)
                //PredatorArrival(scene,predatorObject,train)
            },
            loop: false
        });



        //End game if escape pressed
        this.escape = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)

        if (this.trialNum >= 5){
            this.trialNum = 0
            this.FirstTime = true
            this.torch_initiation = 0;
            this.scene.start('StartingInstruct')
        }

    }

    update() {

        //this default function runs every millisecond
        //this.torch_initiation is same as this.spacebar_count

        //
        this.Player.on('pointerdown',function (){
            if (this.torch_initiation === 0) {
                this.torch_initiation=1;  //press mouse button to start moving torch

                this.torchMovement = 1

            }
        },this);

        if (this.torch_initiation === 1){
            [this.Prev_torch_x, this.Prev_torch_y, this.Prev_torch_angle, this.torchangle] = moveTorchOnCircle(this, this.Torch, this.torch_handle,this.torch_smoke, this.Player, this.torchMovement, this.input.x, this.input.y)

            this.input.on('pointerdown', function () {

                if (this.torch_initiation === 1) {
                    // we have 2 checks for torch_init = 1 bcz pointer down sometimes doesn't take into account the outer one
                    //start moving torch when torch is initiated
                    // console.log('torch init1',this.torch_initiation)

                    // console.log('torch clicked1', this.torch_initiation)
                    this.torch_initiation = 3;
                    this.torchx = this.Torch.x;  //store final location of torch
                    this.torchy = this.Torch.y

                }

            }, this);
        }


        if (this.torch_initiation === 3){
            // Predator only arrives after participants have fixed their torches

            this.Prompt.destroy()

            Alarm(this)


            // PredatorWarning(this,this.predator.ActualName)
            // PredatorArrival(this,this.predator,this.train)

            this.torch_initiation =4;   // Once predator arrives, change torch_initiation value


        }

        if (this.torch_initiation === 4){

            this.TorchonPrompt = PromptToTurnTorchOn(this)

            console.log(this.torch_initiation)
            // After fixing torch, click again to turn torch on
            this.input.on('pointerdown', function () {
                if (this.torch_initiation === 4) {

                    this.torch_initiation = 5;
                    console.log(this.torch_initiation)
                    this.Torch.setVisible(true);
                    this.Torch.body.enable = true;
                    this.torch_smoke.setVisible(true);
                    this.torch_smoke.body.enable = true;
                }
            }, this)

        }

        if (this.torch_initiation === 5){

            MovingText(this,'Great',this.torch_smoke)
            this.TorchonPrompt.destroy()
            this.torch_initiation = 0
            this.lives--

            this.time.addEvent({
                delay: 700,
                callback: () => {

                    this.scene.restart()

                },
                loop: false
            })

        }

        // this.scoretext.setText('\nScore: ' + this.score)

        if (this.escape.isDown){
            this.Discontinue = 1;
            this.scene.start('premature-end',{score: this.score, trialNumbers: this.trialNum, Discontinued: this.Discontinue,train:this.train})
        }



    }








    export

}