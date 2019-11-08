var res = {
    "Hero" : "./images/game_people.png",
    "Enemy1" : "./images/game_prop_1.png",
    "Enemy2" : "./images/game_prop_2.png",
    "Enemy3" : "./images/game_prop_3.png",
    "Enemy4" : "./images/game_prop_4.png",
    "BG" : "./images/game_bg.jpg",
    "Score2" : "./images/game_addScore.png",
    "Score1" : "./images/game_addScore_1.png",
    "Ready" : "./images/game_ready.png",
    "Go" : "./images/game_go.png",
    "W" : "./images/game_w.png",
    "click" : "./images/game_prompt.png"
}
var g_resources = [];
for(var i in res){
    g_resources.push(res[i]);
}
function getUrl(res) {
    var img = new Image()
    img.src = res;
    return img
}