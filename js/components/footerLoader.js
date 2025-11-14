document.addEventListener("DOMContentLoaded", function() {
  const footerElement = document.querySelector('footer');
  if (footerElement) {
    fetch('/components/footer.html')
      .then(response => response.text())
      .then(data => {
        footerElement.innerHTML = data;
      });
  }
});
