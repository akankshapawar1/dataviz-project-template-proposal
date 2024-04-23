import { select, csvParse } from 'd3';
import topojson from 'topojson-client';
import { map } from './map';

const worldAtlasURL =
  'https://unpkg.com/visionscarto-world-atlas@0.1.0/world/110m.json';
const olympicDataURL =
  'https://gist.githubusercontent.com/akankshapawar1/9f914778dc61236073e8bf9e8760be49/raw/ada77a1c78f945f08fd17bc13c40a06253a2d26d/Winter_Olympic_Medals.csv';

export const main = (container, { state, setState }) => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  let nonParticipantCountries = 0;

  const svg = select(container)
    .selectAll('svg')
    .data([null])
    .join('svg')
    .attr('width', width)
    .attr('height', height);

  const { data } = state;

  if (data && data !== 'LOADING') {
    svg.call(map, { data });
  }

  if (data === undefined) {
    setState((state) => ({ ...state, data: 'LOADING' }));

    Promise.all([
      fetch(worldAtlasURL).then((response) =>
        response.json(),
      ),
      fetch(olympicDataURL).then((response) =>
        response.text(),
      ),
    ]).then(([topoJSONData, csvData]) => {
      const olympicData = csvParse(csvData);
      const countries = topojson.feature(
        topoJSONData,
        topoJSONData.objects.countries,
      ).features;

      //console.log(countries);
      // Initialize an object to store medal counts for each country
      const medalCounts = {};

      // Process Olympic data
      olympicData.forEach((medal) => {
        const countryName = medal.Country_Name;
        if (!medalCounts[countryName]) {
          medalCounts[countryName] = {
            totalMedals: 0,
            totalGold: 0,
            totalSilver: 0,
            totalBronze: 0,
          };
        }

        medalCounts[countryName].totalGold += parseInt(
          medal.Gold,
          10,
        );
        medalCounts[countryName].totalSilver += parseInt(
          medal.Silver,
          10,
        );
        medalCounts[countryName].totalBronze += parseInt(
          medal.Bronze,
          10,
        );
        medalCounts[countryName].totalMedals =
          medalCounts[countryName].totalGold +
          medalCounts[countryName].totalSilver +
          medalCounts[countryName].totalBronze;
      });

      //console.log(olympicData);

      // Combine the Olympic data with the countries data
      countries.forEach((country) => {
        const countryName = country.properties.name
          .replace('United Kingdom', 'Great Britain')
          .replace(
            'United States of America',
            'United States',
          ) //checked
          .replace('Czechia', 'Czechoslovakia')
          .replace('Russia', 'Soviet Union')
          .replace('Serbia', 'Yugoslavia');
        const medalData = medalCounts[countryName];

        if (!medalData) {
          //console.log(`No data for: ${countryName}`);
          nonParticipantCountries++;
          country.properties.medals = {
            totalMedals: 0,
            totalGold: 0,
            totalSilver: 0,
            totalBronze: 0,
          };
        } else {
          country.properties.medals = medalData;
        }
      });
      //console.log(countries);
      const structuredData = { features: countries };
      setState((state) => ({
        ...state,
        data: countries,
      }));
    });
  }
};
