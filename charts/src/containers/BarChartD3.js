import React, { useState, useEffect, useRef } from 'react';
import { select, axisBottom, axisLeft, scaleLinear, scaleBand, max, scaleOrdinal, schemeCategory10 } from 'd3';
// import { Button } from '@mui/material';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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

        // Calculate the maximum value across all levels
        const maxAllLevels = max(history.flat(), (d) => d.value);

        const x = scaleBand()
            .domain(history[history.length - 1].map((d) => d.category))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const y = scaleLinear()
            .domain([0, maxAllLevels]) // Use the maximum value across all levels
            .nice()
            .range([height - margin.bottom, margin.top]);

        // Create Y-axis only once
        svg.select('.y-axis').remove(); // Remove any existing y-axis
        svg
            .append('g')
            .attr('class', 'y-axis')
            .attr('transform', `translate(${margin.left},0)`)
            .call(axisLeft(y).ticks(5)); // Include ticks as needed

        const color = scaleOrdinal(schemeCategory10);

        // Select all existing bars and remove them
        svg.selectAll('.bar').remove();

        // Create new bars with transition
        svg.selectAll('.bar')
            .data(history[history.length - 1])
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', (d) => x(d.category))
            .attr('y', height - margin.bottom) // Starting position at the bottom
            .attr('width', x.bandwidth())
            .attr('height', 0) // Starting height at 0
            .attr('fill', (d, i) => color(i))
            .on('click', (event, value) => {
                if (value.subData) {
                    // Drill down into subData
                    setHistory((prevState) => [...prevState, value.subData]);
                }
            })
            .transition() // Add transition
            .duration(500) // Duration of the transition in milliseconds
            .attr('y', (d) => y(d.value)) // Ending position based on data value
            .attr('height', (d) => height - margin.bottom - y(d.value)); // Ending height based on data value

        svg.select('.x-axis').remove(); // Remove any existing x-axis
        svg
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(axisBottom(x));

        svg.select('.x-label').remove(); // Remove any existing x-label
        svg
            .append('text')
            .attr('class', 'x-label')
            .attr('x', width / 2)
            .attr('y', height - 5)
            .attr('text-anchor', 'middle')
            .text('Categories');

        svg.select('.y-label').remove(); // Remove any existing y-label
        svg
            .append('text')
            .attr('class', 'y-label')
            .attr('x', -height / 2)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)')
            .text('Values');

        // Create the back button inside the SVG
        const backButton = svg.select('.back-button').remove(); // Remove any existing back button

        if (history.length > 1) {
            svg
                .append('g')
                .attr('class', 'back-button')
                .attr('cursor', 'pointer')
                .attr('transform', 'translate(400, 10)') // Adjust the position as needed
                .on('click', () => {
                    setHistory((prevState) => prevState.slice(0, -1));
                });
            svg.select('.back-button').selectAll('*').remove(); // Clear the group
            svg.select('.back-button')
                .append('rect')
                .attr('width', 30)
                .attr('height', 30)
                .attr('fill', 'white')
                .attr('stroke', 'black');
            svg.select('.back-button')
                .append('text')
                .text('←') // Add your arrow symbol here
                .attr('x', 15)
                .attr('y', 15)
                .attr('text-anchor', 'middle')
                .attr('alignment-baseline', 'middle')
                .style('font-size', '20px');
        }
        // Handle clicking outside the chart
        const handleDocumentClick = (event) => {
            if (!svgRef.current.contains(event.target)) {
                setSelectedIndex(null);
                svg.selectAll('.bar').attr('stroke', 'none');
            }
        };

        document.addEventListener('click', handleDocumentClick);

        // Cleanup the event listener
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, [history, selectedIndex]);

    return (
        <React.Fragment>
            <svg ref={svgRef} width={450} height={300}></svg>
        </React.Fragment>
    );
};

export default BarChart;
