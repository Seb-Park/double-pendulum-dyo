var canvas;
var gravityAcc = .5;
var topPendulum = new Bob(window.innerWidth/2, window.innerHeight/2, 180.0, 70, false, gravityAcc);
var bottomPendulum = new Bob(700, 350, 180.0, 50.0, false, gravityAcc);

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
        topPendulum.renderPath(ctx);
        bottomPendulum.renderPath(ctx);
        bottomPendulum.draw(ctx);
        topPendulum.draw(ctx);
    }
}

function moveThings() {
    topPendulum.move();
    bottomPendulum.move();
}

setUpGraphics();
run();