function is_weixin() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}
var isWeixin = is_weixin();
var winHeight = typeof window.innerHeight != 'undefined' ? window.innerHeight : document.documentElement.clientHeight;
console.log(winHeight);

function loadHtml() {
    var div = document.createElement('div');
    div.id = 'weixin-tip';
    div.innerHTML = '<p><img src="https://img.alicdn.com/imgextra/i4/668603298/TB2ZuSVgQKWBuNjy1zjXXcOypXa_!!2-martrix_bbs.png" alt="微信打开"/></p>';
    document.body.appendChild(div);
}

function loadStyleText(cssText) {
    var style = document.createElement('style');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    try {
        style.appendChild(document.createTextNode(cssText));
    } catch (e) {
        style.styleSheet.cssText = cssText; //ie9以下
    }
    var head = document.getElementsByTagName("head")[0]; //head标签之间加上style样式
    head.appendChild(style);
}
var cssText = "body{background-color: #000;} #weixin-tip img{width: 100%;}";
if (isWeixin) {
    loadHtml();
    loadStyleText(cssText);
} else {
    window.location.href = "http://ctt180.cc";
}