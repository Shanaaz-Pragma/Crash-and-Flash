import {Ball} from "./ball.js";
import {Paddle} from "./paddle.js";

export class Game {
    constructor(canvas, width, height){
        this.canvasColor = "#EEEEEE";
        this._canvas = canvas;
        this._context = canvas.getContext('2d');
        this._canvas.width = width;
        this._canvas.height = height;
        this.infoBarHeight = 30;
        this.gamestate = "start";
        this.lives = 2;
        this.score = 0;
        this.fps = 60;
        this.ballColor = "#d80202";
        this.ballFlashColor = "#000000";
        this.ball = new Ball(30, 30, this.ballColor);

        //Create paddles
        this.paddleColor = "#2500DC";
        this.paddleFlashColor = "#000000";
        this.paddles = [ new Paddle(40, 150, "blue"), new Paddle(40, 150, this.paddleColor)];

        this.paddles[0].pos.x = 40;
        this.paddles[1].pos.x = this._canvas.width - 40;
        this.paddles[0].pos.y = this._canvas.height/2 + this.paddles[0].size.height/2;
        this.paddles[1].pos.y = this._canvas.height/2 + this.paddles[1].size.height/2;

        let lastTime = null;
        this.gameLoop = (ms) => {
            if(lastTime!== null){
                const diffDt = ms - lastTime;
                this.update(diffDt / 1000);
            }
            lastTime = ms;
            requestAnimationFrame(this.gameLoop);
        }

        this.reset();
        this.play();

        //Inputs
        /*document.addEventListener("keydown", this.keyDownHandler, false);
        document.addEventListener("keyup", this.keyUpHandler, false);*/

        document.addEventListener("mousemove", event =>{
            this.paddles[0].pos.y = event.offsetY;
            this.paddles[1].pos.y = event.offsetY;
        });
    }

    dispose() {
        this._canvas = null;
        this._context = null;
        this.gamestate = null;
        this.lives = null;
        this.score = null;
        this.fps = null;
        this.ball = null;
        this.paddles = null;
    }

    /**
     * This function creates a new rectangular element
     * @param element
     */
    rect(element) {
        this._context.beginPath();
        this._context.rect(element.left, element.top, element.size.width, element.size.height);
        this._context.fillStyle = element.fill;
        this._context.fill();
        this._context.closePath();
    }

    /**
      * This function creates a new circular element
     * @param element
     */
    circle(element) {
        this._context.beginPath();
        this._context.arc(element.left, element.top, element.size.width, 0, Math.PI*2);
        this._context.fillStyle = element.fill;
        this._context.fill();
        this._context.closePath();
    }

    /**
     * This function creates a new textual element
     * @param text
     * @param font
     * @param x
     * @param y
     * @param fill
     */
    text(text, font, x, y, fill){
        this._context.font = font;
        this._context.fillStyle = fill;
        this._context.fillText(text, x, y);
    }

    /**
     * This function clears the canvas to prepare it for the draw function
     */
    clear() {
        //clear previous canvas
        this._context.clearRect(0,0, this._canvas.width, this._canvas.height);

        //draw  canvas background
        this._context.fillStyle = this.canvasColor;
        this._context.fillRect(0,0, this._canvas.width, this._canvas.height);
    }

    /**
     * This function resets game properties
     */
    reset() {
        //Ball Start Velocity
        this.ball.vel.x = 0;
        this.ball.vel.y = 0;

        //Ball Start position
        this.ball.pos.x = this._canvas.width / 2;
        this.ball.pos.y = this._canvas.height / 2;
    }

    /**
     * This function fires up the main game loop
     */
    start() {
        //start game loop
        requestAnimationFrame(this.gameLoop);
    }

    /**
     * This function does checks game state and updates play related properties
     */
    play() {
        //Check gamestate
        let newGameState;
        if(this.gamestate == "paused") {
            newGameState = "playing";
        }
        else if(this.gamestate == "playing") {
            newGameState = "playing";
        }
        else {
            newGameState = this.gamestate == "start" ? "playing" : "paused";
        }

        //If ball hasn't been moved yet(fresh game) || play function was called from a playing state, (a life has been lost)
        if(this.ball.vel.x === 0 && this.ball.vel.y === 0 && this.gamestate == "start" || this.gamestate == "playing"){
            this.reset();
        }

        //If fresh game
        if(this.ball.vel.x === 0 && this.ball.vel.y === 0){
            this.ball.vel.x = this.ball.speed;
            this.ball.vel.y = this.ball.speed;
        }

        //Update game state
        this.gamestate = newGameState;
    }

    /**
     * This function handles drawing of game elements to screen
     */
    draw() {
        //clear previous canvas
        this.clear();

        //Draw score
        this.text('Score: ' + Math.floor(this.score), '12px Arial', 10, 20, 'black');

        //Draw lives
        this.text('Lives: ' + this.lives, '12px Arial', 750, 20, "black");

        //draw ball
        this.circle(this.ball);

        //Draw paddles
        for(const paddle of this.paddles) {
            this.rect(paddle);
        }
    }

    /**
     * This function updates the canvas on each frame
     * @param dt
     */
    update(dt) {
        if(this.gamestate != "playing") return;

        //increment score
        if(this.gamestate != "paused" && this.gamestate != "over") {
            this.score += 10/this.fps;
        }

        //check if ball is colliding with left or right of canvas
        if(this.ball.left < this.ball.size.width || this.ball.right > this._canvas.width){
            this.lives--;
            console.log(`You have ${this.lives} lives remaining.`);

            if(this.lives === 0){
                this.gamestate = "over";

                this.clear();
                this.text('Game over! Your high score: ' + Math.floor(this.score), '30px Arial', 200, 200, 'black');

                //Needed for Chrome to end game
                clearInterval(interval);
            } else {
                this.play();
            }
        }

        //update balls position according to delta time passed
        if(this.gamestate == "playing") {
            this.ball.pos.x += this.ball.vel.x * dt;
            this.ball.pos.y += this.ball.vel.y * dt;
        }

        //check if ball is colliding with top or bottom of canvas
        if(this.ball.top < this.ball.size.height + this.infoBarHeight || this.ball.bottom > this._canvas.height){
            this.ball.vel.y = -this.ball.vel.y;

            //change colour of ball
            this.flashColor(this.ball, "black");
            this.flashColor(this._canvas, "pink");
            //this.ball.fill = "black";
        }

        for(const paddle of this.paddles) {

            //reset paddle fill color
            if(paddle.fill != this.paddleColor) paddle.fill = this.paddleColor;

            //Update paddle position
            paddle.update(dt);

            //check for collision with ball
            this.collide(paddle, this.ball);

            //Constrain paddle to canvas top
            if(paddle.pos.y <= paddle.size.height/2 + this.infoBarHeight) {
                paddle.pos.y = paddle.size.height/2 + this.infoBarHeight;
            }

            //Constrain paddle to canvas bottom
            if(paddle.pos.y + paddle.size.height/2 > this._canvas.height) {
                paddle.pos.y = this._canvas.height - paddle.size.height/2;
            }

            //Up key pressed: Decrease y position
            if(this.upPressed === true) {
                //paddle.pos.y = this._canvas.height/2;
                paddle.pos.y -= paddle.speed;
            }

            //Down key pressed: Increase y position
            if(this.downPressed === true) {
                paddle.pos.y += paddle.speed;
            }
        }

        this.draw();

        //reset ball fill
        if(this.ball.fill != this.ballColor) this.ball.fill = this.ballColor;

        //reset canvas fill
        if(this._canvas.fill != "red") this._canvas.fill = "red";
    }

    /**
     * This function checks collision between paddle and ball and then flashes the colours
     * @param paddle
     * @param ball
     */
    collide(paddle, ball) {
        //collision with right side of left paddle
        if(paddle.right < this._canvas.width/2 && ball.left - ball.size.width <= paddle.right && paddle.top < ball.bottom && paddle.bottom > ball.top || paddle.left > this._canvas.width/2 && ball.right >= paddle.left && paddle.top < ball.bottom && paddle.bottom > ball.top) {
            ball.vel.x = -ball.vel.x;

            //flash colour of ball and paddle
            this.flashColor(ball, this.ballFlashColor);
            this.flashColor(paddle, this.paddleFlashColor);
        }
    }

    /**
     * This function handles the color flashing of elements
     * @param item
     * @param color
     */
    flashColor(item, color) {
        item.fill = color;
    }

    /**
     * This function handles key down events
     * @param event
     */
    keyDownHandler(event) {
        if(event.key == "Up" || event.key == "ArrowUp") {
            this.upPressed = true;
        }
        else if(event.key == "Down" || event.key == "ArrowDown") {
            this.downPressed = true;
        }
    }

    /**
     * This function handles key up events
     * @param event
     */
    keyUpHandler(event) {
        if(event.key == "Up" || event.key == "ArrowUp") {
            this.upPressed = false;
        }
        else if(event.key == "Down" || event.key == "ArrowDown") {
            this.downPressed = false;
        }
    }
}
