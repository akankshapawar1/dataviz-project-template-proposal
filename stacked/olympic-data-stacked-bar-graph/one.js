export const one = (selection, name, className) =>
  selection
    .selectAll(`${name}.${className}`)
    .data([null])
    .join(name)
    .attr('class', className);
