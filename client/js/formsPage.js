const { setFetchPostOrPutRequestDetails } = require("./utils");

window.onload = () => {
    addListeners();
}

async function validateForm(event) {
    const fetchDetails = {
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include'
    };
    event.preventDefault();
    console.log('Form submission initiated');
    let isValid = true;
    document.querySelectorAll('.error').forEach(error => error.textContent = '');
    const petNameElement = document.getElementById('pet-name');
    const petChipElement = document.getElementById('pet-chip-num');
    const cityElement = document.getElementById('city');
    const addressElement = document.getElementById('last-seen-address');
    const moreInformationElement = document.getElementById('more-information');
    const photosElement = document.getElementById('photos');
    if (!petNameElement || !petChipElement || !cityElement || !addressElement || !moreInformationElement || !photosElement) {
        console.error('One or more form elements are missing in the DOM');
        return false;
    }
    const petBehavior = Array.from(document.querySelectorAll('input[name="pet_behavior"]:checked')).map(cb => cb.value).join(',');
    if (!petBehavior) {
        isValid = false;
        alert('Please select at least one pet behavior');
    }
    const petName = petNameElement.value.trim();
    const petChip = petChipElement.value.trim();
    const city = cityElement.value.trim();
    const address = addressElement.value.trim();
    const moreInformation = moreInformationElement.value.trim();
    const photos = Array.from(photosElement.files).map(file => file.name).join(',');
    const category = "Lost";
    const todayDate = new Date();
    if (!petName) {
        document.getElementById('pet-name-error').textContent = 'Pet Name is required';
        isValid = false;
    }
    if (!petChip) {
        document.getElementById('pet-chip-num-error').textContent = 'Pet Chip Number is required';
        isValid = false;
    }
    if (photos.length < 1) {
        document.getElementById('photos-error').textContent = 'At least one photo is required';
        isValid = false;
    }
    if (!city) {
        document.getElementById('city-error').textContent = 'City is required';
        isValid = false;
    }
    if (!address) {
        document.getElementById('last-seen-address-error').textContent = 'Last Seen Address is required';
        isValid = false;
    }
    if (!moreInformation) {
        document.getElementById('more-information-error').textContent = 'More Information is required';
        isValid = false;
    }
    if (isValid) {
        const data = {
            pet_name: petName,
            pet_chip_number: petChip,
            pet_behavior: petBehavior,
            photos: photos,
            city: city,
            last_seen_address: address,
            more_information: moreInformation,
            category: category,
            date: todayDate,
            unique_id: Date.now()
        };
        console.log("Data to be sent:", data); 
        try {
            const response = await fetch('http://localhost:8080/api/lostpetform/submit', {method:"POST", body:JSON.stringify(data), ...fetchDetails})
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log('Success:', result);
            window.location.href = "./index.html";
        } catch (error) {
            console.error('Error:', error);
        }
    }
    return false;
}

function addListeners() {
    let addReport = document.getElementById("addReport");
    addReport.addEventListener("click", () => {
        window.location.href = "./reportType.html";
    });
    let mapButton = document.getElementById("homeMap");
    mapButton.addEventListener("click", () => {
        window.location.href = "./index.html"
    });
    let scanButton = document.getElementById("scanPet");
    scanButton.addEventListener("click", () => {
        window.location.href = "#";
    });

    document.getElementById('lost-report-form').addEventListener('submit', validateForm);
}
