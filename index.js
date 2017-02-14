var express = require('express');
var app = express();
var router = express.Router();

app.get('/', function (req, res) {

    //
    console.log('-----request-----');
    console.log(req.headers);


    if (!req.headers.authorization) {
        res.set( 'WWW-Authenticate', 'Negotiate' );

        //
        console.log('-----response-----');
        console.log(res._headers);

        res.status(401).send();

    } else {

        // this code is only for Linux !

        var KerberosNative = require('kerberos').Kerberos;
        var kerberos = new KerberosNative();
        var ActiveDirectory = require('activedirectory');
        var ad = new ActiveDirectory({
            "url": "ldap://<example.com>",
            "baseDN": "<dc=example,dc=com>",
            "username": "<username@example.com>",
            "password": "<password>"});
        //cut phrase "Negotiate "
        var ticket = req.headers.authorization.substring(10);

        //init context
        kerberos.authGSSServerInit("HTTP", function(err, context) {
            //check ticket
            kerberos.authGSSServerStep(context, ticket, function(err) {
                //in success context contains username
                ad.findUser(context.username, function(err, user) {
                    //get user groups
                    //if need filter by group name
                    // var opts = {filter: '&(member:1.2.840.113556.1.4.1941:=' + user.dn + ')(sAMAccountName=Ex*)'};
                    var opts = {filter: '&(member:1.2.840.113556.1.4.1941:=' + user.dn + ')'};
                    ad.find(opts, function(err, result) {
                        res.set( 'WWW-Authenticate', 'Negotiate ' + context.response);

                        //
                        console.log('-----response-----');
                        console.log(res._headers);

                        var response = '<p>Имя пользователя: '+ user.cn + '</p><p>Состоит в группах:</p><ul>';
                        for (var i in result.groups) {response += '<li>' + result.groups[i].cn + '</li>';}
                        res.send(response);
                    })
                });
            });
        });

        // this code is for Windows - yet not working

        //var Ssip = require('kerberos').SSIP;
        //var ticket = req.headers.authorization.substring(10);

    }
});


module.exports = router;
app.use(router);
app.listen(5000);