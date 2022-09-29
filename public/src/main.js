import Phaser from './lib/phaser.js'
import GameScene from './scenes/GameScene.js'
import GameOver from "./scenes/GameOver.js";
import ChooseAvatar from "./scenes/ChooseAvatar.js";
import MenuScene from "./scenes/MenuScene.js";
import TrainingGameDesign from "./scenes/Training/TrainingTaskDesign.js";
import TrainingPredatorMean from "./scenes/Training/TrainingPredatorMean.js";
import TrainingPredatorVariance from "./scenes/Training/TrainingPredatorVariance.js"
import TrainingDifferentPredators from "./scenes/Training/TrainingDifferentPredators.js"
import TrainingLast from "./scenes/Training/TrainingLast.js";
import StartingInstructions from "./scenes/Instructions/StartingInstructions.js";
import FirstPracticeInstructions from "./scenes/Instructions/FirstPredatorPracticeInstructions.js";
import SecondPracticeInstructions from "./scenes/Instructions/SecondPracticeInstructions.js";
import ThirdPracticeInstructions from "./scenes/Instructions/ThirdPracticeInstructions.js";
import FinalPracticeInstructions from "./scenes/Instructions/FinalPracticeInstructions.js";
import PromptToStartGame from "./scenes/Instructions/PromptToStartGame.js";
import PrematureEnding from "./scenes/PrematureEnding.js";
import CheckHeadphone from "./scenes/CheckHeadphone.js";
import FailedSoundCheckEnding from "./scenes/FailedSoundCheckEnding.js";






let config = {
    type: Phaser.AUTO,
    audio:{
        disableWebAudio:true
    },

    width: 640,
    height: 640,


    scale: {
        // Or set parent divId here
        parent: ChooseAvatar,

        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,

        // Or put game size here
        // width: 1024,
        // height: 768,

        // Minimum size
        min: {
            width: 320,
            height: 320
        },
        // Or set minimum size like these
        // minWidth: 800,
        // minHeight: 600,

        // Maximum size
        max: {
            width: 640*2.5,
            height: 640*2.5,
        },
        // Or set maximum size like these
        // maxWidth: 1600,
        // maxHeight: 1200,

        zoom: 1,  // Size of game canvas = game size * zoom
    },
    autoRound: false,

    // CheckHeadphone,
    scene:[ChooseAvatar,MenuScene,
        StartingInstructions,FirstPracticeInstructions,SecondPracticeInstructions,ThirdPracticeInstructions,FinalPracticeInstructions,TrainingGameDesign,
        TrainingPredatorMean,TrainingPredatorVariance,TrainingDifferentPredators,TrainingLast,PromptToStartGame,
        GameScene,GameOver,PrematureEnding, FailedSoundCheckEnding],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: true
        }
    }
};

function getQueryVariable(variable)     //get prolific id from the url shown in users browser
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

// Firebase stuff

//Useful link: https://tobywise.com/blog/firebase-for-online-testing
// saves data for loading later if internet connection unavailable etc.
//data not lost
firebase.firestore().enablePersistence()
    .catch(function(err) {
        if (err.code == 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled
            // in one tab at a time.
            // ...
        } else if (err.code == 'unimplemented') {
            // The current browser does not support all of the
            // features required to enable persistence
            // ...
        }
    });

//Give each user an anonymous ID
firebase.auth().signInAnonymously().catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
});




// check if consent boxes are checked, and if they are run the game

var check_consent = function (elem) {
    if ($('#consent_checkbox1').is(':checked') && $('#consent_checkbox2').is(':checked') &&
        $('#consent_checkbox3').is(':checked') && $('#consent_checkbox4').is(':checked') &&
        $('#consent_checkbox5').is(':checked'))  {

    // if (1 === 1) {

        //clear the consent page and start a new game

        document.getElementById('consent').innerHTML = "";
        document.getElementById('header_title').innerHTML = "";
        window.scrollTo(0,0);

        let game = new Phaser.Game(config);


        // initialize game variables
        game.trial = 0;
        game.blockNum = 1
        //game.player_trial = 0;

        //get prolific subjectID from the URL

        if (window.location.search.indexOf('PROLIFIC_PID') > -1) {
            game.subjectID = getQueryVariable('PROLIFIC_PID');
        } else {
            game.subjectID = Math.floor(Math.random() * (2000000 - 0 + 1)) + 0; // if no prolific ID, generate random ID (for testing)
//                var subject_id = '0000' // for testing
        }

        game.data = {};
        game.n_trials = 0;
        game.highscore = 0;

        // variables that will be used to store data in firebase firestore
        game.dataKeys = ['Totalscore', 'trialNumber', 'PredatorType', 'PredatorName', 'Predator_x', 'Predator_y',
            'PredatorAngle', 'PredatorMean', 'PredatorStd', 'PredatorSpeed','torchMoved' ,'torchON', 'torch_x', 'torch_y',
            'torchAngle', 'torchSize', 'RTInitiation', 'RTConfirmation','RTTorchON', 'PredictionError', 'HitMiss', 'ChangePoint',
            'PredatorAttackTime','LivesLeft','HeadPhoneCheckPassFail', 'HeadPhoneCheckScore', 'HeadPhonePassThreshold'];


        var db = firebase.firestore();

        game.dataKeys.forEach(k => {
            game.data[k] = [];
        });

        //create a new document for each subject
        // console.log('uid check is',uid)

        firebase.auth().onAuthStateChanged(function (user) {

            if (user) {
                var isAnonymous = user.isAnonymous;
                var uid = user.uid;

                var today = new Date();
                var ms = today.getTime();  //number of milliseconds since 1970 to today

                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                var time = today.getHours() + "." + today.getMinutes() + "." + today.getSeconds();


               //console.log('UID is', uid)

                // create data storage directory in firestore and store initial data

                var Block = 'Block ' + game.blockNum.toString()
                //this.cache.uid.push(uid)
                db.collection("Tasks").doc('CodeTest').collection('Subjects').doc(uid).collection('Game ' + date + ' ' + time).doc(Block + ' ' + time).set(game.data);

                db.collection("Tasks").doc('CodeTest').collection('Subjects').doc(uid).collection('Game ' + date + ' ' + time).doc(Block + ' ' + time).update({
                    subjectID: game.subjectID,
                    date: new Date().toLocaleDateString(),
                    time: new Date().toLocaleTimeString()

                })

                // Initial game data stored for later use throughout game
                game.uid = uid;
                game.ms = ms;
                game.date = date;
                game.time = time;
                game.StartTime = time
                game.StartDate = date
            }
        });

        game.db = db;

        return true


    } else {
        alert("Unfortunately you will not be unable to participate in this research study if you do " +
            "not consent to the above. Thank you for your time.");
        return false;
    }
};

// Consent form

    document.getElementById('header_title').innerHTML = "Predator game";
    document.getElementById('consent').innerHTML = "        <p><b>Who is conducting this research study?</b><p>\n" +
        "        <p>\n" +
        "        This research is being conducted by Freie Universität Berlin and Max Planck School of Cognition.\n" +
        "        \n" + "<br>" +
        "        The lead researcher(s) for this project are\n" +
        "        <a href=\"mailto:m.hashim.satti@maxplanckschools.de\">Muhammad Hashim Satti</a> and <a href=\"mailto:rasmusb@zedat.fu-berlin.de\">Dr. Rasmus Bruckner</a>.\n" +
        "        </p>\n" +
        "\n" +
        "        <p><b>What is the purpose of this study?</b><p>\n" +
        "        <p>\n" +
        "        We are interested in studying the processes and principles that help us make decisions under uncertain conditions. \n" +
        "\n"  + "<br>" +
        "        This research aims to provide\n" +
        "        insights into how the healthy brain works, and this can then help us to understand the causes of a number of different medical\n" +
        "        conditions.\n" +
        "        </p>\n" +
        "\n" +
        "        <p><b>Who can participate in the study?</b><p>\n" +
        "        <p>\n" +
        "            You must be 18 or over to participate in this study. Please confirm this to proceed.\n" +
        "        </p>\n" +
        "         <label class=\"container\">I confirm I am over 18 years old\n" +
        "                <input type=\"checkbox\" id=\"consent_checkbox1\">\n" +
        "                <span class=\"checkmark\"></span>\n" +
        "            </label>\n" +
        "        <br>\n" +
        "\n" +
        "        <p><b>What will happen to me if I take part?</b><p>\n" +
        "        <p>\n" +
        "            You will play an online computer game with a total of 6 blocks. The total duration of the game will be approximately 50 - 60 minutes. \n" +

        "        <p>    You will receive" +

        "            at least €8 per hour for helping us through this research.  You will also be \n " +
        "        given added bonus of 50 cents for each block in which you score greater than 1200 points. This bonus would be reimbursed after  \n"  +
        "        we have reviewed your data and might take a few days.\n"  +


        "       <br> \n    We would analyze the data obtained through this task to understand how uncertainty affects behaviour in complex scenarios.\n" +
        "       <p>     Remember, you are free to withdraw at any time without giving a reason by pressing Esc Button.\n\n" +
        "        </p>\n" +
        "\n" +
        "        <p><b>What are the possible disadvantages and risks of taking part?</b><p>\n" +
        "        <p>\n" +
        "            The task does not pose any risks and disadvantages to most people.\n" +
        "        </p>\n" +

        "\n" +
        "        <p><b>What are the possible benefits of taking part?</b><p>\n" +
        "        <p>\n" +
        "            While there are no immediate benefits to taking part, your participation in this research will help us\n" +
        "        understand how people make decisions under uncertainty and this could have benefits\n"+
"                for furthering our understanding of principles underlying learning and decision making.\n" +
        "        </p>\n" +

        "\n" +
        "        <p><b>What about my data?</b><p>\n" +
        "        <p>\n" +
        "            To help future research and make the best use of the research data you have given us \n" +
        "         we may keep your research data indefinitely and share these.  The data we collect will\n" +
        "        be shared and held as follows:\n" +
        "<br>\n"+
        "            •\tIn publications, your data will be anonymised, so you cannot be identified.\n" +
        "<br>\n"+
        "            •\tIn public databases, your data will be pseudonymised. \n" +
        "<br><br>\n" +
        "        If there are any queries or concerns please do not hesitate to contact:\n" +
        "        <a href=\"mailto:m.hashim.satti@maxplanckschools.de\">Muhammad Hashim Satti</a>\n" +
        "        </p>\n" +
        "\n" +
        "        <p><b>If you are happy to proceed please read the statement below and click the boxes to show that you\n" +
        "            consent to this study proceeding</b><p>\n" +
        "\n" +
        "        <label class=\"container\">I have read the information above, and understand what the study involves.\n" +
        "            <input type=\"checkbox\" id=\"consent_checkbox2\">\n" +
        "            <span class=\"checkmark\"></span>\n" +
        "        </label>\n" +
        "<br>\n" +
        "\n"+
        "        <label class=\"container\">I understand that my anonymised/pseudonymised personal data can be shared with others\n" +
        "            for future research, shared in public databases and in scientific reports.\n" +
        "            <input type=\"checkbox\" id=\"consent_checkbox3\">\n" +
        "            <span class=\"checkmark\"></span>\n" +
        "        </label>\n" +
        "<br>\n" +
        "        <label class=\"container\">I understand that I am free to withdraw from this study at any time without\n" +
        "            giving a reason and this will not affect my future medical care or legal rights.\n" +
        "            <input type=\"checkbox\" id=\"consent_checkbox4\">\n" +
        "            <span class=\"checkmark\"></span>\n" +


        "<br>\n" +
        "        <label class=\"container\">I agree that the research project named above has been explained to me to my\n" +
        "            satisfaction and I agree to take part in this study\n" +
        "            <input type=\"checkbox\" id=\"consent_checkbox5\">\n" +
        "            <span class=\"checkmark\"></span>\n" +
        "        </label>\n" +
        "\n" +
        "        <br><br><br>\n" +
        "        <button type=\"button\" style='background-color:black;color: white;margin: auto;display: block ' id=\"start\" class=\"submit_button\">Start Experiment</button>\n" +
        "        <br><br>";


    document.getElementById("start").onclick = check_consent;

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        alert("Sorry, this experiment does not work on mobile devices");
        document.getElementById('consent').innerHTML = "";
    }
