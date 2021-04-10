class Bob {
    constructor(pfulcrumx, pfulcrumy, plength, pangle, isRadians, pgravity) {
        this.fulcrumx = pfulcrumx;
        this.fulcrumy = pfulcrumy;
        this.stringLength = plength;
        if (isRadians) {
            this.angle = pangle;
        } else {
            this.angle = this.degrees_to_radians(pangle);
        }
        this.maxAngle = this.angle;
        this.x = Math.sin(this.angle) * this.stringLength;
        this.y = Math.cos(this.angle) * this.stringLength;
        this.angularVel = 0;
        this.gravity = pgravity;
        this.path = [];
        this.anchored = false;
        this.anchor = null;
        this.lineColor = "rgb(0,0,0)";
        this.bobColor = "rgb(0,0,0)";
    }
    setBobColor(color){
        this.bobColor = color;
    }
    setLineColor(color){
        this.lineColor = color;
    }
    draw(ctx){
        ctx.beginPath();
        ctx.moveTo(this.fulcrumx,this.fulcrumy);
        ctx.lineWidth = 4;
        ctx.strokeStyle = this.lineColor;
        ctx.lineTo(this.x,this.y);
        ctx.stroke();
        var circle = new Path2D();
        ctx.fillStyle = this.bobColor;
        circle.arc(this.x, this.y, 20, 0, 2 * Math.PI);
        ctx.fill(circle);
    }
    setAnchor(panchor) {
        this.anchor = panchor;
        this.anchored = true;
    }

    calculateStringLength(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
    }

    setPositionFromAngle() {
        this.x = Math.sin(this.angle) * this.stringLength + this.fulcrumx;
        this.y = Math.cos(this.angle) * this.stringLength + this.fulcrumy;
    }

    move() {
        if (this.anchored) {
            this.fulcrumx = this.anchor.x;
            this.fulcrumy = this.anchor.y;
        }
        this.xgravity = Math.sin(this.angle) * this.gravity;
        this.angularAcc = this.xgravity;
        this.angularVel += this.angularAcc;
        this.angle += this.angularVel;

        this.setPositionFromAngle();

        this.path.push([Math.floor(this.x),Math.floor(this.y)]);
        if (this.pathSize < this.maxPoints) {
            this.pathSize++;
        }
    }

    degrees_to_radians(degrees) {
        var pi = Math.PI;
        return degrees * (pi / 180);
    }
}