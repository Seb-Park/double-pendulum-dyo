import java.awt.Graphics2D;
import java.awt.event.ComponentAdapter;
import java.awt.event.ComponentEvent;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.image.BufferStrategy;
import java.awt.*;
import javax.swing.JFrame;
import javax.swing.JPanel;


public class Main implements Runnable, KeyListener {
    final int WIDTH = 1000;
    final int HEIGHT = 700;

    public JFrame frame;
    public Canvas canvas;
    public JPanel panel;

    public BufferStrategy bufferStrategy;

    public Bob topBob;
    public Bob bottomBob;

    public double gravityAcc = 0.3;

    public static void main(String[] args) {
        Main ex = new Main();
        new Thread(ex).start();
    }

    public Main() {

        setUpGraphics();
        topBob = new Bob(700,350,500,0, gravityAcc);
        bottomBob = new Bob(700,500,topBob.originx,topBob.originy, gravityAcc);
    }

    public void run() {
        while (true) {
            moveThings();
            render();
            pause(20);
        }
    }


    public void moveThings()
    {
        topBob.move();
    }

    public void pause(int time ){
        try {
            Thread.sleep(time);
        } catch (InterruptedException e) {

        }
    }

    private void setUpGraphics() {
        frame = new JFrame("Double Pendulum");
        panel = (JPanel) frame.getContentPane();
        panel.setPreferredSize(new Dimension(WIDTH, HEIGHT));
        panel.setLayout(null);

        canvas = new Canvas();
        canvas.setBounds(0, 0, WIDTH, HEIGHT);
        canvas.setIgnoreRepaint(true);

        panel.add(canvas);

        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.pack();
        frame.setResizable(true);
        frame.setVisible(true);

        canvas.createBufferStrategy(2);
        bufferStrategy = canvas.getBufferStrategy();
        canvas.requestFocus();
        canvas.addKeyListener(this);

        frame.addComponentListener(new ComponentAdapter()
        {
            public void componentResized(ComponentEvent evt) {
                Component c = (Component)evt.getSource();
                canvas.setBounds(0,0,frame.getWidth(),frame.getHeight());
            }
        });

        System.out.println("DONE graphic setup");


    }


    private void render() {
        Graphics2D g = (Graphics2D) bufferStrategy.getDrawGraphics();
        g.clearRect(0, 0, frame.getWidth(), frame.getHeight());

        g.fillOval((int)(topBob.x-10), (int)(topBob.y-10), 20,20);
        g.fillOval((int)(bottomBob.x-10), (int)(bottomBob.y-10), 20,20);

        g.drawLine((int)(topBob.x), (int)(topBob.y), (int)(topBob.fulcrumx), (int)(topBob.fulcrumy));
        g.drawLine((int)(bottomBob.x), (int)(bottomBob.y), (int)(bottomBob.fulcrumx), (int)(bottomBob.fulcrumy));

        g.dispose();

        bufferStrategy.show();
    }

    @Override
    public void keyTyped(KeyEvent e) {

    }

    @Override
    public void keyPressed(KeyEvent e) {

    }

    @Override
    public void keyReleased(KeyEvent e) {

    }
}