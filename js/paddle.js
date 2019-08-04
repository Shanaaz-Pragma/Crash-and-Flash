import {Shape} from "./shape.js";
import {Vector} from "./vector.js";

export class Paddle extends Shape {
    constructor(width, height, fill) {
        super(width, height, fill);
        this.vel = new Vector();
        this.speed = 5;
        this._lastPos = new Vector;
    }

    dispose() {
        super.dispose();
        this.vel = null;
        this.speed = null;
        this._lastPos = null;
    }

    /**
     * This function considers the delta time passed and updates the velocity and last position of the paddle
     * @param dt
     */
    update(dt) {
        this.vel.y = (this.pos.y - this._lastPos.y) / dt;
        this._lastPos.y = this.pos.y;
    }
}