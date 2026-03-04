document.getElementById('Logg').addEventListener('submit', function(event){
     event.preventDefault();
  const uname = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  const error = document.getElementById('errorMessage');
  
  const USERNAME = 'Arcel';
  const PASSWORD = 'Pogi';
  
  if(uname === USERNAME &&  pass === PASSWORD){
    window.location.href ='index.html';
  }else {
    error.textContent = 'Invalid username or password, please try again.';
    error.style.display = 'block';
  }
 });
 function showPass() {
  
  const passInput = document.getElementById("password");
  if (passInput.type === "password") {
    passInput.type = "text";
  } else {
    passInput.type = "password";
  }
 }
