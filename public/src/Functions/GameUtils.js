import {TorchPredatorMarkers} from "./GameFunctions.js";

export const InitializeGameObjects = (scene) => {
    let circle
    
    scene.InitialMouseClick_movement = false    //initialize that torch hasn't moved initially

    scene.sc_widt = scene.scale.width / 2
    scene.sc_high = scene.scale.height / 2

    //start adding images and sprites

    scene.add.image(scene.sc_widt, scene.sc_high, 'background-grass')


    //Player refers to persons` character here
    scene.Player = scene.physics.add.sprite(scene.Prev_Player_Finalx, scene.Prev_Player_Finaly, 'character').setScale(0.13,0.13).setImmovable().setInteractive();

    scene.Player.setFrame(0)
    scene.Player.body.updateFromGameObject()

    scene.Player.setBodySize(550,850,true)
    scene.Player.setOrigin(0.5, 0.5)



    // add a circle and a torch with random size
    circle = scene.add.circle(scene.sc_widt, scene.sc_high, scene.radius);
    circle.setStrokeStyle(6, 0xFFFFFF);
///////
//     circle = scene.add.circle(scene.sc_widt, scene.sc_high, scene.radius+40);
//     circle.setStrokeStyle(2, 0xFFFFFF);
////////
    TorchPredatorMarkers(scene)   //show location of predator and torch on previous trial




    scene.torch_smoke = scene.physics.add.sprite(scene.sc_widt+150,scene.sc_high+150,'torch_smoke').setInteractive().setImmovable(true)
    scene.torch_smoke.setVisible(false)
    scene.torch_smoke.setScale(scene.MinimumFlameSize+scene.MinimumFlameSize/2);
    // scene.torch_smoke.setScale(0.68)
    // scene.torch_smoke.setOrigin(0.6, 0.2)
    scene.torch_smoke.setOrigin(0.5, 0.5)
    scene.torch_smoke.play('smoke')

    scene.torch_smoke.body.setCircle(100,0,0)
    scene.torch_smoke.body.enable = false
    scene.torch_smoke.body.updateFromGameObject()


    scene.Torch= scene.physics.add.sprite(scene.sc_widt+150, scene.sc_high+150, 'torch').setInteractive().setImmovable(true)
    scene.Torch.setVisible(false)
    scene.Torch.setScale(scene.MinimumFlameSize);
    scene.Torch.setOrigin(0.5, 0.5)
    //scene.Torch.setScale(0.32)
    // scene.Torch.setOrigin(1, 0.75)
    // scene.Torch.setOrigin(0.6,0.2)

    scene.Torch.play('torch')   //flame animation
    // put a circular body around torch, centered correctly

    scene.Torch.body.setCircle(100,0,0)
    scene.Torch.body.debugShowBody = false;

    // var body =scene.Torch.body
    // var debug = scene.game.debug
    // debug.setPixel(body.center.x, body.center.y, 125,125,125)


    //console.log(scene.Torch.body)


    //scene.Torch.body.setOffset(10,160)
    // scene.Torch.body.setCircle(120,0,0)
    // scene.Torch.body.updateFromGameObject()
    scene.Torch.body.enable= false



    scene.torch_handle = scene.physics.add.sprite(scene.sc_widt+200,scene.sc_high+200,'torch-handle').setScale(0.18,0.15)
    scene.torch_handle.body.debugShowBody = false;
    scene.torch_handle.setVisible(false)
    scene.torch_handle.setOrigin(0.5,0.5)
    // scene.torch_handle.setOrigin(1.05,1.05) //0.3,-0.1






}

export const preloadInit = (scene,trialnum) =>{
    //scene.default function loads assets for further use in the game


    if (trialnum == 0) {
        //create a loading bar when assets are being loaded
        LoadingBar(scene)
    }


// Load assets now


    scene.load.image('background-grass', 'assets/desertWell1.png')



    scene.load.spritesheet('character', `assets/${scene.playerImage}`,{frameWidth: 345, frameHeight: 850})


    scene.load.spritesheet('explosion', 'assets/explosion_atlas.png', {frameWidth: 470, frameHeight: 470})
    scene.load.spritesheet('sadEmoji', 'assets/sadEmoji_spritesheet.png', {frameWidth: 480, frameHeight: 480})

    scene.load.spritesheet('CheetaRun', 'assets/Cheetah_Spritesheet.png', {frameWidth: 610, frameHeight: 330})
    scene.load.spritesheet('PantherRun', 'assets/Panther_Spritesheet.png', {frameWidth: 600, frameHeight: 330})
    scene.load.spritesheet('SnowRun', 'assets/Snow_Spritesheet.png', {frameWidth: 610, frameHeight: 330})

    //torch and handle
    scene.load.spritesheet('torch', 'assets/torch_spritesheet2.png', {frameWidth: 220, frameHeight: 355})
    // scene.load.image('torch-handle','assets/torch_handle.png')
    scene.load.image('torch-handle','assets/Campwood_NoBG.png')

    scene.load.spritesheet('torch_smoke', 'assets/smoke_bgremoved2.png', {frameWidth: 240, frameHeight: 240})



    scene.load.audio("Alarm", 'assets/Alarm_SoundEdited.mp3');
    scene.load.audio("Scream", 'assets/morris_scream.mp3')


    scene.cursors = scene.input.keyboard.createCursorKeys()
    scene.mouse = scene.input.mouse

}


export const LoadingBar = (scene) => {

    let progressBar = scene.add.graphics();
    let progressBox = scene.add.graphics();
    // let width = scene.scale.width;
    // let height = scene.scale.height;
    let width = scene.scale.width/2;
    let height = scene.scale.height;

    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width/2, height/2, 320, 50);



    let loadingText = scene.make.text({
        x: (width /2)+170,
        y: height / 2 - 20 ,
        text: 'Loading...',
        style: {
            font: '20px monospace',
            fill: '#2eff43'
        }
    });
    loadingText.setOrigin(0.5, 0.5);

    let percentText = scene.make.text({
        x: (width /2)+170,
        y: (height / 2)+25,
        text: '0%',
        style: {
            font: '18px monospace',
            fill: '#7fc8ff'
        }
    });
    percentText.setOrigin(0.5, 0.5);


    scene.load.on('progress', function (value) {
        percentText.setText(parseInt(value * 100) + '%');
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect((width/2)+10, (height/2)+10, 300 * value, 30);
    });


    scene.load.on('complete', function () {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();
    });
}

