/**
 * CALCULADOR DE PERFILES IPN (Versión JavaScript)
 * Cálculo de flexión y selección de perfiles doble T.
 */

function calcularIPN(L_metros, q_kgm) {
    const sigma_adm = 1400;  // Tensión admisible del acero (kg/cm2)
    const E = 2100000;       // Módulo de elasticidad (kg/cm2)
    const flecha_adm_divisor = 300; // L / 300

    // Base de datos de perfiles IPN comerciales
    const ipn = [80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 300, 320, 340, 360, 400, 450, 500, 550, 600];
    const peso = [5.94, 8.34, 11.10, 14.30, 17.90, 21.90, 26.20, 31.10, 36.20, 41.60, 54.20, 61.00, 68.00, 76.10, 92.60, 115.00, 141.00, 166.00, 199.00];
    const inercia = [77.8, 171, 328, 573, 935, 1450, 2140, 3060, 4250, 5740, 9800, 12100, 15100, 18600, 27100, 39100, 54100, 72000, 95100];
    const modulo = [19.5, 34.2, 54.7, 81.9, 117.0, 161.0, 214.0, 278.0, 354.0, 442.0, 653.0, 757.0, 880.0, 1030.0, 1360.0, 1740.0, 2160.0, 2620.0, 3170.0];

    let perfil_encontrado = -1;
    let idx_valido = 0;
    const L_cm = L_metros * 100;
    const flecha_adm = L_cm / flecha_adm_divisor;

    for (let i = 0; i < ipn.length; i++) {
        // Momento máximo en kg*cm (q total incluye el peso propio estimado del perfil)
        let q_total_kgcm = (q_kgm + peso[i]) / 100; // kg/cm
        let M_max_kgcm = (q_total_kgcm * Math.pow(L_cm, 2)) / 8;
        let Wx_nec = M_max_kgcm / sigma_adm;

        if (modulo[i] >= Wx_nec) {
            // Verificación de deformación (flecha)
            let flecha_real = (5 * q_total_kgcm * Math.pow(L_cm, 4)) / (384 * E * inercia[i]);

            if (flecha_real <= flecha_adm) {
                perfil_encontrado = ipn[i];
                idx_valido = i;
                break;
            }
        }
    }

    if (perfil_encontrado === -1) {
        return { error: "La luz o la carga superan los perfiles IPN estándar de la tabla." };
    }

    const peso_total_barra = peso[idx_valido] * L_metros;

    return {
        perfil: "IPN " + perfil_encontrado,
        peso_metro: peso[idx_valido],
        peso_total: peso_total_barra.toFixed(2),
        largo: L_metros,
        momento_seleccion: "Verificado por flexión y flecha"
    };
}