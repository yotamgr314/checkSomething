document.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const messageContainer = document.getElementById("message");

    messageContainer.innerHTML = '';

    const user = {
        email,
        password
    };

    try {
        console.log("Sending request to login user:", user);
        const response = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        console.log("Response status:", response.status);

        if (response.ok) {
            const data = await response.json();
            console.log("Login successful, data received:", data);
            showMessage("Login successful! Redirecting to homepage...", "success");
            localStorage.setItem("token", data.token);
            setTimeout(() => {
                window.location.href = "index.html"; // החלף בכתובת הדף המתאים
            }, 2000);
        } else {
            const errorData = await response.json();
            console.log("Error data:", errorData);
            showMessage("Login failed. Please try again.", "danger");
        }
    } catch (error) {
        console.error("Error during login:", error);
        showMessage("Login failed. Please try again later.", "danger");
    }
});

function showMessage(message, type) {
    const messageContainer = document.getElementById("message");
    messageContainer.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
}
