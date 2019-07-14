import React from 'react';
import './App.css';
import { Graph } from 'react-d3-graph';
import * as rd3g from './reactd3types'
import * as graph from './graph'
import clPizzaModel from './demoPizzaOrder.json'
import * as CLM from '@conversationlearner/models'
import DialogGraph, { Props as GraphProps } from './DialogGraph'
import * as dagreD3 from 'dagre-d3'

// graph payload (with minimalist structure)
const data1: rd3g.IData = {
  nodes: [{ id: 'Harry' }, { id: 'Sally' }, { id: 'Alice' }],
  links: [{ source: 'Harry', target: 'Sally' }, { source: 'Harry', target: 'Alice' }]
};

// the graph configuration, you only need to pass down properties
// that you want to override, otherwise default ones will be used
const myConfig = {
  nodeHighlightBehavior: true,
  node: {
    color: 'lightgreen',
    size: 300,
    highlightStrokeColor: 'blue'
  },
  link: {
    highlightColor: 'lightblue'
  }
};


const getNodes = (dialog: CLM.TrainDialog): graph.Node[] => {
  let nodeNumber = 0
  const nodes = dialog.rounds
    .flatMap((round, i) => {
      // Convert each round to nodes

      // First node is extrator + scorer
      const extractorText = round.extractorStep.textVariations
        .map(tv => tv.text)
        .join(' ')
      const firstScorerStep = round.scorerSteps[0]
      const firstScorerText = firstScorerStep
        ? firstScorerStep.labelAction!
        : ''

      const data = {
        text: `${nodeNumber++} ${firstScorerText} ${extractorText} `
      }
      const firstNode = graph.getNode(data, data.text)
      const otherNodes = round.scorerSteps
        .slice(1)
        .map<graph.Node>(ss => {
          const data = {
            text: `${nodeNumber++} ${dialog.trainDialogId} ${ss.labelAction!}`
          }
          return graph.getNode(data, data.text)
        })

      const roundNodes: graph.Node[] = [
        firstNode,
        ...otherNodes,
      ]

      return roundNodes
    })

  return nodes
}

const createReactD3GraphDataFromGraph = (g: graph.Graph): rd3g.IData => {
  const nodes = g.nodes
    .map<rd3g.INode>(n => ({
      id: n.hash,
      data: n.data,
      size: 1000,
      fontSize: 300,
      symbolType: "star",
      labelProperty: 'labelProperty'
    }))

  const links = g.edges
    .map<rd3g.ILink>(e => ({
      source: e.vertexA.hash,
      target: e.vertexB.hash,
    }))

  return {
    nodes,
    links,
  }
}

const dialogs = clPizzaModel.trainDialogs as any as CLM.TrainDialog[]
const graphs = dialogs.map(d => {
  const g = graph.createDagFromNodes(
    [d],
    getNodes,
  )
  return {
    graph: g,
    data: createReactD3GraphDataFromGraph(g)
  }
})

const createDagreGraphFromGraph  = (g: graph.Graph): GraphProps => {
  const nodes: any[] = []
  const edges: any[] = []

  return {
    graph: {
      nodes,
      edges,
    }
  }
}

const rd3graphs = graphs.map(g => createReactD3GraphDataFromGraph(g.graph))
const dagreD3graphs = graphs.map(g => createDagreGraphFromGraph(g.graph))

const graphProps: GraphProps = {
  graph: {
    nodes: [
      {
        id: 'name-0',
        label: { label: "Label - 0", class: "myclass anotherclass" },
      }, {
        id: 'name-1',
        label: { label: "Label - 1", class: "myclass anotherclass" },
      }, {
        id: 'name-2',
        label: { label: "Label - 2", class: "myclass anotherclass" },
      }, {
        id: 'name-3',
        label: { label: "Label - 3", class: "myclass anotherclass" },
      }, {
        id: 'name-4',
        label: { label: "Label - 4", class: "myclass anotherclass" },
      }, {
        id: 'name-5',
        label: { label: "Label - 5", class: "myclass anotherclass" },
      }, {
        id: 'name-6',
        label: { label: "Label - 6", class: "myclass anotherclass" },
      }, {
        id: 'name-7',
        label: { label: "Label - 7", class: "myclass anotherclass" },
      }, {
        id: 'name-8',
        label: { label: "Label - 8", class: "myclass anotherclass" },
      }, {
        id: 'name-9',
        label: { label: "Label - 9", class: "myclass anotherclass" },
      }, {
        id: 'name-10',
        label: { label: "Label - 10", class: "myclass anotherclass" },
      }, {
        id: 'name-11',
        label: { label: "Label - 11", class: "myclass anotherclass" },
      }, {
        id: 'name-12',
        label: { label: "Label - 12", class: "myclass anotherclass" },
      }, {
        id: 'name-13',
        label: { label: "Label - 13", class: "myclass anotherclass" },
      }, {
        id: 'name-14',
        label: { label: "Label - 14", class: "myclass anotherclass" },
      }, {
        id: 'name-15',
        label: { label: "Label - 15", class: "myclass anotherclass" },
      },
    ],
    edges: [
      ['name-2', 'name-3'],
      ['name-1', 'name-2'],
      ['name-6', 'name-7'],
      ['name-5', 'name-6'],
      ['name-9', 'name-10'],
      ['name-8', 'name-9'],
      ['name-11', 'name-12'],
      ['name-8', 'name-11'],
      ['name-5', 'name-8'],
      ['name-1', 'name-5'],
      ['name-13', 'name-14'],
      ['name-1', 'name-13'],
      ['name-0', 'name-1'],
      ['name-3', 'name-6'],
      ['name-10', 'name-12'],
    ]
  }
}

const App: React.FC = () => {
  return (
    <div className="app">
      <header>
        Graph Header
      </header>
      <div className="graphs">
        {graphs.map((g, i) => {
          return (
            <div key ={i} className="fake-graph">
              <div>Graph:</div>
              <div className="fake">

                {g.graph.nodes.map((n, j) =>
                  <div key={j}>{n.data.text}</div>)}
              </div>
              <div className="actual">
                <Graph
                  id={`graph-pair-${i}`}
                  data={g.data}
                  config={myConfig}
                />
              </div>
            </div>
          )
        })}
      </div>
      <div className="graph">
        <Graph
          id="graph-id09"
          data={data1}
          config={myConfig}
        />
      </div>
      {rd3graphs.map((d, i) =>
        <div key={i} className="graph">
          <Graph
            id={`graph-id${i}`}
            data={d}
            config={myConfig}
          />
        </div>
      )}

      {/* <h2>Generated Dagre Graphs D3</h2>
      {dagreD3graphs.map((graph, i) =>
          <DialogGraph key={i} graph={graph.graph} />
      )} */}

      <h1>Static Dialog Graph</h1>
      <DialogGraph graph={graphProps.graph} />
    </div>
  );
}

export default App;



