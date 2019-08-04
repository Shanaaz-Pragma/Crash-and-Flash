export class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    dispose() {
        this.x = null;
        this.y = null;
    }
}