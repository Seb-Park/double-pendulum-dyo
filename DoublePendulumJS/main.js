var canvas;
var pathPoints = [[0, 2], [1, 2]];
var gravityAcc = -0.005;
var topPendulum = new Bob(window.innerWidth/2, 0, 200, 20, false, gravityAcc);
var bottomPendulum = new Bob(700, 350, 200, 60, false, gravityAcc);

function setUpGraphics() {
    canvas = document.getElementById('main-canvas');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    topPendulum.setBobColor("rgb(255,200,200)")
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
    while (true) {
        moveThings();
        render();
        await sleep(20);
    }
}

function render() {
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        topPendulum.draw(ctx);
    }
}

function moveThings() {
    topPendulum.move();
}

setUpGraphics();
run();