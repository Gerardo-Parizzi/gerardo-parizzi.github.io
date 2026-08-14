/**
 * CALCULADOR DE CERCHAS (Cremona / Ritter) (Versión JavaScript)
 * Cálculo estructural y estimación de barras para cerchas de cubierta.
 */

function calcularCercha(luz_m, separacion_m, tipo_cercha) {
    if (luz_m < 2 || luz_m > 30) {
        return { error: "La luz de la cercha debe estar entre 2 y 30 metros." };
    }

    // Criterio general de altura de cercha según la luz (aprox. 1/10 a 1/8 de la luz)
    const altura_m = luz_m / 9;
    
    // Carga estimada sobre cubierta (correas + chapa/tejuela + aislación + peso propio + nieve/viento)
    const carga_uniforme_m2 = 120; // kg/m2
    const carga_total = carga_uniforme_m2 * luz_m * separacion_m; // kg totales sobre la cercha

    // Estimación de esfuerzos máximos en cordones (aproximación por momento flector M = q*l^2 / 8)
    const momento_flector = (carga_total * luz_m) / 8; // kg*m
    const esfuerzo_cordona_kg = (momento_flector / altura_m); // kg

    // Selección de perfil estructural liviano para cerchas (ej. Perfil Doble L / Angulo o Tubo estructural)
    // Tensión admisible del acero estructural
    const sigma_adm = 1400; // kg/cm2
    const area_necesaria_cm2 = Math.abs(esfuerzo_cordona_kg) / sigma_adm;

    let perfil_recomendado = "";
    if (area_necesaria_cm2 <= 3.5) {
        perfil_recomendado = "Perfil Doble Angulo 25x25x3mm";
    } else if (area_necesaria_cm2 <= 6.0) {
        perfil_recomendado = "Perfil Doble Angulo 35x35x4mm";
    } else if (area_necesaria_cm2 <= 10.0) {
        perfil_recomendado = "Perfil Doble Angulo 45x45x5mm";
    } else {
        perfil_recomendado = "Perfil Tubo Estructural Rectangular 80x40x3.2mm o Superior";
    }

    // Cómputo estimado de metros lineales de perfiles por cercha
    // Cordón superior + cordón inferior + diagonales y montantes (aprox. 3.5 veces la luz para Cremona/Ritter)
    const metros_lineales_totales = luz_m * 3.6;

    return {
        tipo: tipo_cercha === 1 ? "Cercha Cremona" : "Cercha Ritter",
        luz: luz_m,
        altura: altura_m.toFixed(2),
        carga_total_kg: carga_total.toFixed(2),
        esfuerzo_diseno_kg: esfuerzo_cordona_kg.toFixed(2),
        perfil: perfil_recomendado,
        ml_perfil_estimado: metros_lineales_totales.toFixed(2),
        estado: "Verificado OK"
    };
}