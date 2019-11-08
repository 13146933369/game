var game = null
var indexBg = ["/images/index_bg.jpg"]
var prizeBg = [
    "/images/prize_no_bg.png",
    "/images/prize_no_main_bg.png",
    "/images/prize_yes_1.png",
    "/images/prize_yes_2.png",
    "/images/prize_yes_3.png",
    "/images/prize_yes_bg.png",
    "/images/msg_add.png",
    "/images/msg_bg.png",
    "/images/msg_btn.png",
    "/images/msg_name.png",
    "/images/msg_tel.png"
]
var resultBg = [
    "/images/result_no_bg.png",
    "/images/result_yes_bg.png",
    "/images/result_btn_again.png",
    "/images/result_btn_draw.png"
]
var ruleBg = [
    "/images/rule_bg.png",
    "/images/rule_close.png",
    "/images/rule_gan.png",
    "/images/rule_lunbo.png"
]
var drawBg = [
    "/images/draw_back.png",
    "/images/draw_brick_1.png",
    "/images/draw_brick_2.png",
    "/images/draw_brick_3.png",
    "/images/draw_brick_btoken.png",
    "/images/draw_hammer.png",
    "/images/draw_hammer_num_bg.png",
    "/images/draw_main_back.png",
    "/images/draw_no_again.png",
    "/images/draw_prize.png",
    "/images/draw_result_no_again.jpg",
    "/images/draw_result_no_bg.png",
    "/images/draw_result_yes_bg.png",
    "/images/draw_seclct.png"
]
var Event = {
    init : function()
    {
        this.reward();
        //this.times();
        this.record();
        this.addGame();
        this.addInfo();
    },
    reward : function()
    {
        $('.result_btn_draw').bind({
            click : function()
            {
                W.showload()
                W.load(drawBg, function () {
                    W.hideload()
                    $("body>div").hide()
                    $(".draw_bg").show()
                })

            }
        })
    },
    times : function () {
        Api.times([],function(res){
            if(res.status == 1030){
                $(".result_bg").show()
                $(".result_yes_bg").show()
                $(".result_no_bg").hide()
                if(res.data == 0){
                    $(".result_btn_draw").hide()
                    $(".result_btn_again2").css("left","170px")
                }else{
                    $(".result_btn_draw").show()
                    $(".result_btn_again2").css("left","300px")
                    $(".draw_hammer_num").html(res.data)
                }
            }
        })
    },
    data:true,
    addTimes : function () {
        if(this.data){
            Api.addTimes([], function (res) {
                $(".result_bg").show()
                $(".result_yes_bg").show()
                $(".result_no_bg").hide()
                if(res.status == 1050 || res.status == 1051){
                    if(res.data>0){
                        $(".result_btn_draw").show()
                        //$(".result_btn_again2").css("left","300px")
                        $(".result_btn_back1").hide()
                        $(".draw_hammer_num").html(res.data)
                    }else{
                        $(".result_btn_draw").hide()
                        $(".result_btn_back1").show()
                        //$(".result_btn_again2").css("left","170px")
                    }
                }else{
                    W.showAlert("添加失败,请重新尝试")
                }
                if(res.status == 1051 && res.data == 0){
                    Event.data = false;
                }
            })
        }else{
            $(".result_bg").show()
            $(".result_yes_bg").show()
            $(".result_no_bg").hide()
            $(".result_btn_draw").hide()
            $(".result_btn_back1").show()
        }
    },
    record : function()
    {
        $('.index_prize').bind({
            click : function()
            {
                $(".loading").show()
                W.load(prizeBg, function () {
                    Api.record([],function(res){
                        $(".loading").hide()
                        var data = {1041 : ".prize_no_bg" ,1040 : ".prize_yes_bg"}
                        $(".prize_bg").show()
                        $(".prize_bg>div").hide()
                        $(data[res["status"]]).show()
                        if(res.data.level){
                            $(".prize_list>img").attr("src","/images/prize_yes_"+res.data.level+".png")
                        }
                        if(!res.data.mobile ){
                            $(".prize_msg").show()
                            $(".prize_again").css("left","280px")

                        }else{
                            $(".prize_msg").hide()
                            $(".prize_again").css("left","170px")
                        }
                    })
                })

            }
        })
    },
    addInfo : function()
    {
        $(".msg_btn").click(function () {
            var name = $("input[name = username]").val()
            var tele = $("input[name = telephone]").val()
            var add = $("#address").val()
            if(name){
                if(/^1[34578]\d{9}$/.test(tele)){
                    if(add){
                        Api.addInfo({name:name,mobile:tele,address:add} , function(res){
                            //show(res);
                            var data = {1050 :"更新用户信息成功",1051:"请18秒后重试",1052:"用户名为空",1053:"电话号码为空",1054:"地址为空",1055:"已填写信息"}
                            if(res.status == 1050){
                                $(".msg_bg").hide()
                                $(".prize_msg").hide();
                                $(".draw_msg").hide();
                                $(".prize_again").css("left","170px")
                                $(".draw_again2").css("left","170px")
                                W.showAlert("提交成功")
                            }else{
                                W.showAlert(data[res.status])
                            }
                        })
                    }else{
                        W.showAlert("地址不能为空")
                    }
                }else{
                    W.showAlert("手机号码不正确")
                }
            }else{
                W.showAlert("名字不能为空")
            }
        })
    },
    addGame : function () {

    }
};

window.onload = function () {
    Event.init()
    W.init()
    $(".index_start,.prize_start,.prize_again,.result_btn_again2,.result_btn_again1,.draw_again,.draw_again1,.draw_again2").click(function () {
        if(active == 10){
            W.showAlert("活动未开始")
            return
        }
        if(active == 11){
            W.showAlert("活动已结束")
            return
        }
        $("body>div").hide()
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
    $('.musicSwitch').click(function () {
        var el = document.getElementById("music")
        var state = el.paused;
        if(state){
            el.play()
            $(this).find("img").attr("src","/images/music_play.png")
        }else{
            el.pause()
            $(this).find("img").attr("src","/images/music_pause.png")

        }
    })
    $(".index_rule").click(function () {
        W.showload()
        W.load(ruleBg, function () {
            W.hideload()
            $(".rule_bg").show()
        })
    })
    $(".result_btn_back,.draw_back,.game_back,.draw_main_back,.result_btn_back1").click(function () {
        game.ti && clearInterval(game.ti)
        $("body>div").hide()
        $('.index_bg').show()
    })
    $(".rule_close").click(function () {
        $(".rule_bg").hide()
    })
    $(".prize_close").click(function () {
        $(".prize_bg").hide()
    })
    $(".draw_close").click(function () {
        if( W.rewardNum  == 0){
            $("body>div").hide()
            $('.index_bg').show()
        }
        $(".draw_result").hide()
    })
    $(".prize_msg,.draw_msg").click(function () {
        $(".msg_bg").show()
    })
    $(".public_close").click(function () {
        $(".public_alert").hide()
    })
    $(".msg_close").click(function () {
        $(".msg_bg").hide()
    })
    $(".draw_brick").click(function () {
        var value = parseInt($(".draw_hammer_num").html())
        if(value<=0){
            W.showAlert("今天的抽奖次数用尽，明天再试哦~")
            return
        }
        var top = parseInt($(this).css("top"))
        var left = parseInt($(this).css("left"))
        W.showHammer(this,top,left)
    })
    $(".game_prompt").click(function () {
        if(game.allState)return;
        $(".game_prompt").hide()
        game.run()
    })
    touch.on(".game_bg",'touchmove',function(ev){
        ev.preventDefault();
    });
}
function result(data) {
    W.showload()
    W.load(resultBg, function () {
        W.hideload()
        if(data.score >= 60 && data.scoreState){
            //Event.times()
            Event.addTimes()
        }else{
            $(".result_bg").show()
            $(".result_yes_bg").hide()
            $(".result_no_bg").show()
        }
    })
}
var Api= (function(){
    var Prize = {
        reward : function(data , call)
        {
            request('/prize/reward',data,call);
        },
        times : function(data ,call)
        {
            request('/prize/times',data,call);
        },
        record : function(data ,call)
        {
            request('/prize/record',data,call);
        },
        addTimes : function(data ,call)
        {
            request('/prize/addTimes',data,call);
        },
        addInfo : function(data,call)
        {
            request('/prize/addInfo',data , call);
        }
    }
    function request(url , data , callback)
    {
        $(".loading").show()
        $.ajax({url : url,data : data,type : 'POST',dataType : 'json', success : function (res) {
            $(".loading").hide()
            if(res.status == 10){
                W.showAlert("活动未开始")
                return
            }
            if(res.status == 11){
                W.showAlert("活动已结束")
                return
            }
            callback(res)
        }});
    }
    return Prize
})()

var W = {
        init : function () {
            this.load(indexBg, function () {
                $(".load").hide()
                this.prize()
            })
        },
        prize : function () {
            $(".draw_prize").click(function () {
                if(!W.hammerState)return
                $('.index_prize').click()
            })
        },
        rewardNum:null,
        hammerState : true,
        loadIndex : 0 ,
        loadState : true,
        showload: function () {
            $(".loading").show()
        },
        hideload: function () {
            $(".loading").hide()
        },
        load : function (arr,fn) {
            if(this.loadState){
                this.loadIndex = 0
            }
            this.loadState = false
            var _this = this
            if(this.loadIndex == arr.length){
                this.loadState = true
                fn.call(this)
                return;
            }
            var img = new Image;
            img.src = arr[this.loadIndex];
            img.onload=function(){
                _this.loadIndex++;
                _this.load(arr,fn);
            }
        },
        showAlert: function (msg) {
            $('.public_alert').show()
            $(".public_alert p").html(msg)
        },
        showHammer : function (self,top,left) {
            var _this = this
            if(this.hammerState){
                this.hammerState = !this.hammerState
                $('.draw_brick_select').show().css({
                    top: top -30 + "px",
                    left: left - 34+ "px"
                })
                $(".draw_hammer").show().css({
                    top:top +"px",
                    left:left+ 160+"px"
                }).rotate({
                    angle:50,
                    duration:500,
                    animateTo:0,
                    callback:function(){
                        $(self).hide()
                        $('.draw_brick_select').hide()
                        $(".draw_broken").show().css({
                            top:top + 50+"px",
                            left:left-5+"px"
                        })
                        setTimeout(function(){
                            // $(".draw_result").show()
                            Api.reward([],function(res){
                                var data = {1023 : ".draw_result_no",1024 : ".draw_result_no",1022:".draw_result_no",1021:".draw_result_no",1020:".draw_result_yes"}
                                $(".draw_result").show()
                                $(".draw_hammer").hide()
                                $(".draw_brick_select").hide()
                                $(".draw_result>div").hide()
                                $(".draw_close").show()
                                $(".draw_broken").hide()
                                $(".draw_brick").show()
                                var value = parseInt($(".draw_hammer_num").html())
                                W.rewardNum = --value
                                $(".draw_hammer_num").html(W.rewardNum)
                                $(data[res.status]).show()
                                res.data && $(".draw_list>img").attr("src","/images/prize_yes_"+res.data+".png")
                                _this.hammerState = true
                            });
                        },500)
                    }
                });
            }
        }

}