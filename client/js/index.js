window.onload = () => {
  initMap();
  fetch("http://localhost:8080/api/users",{method: 'GET'})
    .then(response => response.json())
    .then(data => ReplaceUrToUserID(data))

  fetch("http://localhost:8080/api/pets/innerJoinUsersLostPets",{method: 'GET'})
    .then(response => response.json())
    .then(data => initPetList(data))
  fetch("http://localhost:8080/api/pets/innerJoinUsersDistressedPets",{method: 'GET'})
    .then(response => response.json())
    .then(data => initPetList(data))

  fetch("http://localhost:8080/api/pets/innerJoinUsersLostPets",{method: 'GET'})
    .then(response => response.json())
    .then(data => InitMarkerOnMap(data))
    fetch("http://localhost:8080/api/pets/innerJoinUsersDistressedPets",{method: 'GET'})
    .then(response => response.json())
    .then(data => InitMarkerOnMap(data))
  addListeners();
}

function ReplaceUrToUserID(data) {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("userId");


  const staticUserId = data[0].UserId; 


  if (!userId) {

    params.set("userId", staticUserId);
    const newUrl = `${window.location.pathname}?${params.toString()}`;

    window.history.replaceState({}, '', newUrl);
  }

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

let map;
let markers = [];
async function initMap() {
  const position = { lat: 32.4764688287259, lng: 34.97601741898383 };
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  map = new Map(document.getElementById("map"), {
    zoom: 17,
    center: position,
    mapId: 'fa16877c291d0875',
  });

  const myLocation = new AdvancedMarkerElement({
    position: position,
    map: map,
    title: "My Location",
  });
}

function InitMarkerOnMap(data) {
  const userId=new URLSearchParams(window.location.search).get("userId");
  for (const report of data) {
    const geocoder = new google.maps.Geocoder();
    const address = report.last_seen_address + "," + report.city;
    let marker = new google.maps.Marker();
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === "OK") {
        const iconMap =
        {
          path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
          fillColor: checkCategory(`${report.category}`),
          fillOpacity: 0.8,
          strokeWeight: 0,
          rotation: 0,
          scale: 2

        };
        marker = new google.maps.Marker({
          position: results[0].geometry.location,
          map: map,
          title: report.UserName,
          icon: iconMap,
          id: report.id,
          Animation: google.maps.Animation.DROP,
        });
        let infoWindow = new google.maps.InfoWindow;
        if (report.category === "Lost") {
        infoWindow = new google.maps.InfoWindow({
          content: `<a href="./Object.html?userId=${userId}&reportId=${report.id}"><img src="http://localhost:8080/imges/Owners/${report.UserImage}" alt="UserImage" class="roundImg"></a> <h5>Lost</h5>`
        });
      }
      if (report.category === "Distressed") {
        infoWindow = new google.maps.InfoWindow({
          content: `<a href="./distressedPetObject.html?userId=${userId}&reportId=${report.id}"><img src="http://localhost:8080/imges/Owners/${report.UserImage}" alt="UserImage" class="roundImg"></a> <h5>Distressed</h5>`
        });
      }
        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
      }
      markers.push(marker);
    });
  }

}

function checkCategory(category) {
  if (category === "Lost") {
    return "orange";
  }
  if (category === "Distressed") {
    return "red";
  }
}

function initPetList(data) {
  let ul = document.getElementById("ListReports");
  let userId=new URLSearchParams(window.location.search).get("userId");
  if (!userId) {
    userId = 1;
  }
  for (const report of data) {
    let section = document.createElement("section");
    section.classList.add("report");
    section.id = report.id;

    let sectionUser = document.createElement("section");
    sectionUser.classList.add("user");

    let aUserImage = document.createElement("a");
    aUserImage.classList.add("userImage");
    aUserImage.href = "#";

    let userImage = `<img src="http://localhost:8080/imges/Owners/${report.UserImage}" alt="UserImage">`;
    aUserImage.innerHTML = userImage;
    sectionUser.appendChild(aUserImage);

    let divUserName = document.createElement("div");
    divUserName.classList.add("userName");
    let UserName = `<h3>${report.UserName}</h3>`;
    divUserName.innerHTML = UserName;

    let divCategory = document.createElement("div");
    divCategory.classList.add(witchCategory(report.category));
    let reportCategory = '';
    if (report.category === "Distressed") {
      reportCategory = `<p>Distressed</p>`;
    }
    else {
      reportCategory = `<p>Lost</p>`;
    }
    divCategory.innerHTML = reportCategory;
    divUserName.appendChild(divCategory);

    sectionUser.appendChild(divUserName);

    let divLocation = document.createElement("div");
    divLocation.classList.add("location");
    let reportLocation = `<h3>${report.city}</h3>`;
    divLocation.innerHTML = reportLocation;

    let aArrowIcon = document.createElement("a");
    aArrowIcon.classList.add("arrow");
    if (report.category === "Lost") {
      aArrowIcon.href = `./Object.html?userId=${userId}&reportId=${report.id}`;
    }
    if (report.category === "Distressed") {
      aArrowIcon.href = `./distressedPetObject.html?userId=${userId}&reportId=${report.id}`;
    }
    let aArrow = `<img src="http://localhost:8080/imges/arrowicon.png" alt="arrow">`
    aArrowIcon.innerHTML = aArrow;

    let divLastUpdate = document.createElement("div");
    divLastUpdate.classList.add("lastUpdate");
    let reportLastUpdate = LastUpdat(report.date);
    let lastUpdate = `<h3>${reportLastUpdate}</h3>`;
    divLastUpdate.innerHTML = lastUpdate;

    if (report.UserId === 1) {
      let deleteButton = document.createElement("button");
      deleteButton.classList.add("delete");
      deleteButton.id = report.id;
      deleteButton.addEventListener("click", () => {
        deleteReport(report.id);
      });
      deleteButton.innerHTML = "Delete";
      divUserName.appendChild(deleteButton);
    }

    section.appendChild(sectionUser);
    section.appendChild(divLastUpdate);
    section.appendChild(divLocation);
    section.appendChild(aArrowIcon);
    ul.innerHTML += section.outerHTML;
  }

}

function witchCategory(category) {
  if (category === "Lost") {
    return "Ycategory";
  }
  if (category === "Distress") {
    return "Rcategory";
  }
}

function LastUpdat(date) {
  let dateNow = new Date();
  let dateReport = new Date(date);
  let diff = dateNow - dateReport;
  let minutes = Math.floor(diff / 60000);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);
  let weeks = Math.floor(days / 7);
  let months = Math.floor(weeks / 4);
  let years = Math.floor(months / 12);
  if (years > 0) {
    return `${years} years ago`;
  }
  if (months > 0) {
    return `${months} months ago`;
  }
  if (weeks > 0) {
    return `${weeks} weeks ago`;
  }
  if (days > 0) {
    return `${days} days ago`;
  }
  if (hours > 0) {
    return `${hours} hours ago`;
  }
  if (minutes > 0) {
    return `${minutes} minutes ago`;
  }
  return "Just now";
}

function deleteReport(reportId) {

  fetch(`http://localhost:8080/api/pets/${reportId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => deleteReportItemFromList(response, reportId))
}

function deleteReportItemFromList(response, reportId) {
  if (response.ok) {
    let report = document.getElementById(reportId);
    report.remove();
    removeMarker(reportId);
  }
  else {
    alert("Error: " + response.status);
  }
}

function removeMarker(reportId) {
  for (let i = 0; i < markers.length; i++) {
    if (markers[i].id === reportId) {
      markers[i].setMap(null);
      markers.splice(i, 1);
      break;
    }
  }

}



