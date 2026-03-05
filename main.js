// 1. CONFIGURACIÓN (RELLENA CON TUS DATOS DE SETTINGS > API)
const SUPABASE_URL = 'https://pmejptyabrcqyfonzjax.supabase.co';
const SUPABASE_KEY = 'sb_publishable_HzS1qYKDxvSPdjveYAkD2Q_ew6WEgDS';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY); 


let currentLang = 'es';
let swiperInstance = null;
let galleryImages = [];

// 2. DICCIONARIO COMPLETO (RESTAURANDO TODOS LOS ÍTEMS DE LAS IMÁGENES)
const staticTranslations = {
    es: { 
        "page-title": "Casa de Koky - Surf City | Alquiler con Piscina",
        "nav-logo": "CASA DE KOKY", "nav-home": "Inicio", "nav-services": "Servicios", "nav-gallery": "Galería", "nav-reserve": "Reservar Ahora",
        "hero-title": "Desconecta en tu propia piscina privada - Surf City", "hero-subtitle": "El refugio perfecto para tus vacaciones", "hero-btn": "Ver Disponibilidad",
        "services-title": "Lo que ofrece el apartamento",
        "design-title": "Un diseño pensado para el relax",
        "d1-t": "Convivencia y Amigos", "d1-d": "Patio espacioso para carnes asadas y estacionamiento para más de 4 vehículos.",
        "d2-t": "Naturaleza y Frescura", "d2-d": "Jardín con árboles de frutas tropicales y duchas exteriores.",
        "d3-t": "Vistas de Ensueño", "d3-d": "Terraza para apreciar el atardecer y amanecer con vista al océano y montañas.",
        "others-title": "Otras Comodidades", 
        "a1": "Sala de estar", "a2": "Cocina completa", "a3": "Delivery de comida",
        "note-label": "Nota:", "note-text": "Disfruta de las frutas tropicales al alcance de tu mano (Por temporada).",
        "loc-title": "Nuestra Ubicación", "loc-how": "¿Cómo llegar?", 
        "loc-dist": "A 45 km. del Aeropuerto Internacional El Salvador",
        "dist-15": "A MENOS DE 1.5 KM", "dist-30": "A MENOS DE 3.0 KM",
        "l1": "Súper", "l2": "Restaurantes", "l8": "Bancos", "l14": "Clínicas", "l15": "Farmacias", "l16": "Gasolineras", "l18": "ATM", "l20": "Coffee Shop",
        "l10": "Muelle del Puerto", "111": "Playa El Tunco",
        "rates-title": "Tarifas", "footer-text": "© 2026 Casa de Koky - Todos los derechos reservados"
    },
    en: { 
        "page-title": "Koky's House - Surf City | Pool Rental",
        "nav-logo": "KOKY'S HOUSE", "nav-home": "Home", "nav-services": "Services", "nav-gallery": "Gallery", "nav-reserve": "Book Now",
        "hero-title": "Unplug in your own private pool - Surf City", "hero-subtitle": "The perfect getaway", "hero-btn": "Check Availability",
        "services-title": "What the apartment offers",
        "design-title": "Designed for relaxation",
        "d1-t": "Friends & Gathering", "d1-d": "Spacious patio for BBQ and parking for more than 4 vehicles.",
        "d2-t": "Nature & Freshness", "d2-d": "Garden with tropical fruit trees and outdoor showers.",
        "d3-t": "Dreamy Views", "d3-d": "Terrace with ocean and mountain views.",
        "others-title": "Other Amenities", 
        "a1": "Living Room", "a2": "Full Kitchen", "a3": "Food Delivery",
        "note-label": "Note:", "note-text": "Enjoy tropical fruits (seasonal).",
        "loc-title": "Our Location", "loc-how": "How to get there?",
        "loc-dist": "45 km from International Airport",
        "dist-15": "WITHIN 1.5 KM", "dist-30": "WITHIN 3.0 KM",
        "l1": "Supermarket", "l2": "Restaurants", "l8": "Banks", "l14": "Clinics", "l15": "Pharmacy", "l16": "Gas Station", "l18": "ATM", "l20": "Coffee Shop",
        "l10": "Port Pier", "111": "Tunco Beach",
        "rates-title": "Rates", "footer-text": "© 2026 Koky's House - All rights reserved"
    }
};

window.toggleLanguage = function() {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    const label = currentLang === 'es' ? 'EN' : 'ES';
    if(document.getElementById('lang-text')) document.getElementById('lang-text').innerText = label;
    if(document.getElementById('lang-text-mobile')) document.getElementById('lang-text-mobile').innerText = label;
    document.title = staticTranslations[currentLang]["page-title"];
    
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if(staticTranslations[currentLang][key]) el.innerText = staticTranslations[currentLang][key];
    });
    cargarDatosPortal();
};

async function cargarDatosPortal() {
    try {
        const { data: config } = await _supabase.from('configuracion_sitio').select('*');
        if (config) {
            config.forEach(item => {
                const elementos = document.querySelectorAll(`[data-key="${item.clave}"]`);
                elementos.forEach(el => { el.innerText = currentLang === 'es' ? item.valor_es : item.valor_en; });
            });
        }
        const { data: fotos } = await _supabase.from('galeria_fotos').select('*').order('orden', { ascending: true });
        if (fotos && fotos.length > 0) {
            const container = document.getElementById('swiper-wrapper-gallery');
            if (container) {
                galleryImages = fotos.map(f => f.url_imagen);
                container.innerHTML = fotos.map(foto => `
                    <div class="swiper-slide">
                        <img src="${foto.url_imagen}" onclick="openLightbox('${foto.url_imagen}')" class="rounded-2xl shadow-lg h-80 w-full object-cover cursor-zoom-in" alt="Piscina">
                    </div>`).join('');
                inicializarSwiper();
            }
        }
    } catch (err) { console.error(err); }
}

function inicializarSwiper() {
    if (swiperInstance) swiperInstance.destroy();
    swiperInstance = new Swiper(".mySwiper", {
        slidesPerView: 1, spaceBetween: 20, loop: galleryImages.length > 3,
        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
        pagination: { el: ".swiper-pagination", clickable: true },
        breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
    });
}

window.openLightbox = function(src) {
    document.getElementById('lightbox-img').src = src;
    document.getElementById('lightbox').classList.remove('hidden');
};
window.closeLightbox = function() { document.getElementById('lightbox').classList.add('hidden'); };
window.toggleMenu = function() { document.getElementById('mobile-menu').classList.toggle('open'); };
document.addEventListener('DOMContentLoaded', cargarDatosPortal);
