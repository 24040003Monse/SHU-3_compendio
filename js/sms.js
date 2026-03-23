// js/sms.js - Simulador de Protocolos SMS
export class SMS {
    constructor() {
        this.messages = [];
        this.messageId = 1;
        this.setupEventListeners();
        this.renderWelcome();
    }

    setupEventListeners() {
        const enviarBtn = document.getElementById('enviarSMSBtn');
        const smsMessage = document.getElementById('smsMessage');
        const phoneNumber = document.getElementById('phoneNumber');

        if (enviarBtn) enviarBtn.addEventListener('click', () => this.sendSMS());

        if (smsMessage) {
            smsMessage.addEventListener('keyup', () => this.updateCharCount());
            smsMessage.addEventListener('keydown', e => {
                if (e.key === 'Enter' && e.ctrlKey) this.sendSMS();
            });
        }

        if (phoneNumber) {
            phoneNumber.addEventListener('input', () => this.formatPhone());
        }
    }

    renderWelcome() {
        const log = document.getElementById('smsLog');
        if (!log) return;
        log.innerHTML = `
            <div class="sms-status-bar">
                <span class="status-indicator status-online"></span>
                <span>Gateway SMS conectado · Listo para enviar</span>
            </div>
            <p style="color:#888;text-align:center;padding:10px;font-size:12px;">
                📨 Los mensajes enviados aparecerán aquí
            </p>
        `;
    }

    formatPhone() {
        const input = document.getElementById('phoneNumber');
        let val = input.value.replace(/\D/g, '');
        if (val.length > 10) val = val.slice(0, 10);
        if (val.length > 6) {
            input.value = `(${val.slice(0,3)}) ${val.slice(3,6)}-${val.slice(6)}`;
        } else if (val.length > 3) {
            input.value = `(${val.slice(0,3)}) ${val.slice(3)}`;
        } else {
            input.value = val;
        }
    }

    updateCharCount() {
        const msg = document.getElementById('smsMessage').value;
        const maxChars = 160;
        const remaining = maxChars - msg.length;
        let counter = document.getElementById('charCounter');

        if (!counter) {
            counter = document.createElement('small');
            counter.id = 'charCounter';
            counter.style.cssText = 'display:block;text-align:right;margin-top:2px;font-size:11px;';
            document.getElementById('smsMessage').after(counter);
        }

        counter.textContent = `${msg.length}/${maxChars} caracteres`;
        counter.style.color = remaining < 20 ? '#e74c3c' : '#888';

        if (msg.length > maxChars) {
            document.getElementById('smsMessage').value = msg.slice(0, maxChars);
        }
    }

    async sendSMS() {
        const phone = document.getElementById('phoneNumber').value.trim();
        const message = document.getElementById('smsMessage').value.trim();
        const btn = document.getElementById('enviarSMSBtn');

        // Validaciones
        if (!phone) {
            this.showNotification('❌ Ingresa un número de teléfono');
            return;
        }
        if (!message) {
            this.showNotification('❌ Escribe un mensaje');
            return;
        }
        if (message.length < 3) {
            this.showNotification('❌ El mensaje es muy corto');
            return;
        }

        // Simular envío con delay
        btn.disabled = true;
        btn.textContent = '📡 Enviando...';
        this.addMessageToLog(phone, message, 'sending');

        try {
            // Llamada real a JSONPlaceholder simulando POST SMS
            const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: phone,
                    body: message,
                    userId: 1
                })
            });

            const data = await res.json();

            if (res.ok) {
                this.updateLastMessage('sent', data.id || this.messageId);
                this.showNotification(`✅ SMS enviado a ${phone}`);
                document.getElementById('smsMessage').value = '';
                document.getElementById('phoneNumber').value = '';
                const counter = document.getElementById('charCounter');
                if (counter) counter.textContent = '0/160 caracteres';
            } else {
                this.updateLastMessage('error');
                this.showNotification('❌ Error al enviar el SMS');
            }
        } catch (err) {
            this.updateLastMessage('error');
            this.showNotification('❌ Error de conexión');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Enviar SMS';
            this.messageId++;
        }
    }

    addMessageToLog(phone, message, status) {
        const log = document.getElementById('smsLog');
        const msgId = `sms-msg-${this.messageId}`;
        const now = new Date().toLocaleTimeString();

        const entry = document.createElement('div');
        entry.className = 'sms-entry';
        entry.id = msgId;
        entry.innerHTML = `
            <div class="sms-entry-header">
                <span>📱 Para: <strong>${this.escapeHtml(phone)}</strong></span>
                <span class="sms-time">${now}</span>
            </div>
            <div class="sms-entry-body">${this.escapeHtml(message)}</div>
            <div class="sms-entry-status" id="${msgId}-status">
                <span class="sms-badge sms-badge-sending">⏳ Enviando...</span>
                <span style="font-size:10px;color:#888;">ID: #${this.messageId} · ${message.length} chars</span>
            </div>
        `;

        // Insertar después del status-bar
        const statusBar = log.querySelector('.sms-status-bar');
        const noMsgs = log.querySelector('p');
        if (noMsgs) noMsgs.remove();

        if (statusBar) {
            statusBar.after(entry);
        } else {
            log.prepend(entry);
        }
    }

    updateLastMessage(status, apiId) {
        const statusEl = document.getElementById(`sms-msg-${this.messageId}-status`);
        if (!statusEl) return;

        if (status === 'sent') {
            statusEl.innerHTML = `
                <span class="sms-badge sms-badge-sent">✅ Entregado</span>
                <span style="font-size:10px;color:#888;">API ID: ${apiId}</span>
            `;
        } else {
            statusEl.innerHTML = `<span class="sms-badge sms-badge-error">❌ Error al enviar</span>`;
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}