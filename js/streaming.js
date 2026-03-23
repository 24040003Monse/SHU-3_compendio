export class Streaming {
    constructor() {
        this.player = null;
        this.playerReady = false;
        this.currentVideoId = null;
        // 🔴 REEMPLAZA ESTO CON TU API KEY DE YOUTUBE 🔴
        this.apiKey = 'AIzaSyBBuoxwvfSeKfxyokTlZY1F1aHtmbr4t3k';
        this.init();
        this.setupEventListeners();
    }
    
    init() {
        const container = document.getElementById('video-container');
        if (!container) return;
        
        container.innerHTML = '';
        container.innerHTML = '<div id="youtubePlayer" class="yt-player"></div>';
        
        this.loadYouTubeAPI();
    }
    
    setupEventListeners() {
        const searchBtn = document.getElementById('ytSearchBtn');
        const nameInput = document.getElementById('yt-name');
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.searchAndLoadVideo());
        }
        
        if (nameInput) {
            nameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.searchAndLoadVideo();
            });
            nameInput.addEventListener('input', () => this.validateVideoName());
        }
    }
    
    validateVideoName() {
        const inp = document.getElementById('yt-name');
        const el = document.getElementById('yt-validation');
        const raw = inp.value.trim();
        
        if (!raw) {
            inp.classList.remove('ok', 'er');
            if (el) {
                el.textContent = '';
                el.className = '';
            }
            return true;
        }
        
        if (raw.length < 3) {
            inp.classList.add('er');
            inp.classList.remove('ok');
            if (el) {
                el.textContent = '⚠ Mínimo 3 caracteres';
                el.className = 'er';
            }
            return false;
        }
        
        inp.classList.add('ok');
        inp.classList.remove('er');
        if (el) {
            el.textContent = '✓ Nombre válido';
            el.className = 'ok';
        }
        return true;
    }
    
    async searchAndLoadVideo() {
        const query = document.getElementById('yt-name').value.trim();
        
        if (!query) {
            this.showNotification('❌ Escribe el nombre de un video');
            return;
        }
        
        if (!this.validateVideoName()) return;
        
        this.updateStatus('Buscando en YouTube...');
        this.showNotification('🔍 Buscando: ' + query);
        
        try {
            const videoData = await this.searchYouTube(query);
            
            if (videoData) {
                this.loadVideo(videoData.id, videoData.title);
                this.showNotification('✅ Reproduciendo: ' + videoData.title);
            } else {
                this.updateStatus('No se encontró el video');
                this.showNotification('❌ No se encontró: ' + query);
            }
        } catch (error) {
            console.error('Error:', error);
            this.updateStatus('Error en la búsqueda');
            this.showNotification('❌ Error al buscar el video');
        }
    }
    
    async searchYouTube(query) {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(query)}&type=video&key=${this.apiKey}`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.error) {
                console.error('API Error:', data.error);
                this.showNotification('⚠️ Error de API: Revisa tu API Key');
                return null;
            }
            
            if (data.items && data.items.length > 0) {
                return {
                    id: data.items[0].id.videoId,
                    title: data.items[0].snippet.title
                };
            }
            return null;
        } catch (error) {
            console.error('Error en búsqueda:', error);
            return null;
        }
    }
    
    loadYouTubeAPI() {
        if (window.YT && window.YT.Player) {
            this.createPlayer();
            return;
        }
        
        window.onYouTubeIframeAPIReady = () => {
            console.log('✅ YouTube API lista');
            this.createPlayer();
        };
        
        if (!document.querySelector('#youtube-api-script')) {
            const tag = document.createElement('script');
            tag.id = 'youtube-api-script';
            tag.src = 'https://www.youtube.com/iframe_api';
            document.head.appendChild(tag);
        }
        
        setTimeout(() => {
            if (!this.player && window.YT) {
                this.createPlayer();
            }
        }, 3000);
    }
    
    createPlayer() {
        const playerDiv = document.getElementById('youtubePlayer');
        if (!playerDiv) return;
        
        try {
            this.player = new YT.Player('youtubePlayer', {
                height: '250',
                width: '100%',
                videoId: 'dQw4w9WgXcQ',
                playerVars: {
                    'playsinline': 1,
                    'controls': 1,
                    'rel': 0,
                    'modestbranding': 1
                },
                events: {
                    'onReady': () => {
                        this.playerReady = true;
                        console.log('✅ Player listo');
                        this.updateStatus('Listo');
                        this.showNotification('🎬 Reproductor listo - Busca cualquier video');
                    },
                    'onStateChange': (event) => {
                        if (event.data === 0) {
                            this.updateStatus('Finalizado');
                        } else if (event.data === 1) {
                            this.updateStatus('Reproduciendo');
                        } else if (event.data === 2) {
                            this.updateStatus('Pausado');
                        } else if (event.data === 3) {
                            this.updateStatus('Buffering...');
                        }
                    },
                    'onError': (error) => {
                        console.error('Error en YouTube:', error);
                        this.updateStatus('Error en el video');
                    }
                }
            });
        } catch (error) {
            console.error('Error creando player:', error);
        }
    }
    
    loadVideo(videoId, title) {
        if (!this.player || !this.playerReady) {
            setTimeout(() => this.loadVideo(videoId, title), 500);
            return;
        }
        
        this.currentVideoId = videoId;
        
        try {
            this.player.loadVideoById(videoId);
            
            const titleEl = document.getElementById('yt-title-text');
            if (titleEl) {
                titleEl.textContent = title;
            }
            
            const videoInfo = document.getElementById('video-info');
            if (videoInfo) {
                videoInfo.style.display = 'block';
            }
            
            this.updateStatus('Cargando...');
        } catch (error) {
            console.error('Error cargando video:', error);
            this.updateStatus('Error al cargar');
        }
    }
    
    updateStatus(status) {
        const statusEl = document.getElementById('yt-status');
        if (statusEl) {
            statusEl.textContent = status;
        }
        
        const mainStatusEl = document.getElementById('statusText');
        if (mainStatusEl) {
            const isOnline = status === 'Reproduciendo' || status === 'Listo';
            mainStatusEl.innerHTML = `<span class="status-indicator ${isOnline ? 'status-online' : 'status-offline'}"></span> YouTube - ${status}`;
        }
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}

window.loadVideo = (index) => {
    if (window.streamingInstance) {
        window.streamingInstance.loadVideo(index);
    }
};