// Configuración global
const MASSA_TERRA = 6e24; // kg (masa de la Tierra aproximada)
const MASSA_LUNA = 7.34e22; // kg
const MASSA_BACTERIA = 7e-16; // kg

// Función para formatear números científicos
function formatScientific(num) {
    if (num >= 1e6 || num <= 1e-6) {
        return num.toExponential(2);
    }
    return num.toLocaleString('es-ES', { maximumFractionDigits: 2 });
}

// Función para calcular crecimiento exponencial
function calcularCrecimiento(tiempoMin, intervaloMin, poblacionInicial = 1) {
    const divisiones = tiempoMin / intervaloMin;
    const poblacionFinal = poblacionInicial * Math.pow(2, divisiones);
    const masaTotal = poblacionFinal * MASSA_BACTERIA;
    
    return {
        divisiones: divisiones,
        poblacionFinal: poblacionFinal,
        masaTotal: masaTotal
    };
}

// Inicializar simulador principal
function inicializarSimulador() {
    try {
        const tiempoSlider = document.getElementById('tiempo');
        const intervaloSlider = document.getElementById('intervalo');
        const tiempoValor = document.getElementById('tiempo-valor');
        const intervaloValor = document.getElementById('intervalo-valor');
        const numeroBacterias = document.getElementById('numero-bacterias');
        const masaTotal = document.getElementById('masa-total');
        
        // Verificar que todos los elementos existen
        if (!tiempoSlider || !intervaloSlider || !tiempoValor || !intervaloValor || 
            !numeroBacterias || !masaTotal) {
            console.warn('Algunos elementos del simulador principal no se encontraron');
            return;
        }

        function actualizarCalculos() {
            const tiempo = parseInt(tiempoSlider.value);
            const intervalo = parseInt(intervaloSlider.value);
            
            tiempoValor.textContent = `${tiempo} min`;
            intervaloValor.textContent = `${intervalo} min`;
            
            const resultado = calcularCrecimiento(tiempo, intervalo);
            
            numeroBacterias.textContent = formatScientific(resultado.poblacionFinal);
            masaTotal.textContent = `${formatScientific(resultado.masaTotal)} kg`;
            
            // Agregar animación suave
            numeroBacterias.style.transform = 'scale(1.05)';
            masaTotal.style.transform = 'scale(1.05)';
            setTimeout(() => {
                numeroBacterias.style.transform = 'scale(1)';
                masaTotal.style.transform = 'scale(1)';
            }, 200);
        }

        tiempoSlider.addEventListener('input', actualizarCalculos);
        intervaloSlider.addEventListener('input', actualizarCalculos);
        
        // Inicializar con valores por defecto
        actualizarCalculos();
    } catch (error) {
        console.error('Error al inicializar el simulador principal:', error);
        mostrarNotificacion('Error al inicializar el simulador principal', 'error');
    }
}

// Crear gráfica de bacterias Escherichia coli
function crearGraficaBacterias() {
    // This function is no longer needed as we're using the imagen.png file instead
}

// Crear gráfica de COVID-19
function crearGraficaCOVID() {
    // This function is no longer needed as we're using the imagen.png file instead
}

// Simulador interactivo
function inicializarSimuladorInteractivo() {
    try {
        const tiempoSlider = document.getElementById('sim-tiempo');
        const intervaloSlider = document.getElementById('sim-intervalo');
        const poblacionInput = document.getElementById('sim-poblacion');
        const simularBtn = document.getElementById('simular');
        
        const tiempoValor = document.getElementById('sim-tiempo-valor');
        const intervaloValor = document.getElementById('sim-intervalo-valor');
        
        const finalPoblacion = document.getElementById('final-poblacion');
        const totalDivisiones = document.getElementById('total-divisiones');
        const masaSimulada = document.getElementById('masa-simulada');
        const comparacionLuna = document.getElementById('comparacion-luna');
        
        // Verificar que todos los elementos existen
        if (!tiempoSlider || !intervaloSlider || !poblacionInput || !simularBtn ||
            !tiempoValor || !intervaloValor || !finalPoblacion || !totalDivisiones ||
            !masaSimulada || !comparacionLuna) {
            console.warn('Algunos elementos del simulador interactivo no se encontraron');
            return;
        }

        function actualizarValores() {
            const tiempo = parseFloat(tiempoSlider.value);
            const intervalo = parseInt(intervaloSlider.value);
            
            tiempoValor.textContent = `${tiempo} días`;
            intervaloValor.textContent = `${intervalo} min`;
        }

        function ejecutarSimulacion() {
            try {
                // Agregar efecto visual al botón
                simularBtn.textContent = ' simulando...';
                simularBtn.disabled = true;
                
                // Simular carga
                setTimeout(() => {
                    const tiempo = parseFloat(tiempoSlider.value) * 24 * 60; // Convertir días a minutos
                    const intervalo = parseInt(intervaloSlider.value);
                    const poblacionInicial = parseInt(poblacionInput.value) || 1;
                    
                    const resultado = calcularCrecimiento(tiempo, intervalo, poblacionInicial);
                    
                    finalPoblacion.textContent = formatScientific(resultado.poblacionFinal);
                    totalDivisiones.textContent = Math.round(resultado.divisiones);
                    masaSimulada.textContent = `${formatScientific(resultado.masaTotal)} kg`;
                    
                    const ratioLuna = resultado.masaTotal / MASSA_LUNA;
                    if (ratioLuna >= 1) {
                        comparacionLuna.textContent = `${formatScientific(ratioLuna)} veces la masa lunar`;
                    } else {
                        comparacionLuna.textContent = `${(ratioLuna * 100).toFixed(2)}% de la masa lunar`;
                    }
                    
                    // Restaurar botón
                    simularBtn.textContent = '🚀 Simular Crecimiento';
                    simularBtn.disabled = false;
                    
                    // Crear gráfico
                    crearGraficoSimulacion(tiempo, intervalo, poblacionInicial);
                    
                    // Mostrar notificación de éxito
                    mostrarNotificacion('Simulación completada exitosamente', 'success');
                }, 500);
            } catch (error) {
                console.error('Error al ejecutar la simulación:', error);
                mostrarNotificacion('Error al ejecutar la simulación', 'error');
                simularBtn.textContent = '🚀 Simular Crecimiento';
                simularBtn.disabled = false;
            }
        }

        tiempoSlider.addEventListener('input', actualizarValores);
        intervaloSlider.addEventListener('input', actualizarValores);
        simularBtn.addEventListener('click', ejecutarSimulacion);
        
        // Inicializar valores
        actualizarValores();
        // Ejecutar simulación después de un breve delay para asegurar que el canvas esté listo
        setTimeout(ejecutarSimulacion, 100);
    } catch (error) {
        console.error('Error al inicializar el simulador interactivo:', error);
        mostrarNotificacion('Error al inicializar el simulador interactivo', 'error');
    }
}

// Crear gráfico de simulación
function crearGraficoSimulacion(tiempoMax, intervalo, poblacionInicial) {
    // This function is no longer needed as we're using the imagen.png file instead
}

// Función para poblar la tabla con datos del Google Spreadsheet
function poblarTablaDatos() {
    // This function is no longer needed as we're replacing the table with charts
}

// Animaciones de scroll
function inicializarAnimaciones() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animación
    document.querySelectorAll('.calc-card, .method-card, .process-step, .app-item, .data-item, .r0-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Navegación suave
function inicializarNavegacion() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Ajustar para navegación fija
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Agregar efecto visual al enlace
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

// Efectos visuales interactivos
function inicializarEfectosVisuales() {
    // Efecto hover en tarjetas
    document.querySelectorAll('.calc-card, .method-card, .app-item, .data-item, .r0-item, .process-step').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });

    // Efecto de partículas en el header
    crearParticulas();
}

// Crear efecto de partículas
function crearParticulas() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    const particulasContainer = document.createElement('div');
    particulasContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    
    header.appendChild(particulasContainer);
    
    for (let i = 0; i < 30; i++) {
        const particula = document.createElement('div');
        particula.style.cssText = `
            position: absolute;
            width: 6px;
            height: 6px;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: flotar ${4 + Math.random() * 6}s ease-in-out infinite;
            animation-delay: ${Math.random() * 3}s;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        `;
        
        particulasContainer.appendChild(particula);
    }
    
    // Agregar CSS para la animación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes flotar {
            0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
            50% { transform: translateY(-30px) rotate(180deg); opacity: 0.8; }
        }
    `;
    document.head.appendChild(style);
}

// Calculadora de COVID-19
function inicializarCalculadoraCOVID() {
    // Función para calcular tiempo de contagio mundial
    function calcularTiempoContagioMundial(r0, poblacionMundial = 8e9) {
        // Fórmula simplificada basada en crecimiento exponencial
        const tiempoDuplicacion = 3; // días (estimado para COVID-19)
        const log2 = Math.log(2);
        const tiempoTotal = (Math.log(poblacionMundial) / log2) * tiempoDuplicacion;
        return tiempoTotal;
    }
    
    // Mostrar información sobre R₀
    const r0Values = [
        { variante: 'COVID-19 Original', r0: 2.5, tiempo: calcularTiempoContagioMundial(2.5) },
        { variante: 'Variante Delta', r0: 6, tiempo: calcularTiempoContagioMundial(6) },
        { variante: 'Variante Ómicron', r0: 10, tiempo: calcularTiempoContagioMundial(10) }
    ];
    
    // Crear elementos dinámicos para mostrar los resultados
    const r0Container = document.querySelector('.r0-values');
    if (r0Container) {
        r0Values.forEach(item => {
            const div = document.createElement('div');
            div.className = 'r0-item';
            div.innerHTML = `
                <strong>🦠 ${item.variante}:</strong> R₀ ≈ ${item.r0}<br>
                <small>⏱️ Tiempo estimado sin medidas: ${Math.round(item.tiempo)} días</small>
            `;
            r0Container.appendChild(div);
        });
    }
}

// Función de utilidad para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    // Remover notificaciones existentes
    const notificacionesExistentes = document.querySelectorAll('.notificacion');
    notificacionesExistentes.forEach(n => n.remove());
    
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.textContent = mensaje;
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${tipo === 'error' ? '#ef4444' : tipo === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1.2rem 1.8rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: 600;
        font-size: 1.1rem;
        max-width: 300px;
    `;
    
    document.body.appendChild(notificacion);
    
    // Animar entrada
    setTimeout(() => {
        notificacion.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notificacion.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.parentNode.removeChild(notificacion);
            }
        }, 300);
    }, 3000);
}

// Función para exportar datos de simulación
function exportarDatos() {
    const tiempo = parseFloat(document.getElementById('sim-tiempo').value) * 24 * 60;
    const intervalo = parseInt(document.getElementById('sim-intervalo').value);
    const poblacionInicial = parseInt(document.getElementById('sim-poblacion').value) || 1;
    
    const datos = [];
    for (let i = 0; i <= 100; i++) {
        const tiempoActual = (tiempo / 100) * i;
        const resultado = calcularCrecimiento(tiempoActual, intervalo, poblacionInicial);
        datos.push({
            tiempo_horas: tiempoActual / 60,
            tiempo_dias: tiempoActual / (24 * 60),
            poblacion: resultado.poblacionFinal,
            masa_kg: resultado.masaTotal,
            divisiones: resultado.divisiones
        });
    }
    
    const csv = [
        'Tiempo (horas),Tiempo (días),Población,Masa (kg),Divisiones',
        ...datos.map(d => `${d.tiempo_horas},${d.tiempo_dias},${d.poblacion},${d.masa_kg},${d.divisiones}`)
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'simulacion_crecimiento_bacteriano.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    mostrarNotificacion('Datos exportados exitosamente', 'success');
}

// Función para calcular bacterias que superan la masa de la Luna
function calcularBacteriasLuna() {
    const bacteriasLuna = MASSA_LUNA / MASSA_BACTERIA;
    const elementoLuna = document.getElementById('moon-bacteria-count');
    const elementoLuna2 = document.getElementById('moon-bacteria-count-2');
    if (elementoLuna) {
        elementoLuna.textContent = formatScientific(bacteriasLuna);
    }
    if (elementoLuna2) {
        elementoLuna2.textContent = formatScientific(bacteriasLuna);
    }
    return bacteriasLuna;
}

// Función para calcular bacterias que superan la masa de la Tierra
function calcularBacteriasTierra() {
    const bacteriasTierra = MASSA_TERRA / MASSA_BACTERIA;
    const elementoTierra = document.getElementById('earth-bacteria-count');
    if (elementoTierra) {
        elementoTierra.textContent = formatScientific(bacteriasTierra);
    }
    return bacteriasTierra;
}

// Función para inicializar el botón de toggle
function inicializarToggleReferencia() {
    const toggleButton = document.getElementById('toggle-reference');
    const referenceData = document.getElementById('reference-data');
    
    if (!toggleButton || !referenceData) return;
    
    toggleButton.addEventListener('click', function() {
        const isVisible = referenceData.style.display !== 'none';
        
        if (isVisible) {
            referenceData.style.display = 'none';
            toggleButton.textContent = 'Mostrar Datos';
        } else {
            referenceData.style.display = 'block';
            toggleButton.textContent = 'Ocultar Datos';
        }
    });
}

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🦠 Inicializando proyecto: Nos Atacan Virus y Bacterias');
    
    // Inicializar todos los componentes
    inicializarSimulador();
    inicializarSimuladorInteractivo();
    inicializarAnimaciones();
    inicializarNavegacion();
    inicializarEfectosVisuales();
    inicializarCalculadoraCOVID();
    calcularBacteriasLuna(); // Calcular bacterias para masa lunar
    calcularBacteriasTierra(); // Calcular bacterias para masa terrestre
    inicializarToggleReferencia(); // Inicializar botón de toggle
    
    // Agregar botón de exportación
    const simulateBtn = document.getElementById('simular');
    if (simulateBtn) {
        const exportBtn = document.createElement('button');
        exportBtn.textContent = '📊 Exportar Datos';
        exportBtn.className = 'export-btn';
        exportBtn.style.cssText = `
            background: var(--secondary-color);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 50px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 1.5rem;
            width: 100%;
            transition: all 0.3s ease;
            box-shadow: var(--shadow-md);
            font-size: 1.1rem;
        `;
        exportBtn.addEventListener('click', exportarDatos);
        exportBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });
        exportBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--shadow-md)';
        });
        simulateBtn.parentNode.appendChild(exportBtn);
    }
    
    // Mostrar notificación de bienvenida
    setTimeout(() => {
        mostrarNotificacion('¡Bienvenido al proyecto de virus y bacterias! 🦠', 'success');
    }, 1000);
    
    console.log('✅ Todos los componentes inicializados correctamente');
});

// Manejo de errores global
window.addEventListener('error', function(e) {
    console.error('Error en la aplicación:', e.error);
    mostrarNotificacion('Ha ocurrido un error en la aplicación', 'error');
});
