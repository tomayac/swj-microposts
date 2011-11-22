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
      var filters = {
        'http://schema.org/': 'schema.org',
        'http://dbpedia.org/ontology/': 'dbpedia.org_ontology',
        'http://umbel.org/': 'umbel.org'
      };
      Object.keys(filters).forEach(function(filter) {
        var types = {};
        Object.keys(data).forEach(function(entity) {
          data[entity].forEach(function(type) {
            type = type.value;
            if (type === 'http://www.w3.org/2002/07/owl#Thing') {
              return;
            }
            if (type.indexOf(filter) === -1) {
              return;
            }
            if (types.hasOwnProperty(type)) {
              types[type] += 1;
            } else {
              types[type] = 1;
            }
          });
        });
        console.log(network);
        console.log(Object.keys(types).length + ' different types');
        var string = '';
        Object.keys(types).forEach(function(type) {
          string += type + '\t' + types[type] + '\n';
        });
        fs.writeFile('./' + network + '_' + filters[filter] + '.tsv', string,
            function(err) {
          if (!err) {
            console.log(network + ' results saved');
          }
        });    
      });
    }
  });
});
