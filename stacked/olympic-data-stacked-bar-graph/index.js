import { select, scaleOrdinal } from 'd3';
import { observeResize } from '@curran/responsive-axes';
import { one } from './one';
import { transformedData } from '@akankshapawar1/67d2e56429014a449bc9a89ae235203d';
import { stackedBarChart } from './stackedBarChart';
import { colorLegend } from './colorLegend';

const colorValue = (d) => d.Medal;
const hoveredStrokeWidth = 1;
const hoveredStrokeColor = 'black';

export const main = (container, { state, setState }) => {
  const dimensions = observeResize({
    state,
    setState,
    container,
  });

  if (dimensions === null) return;

  const { width, height } = dimensions;
  const { hoveredColorValue } = state;

  const setHoveredColorValue = (hoveredColorValue) => {
    setState((state) => ({ ...state, hoveredColorValue }));
  };

  const svg = select(container)
    .selectAll('svg')
    .data([null])
    .join('svg')
    .attr('width', width)
    .attr('height', height);

  const colorScale = scaleOrdinal()
    .domain(['Gold', 'Silver', 'Bronze'])
    .range(['#FFD700', '#C0C0C0', '#CD7F32']);

  const stackedBarChartG = one(
    svg,
    'g',
    'stacked-bar-chart',
  );
  const colorLegendG = one(svg, 'g', 'color-legend').attr(
    'transform',
    `translate(${width - 170}, 20)`,
  );

  stackedBarChartG.call(stackedBarChart, {
    width,
    height,
    transformedData,
    xValue: (d) => d.Number,
    xAxisLabelText: 'Medals',
    xAxisLabelOffset: 37,
    yValue: (d) => d.Country,
    yAxisLabelText: 'Country',
    yAxisLabelOffset: 21,
    colorValue,
    colorScale,
    hoveredColorValue,
    hoveredStrokeWidth,
    hoveredStrokeColor,
    marginTop: 10,
    marginBottom: 50,
    marginLeft: 154,
    marginRight: 10,
  });

  colorLegendG.call(colorLegend, {
    colorScale,
    hoveredColorValue,
    setHoveredColorValue,
    hoveredStrokeWidth,
    hoveredStrokeColor,
  });
};
