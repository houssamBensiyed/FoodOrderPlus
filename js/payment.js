const fullName = document.getElementById('name')
const address = document.getElementById('address')
const email = document.getElementById('email')
const phone =  document.getElementById('phone')
const submitBtn = document.getElementById('submit-btn')

const fullNameError = document.getElementById('name-error')
const addressError = document.getElementById('address-error')
const emailError = document.getElementById('email-error')
const phoneError = document.getElementById('phone-error')





const validate = (e) => {
    e.preventDefault();
    let isValide = true;

        if(fullName.value.trim() == ''){
            showError(fullNameError,'Name cannot be empty.')
            isValide = false
        }else if(fullName.value.length < 8){
            showError(fullNameError,'ful name must be at least 8 characters long.')
            isValide = false
        }else{
            hideError(fullNameError)
        }

        if(address.value.trim() == ''){
            showError(addressError,'Adress cannot be empty.')
            isValide = false
        }else{
            hideError(addressError)
        }


        if(email.value.trim() == ''){
            showError(emailError,'Email cannot be empty.')
            isValide = false
        }else if(!validateEmail(email.value)){
            showError(emailError,'Enter a valide email')
            isValide = false
        }else{
            hideError(emailError)
        }


        if(phone.value.trim() == ''){
            showError(phoneError,'Phone number cannot be empty.')
            isValide = false
        }else if(!/^[+]?[0-9\s-]{6,15}$/.test(phone.value)){
            showError(phoneError,'Enter a valide number')
            isValide = false
        }else{
            hideError(phoneError)
        }

        if(isValide){
            console.log({
                'name': fullName.value,
                'adress' : address.value,
                'phone number' : phone.value,
                'email' : email.value
            });   
        }
    
}

function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
}


function hideError(element) {
    element.textContent = '';
    element.style.display = 'none';
}


const validateEmail = (email) =>{
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

submitBtn.addEventListener('click', validate)
