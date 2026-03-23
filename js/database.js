// js/database.js - CON FIREBASE REAL (usando tu configuración)
export class Database {
    constructor() {
        // ========== TU CONFIGURACIÓN DE FIREBASE ==========
        const firebaseConfig = {
            apiKey: "AIzaSyBJzepJZOaBo1llWLRuPEKhOK13-_6Opjc",
            authDomain: "mashup-dashboardd.firebaseapp.com",
            databaseURL: "https://mashup-dashboardd-default-rtdb.firebaseio.com",
            projectId: "mashup-dashboardd",
            storageBucket: "mashup-dashboardd.firebasestorage.app",
            messagingSenderId: "243315623253",
            appId: "1:243315623253:web:b08e05ee1694e55d6d9bdc"
        };
        
        // Inicializar Firebase si no está inicializado
        if (!firebase.apps || !firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        
        this.db = firebase.database();
        this.usersRef = this.db.ref('usuarios');
        this.nextIdRef = this.db.ref('contador');
        
        this.loadUsers();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        const guardarBtn = document.getElementById('guardarUsuarioBtn');
        if (guardarBtn) guardarBtn.addEventListener('click', () => this.saveUser());
        
        const usernameInput = document.getElementById('username');
        if (usernameInput) {
            usernameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.saveUser();
            });
        }
    }
    
    // Guardar usuario en la nube
    async saveUser() {
        const username = document.getElementById('username').value.trim();
        
        if (!username) {
            this.showNotification('❌ Ingresa un nombre de usuario');
            return;
        }
        
        if (username.length < 3) {
            this.showNotification('❌ El nombre debe tener al menos 3 caracteres');
            return;
        }
        
        this.showLoading(true);
        
        try {
            // Verificar si el usuario ya existe
            const snapshot = await this.usersRef.orderByChild('name').equalTo(username).once('value');
            
            if (snapshot.exists()) {
                this.showNotification('❌ Este usuario ya existe');
                this.showLoading(false);
                return;
            }
            
            // Obtener el siguiente ID
            let nextId = 1;
            const idSnapshot = await this.nextIdRef.once('value');
            if (idSnapshot.exists()) {
                nextId = idSnapshot.val();
            }
            
            // Crear nuevo usuario
            const newUser = {
                id: nextId,
                name: username,
                timestamp: new Date().toISOString(),
                likes: 0
            };
            
            // Guardar en Firebase
            await this.usersRef.child(nextId.toString()).set(newUser);
            await this.nextIdRef.set(nextId + 1);
            
            document.getElementById('username').value = '';
            this.showNotification(`✅ Usuario "${username}" guardado en la nube`);
            
        } catch (error) {
            console.error('Error al guardar:', error);
            this.showNotification('❌ Error al guardar en la nube');
        } finally {
            this.showLoading(false);
        }
    }
    
    // Eliminar usuario de la nube
    async deleteUser(userId) {
        this.showLoading(true);
        
        try {
            await this.usersRef.child(userId.toString()).remove();
            this.showNotification('🗑️ Usuario eliminado de la nube');
        } catch (error) {
            console.error('Error al eliminar:', error);
            this.showNotification('❌ Error al eliminar');
        } finally {
            this.showLoading(false);
        }
    }
    
    // Dar like a usuario
    async likeUser(userId) {
        this.showLoading(true);
        
        try {
            const userRef = this.usersRef.child(userId.toString());
            const snapshot = await userRef.once('value');
            
            if (snapshot.exists()) {
                const user = snapshot.val();
                const newLikes = (user.likes || 0) + 1;
                await userRef.update({ likes: newLikes });
                this.showNotification('❤️ Like enviado a la nube');
            }
        } catch (error) {
            console.error('Error al dar like:', error);
            this.showNotification('❌ Error al enviar like');
        } finally {
            this.showLoading(false);
        }
    }
    
    // Cargar usuarios desde la nube en tiempo real
    loadUsers() {
        this.showLoading(true);
        
        this.usersRef.on('value', (snapshot) => {
            const users = [];
            
            snapshot.forEach((childSnapshot) => {
                users.push(childSnapshot.val());
            });
            
            users.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            this.renderUsers(users);
            this.showLoading(false);
        }, (error) => {
            console.error('Error al cargar:', error);
            this.showNotification('❌ Error al cargar usuarios');
            this.showLoading(false);
        });
    }
    
    // Renderizar usuarios
    renderUsers(users) {
        const container = document.getElementById('userList');
        
        if (!container) return;
        
        if (users.length === 0) {
            container.innerHTML = '<p>👥 No hay usuarios registrados en la nube</p>';
            return;
        }
        
        container.innerHTML = users.map(user => `
            <div class="user-item" data-id="${user.id}">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 24px;">👤</span>
                        <div>
                            <strong>${this.escapeHtml(user.name)}</strong>
                            <div style="font-size: 0.8em; color: #888;">
                                ${this.formatDate(user.timestamp)}
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="color: #e74c3c;">❤️ ${user.likes || 0}</span>
                        <button class="btn-small" onclick="window.likeUser(${user.id})" style="padding: 3px 8px;">👍</button>
                        <button class="btn-small" onclick="window.deleteUser(${user.id})" style="padding: 3px 8px; background: #e74c3c;">✕</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    showLoading(show) {
        const saveButton = document.querySelector('#guardarUsuarioBtn');
        if (saveButton) {
            saveButton.disabled = show;
            saveButton.textContent = show ? '💾 Guardando...' : '💾 Guardar en la nube';
        }
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'ahora mismo';
        if (diff < 3600000) return `hace ${Math.floor(diff / 60000)} minutos`;
        if (diff < 86400000) return `hace ${Math.floor(diff / 3600000)} horas`;
        return date.toLocaleDateString();
    }
}