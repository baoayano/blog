const themeToggle = document.getElementById("themeToggle");
const lightIcon = document.getElementById("light-icon");
const darkIcon = document.getElementById("dark-icon");

window.onload = () => {
    themeToggle?.addEventListener("click", (e) => {
        e.preventDefault();
        const isDark = document.documentElement.classList.toggle("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        if (lightIcon && darkIcon) {
            lightIcon.classList.toggle("hidden", !isDark);
            darkIcon.classList.toggle("hidden", isDark);
        }
    });

    // Initialize icons based on current theme
    const themeValue = localStorage.getItem("theme") || "dark";
    if (lightIcon && darkIcon) {
        lightIcon.classList.toggle("hidden", themeValue === "light");
        darkIcon.classList.toggle("hidden", themeValue === "dark");
    }
}