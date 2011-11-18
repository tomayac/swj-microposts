var http = require('http');
var request = require('request');
var fs = require('fs');
var Step = require('./step.js');

var twitterEntities = require('./twitter.js').twitterEntities;
var facebookEntities = require('./facebook.js').facebookEntities;
var networks = {
  twitter: twitterEntities,
  facebook: facebookEntities
};

var results = {};
var rdfType = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';

Object.keys(networks).forEach(function(networkName) {
  var network = networks[networkName];
  Step(
    function() {
      var group = this.group();
      network.forEach(function(entity) {
        var url = entity.replace(
            'http://dbpedia.org/resource/',
            'http://dbpedia.org/data/') + '.json';
        var cb = group();
        var options = {
          url: url,
          entity: entity
        };
        request.get(options, function(err, res, body) {
          try {
            var json = JSON.parse(body);        
            results[options.entity] =
                json[options.entity][rdfType] ? json[options.entity][rdfType] : [];
            cb(null);
          } catch(e) {
            cb(null);            
          }
        });  
      });
    },
    function(err) {
      results = JSON.stringify(results);
      fs.writeFile('./' + networkName + '.txt', results, function(err) {
        if (!err) {
          console.log(networkName + ' results saved');
        }
      });    
    }
  );
});