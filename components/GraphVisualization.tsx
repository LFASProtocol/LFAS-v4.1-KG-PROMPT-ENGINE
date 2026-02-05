
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { KnowledgeGraph } from '../types';

interface GraphVisualizationProps {
  kg: KnowledgeGraph;
  filterTerm?: string;
}

const GraphVisualization: React.FC<GraphVisualizationProps> = ({ kg, filterTerm = '' }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !kg.nodes.length) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Create Tooltip with Tailwind styling
    const tooltip = d3.select(containerRef.current)
      .append("div")
      .attr("class", "absolute z-50 pointer-events-none bg-[#0a0a0a] border border-indigo-500/30 text-indigo-100 px-3 py-2 rounded-lg shadow-[0_4px_20px_rgba(99,102,241,0.2)] text-[10px] font-mono leading-relaxed max-w-[240px] opacity-0 transition-opacity duration-200")
      .style("top", "0px")
      .style("left", "0px");

    // D3 mutates nodes and links. Create clones to avoid issues with React state/props.
    const nodes: any[] = kg.nodes.map(d => ({ ...d }));
    
    // D3's forceLink expects 'source' and 'target' properties.
    const links: any[] = kg.edges
      .map(d => ({ ...d, source: d.from, target: d.to }))
      .filter(l => 
        nodes.some(n => n.id === l.source) && 
        nodes.some(n => n.id === l.target)
      );

    const simulation = d3.forceSimulation<any>(nodes)
      .force("link", d3.forceLink<any, any>(links).id(d => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(40));

    const g = svg.append("g");

    const link = g.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#4f46e5") // indigo-600
      .attr("stroke-opacity", (d) => {
        if (!filterTerm) return 0.4;
        const matchesSource = d.source.id.toLowerCase().includes(filterTerm.toLowerCase()) || d.source.val.toLowerCase().includes(filterTerm.toLowerCase());
        const matchesTarget = d.target.id.toLowerCase().includes(filterTerm.toLowerCase()) || d.target.val.toLowerCase().includes(filterTerm.toLowerCase());
        return (matchesSource || matchesTarget) ? 0.6 : 0.1;
      })
      .attr("stroke-width", 1.5);

    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .style("cursor", "pointer")
      .style("opacity", (d) => {
        if (!filterTerm) return 1;
        const matches = d.id.toLowerCase().includes(filterTerm.toLowerCase()) || d.val.toLowerCase().includes(filterTerm.toLowerCase());
        return matches ? 1 : 0.2;
      })
      .on("mouseover", (event, d) => {
        // Show tooltip
        tooltip
          .style("opacity", 1)
          .html(`
            <div class="text-indigo-300 font-bold border-b border-indigo-500/20 pb-1 mb-1">${d.id}</div>
            <div class="text-gray-300">${d.val}</div>
          `);
        
        // Scale up and enhance glow on hover
        d3.select(event.currentTarget).select("circle")
          .transition()
          .duration(200)
          .attr("r", 14)
          .attr("stroke-width", 3)
          .style("filter", "drop-shadow(0 0 10px rgba(165, 180, 252, 0.8))");

        d3.select(event.currentTarget).select("text")
          .transition()
          .duration(200)
          .attr("dx", 22)
          .style("fill", "#fff");
      })
      .on("mousemove", (event) => {
        const [mX, mY] = d3.pointer(event, containerRef.current);
        tooltip.style("top", (mY + 15) + "px")
          .style("left", (mX + 15) + "px");
      })
      .on("mouseout", (event, d) => {
        // Hide tooltip
        tooltip.style("opacity", 0);

        const matches = filterTerm && (d.id.toLowerCase().includes(filterTerm.toLowerCase()) || d.val.toLowerCase().includes(filterTerm.toLowerCase()));

        // Scale down and reset glow on mouse out
        d3.select(event.currentTarget).select("circle")
          .transition()
          .duration(200)
          .attr("r", 10)
          .attr("stroke-width", 2)
          .style("filter", () => {
             return (d.id === 'USER_REQUEST' || matches) ? "drop-shadow(0 0 6px rgba(165, 180, 252, 0.5))" : "none";
          });

        d3.select(event.currentTarget).select("text")
          .transition()
          .duration(200)
          .attr("dx", 15)
          .style("fill", matches ? "#fff" : "#9ca3af");
      })
      .call(d3.drag<any, any>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    node.append("circle")
      .attr("r", 10)
      .attr("fill", d => {
        const isUserRequest = d.id === 'USER_REQUEST';
        const isMatch = filterTerm && (d.id.toLowerCase().includes(filterTerm.toLowerCase()) || d.val.toLowerCase().includes(filterTerm.toLowerCase()));
        if (isMatch) return '#818cf8'; // indigo-400
        return isUserRequest ? '#6366f1' : '#111'; // indigo-500
      })
      .attr("stroke", d => {
        const isUserRequest = d.id === 'USER_REQUEST';
        const isMatch = filterTerm && (d.id.toLowerCase().includes(filterTerm.toLowerCase()) || d.val.toLowerCase().includes(filterTerm.toLowerCase()));
        if (isMatch) return '#fff';
        return isUserRequest ? '#c7d2fe' : '#6366f1'; // indigo-200 : indigo-500
      })
      .attr("stroke-width", 2)
      .style("filter", d => {
        const matches = filterTerm && (d.id.toLowerCase().includes(filterTerm.toLowerCase()) || d.val.toLowerCase().includes(filterTerm.toLowerCase()));
        return (d.id === 'USER_REQUEST' || matches) ? "drop-shadow(0 0 6px rgba(165, 180, 252, 0.5))" : "none";
      });

    node.append("text")
      .attr("dx", 15)
      .attr("dy", ".35em")
      .text(d => d.id)
      .attr("fill", (d) => {
        const matches = filterTerm && (d.id.toLowerCase().includes(filterTerm.toLowerCase()) || d.val.toLowerCase().includes(filterTerm.toLowerCase()));
        return matches ? "#fff" : "#9ca3af";
      })
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .attr("font-family", "JetBrains Mono")
      .style("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    return () => {
      simulation.stop();
      tooltip.remove();
    };

  }, [kg, filterTerm]);

  return (
    <div ref={containerRef} className="w-full h-full bg-[#080808] rounded-lg overflow-hidden border border-gray-800 relative">
      <div className="absolute top-2 left-2 text-[8px] uppercase tracking-widest text-gray-600 pointer-events-none">
        Dynamic Neural Map
      </div>
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default GraphVisualization;
