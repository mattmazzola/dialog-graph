import React from 'react';
import './App.css';
import { Graph } from 'react-d3-graph';
import * as rd3g from './reactd3types'
import * as graph from './graph'
import clPizzaModel from './demoPizzaOrder.json'
import * as CLM from '@conversationlearner/models'
import uuid from 'uuid/v4'

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

const dialogs = clPizzaModel.trainDialogs as any as CLM.TrainDialog[]

const getNodes = (dialog: CLM.TrainDialog): graph.Node[] => {
  const nodes = dialog.rounds
    .flatMap(round => {
      // Convert each round to nodes

      // First node is extrator + scorer
      const extractorText = round.extractorStep.textVariations.map(tv => tv.text).join(' ')
      const firstScorerStep = round.scorerSteps[0]
      const firstScorerText = firstScorerStep
        ? firstScorerStep.labelAction!
        : ''

      const data = {
        text: `${dialog.trainDialogId} ${extractorText} ${firstScorerText}`
      }
      const firstNode: graph.Node = graph.getNode(data)
      const otherNodes = round.scorerSteps.slice(1).map<graph.Node>(ss => {
        const data = {
          text: `${dialog.trainDialogId} ${ss.labelAction!}`
        }
        return graph.getNode(data)
      })

      const roundNodes: graph.Node[] = [
        firstNode,
        ...otherNodes,
      ]

      return roundNodes
    })

  return nodes
}

const App: React.FC = () => {
  const [data3, setData3] = React.useState<rd3g.IData>(data2)

  React.useEffect(() => {
    const dag = graph.createDag(
      dialogs,
      getNodes,
    )

    const rd3graph: rd3g.IData = {
      nodes: dag.nodes
        .map<rd3g.INode>(n => ({
          id: n.hash,
        })),
      links: dag.edges
        .map<rd3g.ILink>(e => ({
          source: e.vertexA.hash,
          target: e.vertexB.hash,
        }))
    }

    setData3(rd3graph)
  }, [])

  return (
    <div className="app">
      <header>
        Graph Header
      </header>
      <div className="graph">
        <div>
          <Graph
            id="graph-id1"
            data={data1}
            config={myConfig}
          />
        </div>
      </div>
      <div className="graph">
        <div>
          <Graph
            id="graph-id2"
            data={data3}
            config={myConfig}
          />
        </div>
      </div>
    </div>
  );
}

export default App;



