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
        id: '0',
        label: { label: "Label - 0", class: "myclass anotherclass" },
      }, {
        id: '1',
        label: { label: "Label - 1", class: "myclass anotherclass" },
      }, {
        id: '2',
        label: { label: "Label - 2", class: "myclass anotherclass" },
      }, {
        id: '3',
        label: { label: "Label - 3", class: "myclass anotherclass" },
      }, {
        id: '4',
        label: { label: "Label - 4", class: "myclass anotherclass" },
      }, {
        id: '5',
        label: { label: "Label - 5", class: "myclass anotherclass" },
      }, {
        id: '6',
        label: { label: "Label - 6", class: "myclass anotherclass" },
      }, {
        id: '7',
        label: { label: "Label - 7", class: "myclass anotherclass" },
      }, {
        id: '8',
        label: { label: "Label - 8", class: "myclass anotherclass" },
      }, {
        id: '9',
        label: { label: "Label - 9", class: "myclass anotherclass" },
      }, {
        id: '10',
        label: { label: "Label - 10", class: "myclass anotherclass" },
      }, {
        id: '11',
        label: { label: "Label - 11", class: "myclass anotherclass" },
      }, {
        id: '12',
        label: { label: "Label - 12", class: "myclass anotherclass" },
      }, {
        id: '13',
        label: { label: "Label - 13", class: "myclass anotherclass" },
      }, {
        id: '14',
        label: { label: "Label - 14", class: "myclass anotherclass" },
      }, {
        id: '15',
        label: { label: "Label - 15", class: "myclass anotherclass" },
      },
    ],
    edges: [
      ['2', '3'],
      ['1', '2'],
      ['6', '7'],
      ['5', '6'],
      ['9', '10'],
      ['8', '9'],
      ['11', '12'],
      ['8', '11'],
      ['5', '8'],
      ['1', '5'],
      ['13', '14'],
      ['1', '13'],
      ['0', '1'],
      ['3', '6'],
      ['10', '12'],
      ['12','4'],
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



