import { Geolocalizacion } from './geolocalizacion.js';
import { Database }        from './database.js';
import { Streaming }       from './streaming.js';
import { Sociales }        from './sociales.js';
import { SMS }             from './sms.js';
import { Ecommerce }       from './ecommerce.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando aplicación...');

    // Inicializar todos los módulos
    const geolocalizacion = new Geolocalizacion();
    const database        = new Database();
    const streaming       = new Streaming();
    const sociales        = new Sociales();
    const sms             = new SMS();
    const ecommerce       = new Ecommerce();

    // Guardar instancias para acceso global
    window.streamingInstance = streaming;
    window.databaseInstance  = database;
    
    // Exponer funciones globales necesarias
    window.deleteUser  = (id)    => database.deleteUser(id);
    window.likeUser    = (id)    => database.likeUser(id);
    window.loadVideo   = (index) => streaming.loadVideo(index);
    
    // Función global para búsqueda por nombre
    window.searchYouTubeVideo = (query) => streaming.searchAndLoadVideo(query);

    console.log('✅ Aplicación lista!');
    console.log('📦 Módulos cargados: Geolocalización, Redes Sociales, E-commerce, Base de Datos, SMS, Streaming');
});