/**
 * CALCULADOR DE COLUMNAS DE MADERA (Versión JavaScript)
 * Dimensionamiento a compresión centrada para pilares/columnas.
 */

function calcularColumnaMadera(carga_axial_kgu, altura_libre_m, lado_b_cm, tipo_madera) {
    let sigma_adm_comp = 60; // Pino al corte/compresión por defecto (kg/cm2)
    let E = 100000;

    if (tipo_madera === 2) {
        sigma_adm_comp = 110; // Dura
        E = 130000;
    } else if (tipo_madera === 3) {
        sigma_adm_comp = 85;  // Semidura / Eucalipto
        E = 110000;
    }

    const L_cm = altura_libre_m * 100;
    
    // Área geométrica necesaria por tensión admisible directa (A = P / sigma)
    let area_nec_cm2 = carga_axial_kgu / sigma_adm_comp;
    let lado_h_cm = Math.sqrt(area_nec_cm2); // Asumiendo sección cuadrada inicial b x h
    
    lado_h_cm = Math.max(lado_b_cm, Math.ceil(lado_h_cm));

    // Verificación simplificada de esbeltez (Radio de giro i = 0.289 * b)
    const radio_giro = 0.289 * Math.min(lado_b_cm, lado_h_cm);
    const esbeltez = L_cm / radio_giro;

    let estado_verificacion = "Verificado OK";
    if (esbeltez > 120) {
        estado_verificacion = "Alerta: Columna muy esbelta (peligro de pandeo, aumentar sección)";
    }

    return {
        elemento: "Columna de Madera",
        seccion: `${lado_b_cm} x ${lado_h_cm} cm`,
        area_cm2: (lado_b_cm * lado_h_cm),
        esbeltez: esbeltez.toFixed(1),
        estado: estado_verificacion
    };
}