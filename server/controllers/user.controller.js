var ldap = require('../services/ldap.js');
var LDAP = require('ldapjs');
// var jwt = require('jsonwebtoken');
var config = require('../config/server.js');
var md5 = require('md5');

module.exports = {
    getUsers: getUsers,
    updateUser: updateUser,
    deleteUser: deleteUser,
    addUser: addUser
    
};

function addUser (req, res) {
	if (req.body) {
			var newDN = "uid="+req.body.uid+",ou=users,dc=casatransport,dc=ma";
		    var newUser = {
		        cn: req.body.cn,
		        sn: req.body.sn,
		        uid: req.body.uid,
		        objectClass: req.body.objectClass,
		        userPassword: md5(req.body.userPassword)
		    }	

		    if (typeof req.body.adimotrole != 'undefined') {
		    	newUser.adimotrole = req.body.adimotrole.toString();
		    }
		        
		    ldap.add(newDN, newUser, function(err){
		        if (err) res.status(500).send(err);
			    else {
			    	console.log('added to LDAP server');
			    	res.status(200).json({message: "Added New User"});
			    }
		    });
	}
}

function deleteUser (req, res) {
	if(req.body) {
		ldap.del('uid='+req.body.uid+',ou=users,dc=casatransport,dc=ma',function(err){
			if (err) {
				res.status(500).send(err);
			} else {
				res.status(200).json({message: 'Deleted user!'});
			}
		})
	}
}


function getUsers(req, res ){
	var sizeLimit = 0;
	if (req.body.sizeLimit) {
		sizeLimit = req.body.sizeLimit;
	}

	ldap.search('ou=users,dc=casatransport,dc=ma',{
		filter: '(sn=*)',
		attributes: ['cn','sn','objectClass','adimotrole','uid','mail'],
		scope: 'sub'
	},function(err, response){
		if (err) console.log(err);
		else {
			var ret = [];
			response.on('searchEntry', function(entry) {

		        if(entry) {
		        	ret.push(entry.object);
		        } 
		    });
		    response.on('searchReference', function(referral) {
		        console.log('referral: ' + referral.uris.join());
		    });

		    response.on('error', function(err) {
		       console.error('error: ' + err.message);
		       // res.status(500);
		    });
		    response.on('end', function(result) {
		    	res.status(200).json({data: ret});
		        console.log('status: ' + ret.length);
		    });
		}    
	})

}

function updateUser (req, res) {

	if (req.body) {
		var changes = [];
		var data = req.body.changes;
		for (var i in data) {
			if (i == 'adimotrole'&& data[i].length==0) {
				var temp = {operation: 'delete',modification:{}};
				temp.modification[i] = [];
				changes.push(new LDAP.Change(temp));
			} else if(i=='userPassword') {
				var temp = {operation: 'replace',modification:{}};
				temp.modification[i] = md5(data[i]);
				changes.push(new LDAP.Change(temp));
			} else {
				var temp = {operation: 'replace',modification:{}};
				temp.modification[i] = data[i];
				changes.push(new LDAP.Change(temp));
			}
			
		}

		ldap.modify('uid='+req.body.uid+',ou=users,dc=casatransport,dc=ma', changes,function(err){
			if (err) {
				console.log(err);
				res.status(500);
			} else {
				res.status(200).json({message:'Updated user!'});
			}
		})	
	}
}
	