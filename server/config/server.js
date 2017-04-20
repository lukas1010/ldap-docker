
module.exports = {
    BASE_URL    : "/api/v1",
    PORT        : process.env.PORT || 3000,
    secret : 'thisisasecret',
    //LDAP Server
    binddn : 'cn=admin,dc=casatransport,dc=ma',
    password: 'cr@zyTurtle42',
    LDAP_URL: '134.213.31.111',
    logindn: 'uid=?, ou=users,dc=casatransport,dc=ma'
};