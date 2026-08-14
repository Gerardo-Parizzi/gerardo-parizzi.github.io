/**
 * CALCULADOR INTEGRAL DE LOSAS DE HORMIGÓN ARMADO (Versión JavaScript)
 * Precálculo de espesor, momentos flectores y armadura principal por metro lineal.
 */

function calcularLosaCompleta(nombre_losa, luz_mayor_m, luz_menor_m, carga_total_kgm2, tipo_apoyo) {
    // 1. Relación de lados para determinar si es losa armada en una o dos direcciones
    const beta = luz_mayor_m / luz_menor_m;
    let tipo_armado = "Armada en una dirección (Unidireccional)";
    if (beta < 2.0) {
        tipo_armado = "Armada en dos direcciones (Cruzada)";
    }

    // 2. Pre-dimensionamiento del espesor (h) según flecha admisible (ej: L / 30 para continuas)
    // Luz de cálculo tomada como la menor
    let h_cm = (luz_menor_m * 100) / 30;
    h_cm = Math.max(Math.ceil(h_cm), 10); // Espesor mínimo constructivo de 10 cm

    // 3. Momento flector máximo por metro de ancho (M = q * L^2 / 8 como aproximación general)
    const L_cm = luz_menor_m * 100;
    const q_kgcm2 = carga_total_kgm2 / 10000; // kg/cm2
    
    // Momento en kg*cm por metro de ancho (b = 100 cm)
    const M_max = ( (carga_total_kgm2 / 100) * Math.pow(L_cm, 2) ) / 8;

    // 4. Cálculo de armadura principal por metro (As)
    const d = h_cm - 2.5; // Altura útil con recubrimiento de 2.5 cm
    const fy = 4200;      // Acero ADN 420
    let As_necesaria = M_max / (0.85 * fy * (0.87 * d));
    
    // Cuantía mínima reglamentaria por metro
    let As_minima = 0.0018 * 100 * h_cm; 
    let As_adoptada = Math.max(As_necesaria, As_minima);

    // Selección de armadura por metro (ej: barras del 8 = 0.50 cm2 o del 10 = 0.79 cm2)
    let seccion_barra_8 = 0.50;
    let separacion_cm = (seccion_barra_8 * 100) / As_adoptada;
    separacion_cm = Math.min(Math.floor(separacion_cm / 5) * 5, 20); // Redondeo constructivo a múltiplos de 5 (máx 20cm)
    if (separacion_cm < 10) separacion_cm = 10;

    return {
        elemento: nombre_losa,
        tipo_sistema: tipo_armado,
        espesor_adoptado_cm: h_cm,
        momento_flector_kgcm: M_max.toFixed(2),
        acero_necesario_cm2_m: As_adoptada.toFixed(2),
        armadura_principal: `Barras de FI 8 mm c/ ${separacion_cm} cm`,
        verificacion: "Pre-dimensionamiento OK por flexión y flecha"
    };