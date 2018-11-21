let rainbowElements = document.getElementsByClassName("rainbow_element");

const circleDegrees = 360;
let colorIncrement = circleDegrees / rainbowElements.length;
let color = Math.random() * circleDegrees;

function setRainbowElementColors(){
    for (var i = 0; i < rainbowElements.length; i++){
        var modifiedStyle = "hsl(" + color + ", 100%, 90%)";
        rainbowElements[i].style.backgroundColor = modifiedStyle;
        color += colorIncrement;
    }
}