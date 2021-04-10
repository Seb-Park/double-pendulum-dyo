public class Bob {
    public double angle, maxAngle, x, y;
    public double originx, originy, fulcrumx, fulcrumy, stringLength;
    public double gravity, xgravity, ygravity;
    public double angularVel;
    public boolean anchored;
    public Bob anchor;

    public Bob(double px, double py, double pfulcrumx, double pfulcrumy, double pgravity) {
        x = px;
        y = py;
        fulcrumx = pfulcrumx;
        fulcrumy = pfulcrumy;
        stringLength = calculateStringLength(x, y, fulcrumx, fulcrumy);
        originx = fulcrumx;
        originy = fulcrumy + stringLength;
        angle = ((Math.asin(((x - fulcrumx) / stringLength))));
        maxAngle = angle;
        angularVel = 0;
        gravity = pgravity;
    }

    public void setAnchor(Bob panchor){
        anchor = panchor;
        anchored = true;
    }

    public double calculateStringLength(double x1, double y1, double x2, double y2) {
        return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
    }

    public void setPositionFromAngle() {
        x = Math.sin(angle) * stringLength + fulcrumx;
        y = Math.cos(angle) * stringLength + fulcrumy;
    }

    public void move() {
        if(anchored){
            fulcrumx=anchor.x;
            fulcrumy=anchor.y;
        }
        System.out.println(angle);
        xgravity = Math.sin(angle) * gravity;
        angularVel += xgravity;
        angle += angularVel;


        setPositionFromAngle();
    }
}
