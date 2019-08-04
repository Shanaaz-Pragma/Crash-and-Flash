import {Shape} from "./shape.js";
import {Vector} from "./vector.js";

export class Ball extends Shape {
    constructor(width, height, fill) {
        super(width, height, fill);
        this.vel = new Vector();
        this.speed = 200;
    }

    dispose() {
        super.dispose();
        this.vel = null;
        this.speed = null;
    }
}