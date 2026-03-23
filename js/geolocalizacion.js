export class Geolocalizacion {
    constructor() {
        this.map = null;
        this.marker = null;
        this.init();
        this.setupEventListeners();
    }
    
    init() {
        this.map = L.map('map').setView([40.4168, -3.7038], 6);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(this.map);
    }
    
    setupEventListeners() {
        const miUbicacionBtn = document.getElementById('miUbicacionBtn');
        const buscarCiudadBtn = document.getElementById('buscarCiudadBtn');
        
        if (miUbicacionBtn) miUbicacionBtn.addEventListener('click', () => this.getLocation());
        if (buscarCiudadBtn) buscarCiudadBtn.addEventListener('click', () => this.searchCity());
    }
    
    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    this.updateMap(latitude, longitude);
                    document.getElementById('coordinates').innerHTML = `📍 Lat: ${latitude.toFixed(4)}°, Lon: ${longitude.toFixed(4)}°`;
                    this.showNotification('✅ Ubicación obtenida correctamente');
                },
                () => this.showNotification('❌ Error al obtener ubicación')
            );
        } else {
            this.showNotification('❌ Tu navegador no soporta geolocalización');
        }
    }
    
    searchCity() {
        const city = document.getElementById('cityInput').value;
        if (!city) {
            this.showNotification('Ingresa el nombre de una ciudad');
            return;
        }
        
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    this.updateMap(data[0].lat, data[0].lon);
                    document.getElementById('coordinates').innerHTML = `📍 ${data[0].display_name}`;
                    this.showNotification(`📍 Mostrando: ${city}`);
                } else {
                    this.showNotification('❌ Ciudad no encontrada');
                }
            })
            .catch(() => this.showNotification('❌ Error al buscar'));
    }
    
    updateMap(lat, lon) {
        this.map.setView([lat, lon], 13);
        if (this.marker) this.marker.remove();
        this.marker = L.marker([lat, lon]).addTo(this.map);
        this.marker.bindPopup('📍 Ubicación').openPopup();
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}