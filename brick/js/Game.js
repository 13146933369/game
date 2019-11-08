var Game = function (el, options) {
    this.canvas = document.getElementById(el);
    this.ctx = this.canvas.getContext("2d");
    this.options = {
        bg: options.bg,//背景
        callBack: options.callBack, //回调函数
        time: options.time, //时间
        score: options.score// 分数
    }

}
Game.prototype = {
    loadIndex: 0, //加载计数器
    allState: true, //加载状态值
    READYSTATE: 2,//游戏准备
    PLAYSTATE: 0,//游戏开始
    OVERSTATE: 1,//游戏结束
    gameTime: null, //游戏开始定时器
    hero: null,//英雄
    lastTime: 0,//时间移动
    heroTime: 0,//
    brickPool: [],//砖块缓存池
    brickShow: [], //当前显示的砖块
    gameData: {score: 0, time: 30, state: 2, scoreState: true}, //游戏状态值
    addScorePool: [],//分数数组
    scoreShow: [], //分数显示数组

    //初始化函数
    init: function (fn) {
        //画英雄
        this.hero = new Hero(this.canvas, this.ctx, {
            imgs: [getUrl(res.Hero), getUrl(res.W)],
            x: 300,
            y: 800
        })
        //画准备画面
        this.ready = new Load(this.canvas, this.ctx, {
            imgs: [getUrl(res.Ready), getUrl(res.Ready), getUrl(res.Go)],
            x: 50,
            y: 100
        })
        fn && fn()
    },
//游戏初始化函数
    gameInit: function (fn) {
        this.ctx.clearRect(0,0,this.canvas.offsetWidth,this.canvas.offsetHeight)
        this.lastTime = 0 //时间移动
        this.brickTime = 0;//创建砖块时间
        this.daddyNum = 0; //创建砖块随机数
        this.brickPool = this.brickShow.concat(this.brickPool)
        this.brickShow = [];//显示砖块数组
        this.addScorePool = this.brickShow.concat(this.scoreShow)
        this.addScorePool = [] //游戏分数单例模式判断
        this.scoreShow = [] //分数显示数组
        fn && fn

    },


//图片加载
    load: function (arr, fn) {
        var _this = this
        if (this.loadIndex == arr.length) {
            this.init(fn) //初始化函数
            this.allState = false
            return;
        }
        var img = new Image;
        img.src = arr[this.loadIndex];
        img.onload = function () {
            _this.loadIndex++;
            _this.load(arr, fn)
        }
    },
//游戏运行
    run: function () {
        var _this = this
        this.gameTime = setInterval(function () {
            switch (_this.gameData.state) {
                case _this.READYSTATE: //游戏准备
                    _this.createBg()//添加背景
                    _this.hero.draw() //画英雄
                    _this.ready.step(_this) //准备画面
                    break;
                case _this.PLAYSTATE:
                    _this.timeMOve() //时间改变
                    _this.ctx.clearRect(0, 0, _this.canvas.offsetWidth, _this.canvas.offsetHeight) //清除画布
                    _this.createBg()//添加背景
                    _this.hero.draw() //画英雄
                    _this.scoreMove(_this.scoreShow) //移动分数
                    _this.setHeroState()//改变英雄状态
                    _this.createBrickStep() //创建砖块
                    _this.brickStep(_this.brickShow)//砖块移动
                    break
                case  _this.OVERSTATE:
                    clearInterval(_this.ti)

            }
        }, 20)

    },


//创建砖块
    createBrickStep: function () {
        var curTime = new Date().getTime()
        if(curTime - this.brickTime > (Math.random()*500 + 500)){
            var brick = this.brickPool.length == 0 ? new Brick(this.canvas,this.ctx) : this.brickPool.shift()
            var style = ranStyle.call(this)
            brick.init(style)
            this.brickShow.push(brick)
            this.brickTime = curTime
        }
    },
//砖块移动
    brickStep: function (obj) {
        for(var i in obj){
            obj[i].step()
            this.checkColl(obj[i],i)
        }
    },

// 碰撞检测
    checkColl: function (obj,index) {
        // 碰撞后各个状态的效果
        var hero = this.hero
        var pool = this.brickPool
        var show = this.brickShow
        if (checkColl.call(obj,hero)) {
            //无敌状态
            if (obj.style == 3) {
                hero.state = true
                this.heroTime = new Date().getTime()
            }
            //警告
            if (obj.style == 4 && !hero.state) {
                this.gameData.state = this.OVERSTATE
                this.gameData.scoreState = false
            }
            //黑色砖块
            if (obj.style == 2) {
                this.gameData.score++
            }
            //黄色砖块
            if (obj.style == 1) {
                this.gameData.score += 10
            }
            //创建分数
            this.createScore(obj.style);
            $(this.options.score).html(this.gameData.score)
        }
        // 缓存机制
        if(checkColl.call(obj,hero) || obj.y > (hero.y + hero.img.height)){
            pool.push(show[index])
            show.splice(index,1)
        }



    },
//创建分数
    createScore : function (style) {
        if(style == 3 || style == 4)return;
        var score = this.addScorePool.length == 0 ? new AddScore(this.canvas,this.ctx) : this.addScorePool.shift()
        score.init({type : style, hero : this.hero})
        this.scoreShow.push(score)
        // console.log(this.scoreShow)
    },
    scoreMove : function (obj) {
        for(var i in obj){
            obj[i].step(this,i)
        }
    },
//改变英雄的状态
    setHeroState: function () {
        var curTime = new Date().getTime();
        if (this.hero.state && curTime - this.heroTime > 3000) {
            this.hero.state = false
        }
    },

//时间改变
    timeMOve: function () {
        var curTIme = new Date().getTime();
        if (curTIme - this.lastTime >= 1000) {
            this.gameData.time--;
            $(this.options.time).html(this.gameData.time);
            if (this.gameData.time == 0) {
                this.gameData.state == this.OVERSTATE
            }
            this.lastTime = curTIme
        }
    },
//创建背景
    createBg: function () {
        this.ctx.drawImage(this.options.bg, 0, 0)
    },

}
//添加分数
var AddScore = function (canvas,ctx) {
    var canvas = canvas,ctx = ctx;
    this.img;
    this.x;
    this.y;
    this.speed = 10
    var lastTime = 0;
    this.init = function (options) {
        this.img = getUrl(res["Score"+options.type])
        this.x = Math.min(options.hero.x + options.hero.img.width,canvas.offsetWidth - this.img.width);
        this.y = options.hero.y
    }
    this.draw = function () {
        ctx.drawImage(this.img,this.x,this.y)
    }
    this.step = function (self,index) {
        var pool = self.addScorePool
        var show = self.scoreShow
        var curTime = new Date().getTime()
        // 移动一步
        if(curTime - lastTime > 50){
            this.y -= this.speed;
            lastTime = curTime
        }
        if(this.y <= 500){
            pool.push(show[index])
            show.splice(index,1)
        }
        this.draw()
    }
}


//创建英雄
var Hero = function (canvas, ctx, options) {
    var imgs = options.imgs,
        canvas = canvas,
        ctx = ctx

    isClick = false;
    this.x = options.x;
    this.y = options.y;
    this.state = false;
    var index = 0;
    var w_img = null
    var init = function () {
        this.img = imgs[0]
        w_img = imgs[1]
        this.addClick();
    }
    this.heroInit = function () {
        isClick = false
        this.x = options.x
        this.y = options.y
        this.state = false
    }

    //画画
    this.draw = function () {
        ctx.drawImage(this.img, this.x, this.y)
    }
    //英雄移动
    this.addClick = function () {
        var _this = this;
        var initX
        canvas.addEventListener("touchstart", function (even) {
            initX = even.targetTouches[0].clientX
            var y = even.targetTouches[0].clientY
            isClick = checkHero.call(_this, initX, y)
        })
        canvas.addEventListener("touchmove", function (event) {
            if (!isClick) {
                return
            }
            var x = event.targetTouches[0].clientX - initX
            _this.step(x)
            initX = event.targetTouches[0].clientX
        })
        canvas.addEventListener("touchend", function (event) {
            isClick = false
        })

    }
    //英雄移动更新
    this.step = function (x) {
        this.x += x
        this.x = Math.max(-60, Math.min(this.x, canvas.width - this.img.width))
    }

    init.call(this)
}
//准备页面
var Load = function (canvas, ctx, options) {
    var canvas = canvas,
        ctx = ctx,
        imgs = options.imgs,
        index = 0,
        lastTime = 0;
    var init = function () {
        lastTime = new Date().getTime()
        this.img = imgs[index]
        this.x = options.x
        this.y = options.y
    }
    var draw = function () {
        this.img = imgs[index]
        ctx.drawImage(this.img, this.x, this.y)
    }
    this.step = function (self) {
        var curTime = new Date().getTime();
        if (curTime - lastTime >= 1000) {
            index++;
            lastTime = curTime
            if (index == 3) {
                self.gameData.state = self.PLAYSTATE
                return
            }
        }
        draw.call(this)
    }

    init.call(this)
}
//砖块创建
var Brick = function (canvas, ctx, options) {
    var canvas = canvas, brickCtx = ctx
    this.img;
    this.x;
    this.y;
    this.speed;
    this.time;
    this.style;
    var lastTime = 0;
    this.init = function (style) {
        this.style = style;
        this.img = getUrl(res["Enemy" + this.style])
        this.x = Math.random() * (640 - getUrl(res.Enemy1).width);
        this.y = Math.random() * 20;
        this.speed = (Math.random() * 5 + 10);
        this.time = (Math.random() * 10 + 20);
        this.draw()
    }
    this.draw = function () {
        ctx.drawImage(this.img, this.x, this.y)

    }

    this.step = function () {
        var curTime = new Date().getTime();
        //移动一步
        if (curTime - lastTime > this.time) {
            this.y += this.speed
            lastTime = curTime
        }
        this.draw()
    }
}
// 检测是否点中Hero
function checkHero(x, y) {
    if (this.x < x && this.x + this.img.width > x && y > this.y && y < this.y + this.img.height) {
        return true
    } else {
        return false
    }
}


//随机創建砖块的样式
function ranStyle() {
    var random = Math.random() * 100;
    var style = null;
    if (random >= 90 && this.daddyNum < 2) {
        style = 3;
        this.daddyNum++
    } else if (random >= 80) {
        style = 4
    } else if (random >= 70) {
        style = 1
    } else {
        style = 2
    }
    return style

}
//碰撞检测
function checkColl(obj) {
    var o = {
        x: obj.x + 60,
        y: obj.y + 57,
        w: obj.img.width - 60,
        h: obj.img.height - 118
    }
    var d = {
        x: this.x,
        y: this.y,
        w: this.img.width,
        h: this.img.height
    }
    var px, py
    px = o.x <= d.x ? d.x : o.x;
    py = o.y <= d.y ? o.y : o.y;
    // 判断点是否都在两个对象中
    if (px >= o.x && px <= o.x + o.w && py >= o.y && py <= o.y + o.h && px >= d.x && px <= d.x + d.w && py >= d.y && py <= d.y + d.h) {
        return true;
    } else {
        return false;
    }

}

function result(data) {
    if(data.score >= 60 && data.scoreState){
        //Event.times()
        Event.addTimes()
    }else{
        $(".result_bg").show()
        $(".result_yes_bg").hide()
        $(".result_no_bg").show()
        }
}
    


