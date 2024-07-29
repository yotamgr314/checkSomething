/* const { setFetchGetOrDeleteRequestDetails } = require("./utils");
 */
import { setFetchGetOrDeleteRequestDetails } from "./utils.js";

window.onload = function () {
    addListeners(); 
    initMap();
    fetch("http://localhost:8080/api/pets/innerJoinUsersDistressedPets",setFetchGetOrDeleteRequestDetails("GET"))
        .then(response => response.json())
        .then(data => initDistressPetPage(data));
}


let map;
let markers = [];
async function initMap() {
    const fetchDetails = {
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include'
    };

    const position = { lat: 32.4764688287259, lng: 34.97601741898383 };
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    map = new Map(document.getElementById("map-object"), {
        zoom: 17,
        center: position,
        mapId: 'fa16877c291d0875',
    });
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
}

function initDistressPetPage(data) {
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
                fetch(`http://localhost:8080/api/distressedpetreport/${report.id}`, {method: 'DELETE', ...fetchDetails})
                    .then(response => response.json())
                    .then(data => {
                        window.location.href = "./index.html";
                    });
            });
        }
        let problem_box=document.getElementById("problem-box");
        let help_box=document.getElementById("help-box");
        let urgency_box=document.getElementById("urgency-box");
        problem_box.innerHTML=report.the_prob_and_pet_condition;
        help_box.innerHTML=report.how_to_help;
        urgency_box.innerHTML=report.urgency;
        PutMarkerOnMap(report.last_seen_address + ", " + report.city);
    }
}


function PutMarkerOnMap(address) {
    const geocoder = new google.maps.Geocoder();  
    const iconMap =
    {
        path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
        fillColor: "red",
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


