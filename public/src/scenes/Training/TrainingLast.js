

import Phaser from '../../lib/phaser.js'
import {
    moveTorchOnCircle,
    moveCharacterAroundCircle,
    RunAnimation,
    StartLocationCommon,
    StartDelayTrain,
    RotatePredatorToPlayer,
    PlayerPredatorCollision,
    TorchPredatorCollision,
    ShowAllPredators,
    TorchPredatorMarkers,
    ChoosePredator,
    PredatorWarning,
    PredatorArrival,
    PromptToPlaceTorch,
    CircularDistance,
    movePredatorinCircularPath, mod,
} from "../../Functions/GameFunctions.js";


import {InitializeGameObjects,preloadInit,LoadingBar} from "../../Functions/GameUtils.js";

export default class TrainingLast extends Phaser.Scene {

    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors

    //variable for whether its training or testing
    train = 3  //3 value given to make this scene different from other training scenes

    // variables used for moving torch around circle
    radius = 150
    torch_initiation = 0;
    torchMovement = 0    //replaced spacebar_movement
    torchturnedON = 0;


    //torch initialization variables
    MinimumFlameSize=20/100

    //torch and fire
    torch_handle
    torch_smoke

    //Predator_Speed = 300  //currently this is the speed at which predators appear
    Predator_Speed = 300
    //Predator_PredefinedMean = [71,73,60,79,55,329,327,345,362,330]   //variance 15, means are 75 and 340
    Predator_PredefinedMean = [49,352,358,19,21,0,12,354,168,203,198,207,145,171,213]   //std 20, means are 180 and 10
    Predator_PredefinedTypes = [2,1,3,1,2,2,3,1,1,2,2,1,3,3,1]
    ShowPredators

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
    Prev_Player_Finalx = 320+175
    Prev_Player_Finaly = 320

    // Prompt text var
    Prompt; PredatorText

    //Additional Predator Variables
    PredType
    PrevCoordinate = 0

    //zone
    zone
    zone_collider = 0  // variable that allows the leaving zone function to run only once
    theta
    AngularDistance; PlayerAngle
    target = new Phaser.Math.Vector2();

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
        super('TrainLast')
    }

    preload(){
        preloadInit(this,this.trialNum)
    }

    preload() {

        //this default function loads assets for further use in the game
        preloadInit(this,this.trialNum)


    }

    create() {
        let CurrentPredatorAngle
        let circle
        RunAnimation(this)    //preload all animations

       // console.log('TRAINING DIFFERENT PREDATORS STARTED')

        //initialize data variables
        this.torchMovement = 0 //torch not moved initially
        this.torch_initiation = 0; this.torchturnedON = 0;
        this.ScoreIncrement = 0;

        //training trial number
        this.trialNum = this.trialNum + 1
        this.zone_collider = 0; this.PrevCoordinate = 0

        if (this.trialNum>1){
            this.FirstTime = false
        }

        InitializeGameObjects(this)

        //Predator only appears from varied locations, centered around a mean
        //Changepoint occurs after 5 trials

        StartLocationCommon(this,this.Predator_PredefinedMean[this.trialNum-1],this.sc_widt)
        this.theta = Phaser.Math.DegToRad(this.Predator_PredefinedMean[this.trialNum-1])

        //Select a predator randomly from the 3 options available



        this.PredType = this.Predator_PredefinedTypes[this.trialNum-1]   //chosen fromPredefined_PredatorType


        this.predator = ChoosePredator(this,this.PredType,this.sc_widt,this.sc_high)
        StartDelayTrain(this,this.predator,this.train,this.trialNum,this.Predator_ActualMean,this.Predator_PredefinedMean,this.Predator_PredefinedTypes)   //add delay before game fully starts

        this.predator.scene.add.existing(this.predator)
        // CurrentPredatorAngle = Phaser.Math.Angle.Between(this.sc_widt, this.sc_high,this.startx,this.starty)
        //this.predator.setRotation(CurrentPredatorAngle)
        // RotatePredatorToPlayer(this,CurrentPredatorAngle,this.predator,this.Player)
        //RotatePredatorToPlayer(scene,)

        // this.time.addEvent({
        //     delay: 50,
        //     callback: () => {
        //         [this.Prompt] = PromptToPlaceTorch(this)
        //         //PredatorWarning(scene,predatorObject.ActualName)
        //         //PredatorArrival(scene,predatorObject,train)
        //     },
        //     loop: false
        // });

        //make collider bounds same as object
        this.predator.body.updateFromGameObject()
        this.predator.setBodySize(75,75,true)






        //check for collisions

        this.physics.add.collider(this.predator, this.Player, () => {
            PlayerPredatorCollision(this,this.train)
        })

        //collision only happens if torch moved (initial click on avatar pressed), otherwise torch remains

        this.physics.add.collider(this.predator, this.torch_smoke, () => {

            TorchPredatorCollision(this,this.train)

        })


        ///////////////////////
        this.zone = this.add.zone(120, 120).setOrigin(0.5,0.5)
        this.physics.world.enable(this.zone, 0); // (0) DYNAMIC (1) STATIC
        this.zone.body.setAllowGravity(false);
        this.zone.body.moves = false;
        this.zone.body.setCircle(200);

        // console.log(this.zone)

        this.physics.add.overlap(this.predator, this.zone);

        // this.zone.on('enterzone', () => console.log('enterzone'));
        // this.zone.on('leavezone', () => console.log('leavezone'));



        const scoreVal = 0;

        this.scoretext = this.make.text({x: this.sc_widt,
            y: this.sc_high - 200,
            text: scoreVal,
            origin: 0.5,
            style: {
                font: 'bold 14px Arial',
                fill: 'white',
                backgroundColor: 'rgba(3,93,248,0.23)',
            },

        }) //initially put score  = 0

        //End game if escape pressed
        this.escape = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)

        // if (this.trialNum == 6 || this.trialNum == 11){
        //
        //     // Tell people that the predator will change now
        //     var promptText = this.make.text({x: this.sc_widt,
        //         y: this.sc_high -225,
        //         text: 'Lets Train With a Different Predator',  ///
        //         origin: 0.5,
        //         style: {
        //             font: 'bold 15px Arial',
        //             fill: 'white',
        //             backgroundColor: 'rgb(119,19,19)',
        //             align: 'center'
        //         },
        //     })
        //
        //
        //     this.time.addEvent({
        //             delay: 3500,
        //             callback: () => {
        //                 promptText.destroy()
        //             },
        //             loop: false
        //         })
        //
        // }

        if (this.trialNum >= 15){
            this.trialNum = 0
            this.FirstTime = true
            this.torch_initiation = 0;
            this.scene.start('PromptStartGame')
        }

    }

    update() {

        //this default function runs every millisecond
        //this.torch_initiation is same as this.spacebar_count

        //
        this.Player.on('pointerdown',function (){
            if (this.torch_initiation  === 0) {
                this.torch_initiation=1;  //press mouse button to start moving torch
                this.torchMovement = 1;
                this.torchturnedON = 1;
                this.Torch.setVisible(true)
                this.torch_smoke.setVisible(true)
                this.torch_smoke.body.enable = true
                this.torch_handle.setVisible(true)         //make the handle and torch visible


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

        // if (this.torch_initiation === 3){
        //     // Predator only arrives after participants have fixed their torches
        //
        //     this.Prompt.destroy()
        //     PredatorWarning(this,this.predator.ActualName)
        //     PredatorArrival(this,this.predator,this.train)
        //
        //     this.torch_initiation =4;   // Once predator arrives, change torch_initiation value
        //
        //
        // }
        //
        // if (this.torch_initiation === 4){
        //
        //     // After fixing torch, click again to turn torch on
        //     this.input.on('pointerdown', function () {
        //         if (this.torch_initiation === 4) {
        //
        //
        //             this.torch_initiation = 5;
        //             this.Torch.setVisible(true);
        //             this.Torch.body.enable = true;
        //             this.torch_smoke.setVisible(true);
        //             this.torch_smoke.body.enable = true;
        //
        //         }
        //     }, this)
        //
        // }

        this.scoretext.setText('\nScore: ' + this.score)

        if (this.escape.isDown){
            this.Discontinue = 1;
            this.scene.start('premature-end',{score: this.score, trialNumbers: this.trialNum, Discontinued: this.Discontinue,train:this.train})
        }


        ///////////
        let theta = Math.atan2(this.Player.x - this.sc_widt, this.Player.y - this.sc_high)
        theta = mod(Math.PI - theta,2*Math.PI)
        theta = Phaser.Math.RadToDeg(theta)
        theta = mod((theta + 270),360)
        this.PlayerAngle = theta

        var touching = this.zone.body.touching;
        var wasTouching = this.zone.body.wasTouching;

        if (touching.none && !wasTouching.none  && this.zone_collider == 0) {
            this.zone.emit('leavezone');
            this.zone_collider = 1

            this.AngularDistance = (CircularDistance(this,this.PlayerAngle,this.Predator_PredefinedMean[this.trialNum-1]))

            movePredatorinCircularPath(this,this.predator,this.theta,this.AngularDistance)

            // PredatorAttackingPlayer(this,this.predator,this.PredAngle,this.torchangle)
            // this.physics.moveTo(this.predator,this.Player.x,this.Player.y,this.predator.speedo)
            this.physics.world.disable(this.zone)

        }
        else if (!touching.none && wasTouching.none) {
            this.zone.emit('enterzone');

        }



        this.zone.body.debugBodyColor = this.zone.body.touching.none ? 0x00ffff : 0xffff00;


        var distance = Phaser.Math.Distance.Between(this.predator.x, this.predator.y, this.target.x, this.target.y);

        if (distance < 4)
        {
            this.predator.body.reset(this.target.x, this.target.y);  // Stop predator once it reaches target (the new position as it moves in circle)
        }


    }













    export

}