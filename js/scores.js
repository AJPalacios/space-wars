
function loadData(){
  let users_scores = firebase.database().ref('users')
  users_scores.on('child_added', function(data){
    
    var datos = document.getElementById('table-body')
    var item = data.val()

    datos.innerHTML += `<tr>
                          <td>${item.nombre}</td>
                          <td>${item.score}</td>
                        </tr>`

  })
}




  
  
  
 
  






