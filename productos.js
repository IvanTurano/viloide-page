// Configuración de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Variables globales
let currentPdf = null;
let currentPage = 1;
let totalPages = 0;
let currentScale = 1.0;
const canvas = document.getElementById('pdfCanvas');
const ctx = canvas.getContext('2d');

// Elementos del DOM
const productSelect = document.getElementById('productSelect');
const infoSelect = document.getElementById('infoSelect');
const pdfViewer = document.getElementById('pdfViewer');
const pdfNavigation = document.getElementById('pdfNavigation');
const loadingIndicator = document.getElementById('loadingIndicator');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const currentPageSpan = document.getElementById('currentPage');
const totalPagesSpan = document.getElementById('totalPages');
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const zoomLevelSpan = document.getElementById('zoomLevel');
const placeholder = document.querySelector('.pdf-placeholder');

// Event Listeners
productSelect.addEventListener('change', handleSelectChange);
infoSelect.addEventListener('change', handleSelectChange);
prevPageBtn.addEventListener('click', () => changePage(-1));
nextPageBtn.addEventListener('click', () => changePage(1));
zoomInBtn.addEventListener('click', () => changeZoom(0.1));
zoomOutBtn.addEventListener('click', () => changeZoom(-0.1));

// Función para manejar el cambio de selección
async function handleSelectChange(event) {
    const selectedValue = event.target.value;
    
    // Limpiar el otro selector cuando se selecciona uno
    if (event.target === productSelect) {
        infoSelect.value = '';
    } else if (event.target === infoSelect) {
        productSelect.value = '';
    }
    
    if (!selectedValue) {
        resetViewer();
        return;
    }
    
    try {
        showLoading(true);
        await loadPdf(selectedValue);
    } catch (error) {
        console.error('Error cargando PDF:', error);
        showError('Error al cargar el documento. Por favor, intente nuevamente.');
    } finally {
        showLoading(false);
    }
}

// Función para cargar el PDF
async function loadPdf(url) {
    try {
        const loadingTask = pdfjsLib.getDocument(url);
        currentPdf = await loadingTask.promise;
        totalPages = currentPdf.numPages;
        currentPage = 1;
        
        updatePageInfo();
        await renderPage(currentPage);
        showPdfControls(true);
        
    } catch (error) {
        throw new Error(`No se pudo cargar el PDF: ${error.message}`);
    }
}

// Función para renderizar una página
async function renderPage(pageNum) {
    try {
        const page = await currentPdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: currentScale });
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        
        await page.render(renderContext).promise;
        
    } catch (error) {
        console.error('Error renderizando página:', error);
        showError('Error al mostrar la página del documento.');
    }
}

// Función para cambiar de página
async function changePage(direction) {
    const newPage = currentPage + direction;
    
    if (newPage < 1 || newPage > totalPages) {
        return;
    }
    
    currentPage = newPage;
    updatePageInfo();
    await renderPage(currentPage);
}

// Función para cambiar el zoom
async function changeZoom(delta) {
    const newScale = Math.max(0.5, Math.min(3.0, currentScale + delta));
    
    if (newScale === currentScale) {
        return;
    }
    
    currentScale = newScale;
    updateZoomInfo();
    
    if (currentPdf) {
        await renderPage(currentPage);
    }
}

// Función para actualizar la información de página
function updatePageInfo() {
    currentPageSpan.textContent = currentPage;
    totalPagesSpan.textContent = totalPages;
    
    prevPageBtn.disabled = currentPage <= 1;
    nextPageBtn.disabled = currentPage >= totalPages;
}

// Función para actualizar la información de zoom
function updateZoomInfo() {
    zoomLevelSpan.textContent = Math.round(currentScale * 100) + '%';
}

// Función para mostrar/ocultar controles del PDF
function showPdfControls(show) {
    pdfNavigation.style.display = show ? 'flex' : 'none';
    canvas.style.display = show ? 'block' : 'none';
    placeholder.style.display = show ? 'none' : 'flex';
}

// Función para mostrar/ocultar indicador de carga
function showLoading(show) {
    loadingIndicator.style.display = show ? 'flex' : 'none';
}

// Función para mostrar errores
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <div class="error-content">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
            </svg>
            <h3>Error</h3>
            <p>${message}</p>
            <button onclick="this.parentElement.parentElement.remove()" class="btn-secondary">Cerrar</button>
        </div>
    `;
    
    pdfViewer.appendChild(errorDiv);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
}

// Función para resetear el visor
function resetViewer() {
    currentPdf = null;
    currentPage = 1;
    totalPages = 0;
    currentScale = 1.0;
    
    showPdfControls(false);
    updateZoomInfo();
    
    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Remover mensajes de error
    const errorMessages = pdfViewer.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());
}

// Función para manejar el redimensionamiento de ventana
window.addEventListener('resize', async () => {
    if (currentPdf && currentPage) {
        await renderPage(currentPage);
    }
});

// Atajos de teclado
document.addEventListener('keydown', async (e) => {
    if (!currentPdf) return;
    
    switch(e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
            e.preventDefault();
            await changePage(-1);
            break;
        case 'ArrowRight':
        case 'ArrowDown':
            e.preventDefault();
            await changePage(1);
            break;
        case '+':
        case '=':
            e.preventDefault();
            await changeZoom(0.1);
            break;
        case '-':
            e.preventDefault();
            await changeZoom(-0.1);
            break;
        case '0':
            e.preventDefault();
            currentScale = 1.0;
            updateZoomInfo();
            await renderPage(currentPage);
            break;
    }
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    updateZoomInfo();
    console.log('Visor de productos inicializado correctamente');
});