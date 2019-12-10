import React from 'react'
import dagreD3 from 'dagre-d3'
import * as d3 from 'd3'
import uuid from 'uuid/v4'

export type Props = {
    graph: {
        nodes: {
            id: string,
            label: dagreD3.Label
        }[],
        edges: [string, string][]
    },
    width?: number,
    isZoomEnabled?: boolean,
}

const Component: React.FC<Props> = ({ graph, width = 380, isZoomEnabled }) => {
    const guid = React.useMemo(() => uuid().substring(0, 4), [])

    React.useEffect(() => {
        // Create the input graph
        const g = new dagreD3.graphlib.Graph()
            .setGraph({})
            .setDefaultEdgeLabel(() => ({}))

        // Here we're setting nodeclass, which is used by our custom drawNodes function below.
        for (const node of graph.nodes) {
            g.setNode(node.id, node.label)
        }

        g.nodes().forEach((v) => {
            const node = g.node(v)
            // Round the corners of the nodes
            node.rx = node.ry = 5
        })

        // Set up edges, no special attributes.
        for (const [sourceId, targetId] of graph.edges) {
            g.setEdge(sourceId, targetId)
        }

        // Set up an SVG group so that we can translate the final graph.
        const svg = d3.select(`svg#svg${guid}`)
        const svgGroup = svg.append("g")

        if (isZoomEnabled) {
            // Set up zoom support
            const zoom = d3.zoom()
                .on("zoom", () => {
                    svgGroup.attr("transform", d3.event.transform)
                })
            svg.call(zoom as any)
        }

        // Create the renderer
        const render = new dagreD3.render()
        // Run the renderer. This is what draws the final graph.
        render(svgGroup as any, g)

        // Center the graph
        // const xCenterOffset = ((svg as any).attr("width") - g.graph().width) / 2;
        const xCenterOffset = 20
        svgGroup.attr("transform", `translate(${xCenterOffset}, ${20})`)
        svg.attr("height", g.graph().height + 40)
    }, [graph.edges, graph.nodes, guid])

    return (
        <svg id={`svg${guid}`} width={width}></svg>
    )
}

export default Component
