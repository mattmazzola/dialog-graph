import React from 'react'
import './App.css'
import * as graph from './graph'
import * as clGraph from './clGraph'
import clPizzaModel from './demoPizzaOrder.json'
import * as CLM from '@conversationlearner/models'
import DialogGraph, { Props as GraphProps } from './DagreGraph'
import { Graph } from 'react-d3-graph'
import CustomNode from './Node'

const createDagreGraphFromGraph = (g: graph.Graph, getLabel: (n: graph.Node) => string): GraphProps => {
  const nodes = g.nodes.map(n => (
    {
      id: n.id,
      label: {
        label: getLabel(n),
        class: 'myclass anotherclass'
      },
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
// const separatedDialogDagreGraphs = separatedDialogGraphs.map(g => createDagreGraphFromGraph(g, getLabelFromNode))

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

// graph payload (with minimalist structure)
const data = {
  links: [
    {
      source: 0,
      target: 2,
    },
    {
      source: 0,
      target: 3,
    },
    {
      source: 0,
      target: 4,
    },
    {
      source: 3,
      target: 4,
    },
  ],
  nodes: [
    {
      id: 0,
      name: "Mary",
      gender: "female",
      hasCar: false,
      hasBike: false,
    },
    {
      id: 2,
      name: "Roy",
      gender: "male",
      hasCar: false,
      hasBike: true,
    },
    {
      id: 3,
      name: "Frank",
      gender: "male",
      hasCar: true,
      hasBike: true,
    },
    {
      id: 4,
      name: "Melanie",
      gender: "female",
      hasCar: true,
      hasBike: false,
    },
  ],
}

// the graph configuration, you only need to pass down properties
// that you want to override, otherwise default ones will be used
const defaultConfig = {
  automaticRearrangeAfterDropNode: false,
  collapsible: false,
  directed: true,
  focusAnimationDuration: 0.75,
  focusZoom: 1,
  height: 800,
  highlightDegree: 1,
  highlightOpacity: 1,
  linkHighlightBehavior: true,
  maxZoom: 8,
  minZoom: 0.1,
  nodeHighlightBehavior: true,
  panAndZoom: false,
  staticGraph: false,
  staticGraphWithDragAndDrop: false,
  width: 1200,
  d3: {
      alphaTarget: 0.25,
      gravity: 50,
      linkLength: 400,
      linkStrength: 0.25,
  },
  node: {
      color: "#d3d3d3",
      fontColor: "black",
      fontSize: 8,
      fontWeight: "normal",
      highlightColor: "SAME",
      highlightFontSize: 8,
      highlightFontWeight: "normal",
      highlightStrokeColor: "SAME",
      highlightStrokeWidth: "SAME",
      labelProperty: "id",
      mouseCursor: "pointer",
      opacity: 1,
      renderLabel: false,
      size: 1500,
      strokeColor: "none",
      strokeWidth: 1.5,
      svg: "",
      symbolType: "circle",
      viewGenerator: (node: any) => <CustomNode person={node} />,
  },
  link: {
      color: "#d3d3d3",
      fontColor: "black",
      fontSize: 8,
      fontWeight: "normal",
      // FIXME: highlightColor default should be "SAME", breaking change
      highlightColor: "#d3d3d3",
      highlightFontSize: 8,
      highlightFontWeight: "normal",
      labelProperty: "name",
      mouseCursor: "pointer",
      opacity: 1,
      renderLabel: false,
      semanticStrokeWidth: false,
      strokeWidth: 1.5,
      markerHeight: 6,
      markerWidth: 6,
      type: "STRAIGHT",
  },
}

const myConfig = {
  automaticRearrangeAfterDropNode: false,
  collapsible: false,
  height: 400,
  highlightDegree: 1,
  highlightOpacity: 0.2,
  linkHighlightBehavior: true,
  maxZoom: 8,
  minZoom: 0.1,
  nodeHighlightBehavior: true,
  panAndZoom: false,
  staticGraph: false,
  staticGraphWithDragAndDrop: true,
  width: 800,
  node: {
    color: "#d3d3d3",
    fontColor: "black",
    fontSize: 12,
    fontWeight: "normal",
    highlightColor: "red",
    highlightFontSize: 12,
    highlightFontWeight: "bold",
    highlightStrokeColor: "SAME",
    highlightStrokeWidth: 1.5,
    labelProperty: "name",
    mouseCursor: "pointer",
    opacity: 1,
    renderLabel: false,
    size: 700,
    strokeColor: "none",
    strokeWidth: 1.5,
    svg: "",
    symbolType: "circle",
    viewGenerator: (node: any) => <CustomNode person={node} />,
  },
  link: {
    color: "#d3d3d3",
    opacity: 1,
    semanticStrokeWidth: false,
    strokeWidth: 4,
    highlightColor: "blue",
  },
}

const App: React.FC = () => {
  return (
    <div className="app">
      <header>
        Graph Header
      </header>

      <h2>React-D3-Graph</h2>
      <div className="graph">
        <Graph
          id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
          data={data}
          config={defaultConfig}
        />
      </div>

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



