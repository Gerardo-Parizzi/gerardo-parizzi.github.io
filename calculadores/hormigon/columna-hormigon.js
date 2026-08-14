/**
 * CALCULADOR INTEGRAL DE COLUMNAS DE HORMIGÓN ARMADO (Versión JavaScript)
 * Cálculo a compresión centrada, sección mínima y armadura longitudinal/transversal.
 */

function calcularColumnaHormigonCompleta(nombre_columna, carga_axial_kg, lado_b_cm, lado_h_cm) {
    // 1. Datos y coeficientes reglamentarios (H21 / Acero ADN 420)
    const fck = 210; // Resistencia del hormigón (kg/cm2)
    const fy = 4200; // Tensión de fluencia del acero (kg/cm2)
    
    // Mayoración de carga de servicio (coeficiente 1.4 aprox para estado límite)
    const P_u = carga_axial_kg * 1.4;

    // 2. Sección geométrica y área bruta
    const Ag_actual = lado_b_cm * lado_h_cm;

    // 3. Resistencia nominal a compresión centrada simplificada
    // Pn = 0.85 * fck * (Ag - Ast) + fy * Ast  (asumiendo 1% de acero inicial Ast = 0.01 * Ag)
    const P_resistencia = 0.85 * fck * Ag_actual * 0.80 + 0.01 * Ag_actual * fy;

    // 4. Armadura longitudinal (Mínimo 1% y máximo 4% de la sección bruta)
    let As_total = 0.01 * Ag_actual; // 1% mínimo reglamentario
    if (P_u > P_resistencia) {
        // Si la carga mayorada supera la resistencia, calculamos el acero necesario adicional
        As_total = (P_u - (0.85 * fck * Ag_actual * 0.80)) / (fy - (0.85 * fck));
        if (As_total < 0.01 * Ag_actual) As_total = 0.01 * Ag_actual;
    }

    // Selección comercial de barras longitudinales (ej: barras del 16 mm = 2.01 cm2)
    const seccion_barra_16 = 2.01;
    let cant_barras = Math.ceil(As_total / seccion_barra_16);
    if (cant_barras < 4) cant_barras = 4; // Mínimo 4 barras para columna rectangular/cuadrada

    // 5. Armadura transversal (Estribos)
    // El diámetro del estribo suele ser 1/4 del longitudinal o mínimo 6mm/8mm
    let diam_estribo = 8; // mm
    let separacion_estribos = Math.min(15, lado_b_cm, lado_h_cm); // Regla práctica de separación

    let estado = P_u <= P_resistencia ? "Verificado OK (Compresión)" : "Alerta: Aumentar sección de hormigón";

    return {
        elemento: nombre_columna,
        seccion: `${lado_b_cm} x ${lado_h_cm} cm`,
        area_bruta_cm2: Ag_actual,
        carga_mayorada_kg: P_u.toFixed(2),
        acero_longitudinal_cm2: As_total.toFixed(2),
        armadura_principal: `${cant_barras} barras de FI 16 mm`,
        armadura_transversal: `Estribos de FI ${diam_estribo} mm c/${separacion_estribos} cm`,
        estado: estado
    };
}