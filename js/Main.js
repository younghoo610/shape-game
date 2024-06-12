$(function() {
    _thisPage.onload();
    $(".answerCanvas").on("click", function(){
        $(".answerCanvas.active").attr("class", "answerCanvas");
        $(this).attr("class", "answerCanvas active");
    });

    $("#checkbtn").on("click",function(){
        var alertString = ''
        var score = 0;
        
        $(".question").each(function(index, item){
            var a = _thisPage.compareAnswer(index);
            score += a;
            alertString +=  (index+1) + "번은 "+_thisPage.compareScoreToString(a)+"\n";
            if(a != 0){
                var canvas = $("#q"+index + " .answerCanvas")[0];
                var ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        });
        alert(alertString);
        if (score == 0){
            var q = _thisPage.makeQuest();
            _thisPage.quest = q[0];
            _thisPage.anwer = q[1];
            _thisPage.clearQuest();
            _thisPage.drawQuest(_thisPage.quest);
        
            $(".answerCanvas").on("click", function(){
                $(".answerCanvas.active").attr("class", "answerCanvas");
                $(this).attr("class", "answerCanvas active");
            });
        }
    });
});

var _thisPage = {
    shape: ['smile','rectangle', 'triangle', 'cross', 'circle', 'heart'],
    color: ['red', 'orange', 'yellow', 'green', 'blue', 'darkblue', 'purple', 'black'],
    anwer : [['smile', 'red'], ['heart','red'], ['smile','green'], ['smile','green']],
    quest : [],

    onload : function(){
        _thisPage.setShapePalette();
        _thisPage.setColorPalette();
        var q = _thisPage.makeQuest();
        _thisPage.quest = q[0];
        _thisPage.anwer = q[1];
        _thisPage.drawQuest(_thisPage.quest);
    },

    setShapePalette: function(){
        $.each(_thisPage.shape, function(index, item){
            $("#shapePalette").append('<a href="#none" onclick="_thisPage.selectShape('+"'"+item+"'"+')"><canvas class="canvas"></canvas></a>')
            _thisPage.drawCanvas("#shapePalette canvas:eq("+index+")",item);
        });
    },

    setColorPalette: function(){
        $.each(_thisPage.color, function(index, item){
            $("#colorPalette").append('<a href="#none"  class="colorBtn '+item+'" onclick="_thisPage.selectColor('+"'"+item+"'"+')">'+item.toUpperCase()+'</a>')
        });
    },

    selectShape: function(shape){
        var color = $(".answerCanvas.active").data('color')
        $(".answerCanvas.active").data('shape', shape)
        _thisPage.drawCanvas(".answerCanvas.active", shape, color);
    },

    selectColor: function(color){
        var shape = $(".answerCanvas.active").data('shape')
        $(".answerCanvas.active").data('color', color)
        if(shape === undefined){
            alert("도형을 골라주세요!");
            return;
        }
        _thisPage.drawCanvas(".answerCanvas.active", shape, color);

    },

    drawQuest: function(quest){
        $.each(quest, function(index, item){
            $(".questContain").append('<span>문제'+(index+1)+'</span><div class="question" id="q'+index+'"></div>');
            $.each(item, function(i, v){
                $("#q"+index).append('<canvas class="questCanvas"></canvas>')
                _thisPage.drawCanvas("#q"+(index)+" canvas:eq("+i+")", _thisPage.shape[v[0]], _thisPage.color[v[1]])
            });
            if (index == 0){
                $("#q"+index).append('<a href="#none"><canvas class="answerCanvas active"></canvas></a>')
            }
            else{
                $("#q"+index).append('<a href="#none"><canvas class="answerCanvas"></canvas></a>')
            }
        });
    },

    clearQuest: function(){
        $(".questContain").empty();
    },

    makeQuest: function(questCount = 4, len = 6, MaxCycleSize = 4, minCycleSize = 2){
        var result = [Array.from({length:questCount}, () => Array.from(Array(len), ()=>[0,0])), Array.from({length:questCount}, () => [0,0])];

        var maxShape = _thisPage.shape.length
        var maxColor = _thisPage.color.length

        for(var j = 0; j < questCount; j++){
            var cycleSize = Math.floor(Math.random() * (MaxCycleSize-(minCycleSize-1)))+minCycleSize;
            var cycle = Array.from({length:cycleSize}, () => [-1,-1]);
            for (var l = 0; l < cycleSize; l++){
                var a = []
                do{
                    var a = [Math.floor(Math.random() * maxShape), Math.floor(Math.random() * maxColor)]
                }while(_thisPage.arraysHasEqual(cycle, a))
                cycle[l] = a;
            } 

            var count = 0;
            for(var i = 0; i < len; i++){
                result[0][j][i] = cycle[count]
                count++;
                if(count > cycle.length - 1){
                    count = 0;
                }
            }
            result[1][j] = cycle[count]
        }
        return result;
    },

    arraysHasEqual : function(arr, comp) {
        var result = false;
        $.each(arr, function(index, item){
            if (result) {
                return false
            }
            if (item[0] == comp[0] && item[1] == comp[1]){
                result = true;
            }
        })
        return result;
    },
    
    compareAnswer: function(questNum){
        var realAnswer = _thisPage.anwer[questNum];
        var myAnswer = $("#q"+(questNum)+" .answerCanvas")

        if (_thisPage.shape[realAnswer[0]] == myAnswer.data("shape")){
            if(_thisPage.color[realAnswer[1]] == myAnswer.data("color")){
                result = 0
            }
            else{
                result = 1
            }
        }
        else{
            if(_thisPage.color[realAnswer[1]] == myAnswer.data("color")){
                result = 2
            }
            else{
                result = 3
            }
        }
        return result
    },
    compareScoreToString: function(score){
        switch(score){
            case 0:
                return "정답입니다!"
            case 1:
                return "모양은 맞았습니다!"
            case 2:
                return "색은 맞았습니다!"
            case 3:
                return "다시 시도해주세요!"
        }
    },

    drawCanvas: function(canvasID, shape, color='white'){
        var canvas = $(canvasID)[0]
        if(canvas.getContext){
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            switch(shape){
                case 'smile': 
                    ctx.arc(150, 75, 50, 0, Math.PI * 2, true);
                    ctx.moveTo(125, 75);
                    ctx.arc(150, 75, 25, 0, Math.PI, false);
                    ctx.moveTo(132.5, 55);
                    ctx.arc(125, 55, 7.5, 0, Math.PI * 2, true);
                    ctx.moveTo(182.5, 55);
                    ctx.arc(175, 55, 7.5, 0, Math.PI * 2, true);
                    break;
                case 'rectangle':
                    ctx.rect(100, 25, 100, 100);
                    break;
                case 'cross':
                    ctx.moveTo(125, 125);
                    ctx.lineTo(175, 125);
                    ctx.lineTo(175, 100);
                    ctx.lineTo(200, 100);
                    ctx.lineTo(200, 50);
                    ctx.lineTo(175, 50);
                    ctx.lineTo(175, 25);
                    ctx.lineTo(125, 25);
                    ctx.lineTo(125, 50);
                    ctx.lineTo(100, 50);
                    ctx.lineTo(100, 100);
                    ctx.lineTo(125, 100);
                    ctx.lineTo(125, 125);
                    break
                case 'triangle':
                    ctx.moveTo(150, 25);
                    ctx.lineTo(75, 125);
                    ctx.lineTo(225, 125);
                    ctx.lineTo(150, 25);
                    break
                case 'heart':                
                    var scale = 4.5
                    ctx.moveTo(150, 50);
                    ctx.bezierCurveTo(150, 50 - 3 * scale, 150 - 5 * scale, 50 - 5 * scale, 150 - 10 * scale, 50 - 5 * scale);
                    ctx.bezierCurveTo(150 - 15 * scale, 50 - 5 * scale, 150 - 15 * scale, 50 + 2.5 * scale, 150 - 15 * scale, 50 + 2.5 * scale);
                    ctx.bezierCurveTo(150 - 15 * scale, 50 + 10 * scale, 150, 50 + 17 * scale, 150, 50 + 20 * scale);
                    ctx.bezierCurveTo(150, 50 + 17 * scale, 150 + 10 * scale, 50 + 10 * scale, 150 + 10 * scale, 50 + 2.5 * scale);
                    ctx.bezierCurveTo(150 + 10 * scale, 50 + 2.5 * scale, 150 + 10 * scale, 50 - 5 * scale, 150 + 5 * scale, 50 - 5 * scale);
                    ctx.bezierCurveTo(150 + 3 * scale, 50 - 5 * scale, 150, 50 - 3 * scale, 150, 50);
                    break;

                default:
                    ctx.arc(150, 75, 50, 0, Math.PI * 2, true);
                    break;
            }
            ctx.fillStyle = color;
            ctx.fill ();
            ctx.stroke();
        }
        else{
            console.error("캔버스를 지원히지 않는 브라우저입니다.")
        }
    }
}
