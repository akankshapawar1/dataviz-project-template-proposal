import { select, utcParse } from 'd3';
import { viz } from './viz';
import { yearlyData } from '@akankshapawar1/0da3036dadbb4073a2b05b0b1a1957b4';
import { observeResize } from '@curran/responsive-axes';
import * as d3 from 'd3';

const parseYear = utcParse('%Y');

export const main = (container, { state, setState }) => {
  const dimensions = observeResize({
    state,
    setState,
    container,
  });

  if (dimensions === null) return;

  const { width, height } = dimensions;

  const countrySelect1 = document.createElement('select');
  countrySelect1.style.backgroundColor = '#66c2a5';
  const countrySelect2 = document.createElement('select');
  countrySelect2.style.backgroundColor = '#fc8d62';

  // Assuming yearlyData is an array of objects where each object has a 'Country' property
  const uniqueCountries = new Set(
    yearlyData.map((d) => d.Country),
  );

  // Populate the select element with an option for each unique country
  uniqueCountries.forEach((country) => {
    const option = document.createElement('option');
    option.value = country;
    option.textContent = country;
    countrySelect1.appendChild(option);
  });

  uniqueCountries.forEach((country) => {
    const option = document.createElement('option');
    option.value = country;
    option.textContent = country;
    countrySelect2.appendChild(option);
  });

  container.appendChild(countrySelect1);
  container.appendChild(countrySelect2);

  countrySelect1.addEventListener('change', () => {
    updateViz();
  });

  countrySelect2.addEventListener('change', () => {
    updateViz();
  });

  const svg = select(container)
    .selectAll('svg')
    .data([null])
    .join('svg')
    .attr('width', width)
    .attr('height', height);

  function updateViz() {
    const selectedCountry1 = countrySelect1.value;
    const selectedCountry2 = countrySelect2.value;

    const filters = new Set([
      selectedCountry1,
      selectedCountry2,
    ]);

    const filteredData = yearlyData.filter(
      (d) =>
        d.Country === selectedCountry1 ||
        d.Country === selectedCountry2,
    );

    viz(svg, {
      filteredData,
      xValue: (d) => d.Year,
      xAxisLabelText: 'Year',
      xAxisLabelOffset: 38,
      yValue: (d) => d.TotalMedals,
      lineValue: (d) => d.Country,
      yAxisLabelText: 'Medals',
      yAxisLabelOffset: 30,
      innerRectFill: '#E8E8E8',
      lineOpacity: 416 / 1000,
      marginTop: 20,
      marginBottom: 70,
      marginLeft: 70,
      marginRight: 20,
      width,
      height,
    });
  }

  updateViz();
};
