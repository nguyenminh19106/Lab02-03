// validate data

function signUp() {
    if (event)
        event.preventDefault();


    let name = document.getElementById('name').value
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
    console.log(name)
    if (name == "") {
        document.getElementById("nameError").innerHTML = "please enter name"
    }
    else if (email == "") {
        document.getElementById("email1`Error").innerHTML = "please enter email"
    }
}