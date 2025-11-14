
document.addEventListener("DOMContentLoaded", function() {
  const headerElement = document.querySelector('header');
  if (headerElement) {
    fetch('/components/header.html')
      .then(response => response.text())
      .then(data => {
        headerElement.innerHTML = data;
        const script = document.createElement('script');
        script.src = '/js/components/header.js';
        document.body.appendChild(script);
      });
  }
});
