// 1. Evitar doble declaración: NO declares currentLang aquí si ya está en otro lado, 
// o bórralo del HTML.
let currentLang = 'es'; 

const supabaseUrl = 'https://tu-url.supabase.co';
const supabaseKey = 'tu-key-anon';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function cargarGaleria() {
    const { data, error } = await _supabase
        .from('galeria_fotos')
        .select('*')
        .order('orden', { ascending: true });

    if (error) return console.error(error);

    const container = document.getElementById('swiper-wrapper-gallery');
    if (container) {
        container.innerHTML = data.map(foto => `
            <div class="swiper-slide">
                <img src="${foto.url_imagen}" 
                     onclick="openLightbox(this.src)" 
                     class="rounded-2xl shadow-lg h-80 w-full object-cover cursor-zoom-in"
                     alt="${foto.alt_es}">
            </div>`).join('');
        
        // Llamamos a la versión corregida de Swiper
        inicializarSwiper();
    }
}

// Ejecución al cargar
document.addEventListener('DOMContentLoaded', () => {
    cargarGaleria();
    // cargarConfiguracion(); // Tu otra función para precios
});
