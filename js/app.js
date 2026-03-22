// ===== MÓDULO 1: GEOLOCALIZACIÓN =====
const GeolocationModule = (function() {
    let map;
    let marker;

    function init() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    
                    document.getElementById('coordinates').innerHTML = 
                        `📍 Lat: ${lat.toFixed(4)}° | Lon: ${lon.toFixed(4)}°`;
                    
                    map = L.map('map').setView([lat, lon], 13);
                    
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '© OpenStreetMap'
                    }).addTo(map);
                    
                    marker = L.marker([lat, lon]).addTo(map)
                        .bindPopup('¡Estás aquí!')
                        .openPopup();
                },
                function(error) {
                    document.getElementById('coordinates').innerHTML = '❌ Error de ubicación';
                    map = L.map('map').setView([40.4168, -3.7038], 5);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
                }
            );
        }
    }

    return { init };
})();

// ===== MÓDULO 2: REDES SOCIALES =====
const SocialModule = (function() {
    function loadFeed() {
        const feed = document.getElementById('social-feed');
        
        const tweets = [
            { user: '@technews', avatar: '🔵', text: '¡Nuevo lanzamiento tecnológico! 🚀', likes: 234 },
            { user: '@developer', avatar: '💻', text: 'Aprendiendo JavaScript #WebDev', likes: 89 },
            { user: '@startup', avatar: '🚀', text: 'App disponible en todas plataformas 📱', likes: 567 },
            { user: '@designer', avatar: '🎨', text: 'Nuevo tutorial de UI/UX', likes: 123 }
        ];
        
        let html = '';
        tweets.forEach(tweet => {
            html += `
                <div class="twitter-post">
                    <div class="twitter-post-content">
                        <div style="width:50px;height:50px;background:#667eea;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;">
                            ${tweet.avatar}
                        </div>
                        <div class="twitter-post-text">
                            <strong>${tweet.user}</strong>
                            <p>${tweet.text}</p>
                            <small>❤️ ${tweet.likes} me gusta</small>
                        </div>
                    </div>
                </div>
            `;
        });
        
        feed.innerHTML = html;
    }

    return { loadFeed };
})();

// ===== MÓDULO 3: E-COMMERCE =====
const EcommerceModule = (function() {
    function search() {
        const query = document.getElementById('productInput').value.toLowerCase().trim();
        
        const products = {
            'laptop': { title: 'Ultrabook Pro 15"', price: '$999.99', icon: '💻' },
            'phone': { title: 'Smartphone X12', price: '$699.99', icon: '📱' },
            'watch': { title: 'Smartwatch Series 5', price: '$299.99', icon: '⌚' },
            'tablet': { title: 'Tablet Air 10"', price: '$449.99', icon: '📱' }
        };
        
        const product = products[query] || { 
            title: 'Producto encontrado', 
            price: '$49.99', 
            icon: '📦' 
        };
        
        document.getElementById('productTitle').textContent = product.title;
        document.getElementById('productPrice').textContent = product.price;
        document.querySelector('.product-result img').src = 
            `https://via.placeholder.com/100/667eea/ffffff?text=${encodeURIComponent(product.icon)}`;
    }

    return { search };
})();

// ===== MÓDULO 4: BASE DE DATOS =====
const DatabaseModule = (function() {
    let users = ['admin_usuario', 'invitado123', 'usuario_demo'];

    function updateList() {
        const list = document.getElementById('userList');
        let html = '';
        users.forEach(user => {
            html += `<div class="user-item"><i class="fas fa-user-circle"></i> ${user}</div>`;
        });
        list.innerHTML = html;
    }

    function saveUser() {
        const username = document.getElementById('username').value.trim();
        
        if (username && !users.includes(username)) {
            users.push(username);
            updateList();
            document.getElementById('username').value = '';
            showMessage('✅ Usuario guardado', 'db-form');
        } else if (users.includes(username)) {
            alert('❌ El usuario ya existe');
        } else {
            alert('❌ Ingresa un nombre');
        }
    }

    function showMessage(text, containerClass) {
        const msg = document.createElement('div');
        msg.className = 'success-message';
        msg.textContent = text;
        document.querySelector(`.${containerClass}`).appendChild(msg);
        setTimeout(() => msg.remove(), 2000);
    }

    return { saveUser, updateList };
})();

// ===== MÓDULO 5: PROTOCOLOS SMS =====
const SMSModule = (function() {
    function send() {
        const message = document.getElementById('smsMessage').value.trim();
        const notificationArea = document.getElementById('notificationArea');
        
        if (message) {
            notificationArea.innerHTML = `
                <i class="fas fa-check-circle" style="color: #48bb78;"></i> 
                <strong>Enviado:</strong> "${message}"<br>
                <small>📅 ${new Date().toLocaleString()}</small>
            `;
            
            document.getElementById('smsMessage').value = '';
            showMessage('✅ SMS enviado', 'sms-simulator');
        } else {
            alert('❌ Escribe un mensaje');
        }
    }

    function showMessage(text, containerClass) {
        const msg = document.createElement('div');
        msg.className = 'success-message';
        msg.textContent = text;
        document.querySelector(`.${containerClass}`).appendChild(msg);
        setTimeout(() => msg.remove(), 2000);
    }

    return { send };
})();

// ===== MÓDULO 6: STREAMING =====
const StreamingModule = (function() {
    const videos = [
        { id: 'jfKfPfyJRdk', name: 'Video 1' },
        { id: 'dQw4w9WgXcQ', name: 'Video 2' },
        { id: '3JZ_D3ELwOQ', name: 'Video 3' }
    ];
    
    let currentIndex = 0;
    const player = document.getElementById('videoPlayer');

    function play() {
        alert('▶️ Reproduciendo (simulado)');
    }

    function pause() {
        alert('⏸️ Pausado (simulado)');
    }

    function change() {
        currentIndex = (currentIndex + 1) % videos.length;
        player.src = `https://www.youtube.com/embed/${videos[currentIndex].id}`;
        showMessage(`🔄 ${videos[currentIndex].name}`);
    }

    function showMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'success-message';
        msg.textContent = text;
        document.querySelector('.player-controls').appendChild(msg);
        setTimeout(() => msg.remove(), 2000);
    }

    return { play, pause, change };
})();

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todos los módulos
    GeolocationModule.init();
    SocialModule.loadFeed();
    EcommerceModule.search();
    DatabaseModule.updateList();
    
    // Hacer funciones globales para los onclick
    window.searchProduct = EcommerceModule.search;
    window.saveToCloud = DatabaseModule.saveUser;
    window.sendSMS = SMSModule.send;
    window.playVideo = StreamingModule.play;
    window.pauseVideo = StreamingModule.pause;
    window.changeVideo = StreamingModule.change;
});