/**
 * CALCULADOR DE BASE CUADRADA / ZAPATA (ZAP 14.0 - Versión JavaScript)
 * Cálculo estructural automatizado de cimientos, punzonamiento y armadura.
 */

function calcularZapata(nombre_base, qc, lc, tipo_suelo) {
    // 1. Selección de la tensión admisible del suelo (sigt)
    let sigt = 1.0; // Por defecto
    if (tipo_suelo === 1) {
        sigt = 2.5; // Tosca / Suelo duro tradicional
    } else if (tipo_suelo === 2) {
        sigt = 1.5; // Suelo Normal / Tierra arcillosa
    } else if (tipo_suelo === 3) {
        sigt = 1.0; // Suelo Regular / Arcilla húmeda
    } else if (tipo_suelo === 4) {
        sigt = 0.5; // Suelo Arenoso / Relleno
    }

    // 2. Procesamiento matemático interno
    let Gb = qc * 0.03;                  // Peso propio estimado de la base (3%)
    let Gt = qc * 0.10;                  // Peso de la tierra de tapada (10%)
    let qt = qc + Gb + Gt;               // Carga total actuante sobre el suelo

    let Sa_nec = qt / sigt;              // Superficie de apoyo necesaria (cm2)
    let a1 = Math.sqrt(Sa_nec) + 5.08;   // Lado de la base adoptado con margen
    let sigt1 = qc / Sa_nec;             // Tensión real actuante neta

    let F1 = (a1 - lc) / 2;              // Longitud del voladizo de la platea
    let Mf = sigt1 * (Math.pow(F1, 2)) / 3 * (a1 + (lc / 2)); // Momento flector de vuelco

    let h = 0.411 * Math.sqrt(Mf / (lc + 5));  // Altura útil
    let d = h + 7;                       // Altura total con recubrimiento (7 cm)

    // Verificación de punzonamiento inicial
    let taop = qc / (d * (lc * 4));
    let mc = (a1 - lc) / 2 - d;

    if (taop > 8) {
        if (mc <= 0) {
            a1 = a1 + 15;
            Sa_nec = a1 * a1;
            sigt1 = qc / Sa_nec;
            F1 = (a1 - lc) / 2;
            Mf = sigt1 * (Math.pow(F1, 2)) / 3 * (a1 + (lc / 2));
        }
        
        // Lazo incremental para buscar altura por punzonamiento
        let cloop = 1.5;
        for (let dx = 1; dx <= 50; dx++) {
            d = d + cloop;
            taop = qc / (d * (lc * 4));
            if (taop <= 8) {
                break;
            }
        }
    }

    // Re-verificación final del margen mecánico de las bielas
    mc = (a1 - lc) / 2 - d;
    if (mc < 0) {
        a1 = a1 + (2 * Math.abs(mc));
        Sa_nec = a1 * a1;
        sigt1 = qc / Sa_nec;
        mc = (a1 - lc) / 2 - d;
    }

    // Cálculo del acero necesario
    let h1 = d - 7;
    if (h1 <= 0) h1 = 5;
    let Sa_arm = Mf / (1200 * 0.89 * h1);

    // 3. Cálculo de la parrilla y diámetros comerciales
    let ltramo = (a1 - 7) / 100;
    let cantbar = (a1 - 7) / 15;
    
    let fracbar = cantbar - Math.floor(cantbar);
    if (fracbar > 0.5) {
        cantbar = Math.floor(cantbar) + 1;
    } else {
        cantbar = Math.floor(cantbar);
    }

    if (cantbar < 4) cantbar = 4; // Mínimo constructivo reglamentario
    let sepbar = (a1 - 7) / cantbar;
    let diabar = Sa_arm / cantbar;

    // Tabla indexada de diámetros comerciales (mm)
    let fibar = 8;
    if (diabar > 0.50) fibar = 10;
    if (diabar > 0.79) fibar = 12;
    if (diabar > 1.13) fibar = 14;
    if (diabar > 1.54) fibar = 16;
    if (diabar > 2.01) fibar = 18;
    if (diabar > 2.54) fibar = 20;
    if (diabar > 3.14) fibar = 22;
    if (diabar > 3.80) fibar = 24;
    if (diabar > 4.52) fibar = 25;

    let longbar_total_m = (ltramo * cantbar) * 2;
    let cant_barras_12m = Math.floor(longbar_total_m / 12) + 1;

    // Retorno del objeto con todos los resultados listos para mostrar en la web
    return {
        nombre: nombre_base,
        carga_total: qt.toFixed(2),
        lado_base: a1.toFixed(2),
        tension_actuante: sigt1.toFixed(2),
        tension_admisible: sigt,
        altura_total: d.toFixed(2),
        tension_punzonamiento: taop.toFixed(2),
        margen_bielas: mc.toFixed(2),
        seccion_acero: Sa_arm.toFixed(2),
        armadura: {
            diametro_mm: fibar,
            cantidad_por_lado: cantbar,
            separacion_cm: sepbar.toFixed(1),
            longitud_barra_m: ltramo.toFixed(2)
        },
        computo_acero: {
            metros_lineales_totales: longbar_total_m.toFixed(2),
            barras_comerciales_12m: cant_barras_12m
        }
    };
}