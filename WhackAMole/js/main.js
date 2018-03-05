var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var moleX = new Array(100, 100, 200, 200, 300, 300);
var moleY = new Array(100, 250, 100, 250, 100, 250);

var pos = {};
var rand = 0;
var mousePos = {};
var isMoleHit = false;
var acDelta = 0;
var msPerFrame = 50;
var score = 0;
var times = 0;

var backImage = new Image();
backImage.src = "images/background.png";

var holeImage = new Image();
holeImage.src = "images/hole.png";

var moleImage = new Image();
moleImage.src = "images/mole.png";

var hammerImage = new Image();
hammerImage.src = "images/hammer.png";

var hitSound = new Audio('sounds/hit.mp3');

function getMousePos(event) {
    var mouseX = event.clientX - ctx.canvas.offsetLeft;
    var mouseY = event.clientY - ctx.canvas.offsetTop;
    
    return {
        x: mouseX,
        y: mouseY
    };
}

$(document).mousemove(function(event) {
    mousePos = getMousePos(event);    
});

var reset = function () {
    rand = Math.floor(Math.random() * 6);
    pos.x = moleX[rand];
    pos.y = moleY[rand];
};

var render = function () {
    // 배경이미지
    ctx.drawImage(backImage, 0, 0);
    // 구멍이미지
    for (var i = 0; i <= moleX.length; i++) {
        ctx.drawImage(holeImage, moleX[i], moleY[i]);
    }
    
    // 두더지가 타격하면 이미지가 안 보여진다.
    if (isMoleHit) {
        ctx.globalAlpha = 0;
    } 
    // 두더지 이미지
    ctx.drawImage(moleImage, moleX[rand], moleY[rand]);  
    ctx.globalAlpha = 1;
    
    // 해머 이미지
    if (isMoleHit) {
        // 두더지를 때렸을 때 나타나는 이미지
        ctx.drawImage(hammerImage, 60, 0, 60, 60, mousePos.x - 30, mousePos.y - 30, 60, 60); 
        if (acDelta > msPerFrame) {
            acDelta = 0;
            isMoleHit = false;
        } else {
            acDelta++;
        }
    } else {
        // 대기상태 이미지
        ctx.drawImage(hammerImage, 0, 0, 60, 60, mousePos.x - 30, mousePos.y - 30, 60, 60);  
    }  
    
     // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "bold 24px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("SCORE: " + score, canvas.width / 2, 10);
    ctx.strokeText("SCORE: " + score, canvas.width / 2, 10);
    
    // time
    times++;
    ctx.fillStyle = "black";
    ctx.textAlign = "right";
    ctx.fillText('TIME: ' + Math.round(times / 100), canvas.width - 10, 10); 
};

var isHit = function (x, y) {
    return x <= (pos.x + 60)
    && x >= pos.x
    && y <= (pos.y + 60)
    && y >= pos.y;
};

$(document).mousedown(function(event) {
    var mouseX = event.clientX - ctx.canvas.offsetLeft;
    var mouseY = event.clientY - ctx.canvas.offsetTop;
            
    if (isHit(mouseX, mouseY) && isMoleHit === false) {
        isMoleHit = true;
    	reset();
    	render();
        hitSound.play();
        ++score;
    }
});

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

$("#btnStart").click(function () {
    $("#SplashScreen").hide();
    $("#myCanvas").show();
    reset();
    main();
    $(".sound").css('display', "block");
    $(".myAudio").trigger('play');
});

var main = function () {   
    render();
    requestAnimationFrame(main);
};

reset();
main();
