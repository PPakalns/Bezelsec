import '../styles/index.scss';
import * as PIXI from 'pixi.js-legacy';
var dagre = require('dagre');
import ex1 from '../model1.js';
import ex2 from '../model2.js';

global.WX = 1;
global.WY = 1;
global.SWX = 8;
global.SWY = 2;
global.order = 'LR';

let type = "WebGL";
if(!PIXI.utils.isWebGLSupported()){
    type = "canvas";
}

PIXI.utils.sayHello(type);

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

//Create a Pixi Application
let app = new PIXI.Application({width: WIDTH, height: HEIGHT});

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

class RectangleComponent {
    constructor(cont, x, y, w, h, color=0xdddd00, radius=20) {
        this.graphics = new PIXI.Graphics();
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.color = color;
        this.radius = radius;
        cont.addChild(this.graphics);
    }

    draw() {
        this.graphics.beginFill(this.color);
        this.graphics.drawRoundedRect(this.x, this.y, this.width, this.height, this.radius);
        this.graphics.endFill();
    }
}

class EllipseComponent {
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
        this.graphics.lineStyle(0, 0xFFFFFF, 1);
        this.graphics.beginFill(this.color, 1);
        this.graphics.drawEllipse(this.x, this.y, this.width, this.height);
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
    constructor(cont, x1, y1, x2, y2, lineStops = [], lineOffset = 0, color = 0xFFFF00, width = 420/69, transparency = 1, offset = 0.5) {
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
        this.normalizedX = x2 - x1;
        this.normalizedY = y2 - y1;
        this.length = Math.sqrt(this.normalizedX * this.normalizedX + this.normalizedY * this.normalizedY);
        this.normalizedX /= this.length;
        this.normalizedY /= this.length;
        this.lineStops = lineStops;
        if (!this.lineStops) {
            this.lineStops = [];
        }
        this.lineOffset = lineOffset;
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
        if (this.lineStops.length == 0) {
            this.graphics2.moveTo(this.x1, this.y1);
            this.graphics2.lineTo(this.x2, this.y2);
            return 0;
        } else {
            let sum = 0;
            for (let i = 0; i < this.lineStops.length; i++) {
                sum += this.lineStops[i];
            }
            let doDraw = ((Math.floor(this.offset / sum) * this.lineStops.length) % 2) == 0;
            let offsetRem = this.offset % sum;
            let p = 0;
            while (p < this.lineStops.length && this.lineStops[p] <= offsetRem) {
                offsetRem -= this.lineStops[p];
                p++;
                doDraw = !doDraw;
            }

            let taken = 0;
            while (this.length > taken) {
                let remLen = Math.min(this.length - taken, this.lineStops[p] - offsetRem);
                if (doDraw) {
                    this.graphics2.moveTo(this.x1 + this.normalizedX * taken, this.y1 + this.normalizedY * taken);
                    this.graphics2.lineTo(this.x1 + this.normalizedX * (taken + remLen), this.y1 + this.normalizedY * (taken + remLen));
                }
                doDraw = !doDraw;
                taken += remLen;
                p = (p + 1) % this.lineStops.length;
            }

            return this.offset + taken;
        }
        //this.graphics.moveTo(this.x1, this.y1);
        //this.graphics.lineTo(this.x2, this.y2);
        //this.graphics.filters.pop();
    }
}

class TextComponent {
    constructor(cont, x, y, text, color = "#000000", size = 54) {
        const style = new PIXI.TextStyle({
            fontFamily: 'Verdana',
            fontSize: size,
            fontWeight: 'bold',
            fill: color, // gradient
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
    constructor (cont, x, y, text, shape='rectangle', color=0xdddd00) {
        this.c = new PIXI.Container();
        this.c.x = x;
        this.c.y = y;
        let tmpc = new PIXI.Container();
        this.text = new TextComponent(tmpc, 5, 5, text);
        let bounds = this.text.getBounds();

        if (shape == 'rectangle')
        {
            this.shape = new RectangleComponent(this.c, 0, 0, bounds.width + 10, bounds.height + 10, color, 0);
        }
        else
            this.shape = new EllipseComponent(this.c, bounds.width / 2, bounds.height / 2, bounds.width / 1.5, bounds.height / 1.5, color);

        this.c.addChild(tmpc);
        cont.addChild(this.c);
    }

    draw() {
        this.shape.draw();
    }

    getBounds() {
        return this.c.getBounds();
    }
}

let graph = ex1;

function alterGeometryForBezels(graph, screens, padding, pos, size, appSize) {
    let sortedNodes = [];
    let sortedLabels = [];
    for (let k in graph.nodes) {
        sortedNodes.push(k);
    }
    for (let i = 0; i < graph.edges.length; i++) {
        if (graph.edges[i].label) {
            sortedLabels.push(i);
        }
    };

    sortedNodes.sort((a, b) => {
        return (graph.nodes[a][pos] - graph.nodes[a][size] / 2) - (graph.nodes[b][pos] - graph.nodes[a][size] / 2);
    });
    sortedLabels.sort((a, b) => {
        return (graph.edges[a][pos] - graph.edges[a][size] / 2) - (graph.edges[b][pos] - graph.edges[b][size] / 2);
    });

    let offset = 0;
    let i = 0;
    let j = 0;

    while (i < sortedNodes.length && j < sortedLabels.length) {
        let k = sortedNodes[i];
        let node = graph.nodes[k];

        let l = sortedLabels[j];
        let label = graph.edges[l];

        if ((label[pos] - label[size] / 2) < (node[pos] - node[size] / 2)) {
            label[pos] += offset;
            let endX = label[pos] + label[size] / 2;
            let screenStart = Math.floor((label[pos] - label[size] / 2 - padding) * screens / appSize);
            let screenEnd = Math.floor((endX + padding) * screens / appSize);
            if (screenStart != screenEnd) {
                let dif = screenEnd * appSize / screens - (label[pos] - label[size] / 2 - padding);
                label[pos] += dif;
                offset += dif;
            }
            label["off" + pos] = offset;
            j++;
        } else {
            node[pos] += offset;
            let endX = node[pos] + node[size] / 2;
            let screenStart = Math.floor((node[pos] - node[size] / 2 - padding) * screens / appSize);
            let screenEnd = Math.floor((endX + padding) * screens / appSize);
            if (screenStart != screenEnd) {
                let dif = screenEnd * appSize / screens - (node[pos] - node[size] / 2 - padding);
                node[pos] += dif;
                offset += dif;
            }
            node["off" + pos] = offset;
            i++;
        }
    }
    while (i < sortedNodes.length) {
        let k = sortedNodes[i];
        let node = graph.nodes[k];

        node[pos] += offset;
        let endX = node[pos] + node[size] / 2;
        let screenStart = Math.floor((node[pos] - node[size] / 2 - padding) * screens / appSize);
        let screenEnd = Math.floor((endX + padding) * screens / appSize);
        if (screenStart != screenEnd) {
            let dif = screenEnd * appSize / screens - (node[pos] - node[size] / 2 - padding);
            node[pos] += dif;
            offset += dif;
        }
        node["off" + pos] = offset;
        i++;
    }

    while (j < sortedLabels.length) {
        let l = sortedLabels[j];
        let label = graph.edges[l];

        label[pos] += offset;
        let endX = label[pos] + label[size] / 2;
        let screenStart = Math.floor((label[pos] - label[size] / 2 - padding) * screens / appSize);
        let screenEnd = Math.floor((endX + padding) * screens / appSize);
        if (screenStart != screenEnd) {
            let dif = screenEnd * appSize / screens - (label[pos] - label[size] / 2 - padding);
            label[pos] += dif;
            offset += dif;
        }
        label["off" + pos] = offset;
        j++;
    }
}

function preprocess(graph){
    for (let node_key in graph['nodes'])
    {
        let node = graph['nodes'][node_key];
        let c = new PIXI.Container();
        new NodeComponent(c, 0, 0, node.label, node['shape'] || 'rectangle');
        node.width = c.getBounds().width;
        node.height = c.getBounds().height;
    }
    let g = new dagre.graphlib.Graph();
    g.setGraph({
        nodesep: 100,
        edgesep: 30,
        ranksep: 80,
        rankdir: global.order,
    });
    g.setDefaultEdgeLabel(function() {
        return {};
    });

    for (let k in graph.nodes) {
        g.setNode(k, graph.nodes[k]);
    }

    for (let i = 0; i < graph.edges.length; i++) {
        graph.edges[i].labelpos = "c";
        if (graph.edges[i].label) {
            graph.edges[i].x = 0;
            graph.edges[i].y = 0;
            let tmpc = new PIXI.Container();
            let text = new TextComponent(tmpc, 0, 0, graph.edges[i].label);
            let bounds = text.getBounds();
            graph.edges[i].width = bounds.width;
            graph.edges[i].height = bounds.height;
        } else {
            graph.edges[i].x = graph.edges[i].y = graph.edges[i].width = graph.edges[i].height = 0;
        }
        g.setEdge(graph.edges[i].from, graph.edges[i].to, graph.edges[i]);
    }

    dagre.layout(g);

    alterGeometryForBezels(graph, global.SWX, 75, "x", "width", WIDTH);
    alterGeometryForBezels(graph, global.SWY, 75, "y", "height", HEIGHT);
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
        let textMeme = new TextComponent(cont, e.x, e.y, e.label, "#DDDD00", 36);
        //textMeme.draw();
        let offset = 0;
        for (let i = 1; i < e.points.length; i++)
        {
            let last = e.points[i - 1];
            let nxt = e.points[i];
            let meme = new LineComponent(cont, last.x, last.y, nxt.x, nxt.y, e.dashes, offset);
            offset = meme.draw();
        }
        let last2 = e.points[e.points.length - 2];
        let last = e.points[e.points.length - 1];
        let dirX = last.x - last2.x;
        let dirY = last.y - last2.y;
        let len = Math.sqrt(dirX * dirX + dirY * dirY);
        dirX /= len;
        dirY /= len;
        let angle = 150 / 180 * Math.PI;
        let sin = Math.sin(angle);
        let cos = Math.cos(angle);
        let meme2 = new LineComponent(cont, last.x, last.y, last.x + (dirX * cos - dirY * sin) * 30, last.y + (dirX * sin + dirY * cos) * 30);
        meme2.draw();
        let meme3 = new LineComponent(cont, last.x, last.y, last.x + (dirX * cos + dirY * sin) * 30, last.y + (-dirX * sin + dirY * cos) * 30);
        meme3.draw();
    }

    for (let k in graph.nodes) {
        let node_dict = GetXYKey(graph, k);
        let node = new NodeComponent(cont, node_dict.x - node_dict.width / 2, node_dict.y - node_dict.height / 2, 
                                     node_dict.label, node_dict.shape || 'rectangle', node_dict.color || 0xdddd00);
        node.draw();
    }
}

function do_graph_processing(cont, graph)
{
    function getScreenCoords(screenIdx)
    {
        return {x: screenIdx % global.WX, y: Math.floor(screenIdx / global.WX)};
    }

    function getIdx(pos)
    {
        return pos.y * global.WX + pos.x;
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
            if (edge.from != key && edge.to != key)
                continue;
            let okey = (edge.from == key ? edge.to : edge.from);
            let onode = graph.nodes[okey];
            let onodepos = getScreenCoords(onode.screen);
            score -= 3;
            score += Math.abs(onodepos.x - pos.x) + Math.abs(onodepos.y - pos.y) * 3;
        }
        return score;
    }

    for (let key in graph.nodes)
    {
        graph.nodes[key].screen = 0;
    }

    let iter = 0;
    const TOTAL = 50000;
    while (true)
    {
        if (iter > TOTAL)
            break;
        for (let key in graph.nodes)
        {
            iter += 1;
            if (iter > TOTAL)
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
                    if (newpos.x < 0 || newpos.x >= global.WX || newpos.y < 0 || newpos.y >= global.WY)
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

    let subgraph_cont = new PIXI.Container();
    for (let i = 0; i < global.WX * global.WY; i++)
    {
        let localcont = new PIXI.Container();
        let spos = getScreenCoords(i);
        localcont.x = spos.x * Math.floor(WIDTH / global.WX);
        localcont.y = spos.y * Math.floor(HEIGHT / global.WY);

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
            if (graph.nodes[edge.from].screen != i ||
                graph.nodes[edge.to].screen != i)
            {
                continue;
            }
            subgraph.edges.push(edge);
        }
        draw_graph(localcont, subgraph);
        console.log(subgraph);
        subgraph_cont.addChild(localcont);
    }

    function getNodePos(key)
    {
        let enode = graph.nodes[key];
        let espos = getScreenCoords(enode.screen);
        return {
            x: enode.x + espos.x * Math.floor(WIDTH / global.WX),
            y: enode.y + espos.y * Math.floor(HEIGHT / global.WY)
        };
    }

    for (let edge of graph.edges)
    {
        if (graph.nodes[edge.from].screen == graph.nodes[edge.to].screen)
        {
            continue;
        }
        let e0 = getNodePos(edge.from);
        let e1 = getNodePos(edge.to);
        let line = new LineComponent(cont, e0.x, e0.y, e1.x, e1.y);
        line.draw();
    }
    cont.addChild(subgraph_cont);
}

let cont = new PIXI.Container();
app.stage.addChild(cont);
do_graph_processing(cont, graph);

global.do_graph_processing = function(graph) {
    app.stage.removeChild(cont);
    app.stage.addChild(cont = new PIXI.Container());
    do_graph_processing(cont, graph);
};

global.graphs = {
    ex1: ex1,
    ex2: ex2
};

console.log(graph);
