if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "adminLoginSecurity.htm";
}

function logout() {
    localStorage.removeItem("loggedIn");
    window.location.href = "adminLoginSecurity.htm";
}