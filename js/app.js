import { Geolocalizacion } from './geolocalizacion.js';
import { Database } from './database.js';
import { Streaming } from './streaming.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando aplicación...');
    
    const geolocalizacion = new Geolocalizacion();
    const database = new Database();
    const streaming = new Streaming();
    
    // Guardar instancia para acceso global
    window.streamingInstance = streaming;
    window.databaseInstance = database;
    
    // Exponer funciones
    window.deleteUser = (id) => database.deleteUser(id);
    window.likeUser = (id) => database.likeUser(id);
    window.loadVideo = (index) => streaming.loadVideo(index);
    
    console.log('✅ Aplicación lista!');
});