import java.util.ArrayList;

public class Bob {
    public double angle, maxAngle, x, y;//angle is in radians
    public double originx, originy, fulcrumx, fulcrumy, stringLength;
    public double gravity, xgravity, ygravity;
    public double angularVel, angularAcc;
    public boolean anchored;
    public Bob anchor;
    public boolean isParent;
    public Bob child;
    public int[] pathX, pathY;
    public int counter = 0;
    public int pathSize = 0;
    public int maxPoints = 5000;

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
        pathX = new int[maxPoints];
        pathY = new int[maxPoints];
    }

    public Bob(double pfulcrumx, double pfulcrumy, double plength, double pangle, boolean isRadians, double pgravity) {
        fulcrumx = pfulcrumx;
        fulcrumy = pfulcrumy;
        stringLength = plength;
        if (isRadians) {
            angle = pangle;
        } else {
            angle = Math.toRadians(pangle);
        }
        maxAngle = angle;
        x = Math.sin(angle) * stringLength;
        y = Math.cos(angle) * stringLength;
        angularVel = 0;
        gravity = pgravity;
        pathX = new int[maxPoints];
        pathY = new int[maxPoints];
    }

    public void setAnchor(Bob panchor) {
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
        if (anchored) {
            fulcrumx = anchor.x;
            fulcrumy = anchor.y;
        }
        xgravity = Math.sin(angle) * gravity;
        angularAcc = xgravity;
        angularVel += angularAcc;
        angle += angularVel;

        setPositionFromAngle();

        pathX[counter] = (int) (x);
        pathY[counter] = (int) (y);
        if(pathSize<maxPoints) {
            pathSize++;
        }
        if(counter<maxPoints-1){
            counter++;
        }
        else{
            counter = 0;
        }
    }
}
