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
            fill: false,
            pointRadius: 4,
            pointHoverRadius: 6
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
                        size: 18,
                        weight: 'bold'
                    },
                    padding: 20
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14
                        },
                        padding: 20
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Tiempo (horas)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Log₁₀ (Número de Bacterias)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            return `10^${value}`;
                        },
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
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
                    
                    const ratioTierra = resultado.masaTotal / MASSA_TERRA;
                    if (ratioTierra >= 1) {
                        comparacionTierra.textContent = `${formatScientific(ratioTierra)} veces la masa terrestre`;
                    } else {
                        comparacionTierra.textContent = `${(ratioTierra * 100).toFixed(2)}% de la masa terrestre`;
                    }
                    
                    // Restaurar botón
                    simularBtn.textContent = 'Simular Crecimiento';
                    simularBtn.disabled = false;
                    
                    // Crear gráfico
                    crearGraficoSimulacion(tiempo, intervalo, poblacionInicial);
                    
                    // Mostrar notificación de éxito
                    mostrarNotificacion('Simulación completada exitosamente', 'success');
                }, 500);
            } catch (error) {
                console.error('Error al ejecutar la simulación:', error);
                mostrarNotificacion('Error al ejecutar la simulación', 'error');
                simularBtn.textContent = 'Simular Crecimiento';
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
                        yAxisID: 'y',
                        pointRadius: 5,
                        pointHoverRadius: 7
                    },
                    {
                        label: 'Masa Total (log₁₀ kg)',
                        data: masaData,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4,
                        yAxisID: 'y1',
                        pointRadius: 5,
                        pointHoverRadius: 7
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
                            size: 18,
                            weight: 'bold'
                        },
                        padding: 20
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: {
                                size: 14
                            },
                            padding: 20
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Tiempo (días)',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Log₁₀ (Población)',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            callback: function(value) {
                                return `10^${value}`;
                            },
                            font: {
                                size: 12
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Log₁₀ (Masa en kg)',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            callback: function(value) {
                                return `10^${value}`;
                            },
                            font: {
                                size: 12
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
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
    } catch (error) {
        console.error('Error al crear el gráfico de simulación:', error);
        mostrarNotificacion('Error al crear el gráfico de simulación', 'error');
    }
}

// Función para poblar la tabla con datos del Google Spreadsheet
function poblarTablaDatos() {
    // Datos del Google Spreadsheet
    const datos = [
        { hora: "8:00", intervalo: 0, bacterias: 7, masa: "0.0000000000000049" },
        { hora: "8:20", intervalo: 1, bacterias: 14, masa: "0.0000000000000098" },
        { hora: "8:40", intervalo: 2, bacterias: 28, masa: "0.0000000000000196" },
        { hora: "9:00", intervalo: 3, bacterias: 56, masa: "0.0000000000000392" },
        { hora: "9:20", intervalo: 4, bacterias: 112, masa: "0.0000000000000784" },
        { hora: "9:40", intervalo: 5, bacterias: 224, masa: "0.0000000000001568" },
        { hora: "10:00", intervalo: 6, bacterias: 448, masa: "0.0000000000003136" },
        { hora: "10:20", intervalo: 7, bacterias: 896, masa: "0.0000000000006272" },
        { hora: "10:40", intervalo: 8, bacterias: 1792, masa: "0.0000000000012544" },
        { hora: "11:00", intervalo: 9, bacterias: 3584, masa: "0.0000000000025088" },
        { hora: "11:20", intervalo: 10, bacterias: 7168, masa: "0.0000000000050176" },
        { hora: "11:40", intervalo: 11, bacterias: 14336, masa: "0.0000000000100352" },
        { hora: "12:00", intervalo: 12, bacterias: 28672, masa: "0.0000000000200704" },
        { hora: "12:20", intervalo: 13, bacterias: 57344, masa: "0.0000000000401408" },
        { hora: "12:40", intervalo: 14, bacterias: 114688, masa: "0.0000000000802816" },
        { hora: "13:00", intervalo: 15, bacterias: 229376, masa: "0.0000000001605632" },
        { hora: "13:20", intervalo: 16, bacterias: 458752, masa: "0.0000000003211264" },
        { hora: "13:40", intervalo: 17, bacterias: 917504, masa: "0.0000000006422528" },
        { hora: "14:00", intervalo: 18, bacterias: 1835008, masa: "0.0000000012845056" },
        { hora: "14:20", intervalo: 19, bacterias: 3670016, masa: "0.0000000025690112" },
        { hora: "14:40", intervalo: 20, bacterias: 7340032, masa: "0.0000000051380224" },
        { hora: "15:00", intervalo: 21, bacterias: 14680064, masa: "0.0000000102760448" },
        { hora: "15:20", intervalo: 22, bacterias: 29360128, masa: "0.0000000205520896" },
        { hora: "15:40", intervalo: 23, bacterias: 58720256, masa: "0.0000000411041792" },
        { hora: "16:00", intervalo: 24, bacterias: 117440512, masa: "0.0000000822083584" },
        { hora: "16:20", intervalo: 25, bacterias: 234881024, masa: "0.0000001644167168" },
        { hora: "16:40", intervalo: 26, bacterias: 469762048, masa: "0.0000003288334336" },
        { hora: "17:00", intervalo: 27, bacterias: 939524096, masa: "0.0000006576668672" },
        { hora: "17:20", intervalo: 28, bacterias: 1879048192, masa: "0.000001315333734" },
        { hora: "17:40", intervalo: 29, bacterias: 3758096384, masa: "0.000002630667469" },
        { hora: "18:00", intervalo: 30, bacterias: 7516192768, masa: "0.000005261334938" },
        { hora: "18:20", intervalo: 31, bacterias: 15032385536, masa: "0.00001052266988" },
        { hora: "18:40", intervalo: 32, bacterias: 30064771072, masa: "0.00002104533975" },
        { hora: "19:00", intervalo: 33, bacterias: 60129542144, masa: "0.0000420906795" },
        { hora: "19:20", intervalo: 34, bacterias: 120259084288, masa: "0.000084181359" },
        { hora: "19:40", intervalo: 35, bacterias: 240518168576, masa: "0.000168362718" },
        { hora: "20:00", intervalo: 36, bacterias: 481036337152, masa: "0.000336725436" },
        { hora: "20:20", intervalo: 37, bacterias: 962072674304, masa: "0.000673450872" },
        { hora: "20:40", intervalo: 38, bacterias: 1924145348608, masa: "0.001346901744" },
        { hora: "21:00", intervalo: 39, bacterias: 3848290697216, masa: "0.002693803488" },
        { hora: "21:20", intervalo: 40, bacterias: 7696581394432, masa: "0.005387606976" },
        { hora: "21:40", intervalo: 41, bacterias: 15393162788864, masa: "0.01077521395" },
        { hora: "22:00", intervalo: 42, bacterias: 30786325577728, masa: "0.0215504279" },
        { hora: "22:20", intervalo: 43, bacterias: 61572651155456, masa: "0.04310085581" },
        { hora: "22:40", intervalo: 44, bacterias: 123145302310912, masa: "0.08620171162" },
        { hora: "23:00", intervalo: 45, bacterias: 246290604621824, masa: "0.1724034232" },
        { hora: "23:20", intervalo: 46, bacterias: 492581209243648, masa: "0.3448068465" },
        { hora: "23:40", intervalo: 47, bacterias: 985162418487296, masa: "0.6896136929" },
        { hora: "0:00", intervalo: 48, bacterias: "1.97E+15", masa: "1.379227386" },
        { hora: "0:20", intervalo: 49, bacterias: "3.94E+15", masa: "2.758454772" },
        { hora: "0:40", intervalo: 50, bacterias: "7.88E+15", masa: "5.516909544" },
        { hora: "1:00", intervalo: 51, bacterias: "1.58E+16", masa: "11.03381909" },
        { hora: "1:20", intervalo: 52, bacterias: "3.15E+16", masa: "22.06763817" },
        { hora: "1:40", intervalo: 53, bacterias: "6.31E+16", masa: "44.13527635" },
        { hora: "2:00", intervalo: 54, bacterias: "1.26E+17", masa: "88.2705527" },
        { hora: "2:20", intervalo: 55, bacterias: "2.52E+17", masa: "176.5411054" },
        { hora: "2:40", intervalo: 56, bacterias: "5.04E+17", masa: "353.0822108" },
        { hora: "3:00", intervalo: 57, bacterias: "1.01E+18", masa: "706.1644216" },
        { hora: "3:20", intervalo: 58, bacterias: "2.02E+18", masa: "1412.328843" },
        { hora: "3:40", intervalo: 59, bacterias: "4.04E+18", masa: "2824.657686" },
        { hora: "4:00", intervalo: 60, bacterias: "8.07E+18", masa: "5649.315373" },
        { hora: "4:20", intervalo: 61, bacterias: "1.61E+19", masa: "11298.63075" },
        { hora: "4:40", intervalo: 62, bacterias: "3.23E+19", masa: "22597.26149" },
        { hora: "5:00", intervalo: 63, bacterias: "6.46E+19", masa: "45194.52298" },
        { hora: "5:20", intervalo: 64, bacterias: "1.29E+20", masa: "90389.04596" },
        { hora: "5:40", intervalo: 65, bacterias: "2.58E+20", masa: "180778.0919" },
        { hora: "6:00", intervalo: 66, bacterias: "5.17E+20", masa: "361556.1838" },
        { hora: "6:20", intervalo: 67, bacterias: "1.03E+21", masa: "723112.3677" },
        { hora: "6:40", intervalo: 68, bacterias: "2.07E+21", masa: "1446224.735" },
        { hora: "7:00", intervalo: 69, bacterias: "4.13E+21", masa: "2892449.471" },
        { hora: "7:20", intervalo: 70, bacterias: "8.26E+21", masa: "5784898.942" },
        { hora: "7:40", intervalo: 71, bacterias: "1.65E+22", masa: "11569797.88" },
        { hora: "8:00", intervalo: 72, bacterias: "3.31E+22", masa: "23139595.77" }
    ];
    
    const tablaBody = document.querySelector('#datos-tabla tbody');
    if (!tablaBody) return;
    
    // Limpiar contenido existente
    tablaBody.innerHTML = '';
    
    // Poblar la tabla con los datos
    datos.forEach(fila => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${fila.hora}</td>
            <td>${fila.intervalo}</td>
            <td>${fila.bacterias}</td>
            <td>${fila.masa}</td>
        `;
        tablaBody.appendChild(tr);
    });
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
                <strong>${item.variante}:</strong> R₀ ≈ ${item.r0}<br>
                <small>Tiempo estimado sin medidas: ${Math.round(item.tiempo)} días</small>
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

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🦠 Inicializando proyecto: Nos Atacan Virus y Bacterias');
    
    // Inicializar todos los componentes
    inicializarSimulador();
    // crearGraficoCrecimiento(); // Removido ya que no se necesita
    inicializarSimuladorInteractivo();
    inicializarAnimaciones();
    inicializarNavegacion();
    inicializarEfectosVisuales();
    inicializarCalculadoraCOVID();
    poblarTablaDatos(); // Agregado para poblar la tabla con datos
    
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
            padding: 1.2rem;
            border-radius: 1rem;
            box-shadow: var(--shadow-lg);
            border: 1px solid var(--border-color);
            z-index: 1000;
            font-size: 0.95rem;
            max-width: 280px;
            backdrop-filter: blur(10px);
        `;
        document.body.appendChild(statsElement);
    }
    
    statsElement.innerHTML = `
        <h4 style="margin-bottom: 0.8rem; color: var(--primary-color); font-weight: 700;">📊 Datos de Referencia</h4>
        <p><strong>Bacterias para igualar masa terrestre:</strong><br>${formatScientific(stats.bacteriasEnTierra)}</p>
        <p><strong>Masa por bacteria:</strong><br>${formatScientific(stats.masaPorBacteria)} kg</p>
        <p><strong>Tiempo de duplicación:</strong><br>${stats.tiempoParaDuplicar} minutos</p>
    `;
}

// Llamar a actualizar estadísticas después de un breve delay
setTimeout(actualizarEstadisticas, 2000);
