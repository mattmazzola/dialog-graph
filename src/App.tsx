import React from 'react';
import logo from './logo.svg';
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
    size: 120,
    highlightStrokeColor: 'blue'
  },
  link: {
    highlightColor: 'lightblue'
  }
};

// graph event callbacks
const onClickGraph = function () {
  window.alert(`Clicked the graph background`);
};

const onClickNode = function (nodeId: unknown) {
  window.alert(`Clicked node ${nodeId}`);
};

const onRightClickNode = function (event: any, nodeId: any) {
  window.alert(`Right clicked node ${nodeId}`);
};

const onMouseOverNode = function (nodeId: any) {
  window.alert(`Mouse over node ${nodeId}`);
};

const onMouseOutNode = function (nodeId: any) {
  window.alert(`Mouse out node ${nodeId}`);
};

const onClickLink = function (source: any, target: any) {
  window.alert(`Clicked link between ${source} and ${target}`);
};

const onRightClickLink = function (event: any, source: any, target: any) {
  window.alert(`Right clicked link between ${source} and ${target}`);
};

const onMouseOverLink = function (source: any, target: any) {
  window.alert(`Mouse over in link between ${source} and ${target}`);
};

const onMouseOutLink = function (source: any, target: any) {
  window.alert(`Mouse out link between ${source} and ${target}`);
};

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Graph
          id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
          data={data}
          config={myConfig}
          onClickNode={onClickNode}
          onRightClickNode={onRightClickNode}
          onClickGraph={onClickGraph}
          onClickLink={onClickLink}
          onRightClickLink={onRightClickLink}
          onMouseOverNode={onMouseOverNode}
          onMouseOutNode={onMouseOutNode}
          onMouseOverLink={onMouseOverLink}
          onMouseOutLink={onMouseOutLink}
        />
      </header>
    </div>
  );
}

export default App;
