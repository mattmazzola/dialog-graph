import React from 'react'
import './App.css'
import * as graph from './graph'
import clPizzaModel from './demoPizzaOrder.json'
import * as CLM from '@conversationlearner/models'
import DialogGraph, { Props as GraphProps } from './DialogGraph'

const getNodes = (dialog: CLM.TrainDialog): graph.Node[] => {
  let nodeNumber = 0
  const nodes = dialog.rounds
    .map((round, i) => {
      // Convert each round to nodes

      // First node is extrator + scorer
      const extractorText = round.extractorStep.textVariations
        .map(tv => tv.text)
        .join('\n    ')

      const scoreStepsText = round.scorerSteps
        .map(ss => ss.labelAction!)
        .join('\n    ')

      const data = {
        text: `Node Index: ${nodeNumber++}
Extractor Step:
    ${extractorText}
Scorer Step:
    ${scoreStepsText}`
      }

      const node = graph.getNode(data, data.text)

      return node
    })

  return nodes
}

const createDagreGraphFromGraph = (g: graph.Graph): GraphProps => {
  const nodes = g.nodes.map(n => (
    {
      id: n.id,
      label: {
        label: n.data.text,
        class: 'myclass anotherclass'
      }
    }
  ))

  const edges: any[] = g.edges.map(e => [e.vertexA.id, e.vertexB.id])

  return {
    graph: {
      nodes,
      edges,
    }
  }
}

const dialogs = clPizzaModel.trainDialogs as any as CLM.TrainDialog[]
const graphs = dialogs.map(d => {
  const g = graph.createDagFromNodes(
    [d],
    getNodes,
  )
  return {
    genericGraph: g,
    dagreGraph: createDagreGraphFromGraph(g)
  }
})

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

      <h2>Generated Dagre Graphs D3</h2>
      <div className="graphs">
        {graphs.map((graph, i) =>
          <div key={i} className="graph">
            <DialogGraph graph={graph.dagreGraph.graph} />
          </div>
        )}
      </div>

      <h1>Static Dialog Graph</h1>
      <div className="graph">
        <DialogGraph graph={graphProps.graph} width={600} />
      </div>
    </div>
  );
}

export default App;



