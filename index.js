var express = require('express');
var app = express();
var router = express.Router();

app.get('/', function (req, res) {

    //
    console.log('==========REQUEST====================');
    console.log(req.headers);


    if (!req.headers.authorization) {
        res.set( 'WWW-Authenticate', 'Negotiate' );

        //
        console.log('==========RESPONSE====================');
        console.log(res._headers);

        res.status(401).send();

    } else {

        // get token from kerberos as example
        // but it is not associated with the token from the browser
        var Kerberos = require('kerberos').Kerberos;
        var kerberos = new Kerberos();
        var Ssip = require('kerberos').SSIP;

        Ssip.SecurityCredentials.acquire("Kerberos", "", function(err, security_credentials) {
            if(err) throw err;

            Ssip.SecurityContext.initialize(security_credentials, "HTTP/<<www.foo.bar.ru@FOO.BAR.RU>>", "", function(err, security_context) {
                if(err) throw err;

                var has_context = security_context.hasContext;
                var payload = security_context.payload;

                res.set('WWW-Authenticate','Negotiate ' + payload);

                //
                console.log('==========RESPONSE====================');
                console.log(res._headers);

                res.send('<p style="word-wrap: break-word;">ok</p>');
            });
        });
    }
});


module.exports = router;
app.use(router);
app.listen(3000);