import {
  scaleLinear,
  scalePoint,
  scaleSequential,
  axisLeft,
  extent,
  line,
  flatGroup,
  interpolateCool,
  scaleOrdinal,
  schemeSet2,
} from 'd3';
import { axes } from '@curran/responsive-axes';

export const viz = (
  svg,
  {
    filteredData,
    xValue,
    xAxisLabelText,
    xAxisLabelOffset,
    yValue,
    yAxisLabelText,
    yAxisLabelOffset,
    lineValue,
    marginLeft,
    marginTop,
    marginRight,
    marginBottom,
    width,
    height,
    innerRectFill,
    lineOpacity,
    colorLegendLabel,
    colorLegendX,
    colorLegendY,
  },
) => {
  // Assuming years are your categories and they are unique
  const xScale = scalePoint()
    .domain(filteredData.map(xValue)) // Ensure this maps to an array of unique years
    .range([marginLeft, width - marginRight])
    .padding(0.5); // Adjust padding as needed

  const yScale = scaleLinear(extent(filteredData, yValue), [
    height - marginBottom,
    marginTop,
  ]);

  const colorScale = scaleSequential(
    extent(filteredData, lineValue).reverse(),
    interpolateCool,
  );

  const innerWidth = width - marginLeft - marginRight;
  const innerHeight = height - marginTop - marginBottom;

  axes(svg, {
    width,
    height,
    xScale,
    xAxisLabelText,
    xAxisLabelOffset,
    yScale,
    yAxisLabelText,
    yAxisLabelOffset,
    marginLeft,
    marginBottom,
  });

  const lineGenerator = line(
    (d) => xScale(xValue(d)),
    (d) => yScale(yValue(d)),
  ).defined(yValue);

  const dataGrouped = flatGroup(filteredData, lineValue);

  const altColorScale = scaleOrdinal()
    .domain(filteredData.map(lineValue))
    .range(schemeSet2);

  // Multiple lines, one for each group
  svg
    .selectAll('path.mark')
    .data(dataGrouped)
    .join('path')
    .attr('class', 'mark')
    .attr('fill', 'none')
    .attr('stroke', (d) => {
      return altColorScale(d[0]);
    })
    .style('stroke-width', 3)
    .attr('opacity', 0.9)
    .attr('d', (d) => lineGenerator(d[1]));

  //console.log(dataGrouped.length);
};
