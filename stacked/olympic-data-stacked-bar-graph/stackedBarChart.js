import {
  scaleLinear,
  scaleBand,
  flatRollup,
  stack,
  extent,
} from 'd3';
import { axes } from '@curran/responsive-axes';

export const stackedBarChart = (
  selection,
  {
    transformedData,
    width,
    height,
    xValue,
    xAxisLabelText,
    xAxisLabelOffset,
    yValue,
    yAxisLabelText,
    yAxisLabelOffset,
    colorValue,
    colorScale,
    hoveredColorValue,
    fadeOpacity = 0.2,
    hoveredStrokeWidth = 2,
    hoveredStrokeColor = 'black',
    marginLeft,
    marginTop,
    marginRight,
    marginBottom,
    padding = 0.2,
  },
) => {
  const grouped = flatRollup(
    transformedData,
    (values) =>
      new Map(
        values.map((d) => [colorValue(d), xValue(d)]),
      ),
    yValue,
  );

  const stacked = stack()
    .keys(grouped[0][1].keys())
    .value((d, key) => d[1].get(key))(grouped);

  const xScale = scaleLinear()
    .domain(extent(stacked.flat(2)))
    .range([marginLeft, width - marginRight]);

  const yScale = scaleBand()
    .domain(transformedData.map(yValue))
    .padding(padding)
    .range([height - marginBottom, marginTop]);

  axes(selection, {
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

  selection
    .selectAll('g.stacks')
    .data(stacked)
    .join('g')
    .attr('class', 'stacks')
    .attr('fill', ({ key }) => colorScale(key))
    .attr('stroke-width', hoveredStrokeWidth)
    .attr('stroke', ({ key }) =>
      hoveredColorValue && hoveredColorValue === key
        ? hoveredStrokeColor
        : 'none',
    )
    .attr('opacity', ({ key }) =>
      hoveredColorValue
        ? hoveredColorValue === key
          ? 1
          : fadeOpacity
        : 1,
    )
    .call((selection) => {
      selection
        .selectAll('rect')
        .data((d) => d)
        .join('rect')
        .attr('x', ([x1]) => xScale(x1))
        .attr('y', ({ data: [key] }) => yScale(key))
        .attr(
          'width',
          ([x1, x2]) => xScale(x2) - xScale(x1),
        )
        .attr('height', yScale.bandwidth());
    })
    .call((selection) => {
      selection
        .filter(({ key }) => key === hoveredColorValue)
        .raise();
    });
};
