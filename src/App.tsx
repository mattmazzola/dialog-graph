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
      const firstNode = graph.getNode(data, dialog.trainDialogId)
      const otherNodes = round.scorerSteps.slice(1).map<graph.Node>(ss => {
        const data = {
          text: `${dialog.trainDialogId} ${ss.labelAction!}`
        }
        return graph.getNode(data, dialog.trainDialogId)
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
  const [data, setData] = React.useState<rd3g.IData[]>([data1])

  React.useEffect(() => {
    const graphs = dialogs.map(d => graph.createDag(
      [d],
      getNodes,
    ))

    const rd3graphs: rd3g.IData[] = graphs.map<rd3g.IData>(g => {
      const nodes = g.nodes
        .map<rd3g.INode>(n => ({
          id: n.hash,
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
    })

    setData(rd3graphs)
  }, [])

  return (
    <div className="app">
      <header>
        Graph Header
      </header>
      <div className="graph">
        <Graph
          id="graph-id09"
          data={data1}
          config={myConfig}
        />
      </div>
      {data.map((d, i) =>
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



