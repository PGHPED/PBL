// Configuración global
const MASSA_TERRA = 6e15; // kg
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

// Crear gráfico de crecimiento
function crearGraficoCrecimiento() {
    const ctx = document.getElementById('growthChart').getContext('2d');
    
    // Generar datos para el gráfico
    const tiempoMax = 2880; // 2 días en minutos
    const intervalos = [20, 30, 40]; // Diferentes intervalos de duplicación
    const datasets = [];
    let labels = [];
    
    intervalos.forEach((intervalo, index) => {
        const data = [];
        
        for (let tiempo = 0; tiempo <= tiempoMax; tiempo += 120) { // Cada 2 horas
            const resultado = calcularCrecimiento(tiempo, intervalo);
            data.push(Math.log10(resultado.poblacionFinal));
            if (index === 0) { // Solo guardar etiquetas una vez
                labels.push(`${(tiempo / 60).toFixed(1)}h`);
            }
        }
        
        datasets.push({
            label: `Duplicación cada ${intervalo} min`,
            data: data,
            borderColor: ['#3b82f6', '#10b981', '#f59e0b'][index],
            backgroundColor: ['rgba(59, 130, 246, 0.1)', 'rgba(16, 185, 129, 0.1)', 'rgba(245, 158, 11, 0.1)'][index],
            tension: 0.4,
            fill: false
        });
    });
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Crecimiento Exponencial de Bacterias',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Tiempo'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Log₁₀ (Número de Bacterias)'
                    },
                    ticks: {
                        callback: function(value) {
                            return `10^${value}`;
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
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
        const comparacionTierra = document.getElementById('comparacion-tierra');
        
        // Verificar que todos los elementos existen
        if (!tiempoSlider || !intervaloSlider || !poblacionInput || !simularBtn ||
            !tiempoValor || !intervaloValor || !finalPoblacion || !totalDivisiones ||
            !masaSimulada || !comparacionTierra) {
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
                const tiempo = parseFloat(tiempoSlider.value) * 24 * 60; // Convertir días a minutos
                const intervalo = parseInt(intervaloSlider.value);
                const poblacionInicial = parseInt(poblacionInput.value) || 1;
                
                const resultado = calcularCrecimiento(tiempo, intervalo, poblacionInicial);
                
                finalPoblacion.textContent = formatScientific(resultado.poblacionFinal);
                totalDivisiones.textContent = Math.round(resultado.divisiones);
                masaSimulada.textContent = `${formatScientific(resultado.masaTotal)} kg`;
                
                const ratioTierra = resultado.masaTotal / MASSA_TERRA;
                if (ratioTierra >= 1) {
                    comparacionTierra.textContent = `${formatScientific(ratioTierra)} veces la masa terrestre`;
                } else {
                    comparacionTierra.textContent = `${(ratioTierra * 100).toFixed(2)}% de la masa terrestre`;
                }
                
                crearGraficoSimulacion(tiempo, intervalo, poblacionInicial);
            } catch (error) {
                console.error('Error al ejecutar la simulación:', error);
                mostrarNotificacion('Error al ejecutar la simulación', 'error');
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
    try {
        const canvas = document.getElementById('simulationChart');
        if (!canvas) {
            console.warn('Elemento simulationChart no encontrado');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        
        // Destruir gráfico anterior si existe
        if (window.simulationChart) {
            window.simulationChart.destroy();
        }
        
        const data = [];
        const labels = [];
        const masaData = [];
        
        // Generar datos cada 10% del tiempo total
        for (let i = 0; i <= 10; i++) {
            const tiempo = (tiempoMax / 10) * i;
            const resultado = calcularCrecimiento(tiempo, intervalo, poblacionInicial);
            
            data.push(Math.log10(resultado.poblacionFinal));
            masaData.push(Math.log10(resultado.masaTotal));
            labels.push(`${(tiempo / (24 * 60)).toFixed(1)}d`);
        }
        
        window.simulationChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Población (log₁₀)',
                        data: data,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Masa Total (log₁₀ kg)',
                        data: masaData,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Simulación de Crecimiento Bacteriano',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Tiempo (días)'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Log₁₀ (Población)'
                        },
                        ticks: {
                            callback: function(value) {
                                return `10^${value}`;
                            }
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Log₁₀ (Masa en kg)'
                        },
                        ticks: {
                            callback: function(value) {
                                return `10^${value}`;
                            }
                        },
                        grid: {
                            drawOnChartArea: false,
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    } catch (error) {
        console.error('Error al crear el gráfico de simulación:', error);
        mostrarNotificacion('Error al crear el gráfico de simulación', 'error');
    }
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
    document.querySelectorAll('.calc-card, .method-card, .process-step, .app-item').forEach(el => {
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
            }
        });
    });
}

// Efectos visuales interactivos
function inicializarEfectosVisuales() {
    // Efecto hover en tarjetas
    document.querySelectorAll('.calc-card, .method-card, .app-item').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Efecto de partículas en el header
    crearParticulas();
}

// Crear efecto de partículas
function crearParticulas() {
    const header = document.querySelector('.header');
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
    
    for (let i = 0; i < 20; i++) {
        const particula = document.createElement('div');
        particula.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: flotar ${3 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        
        particulasContainer.appendChild(particula);
    }
    
    // Agregar CSS para la animación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes flotar {
            0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
            50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
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
                <strong>${item.variante}:</strong> R₀ ≈ ${item.r0}<br>
                <small>Tiempo estimado sin medidas: ${Math.round(item.tiempo)} días</small>
            `;
            r0Container.appendChild(div);
        });
    }
}

// Función de utilidad para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.textContent = mensaje;
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${tipo === 'error' ? '#ef4444' : tipo === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
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
            document.body.removeChild(notificacion);
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

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🦠 Inicializando proyecto: Nos Atacan Virus y Bacterias');
    
    // Inicializar todos los componentes
    inicializarSimulador();
    crearGraficoCrecimiento();
    inicializarSimuladorInteractivo();
    inicializarAnimaciones();
    inicializarNavegacion();
    inicializarEfectosVisuales();
    inicializarCalculadoraCOVID();
    
    // Agregar botón de exportación
    const simulateBtn = document.getElementById('simular');
    const exportBtn = document.createElement('button');
    exportBtn.textContent = '📊 Exportar Datos';
    exportBtn.className = 'export-btn';
    exportBtn.style.cssText = `
        background: var(--secondary-color);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        margin-top: 1rem;
        width: 100%;
        transition: background 0.3s ease;
    `;
    exportBtn.addEventListener('click', exportarDatos);
    simulateBtn.parentNode.appendChild(exportBtn);
    
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

// Función para actualizar estadísticas en tiempo real
function actualizarEstadisticas() {
    const stats = {
        bacteriasEnTierra: MASSA_TERRA / MASSA_BACTERIA,
        tiempoParaDuplicar: 20, // minutos
        masaPorBacteria: MASSA_BACTERIA
    };
    
    // Crear elemento de estadísticas si no existe
    let statsElement = document.getElementById('estadisticas-realtime');
    if (!statsElement) {
        statsElement = document.createElement('div');
        statsElement.id = 'estadisticas-realtime';
        statsElement.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: var(--surface-color);
            padding: 1rem;
            border-radius: 0.5rem;
            box-shadow: var(--shadow-md);
            border: 1px solid var(--border-color);
            z-index: 1000;
            font-size: 0.9rem;
            max-width: 250px;
        `;
        document.body.appendChild(statsElement);
    }
    
    statsElement.innerHTML = `
        <h4 style="margin-bottom: 0.5rem; color: var(--primary-color);">📊 Datos de Referencia</h4>
        <p><strong>Bacterias para igualar masa terrestre:</strong><br>${formatScientific(stats.bacteriasEnTierra)}</p>
        <p><strong>Masa por bacteria:</strong><br>${formatScientific(stats.masaPorBacteria)} kg</p>
        <p><strong>Tiempo de duplicación:</strong><br>${stats.tiempoParaDuplicar} minutos</p>
    `;
}

// Llamar a actualizar estadísticas después de un breve delay
setTimeout(actualizarEstadisticas, 2000);
