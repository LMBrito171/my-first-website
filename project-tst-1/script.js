function sayHello() {
    alert('You clicked the button! Welcome to your first site.');
  }
  
  const button = document.getElementById("toggle-theme");

  button.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });