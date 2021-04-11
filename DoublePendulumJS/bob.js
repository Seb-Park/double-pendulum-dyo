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
        this.angularAcc = 0;
        this.gravity = pgravity;
        this.path = [];
        this.anchored = false;
        this.parent = null;
        this.isParent = false;
        this.child = null;
        this.lineColor = "rgb(0,0,0)";
        this.bobColor = "rgba(0,0,0,0.5)";
        this.mass = 20;
    }
    setBobColor(color) {
        this.bobColor = color;
    }
    setLineColor(color) {
        this.lineColor = color;
    }
    setMass(mass) {
        this.mass = mass;//This does not conserve momentum.
    }
    setMassConserveMomentum(mass) {
        this.angularVel *= (this.mass / mass);
        this.mass = mass;
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.fulcrumx, this.fulcrumy);
        ctx.lineWidth = 4;
        ctx.strokeStyle = this.lineColor;
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        var circle = new Path2D();
        ctx.fillStyle = this.bobColor;
        circle.arc(this.x, this.y, this.mass, 0, 2 * Math.PI);
        ctx.fill(circle);
    }
    renderPath(ctx, showDecay, showFade) {
        ctx.beginPath();
        ctx.strokeStyle = this.bobColor;
        if (!showDecay) {
            ctx.moveTo(this.path[0][0], this.path[0][1]);
            for (var i = 1; i < this.path.length; i++) {
                ctx.lineTo(this.path[i][0], this.path[i][1]);
            }
            ctx.stroke();
        }
        else {
            for (var i = 1; i < this.path.length; i++) {
                ctx.beginPath();
                ctx.moveTo(this.path[i - 1][0], this.path[i - 1][1]);
                if (showFade) {
                    ctx.strokeStyle = `rgba(${i * (255 / this.path.length)},0,${255 - (i * (255 / this.path.length))},${i / this.path.length})`;
                }
                else {
                    ctx.strokeStyle = `rgb(${i * (255 / this.path.length)},0,${255 - (i * (255 / this.path.length))})`;
                }
                ctx.lineTo(this.path[i][0], this.path[i][1]);
                ctx.stroke();
            }
        }
    }
    setAnchor(panchor) {
        this.parent = panchor;
        this.anchored = true;
        this.path = [];
        panchor.isParent = true;
        panchor.child = this;
    }

    calculateStringLength(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
    }

    setPositionFromAngle() {
        this.x = Math.sin(this.angle) * this.stringLength + this.fulcrumx;
        this.y = Math.cos(this.angle) * this.stringLength + this.fulcrumy;
    }

    calculateAccelerationIndependent() {
        if (this.anchored) {
            this.fulcrumx = this.parent.x;
            this.fulcrumy = this.parent.y;
        }
        this.xgravity = Math.sin(this.angle) * -this.gravity;
        this.angularAcc = this.xgravity;
    }

    calculateAcceleration() {
        if (this.isParent) {
            let c = this.child;
            this.angularAcc = (-this.gravity * (2 * this.mass + c.mass) * Math.sin(this.angle) - c.mass * this.gravity * Math.sin(this.angle - 2 * c.angle) - 2 * Math.sin(this.angle - c.angle) * c.mass * (Math.pow(c.angularVel, 2) * c.stringLength + Math.pow(this.angularVel, 2) * this.stringLength * Math.cos(this.angle - c.angle))) /
                (this.stringLength * (2 * this.mass + c.mass - c.mass * Math.cos(2 * this.angle - 2 * c.angle)));
        }
        else if (this.anchored) {
            let p = this.parent;
            this.angularAcc = (2 * Math.sin(p.angle - this.angle) * (Math.pow(p.angularVel, 2) * p.stringLength * (p.mass + this.mass) + this.gravity * (p.mass + this.mass) * Math.cos(p.angle) + Math.pow(this.angularVel, 2) * this.stringLength * this.mass * Math.cos(p.angle - this.angle))) /
                (this.stringLength * (2 * p.mass + this.mass - this.mass * Math.cos(2 * p.angle - 2 * this.angle)));
        }
        else {
            this.calculateAccelerationIndependent();
        }
    }

    move() {
        this.calculateAcceleration();
        this.angularVel += this.angularAcc;
        this.angle += this.angularVel;

        this.setPositionFromAngle();

        if (this.anchored) {
            this.fulcrumx = this.parent.x;
            this.fulcrumy = this.parent.y;
        }

        this.path.push([Math.floor(this.x), Math.floor(this.y)]);
        if (this.pathSize < this.maxPoints) {
            this.pathSize++;
        }
    }
    clearPath() {
        this.path = [];
    }
    resetMotion() {
        this.angularAcc = 0;
        this.angularVel = 0;
    }
    degrees_to_radians(degrees) {
        var pi = Math.PI;
        return degrees * (pi / 180);
    }
}