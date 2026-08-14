/**
 * CALCULADOR DE PERFILES UPN SIMPLES (Versión JavaScript)
 * Cálculo estructural para perfiles UPN individuales sometidos a flexión.
 */

function calcularUPNSimple(L_metros, q_kgm) {
    const sigma_adm = 1400;  // Tensión admisible del acero (kg/cm2)
    const E = 2100000;       // Módulo de elasticidad (kg/cm2)
    const flecha_adm_divisor = 300; // L / 300

    // Base de datos de perfiles UPN comerciales
    const upn = [80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300];
    const peso = [8.64, 10.60, 13.40, 16.00, 18.80, 22.00, 25.30, 29.40, 33.20, 37.90, 41.80, 46.20];
    const inercia = [106, 206, 364, 605, 925, 1350, 1910, 2690, 3600, 4820, 6280, 8030];
    const modulo = [26.5, 41.2, 60.7, 86.4, 116.0, 150.0, 191.0, 245.0, 300.0, 371.0, 448.0, 535.0];

    let perfil_encontrado = -1;
    let idx_valido = 0;
    const L_cm = L_metros * 100;
    const flecha_adm = L_cm / flecha_adm_divisor;

    for (let i = 0; i < upn.length; i++) {
        let q_total_kgcm = (q_kgm + peso[i]) / 100; // kg/cm
        let M_max_kgcm = (q_total_kgcm * Math.pow(L_cm, 2)) / 8;
        let Wx_nec = M_max_kgcm / sigma_adm;

        if (modulo[i] >= Wx_nec) {
            let flecha_real = (5 * q_total_kgcm * Math.pow(L_cm, 4)) / (384 * E * inercia[i]);

            if (flecha_real <= flecha_adm) {
                perfil_encontrado = upn[i];
                idx_valido = i;
                break;
            }
        }
    }

    if (perfil_encontrado === -1) {
        return { error: "La carga o la luz superan los perfiles UPN simples disponibles." };
    }

    const peso_total_barra = peso[idx_valido] * L_metros;

    return {
        perfil: "UPN " + perfil_encontrado,
        peso_metro: peso[idx_valido],
        peso_total: peso_total_barra.toFixed(2),
        largo: L_metros,
        estado: "Verificado OK"
    };
}