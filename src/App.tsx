import React from 'react';
import './App.css';
import { Graph } from 'react-d3-graph';

// graph payload (with minimalist structure)
const data1 = {
  nodes: [{ id: 'Harry' }, { id: 'Sally' }, { id: 'Alice' }],
  links: [{ source: 'Harry', target: 'Sally' }, { source: 'Harry', target: 'Alice' }]
};

const data2 = {
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
            data={data2}
            config={myConfig}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
