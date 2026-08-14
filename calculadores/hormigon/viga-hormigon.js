/**
 * CALCULADOR INTEGRAL DE VIGAS DE HORMIGÓN ARMADO (Versión JavaScript)
 * Cálculo a flexión, armadura longitudinal, estribos por corte y verificación.
 */

function calcularVigaHormigonCompleta(nombre_viga, luz_m, carga_uniforme_kgm, base_cm, altura_cm) {
    // 1. Datos y coeficientes reglamentarios (H21 / Acero ADN 420)
    const fck = 210; // Resistencia del hormigón (kg/cm2)
    const fy = 4200; // Tensión de fluencia del acero (kg/cm2)
    const recubrimiento_cm = 3; // Recubrimiento mecánico
    
    const L_cm = luz_m * 100;
    const q_kgcm = carga_uniforme_kgm / 100;

    // 2. Altura útil (d)
    let d = altura_cm - recubrimiento_cm;

    // 3. Momento flector máximo Mmax = (q * L^2) / 8 (en kg*cm)
    const M_max = (q_kgcm * Math.pow(L_cm, 2)) / 8;

    // 4. Cálculo de la sección de acero necesaria a flexión (As)
    // Fórmula simplificada de equilibrio de secciones rectangulares
    let z = 0.87 * d; // Brazo de palanca aproximado
    let As_necesaria = M_max / (0.85 * fy * z);

    // Cuantía mínima reglamentaria aproximada
    let As_minima = 0.0015 * base_cm * altura_cm;
    let As_adoptada = Math.max(As_necesaria, As_minima);

    // 5. Verificación simplificada al corte
    // Cortante máximo en los apoyos Vmax = (q * L) / 2
    const V_max = (q_kgcm * L_cm) / 2;
    const b0 = base_cm;
    const tau_corte = V_max / (b0 * d); // Tensión de corte actuante (kg/cm2)
    
    let requiere_estribos = "Sí, estribos reglamentarios cada 15/20 cm";
    if (tau_corte < 3.5) {
        requiere_estribos = "Estribos constructivos mínimos (separación H/2 o 20cm)";
    } else {
        requiere_estribos = "Alerta: Cortante elevado, reducir estribos o aumentar sección";
    }

    // 6. Selección de armadura longitudinal comercial (ej: barras del 12 o 16 mm)
    // Sección de una barra del 12mm = 1.13 cm2, del 16mm = 2.01 cm2
    let diametro_barra = 12;
    let seccion_barra = 1.13;
    let cant_barras = Math.ceil(As_adoptada / seccion_barra);
    if (cant_barras < 2) cant_barras = 2; // Mínimo constructivo de 2 barras

    return {
        elemento: nombre_viga,
        seccion: `${base_cm} x ${altura_cm} cm`,
        momento_max_kgcm: M_max.toFixed(2),
        cortante_max_kg: V_max.toFixed(2),
        acero_necesario_cm2: As_necesaria.toFixed(2),
        acero_adoptado_cm2: As_adoptada.toFixed(2),
        armadura_longitudinal: `${cant_barras} barras de FI ${diametro_barra} mm`,
        verificacion_corte: requiere_estribos
    };
}