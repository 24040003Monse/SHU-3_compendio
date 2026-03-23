export class Streaming {
    constructor() {
        this.currentIndex = 0;
        this.player = null;
        this.init();
    }
    
    init() {
        const container = document.getElementById('playerContainer');
        if (!container) return;
        
        // Videos de muestra que vienen con el navegador (100% funcionales)
        this.playlist = [
            { url: 'https://www.w3schools.com/html/mov_bbb.mp4', title: '🐮 Big Buck Bunny - Conejo animado', type: 'mp4' },
            { url: 'https://www.w3schools.com/html/movie.mp4', title: '🎬 Video de muestra - Animación', type: 'mp4' }
        ];
        
        this.createPlayer();
    }
    
    createPlayer() {
        const container = document.getElementById('playerContainer');
        const video = this.playlist[0];
        
        container.innerHTML = `
            <video id="videoPlayer" width="100%" height="280" controls style="border-radius: 12px; background: #000;">
                <source src="${video.url}" type="video/mp4">
                Tu navegador no soporta video.
            </video>
            
            <div style="margin: 15px 0; padding: 15px; background: linear-gradient(135deg, #667eea20, #764ba220); border-radius: 12px;">
                <h3 id="currentVideoTitle" style="margin: 0 0 5px 0; color: #333;">${video.title}</h3>
                <p id="currentVideoStatus" style="margin: 0; color: #666;">🎬 Video listo para reproducir</p>
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-bottom: 20px;">
                <button class="btn btn-small" id="playBtn" style="background: #2ecc71;">▶ Reproducir</button>
                <button class="btn btn-small" id="pauseBtn">⏸ Pausar</button>
                <button class="btn btn-small" id="replayBtn">↺ Repetir</button>
            </div>
            
            <div>
                <h4 style="margin: 0 0 10px 0;">🎬 Videos disponibles:</h4>
                <div id="playlistContainer" style="max-height: 150px; overflow-y: auto; border-radius: 8px;">
                    ${this.playlist.map((video, index) => `
                        <div onclick="window.loadVideo(${index})" 
                             style="padding: 12px; cursor: pointer; border-bottom: 1px solid #eee; 
                                    ${index === this.currentIndex ? 'background: #e0e7ff; font-weight: bold; border-left: 3px solid #667eea;' : 'background: white;'}">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <span style="font-size: 24px;">${index === 0 ? '🐮' : '🎬'}</span>
                                <span>${video.title}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        this.player = document.getElementById('videoPlayer');
        this.setupButtons();
        this.updateStatus('Listo para reproducir');
    }
    
    setupButtons() {
        document.getElementById('playBtn')?.addEventListener('click', () => {
            if (this.player) {
                this.player.play();
                this.updateStatus('Reproduciendo');
            }
        });
        
        document.getElementById('pauseBtn')?.addEventListener('click', () => {
            if (this.player) {
                this.player.pause();
                this.updateStatus('Pausado');
            }
        });
        
        document.getElementById('replayBtn')?.addEventListener('click', () => {
            if (this.player) {
                this.player.currentTime = 0;
                this.player.play();
                this.updateStatus('Reproduciendo desde inicio');
            }
        });
        
        if (this.player) {
            this.player.addEventListener('ended', () => {
                this.updateStatus('Video finalizado');
            });
            
            this.player.addEventListener('playing', () => {
                this.updateStatus('Reproduciendo');
            });
            
            this.player.addEventListener('pause', () => {
                this.updateStatus('Pausado');
            });
        }
    }
    
    loadVideo(index) {
        this.currentIndex = index;
        const video = this.playlist[index];
        
        if (this.player) {
            this.player.src = video.url;
            this.player.load();
            this.player.play();
        }
        
        document.getElementById('currentVideoTitle').textContent = video.title;
        this.updatePlaylistStyle();
        this.updateStatus('Reproduciendo: ' + video.title);
    }
    
    updatePlaylistStyle() {
        const items = document.querySelectorAll('#playlistContainer div');
        items.forEach((item, idx) => {
            if (idx === this.currentIndex) {
                item.style.background = '#e0e7ff';
                item.style.fontWeight = 'bold';
                item.style.borderLeft = '3px solid #667eea';
            } else {
                item.style.background = 'white';
                item.style.fontWeight = 'normal';
                item.style.borderLeft = 'none';
            }
        });
    }
    
    updateStatus(status) {
        const statusEl = document.getElementById('currentVideoStatus');
        if (statusEl) {
            statusEl.textContent = `🎬 ${status}`;
        }
        
        const mainStatusEl = document.getElementById('statusText');
        if (mainStatusEl) {
            const isOnline = status === 'Reproduciendo' || status === 'Listo para reproducir';
            mainStatusEl.innerHTML = `<span class="status-indicator ${isOnline ? 'status-online' : 'status-offline'}"></span> Video - ${status}`;
        }
    }
}

window.loadVideo = (index) => {
    if (window.streamingInstance) {
        window.streamingInstance.loadVideo(index);
    }
};