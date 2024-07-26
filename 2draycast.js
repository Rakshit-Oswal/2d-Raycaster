const screenWidth = 800, screenHeight = 600, rayangleturn = 0.5; 
let particles = [], boundaries = [], rays = [];
let particle; // Declaring this outside to deal with redraw and other complications
let move = false, fov = 360.0;

class Boundary {
    constructor(x1, y1, x2, y2) {
        this.A = createVector(x1, y1);
        this.B = createVector(x2, y2);
        this.color = color(random(100, 255), random(100, 255), random(100, 255));
    }
    show() {
        stroke(this.color);
        strokeWeight(2);
        line(this.A.x, this.A.y, this.B.x, this.B.y);
    }
}

class Particle {
    constructor(x, y, r) {
        this.pos = createVector(x, y);
        this.radius = r;
        this.rays = [];
        for (let i = -fov/2.; i <= fov/2.; i += rayangleturn) {
            this.rays.push(new Ray(this.pos.x, this.pos.y, radians(i)));
        }
    }
    
    show() {
        noStroke();
        fill(255, 204, 0, 150);
        ellipse(this.pos.x, this.pos.y, this.radius, this.radius);
    }
    
    update(x, y) {
        this.pos.set(x, y);
        for (let ray of this.rays) {
            ray.update(x, y);
        }
    }
    
    showRays() {
        for (const ray of this.rays) {
            let closest = null;
            let record = Infinity;
            for (const boundary of boundaries) {
                const point = ray.collision(boundary);
                if (point) {
                    const d = dist(ray.p0.x, ray.p0.y, point.x, point.y);
                    if (d < record) {
                        record = d;
                        closest = point;
                    }
                }
            }
            if (closest) {
                ray.show(record);
            } else {
                ray.show(1000);
            }
        }
    }
}

class Ray {
    constructor(x, y, angle) {
        this.p0 = createVector(x, y);
        this.p1 = p5.Vector.fromAngle(angle);
    }
    
    show(amt) {
        stroke(255, 102, 255, 100);
        strokeWeight(1.5);
        push();
        translate(this.p0.x, this.p0.y);
        line(0, 0, this.p1.x * amt, this.p1.y * amt);
        pop();
    }
    
    collision(boundary) {
        // Boundary coordinates
        const x1 = boundary.A.x, y1 = boundary.A.y, x2 = boundary.B.x, y2 = boundary.B.y;
        // Ray coordinates
        const x3 = this.p0.x, y3 = this.p0.y, x4 = this.p0.x + this.p1.x * 1000, y4 = this.p0.y + this.p1.y * 1000;

        const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (denominator === 0) return null;

        // Checking for line intersection
        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;

        if (t > 0 && t < 1 && u > 0) {
            //point of intersection
            const pt = createVector(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
            return pt;
        }
        return null;
    }

    update(x, y) {
        this.p0.set(x, y);
    }
}

function setup() {
    createCanvas(screenWidth, screenHeight);
    particle = new Particle(70, screenHeight / 2 + 230, 20); // Allows particle to move wrt mouse position
    particles.push(particle);
    boundaries.push(new Boundary(100, 50, 400, 70),
                    new Boundary(300, 140, 120, 140), 
                    new Boundary(400, 400, 600, 300), 
                    new Boundary(200, 300, 200, 500), 
                    new Boundary(700, 100, 700, 300), 
                    new Boundary(500, 500, 600, 600), 
                    new Boundary(50, 500, 250, 400),
                    new Boundary(10, 200, 90, 100),
                    new Boundary(20, 50, 40, 60),
                    new Boundary(45, 60, 40, 260, 70),
                    new Boundary(230, 120, 130, 90),
                    new Boundary(400, 200, 400, 230),
                    new Boundary(400, 240, 400, 270),
                    new Boundary(400, 280, 400, 310),
                    new Boundary(400, 320, 400, 350),
                   ); 
}

function draw() {
    background(0);
    if (move) {
        particle.update(mouseX, mouseY); // Update particle position based on mouse
    }
    for (const boundary of boundaries) {
        boundary.show();
    }
    for (const particle of particles) {
        particle.showRays();
        particle.show();
    }
}

function mousePressed() {
    const d = dist(mouseX, mouseY, particle.pos.x, particle.pos.y);
    if (d < particle.radius) move = true;
}

function mouseDragged() {
    if (move) {
        particle.update(mouseX, mouseY);
    }
}

function mouseReleased() {
    move = false;
}
