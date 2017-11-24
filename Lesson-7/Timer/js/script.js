const SCALE_LINE_FROM = 100;
const SCALE_WIDTH = 5;
const SCALE_ANGLE = Math.PI/30;

const CLOCK_HAND_CENTER = -10;
const CLOCK_HAND_EDGE = SCALE_LINE_FROM - 20;

const DIGITAL_X_MARGIN = 15;
const DIGITAL_Y_MARGIN = 20;

const BUTTON_Y_MARGIN = 5;
const TEXT_Y_MARGIN = 10;


/**************************************************/
/**************** Clock face **********************/
/**************************************************/
let ClockFace = function() {
    this.canvas = document.getElementById("face");
    this.ctx = this.canvas.getContext("2d");
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
};

ClockFace.prototype.draw = function() {
    let ctx = this.ctx;
    let scaleLineTo = SCALE_LINE_FROM + SCALE_WIDTH;

    ctx.beginPath();
    for(let i = 0; i < 60; i++) {
        ctx.rotate(SCALE_ANGLE);
        ctx.moveTo(SCALE_LINE_FROM,0);
        ctx.lineTo(scaleLineTo,0);
    }

    ctx.stroke();
};


/**************************************************/
/**************** Analog timer ********************/
/**************************************************/
let ClockHand = function() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.sec = 0;
    this.movingInterval;
}

ClockHand.prototype.draw = function() {
    let ctx = this.ctx;
    ctx.save();

    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-Math.PI/2);

    ctx.rotate(this.sec++ * SCALE_ANGLE);

    ctx.beginPath();
    ctx.strokeStyle = "#FF0000";
    ctx.moveTo(CLOCK_HAND_CENTER, 0);
    ctx.lineTo(SCALE_LINE_FROM - 20, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0,0,3,0,2*Math.PI);
    ctx.fill();

    ctx.restore();
}

ClockHand.prototype.move = function() {
    let clockObject = this;

    clockObject.movingInterval = setInterval(function() {
        clockObject.draw();
    }, 1000);
}

ClockHand.prototype.stop = function() {
    clearInterval(this.movingInterval);
}


/**************************************************/
/*************** Digital timer ********************/
/**************************************************/
let Timer = function() {
    this.movingInterval;
    this.canvas = document.getElementById("timer");
    this.ctx = this.canvas.getContext("2d");
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.ctx.font = "15px Arial";
}

Timer.prototype.draw = function() {
    this.ctx.clearRect(-this.canvas.width, -this.canvas.height, this.canvas.width * 2, this.canvas.height * 2);
    this.ctx.fillText(("00 : 00 : 00"), DIGITAL_X_MARGIN, DIGITAL_Y_MARGIN);
}

Timer.prototype.move = function() {
    let timerObject = this;
    let timerWidth = timerObject.canvas.width;
    let timerHeight = timerObject.canvas.height;

    timerObject.movingInterval = setInterval(function() {
        if(timerObject.seconds === 59) {
            timerObject.seconds = 0;

            if(timerObject.minutes === 59) {
                timerObject.minutes = 0;
                timerObject.hours++;
            } else {
                timerObject.minutes++;
            }
        } else {
            timerObject.seconds++;
        }

        let drawSeconds = (timerObject.seconds < 10) ? "0" + timerObject.seconds : timerObject.seconds;
        let drawMinutes = (timerObject.minutes < 10) ? "0" + timerObject.minutes : timerObject.minutes;
        let drawHours = (timerObject.hours < 10) ? "0" + timerObject.hours : timerObject.hours;

        timerObject.ctx.clearRect(-timerWidth, -timerHeight, timerWidth * 2, timerHeight * 2);
        timerObject.ctx.fillText((drawHours + " : " + drawMinutes + " : " + drawSeconds), DIGITAL_X_MARGIN, DIGITAL_Y_MARGIN);

    }, 1000);
}

Timer.prototype.stop = function() {
    clearInterval(this.movingInterval);
}

/**************************************************/
/****************** Buttons ***********************/
/**************************************************/
let Button = function(status) {
    this.status = status;
    this.canvas = document.getElementById("button");
    this.ctx = this.canvas.getContext("2d");
    this.ctx.font = "15px Arial";
    this.ctx.fillStyle = "#fff";
}

Button.prototype.drawGradient = function(zeroPoint, height) {
    this.ctx.save();
    let buttonGradient = this.ctx.createLinearGradient(0, zeroPoint, 0, height);
    buttonGradient.addColorStop(0, "#505050");
    buttonGradient.addColorStop(1, "#000");
    this.ctx.fillStyle = buttonGradient;
    this.ctx.clearRect(0, zeroPoint, this.canvas.width, height);
    this.ctx.fillRect(0, zeroPoint, this.canvas.width, height);
    this.ctx.restore();
}

Button.prototype.drawStartStop = function() {
    let buttonHeight = this.canvas.height / 2 - BUTTON_Y_MARGIN;
    this.drawGradient(0, buttonHeight);
    this.ctx.fillText(this.status, 20, this.canvas.height / 2 - TEXT_Y_MARGIN - 5);
}

Button.prototype.drawRefresh = function() {
    let buttonHeight = this.canvas.height / 2 + BUTTON_Y_MARGIN;
    this.drawGradient(buttonHeight, this.canvas.height);
    this.ctx.fillText("Refresh", 10, this.canvas.height - TEXT_Y_MARGIN);
}


/**************************************************/
/************ Drawing all elements ****************/
/**************************************************/
let clockFace = new ClockFace();
clockFace.draw();

let clockHand = new ClockHand();
clockHand.draw();

let timer = new Timer();
timer.draw();

let button = new Button("Start");
button.drawStartStop();
button.drawRefresh();

let buttonStatus = "Start";
button.canvas.onclick = function(event) {
    if(event.offsetY <= (button.canvas.height / 2 - BUTTON_Y_MARGIN)) {
        if(buttonStatus === "Start") {
            clockHand.move();
            timer.move();
            buttonStatus = "Stop";
        } else {
            clockHand.stop();
            timer.stop();
            buttonStatus = "Start";
        }

        button = new Button(buttonStatus);
        button.drawStartStop();
    } else if(event.offsetY >= (button.canvas.height / 2 + BUTTON_Y_MARGIN)) {
        clockHand.stop();
        timer.stop();
        buttonStatus = "Start";
        button = new Button(buttonStatus);
        button.drawStartStop();

        clockHand = new ClockHand();
        clockHand.draw();

        timer = new Timer();
        timer.draw();
    }
}
