import React, { useEffect, useRef, useState } from 'react';
import { select, scaleBand, scaleLinear, axisBottom, axisRight } from 'd3';

const LineChart = () => {
    const [data, setData] = useState([]);
    const [time, setTime] = useState(0);
    const svgRef = useRef();

    const generateRandomDataPoint = (data) => {
        const previousDataPoint = data[data.length - 1] || 2450;
        const minChange = -15;
        const maxChange = 15;
        const change = Math.round(Math.random() * (maxChange - minChange) + minChange);
        const newValue = previousDataPoint + change;
        const clampedValue = Math.max(2300, newValue);
        return clampedValue;
    };


    useEffect(() => {
        const svg = select(svgRef.current);

        const xScale = scaleBand()
            .domain(data.map((value, index) => time - data.length + index))
            .range([0, 300])
            .padding(0.5);

        const yScale = scaleLinear().domain([2300, 2500]).range([150, 0]);

        const colorScale = scaleLinear()
            .domain([-100, 0, 100])
            .range(['red', 'green', 'green'])
            .clamp(true);

        const xAxis = axisBottom(xScale);
        svg.select('.x-axis').style('transform', 'translateY(150px)').call(xAxis);

        const yAxis = axisRight(yScale);
        svg.select('.y-axis').style('transform', 'translateX(300px)').call(yAxis);

        svg
            .append('text')
            .attr('x', 150)
            .attr('y', 190)
            .style('text-anchor', 'middle')
            .text('Time');

        svg
            .append('text')
            .attr('x', 400)
            .attr('y', 70)
            .style('text-anchor', 'middle')
            .text('Last Traded Price');

        const line = svg
            .selectAll('.line')
            .data([data])
            .join('path')
            .attr('class', 'line')
            .attr('d', (value) =>
                `M ${xScale(time - data.length)} ${yScale(value[0])} ` +
                value.map((val, index) => `L ${xScale(time - data.length + index)} ${yScale(val)}`).join(' ')
            )
            .attr('fill', 'none')
            .attr('stroke', (value) => colorScale(value[0] - 60))
            .attr('stroke-width', 2);

    }, [data, time]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime((prevTime) => prevTime + 1);
            setData((prevData) => {
                const newDataPoint = generateRandomDataPoint(prevData);
                const newData = [...prevData.slice(-10), newDataPoint];
                return newData;
            });
        }, 3000);

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
