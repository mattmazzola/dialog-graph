import React from 'react'
import './App.css'
import * as graph from './graph'
import * as clGraph from './clGraph'
import clPizzaModel from './demoPizzaOrder.json'
import * as CLM from '@conversationlearner/models'
import DialogGraph, { Props as GraphProps } from './DagreGraph'

const createDagreGraphFromGraph = (g: graph.Graph, getLabel: (n: graph.Node) => string): GraphProps => {
  const nodes = g.nodes.map(n => (
    {
      id: n.id,
      label: {
        label: getLabel(n),
        class: 'myclass anotherclass'
      }
    }
  ))

  const edges: [string, string][] = g.edges.map(e => [e.vertexA.id, e.vertexB.id])

  return {
    graph: {
      nodes,
      edges,
    }
  }
}

const getLabelFromNode = clGraph.getLabelFromNode(clPizzaModel)
const dialogs = clPizzaModel.trainDialogs as any as CLM.TrainDialog[]

// Multiple Graphs - Each graph represent single dialog
const separatedDialogGraphs = dialogs.map(d => graph.createDagFromNodes([d], clGraph.getNodes, clGraph.mergeNodeData))
const separatedDialogDagreGraphs = separatedDialogGraphs.map(g => createDagreGraphFromGraph(g, getLabelFromNode))

// Single Graph - Represent Multiple Dialogs
const combinedDialogGraphs = graph.combineGraphs(separatedDialogGraphs)
const combinedDialogsDagreGraph = createDagreGraphFromGraph(combinedDialogGraphs, getLabelFromNode)

console.log(`
  ####################################
  ##### Start of Merging Graphs ######
  ####################################
`)
// Combine all dialogs in to single graph - Requires merging of nodes based on hash
const allDialogsGraph = graph.createDagFromNodes(dialogs, clGraph.getNodes, clGraph.mergeNodeData)
const dagreDialogsGraph = createDagreGraphFromGraph(allDialogsGraph, getLabelFromNode)

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
      }, {
        id: '16',
        label: { label: "Label - 16", class: "myclass anotherclass" },
      }, {
        id: '17',
        label: { label: "Label - 17", class: "myclass anotherclass" },
      }, {
        id: '18',
        label: { label: "Label - 18", class: "myclass anotherclass" },
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
      ['12', '4'],
      ['15', '16'],
      ['16', '17'],
      ['17', '18'],
    ]
  }
}

const App: React.FC = () => {
  return (
    <div className="app">
      <header>
        Graph Header
      </header>

      {/* <h2>Separate Graph per Dialog</h2>
      <p>Each dialog is a graph</p>
      <div className="graphs">
        {separatedDialogDagreGraphs.map((graph, i) =>
          <div key={i} className="graph">
            <DialogGraph graph={graph.graph} />
          </div>
        )}
      </div> */}

      <h2>Single Graph - Separate Dialogs</h2>
      <div className="graph">
        <DialogGraph graph={combinedDialogsDagreGraph.graph} width={2700} />
      </div>

      <h2>Combine Dialogs into Large Graph</h2>
      <div className="graph">
        <DialogGraph graph={dagreDialogsGraph.graph} width={1700} />
      </div>

      <h1>Static Dialog Graph</h1>
      <div className="graph">
        <DialogGraph graph={graphProps.graph} width={1700} />
      </div>
    </div>
  )
}

export default App



