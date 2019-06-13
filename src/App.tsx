import React from 'react';
import './App.css';
import { Graph } from 'react-d3-graph';

// graph payload (with minimalist structure)
const data = {
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



const App: React.FC = () => {
  const [messages, setMessages] = React.useState<string[]>([])
  const onClickClear = () => setMessages([])
  const addMessage = (message: string) => setMessages(ms => [...ms, message])
  // graph event callbacks
  const onClickGraph = function () {
    addMessage(`Clicked the graph background`);
  };

  const onClickNode = function (nodeId: unknown) {
    addMessage(`Clicked node ${nodeId}`);
  };

  const onRightClickNode = function (event: any, nodeId: any) {
    addMessage(`Right clicked node ${nodeId}`);
  };

  const onMouseOverNode = function (nodeId: any) {
    addMessage(`Mouse over node ${nodeId}`);
  };

  const onMouseOutNode = function (nodeId: any) {
    addMessage(`Mouse out node ${nodeId}`);
  };

  const onClickLink = function (source: any, target: any) {
    addMessage(`Clicked link between ${source} and ${target}`);
  };

  const onRightClickLink = function (event: any, source: any, target: any) {
    addMessage(`Right clicked link between ${source} and ${target}`);
  };

  const onMouseOverLink = function (source: any, target: any) {
    addMessage(`Mouse over in link between ${source} and ${target}`);
  };

  const onMouseOutLink = function (source: any, target: any) {
    addMessage(`Mouse out link between ${source} and ${target}`);
  };

  return (
    <div className="app">
      <header>
        Graph Header
      </header>
      <div className="graph">
        <div>
          <Graph
            id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
            data={data}
            config={myConfig}
            // onClickNode={onClickNode}
            // onRightClickNode={onRightClickNode}
            // onClickGraph={onClickGraph}
            // onClickLink={onClickLink}
            // onRightClickLink={onRightClickLink}
            // onMouseOverNode={onMouseOverNode}
            // onMouseOutNode={onMouseOutNode}
            // onMouseOverLink={onMouseOverLink}
            // onMouseOutLink={onMouseOutLink}
          />
        </div>
        <div className="commands">
          <div>
            <button onClick={onClickClear}>Clear Messages</button>
          </div>
          {messages.map(m =>
            <div>{m}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
