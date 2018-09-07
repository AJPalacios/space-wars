let database = firebase.database().ref('users').push();

var form = document.getElementById('my-form')
var nombre = document.getElementById('name')
var enviar = document.getElementById('submit-button')
var score = document.getElementById('bind')
var bind_score = document.getElementById('score')

enviar.addEventListener('click',(ev)=>{
  ev.preventDefault();
  submitScore()
  form.reset()
})

function submitScore(){
  database.set({
    nombre: nombre.value,
    score: score.value
  })
}


