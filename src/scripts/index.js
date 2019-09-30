import '../styles/index.scss';
import * as PIXI from 'pixi.js';

console.log("TEST");

let type = "WebGL";
if(!PIXI.utils.isWebGLSupported()){
    type = "canvas";
}

PIXI.utils.sayHello(type);

//Create a Pixi Application
let app = new PIXI.Application({width: window.innerWidth, height: window.innerHeight});

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

const graphics = new PIXI.Graphics();

// Rectangle
graphics.beginFill(0xDE3249);
graphics.drawRect(50, 50, 100, 100);
graphics.endFill();

graphics.lineStyle(69, 0x1337FF, 1, 0.5);
graphics.moveTo(69, 420);
graphics.lineTo(420, 420);

app.stage.addChild(graphics);
