/**
 * ASISTENTE DE APERTURA DE MUROS PORTANTES (Versión JavaScript)
 * Cálculo estructural y cómputo de materiales optimizado para web.
 */

function calcularAperturaMuro(ancho_cm, largo_muro, L, h_muro, tipo_techo) {
    if (ancho_cm < 10) {
        return { error: "El ancho en centímetros debe ser un número entero (ej: 30 o 45)." };
    }

    const ancho_muro = ancho_cm / 100;
    const E = 2100000;       // Módulo de elasticidad del acero (kg/cm2)
    const sigma_adm = 1400;  // Tensión admisible (kg/cm2)
    const peso_especifico_ladrillo = 1600; // kg/m3

    // Cargas físicas
    const q_muro = ancho_muro * h_muro * peso_especifico_ladrillo;
    const q_cubierta = (tipo_techo === 1) ? (60 * 2) : (350 * 2);
    const q_actuante = q_muro + q_cubierta;
    const L_total_perfil = L + 0.60;

    // Base de datos de perfiles UPN
    const upn = [80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300];
    const peso = [8.64, 10.60, 13.40, 16.00, 18.80, 22.00, 25.30, 29.40, 33.20, 37.90, 41.80, 46.20];
    const inercia = [106, 206, 364, 605, 925, 1350, 1910, 2690, 3600, 4820, 6280, 8030];
    const modulo = [26.5, 41.2, 60.7, 86.4, 116.0, 150.0, 191.0, 245.0, 300.0, 371.0, 448.0, 535.0];

    // Algoritmo de selección
    const q_por_perfil_estimado = q_actuante / 2;
    let perfil_encontrado = -1;
    const flecha_adm = (L * 100) / 300;
    let idx_valido = 0;

    for (let i = 0; i < upn.length; i++) {
        let M_max_kgcm = (((q_por_perfil_estimado + peso[i]) * L * L) / 8) * 100;
        let Wx_nec = M_max_kgcm / sigma_adm;

        if (modulo[i] >= Wx_nec) {
            let q_kgcm = (q_por_perfil_estimado + peso[i]) / 100;
            let L_cm = L * 100;
            let flecha_real = (5 * q_kgcm * Math.pow(L_cm, 4)) / (384 * E * inercia[i]);

            if (flecha_real <= flecha_adm) {
                perfil_encontrado = upn[i];
                idx_valido = i;
                break;
            }
        }
    }

    if (perfil_encontrado === -1) {
        return { error: "La carga supera las capacidades de la tabla comercial común." };
    }

    // Cómputo métrico de materiales
    const ancho_cara_m = (ancho_cm / 2) / 100;
    const vol_bloques = 4 * (0.20 * ancho_cara_m * 0.15);
    const vol_concreto = (L_total_perfil * 0.05 * ancho_cara_m * 2) + (L_total_perfil * 0.07 * 0.16);
    const vol_total_mezcla = (vol_bloques + vol_concreto) * 1.15;

    const total_arena_m3 = vol_total_mezcla * 0.53;
    const total_piedra_m3 = vol_total_mezcla * 0.73;
    const total_cemento_kg = vol_total_mezcla * 350;

    const cant_puntales = Math.max(3, Math.floor(L) + 1);

    return {
        perfil: perfil_encontrado,
        peso_metro: peso[idx_valido],
        peso_total_hierros: (peso[idx_valido] * L_total_perfil * 2).toFixed(2),
        largo_perfil: L_total_perfil.toFixed(2),
        carga_total: q_actuante.toFixed(2),
        puntales_total: cant_puntales * 2,
        cemento_bolsas: Math.floor(total_cemento_kg / 50) + 1,
        arena_bolsas: Math.floor(total_arena_m3 / 0.02) + 1,
        piedra_bolsas: Math.floor(total_piedra_m3 / 0.02) + 1,
        cunas_hierro: (Math.floor(L / 0.5) + 1) * 2,
        esparragos: Math.floor(L / 0.8) + 1,
        madera_ml: ((cant_puntales * 2 * 3) + (L * 2)).toFixed(2)
    };
}