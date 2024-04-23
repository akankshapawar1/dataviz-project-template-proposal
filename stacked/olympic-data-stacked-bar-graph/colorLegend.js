export const colorLegend = (
  selection,
  {
    colorScale,
    rectSize = 24,
    rectGap = 10,
    textGap = 5,
    hoveredColorValue,
    setHoveredColorValue,
    fadeOpacity = 0.2,
    hoveredStrokeWidth = 2,
    hoveredStrokeColor = 'black',
    maxTextLength = 200,
  },
) => {
  selection
    .selectAll('g')
    .data(colorScale.domain())
    .join((enter) =>
      enter.append('g').call((enter) => {
        enter.append('rect').attr('class', 'mark');
        enter.append('text');
        enter.append('rect').attr('class', 'interaction');
      }),
    )
    .attr(
      'transform',
      (d, i) => `translate(0,${i * (rectSize + rectGap)})`,
    )
    .attr('font-family', 'sans-serif')
    .call((selection) => {
      selection
        .select('rect.mark')
        .attr('width', rectSize)
        .attr('height', rectSize)
        .attr('fill', colorScale)
        .attr('stroke-width', hoveredStrokeWidth)
        .attr('stroke', (d) =>
          hoveredColorValue && hoveredColorValue === d
            ? hoveredStrokeColor
            : 'none',
        );
      selection
        .select('text')
        .attr('x', rectSize + textGap)
        .attr('y', rectSize / 2)
        .attr('alignment-baseline', 'central')
        .text((d) => d);
      selection
        .select('rect.interaction')
        .attr('x', -rectGap / 2)
        .attr('y', -rectGap / 2)
        .attr('width', maxTextLength)
        .attr('height', rectSize + rectGap)
        .attr('opacity', 0);
    })
    .attr('cursor', 'pointer')
    .on('mouseenter', (event, d) => {
      setHoveredColorValue(d);
    })
    .on('mouseleave', (event, d) => {
      setHoveredColorValue(null);
    })
    .attr('opacity', (d) =>
      hoveredColorValue
        ? hoveredColorValue === d
          ? 1
          : fadeOpacity
        : 1,
    );
};
