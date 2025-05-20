function sayHello() {
    alert('You clicked the button! Welcome to your first site.');
  }
  
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
  
  const button = document.getElementById("toggle-theme");
  
  button.addEventListener("click", () => {
    // Toggle the dark class
    document.body.classList.toggle("dark");
  
    // Save the current theme to localStorage
    if (document.body.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  });