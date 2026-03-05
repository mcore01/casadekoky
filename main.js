// 1. CONFIGURACIÓN (RELLENA CON TUS DATOS DE SETTINGS > API)
const SUPABASE_URL = 'https://pmejptyabrcqyfonzjax.supabase.co';
const SUPABASE_KEY = 'sb_publishable_HzS1qYKDxvSPdjveYAkD2Q_ew6WEgDS';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. ESTADO GLOBAL
let currentLang = 'es';
let swiperInstance = null;
let galleryImages = []; // Guardaremos las URLs para el Lightbox
let currentImageIndex = 0;

// 3. FUNCIÓN DE IDIOMAS (RESTAURADA)
window.toggleLanguage = function() {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    const label = currentLang === 'es' ? 'EN' : 'ES';
    
    if(document.getElementById('lang-text')) document.getElementById('lang-text').innerText = label;
    if(document.getElementById('lang-text-mobile')) document.getElementById('lang-text-mobile').innerText = label;
    
    // Recargamos datos para aplicar la traducción de Supabase
    cargarDatosPortal();
};

// 4. CARGA DINÁMICA DE DATOS (PRECIOS Y FOTOS)
async function cargarDatosPortal() {
    try {
        // Cargar Configuración (Precios/Textos)
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
        if (fotos) {
            const container = document.getElementById('swiper-wrapper-gallery');
            if (container) {
                galleryImages = fotos.map(f => f.url_imagen); // Actualizamos lista para Lightbox
                container.innerHTML = fotos.map(foto => `
                    <div class="swiper-slide">
                        <img src="${foto.url_imagen}" 
                             onclick="openLightbox('${foto.url_imagen}')" 
                             class="rounded-2xl shadow-lg h-80 w-full object-cover cursor-zoom-in"
                             alt="${foto.alt_es || 'Casa de Koky'}">
                    </div>`).join('');
                
                inicializarSwiper();
            }
        }
    } catch (err) {
        console.error("Error en el portal:", err);
    }
}

// 5. LÓGICA DE SWIPER
function inicializarSwiper() {
    if (swiperInstance) swiperInstance.destroy();
    swiperInstance = new Swiper(".mySwiper", {
        slidesPerView: 1, spaceBetween: 20, loop: galleryImages.length > 3,
        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
        pagination: { el: ".swiper-pagination", clickable: true },
        breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
    });
}

// 6. LÓGICA DE LIGHTBOX (RESTAURADA)
window.openLightbox = function(src) {
    currentImageIndex = galleryImages.indexOf(src);
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    if (lb && lbImg) {
        lbImg.src = src;
        lb.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
};

window.closeLightbox = function() {
    document.getElementById('lightbox').classList.add('hidden');
    document.body.style.overflow = 'auto';
};

window.changeImage = function(dir) {
    currentImageIndex = (currentImageIndex + dir + galleryImages.length) % galleryImages.length;
    document.getElementById('lightbox-img').src = galleryImages[currentImageIndex];
};

// 7. MENÚ MÓVIL (RESTAURADO)
window.toggleMenu = function() {
    document.getElementById('mobile-menu').classList.toggle('open');
};

// 8. INICIO
document.addEventListener('DOMContentLoaded', cargarDatosPortal);

// Atajos de teclado para el Lightbox
document.addEventListener('keydown', (e) => {
    const lb = document.getElementById('lightbox');
    if (lb && !lb.classList.contains('hidden')) {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowRight") changeImage(1);
        if (e.key === "ArrowLeft") changeImage(-1);
    }
});

