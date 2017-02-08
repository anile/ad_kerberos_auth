# ad_kerberos_auth
example of authorization in AD via kerberos (SSO or login/pass)

# install & start
# to install module kerberos must be gcc compiler (for windows e.g. Visual Studio Express https://www.visualstudio.com/ru/vs/visual-studio-express/)
npm start

# start
# in file index.js must be specified SPN for http web service that support Kerberos authentication like "HTTP/domain.com@DOMAIN.COM"
node index.js