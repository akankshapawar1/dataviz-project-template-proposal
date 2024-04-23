import data from './data.csv';

// Pre-process the data: convert numeric fields and filter out unnecessary rows if needed
for (const d of data) {
  d.Year = +d.Year;
  d.Gold = +d.Gold;
  d.Silver = +d.Silver;
  d.Bronze = +d.Bronze;
}

// // Aggregate medal counts by country and medal type
// const aggregatedData = data.reduce(
//   (acc, { Country_Name, Gold, Silver, Bronze }) => {
//     ['Gold', 'Silver', 'Bronze'].forEach((medalType) => {
//       const key = `${Country_Name}-${medalType}`;
//       if (!acc[key]) {
//         acc[key] = {
//           Country: Country_Name,
//           Medal: medalType,
//           Number: 0,
//         };
//       }
//       acc[key].Number +=
//         medalType === 'Gold'
//           ? Gold
//           : medalType === 'Silver'
//             ? Silver
//             : Bronze;
//     });
//     return acc;
//   },
//   {},
// );

// const transformedData = Object.values(aggregatedData);

// // Sort countries by the number of Gold medals won in descending order,
// // and then group Silver and Bronze under the countries sorted by Gold.
// transformedData.sort((a, b) => {
//   // Sort primarily by the number of Gold medals
//   if (a.Medal === 'Gold' && b.Medal === 'Gold') {
//     return b.Number - a.Number;
//   }

//   // If Gold medal count is the same or we are comparing within the same country,
//   // maintain the order of Silver and Bronze by the order they appear in the data
//   if (a.Country === b.Country) {
//     return a.Medal === 'Silver' && b.Medal === 'Bronze'
//       ? -1
//       : 1;
//   }

//   // For different countries, make sure to sort alphabetically so the grouping is maintained
//   return a.Country.localeCompare(b.Country);
// });

// Aggregate medal counts by country and medal type, and calculate the total medals for each country
const aggregatedData = data.reduce(
  (acc, { Country_Name, Gold, Silver, Bronze }) => {
    // Ensure each country has a base object
    if (!acc[Country_Name]) {
      acc[Country_Name] = {
        Country: Country_Name,
        Gold: 0,
        Silver: 0,
        Bronze: 0,
        Total: 0, // Add a Total property
      };
    }
    // Accumulate medals by type
    acc[Country_Name].Gold += Gold;
    acc[Country_Name].Silver += Silver;
    acc[Country_Name].Bronze += Bronze;
    // Update the Total
    acc[Country_Name].Total += Gold + Silver + Bronze;

    return acc;
  },
  {},
);

const transformedData = Object.entries(
  aggregatedData,
).reduce(
  (acc, [country, { Gold, Silver, Bronze, Total }]) => {
    // Push medal data with total included for each type
    acc.push({
      Country: country,
      Medal: 'Gold',
      Number: Gold,
      Total: Total,
    });
    acc.push({
      Country: country,
      Medal: 'Silver',
      Number: Silver,
      Total: Total,
    });
    acc.push({
      Country: country,
      Medal: 'Bronze',
      Number: Bronze,
      Total: Total,
    });
    return acc;
  },
  [],
);

transformedData.sort((a, b) => {
  // Sort by total medals first
  if (b.Total !== a.Total) {
    return b.Total - a.Total;
  }
  // If totals are the same, sort by gold medals
  else if (a.Medal === 'Gold' && b.Medal === 'Gold') {
    return b.Number - a.Number;
  }
  // If both total and gold medals are the same, sort by silver medals
  else if (a.Medal === 'Silver' && b.Medal === 'Silver') {
    return b.Number - a.Number;
  }
  // For Bronze, since total and gold and silver are the same, they will remain in the original order
  return 0;
});

console.log(transformedData);

export const main = (container) => {
  const fontSize = 36;

  const json = JSON.stringify(transformedData[5], null, 2);

  container.innerHTML = `
    <pre style="font-size: ${fontSize}px;">${json}</pre>
  `;
};

export { transformedData };
