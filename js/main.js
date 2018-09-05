
// Elementos importantes del canvas

var canvas = document.getElementById('game_terrain')
var ctx = canvas.getContext('2d')


// Variables Globales
var interval;
var frame = 0;
var images = {
  bg: "./images/space2.jpg",
  disparoNave: "./images/plasma_bullet.png",
  disparoNaveEnemiga:"./images/enemy_bullet.png",
  nave1:"./images/nave1.png",
  nave2:"./images/nave2.png",
  blastEnemy: "./images/blastEnemy.png"
}
var juego = {
  status:"iniciando"
}
var texto = {
  contador: -1,
  title: '',
  subtitulo:''
}


// Clases

class Board{
  constructor(){

    this.x = 0
    this.y = 0
    this.width = canvas.width
    this.height = canvas.height
    this.image = new Image()
    this.image.src = images.bg
    this.image.onload = ()=>{
      this.draw()
    }

  }

  draw(){
    this.y++
    // Animación de fondo
    if (this.y > + this.height) this.y = 0
    ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
    ctx.drawImage(this.image,this.x,this.y - this.height,this.width,this.height)
  }

} // Fin de la clase board

class Nave {

  constructor(){
    this.x = 100
    this.y = 350
    this.width = 100
    this.height = 100
    this.status = "vivo"
    this.shots = []
    this.image = new Image()
    this.image.src = images.nave1
    this.image.onload = ()=>{
      this.draw()
    }
    this.imageDisparos = new Image()
    this.imageDisparos.src = images.disparoNave
    
  }

  draw(){
    ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
  }
  
  fire(){
    this.shots.push({
      x:nave_uno.x + 35,
      y:nave_uno.y - 10,
      width:30,
      height:30
    });
  }

  drawShots(){
    ctx.save();
    //ctx.fillStyle = 'white';
    for (var i in this.shots) {
      var disparo = this.shots[i];
      ctx.drawImage(this.imageDisparos,disparo.x,disparo.y,disparo.width, disparo.height);
    };
    ctx.restore();
  }

  moveShots(){

    for (var i in this.shots) {
      var disparo = this.shots[i];
      disparo.y -=8;
    }

    this.shots.filter(function (){
      return disparo.y > 0;
    });
  }


}

class NaveEnemiga{
  constructor(){
    this.x = 10
    this.y = 10
    this.width = 100
    this.height = 100
    this.estado = "vivo"
    // array de enemigos
    this.enemigos = []
    // array para los disparos
    this.disparosEnemigos = []
    this.imageEnemy = new Image()
    this.imageEnemy.src = images.nave2
    this.blastEnemy = new Image()
    this.blastEnemy.src = images.blastEnemy
    this.imageEnemyshot = new Image()
    this.imageEnemyshot.src = images.disparoNaveEnemiga
    
  }

  draw(){
    for (var i in this.enemigos){
      if(this.enemigos[i].estado == 'vivo'){
        ctx.drawImage(this.imageEnemy,this.enemigos[i].x,this.enemigos[i].y,this.enemigos[i].width,this.enemigos[i].height)
      }
      if(this.estado == "vivo"){
        //console.log(frame)
        if(frame % 100 == 0)this.disparosEnemigos.push(this.addShots(this.enemigos[i].x,this.enemigos[i].y))
      }

    } 
      
  }

  addShots(x,y){
    return {
			x: x,
			y: y,
			width: 30,
      height: 30,
      estado: "viva",
			contador: 0
		}
  }

  updateEnemies(){

    if (juego.status == "iniciando") {
      for (var i = 0; i < 10; i++){
        this.enemigos.push({
          x: this.x + (Math.floor(Math.random()*700)),
					y: this.y + (Math.floor(Math.random() * 100)),
					height: this.width,
					width: this.height,
					estado:'vivo',
					contador:0
        })
        //this.draw()
      }
      juego.status = "jugando"
      
      }

      for(var i in this.enemigos){
        var enemigo  = this.enemigos[i]
        if(!enemigo) continue
        if(enemigo && enemigo.estado == "vivo"){
          enemigo.contador ++
          enemigo.x += Math.sin(enemigo.contador * Math.PI / 90)*3
        }

    }
  }

  aleatorio(inferior,superior){
    var posibilidades = superior - inferior;
    var a = Math.random() * posibilidades;
    a = Math.floor(a);
    return parseInt(inferior) + a;
  }

  drawEnemyShots(){
    for(var i in this.disparosEnemigos){
      var disparo = this.disparosEnemigos[i];
      ctx.save()
      ctx.drawImage(this.imageEnemyshot,disparo.x,disparo.y, disparo.width, disparo.height);
      ctx.restore()
	  }
  }

  moveEnemyShots(){
    //ctx.save()
    for (var i in this.disparosEnemigos) {
      var disparo = this.disparosEnemigos[i];
      disparo.y +=5;
    };
    this.disparosEnemigos.filter(function (disparo){
      return disparo.y < canvas.height;
    });
    //ctx.restore()
  }

  


}

// Instancias

var board = new Board()
var nave_uno = new Nave()
var nave_enemiga = new NaveEnemiga()
// Funciones principales

function update(){
  // Borramos el canvas -> funciona como borrador
  frame++
  ctx.clearRect(0,0,canvas.width,canvas.height)
  board.draw()
  updateGameStatus()
  nave_uno.draw()
  nave_uno.drawShots()
  nave_uno.moveShots()
  nave_enemiga.updateEnemies()
  nave_enemiga.draw()
  nave_enemiga.drawEnemyShots()
  nave_enemiga.moveEnemyShots()
  checkCollition()
  dibujarTextos()
}

function checkCollition(){

  for (let i = 0; i < nave_uno.shots.length; i++) {
    let disparo = nave_uno.shots[i];

    nave_enemiga.enemigos.forEach(enemigo => {
      if (hit(disparo,enemigo)) {
        //ctx.drawImage(images.blastEnemy, enemigo.x, enemigo.y)
        enemigo.estado = "hit"
        enemigo.contador = 0  
        console.log("Hubo contacto")
        let index = nave_enemiga.enemigos.indexOf(enemigo)
        nave_enemiga.enemigos.splice(index,1)
        console.log(nave_enemiga.enemigos)
      
      }
      
    })
    
  }
    

    for(var k in nave_uno.shots){
      var disparo = nave_uno.shots[k]

      nave_enemiga.disparosEnemigos.forEach( bala =>{
        //var disparo_enemigo = nave_enemiga.disparosEnemigos[l]

        if(hit(bala, disparo)){
          //bala = "hit"
          //disparo_enemigo.contador = 0
          console.log("Bala eliminada")
          let index = nave_enemiga.disparosEnemigos.indexOf(bala)
          nave_enemiga.disparosEnemigos.splice(index,1)
        }
      })

    }

  

  if (nave_uno.status == "hit" || nave_uno.estado == "muerto") {
    return 
  }
  for (var i in nave_enemiga.disparosEnemigos){
    var disparo = nave_enemiga.disparosEnemigos[i]
    if(hit(disparo,nave_uno)){
      nave_uno.status = "hit"
      console.log("contacto")
    }
  }

}

function hit(a,b)
{
	
	var hit = false;
	
	if (b.x + b.width >= a.x && b.x < a.x + a.width)
	{
		if(b.y + b.height >= a.y && b.y < a.y + a.height) hit = true;
	}

	if(b.x <= a.x && b.x + b.width >= a.x + a.width)
	{
		if(b.y <= a.y && b.y + b.height >= a.y + a.height) hit = true;
	}
	
	if(a.x <= b.x && a.x + a.width >= b.x + b.width)
	{
		if(a.y <= b.y && a.y + a.height >= b.y + b.height) hit = true;
	}

	return hit;
}


function dibujarTextos(){
  if (texto.contador == -1) {
    return
  }
  var alpha = texto.contador/50.0
  if (alpha > 1) {
    for(var i in nave_enemiga.enemigos){
      delete nave_enemiga.enemigos[i]
    }
  }

  ctx.save()
  ctx.globalApha = alpha
  if (juego.status == "perdido") {
    ctx.fillStyle = "white"
    ctx.font = 'Bold 40pt  Space Mono'
    ctx.fillText(texto.titulo, 140, 200)
    tx.font = '14pt  Arial'
    ctx.fillText(texto.subtitulo,190,250)
  }
  if (juego.status == "victoria") {
    ctx.fillStyle = "white"
    ctx.font = 'Bold 40pt Space Mono'
    ctx.fillText(texto.titulo, 100, 200)
    ctx.font = '14pt  Arial'
    ctx.fillText(texto.subtitulo,100,250)
  }

}

function updateGameStatus(){
  if (juego.status == "jugando" && nave_enemiga.enemigos.length == 0) {
    juego.status = "victoria"
    texto.titulo = 'Derrotaste a los invasores',
    texto.subtitulo = 'Presiona la tecla R para reiniciar'
    texto.contador = 0
  }
  if (texto.contador >= 0) {
    texto.contador ++
  }

  //console.log(juego.status)
  //console.log(nave_enemiga.enemigos.length)
}


function start(){
  if (interval) return
  frame = 0
  //nave_enemiga.disparosEnemigos = []
  interval = setInterval(update, 1000/60)
}

// Observers

addEventListener('keydown', (ev)=>{

  // Movimiento a la izquierda

  if (ev.keyCode === 37){
		nave_uno.x -=6;
		if (nave_uno.x <0) nave_uno.x=0;
	}
	//movimiento a la derecha
	if (ev.keyCode === 39){
		var limite = canvas.width - nave_uno.width;
		nave_uno.x +=6;
		if (nave_uno.x > limite) nave_uno.x = limite;
  }
  
  // disparos
	if (ev.keyCode === 32){
		nave_uno.fire()	
	}


})


start()