document.getElementById("registerForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const messageContainer = document.getElementById("message");

    messageContainer.innerHTML = '';

    if (password !== confirmPassword) {
        showMessage("Passwords do not match", "danger");
        return;
    }

    const user = {
        username,
        email,
        password
    };

    try {
        console.log("Sending request to register user:", user);
        const response = await fetch("http://localhost:8080/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        console.log("Response status:", response.status);

        if (response.ok) {
            showMessage("Registration successful! Redirecting to login...", "success");
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
        } else {
            const errorData = await response.json();
            console.log("Error data:", errorData);
            showMessage("Registration failed. Please try again later.", "danger");
        }
    } catch (error) {
        console.error("Error during registration:", error);
        showMessage("Registration failed. Please try again later.", "danger");
    }
});

function showMessage(message, type) {
    const messageContainer = document.getElementById("message");
    messageContainer.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
}
