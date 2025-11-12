const formul = document.getElementById("formule");
   
console.log("hi");

formul.addEventListener('submit', (e) =>{
    e.preventDefault();

    const nom = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const question = document.getElementById("question").value.trim();

    const nomV = /^[A-Za-zÀ-ÿ\s'-]{2,}$/;
    const emailV = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; 
    const subjectV = /^.{3,}$/; 
    const questionV = /^.{10,}$/; 
    
    if(nom==='' || email===''|| subject==='' || question===''){
        alert("Please fill out all fields.");
        return ;
    }
  if (!nomV.test(nom)) {
    alert("The name must contain at least 2 letters and not include numbers.");
    return;
  }

  if (!emailV.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  if (!subjectV.test(subject)) {
    alert("The subject must contain at least 3 characters.");
    return;
  }

  if (!questionV.test(question)) {
    alert("The question must contain at least 10 characters.");
    return;
  }

  alert("Form sent successfully!");
  formul.reset();
});

