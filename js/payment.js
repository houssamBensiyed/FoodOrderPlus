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


// let testingDqata = [
//       {
//     "id": 1,
//     "image": "./images/salade-cesar.png",
//     "name": "Salade César",
//     "category": "entree",
//     "description": "Salade croquante avec poulet grillé, parmesan et sauce césar maison.",
//     "price": 6.5,
//     "size": ["S", "M", "L", "XL"],
//     "availability": true
//   },
//   {
//     "id": 2,
//     "image": "./images/soup-oignon.png",
//     "name": "Soupe à l’oignon",
//     "category": "entree",
//     "description": "Soupe traditionnelle française avec croûtons et fromage fondu.",
//     "price": 5.0,
//     "size": ["S", "M", "L", "XL"],
//     "availability": true
//   },
// ]


// localStorage.setItem('datPpanier',JSON.stringify(testingDqata))
const data = JSON.parse(localStorage.getItem('datPpanier'))


if (data) {
    const container = document.getElementById('products-payment');
    
    data.forEach(e => {
        const div = `
            <div class="bg-[#2F2828] h-28 p-5 rounded-lg text-white flex gap-8 items-center">
                <div class="w-20 h-20 bg-white rounded-lg bg-[url(${e.image})] bg-cover bg-center"></div>
                <div>
                    <h1 class="text-xl">${e.name}</h1>
                    <p>${e.price} MAD</p>
                </div>
            </div>`;
        
        container.innerHTML += div;
    });
}