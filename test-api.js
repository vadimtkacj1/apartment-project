// Test the API endpoint that NoCommissionSection uses
const url = 'http://localhost:3000/api/properties?dealType=sale&noCommission=true&limit=1';

console.log('Testing API endpoint:', url);
console.log('---');

fetch(url)
  .then(response => {
    console.log('Status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('Response data:');
    console.log(JSON.stringify(data, null, 2));
    console.log('\nNumber of properties returned:', data.length);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
