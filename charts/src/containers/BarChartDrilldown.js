import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const initialData = [
    { category: 'A', value: 10, subData: [{ category: 'A1', value: 5 }, { category: 'A2', value: 5 }] },
    { category: 'B', value: 15, subData: [{ category: 'B1', value: 7 }, { category: 'B2', value: 8 }] },
    { category: 'C', value: 8, subData: [] },
];

const BarChart = ({ data, updateData }) => {
    const svgRef = useRef();

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const width = 400;
        const height = 300;
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };

        svg.selectAll('*').remove();

        const x = d3.scaleBand()
            .domain(data.map(d => d.category))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        svg.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', d => x(d.category))
            .attr('y', d => y(d.value))
            .attr('width', x.bandwidth())
            .attr('height', d => y(0) - y(d.value))
            .attr('fill', (d, i) => color(i))
            .on('click', (event, value) => {
                console.log("Event val: ", value);
                if (value.subData) {
                    updateData(value.subData)
                }
            })
            .transition()
            .duration(2000)

        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x));

        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(5));

        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height - 5)
            .attr('text-anchor', 'middle')
            .text('Categories');

        svg.append('text')
            .attr('x', -height / 2)
            .attr('y', 10)
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)')
            .text('Values');
    }, [data]);

    return (
        <div>
            <svg ref={svgRef} width={400} height={300}></svg>
        </div>
    );
};

const App = () => {
    const [currentData, setCurrentData] = useState(initialData);

    return (
        <div>
            <BarChart data={currentData} updateData={setCurrentData} />
        </div>
    );
};

export default App;
