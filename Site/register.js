$(document).ready( () =>{
    $('#signupForm').on('submit', async (event) => {
        event.preventDefault()
        const data = {
            username: $('#username').val(),
            password: $('#password').val()
        }

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.ok) {
                alert("Account created successfully!");
                window.location.href = "login.html";
            } else {
                alert("A problem occurred and your account was not created.");
            }
        } catch (e) {

        }
    })
})

document.getElementById('signupForm').addEventListener('submit', function () {
    alert("Account created successfully!");
    window.location.href = "login.html";
});


