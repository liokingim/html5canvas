var dataNo = 0;
var jsondata = "";

// 로드
function init() {
    $("#dialogbox").css("display", "block");    
    $("#btnStart").click(function () {
        startGame();
    });
}

// 게임 시작
function startGame() {
    $("#dialogbox").css("display", "none");
    $("#title").css("display", "block");
    loadData('scenes/scene_01.html');
}

// 게임신 로드
function loadData(partname) {
    // http 파일 읽기
    $.ajax({url: partname}).done(function(data) {
        if (data === "") return;
        $("#gameScene").html(data);
        jsondata = $.parseJSON($('#jsonData').text());
        dataNo = 0;
        parseGameData();
    });
}

// 데이터 해석, 적용
function parseGameData() {
    var len = jsondata.length;
    for (var i = dataNo; i < len; i++) {
        dataNo++;
        var result = setGameData(jsondata[i]);                
        if (result === -1) {
            console.log("error.");
        } else if (result === 0) {
            // 루프 나가기
            return;
        }
    }
}

// 게임 데이터를 순서대로 분석하여 적용.
function setGameData (data) {
    switch (data.id) {
        case "display":  
            var isClass = $(".hiddenData").hasClass(data.class1);  
            if (!isClass) return -1;
            $("."+data.class1).css("display", "block");
            $("."+data.class1).css("top", data.top);
            $("."+data.class1).css("left", data.left);
            $("."+data.class1).css("margin-top", data.margintop);
            return 1;
        case "addClass":
            var isClass = $(".hiddenData").hasClass(data.class1);  
            if (!isClass) return -1;
            $("."+data.class1).addClass(data.class2);
            return 1; 
        case "removeClass":
            var isClass = $(".hiddenData").hasClass(data.class1);  
            if (!isClass) return -1;
            $("."+data.class1).removeClass(data.class2);
            return 1;   
        case "hidden":
            var isClass = $(".hiddenData").hasClass(data.class1);  
            if (!isClass) return -1;
            $("."+data.class1).css("display", "none");
            return 1;           
        case "button":
            var isClass = $(".hiddenData").hasClass(data.class1);  
            if (!isClass) return -1;
            $("."+data.class1).css("display", "block");
            $("."+data.class1).css("top", data.top);
            $("."+data.class1).css("left", data.left); 
            $("."+data.class1).bind("click", nextText);
            return 0; 
        case "nextScene":
            var isClass = $(".hiddenData").hasClass(data.class1);  
            if (!isClass) return -1;
            $("."+data.class1).css("display", "block");
            $("."+data.class1).css("top", data.top);
            $("."+data.class1).css("left", data.left);
            $("."+data.class1).bind("click", changeScene);
            return 1;
        case "wait":
            setTimeout(parseGameData, data.time);
            return 0;
    }
    return 1;
}

// 다음 게임신의 정보를 가져온다.
function changeScene () {
    var strHref = $(this).data("href");
    loadData('scenes/' + strHref);
}

// 다음 문장을 보여준다.
function nextText() {
    $(this).css("display", "none");
    $(this).unbind("click", nextText);
    parseGameData();
}

// 배경음악 처리
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

init();
