var canvas;
var pathPoints = [[0, 2], [1, 2]];
var gravityAcc = -0.005;
var topPendulum = new Bob(window.innerWidth/2, 0, 200, 60, false, gravityAcc);
var bottomPendulum = new Bob(700, 350, 200, 57, false, gravityAcc);

function setUpGraphics() {
    canvas = document.getElementById('main-canvas');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    topPendulum.setBobColor("rgb(255,200,200)");
    bottomPendulum.setAnchor(topPendulum);
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
        ctx.beginPath();
        ctx.moveTo(bottomPendulum.path[0][0],bottomPendulum.path[0][1]);
        for (var i = 1; i < bottomPendulum.path.length; i++) {
             ctx.lineTo(bottomPendulum.path[i][0],bottomPendulum.path[i][1]);
        }
        ctx.stroke();
        topPendulum.draw(ctx);
        bottomPendulum.draw(ctx);
    }
}

function moveThings() {
    topPendulum.move();
    bottomPendulum.move();
}

setUpGraphics();
run();