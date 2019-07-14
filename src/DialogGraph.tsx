import React from 'react';
import logo from './logo.svg';
import './App.css';
import dagreD3 from 'dagre-d3'
import * as d3 from 'd3'

// Create the input graph
const g = new dagreD3.graphlib.Graph()
  .setGraph({})
  .setDefaultEdgeLabel(() => ({}))

// Here we"re setting nodeclass, which is used by our custom drawNodes function
// below.
g.setNode('name-0', { label: "Label - 0", class: "myclass anotherclass" })
g.setNode('name-1', { label: "Label - 1", class: "myclass anotherclass" })
g.setNode('name-2', { label: "Label - 2", class: "myclass anotherclass" })
g.setNode('name-3', { label: "Label - 3", class: "myclass anotherclass" })
g.setNode('name-4', { label: "Label - 4", class: "myclass anotherclass" })
g.setNode('name-5', { label: "Label - 5", class: "myclass anotherclass" })
g.setNode('name-6', { label: "Label - 6", class: "myclass anotherclass" })
g.setNode('name-7', { label: "Label - 7", class: "myclass anotherclass" })
g.setNode('name-8', { label: "Label - 8", class: "myclass anotherclass" })
g.setNode('name-9', { label: "Label - 9", class: "myclass anotherclass" })
g.setNode('name-10', { label: "Label - 10", class: "myclass anotherclass" })
g.setNode('name-11', { label: "Label - 11", class: "myclass anotherclass" })
g.setNode('name-12', { label: "Label - 12", class: "myclass anotherclass" })
g.setNode('name-13', { label: "Label - 13", class: "myclass anotherclass" })
g.setNode('name-14', { label: "Label - 14", class: "myclass anotherclass" })

g.nodes().forEach((v) => {
  const node = g.node(v);
  // Round the corners of the nodes
  node.rx = node.ry = 5;
})

// Set up edges, no special attributes.
g.setEdge('name-3', 'name-4')
g.setEdge('name-2', 'name-3')
g.setEdge('name-1', 'name-2')
g.setEdge('name-6', 'name-7')
g.setEdge('name-5', 'name-6')
g.setEdge('name-9', 'name-10')
g.setEdge('name-8', 'name-9')
g.setEdge('name-11', 'name-12')
g.setEdge('name-8', 'name-11')
g.setEdge('name-5', 'name-8')
g.setEdge('name-1', 'name-5')
g.setEdge('name-13', 'name-14')
g.setEdge('name-1', 'name-13')
g.setEdge('name-0', 'name-1')
g.setEdge('name-3', 'name-6')
g.setEdge('name-10', 'name-12')

const App: React.FC = () => {
  React.useEffect(() => {
    // Set up an SVG group so that we can translate the final graph.
    const svg = d3.select("svg#svg-canvas")
    const svgGroup = svg.append("g")

    // Set up zoom support
    const zoom = d3.zoom()
      .on("zoom", () => {
        svgGroup.attr("transform", d3.event.transform)
      })
    svg.call(zoom as any);

    // Create the renderer
    const render = new dagreD3.render()
    // Run the renderer. This is what draws the final graph.
    render(svgGroup as any, g)

    // Center the graph
    const xCenterOffset = ((svg as any).attr("width") - g.graph().width) / 2;
    svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
    svg.attr("height", g.graph().height + 40);
  }, [])

  return (
    <div>
      <header>
        <h1>Dagre React</h1>
      </header>
      <div>
        <svg id="svg-canvas" width={960} height={600}></svg>
      </div>
    </div>
  );
}

export default App;
