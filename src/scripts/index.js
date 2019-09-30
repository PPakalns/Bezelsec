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

class RectangleComponent {
    constructor(x, y, w, h, color=0xdddd00) {
        this.graphics = new PIXI.Graphics();
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.color = color;
        app.stage.addChild(this.graphics);
    }

    draw() {
        this.graphics.beginFill(this.color);
        this.graphics.drawRect(this.x, this.y, this.width, this.height);
        this.graphics.endFill();
    }
}

const FRAGMENT_SHADER_LineComponent_Lighting = `
precision highp float;

varying vec2 vTextureCoord;

uniform vec4 inputSize;
uniform vec4 outputFrame;
uniform float time;

void main() {
  vec2 screenPos = vTextureCoord * inputSize.xy + outputFrame.xy;

  if (length(mouse - screenPos) < 25.0) {
      gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0) * 0.7; //yellow circle, alpha=0.7
  } else {
      gl_FragColor = vec4( sin(time), (mouse.xy - outputFrame.xy) / outputFrame.zw, 1.0) * 0.5; // blend with underlying image, alpha=0.5
  }
}
`;

class LineComponent {
    constructor(x1, y1, x2, y2, color = 0xFFFF00, width = 420/69, transparency = 1, offset = 0.5) {
        this.graphics = new PIXI.Graphics();
        this.graphics2 = new PIXI.Graphics();
        this.blur = new PIXI.filters.BlurFilter();
        this.blur.blur = width * 2;
        this.blur.quality = 10;
        this.graphics.filters = [this.blur];
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.color = color;
        this.width = width;
        this.transparency = transparency;
        this.offset = offset;
        app.stage.addChild(this.graphics2);
        app.stage.addChild(this.graphics);
    }

    draw() {
        //this.graphics.filters.push(this.blur);
        this.graphics.lineStyle(this.width * 2, this.color, this.transparency, this.offset);
        this.graphics2.lineStyle(this.width, this.color, this.transparency, this.offset);
        this.graphics2.moveTo(this.x1, this.y1);
        this.graphics2.lineTo(this.x2, this.y2);
        this.graphics.moveTo(this.x1, this.y1);
        this.graphics.lineTo(this.x2, this.y2);
        //this.graphics.filters.pop();
    }
}

class TextComponent {
    constructor(x, y, text) {
        this.graphics = new PIXI.Graphics()
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontWeight: 'bold',
            fill: '#ffffff', // gradient
            wordWrap: true,
            wordWrapWidth: 440,
        });
        this.richText = new PIXI.Text(text, style);
        this.richText.x = x;
        this.richText.y = y;
        app.stage.addChild(this.richText);
    }
}

let rect = new RectangleComponent(10, 20, 300, 300);
rect.draw();
let meme = new LineComponent(13, 69, 420, 69);
meme.draw();
let text = new TextComponent(20, 30, "Lorem Ipsum");