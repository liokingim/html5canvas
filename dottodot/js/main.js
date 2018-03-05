var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// 이미지 가져오기
var img = $("#img")[0];
ctx.drawImage(img, 0, 0);

var startX = 0;
var startY = 0;
var arrCoords = new Array();
var totalPoint = 31;

var finishImage = new Image();
finishImage.src = "images/dottodot_airplane_finish.png";

// 마우스 클릭할 때 라인 그리기
ctx.canvas.addEventListener('click', function(event) {    
    // 총포인트의 개수를 넘으면 리턴한다.
    if (arrCoords.length >= totalPoint) {
        return;
    }
    
    var mouseX = event.clientX - ctx.canvas.offsetLeft;
    var mouseY = event.clientY - ctx.canvas.offsetTop;
    var radius = 8;

    // 라인을 그린다.
    if (arrCoords.length === 0) {
        startX = mouseX - 5;
        startY = mouseY;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
    } else {
        ctx.moveTo(startX, startY);
        startX = mouseX - 5;
        startY = mouseY;
        ctx.lineTo(startX, startY);        	
    }
    ctx.stroke();
    
    // circle draw
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, radius, 0, 6.28);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.stroke();  
    
    // text draw
    var coordcnt = arrCoords.length + 1;
    ctx.font = "normal bold 8px Arial, sans-serif";
    ctx.fillStyle = "#000000";
    ctx.fillText(coordcnt, mouseX - 3, mouseY + 4);
    
    // 배열에 담는다.
    arrCoords.push(mouseX+","+mouseY);
    
    // 총 포인트의 개수와 같으면 완성된 이미지를 보여준다.
    if (arrCoords.length === totalPoint) {
        alert("잘 하셨습니다.");
        render();
    }
});

// 완성된 이미지를 보여준다.
function render () {
    ctx.drawImage(finishImage, 0, 0);
}