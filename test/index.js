function isWX() {
    var ua = navigator.userAgent.toLowerCase();
    return ua.indexOf("micromessenger") > -1;
}

function tip() {
    var div = document.createElement("div");
    div.style.width = Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth) + "px";
    div.style.height = Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight) + "px";
    div.style.backgroundColor = "#000000";
    div.style.position = "absolute";
    div.style.opacity = 0.5;
    div.style.left = 0;
    div.style.top = 0;
    div.style.bottom = 0;
    div.style.right = 0;
    div.style.margin = "auto";
    div.id = "tip";
    div.style.zIndex = 100;

    var span = document.createElement("span");
    span.style.color = "white";
    var text = document.createTextNode("微信用户请在右上角选择“在浏览器中打开”，再选择下载应用");
    span.appendChild(text);

    div.appendChild(span);
    return div;
}

window.onload = function() {
    if (!isWX()) {
        var winHeight = typeof window.innerHeight != "undefined" ? window.innerHeight : document.documentElement.clientHeight;

        var div = tip();
        div.style.height = winHeight + "px";
        this.document.getElementsByTagName("body")[0].appendChild(div);
    }
};
