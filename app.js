var express =  require('express');
var index = require('./routes/index');
var app = express();
var port = 3000;

app.engine('html', require('ejs').renderFile);
app.set('views',__dirname + '/views');
app.use('/static', express.static(__dirname + '/public'));
app.use('/',index);

app.listen(port);
console.log("Servidor escuchando en el puerto: "+port);
console.log("Presion ctrl + C para salir");
