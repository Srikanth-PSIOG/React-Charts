import React, { useState, useEffect, useRef } from 'react';
import { select, axisBottom, axisLeft, scaleLinear, scaleBand, max, scaleOrdinal, schemeCategory10 } from 'd3';
import { Button } from '@mui/material';

const initialData = [
    {
        category: 'A', value: 10,
        subData: [
            {
                category: 'A1', value: 5,
                subData: [
                    { category: 'aA1', value: 2 },
                    { category: 'aA2', value: 3 }
                ]
            },
            { category: 'A2', value: 5 }
        ]
    },
    { category: 'B', value: 15, subData: [{ category: 'B1', value: 7 }, { category: 'B2', value: 8 }] },
    { category: 'C', value: 8, subData: [] },
];

const BarChart = () => {
    const [history, setHistory] = useState([initialData]);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const svgRef = useRef();

    useEffect(() => {
        const svg = select(svgRef.current);
        const width = 400;
        const height = 300;
        const margin = { top: 20, right: 30, bottom: 30, left: 60 };

        const maxAllLevels = max(history.flat(), (d) => d.value);

        const x = scaleBand()
            .domain(history[history.length - 1].map((d) => d.category))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const y = scaleLinear()
            .domain([0, maxAllLevels]) 
            .nice()
            .range([height - margin.bottom, margin.top]);

        svg.select('.y-axis').remove(); 
        svg
            .append('g')
            .attr('class', 'y-axis')
            .attr('transform', `translate(${margin.left},0)`)
            .call(axisLeft(y).ticks(5)); 

        const color = scaleOrdinal(schemeCategory10);

        svg.selectAll('.bar').remove();

        svg.selectAll('.bar')
            .data(history[history.length - 1])
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', (d) => x(d.category))
            .attr('y', height - margin.bottom) 
            .attr('width', x.bandwidth())
            .attr('height', 0) 
            .attr('fill', (d, i) => color(i))
            .on('click', (event, value) => {
                if (value.subData) {
                    setHistory((prevState) => [...prevState, value.subData]);
                }
            })
            .transition() 
            .duration(500)
            .attr('y', (d) => y(d.value)) 
            .attr('height', (d) => height - margin.bottom - y(d.value)); 

        svg.select('.x-axis').remove(); 
        svg
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(axisBottom(x));

        svg.select('.x-label').remove();
        svg
            .append('text')
            .attr('class', 'x-label')
            .attr('x', width / 2)
            .attr('y', height - 5)
            .attr('text-anchor', 'middle')
            .text('Categories');

        svg.select('.y-label').remove(); 
        svg
            .append('text')
            .attr('class', 'y-label')
            .attr('x', -height / 2)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)')
            .text('Values');

        const handleDocumentClick = (event) => {
            if (!svgRef.current.contains(event.target)) {
                setSelectedIndex(null);
                svg.selectAll('.bar').attr('stroke', 'none');
            }
        };

        document.addEventListener('click', handleDocumentClick);

        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, [history, selectedIndex]);

    return (
        <React.Fragment>
            <svg ref={svgRef} width={450} height={300}></svg>
            {history.length > 1 && (
                <Button variant="outlined" onClick={() => setHistory((prevState) => prevState.slice(0, -1))}>
                    Go Back
                </Button>
            )}
        </React.Fragment>
    );
};

export default BarChart;
