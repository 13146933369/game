var game ={}
$(function () {
    //游戏初始化传值
    game = new Game("canvas",{
        bg : getUrl(res.BG),
        time : ".game_time",
        score : ".game_score",
        callback : function (data) {
            result(data)
        }
    });
    //图片加载
    game.load(g_resources,function () {
        // game.run();
    })
    if(game.gameData.state != game.READYSTATE){

    }

    //阻止默认事件
    touch.on(".game",'touchmove',function(ev){
        ev.preventDefault();
    });
    //点击页面进入加载页
    $(".index_start").click(function () {
        $(".loading").show()
        $(".game_bg").show()
        if(game.gameData.state != game.READYSTATE){
            $(".loading").hide()
            game.gameInit()
            $(".game_score").html(0)
            $(".game_time").html(30)
            $(".game_prompt").show()
        }else{
            game.load(g_resources,function () {
                $(".loading").hide()
                $(".game_prompt").show()
            })
        }
    })
    //点击游戏说明
    $(".game_prompt").click(function () {
        if(game.allState)return;
        $(".game_prompt").hide()
        game.run();
        game.gameInit()

    })



})
