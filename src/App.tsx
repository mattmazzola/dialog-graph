import React from 'react';
import './App.css';
import { Graph } from 'react-d3-graph';
import * as rd3g from './reactd3types'
import * as graph from './graph'
import clPizzaModel from './demoPizzaOrder.json'
import * as CLM from '@conversationlearner/models'

// graph payload (with minimalist structure)
const data1: rd3g.IData = {
  nodes: [{ id: 'Harry' }, { id: 'Sally' }, { id: 'Alice' }],
  links: [{ source: 'Harry', target: 'Sally' }, { source: 'Harry', target: 'Alice' }]
};

const data2: rd3g.IData = {
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

const createDataFromGraph = (g: graph.Graph): rd3g.IData => {
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
    data: createDataFromGraph(g)
  }
})

const rd3graphs: rd3g.IData[] = graphs.map<rd3g.IData>(g => createDataFromGraph(g.graph))

const App: React.FC = () => {
  return (
    <div className="app">
      <header>
        Graph Header
      </header>
      <div className="graphs">
        {graphs.map((g, i) => {
          return (
            <div className="fake-graph">
              <div>Graph:</div>
              <div className="fake">

                {g.graph.nodes.map(n =>
                  <div>{n.data.text}</div>)}
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
        <div className="graph">
          <Graph
            id={`graph-id${i}`}
            data={d}
            config={myConfig}
          />
        </div>
      )}

    </div>
  );
}

export default App;



