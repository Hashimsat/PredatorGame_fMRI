import Phaser from "../lib/phaser.js";
import Cheetah from "../game/Cheetah.js";
import Panther from "../game/Panther.js";
import Snow from "../game/Snow.js";






export const moveTorchOnCircle =(scene,gameobjectTorch,handle,smoke,PlayerObject,torchMoved = 0 ,x,y) => {
    //function that updates torch position depending upon the input angle
    // code inspired by: https://www.html5gamedevs.com/topic/18140-how-drag-sprite-around-circle/

    //torch becomes visible and only moves with mouse if avatar clicked

    //torch and torch handle move together
    //gameobjectTorch = torch
    //handle = torch_handle
    //PlayerObject = this.Player; player avatar object
    //torchMoved = this.torchMovement ; whether torch has already moved or not
    //x,y  = cursor input x and y

    //

    // Output Data:
    //torchAngle, Prev_torchx,Prev_torchy,Prev_torchAngle

    // data storage variables that would be returned/output of function
    //

    let TorchAngleCorrected, TorchAngle


    let theta = Math.atan2(x - scene.sc_widt, y - scene.sc_high)

    let thetaPlayer = mod(-(theta + Math.PI/2) - Math.PI,2*Math.PI)



    // let theta = Math.atan2(x, y)
    TorchAngle = mod(Math.PI - theta,2*Math.PI)





    // let [new1,new2] = AngleToCoordinates(scene,theta,scene.radius)

    let [new1,new2] = AngleToCoordinates(scene,theta,120)


    gameobjectTorch.x = scene.sc_widt + new2;
    gameobjectTorch.y = scene.sc_high + new1;

    smoke.x = gameobjectTorch.x;
    smoke.y = gameobjectTorch.y;

    //gameobjectTorch.body.updateFromGameObject()

    [new1,new2] = AngleToCoordinates(scene,theta,150)

    handle.x = scene.sc_widt + new2;
    handle.y = scene.sc_high + new1;





    gameobjectTorch.setRotation(TorchAngle)
    handle.setRotation(TorchAngle);
    smoke.setRotation(TorchAngle)

    let angCheck = TorchAngle

    // let angCheck = mod((-theta  - Math.PI),2*Math.PI)

    // gameobjectTorch.setRotation(angCheck)

    console.log(angCheck,TorchAngle,theta)

    gameobjectTorch.flipY = true
    // handle.setRotation(angCheck-0.005);
    handle.flipY = true
    // smoke.setRotation(angCheck)
    smoke.flipY = true



    gameobjectTorch.setVisible(false)
    smoke.setVisible(false)
    gameobjectTorch.body.enable = false
    handle.setVisible(true)         //make the handle and torch visible
    //turn torch on as soon as spacebar pressed

    //torch angle data

    TorchAngleCorrected = Phaser.Math.RadToDeg( TorchAngle)
    //theta is from -180 to 180. 0 at south, -180/180 at North, -90 at East, 90 at West
    //to make the system compatible with PredatorAngle, we change it a bit.
    //PredAngle is 0 at east, 90 at south, 180 at west and 270 at north

    TorchAngleCorrected = mod((TorchAngleCorrected + 270),360)
    // console.log('Torch Angle is',TorchAngleCorrected)



    //store location of torch on previous trials
    //On each drag, this keeps updating until no dragging is possible, which is the final torch location

    // scene.Prev_torch_x = gameobjectTorch.x;
    // scene.Prev_torch_y = gameobjectTorch.y;
    // scene.Prev_torch_angle = Math.PI - theta;


    //start moving player avatar with the torch when participants start moving torch


    let [newPlayerX,newPlayerY] = AngleToCoordinates(scene,thetaPlayer,220)
    //5 is radius of circle around which player moves
    PlayerObject.x = (scene.sc_widt) + newPlayerX;
    PlayerObject.y = (scene.sc_high) + newPlayerY;



    // console.log(gameobjectTorch.x,gameobjectTorch.y,TorchAngle)



    //
    moveCharacterAroundCircle(scene,theta,PlayerObject)

    // return [gameobjectTorch.x,gameobjectTorch.y,TorchAngle,TorchAngleCorrected]
    return [handle.x,handle.y,TorchAngle,TorchAngleCorrected]

}

export const moveCharacterAroundCircle = (scene,Angle,PlayerObject) => {

    //we need to figure out appropriate direction towards which player is moving and then set the frames accordingly.
    //This is done by using PlayerPrevAngle. By comparing current angle and previous angle, we can identify direction.
    //Then, we can use frames such that the player always moves appropriately, rather than moving such that it has a reverse gear :P

    let AngleDeg = Phaser.Math.RadToDeg(Angle)
    var FrameNumber

    console.log(AngleDeg)

    //Angle is 0 at South (270 deg). Angle is 180 at North. 180 to 0 from North to South through east, 0 to -180 from South to
    // North through west. Overall range from -180 to 180

    // 7 frames where avatar moves in 'right' direction. So frame change after 26 deg (180/7)

    if (AngleDeg ===  0)
        FrameNumber = 0
    PlayerObject.setFrame(FrameNumber)


    if (AngleDeg >20) {
        //if player moving from South to North or North to South through east
        //Angle >20 degrees chosen so the character faces towards screen longer and doesn't turn

        FrameNumber = Math.ceil(AngleDeg / 26)+7;

        PlayerObject.setFrame(FrameNumber)

    }


    if (AngleDeg <-20) {
        //if player moving from South to North or North to South through west
        FrameNumber = Math.ceil(-AngleDeg / 26);

        PlayerObject.setFrame(FrameNumber)

    }

    if(AngleDeg<20 & AngleDeg > -20) {
        //if player moving from South to North or North to South through west
        FrameNumber = 7

        PlayerObject.setFrame(FrameNumber)

    }

    if(AngleDeg<-155 || AngleDeg > 155) {
        //if player moving from South to North or North to South through west
        FrameNumber = 0

        PlayerObject.setFrame(FrameNumber)


        console.log('FrameNum',FrameNumber)
    }

}

export const RunAnimation =(scene) => {

    scene.anims.create({
        key: 'AvatarAnim',
        frames: scene.anims.generateFrameNumbers('character', {frames: [0,1,2,3,4,6,7,8,9,10,11,12,13]}),
        frameRate: 1.5,
        repeat: -1
    });

    scene.anims.create({
        key: 'torch',
        frames: scene.anims.generateFrameNumbers('torch', {frames: [3,4,5,6,7,8]}),
        frameRate: 8,
        repeat: -1
    });

    scene.anims.create({
        key: 'smoke',
        frames: scene.anims.generateFrameNumbers('torch_smoke', {frames: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,25,26,27,28,29,30,31,32,34,35,36,37]}),
        frameRate: 7,
        ///25,26,27,28,29,30,31,32,34,35,36,37
        repeat: -1
    });


    //create animations for different predators, which shows them running towards Player

    scene.anims.create({
        key: 'CheeRunner',
        frames: scene.anims.generateFrameNumbers('CheetaRun', {frames: [0, 1, 2, 3, 4, 5, 6]}),
        frameRate: (scene.Predator_Speed/10)+3,
        repeat: -1
    });

    scene.anims.create({
        key: 'PantherRunner',
        frames: scene.anims.generateFrameNumbers('PantherRun', {frames: [0, 1, 2, 3, 4, 5, 6]}),
        frameRate: (scene.Predator_Speed/10)+3,   //just an approximate empirical number
        repeat: -1
    });

    scene.anims.create({
        key: 'SnowyRunner',
        frames: scene.anims.generateFrameNumbers('SnowRun', {frames: [0, 1, 2, 3, 4, 5, 6]}),
        frameRate: (scene.Predator_Speed/10),
        repeat: -1
    });

    //create explosion animation when predator hits Player
    scene.anims.create({
        key: "explode",
        frames: scene.anims.generateFrameNumbers('explosion', {frames: [0, 1, 2, 3]}),
        frameRate: 10,
        repeat: 1
    });

    // create sad emoji when animal hits Player

    scene.anims.create({
        key: 'sad',
        frames: scene.anims.generateFrameNumbers('sadEmoji', {frames: [0,1,2,3,4,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]}),
        frameRate: 28,
        repeat: 1
    });

}

export const StartLocationCommon = (scene,AngleDeg,rad) =>{


    //Update start location of Predator depending upon angle and radius of circle from which predator appears

    // console.log('Predator Angle is',AngleDeg)

    var AngleRad
    AngleRad = Phaser.Math.DegToRad(AngleDeg)   //convert angle to radians


    let [newSX,newSY] = AngleToCoordinates(scene,AngleRad,rad)



    scene.startx = scene.sc_widt + newSX
    scene.starty = scene.sc_high + newSY
    //
    //store location of predator arrival on previous trial
    scene.Prev_predator_x =scene.startx;
    scene.Prev_predator_y = scene.starty;



}


export const StartDelayTest = (scene,predatorObject,train) => {  //texture = this.predator

    //function which calls each predator (plays warning) to attack after a delay of 2050ms after game starts
    //after this delay, every predator has its own delay added (in PredatorArrival)

    scene.time.addEvent({
        delay: 2050,
        callback: () => {
            PromptToPlaceTorch(scene)
            //PredatorWarning(scene,predatorObject.ActualName)
            //PredatorArrival(scene,predatorObject,train)
        },
        loop: false
    });
}

export const StartDelayTrain = (scene,predatorObject,train,trialNum,ActualMean,Predator_PredefinedMean,Predator_PredefinedTypes) => {  //texture = this.predator

    //function which calls each predator (plays warning) to attack after a delay of 2050ms after game starts
    //after this delay, every predator has its own delay added (in PredatorArrival)

    scene.time.addEvent({
        delay: 10, //2050
        callback: () => {
            // PredatorWarning(scene,predatorObject.ActualName)
            // PredatorArrival(scene,predatorObject,train)

            if (train === 1){
                predatorObject.visible = true
                if (trialNum <=5) {
                    OptimalTorchLocationMarker(scene, ActualMean[0])
                } else if (trialNum>5){
                    OptimalTorchLocationMarker(scene,ActualMean[1])
                }

            }


            else if(train === 2){
                if (trialNum <=5){
                    ShowAllPredators(scene,trialNum,Predator_PredefinedMean.slice(0,5),Predator_PredefinedTypes.slice(0,5),scene.sc_widt)
                    OptimalTorchLocationMarker(scene,ActualMean[0])
                } else if (trialNum>5){
                    ShowAllPredators(scene,trialNum-5,Predator_PredefinedMean.slice(5,10),Predator_PredefinedTypes.slice(5,10),scene.sc_widt)
                    OptimalTorchLocationMarker(scene,ActualMean[1])
                }
                predatorObject.visible = true   //predator waiting at its location becomes visible when warning occurs on training trials
            }



        },
        loop: false
    });
}

export const PredatorArrival = (scene,predatora,train) => {

    //function that makes the predator arrive on the screen after a small delay

    scene.time.addEvent({ //,
        delay: predatora.AttackTime,
        callback: () => {


           // console.log('Time after warning', predatora.AttackTime)
            var ch = predatora.name

            RunAnimation(scene)
            predatora.play(ch)



            scene.PredatorText.destroy();
            scene.torch_initiation =5;
            scene.InitialMouseClick_movement = true

            //position of player saved so it can be used to calculate predator marker (predator moves towards player rather than center of circle)
            scene.Prev_Player_Finalx = scene.Player.x;
            scene.Prev_Player_Finaly = scene.Player.y


            //torch size changes, randomly for each trial based on an exponential distribution

            // var scalesize = scene.MinimumFlameSize + RandomSampleFromExponential(1/0.1)   //Mean of exponential dist. = 1/lambda
            //
            // if (scalesize > 0.16 ){
            //     scalesize = 0.16   //max scale of flame is 0.16  //0.16 scale is approx. 46 deg
            // }

            var scalesize = scene.MinimumFlameSize + RandomSampleFromExponential(1/0.5)   //Mean of exponential dist. = 1/lambda

            if (scalesize > 0.5 ){
                scalesize = 0.5   //max scale of flame is 0.16
            }

            scene.Torch.setScale(scene.MinimumFlameSize + scalesize/4)   //minFlameSize added so size is between min flame size to end of distribution instead of starting from 0
            scene.torch_smoke.setScale(scalesize)
            //scene.Torch.setScale(0.4)
            scene.torchsize = scalesize
            scene.Torch.body.updateFromGameObject()
            scene.torch_smoke.body.updateFromGameObject()

            // console.log('scale size is', scalesize)
            // console.log('body size is', scene.Torch.body)
            // console.log('body center is', scene.Torch.body.center)
           // console.log('Torch scale is', scene.Torch.scale)

            //console.log(scene.Torch.body)
            //

            predatora.visible = true
            predatora.body.updateFromGameObject()
            predatora.scene.add.existing(predatora)

           // console.log('Predator Spedd 2 is',scene.Predator_Speed)
           //  var rotateAngle = scene.physics.moveTo(predatora, scene.Player.x,scene.Player.y, scene.Predator_Speed)
            var rotateAngle = scene.physics.moveTo(predatora, scene.startx,scene.starty, scene.Predator_Speed)
           // console.log('Angle is',Phaser.Math.RadToDeg(rotateAngle))
            RotatePredatorToPlayer(scene,rotateAngle,predatora,scene.Player)
            scene.Prev_predator_angle = rotateAngle;

            //draw predator path if training sessions
            if(train === 1 || train === 2) {
                PredatorPath(scene)
            }

        },
        loop: false
    });

}

export const RandomSampleFromExponential = function(lambda) {
    if ('number' !== typeof lambda) {
        throw new TypeError('nextExponential: lambda must be number.');
    }
    if (lambda <= 0) {
        throw new TypeError('nextExponential: ' +
            'lambda must be greater than 0.');
    }

    var rand = - Math.log(1 - Math.random()) / lambda;


   // console.log('Size sampling is',rand)
    return rand;
};

export const PredatorWarning = (scene,texture) => {

    //show text and audio warning about approaching predator

    // let Alarm = scene.sound.add("Alarm", {
    //     volume: 0.5,
    //     loop: false
    // });
    // var txt = this.add.text(30, 200, texture);
    // txt.setColor('white')
    Alarm(scene)
    ScoreUpdate(scene)  //Score only updates once predator warning appears

    var predatorText = scene.make.text({x: scene.sc_widt,
        y: scene.sc_high - 240,
        text: 'Predator: ' + texture + ' ' + scene.predator.SpeedType,
        origin: 0.5,
        style: {
            font: 'bold 14px Arial',
            fill: 'white',
            backgroundColor: 'rgba(6,9,199,0.78)',
        },

    })

    scene.PredatorText = predatorText
    // Alarm.play()


}

export const Alarm = (scene) => {
    let Alarm = scene.sound.add("Alarm", {
        volume: 0.5,
        loop: false
    });

    Alarm.play()
}

export const PromptToPlaceTorch = (scene) => {

    // This function creates text prompting players to move and place torch

    var promptText = scene.make.text({x: scene.sc_widt,
        y: scene.sc_high - 260,
        text: 'Please Choose Flame Location',
        origin: 0.5,
        style: {
            font: 'bold 15px Arial',
            fill: 'white',
            backgroundColor: 'rgba(236,87,7,0.78)'

        },

    })

    // var predatorText = scene.make.text({
    //     x: 320,
    //     y: 103,
    //     text: 'Next Animal: ' + scene.predator.ActualName + ' ' + scene.predator.SpeedType,
    //     origin: 0.5,
    //     style: {
    //         font: 'bold 15px Arial',
    //         fill: 'white',
    //         backgroundColor: 'rgba(6,9,199,0.78)'
    //         // backgroundColor: 'rgba(83,231,66,0.78)',
    //     },
    // })

    return [promptText]

}

// export const PredatorText = (scene) => {
//
//     // This function creates text prompting players to move and place torch
//
//     var predatorText = scene.make.text({
//         x: 320,
//         y: 80,
//         text: 'Please Choose Torch Location',
//         origin: 0.5,
//         style: {
//             font: 'bold 16px Arial',
//             fill: 'white',
//             backgroundColor: 'rgba(236,87,7,0.78)'
//
//         },
//
//     })
//
//     return predatorText
// }

export const TrainingPromptToMoveTorch = (scene) => {
    var promptText = scene.make.text({x: scene.sc_widt,
        y: scene.sc_high - 230,
        text: 'Please Activate Flame by'  + ' Clicking on Avatar'+ '\n'  + ' and Choose Flame Location by Clicking Again',  ///
        origin: 0.5,
        style: {
            font: 'bold 15px Arial',
            fill: 'white',
            backgroundColor: 'rgba(236,87,7,0.78)',
            align: 'center'
        },

    })

    return promptText


}

export const PromptToTurnTorchOn = (scene) => {
    var promptText = scene.make.text({x: scene.sc_widt,
        y: scene.sc_high - 230,
        text: 'Please Turn Flame On by' +'\n' +' Clicking Left Mouse Button',
        origin: 0.5,
        style: {
            font: 'bold 15px Arial',
            fill: 'white',
            backgroundColor: 'rgba(236,87,7,0.78)',
            align: 'center'
        },

    })

    return promptText


}



export const ScoreUpdate = (scene) => {

    //Function to update score, 1 increment after every 7ms
    var count = 0

    scene.scoreEvent = scene.time.addEvent({
        delay: 100,
        callback: function () {
            if (scene.torch_initiation === 4) {
                scene.score += 1
                count += 1;
                scene.ScoreIncrement = count;
            }
        },
        callbackScope: scene,
        loop: true
    });


}

export const RotatePredatorToPlayer = (scene,rotAngle,PredatorObject,PlayerObject) => {
    //Rotate predator so it faces the Player

    // angle in radians
    //if (scene.predator.x > scene.Player.x)

    // if (PredatorObject.x > PlayerObject.x)
    if (rotAngle < 180)
    {
        PredatorObject.setRotation(rotAngle)
        PredatorObject.flipY = true
    }
    else
    {
        PredatorObject.setRotation(rotAngle)
    }
}

export const PlayerPredatorCollision = (scene,train) => {

    //collider that kills Player and restarts game on collision between Player and predator
    scene.Success = 0
    ScreamPlayer(scene)
    scene.predator.active = false
    scene.predator.body.moves = false
    scene.physics.disableUpdate()

    // if (this.AfterChangeCount === 0) {
    //     this.lives--;    //3 trials after changepoint are safe trials, after which players start losing lives
    // }

    if (train == 0) {

        if (scene.trialNum > 3) {
            scene.lives--;    //3 trials after changepoint are safe trials, after which players start losing lives
        }

        //this.torch_initiation = 0;   //stop torch from moving once Player is eaten

        scene.predator.setVisible(false)
        scene.Torch.setVisible(false)
        scene.torch_handle.setVisible(false)
        scene.torch_smoke.setVisible(false)


       // console.log('Lives remaining are', scene.lives)

        if (scene.lives !== 0) {
            scene.Player.play('explode').once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
               // console.log('animation complete')
                scene.torch_initiation = 0
                scene.addData()
                scene.Player.destroy();

                scene.time.delayedCall(40, scene.scene.restart(), [], scene)


            })
        } else if (scene.lives === 0) {   //end game if no lives remaining
            scene.Discontinue = 0
            scene.ReInitializeVariablesAtEnd()

        }
    } else if (train === 1 || train===2 || train===3) {

        scene.predator.setVisible(false)
        scene.Torch.setVisible(false)
        scene.torch_smoke.setVisible(false)
        scene.torch_handle.setVisible(false)

        scene.Player.play('explode').once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
           // console.log('animation complete')
            scene.torch_initiation = 0
            scene.lives--
            scene.Player.destroy();

            scene.time.delayedCall(40, scene.scene.restart(), [], scene)
            //this.scene.restart()


        })
    }
}

export const TorchPredatorCollision = (scene,train) => {

    //collider that makes predator run away if it collides with torch
    scene.physics.world.disable(scene.zone)
    scene.zone_collider = 2
    scene.Success = 1
    const rotateAngle = scene.physics.moveTo(scene.predator, scene.sc_widt,scene.sc_high, scene.Predator_Speed)
    scene.predator.flipX = true //  accurately make animal run away, flipping it appropriately

    console.log(scene.startx,scene.starty)

    // score increases depending on type of predator scared away
    MovingText(scene, scene.ScoreIncrement, scene.torch_smoke)


    scene.time.addEvent({
        delay: 550,
        callback: () => {
            scene.torch_initiation = 0
            scene.predator.destroy()
            if (train == 0) {
                scene.addData()
            }
            scene.scene.restart()


        },
        loop: false
    })

}

export const PredatorAttackingPlayer = (scene,predatorObject,predatorAngle,PlayerAngle) => {

    // If predator isn't stopped by the torch, it runs around in a circle and attacks the player

    // var rotAngle = scene.physics.moveTo(scene.predator,scene.Player.x,scene.Player.y,scene.Predator_Speed)
    // RotatePredatorToPlayer(scene,rotAngle,scene.predator,scene.Player)

    ///////
    // var graphics = scene.add.graphics()
    //     .lineStyle(1, 0xffffff, 0.5);
    // var path = new Phaser.Curves.Path(320, 320).circleTo(200);
    //
    // path.draw(graphics, 128);
    //
    // console.log(path)

    // scene.predator = scene.add.follower(path,scene.predator.x,scene.predator.y,scene.predator.fileName).setScale()
    // scene.predator.startFollow({
    //     duration: 3000,
    //     yoyo: true,
    //     repeat: -1,
    //     rotateToPath:false,
    //     rotationOffset: 0
    // });
    let AngularDistance = (CircularDistance(scene,PlayerAngle,predatorAngle))
    let sign = Math.sign(AngularDistance)
    let stepNumber = Math.abs(AngularDistance)
    let stepSize = AngularDistance/stepNumber
    let theta = Phaser.Math.DegToRad(predatorAngle)

    console.log(AngularDistance,sign,stepNumber,theta,Phaser.Math.DegToRad(PlayerAngle))

    for(let i=0;i<stepNumber;i++){

        theta = mod(theta + Phaser.Math.DegToRad((stepSize)),2*Math.PI)

        let [new1,new2] = AngleToCoordinates(scene,theta,200)
        let y = scene.sc_widt + new2;
        let x = scene.sc_high + new1;

        console.log(theta, x,y)


        var rotAngle = scene.physics.moveTo(predatorObject,x,y,scene.Predator_Speed)
        RotatePredatorToPlayer(scene,rotAngle,scene.predator,scene.Player)

        setTimeout(function() {
            console.log(i);
        }, 2000 * i);





    }








}

export const TorchPredatorMarkers = (scene) => {
// show where player placed torch on previous trial, also the location from where predator attacked


    if(!scene.FirstTime) {
        //only put markers after 2nd trial
        //if torch not moved on previous trial, marker shows the location of torch in the previous trial in which torch was moved

        const torch_marker = scene.add.line(scene.Prev_torch_x, scene.Prev_torch_y, 0, 0, 15, 15, 0xff0000)
        torch_marker.setRotation(scene.Prev_torch_angle - 40)  //40 subtracted so line is appropriately representing prev loc



        //predator marker would be at point of intersection between line from predator to player, and circle
        // let PredatorPlayerLine = new Phaser.Geom.Line(scene.Prev_predator_x,scene.Prev_predator_y,scene.Prev_Player_Finalx,scene.Prev_Player_Finaly)

        let PredatorPlayerLine = new Phaser.Geom.Line(scene.sc_widt,scene.sc_high,scene.Prev_predator_x,scene.Prev_predator_y)
        let circle =new Phaser.Geom.Circle(scene.sc_widt, scene.sc_high, scene.radius)

        console.log(PredatorPlayerLine)

        var checkpoint,xi,yi
        checkpoint = Phaser.Geom.Intersects.GetLineToCircle(PredatorPlayerLine,circle) //find intersection between circle and line

        console.log(checkpoint)

        xi = checkpoint[0].x
        yi= checkpoint[0].y

        const predator_marker = scene.add.line(xi,yi, 0, 0, 15, 15, 0x0000ff)
        predator_marker.setRotation(scene.Prev_predator_angle+40)  //40 added so line is appropriately representing prev loc

    }

}

export const OptimalTorchLocationMarker = (scene,ActualPredatorMean) => {

    //green line marker shows optimal location to place torch

    let AngleRad = Phaser.Math.DegToRad(ActualPredatorMean)   //convert angle to radians

    let [X,Y] = AngleToCoordinates(scene,AngleRad,scene.radius)

    let MeanY = scene.sc_widt + Y
    let MeanX = scene.sc_high + X
    const optimal_loc = scene.add.line(MeanX, MeanY, 0, 0, 15, 15, 0x399a2d)
    optimal_loc.setRotation(AngleRad + 40)  //40 subtracted so line is appropriately representing prev loc


}

export const PredatorPath = (scene) => {
    let graphics = scene.add.graphics();

    graphics.lineStyle(2, 0x00ff00, 1);

    // graphics.lineBetween(scene.startx,scene.starty,scene.Player.x,scene.Player.y);
    graphics.lineBetween(scene.sc_widt,scene.sc_high,scene.Player.x,scene.Player.y);
}

export const ShowAllPredators = (scene,trialNo,PredatorArray,PredatorType,rad)=>{


   // console.log('Trial num is',trialNo)
    //console.log('Predator Array length is',PredatorArray.length)
    //console.log('Predator Array  is',PredatorArray)
    for (let i = 0; i<PredatorArray.length; i++) {

       // console.log('I is',i)

        var TempPredLocX,TempPredLocY

        const AngleRad = Phaser.Math.DegToRad(PredatorArray[i]+i*(trialNo-1-i))   //convert angle to radians

        // var newSY = Math.sin(AngleRad) * rad
        // var newSX = Math.cos(AngleRad) * rad

        // let [newSX,newSY] = AngleToCoordinates(scene,AngleRad,rad)
        let [newSX,newSY] = AngleToCoordinates(scene,AngleRad,25)
        TempPredLocX = scene.sc_widt + newSX
        TempPredLocY = scene.sc_high+ newSY


        let ShowPredators = ChoosePredator(scene,PredatorType[i],TempPredLocX,TempPredLocY)
        // let ShowPredators = ChoosePredator(scene,PredatorType[i],scene.sc_widt,scene.sc_high)
        ShowPredators.scene.add.existing(ShowPredators)
        ShowPredators.setVisible(true)

        // var CurrentPredatorAngle = Phaser.Math.Angle.Between(ShowPredators.x, ShowPredators.y, scene.Player.x, scene.Player.y)
        var CurrentPredatorAngle = AngleRad
        //this.predator.setRotation(CurrentPredatorAngle)
        RotatePredatorToPlayer(scene, CurrentPredatorAngle, ShowPredators, scene.Player)

    }


}

export const MovingText = (scene, text, object) => {

    // this function shows the points added to score when players are successful in fending off predator

    var TextToMove = scene.make.text({x: (object.x + Math.sign(object.x - scene.sc_widt)*60),
        y: object.y + Math.sign(object.y)*60,
        text: '+ ' + text,
        origin: 0.5,
        style: {
            font: '16px Arial',
            fill: 'rgb(0,58,248)',
        },

    })



}

export const ChoosePredator = (scene,PredatorNum,x,y) =>{

    let PredatorObj


    if (PredatorNum === 1) {
        //add a Cheetah if 1 is selected

        PredatorObj = scene.physics.add.existing((new Cheetah(scene, x,y, 'CheetaRun')))

    } else if (PredatorNum === 2) {

        PredatorObj = scene.physics.add.existing((new Panther(scene, x,y, 'PantherRun')))

    } else if (PredatorNum === 3) {

        PredatorObj = scene.physics.add.existing((new Snow(scene, x,y, 'SnowRun')))

    }

    return PredatorObj


}

export const ScreamPlayer = (scene) => {

    //show text and audio warning about approaching predator

    var ScreamSound = scene.sound.add("Scream", {
        volume: 0.5,
        loop: false
    });

    ScreamSound.play()


}

export const AngleToCoordinates = (scene,angleRad,rad) => {

    let X = Math.cos(angleRad) * rad
    let Y = Math.sin(angleRad) * rad

    return [X,Y];


}


export const ScoreNormalization = (scene,torchMoveArray,score) => {

    //Players only receive score for trials in which they moved their torch

    /// Inputs:
    //torchMoveArray = array containing info regarding whether player moves torch or not in trials
    //score = array containing score in each trial ; (score accumulates in each trial so we need to first calculate score gathered in each individual trial)

    var Corrected_Score
    var score_difference = [];   //array containing the amount of score gathered from each trial
    score_difference[0] =score[0]


    var score_when_moved = []  //this array will contain score for ony those trials in which torch was moved

    if (torchMoveArray[0] ==1){
        score_when_moved[0] = score[0]   //loop below starts from 1, so we need to separately check for first trial
    }

    for (let i = 1; i< score.length;i++){
       // console.log('i is',i)

        score_difference[i] = (score[i] - score[i-1])

        if (torchMoveArray[i]>0){
            score_when_moved.push(score_difference[i])
        }
    }

    //sum all scores in array score_when_moved
    Corrected_Score = score_when_moved.reduce(function (x, y) {
        return x + y;
    }, 0);

    return Corrected_Score

}

export const ScoreSubtraction = (scene,trialsMoved,score) =>{
    let CorrectedScore
    let NoMovementNum


    NoMovementNum = trialsMoved.filter(element => element === 0).length;  //calculate number of zeros in array (trials in which torch was not moved)

    CorrectedScore = score - 10*NoMovementNum  //0 score penalty for each no movement trial


    if (CorrectedScore<=0){
        return [0,NoMovementNum]
    } else {
        return [CorrectedScore,NoMovementNum]
    }

}

export const saveData = (scene) =>  {

//[scene.scoreNormalized,scene.NumberTrialsNotMoved]



    [scene.scoreNormalized,scene.NumberTrialsNotON] = ScoreSubtraction(scene,scene.cache.game.data.torchON,scene.cache.game.data.Totalscore[scene.trialcount-1])


    if (scene.game.highscore < scene.scoreNormalized){
        scene.game.highscore = scene.scoreNormalized;
    }

    // console.log('save data initiated')

    var Block = 'Block ' + scene.cache.game.blockNum.toString()

    scene.cache.game.db.collection("Tasks").doc('CodeTest').collection('Subjects').doc(scene.cache.game.uid).collection('Game '+scene.cache.game.StartDate+' '+scene.cache.game.StartTime).doc(Block + ' '+scene.cache.game.time).set(scene.cache.game.data);
    scene.cache.game.db.collection("Tasks").doc('CodeTest').collection('Subjects').doc(scene.cache.game.uid).collection('Game '+scene.cache.game.StartDate+' '+scene.cache.game.StartTime).doc(Block + ' '+scene.cache.game.time).update({
        subjectID: scene.cache.game.subjectID,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        Discontinued: scene.Discon,
        MaxLives: scene.Max_lives,
        BlockNumber: scene.cache.game.blockNum,
        HighScore: scene.game.highscore,
        ScoreNormalized: scene.scoreNormalized,
        TrackMouse_x:scene.MouseX,
        TrackMouse_y: scene.MouseY,


    })

   // console.log(scene.MouseX)



}



export const mod = (n, m) => {
    return ((n % m) + m) % m;
}

export const movePredatorinCircularPath = (scene,predatorObject,theta,AngDistance) => {



    // scene.Player.body.enable = false
    //
    // let sign = Math.sign(AngDistance)
    //
    // scene.torch_smoke.body.enable = false
    //
    // // console.log(sign, AngDistance)
    //
    // // theta = mod(theta + (sign*0.015),2*Math.PI)
    // theta = mod(theta + (sign*0.013),2*Math.PI)
    //
    //
    // let [new1,new2] = AngleToCoordinates(scene,theta,220)
    //
    //
    // let x = scene.sc_widt + new2;
    // let y = scene.sc_high + new1;
    //
    // let rotAngle = Math.atan2(x - predatorObject.y, y - predatorObject.x)
    //
    // predatorObject.x = y
    // predatorObject.y = x
    //
    // scene.predator.setRotation(rotAngle)


    scene.time.addEvent({
        delay: 100,
        callback: () => {
            // scene.Player.body.enable = false

            let sign = Math.sign(AngDistance)

            scene.torch_smoke.body.enable = false

            // console.log(sign, AngDistance)

            // theta = mod(theta + (sign*0.015),2*Math.PI)

            console.log('Ang dist',AngDistance, scene.theta, scene.torchangle, Phaser.Math.RadToDeg(scene.theta))
            scene.theta = mod(scene.theta + (sign*0.15),2*Math.PI)


            let [new1,new2] = AngleToCoordinates(scene,scene.theta,220)


            scene.target.y = scene.sc_widt + new2;
            scene.target.x = scene.sc_high + new1;

            // let rotAngle = Math.atan2(x - predatorObject.y, y - predatorObject.x)

            // predatorObject.x = y
            // predatorObject.y = x
            var rotAngle = scene.physics.moveTo(predatorObject,scene.target.x,scene.target.y,scene.Predator_Speed)

            console.log(scene.target,scene.Predator_Speed)


            RotatePredatorToPlayer(scene,rotAngle,scene.predator,scene.Player)



            console.log('Theta',scene.theta)
            console.log('Rot angle', rotAngle)



            // scene.predator.rotation = (rotAngle)


        },
        loop: true
    })
    // console.log('Theta',theta, x, y)


    // var rotAngle = scene.physics.moveTo(predatorObject,y,x,scene.Predator_Speed)



    // console.log('Theta',theta)
    // console.log('Rot angle', rotAngle)
    // RotatePredatorToPlayer(scene,rotAngle,scene.predator,scene.Player)

    // return theta

    // scene.time.addEvent({
    //     delay: 550,
    //     callback: () => {
    //         scene.torch_initiation = 0
    //         scene.predator.destroy()
    //
    //         scene.scene.restart()
    //
    //
    //     },
    //     loop: false
    // })
}

export const PredatorDistributionAroundCenter = (scene,angle,rad) => {

}



export const CircularDistance = (scene,angle1,angle2) => {
    //calculates distance between 2 angles, alongwith the sign showing if angle1 is > or < angle2
    //formula: shortest distance = PI - abs(PI - abs(angle1 - angle2))

    var term1 = Phaser.Math.DegToRad(angle1) - Phaser.Math.DegToRad(angle2)
    var sign_term1 = Math.sign(term1)
    var term2 = Math.PI - Math.abs(term1)
    var sign_term2 = Math.sign(term2)
    var sign_overall = sign_term1*sign_term2

    if (sign_overall != 0) {
        var shortest_distance = sign_overall * Phaser.Math.RadToDeg(Math.PI - Math.abs(term2))
    }

    else if (sign_overall === 0){
        var shortest_distance = Phaser.Math.RadToDeg(Math.PI - Math.abs(term2))
    }



    return shortest_distance

}


