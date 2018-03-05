var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var keysDown = {};
var fighter = {};
fighter.x = 50;
fighter.y = canvas.height / 2;
fighter.speed = 5;
var lastUpdateTime = 0;
var acDelta = 0;
var msPerFrame = 1000;
var bool_bg = false;
var bool_fighter = false;
var bool_laser = false;
var bool_asteroid = false;
var bool_explode = false;
var lasers = [];
var laserTotal = 10; 
var speed = 0;
var asteroid = {};
var randScale;
var ang = 0;
var arrScale = [0.4, 0.6, 0.8, 1];
var hitexplosion = {};
var bool_hitexplosion = false;
var spriteCount = 1;
var bool_fighterexplosion = false;
var score = 0;
var lives = 2;
var isGameOver = false;

var bgImage = new Image();
bgImage.src = "images/space.png";

var fighterImage = new Image();
fighterImage.src = "images/fighter.png";

var laserImage = new Image();
laserImage.src = "images/laser.png";

var asteroidImage = new Image();
asteroidImage.src = "images/asteroid.png";

var explodeImage = new Image();
explodeImage.src = "images/explode.png";

var laserSound = new Audio('sounds/Laser.wav');
var explodeSound = new Audio('sounds/explosion.wav');
var hitexplodeSound = new Audio('sounds/explosion-02.wav');
hitexplodeSound.volume = 0.5;
var gameOverSound = new Audio("sounds/game_over.wav");
gameOverSound.loop = true;
gameOverSound.volume = .25;
gameOverSound.load();

bgImage.onload = function () {
    bool_bg = true;
};

fighterImage.onload = function () {
    bool_fighter = true;
};

laserImage.onload = function () {
    bool_laser = true;
};

asteroidImage.onload = function () {
    bool_asteroid = true;
};

explodeImage.onload = function () {
    bool_explode = true;
};

// 레이저 사운드를 플레이
function soundPlay() {
    laserSound.volume = 0.12;
    laserSound.load();
    laserSound.play();
}

// 폭발 이미지를 그린다.
function drawExplode() {
    ctx.drawImage(explodeImage,
                    spriteCount * 39, 0,
                    39, 40,
                    hitexplosion.x, hitexplosion.y,
                    39 * (1 + randScale), 40 * (1 + randScale));
    spriteCount++;
    if (spriteCount > 13) {
        spriteCount = 1;
        bool_hitexplosion = false;
    }
}

// 레이져를 그린다.
function drawLaser() {
    if (lasers.length) {
        for (var i = 0; i < lasers.length; i++) {
          ctx.drawImage(laserImage, lasers[i][0], lasers[i][1]);
        }
    }
}

// 레이져를 움직인다.
function moveLaser() {
    for (var i = 0; i < lasers.length; i++) {
        if (lasers[i][0] > 0) {
            lasers[i][0] += 20;
        }
        
        if (lasers[i][0] > 600) {
            lasers.splice(i, 1);
        }
    }
}

// 배경을 그린다.
var Background = function () {
    this.x = 0, this.y = 0;

    this.render = function() {
        ctx.drawImage(bgImage, this.x--, 0);
        
        if (this.x <= -600) {
            this.x = 0;
        }
    };
};

// 운석의 크기를 배열에서 램덤으로 뽑아 오기 위해서 만들었다.
function shuffle(arr) {
    var rand = Math.floor((Math.random() * arr.length));
    return arr[rand];
}

// 운석의 초기값
var reset = function () {
    speed = Math.floor(Math.random() * 5) + 5;
    asteroid.x = canvas.width;
    asteroid.y = Math.floor(Math.random() * 350);
    
    if (asteroid.y < 40) {
        asteroid.y = 40;
    }
    
    if (asteroid.y > 360) {
        asteroid.y = 360;
    }
    
    randScale = shuffle(arrScale);
};

// 운석을 그린다.
function moveAstroid () {
    var w = asteroidImage.width * randScale; 
    var h = asteroidImage.height * randScale;
    var coordX = (asteroidImage.width / 2) * randScale;
    var coordY = (asteroidImage.height / 2) * randScale;
    
    ctx.save();
    ctx.translate(asteroid.x + coordX, asteroid.y + coordY);
    ctx.rotate(Math.PI / 180 * (ang += 5));
    ctx.translate(-asteroid.x - coordX, -asteroid.y - coordY);
    ctx.drawImage(asteroidImage, asteroid.x -= speed, asteroid.y, w, h);
    ctx.restore();    
    
    if (asteroid.x <= -100) {
        reset();
    }
}

// 충돌 처리
function detectCollision() { 
    var aw = asteroidImage.width * randScale; 
    var ah = asteroidImage.height * randScale; 
    var fw = fighterImage.width; 
    var fh = fighterImage.height;   
    
//    ctx.strokeStyle = "white";
//    ctx.lineWidth = 2;
//    ctx.strokeRect(fighter.x, fighter.y, fighterImage.width, fighterImage.height);
//    ctx.strokeRect(asteroid.x, asteroid.y, aw, ah);
    
    // fighter Collision
    if ((fighter.x > asteroid.x && fighter.x < asteroid.x + aw
        && fighter.y > asteroid.y && fighter.y < asteroid.y + ah)
        || (fighter.x + fw > asteroid.x && fighter.x + fw < asteroid.x + aw
            && fighter.y > asteroid.y && fighter.y < asteroid.y + ah)
        || (fighter.x > asteroid.x && fighter.x < asteroid.x + aw
            && fighter.y + fh > asteroid.y && fighter.y + fh < asteroid.y + ah)
        || (fighter.x + fw > asteroid.x && fighter.x + fw < asteroid.x + aw
            && fighter.y + fh > asteroid.y && fighter.y + fh < asteroid.y + ah)) { 
        bool_fighterexplosion = true;  
        bool_explode = true;
        bool_hitexplosion = true;
        hitexplosion.x = asteroid.x;
        hitexplosion.y = asteroid.y;
        reset();
        resetFigher();
        explodeSound.load();
        explodeSound.play(); 
        
        // 생명 수치 표시
        if (lives <= 0) {
            lives = 0; 
            // 게임 오버
            gameOver(); 
        } else {
           --lives; 
        }
        $("#lives").text(lives);
    }
    
    // laser Collision
    if (lasers.length) {
        for (var i = 0; i < lasers.length; i++) {
            if (lasers[i][0] > asteroid.x && lasers[i][0] < asteroid.x + aw
                && lasers[i][1] > asteroid.y && lasers[i][1] < asteroid.y + ah) {
                hitexplosion.x = lasers[i][0];
                hitexplosion.y = lasers[i][1];
                bool_hitexplosion = true;
                lasers.splice(i, 1);
                reset();
                hitexplodeSound.load();
                hitexplodeSound.play();
                $("#score").text(Number($("#score").text()) + 100);
            }
        }
    }
};

// 비행기의 위치를 초기화한다.
function resetFigher () {
    fighter.x = 0;
    fighter.y = canvas.height / 2;
}

// 게임 오버 화면
function gameOver () {
    isGameOver = true;
    bool_explode = false;
    $(".myAudio").removeClass('sound-on').addClass('sound-off');
    $(".myAudio").trigger('pause');
    $(".myAudio").prop("currentTime", 0);
    var isSoundOn = $(".sound").hasClass('sound-on');
    if (isSoundOn) {
        gameOverSound.currentTime = 0;
        gameOverSound.play();
    }
    $('#game-over').css("display", "block");
}

// 게임 리스타트
function restart () {
    isGameOver = false;
    bool_explode = true;
    if ($(".sound").hasClass('sound-on')) {
        $(".myAudio").trigger('play');
    } else {
        $(".myAudio").trigger('pause');
    }
    gameOverSound.currentTime = 0;
    gameOverSound.pause();
    $('#game-over').css("display", "none");
    lives = 2;
    score = 0;
    $("#lives").text(lives);
    $("#score").text(score);
}

var render = function () {  
    var delta = Date.now() - lastUpdateTime;
    if (acDelta > msPerFrame) {
        acDelta = 0;
        
        if (bool_bg) {
            background.render();
        }
        
       if (bool_laser) {
            drawLaser();
            moveLaser();
        }
        
        if (bool_fighter) {
            // 비행기 폭발할 때 처리
            if (bool_fighterexplosion === true) {
                ctx.drawImage(fighterImage, fighter.x += 1, fighter.y);
                if (fighter.x >= 50) {
                    bool_fighterexplosion = false;
                }
            } else {
                ctx.drawImage(fighterImage, fighter.x, fighter.y);                
            }
        }
        
        if (bool_asteroid) {
            moveAstroid();
        }
        
        if (bool_explode && bool_hitexplosion) {
            drawExplode();
        }
    } else {
        acDelta += delta;
    }
};

var update = function () {
    // up w
    if (87 in keysDown) {
        fighter.y -= fighter.speed;
    }
    // down s
    if (83 in keysDown) {
        fighter.y += fighter.speed;
    }
    //left a
    if (65 in keysDown) {
        fighter.x -= fighter.speed;
    }
    // right d
    if (68 in keysDown) {
        fighter.x += fighter.speed;
    }
    
    // boundery limit
    if (fighter.x <= 0) {
        fighter.x = 0;
    }
    if (fighter.x >= canvas.width - 60) {
        fighter.x = canvas.width - 60;
    }
    if (fighter.y <= 0) {
        fighter.y = 0;
    }
    if (fighter.y >= canvas.height - 30) {
        fighter.y = canvas.height - 30;
    }    
    
    detectCollision();
};

// 키보드를 눌렀을 때
addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
    
    if (e.keyCode === 32 && lasers.length <= laserTotal) {
        lasers.push([fighter.x + 50, fighter.y + 10]);
        soundPlay();
    }
}, false);

// 키보드를 해제할 때
addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

$('.sound').click(function() {
    var $this = $(this);
    var isSoundOn = $this.hasClass('sound-on');    
        
    // sound off
    if (isSoundOn) {
        $this.removeClass('sound-on').addClass('sound-off');
    } else {
        // sound on
        $this.removeClass('sound-off').addClass('sound-on');
    }
    
    if (isGameOver) {
        if (isSoundOn) {
            gameOverSound.pause();
        } else {
            gameOverSound.play();
        }
    } else {
        if (isSoundOn) {
            $(".myAudio").trigger('pause');
        } else {
            // sound on
            $(".myAudio").trigger('play');
        }
    }
});

$("#restart").click(function () {
    restart();
});

var main = function () {
    update(); 
    
    if (!isGameOver) {
        render();
    }
    
    requestAnimationFrame(main);
};

$(".myAudio").prop("volume", 0.5);
$("#lives").text(lives);
var background = new Background();
reset();
main();
