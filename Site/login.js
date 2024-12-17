$(document).ready( () => {
    $('#login').on('submit', async (event) => {
        event.preventDefault(); //stops the form from submitting and breaking out of the function early
        const data = {
            username: $('#username').val(),
            password: $('#password').val()
        }

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.success) {
                window.sessionStorage.setItem("user", data.username);
                window.location.href = `profile.html`; // Redirect to the user page on successful login
            } else {
                console.log(result.message);
            }
        } catch (e) {
            console.log(e);
        }
    })
});