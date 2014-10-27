var express =  require('express');
var router =  express.Router();

console.log('Cargando rutas de index...');

router.all('/',function  (req,res,next) {
	console.log('Indice cargado');
	res.render('index.html',{});
	next();
})


module.exports = router;
