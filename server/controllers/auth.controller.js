var ldap = require('../services/ldap.js');
var jwt = require('jsonwebtoken');
var config = require('../config/server.js');
var md5 = require('md5');

module.exports = {
    login: login,
    verifyToken: verifyToken
    
};


function login(req, res, next) {

	var filterField = config.logindn.split('=?')[0]

    if (req.body&&req.body.username) {
    	var opt = {
    		filter: '('+filterField+'='+req.body.username+')',
    		scope: 'sub',
    		attributes: ['cn','sn','uid','mail','userPassword','objectClass']
    	}
    	ldap.search('ou=users,dc=casatransport,dc=ma',opt,function(err, response){
    		if (err) console.log(err);
    		else {
    			var ret=[];
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
			       res.status(500);
			    });
			    response.on('end', function(result) {
			    	var entry = ret[0];
			    	if(entry) {
			    		var password = md5(req.body.password)
			    		if (entry.userPassword==password) {
			    			if (entry.objectClass.indexOf('userManagement')>0) {
			    				var token = jwt.sign({uid: entry.uid, mail: entry.mail, username:entry.cn},config.secret);
				        		req.session.token = token;
				        		res.status(200).send({uid: entry.uid, mail: entry.mail, username:entry.cn,token: token});
			    			} else {
			    				res.status(200).json({token:false});
			    			}
			        		
			        	} else {
			        		res.status(200).json({token:false});
			        	}
			    	} else {
			    		res.status(200).json({token:false});
			    	}
				    	
			        console.log('status: ' + result.status);
			    });
    		}
    	})
    } 
}

function verifyToken(req, res) {
	var token = req.body.token;

	jwt.verify(token, config.secret,function(err, decoded){
		if (err) {
			res.json({isVerifiedToken:false})
		} else {
			res.json({isVerifiedToken: decoded});
		}
	});
}