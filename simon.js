
let gamePattern = [];
let userClickedPattern = [];
let started = false;
let level = 0;
let highScore = localStorage.getItem("simonHighScore") || 0;
let gameSpeed = 500; 


const levelTitle = $("#level-title");
const scoreDisplay = $("#current-score");
const highScoreDisplay = $("#high-score");


highScoreDisplay.text(highScore);


$(document).keypress(function(event) {
    if (!started) {
        startGame();
    }
});

$(".btn").click(function() {
    if (!started) return;
    const userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);
    
    playSound(userChosenColour);
    animatePress(userChosenColour);
    
    checkAnswer(userClickedPattern.length - 1);
});

$(".difficulty-btn").click(function() {
    if (started) return; 
    gameSpeed = $(this).data("speed");
    $(".difficulty-btn").removeClass("active");
    $(this).addClass("active");
});


function startGame() {
    started = true;
    levelTitle.text("Level " + level);
    nextSequence();
}

function nextSequence() {
    userClickedPattern = [];
    level++;
    levelTitle.text("Level " + level);
    scoreDisplay.text(level - 1);

    const randomNumber = Math.floor(Math.random() * 4);
    const buttonColours = ["red", "blue", "green", "yellow"];
    const randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);

    playSequence();
}

function playSequence() {
    let i = 0;
    const interval = setInterval(function() {
        const color = gamePattern[i];
        playSound(color);
        animatePress(color);
        i++;
        if (i >= gamePattern.length) {
            clearInterval(interval);
        }
    }, gameSpeed);
}

function checkAnswer(currentLevel) {
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
        if (userClickedPattern.length === gamePattern.length) {
            setTimeout(nextSequence, 1000);
        }
    } else {
        gameOver();
    }
}

function gameOver() {
    playSound("wrong");
    $("body").addClass("game-over");
    setTimeout(() => $("body").removeClass("game-over"), 200);

    const finalScore = level - 1;
    if (finalScore > highScore) {
        highScore = finalScore;
        localStorage.setItem("simonHighScore", highScore);
        highScoreDisplay.text(highScore);
    }
    
    levelTitle.html("Game Over!<br>Press Any Key to Restart");
    startOver();
}

function startOver() {
    level = 0;
    gamePattern = [];
    started = false;
    scoreDisplay.text(0);
}


function animatePress(currentColour) {
    $("#" + currentColour).addClass("pressed");
    setTimeout(() => $("#" + currentColour).removeClass("pressed"), 100);
}

function playSound(name) {
    
    try {
        const audio = new Audio("sounds/" + name + ".mp3");
        audio.play();
    } catch (error) {
        console.log("Could not play sound: " + name + ".mp3.");
    }
}