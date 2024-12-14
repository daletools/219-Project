$(document).ready( () => {
    $('#login').on('submit', async (event) => {
        event.preventDefault();
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
            console.log(result);

            if (result.success) {
                console.log(response);
                window.location.href = `userpage.html`; // Redirect to the user page, for example
            } else {
                console.log(result.message);
            }
        } catch (e) {
            console.log(e);
        }
    })
});