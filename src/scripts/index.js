import '../styles/index.scss';
import * as PIXI from 'pixi.js-legacy';
var dagre = require('dagre');

const WX = 8;
const WY = 2;

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
        //this.graphics = new PIXI.Graphics();
        this.graphics2 = new PIXI.Graphics();
        //this.blur = new PIXI.filters.BlurFilter();
        //this.blur.blur = width * 2;
        //this.blur.quality = 10;
        //this.graphics.filters = [this.blur];
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.color = color;
        this.width = width;
        this.transparency = transparency;
        this.offset = offset;
        cont.addChild(this.graphics2);
        //cont.addChild(this.graphics);
    }

    draw() {
        //this.graphics.filters.push(this.blur);
        //this.graphics.lineStyle(this.width * 2, this.color, this.transparency, this.offset);
        this.graphics2.lineStyle(this.width, this.color, this.transparency, this.offset);
        this.graphics2.moveTo(this.x1, this.y1);
        this.graphics2.lineTo(this.x2, this.y2);
        //this.graphics.moveTo(this.x1, this.y1);
        //this.graphics.lineTo(this.x2, this.y2);
        //this.graphics.filters.pop();
    }
}

class TextComponent {
    constructor(cont, x, y, text) {
        const style = new PIXI.TextStyle({
            fontFamily: 'Verdana',
            fontSize: 54,
            fontWeight: 'bold',
            fill: '#000000', // gradient
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

    getBounds() {
        return this.c.getBounds();
    }
}

let graph = {
    nodes: {
        'a' : {
            label: 'Lorem Ipsum'

        },
        'b' : {
            label: 'Color sit ammet'
        },
        'c' : {
            label: 'Lorem Ipsum'

        },
        'd' : {
            label: 'Color sit ammet'
        },
        'e' : {
            label: 'Lorem Ipsum'

        },
        'f' : {
            label: 'Color sit ammet'
        }
    },
    edges : [
        ['a', 'b'],
        ['a', 'c'],
        ['a', 'd'],
        ['a', 'e'],
        ['a', 'f'],
    ]
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

let NODE_CNT = 100;

for (let i = 0; i < NODE_CNT; i++)
{
    graph.nodes[i + ''] = {
        label: i + ''
    };
}

for (let i = 0; i < NODE_CNT; i++)
{
    graph.edges.push([getRandomInt(0, NODE_CNT), getRandomInt(0, NODE_CNT)]);
}

function delatGovno(graph, screens, padding, pos, size, windowSize) {
    let sortedNodes = [];
    for (var k in graph.nodes) {
        sortedNodes.push(k);
    }

    sortedNodes.sort((a, b) => {
        return (graph.nodes[a][pos] - graph.nodes[a][size] / 2) - (graph.nodes[b][pos] - graph.nodes[a][size] / 2);
    });

    let offset = 0;

    for (let i = 0; i < sortedNodes.length; i++) {
        let k = sortedNodes[i];
        let node = graph.nodes[k];
        node[pos] += offset;
        let endX = node[pos] + node[size] / 2;
        let screenStart = Math.floor((node[pos] - node[size] / 2 - padding) * screens / windowSize);
        let screenEnd = Math.floor((endX + padding) * screens / windowSize);
        if (screenStart != screenEnd) {
            let dif = screenEnd * windowSize / screens - (node[pos] - node[size] / 2 - padding);
            node[pos] += dif;
            offset += dif;
        }
        node["off" + pos] = offset;
    }
}

function preprocess(graph){
    for (let node_key in graph['nodes'])
    {
        let node = graph['nodes'][node_key];
        let c = new PIXI.Container();
        new NodeComponent(c, 0, 0, node.label);
        node.width = c.getBounds().width;
        node.height = c.getBounds().height;
    }
    let g = new dagre.graphlib.Graph();
    g.setGraph({
        nodesep: 100,
        edgesep: 30,
        ranksep: 80,
        rankdir: 'LR',
    });
    g.setDefaultEdgeLabel(function() {
        return {};
    });

    for (let k in graph.nodes) {
        g.setNode(k, graph.nodes[k]);
    }

    for (let i = 0; i < graph.edges.length; i++) {
        g.setEdge(graph.edges[i][0], graph.edges[i][1]);
    }

    dagre.layout(g);

    delatGovno(graph, WX, 75, "x", "width", window.innerWidth);
    delatGovno(graph, WY, 75, "y", "height", window.innerHeight);
    return g;
}

function draw_graph(cont, graph)
{
    let dagre_g = preprocess(graph);

    function GetXYKey(graph, name)
    {
        return graph.nodes[name];
    }

    for (let edge of dagre_g.edges()){
        let e = dagre_g.edge(edge);
        for (let i = 0; i < e.points.length; i++)
        {
            let mult = (e.points.length - 1 - i) / (e.points.length - 1);
            e.points[i].x += graph.nodes[edge.v].offx * mult + graph.nodes[edge.w].offx * (1 - mult);
            e.points[i].y += graph.nodes[edge.v].offy * mult + graph.nodes[edge.w].offy * (1 - mult);
        }
        for (let i = 1; i < e.points.length; i++)
        {
            let last = e.points[i - 1];
            let nxt = e.points[i];
            let meme = new LineComponent(cont, last.x, last.y, nxt.x, nxt.y);
            meme.draw();
        }
    }

    for (let k in graph.nodes) {
        let xy = GetXYKey(graph, k);
        let node = new NodeComponent(cont, xy.x - xy.width / 2, xy.y - xy.height / 2, xy.label);
        node.draw();
    }
}

function do_graph_processing(cont, graph)
{
    function getScreenCoords(screenIdx)
    {
        return {x: screenIdx % WX, y: Math.floor(screenIdx / WX)};
    }

    function getIdx(pos)
    {
        return pos.y * WX + pos.x;
    }

    function calcScore(key, pos)
    {
        let score = 0;
        let thisidx = getIdx(pos);
        for (let okey in graph.nodes)
        {
            if (okey == key)
                continue;
            let node = graph.nodes[okey];
            if (thisidx == node.screen)
                score += 3;
        }

        for (let edge of graph.edges)
        {
            if (edge[0] != key && edge[1] != key)
                continue;
            let okey = (edge[0] == key ? edge[1] : edge[0]);
            let onode = graph.nodes[okey];
            let onodepos = getScreenCoords(onode.screen);
            score -= 3;
            score += Math.abs(onodepos.x - pos.x) + Math.abs(onodepos.y - pos.y);
        }
        return score;
    }

    for (let key in graph.nodes)
    {
        graph.nodes[key].screen = 0;
    }

    let iter = 0;
    while (true)
    {
        if (iter > 1000)
            break;
        for (let key in graph.nodes)
        {
            iter += 1;
            if (iter > 1000)
                break;
            let idx = graph.nodes[key].screen;
            let mainpos = getScreenCoords(idx);
            let bestscore = calcScore(key, mainpos);
            let bestpos = mainpos;

            for (let dx of [-1, 0, 1])
            {
                for (let dy of [-1, 0, 1])
                {
                    let newpos = {x: mainpos.x + dx, y: mainpos.y + dy};
                    if (newpos.x < 0 || newpos.x >= WX || newpos.y < 0 || newpos.y >= WY)
                    {
                        continue;
                    }
                    let score = calcScore(key, newpos);
                    if (score < bestscore)
                    {
                        bestscore = score;
                        bestpos = newpos;
                    }
                }
            }
            graph.nodes[key].screen = getIdx(bestpos);
        }
    }

    for (let i = 0; i < WX * WY; i++)
    {
        let localcont = new PIXI.Container();
        let spos = getScreenCoords(i);
        localcont.x = spos.x * Math.floor(window.innerWidth / WX);
        localcont.y = spos.y * Math.floor(window.innerHeight / WY);

        let subgraph = {
            nodes: {},
            edges: [],
        };

        for (let key in graph.nodes)
        {
            if (graph.nodes[key].screen != i)
                continue;
            subgraph.nodes[key] = graph.nodes[key];
        }

        for (let edge of graph.edges)
        {
            if (graph.nodes[edge[0]].screen != i ||
                graph.nodes[edge[1]].screen != i)
            {
                continue;
            }
            subgraph.edges.push(edge);
        }
        draw_graph(localcont, subgraph);
        console.log(subgraph);
        cont.addChild(localcont);
    }
}


let cont = new PIXI.Container();
app.stage.addChild(cont);
do_graph_processing(cont, graph);

console.log(graph);
