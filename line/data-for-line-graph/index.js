import data from './data.csv';

var yearlyData = [];

// Pre-process the data: convert numeric fields and filter out unnecessary rows if needed
for (const d of data) {
  d.Year = +d.Year; // Convert Year to numeric
  d.Gold = +d.Gold; // Convert Gold to numeric
  d.Silver = +d.Silver; // Convert Silver to numeric
  d.Bronze = +d.Bronze; // Convert Bronze to numeric
  d.Total_Medals = d.Gold + d.Silver + d.Bronze; // Calculate total medals
}

for (let year = 1924; year <= 2018; year++) {
  const yearData = data.filter((d) => d.Year === year);

  for (const countryData of yearData) {
    yearlyData.push({
      Country: countryData.Country_Name,
      Year: countryData.Year,
      TotalMedals: countryData.Total_Medals,
    });
  }
}

export const main = (container) => {
  const fontSize = 36;

  const json = JSON.stringify(yearlyData[80], null, 2);

  container.innerHTML = `
    <pre style="font-size: ${fontSize}px;">${json}</pre>
  `;
};

export { yearlyData };
