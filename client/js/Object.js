
window.onload = () => {

    initMap();
    fetch("http://localhost:8080/api/pets/innerJoinUsersLostPets",{method: 'GET'})
        .then((response) => response.json())
        .then((data) => initReportPage(data));

    addListeners();
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

    document.querySelector('.card-control-next').addEventListener('click', () => {
        moveCard('next');
    });
    document.querySelector('.card-control-prev').addEventListener('click', () => {
        moveCard('prev');
    });
    
document.querySelectorAll('.card-image').forEach(image => {
    image.addEventListener('click', function () {
        const modalImage = document.getElementById('modalImage');
        modalImage.src = this.src;
        const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
        imageModal.show();
    });
});
}

let map;
let markers = [];
async function initMap() {
    const position = { lat: 32.4764688287259, lng: 34.97601741898383 };
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    map = new Map(document.getElementById("map-object"), {
        zoom: 17,
        center: position,
        mapId: 'fa16877c291d0875',
    });
}

function initReportPage(data) {
    const params = new URLSearchParams(window.location.search);
    const myParam = params.get("reportId");
    const userId = params.get("userId");
    const report = data.find((report) => report.id == myParam);
    if (report) {
        if (userId == report.user_id) {
            let editSection = document.getElementById("Edit");
            if (editSection) {
                editSection.style.display = "block";
            }
            let deleteSection = document.getElementById("deleteObject");
            if (deleteSection) {
                deleteSection.style.display = "block";
            }
            document.getElementById("EditButton").addEventListener("click", () => {
                window.location.href = `./Edit.html?reportId=${report.id}`;
            });
            document.getElementById("deleteButton").addEventListener("click", () => {
                fetch(`http://localhost:8080/api/pets/${report.id}`, {
                    method: 'DELETE',
                })
                    .then(response => response.json())
                    .then(data => {
                        window.location.href = "./index.html";
                    });
            });
        }
        document.getElementById("PetNameP").innerText = report.pet_name;
        document.getElementById("LastSeenP").innerText = report.last_seen_address + ", " + report.city;
        let BarkingIcon = document.getElementById("petBarking");
        let BitingIcon = document.getElementById("petBiting");
        let AfraidIcon = document.getElementById("petAfraid");
        let petBehavior = report.pet_behavior;
        let barking = petBehavior.includes("barking");
        let biting = petBehavior.includes("biting");
        let afraid = petBehavior.includes("afraid");

        if (barking == true) {
            BarkingIcon.style.backgroundImage = "url('http://localhost:8080/imges/vIcon.png')";
        }
        else {
            BarkingIcon.style.backgroundImage = "url('http://localhost:8080/imges/xIcon.png')";
        }
        if (biting == true) {
            BitingIcon.style.backgroundImage = "url('http://localhost:8080/imges/vIcon.png')";
        }
        else {
            BitingIcon.style.backgroundImage = "url('http://localhost:8080/imges/xIcon.png')";
        }
        if (afraid == true) {
            AfraidIcon.style.backgroundImage = "url('http://localhost:8080/imges/vIcon.png')";
        }
        else {
            AfraidIcon.style.backgroundImage = "url('http://localhost:8080/imges/xIcon.png')";
        }
        initMoreInfoBody(report);

        let cardImages = document.getElementsByClassName("card-image");
        let imagePet = report.photos;
        let imageArray = getImageArray(imagePet);
        if (imageArray.length < 3) {
            for (let j = imageArray.length; j < 3; j++) {
                imageArray.push(imageArray[0]);
            }
        }
        for (let i = 0; i < cardImages.length; i++) {
            cardImages[i].src = `http://localhost:8080/imges/PetsImges/${imageArray[i]}`;
            cardImages[i].alt = imageArray[i];
        }

        PutMarkerOnMap(report.last_seen_address + ", " + report.city);
    }
}


function getImageArray(imageString) {
    if (!imageString) {
        return []; 
    }
    return imageString.includes(',') ? imageString.split(',').map(img => img.trim()) : [imageString.trim()];
}

function PutMarkerOnMap(address) {
    const geocoder = new google.maps.Geocoder();  
    const iconMap =
    {
        path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
        fillColor: "orange",
        fillOpacity: 0.8,
        strokeWeight: 0,
        rotation: 0,
        scale: 2

    };
    geocoder.geocode({ address: address }, (results, status) => {
        if (status === "OK") {
            const marker = new google.maps.Marker({
                position: results[0].geometry.location,
                map: map,
                icon: iconMap,
                Animation: google.maps.Animation.DROP,
            });
            map.setCenter(results[0].geometry.location);
            map.setZoom(17);
            markers.push(marker);
        }
    });
}

function initMoreInfoBody(report){
document.getElementById('moreInfoButton').addEventListener('click', function () {
    const moreInfoMoadal = document.getElementById('MoreinfoModal');
    const moreInfo = new bootstrap.Modal(moreInfoMoadal);
    moreInfo.show();
    const modalBody = document.getElementsByClassName('modal-body')[0];
    modalBody.innerHTML = report.more_information;
    document.getElementById('closeMoreInfo').addEventListener('click', function () {
        moreInfo.hide();
    });
});
}

document.querySelector('.share-btn').addEventListener('click', function() {
    window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(window.location.href), '_blank');
});

function moveCard(direction) {
    const wrapper = document.querySelector('.card-wrapper');
    const cards = Array.from(document.querySelectorAll('.card-item'));
    if (direction === 'next') {
        wrapper.appendChild(cards[0]);
    } else {
        wrapper.insertBefore(cards[cards.length - 1], cards[0]);
    }
    cards.forEach(card => card.classList.remove('active'));
    const updatedCards = Array.from(document.querySelectorAll('.card-item'));
    updatedCards[1].classList.add('active');
}
