export class Shape {
    get left(){
        return this.pos.x - this.size.width/2;
    }

    get right(){
        return this.pos.x + this.size.width/2;
    }

    get top(){
        return this.pos.y - this.size.height/2;
    }

    get bottom(){
        return this.pos.y + this.size.height/2;
    }

    constructor(width, height, fill) {
        this.pos = {};
        this.size = {width, height};
        this.width = width;
        this.height = height;
        this.fill = fill;
    }

    dispose() {
        this.pos = null;
        this.size = null;
        this.width = null;
        this.height = null;
        this.fill = null;
    }
}