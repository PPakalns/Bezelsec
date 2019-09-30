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
let EDGE_CNT = 50;

for (let i = 0; i < NODE_CNT; i++)
{
    graph.nodes[i + ''] = {
        label: i + ''
    };
}

for (let i = 0; i < EDGE_CNT; i++)
{
    graph.edges.push([getRandomInt(0, i), i]);
}

export default graph;