import { Geolocalizacion } from './geolocalizacion.js';
import { Database }        from './database.js';
import { Streaming }       from './streaming.js';
import { Sociales }        from './sociales.js';
import { SMS }             from './sms.js';
import { Ecommerce }       from './ecommerce.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando aplicación...');

    const geolocalizacion = new Geolocalizacion();
    const database        = new Database();
    const streaming       = new Streaming();
    const sociales        = new Sociales();
    const sms             = new SMS();
    const ecommerce       = new Ecommerce();

    window.streamingInstance = streaming;
    window.databaseInstance  = database;
    window.deleteUser  = (id)    => database.deleteUser(id);
    window.likeUser    = (id)    => database.likeUser(id);
    window.loadVideo   = (index) => streaming.loadVideo(index);

    console.log('✅ Aplicación lista!');
});