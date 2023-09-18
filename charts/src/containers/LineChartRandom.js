import React, { useEffect, useRef, useState } from 'react';
import { select, scaleBand, scaleLinear, axisBottom, axisRight } from 'd3';

const LineChart = () => {
    const [data, setData] = useState([]);
    const svgRef = useRef();

    useEffect(() => {
        const svg = select(svgRef.current);

        const xScale = scaleBand()
            .domain(data.map((value, index) => index))
            .range([0, 300])
            .padding(0.5);

        const yScale = scaleLinear().domain([0, 100]).range([150, 0]);

        const colorScale = scaleLinear()
            .domain([-100, 0, 100])
            .range(['red', 'green', 'green'])
            .clamp(true);

        const xAxis = axisBottom(xScale).ticks(data.length);
        svg.select('.x-axis').style('transform', 'translateY(150px)').call(xAxis);

        const yAxis = axisRight(yScale);
        svg.select('.y-axis').style('transform', 'translateX(300px)').call(yAxis);

        const line = svg
            .selectAll('.line')
            .data([data])
            .join('path')
            .attr('class', 'line')
            .attr('d', (value) =>
                `M ${xScale(0)} ${yScale(value[0])} ` +
                value.map((val, index) => `L ${xScale(index)} ${yScale(val)}`).join(' ')
            )
            .attr('fill', 'none')
            .attr('stroke', (value) => colorScale(value[0] - 60)) 
            .attr('stroke-width', 2);

    }, [data]);

    useEffect(() => {
        const interval = setInterval(() => {
            setData((prevData) => {
                const newDataPoint = Math.round(Math.random() * 100);
                const newData = [...prevData.slice(-14), newDataPoint]; 
                return newData;
            });
        }, 1000); 

        return () => clearInterval(interval); 
    }, []);

    return (
        <React.Fragment>
            <svg ref={svgRef}>
                <g className="x-axis" />
                <g className="y-axis" />
            </svg>
        </React.Fragment>
    );
};

export default LineChart;
