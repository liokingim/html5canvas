var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var keysDown = {};
var bee = {};
var flower = {};
bee.x = canvas.width / 2;
bee.y = canvas.height / 2;
bee.speed = 5;

var backImage = new Image();
backImage.src = "images/background.png";

var beeImage = new Image();
beeImage.src = "images/bee.png";

var backReady = false;
var beeReady = false;
var beeOffset = 0;

var frame = 0;
var lastUpdateTime = 0;
var acDelta = 0;
var msPerFrame = 1000;
var score = 0;
var times = 0;

var hitSound = new Audio('sounds/hit.mp3');

backImage.onload = function () {
    backReady = true;
};

beeImage.onload = function () {   
    beeReady = true;
};

var flowerReady = false;
var flowerImage = new Image();
flowerImage.src = "images/flower.png";
flowerImage.onload = function () {
    flowerReady = true;
};

var reset = function () {
    flower.x = 32 + (Math.random() * (canvas.width - 64));
    flower.y = 32 + (Math.random() * (canvas.height - 64));
};

var render = function () {
    var delta = Date.now() - lastUpdateTime;
    if (acDelta > msPerFrame) {
        acDelta = 0;

        if (backReady) {
            ctx.drawImage(backImage, 0, 0);
        }

        if (beeReady) {
            ctx.drawImage(beeImage, frame * 32, beeOffset, 32, 48, bee.x, bee.y, 32, 48);
        }
        
        if (flowerReady) {
            ctx.drawImage(flowerImage, flower.x, flower.y);
        }
        
        frame++;
        if (frame >= 3) {
            frame = 0;
        }
    } else {
        acDelta += delta;
    }
    
    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "bold 20px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("SCORE: " + score, canvas.width / 2, 10);
    
        // time
    times++;
    ctx.fillStyle = "black";
    ctx.textAlign = "right";
    ctx.fillText('TIME: ' + Math.round(times / 100), canvas.width - 10, 10);
};

var update = function () {
    // up
    if (38 in keysDown) {
        bee.y -= bee.speed;
        beeOffset = 144;
    }
    // down
    if (40 in keysDown) {
        bee.y += bee.speed;
        beeOffset = 0;
    }
    //left
    if (37 in keysDown) {
        bee.x -= bee.speed;
        beeOffset = 48;
    }
    // right
    if (39 in keysDown) {
        bee.x += bee.speed;
        beeOffset = 96;
    }
    
    // boundery limit
    if (bee.x <= 0) {
        bee.x = 0;
    }
    if (bee.x >= canvas.width - 32) {
        bee.x = canvas.width - 32;
    }
    if (bee.y <= 0) {
        bee.y = 0;
    }
    if (bee.y >= canvas.height - 48) {
        bee.y = canvas.height - 48;
    }
    
    // collution
    if (bee.x <= (flower.x + 16)
        && bee.x >= (flower.x - 16)
        && bee.y <= (flower.y + 24)
        && bee.y >= (flower.y - 24)) {
        reset();
        hitSound.play();
        ++score;
    }
};

var main = function () {
    update();
    render();
    requestAnimationFrame(main);
};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

$('.sound').click(function() {
    var $this = $(this);

    // sound off
    if ($this.hasClass('sound-on')) {
        $this.removeClass('sound-on').addClass('sound-off');
        $(".myAudio").trigger('pause');
    } else {
        // sound on
        $this.removeClass('sound-off').addClass('sound-on');
        $(".myAudio").trigger('play');
    }
});

reset();
main();

