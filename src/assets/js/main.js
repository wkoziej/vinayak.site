// Main JavaScript file for I to i to

// Add a simple animation to the navbar on scroll
document.addEventListener('DOMContentLoaded', function() {
  window.addEventListener('scroll', function() {
    const navbar = document.querySelector('header nav');
    if (window.scrollY > 50) {
      navbar.classList.add('shadow');
    } else {
      navbar.classList.remove('shadow');
    }
  });
}); 