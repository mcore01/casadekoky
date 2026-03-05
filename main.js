// Conexión dinámica usando variables de entorno de Vercel
const SUPABASE_URL = window.location.hostname === 'localhost' 
    ? 'TU_URL_MANUAL_PARA_LOCAL' 
    : 'https://' + window.location.hostname.split('-')[0] + '.supabase.co'; // O usa la variable directa si prefieres

// Lo más estable para tu nivel actual es:
const supabaseUrl = 'https://pmejptyabrcqyfonzjax.supabase.co'; // Tu URL real
const supabaseKey = 'sb_publishable_HzS1qYKDxvSPdjveYAkD2Q_ew6WEgDS'; // Tu Key real
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);



// 2. VARIABLES DE ESTADO
let currentLang = 'es';
const photos = []; // Se llenará desde Supabase

// 3. FUNCIÓN PARA CARGAR PRECIOS Y TEXTOS
async function cargarConfiguracion() {
    const { data, error } = await _supabase.from('configuracion_sitio').select('*');
    if (error) {
        console.error("Error cargando configuración:", error);
        return;
    }
    
    data.forEach(item => {
        const elementos = document.querySelectorAll(`[data-key="${item.clave}"]`);
        elementos.forEach(el => {
            el.innerText = currentLang === 'es' ? item.valor_es : item.valor_en;
        });
    });
}

async function cargarGaleria() {
    const { data, error } = await _supabase
        .from('galeria_fotos')
        .select('*')
        .order('orden', { ascending: true });

    if (error) {
        console.error("Error en galería:", error);
        return;
    }

    const container = document.getElementById('swiper-wrapper-gallery');
    
    if (container) {
        container.innerHTML = ''; // Borra el mensaje de "Cargando..."
        
        data.forEach(foto => {
            container.innerHTML += `
                <div class="swiper-slide">
                    <img src="${foto.url_imagen}" 
                         onclick="openLightbox(this.src)" 
                         class="rounded-2xl shadow-lg h-80 w-full object-cover cursor-zoom-in" 
                         alt="${foto.alt_es || 'Casa de Koky'}">
                </div>`;
        });

        // IMPORTANTE: Reiniciar Swiper para que reconozca las nuevas fotos
        inicializarSwiper();
    }
}
// 5. INICIALIZADORES (Menú, Swiper, etc.)
function inicializarSwiper() {
    new Swiper(".mySwiper", {
        slidesPerView: 1, spaceBetween: 20, loop: true,
        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
        pagination: { el: ".swiper-pagination", clickable: true },
        breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
    });
}

// 6. EJECUCIÓN INICIAL
document.addEventListener('DOMContentLoaded', () => {
    cargarConfiguracion();
    cargarGaleria();
    // Aquí puedes incluir tu función de toggleMenu que ya tenías

});

