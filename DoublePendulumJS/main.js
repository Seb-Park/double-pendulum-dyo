var canvas;
var graphCanvas;
var gravityAcc = .5;
var graphVals = [];
var maxGraphVal = 0, minGraphVal = 0;
var topPendulum = new Bob(window.innerWidth / 4, window.innerHeight / 2, 170.0, 70, false, gravityAcc);//170, 90 and 70 and -50 have been good so far
var bottomPendulum = new Bob(31.25667198004745, -177.26539554219744, 170.0, 90, false, gravityAcc);
var showTwoCheckbox = document.getElementById("show-two");
var isShowingTwo = showTwoCheckbox.checked;
var showTrailCheckbox = document.getElementById("show-trail");
var isShowingTrail = showTrailCheckbox.checked;
var showDecayCheckbox = document.getElementById("show-decay");
var bobColor1Picker = document.getElementById("bob-color-1");
var bobColor2Picker = document.getElementById("bob-color-2");
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
var graphTypeSelector = document.getElementById("graph-type");
var graphType = graphTypeSelector.value;

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
        bobColor1Picker.disabled = !this.checked;
        bobColor2Picker.disabled = !this.checked;
    }
    showTrailCheckbox.oninput = function () {
        isShowingTrail = this.checked;
        showDecayCheckbox.disabled = !this.checked;
        showFadeCheckbox.disabled = !this.checked;
    }
    bobColor1Picker.oninput = function () {
        topPendulum.setBobColor(this.value);
    }
    bobColor2Picker.oninput = function () {
        bottomPendulum.setBobColor(this.value + "80");
    }
    graphTypeSelector.oninput = function () {
        graphVals = [];
        maxGraphVal = 0;
        graphType = this.value;
    }
}

function setUpGraphics() {
    canvas = document.getElementById('main-canvas');
    canvas.height = window.innerHeight;
    // if (window.innerWidth > 1200) {
        canvas.width = window.innerWidth / 2;
    // }
    // else {
        canvas.width = window.innerWidth / 1.2;
        console.log("not big enough")
    // }
    graphCanvas = document.getElementById('graph-canvas');
    graphCanvas.width = window.innerWidth / 4;
    graphCanvas.height = "200";//"100px";
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
            updateGraph();
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

function updateGraph() {
    var valueToPush;
    switch (graphType) {
        case "p1theta":
            valueToPush = Bob.degrees_360_to_180(Bob.radians_to_degrees(topPendulum.angle));
            break;
        case "p2theta":
            valueToPush = Bob.degrees_360_to_180(Bob.radians_to_degrees(Math.asin(Math.sin(bottomPendulum.angle))));
            break
        default:
            valueToPush = Bob.degrees_360_to_180(Bob.radians_to_degrees(Math.asin(Math.sin(getAuxiliaryAngle()))));
            console.log(valueToPush);
            break;
    }
    if (Math.abs(valueToPush) > maxGraphVal) {
        maxGraphVal = Math.abs(valueToPush);
        console.log(maxGraphVal);
    }
    // if (valueToPush < minGraphVal){
    //     minGraphVal = valueToPush;
    // }
    graphVals.push(valueToPush);
    renderGraph();
}

function getAuxiliaryAngle() {
    return Math.atan((bottomPendulum.x - topPendulum.fulcrumx) / (bottomPendulum.y - topPendulum.fulcrumy))
}

function renderGraph() {
    if (graphCanvas.getContext) {
        let midpoint = maxGraphVal;//(maxGraphVal - minGraphVal)/2;
        var ctx = graphCanvas.getContext('2d');
        ctx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
        ctx.beginPath();
        ctx.strokeStyle = "rgb(50,255,0)";
        if (graphVals.length < graphCanvas.width) {
            ctx.moveTo(0, (-graphVals[0] / maxGraphVal) * graphCanvas.height / 2 + (graphCanvas.height / 2));
            for (let i = 0; i < graphVals.length; i++) {
                let valToGraph = (-graphVals[i] / maxGraphVal) * graphCanvas.height / 2 + (graphCanvas.height / 2);
                ctx.lineTo(i, valToGraph);
            }
        }
        else {
            ctx.moveTo(0, (-graphVals[graphVals.length - graphCanvas.width] / maxGraphVal) * graphCanvas.height / 2 + (graphCanvas.height / 2));
            for (let i = graphCanvas.width - 1; i >= 0; i--) {
                let valToGraph = (-graphVals[graphVals.length - i] / maxGraphVal) * graphCanvas.height / 2 + (graphCanvas.height / 2);
                ctx.lineTo(graphCanvas.width - i, valToGraph);
            }
        }
        ctx.stroke();
    }
}

setUpInputs();
setUpGraphics();
run();