function authenticate(){
    const form = document.getElementById("login-form");

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("admin-email").value;
        const password = document.getElementById("admin-password").value;

        if (email === "admin@gmail.com" && password === "admin@123") {
            localStorage.setItem("loggedIn", "true");
            window.location.href = "home.htm";
        } else {
            alert("Invalid email or password.");
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
    authenticate();
})