var config = require('../config/server.js');

var ldap = require('ldapjs');
var client = ldap.createClient({
  url: 'ldap://'+config.LDAP_URL
});

client.bind(config.binddn, config.password, function(err){
	if (err) console.log(err);
	else console.log('connected to LDAP server');
})

module.exports = client;