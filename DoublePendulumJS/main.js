var canvas;
var gravityAcc = .5;
var topPendulum = new Bob(window.innerWidth / 2, window.innerHeight / 2, 180.0, 170, false, gravityAcc);//70 and -50 have been good so far
var bottomPendulum = new Bob(700, 350, 180.0, 90, false, gravityAcc);
var showDecayCheckbox = document.getElementById("show-decay");
var showFadeCheckbox = document.getElementById("show-fade");
var speedSlider = document.getElementById("speed-slider");
var pauseTime = speedSlider.value;
var topMassSlider = document.getElementById("top-mass");
var bottomMassSlider = document.getElementById("bottom-mass");
var playPauseButton = document.getElementById("play-pause");
var isPlaying = playPauseButton.checked;
var clearPathButton = document.getElementById("clear-path");
var resetMotionButton = document.getElementById("reset-motion");
var topAngleSlider = document.getElementById("top-angle");
var bottomAngleSlider = document.getElementById("bottom-angle");

function setUpInputs() {
    speedSlider.oninput = function () {
        pauseTime = 40 - this.value;
    }
    topMassSlider.oninput = function () {
        topPendulum.setMassConserveMomentum(this.value);
    }
    bottomMassSlider.oninput = function () {
        bottomPendulum.setMassConserveMomentum(this.value);
    }
    playPauseButton.oninput = function () {
        isPlaying = this.checked;
    }
    clearPathButton.onclick = function () {
        topPendulum.clearPath();
        bottomPendulum.clearPath();
    }
    resetMotionButton.onclick = function () {
        topPendulum.resetMotion();
        bottomPendulum.resetMotion();
    }
    topAngleSlider.oninput = function () {
        playPauseButton.checked = false;
        isPlaying = false;
        topPendulum.resetMotion();
        topPendulum.setAngle(this.value);
        bottomPendulum.setFulcrum(topPendulum.x,topPendulum.y,true);
    }
    topAngleSlider.onmouseup = function () {
        playPauseButton.checked = true;
        isPlaying = true;
    }
    bottomAngleSlider.oninput = function () {
        playPauseButton.checked = false;
        isPlaying = false;
        bottomPendulum.resetMotion();
        bottomPendulum.setAngle(this.value);
    }
    bottomAngleSlider.onmouseup = function () {
        playPauseButton.checked = true;
        isPlaying = true;
    }
}

function setUpGraphics() {
    canvas = document.getElementById('main-canvas');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    topPendulum.setBobColor("rgb(255,200,200)");
    bottomPendulum.setAnchor(topPendulum);
    // bottomPendulum.setMass(80);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
    while (true) {
        if (isPlaying) {
            moveThings();
        }
        render();
        await sleep(pauseTime);
    }
}

function render() {
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        topPendulum.renderPath(ctx, false, false);
        bottomPendulum.renderPath(ctx, showDecayCheckbox.checked, showFadeCheckbox.checked);
        bottomPendulum.draw(ctx);
        topPendulum.draw(ctx);
    }
}

function moveThings() {
    topPendulum.move();
    bottomPendulum.move();
}

setUpInputs();
setUpGraphics();
run();