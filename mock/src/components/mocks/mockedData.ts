// Mocked CSV data for property characteristics
const PROPERTY_DATA: string[][] = [
  ["Property", "Bedrooms", "Bathrooms", "Square Feet", "Garage"],
  ["123 Main St", "3", "2", "2000", "2-car"],
  ["456 Elm St", "4", "3", "2500", "Attached"],
  ["789 Oak St", "2", "1.5", "1500", "None"],
  ["101 Pine St", "3", "2.5", "2100", "1-car"],
  ["202 Cedar St", "4", "3", "2400", "2-car"],
  ["303 Maple St", "3", "2", "1800", "Attached"],
];

// Mocked CSV data for property prices over time
const PRICES_DATA: string[][] = [
  ["Year", "123 Main St", "456 Elm St", "789 Oak St"],
  ["2019", "$480,000", "$420,000", "$550,000"],
  ["2020", "$500,000", "$450,000", "$580,000"],
  ["2021", "$520,000", "$470,000", "$600,000"],
  ["2022", "$540,000", "$490,000", "$620,000"],
  ["2023", "$560,000", "$510,000", "$640,000"],
  ["2024", "$580,000", "$530,000", "$660,000"],
];

// Mocked CSV data for neighborhood demographics
const NEIGHBORHOOD_DATA: string[][] = [
  ["Neighborhood", "Population", "Median Income", "Average Age"],
  ["Downtown", "10000", "$60,000", "35"],
  ["Suburbia", "20000", "$70,000", "40"],
  ["Urban", "15000", "$80,000", "32"],
  ["Rural", "8000", "$50,000", "45"],
  ["Coastal", "12000", "$75,000", "38"],
  ["Mountain", "10000", "$65,000", "42"],
];

// Mocked CSV data for an empty csv
const EMPTY: string[][] = [];

// Export the expanded mocked CSV data
export {PROPERTY_DATA, PRICES_DATA, NEIGHBORHOOD_DATA, EMPTY};
