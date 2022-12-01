import Phaser from '../lib/phaser.js'


import {
    moveTorchOnCircle,
    RunAnimation,
    StartLocationCommon,
    ChoosePredator,
    StartDelayTest,
    PlayerPredatorCollision,
    TorchPredatorCollision,
    TorchPredatorMarkers,
    PredatorArrival,
    PredatorWarning,
    mod,
    PromptToPlaceTorch,
    PredatorAttackingPlayer,
    movePredatorinCircularPath,
    CircularDistance
} from "../Functions/GameFunctions.js";
import {InitializeGameObjects,preloadInit} from "../Functions/GameUtils.js";






import Cheetah from '../game/Cheetah.js'
import Panther from '../game/Panther.js'
import Snow from '../game/Snow.js'





export default class GameScene extends Phaser.Scene {

    // initialize some global variables that would be used across functions

    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors

    //variable for whether the scene is related to training or testing
    train = 0     //0 = Main Game, 1 = Training period

    // variables used for moving torch around circle
    radius = 150     // radius of inner circle around which torch moves
    torch_initiation = 0;  //torch initially fixed



    //torch initialization variables
    MinimumFlameSize=15/100

    //variable for torch and fire
    torch_handle
    torch_smoke

    Predator_Speed = 300  //currently this is the speed at which predators attack
    PredatorArray = [1,2,3]

    //Get center of image
    sc_widt
    sc_high

    //score and lives counter
    score = 0
    ScoreIncrement = 0
    FirstTime = true
    Max_lives = 30
    lives = this.Max_lives;


    //start point of predator
    startx
    starty
    MeanAngle
    radPredCircle

    //variable to keep count of trials after changepoint
    AfterChangeCount

    //variables to store location of torch position and place of predator arrival in previous trial, so markers can be placed at these points
    Prev_torch_x = null
    Prev_torch_y = null
    Prev_torch_angle
    Prev_predator_x
    Prev_predator_y
    Prev_predator_angle
    Prev_Player_Finalx = 320+175
    Prev_Player_Finaly = 320


    //Variables for Data Collection -> Trial Info
    trialNum = 0
    PredAngle
    PredType; PredSpeed;  PredAttackTime
    PredStd;
    torchx=0;
    torchy=0; torchangle = 0; torchsize; torchMovement=0; torchturnedON = 0;
    PredictAngle;Success; //success = 0 if player eaten by predator
    CP //changepoint , if CP = 1; Changepoint occurs, otherwise CP = 0
    RTInit;RTConf; RTTorchOn;
    Discontinue = 0 ; //whether participant discontinued trial by pressing escape key
    StartTime

    // Variables to store mouse tracking data
    Mouse_x = {} ; Mouse_y = {};
    arr_MouseX = {} ; arr_MouseY = {}

    // Prompt text var
    Prompt; PredatorText

    //zone
    zone
    zone_collider = 0  // variable that allows the leaving zone function to run only once
    theta
    AngularDistance



    /** @type {Phaser.Physics.Arcade.Sprite} */
    Torch

    /** @type {Phaser.Physics.Arcade.Sprite} */
    Player

    /** @type {Phaser.Physics.Arcade.Sprite} */
    predator

    init(data) {
        this.playerImage = data.playerImageKey   //Gets the name of avatar chosen by participants in ChooseAvatar scene
        // this.scale.setGameSize(window.innerWidth,window.innerHeight)
        // this.scale.updateBounds();
    }

    constructor() {
        super('gameScene')
    }

    preload(){
        preloadInit(this,this.trialNum)   // Data preloaded through another function found in GameUtils. This function can be reused by different scenes

    }


    create() {

        RunAnimation(this)    //preload all animations



        //initialize data variables
        // Calculate number of trials & Initialize variables
        this.trialNum = this.trialNum + 1
        this.CP = 0 //first trial not a changepoint
        this.torchMovement = 0 //torch not moved initially
        this.torchturnedON = 0
        this.torchx = null;this.torchy=null;this.torchangle = null;
        this.RTInit = null ; this.RTConf = null ; this.RTTorchOn = null;
        this.zone_collider = 0





        //set game time as time at start of game
        var today = new Date();
        this.game.ms = today.getTime();
        this.StartTime = this.game.ms

        this.arr_MouseX = []; this.arr_MouseY = [];   // arrays to store mouse tracking data for one trial (data for each trial will then be stored with all other trials in a meta-tracking object)

        this.TrackMouse()
        InitializeGameObjects(this)  //game objects common across scenes loaded and initialized through this common function found in GameUtils

        //Initialize AfterChangePoint Variable, gets reset to zero after 3 trials
        // This count is kept so that there is a gap of atleast 3 trials between changepoints



        if (this.AfterChangeCount === 3)
        {
            this.AfterChangeCount = 0;

        }

        //set initial position of predator (location from where it will appear from)

        this.PredatorStartLocationUpdated()   //function found in this scene


        //Select a predator randomly from the 3 options available

        if (this.trialNum === 1) {
            this.ChoosePredatorBlocked()
        }

        //
        // const PredatorArray = [1, 2, 3]   //each number represents a specific predator; 1=Cheetah, 2=Panther; 3=Snow
        // this.PredType = Phaser.Utils.Array.GetRandom(PredatorArray)   //choose one number randomly from PredatorArray


        //ChoosePredator function chooses predator depending upon the value in this.PredType
        this.predator = ChoosePredator(this,this.PredType,this.sc_widt, this.sc_high)
        //StartDelayTest(this,this.predator,this.train)   //add a delay after which warning occurs, and then predator appears after another delay that depends upon type of predator chosen


        ///////



        ///

        this.time.addEvent({
            delay: 50,
            callback: () => {
                [this.Prompt] = PromptToPlaceTorch(this)
                //PredatorWarning(scene,predatorObject.ActualName)
                //PredatorArrival(scene,predatorObject,train)
            },
            loop: false
        });

        //make collider bounds same as object
        this.predator.body.updateFromGameObject()
        this.predator.setBodySize(15,15,true)
        //this.Torch.setBodySize(200,200,true)

        //put a circular body around torch, centered correctly

        // Degrees to pixel conversion debug
        // var g1 = this.add.grid(320, 320, 250, 250, 5, 5, 0xff0000).setAltFillStyle(0x016fce).setOutlineStyle().setAlpha(0.5);
        //
        // for( let i = 0; i<=360; ){
        //
        //         var angleCh = Phaser.Math.DegToRad(i)
        //         var line = this.add.line(320,320,0,0,450,450,0x0096b7,1.5);
        //         line.setAngle(i)
        //
        //         i = i+5
        //
        //     }


        // check for collisions between torch & predator or player & predator

        this.physics.add.collider(this.predator, this.Player, () => {
            PlayerPredatorCollision(this,this.train)
        })

        //collision only happens if torch moved (initial click on avatar), otherwise torch remains hidden

        this.physics.add.collider(this.predator, this.torch_smoke, () => {

            TorchPredatorCollision(this,this.train)

        })

        ///////////////////////
        this.zone = this.add.zone(120, 120).setOrigin(0.5,0.5)
        this.physics.world.enable(this.zone, 0); // (0) DYNAMIC (1) STATIC
        this.zone.body.setAllowGravity(false);
        this.zone.body.moves = false;
        this.zone.body.setCircle(200);

        console.log(this.zone)

        this.physics.add.overlap(this.predator, this.zone);

        this.zone.on('enterzone', () => console.log('enterzone'));
        this.zone.on('leavezone', () => console.log('leavezone'));

//         let zone = this.add.zone(320,320)
//         this.physics.world.enable(zone);
//         zone.body.setCircle(150);
//
// // 3. THE FUNCTION
//         const onOverlap = (sprite, zone) => {
//             console.log('THE SPRITE IS OVER THE ZONE')
//         }
//
// // 4. WHERE EVERYTHING COMES TO LIVE.
//         this.physics.add.overlap(this.predator, zone, onOverlap)


        //score count and update

        const scoreVal = 0; //initially put score  = 0

        this.scoretext = this.make.text({x: this.sc_widt,
            y: this.sc_high - 200,
            text: scoreVal,
            origin: 0.5,
            style: {
                font: 'bold 14px Arial',
                fill: 'white',
                backgroundColor: 'rgba(3,93,248,0.23)',
            },

        })

        //Create Esc key to End game if escape pressed
        this.escape = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)


    }


    update() {

        //this default function runs every millisecond
        //

        //
        this.radPredCircle = Math.min(window.innerWidth,window.innerHeight)

        this.Player.on('pointerdown',function (){
            if (this.torch_initiation === 0) {
                this.torch_initiation=1;  //click mouse on character to start moving torch
                this.torchMovement = 1;

                //save Initiation Reaction Time
                var timeInit =  new Date().getTime()   //calculates number of milliseconds since 1970 to current time
                this.RTInit = Math.abs(timeInit - this.StartTime)



            }
        },this);

        if (this.torch_initiation === 1){
            [this.Prev_torch_x, this.Prev_torch_y, this.Prev_torch_angle, this.torchangle] = moveTorchOnCircle(this, this.Torch, this.torch_handle,this.torch_smoke, this.Player, this.torchMovement, this.input.x, this.input.y)

            this.input.on('pointerdown', function () {

                if (this.torch_initiation === 1) {
                    //start moving torch when torch is initiated

                    this.torch_initiation = 3;
                    this.torchx = this.Torch.x;  //store final location of torch
                    this.torchy = this.Torch.y

                    var timeConfirm = new Date().getTime()   //calculates number of milliseconds since 1970 to current time

                    this.RTConf = Math.abs(timeConfirm - this.game.ms)   //time at which participants fix torch loc
                }

            }, this);
        }

        //stop moving torch when position fixed by mouse click



        if (this.torch_initiation === 3){
            // Predator only arrives after participants have fixed their torches
            this.torch_initiation =4;   // Once predator arrives, change torch_initiation value
            this.Prompt.destroy()

            // console.log(this.torch_initiation)
            PredatorWarning(this,this.predator.ActualName)
            PredatorArrival(this,this.predator,this.train)
        }

        if (this.torch_initiation === 4){


            // After fixing torch, click again to turn torch on
            this.input.on('pointerdown', function () {
                if (this.torch_initiation === 4) {

                    var timeConfirm = new Date().getTime()   //calculates number of milliseconds since 1970 to current time

                    this.RTTorchOn = Math.abs(timeConfirm - this.game.ms)   //time at which participants turns torch on
                    this.torchturnedON = 1;

                    this.torch_initiation = 5;

                    this.Torch.setVisible(true);
                    this.Torch.body.enable = true;
                    this.torch_smoke.setVisible(true);
                    this.torch_smoke.body.enable = true;

                }
            }, this)

        }


        //show score and number of lives left

        this.scoretext.setText('Lives Left: ' + this.lives +
            '\nScore: ' + this.score)

        //monitor if esc is pressed and discontinue if it is
        if (this.escape.isDown){
            this.Discontinue = 1;
            this.addData()
            this.scene.start('premature-end',{score: this.score, MaxLives: this.Max_lives, trialNumbers: this.trialNum, Discontinued: this.Discontinue,train:this.train,mousetrackX:this.Mouse_x,mousetrackY:this.Mouse_y,})
            // this.ReInitializeVariablesAtEnd();
        }


        ///////////
        var touching = this.zone.body.touching;
        var wasTouching = this.zone.body.wasTouching;

        if (touching.none && !wasTouching.none  && this.zone_collider == 0) {
            this.zone.emit('leavezone');
            this.zone_collider = 1

            this.AngularDistance = (CircularDistance(this,this.torchangle,this.PredAngle))

            // PredatorAttackingPlayer(this,this.predator,this.PredAngle,this.torchangle)
            // this.physics.moveTo(this.predator,this.Player.x,this.Player.y,this.predator.speedo)
            this.physics.world.disable(this.zone)

        }
        else if (!touching.none && wasTouching.none) {
            this.zone.emit('enterzone');

        }

        if (this.zone_collider == 1){
            this.theta = movePredatorinCircularPath(this,this.predator,this.theta,this.AngularDistance)
        }

        this.zone.body.debugBodyColor = this.zone.body.touching.none ? 0x00ffff : 0xffff00;




    }  //update ends here

    //custom functions from here on



    addData() {
        //save data from all trials one by one to cache, to be stored in firestore once game finishes or is prematurely ended


        this.cache.game.data.Totalscore.push(this.score);
        this.cache.game.data.trialNumber.push(this.trialNum)
        this.cache.game.data.PredatorType.push(this.PredType)
        this.cache.game.data.PredatorName.push(this.predator.ActualName)
        this.cache.game.data.Predator_x.push(this.startx)
        this.cache.game.data.Predator_y.push(this.starty)
        this.cache.game.data.PredatorMean.push(this.MeanAngle)
        this.cache.game.data.PredatorAngle.push(this.PredAngle)
        this.cache.game.data.PredatorStd.push(this.PredStd)
        this.cache.game.data.PredatorSpeed.push(this.Predator_Speed)
        this.cache.game.data.PredatorAttackTime.push(this.predator.AttackTime)

        this.cache.game.data.torchMoved.push(this.torchMovement)
        this.cache.game.data.torchON.push(this.torchturnedON)
        this.cache.game.data.torch_x.push(this.torchx)
        this.cache.game.data.torch_y.push(this.torchy)
        this.cache.game.data.torchSize.push(this.torchsize)
        this.cache.game.data.torchAngle.push(this.torchangle)

        this.cache.game.data.RTInitiation.push(this.RTInit)
        this.cache.game.data.RTConfirmation.push(this.RTConf)
        this.cache.game.data.RTTorchON.push(this.RTTorchOn)

        this.cache.game.data.LivesLeft.push(this.lives)

        if (this.torchMovement===1)
        {
            this.PredictAngle = CircularDistance(this,this.PredAngle,this.torchangle) //calculate PE

        }
        else if(this.torchMovement === 0)
        {
            this.PredictAngle = null
        }

        this.cache.game.data.PredictionError.push(this.PredictAngle)

        this.cache.game.data.HitMiss.push(this.Success)
        this.cache.game.data.ChangePoint.push(this.CP)

        var end = new Date().getTime();
        var time = end - this.StartTime;

        //Store mouse tracking data into objects, so that we have mouse tracking for all trials in a single object with different keys
        this.Mouse_x[this.trialNum] = this.arr_MouseX
        this.Mouse_y[this.trialNum] = this.arr_MouseY


    };

    ReInitializeVariablesAtEnd() {

        //After end of entire game, reset variable values after saving data
        this.addData()


        this.lives = this.Max_lives
        this.FirstTime = true
        this.torch_initiation = 0
        this.torchturnedON = 0
        this.Prev_torch_x = null
        this.Prev_torch_y = null
        this.scene.start('game-over', {score: this.score,MaxLives: this.Max_lives ,trialNumbers: this.trialNum, Discontinued: this.Discontinue, mousetrackX: this.Mouse_x,mousetrackY: this.Mouse_y})
        this.score = 0
        this.trialNum = 0
        this.Mouse_x = {}; this.Mouse_y = {};

    }



    PredatorStartLocationUpdated() {

        // Function that determines initial start location of predator
        // Takes into account both expected uncertainty and unexpected uncertainty

        var kappa = 15  //precision of vonmises distribution
        var variance = 1/kappa  //variance calculated from precision for wrapped normal dist.

        //var std = Phaser.Math.RadToDeg(Math.sqrt(variance))   //std in degrees rather than radians
        var std = 20
        this.PredStd = std


        // radius equal to length of one side, so animal always appears from circle that touches edges/sides of square (circle inside square)

        // var rad = Math.min(this.sc_widt,this.sc_high);
        // // var rad =this.radPredCircle/2
        var rad = 320



        var NormallyDistributedAngle
        let Choice = 0


        //calculate whether change should occur or not on this trial based on changeprobability
        // First trial is always considered as if its a changepoint trial

        if (!this.FirstTime) {
            //console.log('loop2 entered')

            if (this.AfterChangeCount > 0)  //Changepoints can't occur atleast within 3 trials of previous changepoint
            {
                Choice = 1   //choice = 1 says stay with the same mean, choice = 2 says shift mean (changepoint)
            }

            else if (this.AfterChangeCount === 0) {


                let ChangeProbability = {1: 0.88, 2: 0.12}  //1 = stay same //2 = unexpected change point

                let i, sum = 0, r = Math.random();
                for (i in ChangeProbability) {
                    sum += ChangeProbability[i];
                    if (r <= sum) {
                        Choice = i;  //to choose a new location or to remain at the same, inversion sampling

                        this.CP = Choice-1  //CP = 0 means no changepoint, CP =1 is changepoint (1 subtracted to show this)
                       // console.log('CP is',this.CP)
                        break;
                    }
                }
            }

        }

       //console.log('Choice is',Choice)

        //if we don't have a changepoint on this trial, we calculate new predator location using same mean
        if (Choice == 1)
        {
            NormallyDistributedAngle = this.normalRandomScaled(this.MeanAngle,std)   //sample from a normal dist with given mean
            //console.log('Std is',std)
            NormallyDistributedAngle = mod(NormallyDistributedAngle,(360))   //wrap the angle around a circle, effectively making it wrapped normal
            //console.log('Choice 1, Mean angle is',this.MeanAngle)
            StartLocationCommon(this,NormallyDistributedAngle,rad)

            if (this.AfterChangeCount > 0)
            {
                this.AfterChangeCount++;
            }

        }

        //if changepoint happens or its the first trial, new mean calculated, and new location derived using this mean
        else if (Choice == 2 || this.FirstTime)
        {
            this.MeanAngle = Phaser.Math.Between(0, 360)  // sample again from uniform distribution, to get a new random position/angle

            //next line done for redundant safety
            this.MeanAngle = mod(this.MeanAngle,(360))
            //Phaser here uses right hand clockwise coordinate system (0 on east, 90 on south,180 west, 270 north)
            //phaser has 0deg as positive y-axis (where we usually consider theta = 90deg)


            NormallyDistributedAngle = this.normalRandomScaled(this.MeanAngle, std)
            NormallyDistributedAngle = mod(NormallyDistributedAngle,(360))

            //console.log('Choice 2, NDA is',NormallyDistributedAngle)
            StartLocationCommon(this,NormallyDistributedAngle,rad)
            this.AfterChangeCount = 1
            this.FirstTime = false

        }

        //Store values for further data storage
        this.PredAngle = NormallyDistributedAngle
        this.theta = Phaser.Math.DegToRad(this.PredAngle)

        //store location of predator arrival on previous trial
        this.Prev_predator_x =this.startx;
        this.Prev_predator_y = this.starty;


    }





    /// Functions to create normal distribution
    spareRandom = null;

    normalRandom()
    //pseudo-normal-random number generator
    //created by code in Marsaglia-polar.js from https://gist.github.com/bluesmoon/7925696
    //This function only generates random numbers from a normal distribution with mean 0 and std 1

    {
        var val, u, v, s, mul;

        if(this.spareRandom !== null)
        {
            val = this.spareRandom;
            this.spareRandom = null;
        }
        else
        {
            do
            {
                u = Math.random()*2-1;
                v = Math.random()*2-1;

                s = u*u+v*v;
            } while(s === 0 || s >= 1);

            mul = Math.sqrt(-2 * Math.log(s) / s);

            val = u * mul;
            this.spareRandom = v * mul;
        }

        return val;
    }


    normalRandomScaled(mean, stddev)
    {
        //This function makes use of this.normalRandom() function
        //generates random numbers from a normal distribution with user desired mean and std

        var r = this.normalRandom();

        r = r * stddev + mean;

        return Math.round(r);

    }


    // CircularDistance(angle1,angle2){
    //
    //     //calculates distance between 2 angles, alongwith the sign showing if angle1 is > or < angle2
    //     //formula: shortest distance = PI - abs(PI - abs(angle1 - angle2))
    //
    //     var term1 = Phaser.Math.DegToRad(angle1) - Phaser.Math.DegToRad(angle2)
    //     var sign_term1 = Math.sign(term1)
    //     var term2 = Math.PI - Math.abs(term1)
    //     var sign_term2 = Math.sign(term2)
    //     var sign_overall = sign_term1*sign_term2
    //
    //     if (sign_overall != 0) {
    //         var shortest_distance = sign_overall * Phaser.Math.RadToDeg(Math.PI - Math.abs(term2))
    //     }
    //
    //     else if (sign_overall === 0){
    //         var shortest_distance = Phaser.Math.RadToDeg(Math.PI - Math.abs(term2))
    //     }
    //
    //     return shortest_distance
    //
    //
    //
    // }

    TrackMouse(){

        //Track Mouse data after every 100ms
        this.time.addEvent({
            delay:100,
            callback: function () {
                this.arr_MouseX.push(this.input.x)
                this.arr_MouseY.push(this.input.y)

            },
            callbackScope: this,
            loop: true
        });

    }


    ChoosePredatorBlocked(){

        if (!this.PredatorArray.length){   // Refill predator array if it goes empty (after 3rd block)
            this.PredatorArray = [1,2,3];
        }

        const randomItem = arr => arr.splice((Math.random() * arr.length) | 0, 1); //Pop a random item out of array
        this.PredType = randomItem(this.PredatorArray)[0]   //choose one number randomly from PredatorArray

        console.log(this.PredType)
        console.log(this.PredatorArray)

    }


    export

}
