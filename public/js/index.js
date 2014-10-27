//Script de cliente sistema experto

var page = {
	//slider : $(".slider").slider(),
	btnPlay: $("#btn-start"),
	btnReset: $("#btn-reset"),
	btnAddObstacle: $("#btn-addObstacle"),
	obsTable: $("#tblObstacles tbody"),
	road: $("#road"),
	inObstacles: $("#inObstaculos"),
	outSpeed: $('#outSpeed'),
	car: {
		tag: $("#car"),
		pos: 0,
		vel: 0, //units per second
	},
	defVel: 100,
	
	isPlaying: false,
	timeObject: false,
	millis: 5,
	inoutStates: {
		speeds: [100,80,50,25,0],
		obstacles: ['Despejado','Lejano', 'Regular', 'Cerca', 'Muy Cerca']
	},
	init: function(){
		console.log("Init page");
		this.bindings();
		page.car.vel = page.defVel;
	},
	bindings: function  () {
		page.btnPlay.on("click", page.playStop);
		page.btnReset.on("click", page.reset);
		page.btnAddObstacle.on("click",page.addObstacle);

	},
	nextObstacle: function (){
		
		var carpos = page.car.pos + page.car.tag.width();
		var mindist = page.road.width();
		page.road.find('.obstacle').each(function(index,item){
				//console.log('ob: ',item );
				var ob = $(item);
				var obpos = parseFloat(ob.css('left'));
				if(obpos > carpos && obpos - carpos < mindist){
					mindist = obpos - carpos;
					console.log(mindist);
				}
		});
		return mindist;
	},
	nearObstacle: function(){
		var nextob =  page.nextObstacle();
		console.log('nextob: ',nextob);
		if(nextob == page.road.width()){
			return 0; // Despejado
		}else if(nextob > 100){
			return 1 // Lejano
		}else if(nextob > 50) {
			return 2; // Regular
		} else if(nextob > 20){
			return 3; // Cerca
		}else {
			return 4; // Muy cerca
		}
	},
	getSpeedPerc:function(obs){
		return page.inoutStates.speeds[obs];
	},
	trHover: function  (e) {
		console.log("mouseenter");
		$(".obstacle").removeClass('big');
		var tr = $(e.target).closest('tr');
		var num =  tr.find(".num").text();
		$("#ob"+num).addClass('big');
	},
	showValues: function  (ob,speedPerc) {
		page.inObstacles.text(page.inoutStates.obstacles[ob]);
		page.outSpeed.text(speedPerc + "%");
	},
	addObstacle: function  (e) {
		e.preventDefault();
		var tr = $("#tblClone tr:first-child").clone();
		console.log("Cloned: ",tr);
		var num =page.obsTable.find("tr").length+1
		tr.find(".num").text(num);
		page.obsTable.append(tr);
		tr.find('.slider').slider().on('slide',page.obSlide);
		tr.find('.btn-delObstacle').on("click",page.delObstacle);
		tr.on('mouseenter', page.trHover);
		console.log("delbtn",tr.find('.btn-delObstacle'));
		var ob = $("<div>").addClass("obstacle").attr("id","ob"+num);
		page.road.append(ob);	
	},
	delObstacle:function  (e) {
		e.preventDefault();
		console.log("del");
		var btn =  $(e.target);
		var num = btn.closest("tr").find(".num").text();
		$("#ob"+num).remove();
		btn.closest("tr").remove();
	},
	obSlide:function(e){
		var slide = $(e.target).closest("tr").find(".slider");
		var val = e.value;
		var num = slide.closest("tr").find(".num").text();
		var ob = $("#ob"+num);
		var pos= (page.road.width() * val / 100);;
		//console.log(ob,"Pos: ",pos);
		ob.css("left", pos+'px' );
	},
	playStop: function  (e) {
		e.preventDefault();
		if(page.isPlaying == true){
			page.stop();
		}else{
			page.play();
		}
	},
	reset:function  () {
		page.car.pos = 0;
		page.car.vel = page.defVel;
		page.stop();
		page.car.tag.css('left',(page.car.pos)+'px');
	},
	stop:function  () {
		page.isPlaying = false;
		page.btnPlay.find(".glyphicon").addClass("glyphicon-play").removeClass("glyphicon-stop");
		page.btnPlay.find('.text').text("Iniciar");
		clearInterval(page.timeObject);
	},
	play:function  () {
		page.isPlaying = true;
		page.btnPlay.find(".glyphicon").removeClass("glyphicon-play").addClass("glyphicon-stop");
		page.btnPlay.find('.text').text("Detener");
		page.timeObject = setInterval(page.loop,page.millis);
	},
	loop: function  () {
		//console.log('loop');
		var car =  page.car;
		var dt = page.millis/1000;
		var ob = page.nearObstacle();
		var speedPerc = page.getSpeedPerc(ob);
		page.showValues(ob,speedPerc);
		car.pos+= car.vel * (speedPerc/100) * dt;

		car.tag.css('left',(car.pos)+'px');
		//console.log('new pos: ', car.pos);
		if(car.pos >= page.road.width() - car.tag.width())
			page.stop();
	}
}

$(document).on('ready',function  (e) {
	page.init();
})

