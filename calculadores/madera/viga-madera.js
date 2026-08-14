/**
 * CALCULADOR DE VIGAS DE MADERA (Versión JavaScript)
 * Dimensionamiento a flexión para vigas de madera.
 */

function calcularVigaMadera(luz_m, q_kgm, base_cm, tipo_madera) {
    let sigma_adm = 75; // Pino por defecto (kg/cm2)
    let E = 100000;     

    if (tipo_madera === 2) {
        sigma_adm = 130; // Dura (Petiribí/Urunday)
        E = 130000;
    } else if (tipo_madera === 3) {
        sigma_adm = 100; // Eucalipto/Saligna
        E = 110000;
    }

    const L_cm = luz_m * 100;
    const q_kgcm = q_kgm / 100;
    const M_max = (q_kgcm * Math.pow(L_cm, 2)) / 8;
    const Wx_nec = M_max / sigma_adm;

    let altura_nec_cm = Math.sqrt((Wx_nec * 6) / base_cm);
    altura_nec_cm = Math.ceil(altura_nec_cm);

    const inercia = (base_cm * Math.pow(altura_nec_cm, 3)) / 12;
    const flecha_real = (5 * q_kgcm * Math.pow(L_cm, 4)) / (384 * E * inercid = inercia);
    const flecha_adm = L_cm / 300;

    return {
        elemento: "Viga de Madera",
        base: base_cm,
        altura_recomendada: altura_nec_cm,
        momento_max_kgcm: M_max.toFixed(2),
        estado: flecha_real <= flecha_adm ? "Verificado OK (Flexión y Flecha)" : "Revisar sección por flecha"
    };
}