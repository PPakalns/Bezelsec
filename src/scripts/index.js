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
    constructor(cont, x, y, w, h, color=0xdddd00) {
        this.graphics = new PIXI.Graphics();
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.color = color;
        cont.addChild(this.graphics);
    }

    draw() {
        this.graphics.beginFill(this.color);
        this.graphics.drawRect(this.x, this.y, this.width, this.height);
        this.graphics.endFill();
    }

    setBounds(bounds) {
        this.x = bounds.x;
        this.y = bounds.y;
        this.width = bounds.width;
        this.height = bounds.height;
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
    constructor(cont, x1, y1, x2, y2, color = 0xFFFF00, width = 420/69, transparency = 1, offset = 0.5) {
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
        cont.addChild(this.graphics2);
        cont.addChild(this.graphics);
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
    constructor(cont, x, y, text) {
        const style = new PIXI.TextStyle({
            fontFamily: 'Verdana',
            fontSize: 36,
            fontWeight: 'bold',
            fill: '#ffffff', // gradient
            wordWrap: true,
            wordWrapWidth: 440,
        });
        this.richText = new PIXI.Text(text, style);
        this.richText.x = x;
        this.richText.y = y;
        cont.addChild(this.richText);
    }

    getBounds() {
        return this.richText.getBounds();
    }
}

class NodeComponent {
    constructor (cont, x, y, text) {
        this.c = new PIXI.Container();;;
        this.c.x = x;
        this.c.y = y;

        this.rect = new RectangleComponent(this.c, 0, 0, 1, 1);
        this.text = new TextComponent(this.c, 5, 5, text);

        let bounds = this.text.getBounds();
        bounds.x = 0;
        bounds.y = 0;
        bounds.width += 10;
        bounds.height += 10;
        this.rect.setBounds(bounds);

        cont.addChild(this.c);
    }

    draw() {
        this.rect.draw();
    }
}

let meme = new LineComponent(app.stage, 13, 69, 420, 69);
meme.draw();
let node = new NodeComponent(app.stage, 20, 30, "Lorem Ipsum");
node.draw();

