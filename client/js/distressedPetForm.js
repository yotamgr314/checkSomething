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

    const petChipElement = document.getElementById('pet-chip-number'); // new line edited
    const theProbAndPetConditionElement = document.getElementById('the-prob-and-pet-condition'); // new line edited
    const photosElement = document.getElementById('distressedPetPhotos'); // new line edited
    const cityElement = document.getElementById('distressedPetCity'); // new line edited
    const lastSeenAddressElement = document.getElementById('distressedPetLastSeenAddress'); // new line edited
    const moreInformationElement = document.getElementById('distressedPetMoreInformation'); // new line edited
    const urgencyElement = document.getElementById('urgency'); // new line edited

    if (!petChipElement || !theProbAndPetConditionElement || !photosElement || !cityElement || !lastSeenAddressElement || !moreInformationElement || !urgencyElement) {
        console.error('One or more form elements are missing in the DOM');
        return false;
    }

    const petDistressSigns = Array.from(document.querySelectorAll('input[name="pet_distress_signs"]:checked')).map(cb => cb.value).join(','); // new line edited

    if (!petDistressSigns) {
        isValid = false;
        alert('Please select at least one distress sign');
    }

    const petChip = petChipElement.value.trim(); // new line edited
    const theProbAndPetCondition = theProbAndPetConditionElement.value.trim(); // new line edited
    const city = cityElement.value.trim(); // new line edited
    const lastSeenAddress = lastSeenAddressElement.value.trim(); // new line edited
    const moreInformation = moreInformationElement.value.trim(); // new line edited
    const urgency = urgencyElement.value; // new line edited
    const photos = Array.from(photosElement.files).map(file => file.name).join(','); // new line edited

    if (!petChip) {
        document.getElementById('pet-chip-error').textContent = 'Pet Chip Number is required';
        isValid = false;
    }
    if (!theProbAndPetCondition) {
        document.getElementById('the-prob-and-pet-condition-error').textContent = 'The problem and condition of the pet are required';
        isValid = false;
    }
    if (photos.length < 1) {
        document.getElementById('distressedPetPhotosError').textContent = 'At least one photo is required';
        isValid = false;
    }
    if (!city) {
        document.getElementById('distressedPetCity-error').textContent = 'City is required';
        isValid = false;
    }
    if (!lastSeenAddress) {
        document.getElementById('distressedPetLastSeenAddressError').textContent = 'Last Seen Address is required';
        isValid = false;
    }
    if (!moreInformation) {
        document.getElementById('distressedPetMoreInformationError').textContent = 'How to help is required';
        isValid = false;
    }

    if (isValid) {
        const data = {
            pet_chip_number: petChip,
            the_prob_and_pet_condition: theProbAndPetCondition,
            pet_distress_signs: petDistressSigns,
            photos: photos,
            city: city,
            last_seen_address: lastSeenAddress,
            how_to_help: moreInformation,
            urgency: urgency,
            date: new Date().toISOString().split('T')[0],
            category: "Distressed"
        };

        console.log("Data to be sent:", data); 
        try {
            const response = await fetch('http://localhost:8080/api/distressedpetreport', {method:"POST", body:JSON.stringify(data), ...fetchDetails})
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
    const form = document.getElementById("distressed-pet-form"); // new line added
    form.onsubmit = validateForm; // new line added

    let addReport = document.getElementById("addReport");
    addReport.onclick = () => {
        window.location.href = "./reportType.html";
    };
    let mapButton = document.getElementById("homeMap");
    mapButton.onclick = () => {
        window.location.href = "./index.html";
    };
    let scanButton = document.getElementById("scanPet");
    scanButton.onclick = () => {
        window.location.href = "#";
    };
}
