var rainbowElements = document.getElementsByClassName("rainbow_element");
var colorIncrement = 360 / rainbowElements.length;
var color = Math.random() * 360;

function setRainbowElementColors(){
    for (var i = 0; i < rainbowElements.length; i++){
        var modifiedStyle = "hsl(" + color + ", 100%, 90%)";
        rainbowElements[i].style.backgroundColor = modifiedStyle;
        color += colorIncrement;
    }
}