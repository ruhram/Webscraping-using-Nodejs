const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Sample data
const data = [
  { name: 'John Doe', email: 'john@example.com', age: 30 },
  { name: 'Jane Smith', email: 'jane@example.com', age: 28 },
  { name: 'Bob Johnson', email: 'bob@example.com', age: 35 }
];

// Define the CSV writer
const csvWriter = createCsvWriter({
  path: 'output.csv', // Specify the output file path
  header: [
    { id: 'name', title: 'Name' },
    { id: 'email', title: 'Email' },
    { id: 'age', title: 'Age' }
  ]
});

// Write the data to the CSV file
csvWriter
  .writeRecords(data)
  .then(() => console.log('CSV file created successfully.'))
  .catch(error => console.error('Error writing CSV:', error));