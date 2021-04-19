var canvas;
var gravityAcc = .5;
var topPendulum = new Bob(window.innerWidth / 2, window.innerHeight / 2, 180.0, 170, false, gravityAcc);//70 and -50 have been good so far
var bottomPendulum = new Bob(31.25667198004745, -177.26539554219744, 180.0, 90, false, gravityAcc);
var showTwoCheckbox = document.getElementById("show-two");
var isShowingTwo = showTwoCheckbox.checked;
var showTrailCheckbox = document.getElementById("show-trail");
var isShowingTrail = showTrailCheckbox.checked;
var showDecayCheckbox = document.getElementById("show-decay");
var showFadeCheckbox = document.getElementById("show-fade");
var showAuxiliaryCheckbox = document.getElementById("show-auxiliary");
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
        if (topMassSlider.disabled) {
            topMassSlider.disabled = false;
        }
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
        bottomPendulum.setFulcrum(topPendulum.x, topPendulum.y, true);
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
    showTwoCheckbox.oninput = function () {
        isShowingTwo = showTwoCheckbox.checked;
    }
    showTrailCheckbox.oninput = function () {
        isShowingTrail = this.checked;
        showDecayCheckbox.disabled = !this.checked;
        showFadeCheckbox.disabled = !this.checked;
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
        if (isShowingTrail) {
            if (isShowingTwo) {
                topPendulum.renderPath(ctx, false, false);
            }
            bottomPendulum.renderPath(ctx, showDecayCheckbox.checked, showFadeCheckbox.checked);
        }
        if (showAuxiliaryCheckbox.checked) {
            ctx.beginPath();
            ctx.strokeStyle = "rgba(0,255,255,.5)"
            ctx.setLineDash([10, 15])
            ctx.moveTo(topPendulum.fulcrumx, topPendulum.fulcrumy);
            ctx.lineTo(bottomPendulum.x, bottomPendulum.y);
            ctx.stroke();

            ctx.setLineDash([]);

            if (!isShowingTwo) {
                var circle = new Path2D();
                ctx.fillStyle = bottomPendulum.bobColor;
                circle.arc(bottomPendulum.x, bottomPendulum.y, bottomPendulum.mass, 0, 2 * Math.PI);
                ctx.fill(circle);
            }
        }
        if (isShowingTwo) {
            bottomPendulum.draw(ctx);
            topPendulum.draw(ctx);
        }
    }
}

function moveThings() {
    topPendulum.calculateAcceleration();
    bottomPendulum.calculateAcceleration();
    topPendulum.move();
    bottomPendulum.move();
}

setUpInputs();
setUpGraphics();
run();