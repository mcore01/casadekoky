// 1. CONFIGURACIÓN (RELLENA CON TUS DATOS DE SETTINGS > API)
const SUPABASE_URL = 'https://pmejptyabrcqyfonzjax.supabase.co';
const SUPABASE_KEY = 'sb_publishable_HzS1qYKDxvSPdjveYAkD2Q_ew6WEgDS';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY); 

// 2. ESTADO GLOBAL
let currentLang = 'es';
let swiperInstance = null;
let galleryImages = [];
let currentImageIndex = 0;

// 3. DICCIONARIO DE TRADUCCIONES ESTÁTICAS (COMPLETO)
const staticTranslations = {
    es: { 
        "page-title": "Casa de Koky - Surf City | Alquiler con Piscina",
        "nav-logo": "CASA DE KOKY", "nav-home": "Inicio", "nav-services": "Servicios", "nav-gallery": "Galería", "nav-reserve": "Reservar Ahora",
        "hero-title": "Desconecta en tu propia piscina privada - Surf City", "hero-subtitle": "El refugio perfecto para tus vacaciones", "hero-btn": "Ver Disponibilidad",
        "services-title": "Lo que ofrece el apartamento", 
        "s1-t": "Piscina", "s1-d": "9 x 4.5 mts, profundidad de 1.5 a 2 mts.",
        "s2-t": "Seguridad 24/7", "s2-d": "Ingreso estrictamente autorizado.",
        "s3-t": "Aire Acondicionado", "s3-d": "Ambientes climatizados.",
        "s4-t": "Habitaciones", "s4-d": "1: 2 Queen | 2: 1 King.",
        "s5-d": "Internet satelital de alta velocidad.",
        "s6-t": "Estacionamiento", "s6-d": "Espacio para más de 4 vehículos.",
        "design-title": "Un diseño pensado para el relax",
        "d1-t": "Convivencia y Amigos", "d1-d": "Patio espacioso para carnes asadas y estacionamiento para más de 4 vehículos.",
        "d2-t": "Naturaleza y Frescura", "d2-d": "Jardín con árboles de frutas tropicales y duchas exteriores.",
        "d3-t": "Vistas de Ensueño", "d3-d": "Terraza para apreciar el atardecer y amanecer con vista al océano y montañas.",
        "others-title": "Otras Comodidades", 
        "a1": "Sala de estar", "a2": "Cocina completa", "a3": "Delivery de comida",
        "note-label": "Nota:", "note-text": "Disfruta de las frutas tropicales al alcance de tu mano (Por temporada).",
        "gallery-sub": "Haz clic en las imágenes para verlas en grande. Presiona Esc para salir.",
        "loc-title": "Nuestra Ubicación", "loc-how": "¿Cómo llegar?", 
        "loc-dist": "A 45 km. del Aeropuerto Internacional El Salvador",
        "dist-15": "A menos de 1.5 Km", "dist-30": "A menos de 3.0 Km",
        "l1": "Súper", "l2": "Restaurantes", "l8": "Bancos", "l14": "Clínicas", "l15": "Farmacias", "l16": "Gasolineras", "l18": "ATM", "l20": "Coffee Shop",
        "l10": "Muelle del Puerto", "111": "Playa El Tunco", "l12": "Otros lugares",
        "rates-title": "Tarifas", "r1-t": "Pase diario", "r2-t": "Estadía Completa", "r3-t": "Adicionales",
        "r-cap": "6 adultos y 2 niños", "r-rec": "RECOMENDADO", "r-adult": "Adulto", "r-child": "Niño",
        "contact-sub": "Completa tus datos y nos pondremos en contacto contigo para confirmar la fecha.",
        "footer-text": "© 2026 Casa de Koky - Todos los derechos reservados"
    },
    en: { 
        "page-title": "Koky's House - Surf City | Pool Rental",
        "nav-logo": "KOKY'S HOUSE", "nav-home": "Home", "nav-services": "Services", "nav-gallery": "Gallery", "nav-reserve": "Book Now",
        "hero-title": "Unplug in your own private pool - Surf City", "hero-subtitle": "The perfect getaway", "hero-btn": "Check Availability",
        "services-title": "What the apartment offers",
        "s1-t": "Pool", "s1-d": "9 x 4.5 mts, 1.5 to 2 mts depth.",
        "s2-t": "24/7 Security", "s2-d": "Strictly authorized entry.",
        "s3-t": "Air Conditioning", "s3-d": "Climate-controlled.",
        "s4-t": "Rooms", "s4-d": "1: 2 Queen | 2: 1 King.",
        "s5-d": "High-speed satellite internet.",
        "s6-t": "Parking", "s6-d": "Space for 4+ vehicles.",
        "design-title": "Designed for relaxation",
        "d1-t": "Friends & Gathering", "d1-d": "Spacious patio for BBQ and large parking area.",
        "d2-t": "Nature & Freshness", "d2-d": "Garden with tropical fruit trees and outdoor showers.",
        "d3-t": "Dreamy Views", "d3-d": "Terrace to enjoy sunset and sunrise with ocean views.",
        "others-title": "Other Amenities", 
        "a1": "Living Room", "a2": "Full Kitchen", "a3": "Food Delivery",
        "note-label": "Note:", "note-text": "Enjoy tropical fruits at your fingertips (Seasonal).",
        "gallery-sub": "Click images to enlarge. Press Esc to exit.",
        "loc-title": "Our Location", "loc-how": "How to get there?", 
        "loc-dist": "45 km from El Salvador International Airport",
        "dist-15": "Within 1.5 Km", "dist-30": "Within 3.0 Km",
        "l1": "Supermarket", "l2": "Restaurants", "l8": "Banks", "l14": "Clinics", "l15": "Pharmacy", "l16": "Gas Stations", "l18": "ATM", "l20": "Coffee Shop",
        "l10": "Port Pier", "111": "Tunco Beach", "l12": "Other places",
        "rates-title": "Rates", "r1-t": "Day Pass", "r2-t": "Full Stay", "r3-t": "Additionals",
        "r-cap": "6 adults & 2 kids", "r-rec": "RECOMMENDED", "r-adult": "Adult", "r-child": "Child",
        "contact-sub": "Fill in your details and we will contact you shortly.",
        "footer-text": "© 2026 Koky's House - All rights reserved"
    }
};

// 4. LÓGICA DE IDIOMAS
window.toggleLanguage = function() {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    const label = currentLang === 'es' ? 'EN' : 'ES';
    
    if(document.getElementById('lang-text')) document.getElementById('lang-text').innerText = label;
    if(document.getElementById('lang-text-mobile')) document.getElementById('lang-text-mobile').innerText = label;
    
    document.title = staticTranslations[currentLang]["page-title"];
    
    // Traducir todos los elementos con data-key
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if(staticTranslations[currentLang][key]) {
            el.innerText = staticTranslations[currentLang][key];
        }
    });

    cargarDatosPortal(); // Recarga precios y fotos desde Supabase
};

// 5. CARGA DE DATOS (SUPABASE)
async function cargarDatosPortal() {
    try {
        // Cargar Configuración (Precios dinámicos)
        const { data: config } = await _supabase.from('configuracion_sitio').select('*');
        if (config) {
            config.forEach(item => {
                const elementos = document.querySelectorAll(`[data-key="${item.clave}"]`);
                elementos.forEach(el => {
                    el.innerText = currentLang === 'es' ? item.valor_es : item.valor_en;
                });
            });
        }

        // Cargar Galería
        const { data: fotos } = await _supabase.from('galeria_fotos').select('*').order('orden', { ascending: true });
        if (fotos && fotos.length > 0) {
            const container = document.getElementById('swiper-wrapper-gallery');
            if (container) {
                galleryImages = fotos.map(f => f.url_imagen);
                container.innerHTML = fotos.map(foto => `
                    <div class="swiper-slide">
                        <img src="${foto.url_imagen}" 
                             onclick="openLightbox('${foto.url_imagen}')" 
                             class="rounded-2xl shadow-lg h-80 w-full object-cover cursor-zoom-in"
                             alt="${foto.alt_es || 'Piscina'}">
                    </div>`).join('');
                
                inicializarSwiper();
            }
        }
    } catch (err) {
        console.error("Error cargando portal:", err);
    }
}

// 6. SWIPER, LIGHTBOX Y MENÚ (RESTAURADOS)
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
    currentImageIndex = galleryImages.indexOf(src);
    document.getElementById('lightbox-img').src = src;
    document.getElementById('lightbox').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
};

window.closeLightbox = function() {
    document.getElementById('lightbox').classList.add('hidden');
    document.body.style.overflow = 'auto';
};

window.changeImage = function(dir) {
    currentImageIndex = (currentImageIndex + dir + galleryImages.length) % galleryImages.length;
    document.getElementById('lightbox-img').src = galleryImages[currentImageIndex];
};

window.toggleMenu = function() {
    document.getElementById('mobile-menu').classList.toggle('open');
};

// 7. INICIO
document.addEventListener('DOMContentLoaded', cargarDatosPortal);
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") changeImage(1);
    if (e.key === "ArrowLeft") changeImage(-1);
});
