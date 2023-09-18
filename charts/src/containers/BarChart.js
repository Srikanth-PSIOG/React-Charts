import React, { useState, useEffect, useRef } from 'react';
import { select, axisBottom, axisRight, scaleLinear, scaleBand } from "d3";
import { Button, Grid } from '@mui/material';

const BarChart = () => {
    const [data, setData] = useState([25, 30, 45, 60, 10, 65, 75]);
    const svgRef = useRef();
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [selectedBarIndex, setSelectedBarIndex] = useState(null);
    useEffect(() => {
        const svg = select(svgRef.current);

        const xScale = scaleBand()
            .domain(data.map((value, index) => index))
            .range([0, 300])
            .padding(0.5);

        const yScale = scaleLinear().domain([0, 100]).range([150, 0]);

        const colorScale = scaleLinear()
            .domain([30, 50, 75, 90, 100])
            .range(["red", "orange", "yellow", "lime", "green"])
            .clamp(true);

        const xAxis = axisBottom(xScale).ticks(data.length);
        svg.select(".x-axis").style("transform", "translateY(150px)").call(xAxis);

        const yAxis = axisRight(yScale);
        svg.select(".y-axis").style("transform", "translateX(300px)").call(yAxis);

        svg
            .selectAll(".bar")
            .data(data)
            .join("rect")
            .attr("class", "bar")
            .style("transform", "scale(1, -1)")
            .attr("x", (value, index) => xScale(index))
            .attr("y", -150)
            .attr("width", xScale.bandwidth())
            .on("mouseenter", (event, value) => {
                const index = svg.selectAll(".bar").nodes().indexOf(event.target);
                svg
                    .selectAll(".tooltip")
                    .data([value])
                    .join((enter) => enter.append("text").attr("y", yScale(value) - 4))
                    .attr("class", "tooltip")
                    .text(value)
                    .attr("x", xScale(index) + xScale.bandwidth() / 2)
                    .attr("text-anchor", "middle")
                    .transition()
                    .attr("y", yScale(value) - 8)
                    .attr("opacity", 1);
            })
            .on("mouseleave", () => svg.select(".tooltip").remove())
            .on("click", (event, value) => {
                const index = svg.selectAll(".bar").nodes().indexOf(event.target);
                selectElementToDelete(index);
                svg.selectAll(".bar").attr("stroke", "none");

                svg.selectAll(".bar")
                    .filter((d, i) => i === index)
                    .attr("stroke", "purple")
                    .attr("stroke-width", 2);
            })
            .transition()
            .attr("fill", colorScale)
            .attr("height", (value) => 150 - yScale(value));

        const handleDocumentClick = (event) => {
            if (!svgRef.current.contains(event.target)) {
                setSelectedIndex(null);
                setSelectedBarIndex(null);
                svg.selectAll(".bar").attr("stroke", "none");
            }
        };

        document.addEventListener("click", handleDocumentClick);
    }, [data]);

    const selectElementToDelete = (index) => {
        setSelectedIndex(index);
        setSelectedBarIndex(index);
    };

    const updateData = (newData) => {
        const limitedData = newData.map((value) => Math.min(value, 100));
        setData(limitedData);
    };

    const addRandomData = () => {
        if (data.length < 15) {
            updateData([...data, Math.round(Math.random() * 100)]);
        }
    };

    const deleteData = () => {
        const indexToDelete = selectedIndex !== null ? selectedIndex : data.length - 1;

        const updatedData = [...data];
        updatedData.splice(indexToDelete, 1);
        setSelectedIndex(null);
        setSelectedBarIndex(null);
        updateData(updatedData);
    };

    return (
        <React.Fragment>
            <svg ref={svgRef}>
                <g className="x-axis" />
                <g className="y-axis" />
            </svg>
            <Grid sx={{ marginTop: '5px' }}>
                <Button onClick={() => updateData(data.map((value) => value + 5))}>
                    Update
                </Button>
                <Button onClick={() => updateData(data.filter((value) => value < 85))}>
                    Filter
                </Button>
                <Button
                    onClick={addRandomData}
                >
                    Add
                </Button>
                <Button sx={{ border: selectedIndex ? '1px solid red' : 'none' }} onClick={deleteData}>Delete</Button>
            </Grid>
        </React.Fragment>
    );
};

export default BarChart