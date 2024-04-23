import {
  geoNaturalEarth1,
  geoPath,
  geoGraticule,
  scaleSequential,
  interpolateReds,
  select,
  scaleLinear,
  axisBottom,
} from 'd3';
import * as d3 from 'd3';

const projection = geoNaturalEarth1();
const path = geoPath(projection);
const graticule = geoGraticule();

export const map = (selection, { data, width, height }) => {
  const mostMedals = Math.max(
    ...data.map((d) =>
      d.properties.medals
        ? d.properties.medals.totalMedals
        : 0,
    ),
  );

  const colorScale = scaleSequential(
    interpolateReds,
  ).domain([0, mostMedals]);

  // Initialize tooltip
  const tooltip = select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('position', 'absolute')
    .style('z-index', '10')
    .style('visibility', 'hidden')
    .style('padding', '10px')
    .style('background', 'rgba(0,0,0,0.6)')
    .style('border-radius', '4px')
    .style('color', '#fff');

  // Draw graticules
  selection
    .selectAll('path.graticule')
    .data([graticule()])
    .join('path')
    .attr('class', 'graticule')
    .attr('d', path)
    .attr('fill', 'none')
    .attr('stroke', '#BBB')
    .attr('stroke-width', 0.5);

  // Draw the outline of the map
  selection
    .selectAll('path.outline')
    .data([graticule.outline()])
    .join('path')
    .attr('class', 'outline')
    .attr('d', path)
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', 2);

  // Draw each country and color it based on the total medals
  selection
    .selectAll('path.country')
    .data(data)
    .join('path')
    .attr('d', path)
    .attr('class', 'country')
    .attr('stroke', 'white')
    .attr('stroke-width', 0.5)
    .attr('fill', (d) =>
      d.properties.medals
        ? colorScale(d.properties.medals.totalMedals)
        : '#eee',
    )
    .on('mouseover', function (event, d) {
      tooltip.style('visibility', 'visible')
        .html(`Country: ${d.properties.name}<br>
          Total Medals: ${d.properties.medals.totalMedals}<br>
          Total Gold: ${d.properties.medals.totalGold}<br>
          Total Silver: ${d.properties.medals.totalSilver}<br>
          Total Bronze: ${d.properties.medals.totalBronze}`);
    })
    .on('mousemove', function (event, d) {
      //console.log(d.properties.name);
      tooltip
        .style('top', event.pageY - 10 + 'px')
        .style('left', event.pageX + 10 + 'px');
    })
    .on('mouseout', function () {
      tooltip.style('visibility', 'hidden');
    });

  const legendWidth = 300;
  const legendHeight = 20;
  const numOfGradients = colorScale.ticks
    ? colorScale.ticks().length
    : colorScale.domain().length;

  const legend = selection
    .append('g')
    .attr('class', 'legend')
    .attr(
      'transform',
      `translate(${width - legendWidth - 20}, ${height - legendHeight - 20})`,
    );

  const legendScale = scaleSequential(
    interpolateReds,
  ).domain([0, legendWidth]);

  legend
    .selectAll('rect')
    .data(d3.range(legendWidth), (d) => d)
    .enter()
    .append('rect')
    .attr('x', (d) => d)
    .attr('y', 0)
    .attr('height', legendHeight)
    .attr('width', 1)
    .attr('fill', (d) =>
      colorScale((d * mostMedals) / legendWidth),
    );

  // Add legend axis (optional)
  const legendAxisScale = scaleLinear()
    .domain([0, mostMedals])
    .range([0, legendWidth]);

  const legendAxis = axisBottom(legendAxisScale)
    .ticks(5)
    .tickSize(-legendHeight);

  legend
    .append('g')
    .attr('class', 'legend-axis')
    .attr('transform', `translate(2, ${legendHeight})`)
    .call(legendAxis);
};
