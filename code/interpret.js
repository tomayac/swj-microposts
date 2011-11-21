var request = require('request');
var fs = require('fs');

var networks = [
    'facebook',
    'twitter'
];

networks.forEach(function(network) {
  fs.readFile(network + '.txt', function (err, data) {
    if (!err) {
      data = JSON.parse(data);
      console.log(data);
    }
  });
});
