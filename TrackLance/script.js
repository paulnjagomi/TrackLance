// Authentication
function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  if (username === "admin" && password === "admin123") {
    document.getElementById('loginSection').style.display = "none";
    document.getElementById('adminSection').style.display = "block";
    renderParcelList();
  } else {
    alert("Invalid credentials!");
  }
}

// Save parcel
function saveParcel() {
  const id = document.getElementById('parcelId').value.trim();
  const status = document.getElementById('parcelStatus').value.trim();
  const lat = parseFloat(document.getElementById('parcelLat').value.trim());
  const lng = parseFloat(document.getElementById('parcelLng').value.trim());

  if (!id || !status) {
    alert("Tracking ID and Status are required");
    return;
  }

  let parcels = JSON.parse(localStorage.getItem('parcels')) || {};
  parcels[id] = { status, lat, lng };
  localStorage.setItem('parcels', JSON.stringify(parcels));

  alert("Parcel saved!");
  renderParcelList();
}

// Render parcel list
function renderParcelList() {
  const parcelList = document.getElementById('parcelList');
  if (!parcelList) return;
  parcelList.innerHTML = "";
  const parcels = JSON.parse(localStorage.getItem('parcels')) || {};
  for (let id in parcels) {
    const li = document.createElement('li');
    li.textContent = id + " - " + parcels[id].status +
      (parcels[id].lat && parcels[id].lng ? ` (Lat: ${parcels[id].lat}, Lng: ${parcels[id].lng})` : "");
    parcelList.appendChild(li);
  }
}

// Track parcel on index.html
function trackParcel() {
  const id = document.getElementById('trackingId').value.trim();
  const parcels = JSON.parse(localStorage.getItem('parcels')) || {};
  const resultDiv = document.getElementById('result');
  const mapDiv = document.getElementById('map');
  resultDiv.innerHTML = "";
  mapDiv.innerHTML = "";

  if (parcels[id]) {
    resultDiv.innerHTML = `<p>Status: ${parcels[id].status}</p>`;
    if (parcels[id].lat && parcels[id].lng) {
      const map = L.map('map').setView([parcels[id].lat, parcels[id].lng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
      L.marker([parcels[id].lat, parcels[id].lng]).addTo(map)
        .bindPopup("Parcel " + id)
        .openPopup();
    } else {
      resultDiv.innerHTML += "<p>No location available.</p>";
    }
  } else {
    resultDiv.innerHTML = "<p>Tracking ID not found.</p>";
  }
}
