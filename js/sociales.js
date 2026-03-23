// js/sociales.js - Instagram Style + funcionalidad Twitter
export class Sociales {
    constructor() {
        this.likedPosts = new Set();
        this.following = new Set();
        this.tweetCount = 0;

        this.users = [
            { id:1, username:'carlos_mx',   name:'Carlos López',   city:'CDMX',        avatar:'https://i.pravatar.cc/150?img=11', followers:'1.2k', following:'340' },
            { id:2, username:'sofia.pics',  name:'Sofía Martínez', city:'Guadalajara',  avatar:'https://i.pravatar.cc/150?img=20', followers:'8.4k', following:'210' },
            { id:3, username:'juantravel',  name:'Juan Pérez',     city:'Monterrey',   avatar:'https://i.pravatar.cc/150?img=33', followers:'3.1k', following:'512' },
            { id:4, username:'ana.foodie',  name:'Ana García',     city:'Cancún',      avatar:'https://i.pravatar.cc/150?img=47', followers:'15k',  following:'890' },
            { id:5, username:'migueldev',   name:'Miguel Torres',  city:'Puebla',      avatar:'https://i.pravatar.cc/150?img=51', followers:'2.7k', following:'180' },
            { id:6, username:'laura_art',   name:'Laura Sánchez',  city:'Mérida',      avatar:'https://i.pravatar.cc/150?img=25', followers:'6.3k', following:'420' },
            { id:7, username:'roberto.fit', name:'Roberto Díaz',   city:'Tijuana',     avatar:'https://i.pravatar.cc/150?img=68', followers:'22k',  following:'310' },
            { id:8, username:'valeria_v',   name:'Valeria Vega',   city:'León',        avatar:'https://i.pravatar.cc/150?img=44', followers:'9.8k', following:'650' },
        ];

        this.trending = [
            { tag:'#Saltillo',     count:'42.1k' },
            { tag:'#México',       count:'198k'  },
            { tag:'#IA',           count:'87.3k' },
            { tag:'#Tecnología',   count:'56.8k' },
            { tag:'#Programación', count:'34.2k' },
        ];

        this.posts = [
            { id:1, userId:2, img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop', caption:'Amanecer increíble en las montañas 🌄 No hay nada mejor que esto.', tags:'#naturaleza #amanecer #montañas', likes:847,  time:'hace 2 min'  },
            { id:2, userId:4, img:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop', caption:'Pizza casera perfecta 🍕 La receta en mis highlights.',             tags:'#foodie #pizza #homemade',     likes:1203, time:'hace 15 min' },
            { id:3, userId:1, img:'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=400&fit=crop', caption:'Ciudad de México desde arriba 🏙️ Mi ciudad siempre hermosa.',      tags:'#cdmx #urban #photography',    likes:562,  time:'hace 1 h'    },
            { id:4, userId:7, img:'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop', caption:'Día de entreno completado 💪 Sin excusas.',                        tags:'#gym #fitness #motivation',    likes:2140, time:'hace 2 h'    },
            { id:5, userId:6, img:'https://images.unsplash.com/photo-1541753866388-0b3c701627d3?w=400&h=400&fit=crop', caption:'Nueva obra terminada 🎨 Semanas de trabajo en este lienzo.',       tags:'#art #painting #creative',     likes:389,  time:'hace 3 h'    },
            { id:6, userId:3, img:'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?w=400&h=400&fit=crop', caption:'Playa paradisíaca 🏖️ El mar siempre cura todo.',                  tags:'#playa #beach #travel',        likes:3210, time:'ayer'         },
            { id:7, userId:5, img:'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=400&fit=crop', caption:'Late night coding 💻 El café es mi mejor amigo.',                   tags:'#developer #coding #tech',     likes:718,  time:'hace 2 días'  },
            { id:8, userId:8, img:'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=400&fit=crop', caption:'Outfit del día ✨ Simple pero elegante.',                          tags:'#fashion #ootd #style',        likes:1567, time:'hace 3 días'  },
        ];

        this.postComments = {
            1:['¡Qué foto tan hermosa! 😍','Me recuerda a mis viajes 🏔️','Increíble lugar!'],
            2:['¡Se ve deliciosa! 🤤','Necesito esa receta ya!','Foodie goals 🍕'],
            3:['CDMX siempre bonita 🙌','Gran toma aérea!','Mi ciudad favorita ❤️'],
            4:['¡Eso es dedicación! 💪','Inspiración total 🔥','¿Cuántos días entrenas?'],
            5:['Eres muy talentosa 🎨','El color es increíble','¿Cuánto tardaste?'],
            6:['Paraíso puro 🌊','¡Quiero estar ahí!','El agua cristalina 😍'],
            7:['El café de los devs ☕','100% identificado jaja','¿Qué stack usas?'],
            8:['¡Hermoso outfit! 👗','Siempre elegante ✨','¿Dónde compraste eso?'],
        };

        this.tweetsPosted = [];
        this.setupUI();
        this.render();
    }

    setupUI() {
        const card = document.querySelector('.card:nth-child(2)');
        if (!card) return;
        card.innerHTML = `
            <h2>📱 Redes Sociales - Instagram Style</h2>

            <!-- Perfil activo -->
            <div class="soc-profile" id="socProfile">
                <img src="${this.users[0].avatar}" class="soc-profile-avatar" id="socAvatar"
                     onerror="this.src='https://ui-avatars.com/api/?name=User&background=667eea&color=fff'">
                <div class="soc-profile-info">
                    <strong id="socName">${this.users[0].name}</strong>
                    <span id="socUsername">@${this.users[0].username}</span>
                    <div class="soc-profile-stats">
                        <span><b id="socFollowing">${this.users[0].following}</b> siguiendo</span>
                        <span><b id="socFollowers">${this.users[0].followers}</b> seguidores</span>
                    </div>
                </div>
                <select class="soc-user-select" id="socUserSelect">
                    ${this.users.map((u,i) => `<option value="${i}">${u.username}</option>`).join('')}
                </select>
            </div>

            <!-- Trending -->
            <div class="soc-trending">
                <p class="soc-trending-title">🔥 Tendencias · México</p>
                ${this.trending.map(t => `
                    <div class="soc-trend-item" onclick="document.getElementById('socTweetInput').value += ' ${t.tag}'">
                        <span class="soc-trend-tag">${t.tag}</span>
                        <span class="soc-trend-count">${t.count} tweets</span>
                    </div>
                `).join('')}
            </div>

            <!-- Composer de tweet -->
            <div class="soc-composer">
                <div class="soc-composer-top">
                    <img src="${this.users[0].avatar}" class="soc-composer-avatar" id="socComposerAvatar"
                         onerror="this.src='https://ui-avatars.com/api/?name=U&background=667eea&color=fff'">
                    <textarea id="socTweetInput" class="soc-tweet-input input-field"
                              placeholder="¿Qué está pasando?" maxlength="280" rows="2"></textarea>
                </div>
                <div class="soc-composer-actions">
                    <div class="soc-media-btns">
                        <button class="soc-media-btn" title="Imagen" onclick="document.getElementById('socImgTag').textContent=' 📷'">🖼️ Imagen</button>
                        <button class="soc-media-btn" title="Encuesta" onclick="document.getElementById('socImgTag').textContent=' 📊'">📊 Encuesta</button>
                        <button class="soc-media-btn" title="Ubicación" onclick="document.getElementById('socImgTag').textContent=' 📍'">📍 Ubicación</button>
                        <button class="soc-media-btn" title="Emoji" onclick="this.nextElementSibling.classList.toggle('show')">😊</button>
                        <div class="soc-emoji-picker" id="socEmojiPicker">
                            ${['😀','😂','🥰','🔥','💯','👏','🎉','💪','🙌','❤️','🚀','✨'].map(e =>
                                `<span class="soc-emoji" onclick="document.getElementById('socTweetInput').value += '${e}';this.closest('.soc-emoji-picker').classList.remove('show')">${e}</span>`
                            ).join('')}
                        </div>
                    </div>
                    <div class="soc-composer-right">
                        <span class="soc-char-count" id="socCharCount">0 / 280</span>
                        <button class="btn btn-small" id="socTweetBtn">Publicar</button>
                    </div>
                </div>
                <span id="socImgTag" style="font-size:12px;color:#667eea;padding-left:46px;"></span>
            </div>

            <!-- Tweets publicados -->
            <div class="soc-tweets-feed" id="socTweetsFeed" style="display:none;">
                <p class="soc-tweets-title">📝 Tus publicaciones</p>
                <div id="socTweetsList"></div>
            </div>

            <!-- Separador -->
            <div class="soc-divider">
                <span>── Feed de amigos ──</span>
            </div>

            <!-- Stories -->
            <div class="ig-stories-wrap">
                <div class="ig-stories" id="igStories"></div>
            </div>

            <!-- Feed Instagram -->
            <div class="ig-feed" id="igFeed"></div>

            <button class="btn btn-small" id="actualizarPostsBtn" style="width:100%;margin-top:10px;">
                ↻ Actualizar feed
            </button>
        `;

        this.setupEvents();
    }

    setupEvents() {
        // Cambiar usuario activo
        document.getElementById('socUserSelect').addEventListener('change', e => {
            const u = this.users[parseInt(e.target.value)];
            document.getElementById('socName').textContent = u.name;
            document.getElementById('socUsername').textContent = '@' + u.username;
            document.getElementById('socFollowing').textContent = u.following;
            document.getElementById('socFollowers').textContent = u.followers;
            document.getElementById('socAvatar').src = u.avatar;
            document.getElementById('socComposerAvatar').src = u.avatar;
        });

        // Contador caracteres
        document.getElementById('socTweetInput').addEventListener('input', e => {
            const len = e.target.value.length;
            const el = document.getElementById('socCharCount');
            el.textContent = `${len} / 280`;
            el.style.color = len > 260 ? '#e74c3c' : '#888';
        });

        // Publicar tweet
        document.getElementById('socTweetBtn').addEventListener('click', () => this.publishTweet());

        // Actualizar feed
        document.getElementById('actualizarPostsBtn').addEventListener('click', () => {
            this.posts = [...this.posts].sort(() => Math.random() - 0.5);
            this.renderFeed();
            this.showNotification('🔄 Feed actualizado');
        });
    }

    render() {
        this.renderStories();
        this.renderFeed();
    }

    publishTweet() {
        const input = document.getElementById('socTweetInput');
        const text = input.value.trim();
        const imgTag = document.getElementById('socImgTag').textContent;
        if (!text) { this.showNotification('❌ Escribe algo primero'); return; }

        const userIdx = parseInt(document.getElementById('socUserSelect').value);
        const user = this.users[userIdx];
        const now = new Date().toLocaleTimeString();

        const tweet = { text: text + imgTag, user, time: now, likes: 0, liked: false };
        this.tweetsPosted.unshift(tweet);

        // Mostrar sección de tweets
        const feed = document.getElementById('socTweetsFeed');
        const list = document.getElementById('socTweetsList');
        feed.style.display = 'block';

        const div = document.createElement('div');
        div.className = 'soc-tweet-item';
        div.innerHTML = `
            <img src="${user.avatar}" class="soc-tweet-avatar"
                 onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=667eea&color=fff'">
            <div class="soc-tweet-body">
                <div class="soc-tweet-header">
                    <strong>${user.name}</strong>
                    <span class="soc-tweet-user">@${user.username}</span>
                    <span class="soc-tweet-time">· ${now}</span>
                </div>
                <p class="soc-tweet-text">${this.escapeHtml(tweet.text)}</p>
                <div class="soc-tweet-actions">
                    <button class="soc-tweet-like">🤍 <span>0</span></button>
                    <button class="soc-tweet-reply">💬 Responder</button>
                    <button class="soc-tweet-rt">🔁 Retweet</button>
                </div>
            </div>
        `;

        // Like en tweet
        div.querySelector('.soc-tweet-like').addEventListener('click', function() {
            const span = this.querySelector('span');
            const liked = this.dataset.liked === '1';
            this.dataset.liked = liked ? '0' : '1';
            span.textContent = liked ? parseInt(span.textContent) - 1 : parseInt(span.textContent) + 1;
            this.textContent = '';
            this.innerHTML = `${liked ? '🤍' : '❤️'} <span>${span.textContent}</span>`;
            // re-attach span ref after innerHTML reset
            const newSpan = this.querySelector('span');
            newSpan.textContent = span.textContent;
        });

        list.prepend(div);
        input.value = '';
        document.getElementById('socImgTag').textContent = '';
        document.getElementById('socCharCount').textContent = '0 / 280';
        this.showNotification('✅ ¡Publicado!');
    }

    renderStories() {
        const container = document.getElementById('igStories');
        if (!container) return;
        const myStory = `
            <div class="ig-story">
                <div class="ig-story-ring ig-story-mine">
                    <div class="ig-story-avatar-emoji">😊</div>
                </div>
                <span class="ig-story-name">Tu historia</span>
            </div>`;
        const stories = this.users.map(u => `
            <div class="ig-story" onclick="this.querySelector('.ig-story-ring').style.background='#ddd'">
                <div class="ig-story-ring">
                    <img src="${u.avatar}" class="ig-story-img" alt="${u.username}"
                         onerror="this.outerHTML='<div class=\'ig-story-avatar-emoji\'>${u.name[0]}</div>'">
                </div>
                <span class="ig-story-name">${u.username.split('.')[0].split('_')[0]}</span>
            </div>
        `).join('');
        container.innerHTML = myStory + stories;
    }

    renderFeed() {
        const container = document.getElementById('igFeed');
        if (!container) return;
        container.innerHTML = this.posts.map(post => {
            const user = this.users.find(u => u.id === post.userId);
            const isLiked = this.likedPosts.has(post.id);
            const isFollowing = this.following.has(user.id);
            return `
            <div class="ig-post" id="igpost-${post.id}">
                <div class="ig-post-header">
                    <div class="ig-post-user">
                        <div class="ig-avatar-ring">
                            <img src="${user.avatar}" class="ig-post-avatar" alt="${user.username}"
                                 onerror="this.outerHTML='<div class=\'ig-avatar-fallback\'>${user.name[0]}</div>'">
                        </div>
                        <div class="ig-post-userinfo">
                            <span class="ig-post-username">${user.username}</span>
                            <span class="ig-post-location">📍 ${user.city}</span>
                        </div>
                    </div>
                    <button class="ig-follow-btn ${isFollowing ? 'ig-following' : ''}" data-uid="${user.id}">
                        ${isFollowing ? '✓ Siguiendo' : '+ Seguir'}
                    </button>
                </div>
                <div class="ig-post-img-wrap">
                    <img src="${post.img}" class="ig-post-img" alt="post" loading="lazy"
                         onerror="this.src='https://via.placeholder.com/400x260/667eea/fff?text=📷'"
                         ondblclick="document.getElementById('likebtn-${post.id}').click()">
                    <div class="ig-heart-anim" id="heart-${post.id}">❤️</div>
                </div>
                <div class="ig-post-actions">
                    <div class="ig-post-left">
                        <button class="ig-action-btn ig-like-btn ${isLiked ? 'liked':''}"
                                id="likebtn-${post.id}" data-id="${post.id}" data-likes="${post.likes}">
                            ${isLiked ? '❤️' : '🤍'}
                        </button>
                        <button class="ig-action-btn ig-comment-btn" data-id="${post.id}">💬</button>
                        <button class="ig-action-btn">📤</button>
                    </div>
                    <button class="ig-action-btn">🔖</button>
                </div>
                <div class="ig-post-likes" id="likes-${post.id}">
                    <strong>${this.formatNum(isLiked ? post.likes+1 : post.likes)} Me gusta</strong>
                </div>
                <div class="ig-post-caption">
                    <span class="ig-caption-user">${user.username}</span>${post.caption}
                    <div class="ig-hashtags">${post.tags}</div>
                </div>
                <div class="ig-comments-preview">
                    <span class="ig-view-comments" data-id="${post.id}">
                        Ver los ${this.postComments[post.id].length} comentarios
                    </span>
                </div>
                <div class="ig-comment-box" id="commentbox-${post.id}" style="display:none;">
                    <div class="ig-comments-list" id="commentslist-${post.id}">
                        ${this.postComments[post.id].map(c => `
                            <div class="ig-comment-item">
                                <span class="ig-comment-user">${this.randomUser()}</span>
                                <span class="ig-comment-text"> ${c}</span>
                            </div>`).join('')}
                    </div>
                    <div class="ig-add-comment">
                        <input type="text" class="ig-comment-input" id="commentinput-${post.id}"
                               placeholder="Agrega un comentario...">
                        <button class="ig-comment-send" data-id="${post.id}">Publicar</button>
                    </div>
                </div>
                <span class="ig-post-time">${post.time}</span>
            </div>`;
        }).join('');
        this.bindFeedEvents();
    }

    bindFeedEvents() {
        document.querySelectorAll('.ig-like-btn').forEach(btn =>
            btn.addEventListener('click', () => this.toggleLike(btn)));
        document.querySelectorAll('.ig-view-comments, .ig-comment-btn').forEach(el =>
            el.addEventListener('click', () => this.toggleComments(el.dataset.id)));
        document.querySelectorAll('.ig-comment-send').forEach(btn =>
            btn.addEventListener('click', () => this.addComment(btn.dataset.id)));
        document.querySelectorAll('.ig-comment-input').forEach(input =>
            input.addEventListener('keyup', e => {
                if (e.key === 'Enter') this.addComment(input.id.replace('commentinput-',''));
            }));
        document.querySelectorAll('.ig-follow-btn').forEach(btn =>
            btn.addEventListener('click', () => this.toggleFollow(btn)));
    }

    toggleLike(btn) {
        const id = parseInt(btn.dataset.id);
        const likes = parseInt(btn.dataset.likes);
        const el = document.getElementById(`likes-${id}`);
        const heart = document.getElementById(`heart-${id}`);
        if (this.likedPosts.has(id)) {
            this.likedPosts.delete(id);
            btn.textContent = '🤍'; btn.classList.remove('liked');
            el.innerHTML = `<strong>${this.formatNum(likes)} Me gusta</strong>`;
        } else {
            this.likedPosts.add(id);
            btn.textContent = '❤️'; btn.classList.add('liked');
            el.innerHTML = `<strong>${this.formatNum(likes+1)} Me gusta</strong>`;
            heart.classList.add('show');
            setTimeout(() => heart.classList.remove('show'), 900);
        }
    }

    toggleFollow(btn) {
        const uid = parseInt(btn.dataset.uid);
        if (this.following.has(uid)) {
            this.following.delete(uid);
            btn.textContent = '+ Seguir'; btn.classList.remove('ig-following');
            this.showNotification('Dejaste de seguir al usuario');
        } else {
            this.following.add(uid);
            btn.textContent = '✓ Siguiendo'; btn.classList.add('ig-following');
            this.showNotification('✅ Ahora sigues a este usuario');
        }
    }

    toggleComments(postId) {
        const box = document.getElementById(`commentbox-${postId}`);
        box.style.display = box.style.display === 'none' ? 'block' : 'none';
    }

    addComment(postId) {
        const input = document.getElementById(`commentinput-${postId}`);
        const text = input.value.trim();
        if (!text) return;
        const list = document.getElementById(`commentslist-${postId}`);
        const div = document.createElement('div');
        div.className = 'ig-comment-item ig-comment-new';
        div.innerHTML = `<span class="ig-comment-user">tú</span><span class="ig-comment-text"> ${this.escapeHtml(text)}</span>`;
        list.appendChild(div);
        input.value = '';
        div.scrollIntoView({ behavior:'smooth', block:'nearest' });
        this.showNotification('💬 Comentario publicado');
    }

    randomUser() {
        return this.users[Math.floor(Math.random() * this.users.length)].username;
    }

    formatNum(n) {
        return n >= 1000 ? (n/1000).toFixed(1)+'k' : n.toString();
    }

    escapeHtml(text) {
        const d = document.createElement('div');
        d.textContent = text;
        return d.innerHTML;
    }

    showNotification(msg) {
        const n = document.createElement('div');
        n.className = 'notification';
        n.textContent = msg;
        document.body.appendChild(n);
        setTimeout(() => n.remove(), 3000);
    }
}