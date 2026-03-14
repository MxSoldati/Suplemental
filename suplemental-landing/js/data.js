// Data base for objectives, extracting from the agreed implementation plan

const objectivesData = {
    "masa": {
        title: "Aumentar masa muscular",
        problem: "Muchas veces entrenar pesado no alcanza si los músculos no reciben la proteína ni el excedente calórico necesario para repararse y crecer. Si te estancaste o te cuesta ver cambios reales en la balanza, probablemente tu cuerpo requiera un refuerzo.",
        supplements: [
            { name: "Whey Protein (2lbs / 3kg / Tarro)", description: "Aporte rápido de proteínas post-entreno para reconstruir fibras musculares." },
            { name: "Mutant Mass", description: "Ganador de peso hipercalórico, ideal si te cuesta llegar a las calorías del día." },
            { name: "Creatina", description: "Energía celular que te permite mover más peso y retrasar la fatiga." }
        ],
        combo: {
            name: "Combo Volumen Completo",
            desc: "Whey Protein 2 libras + Creatina 300g",
            explanation: "Este combo asegura que tengas tanto el estímulo de fuerza (creatina) como el material de construcción (proteína) para maximizar la hipertrofia cada día."
        }
    },
    "definicion": {
        title: "Definición / Quema de Grasa",
        problem: "El objetivo es perder porcentaje de grasa sin sacrificar todo el músculo que costó construir. Hacer recortes calóricos fuertes a menudo agota tu físico, frenando los resultados a mediano plazo.",
        supplements: [
            { name: "Whey Protein", description: "Fuente de proteína muy saciante, bajísima en grasas y carbohidratos." },
            { name: "BCAA (120 cápsulas)", description: "Aminoácidos esenciales para proteger al músculo durante entrenamientos en déficit o en ayunas." }
        ],
        combo: {
            name: "Combo Definición Extrema",
            desc: "Whey Protein 2 libras + BCAA 120 cápsulas",
            explanation: "Ideal para bajar grasa manteniéndote lleno, mientras proteges tu tejido muscular de la destrucción causada por la dieta restrictiva."
        }
    },
    "energia": {
        title: "Energía y Rendimiento",
        problem: "¿Llegás sin pilas al gimnasio después de trabajar? Rendir a medias significa resultados a medias. Cuando tu sistema nervioso central está fatigado, la intensidad cae drásticamente.",
        supplements: [
            { name: "V8 Pump (Pre-entreno)", description: "Estimulación, foco mental y mayor bombeo de sangre al músculo (pump)." },
            { name: "Nitrix Bomb (90 comp)", description: "Potenciador pre-entreno extremo sin estimulantes pesados." },
            { name: "Creatina", description: "Recarga de manera inmediata tu sistema energético para esfuerzos cortos y potentes." }
        ],
        combo: {
            name: "Combo Energía Total",
            desc: "V8 Pump + Creatina 300g",
            explanation: "Diseñado para los que quieren aprovechar cada segundo en el gimnasio: foco supremo para iniciar, y fuerza constante para mantener."
        }
    },
    "recuperacion": {
        title: "Recuperación y Descanso",
        problem: "Muchas veces entrenar bien no alcanza si el cuerpo no se recupera. Dormir mal y tener dolores persistentes no te dejarán dar el 100% en tu próxima sesión.",
        supplements: [
            { name: "Magnesio (60 caps / Citrato)", description: "Relaja la tensión muscular y previene calambres nocturnos." },
            { name: "ZMA (90 cápsulas)", description: "Mayor descanso nocturno profundo y mejora del perfil hormonal." },
            { name: "Glutamina", description: "Aminoácido que acelera drásticamente los tiempos de asimilación post-rutina y apoya la salud intestinal." },
            { name: "EEAA (Aminoácidos esenciales)", description: "Asimilación intra o post entreno sin digestión pesada." }
        ],
        combo: {
            name: "Combo PM / Recuperación",
            desc: "Glutamina + ZMA + Magnesio",
            explanation: "Este combo trabaja mientras dormís. Te levantarás listo, como nuevo y libre de fatiga muscular, sumando un profundo bienestar cerebral."
        }
    },
    "salud": {
        title: "Salud y Bienestar",
        problem: "No todo es masa muscular y fuerza bruta. A veces, las articulaciones molestas o una deficiencia vitamínica invisible nos impiden disfrutar nuestro día a día al máximo.",
        supplements: [
            { name: "Colágeno (210g)", description: "Nutrición integral para articulaciones, ligamentos y tendones al límite." },
            { name: "Omega 3 (60 cápsulas)", description: "Potente antiinflamatorio sistémico y gran apoyo del sistema cardiovascular." },
            { name: "Resveratrol & Multivitamínico", description: "Lucha contra radicales libres y provee base sólida de bienestar." }
        ],
        combo: {
            name: "Combo Wellness Total",
            desc: "Omega 3 + Multivitamínico + Colágeno",
            explanation: "Tu póliza de seguro. Cubre todos los aspectos desde la movilidad general y las vitaminas esenciales diarias, hasta la salud de tu corazón y cerebro."
        }
    }
};

const productsData = [
    {
        id: "star-creatina",
        brand: "Star Nutrition",
        name: "Creatina",
        category: "creatina",
        variants: [
            { code: "A001", size: "300g", flavor: "Neutro", price: 27500, originalName: "Creatina 300 gramos" },
            { code: "A002", size: "300g", flavor: "Frutos Rojos", price: 26500, originalName: "Creatina 300 gramos - frutos rojos" },
            { code: "A003", size: "150g", flavor: "Neutro", price: 20000, originalName: "Creatina 150 gramos" },
            { code: "A004", size: "500g", flavor: "Neutro", price: null, originalName: "Creatina 500 gramos" },
            { code: "A005", size: "1kg", flavor: "Neutro", price: 80000, originalName: "Creatina 1 kg" }
        ]
    },
    {
        id: "star-whey",
        brand: "Star Nutrition",
        name: "Whey Protein",
        category: "proteina",
        variants: [
            { code: "A006", size: "2 lbs", flavor: "Vainilla", price: 47000, originalName: "Whey Protein 2 libras - vainilla" },
            { code: "A007", size: "2 lbs", flavor: "Chocolate", price: 47000, originalName: "Whey Protein 2 libras - chocolate" },
            { code: "A008", size: "2 lbs", flavor: "Cookies", price: 47000, originalName: "Whey Protein 2 libras - cookies" },
            { code: "A009", size: "2 lbs", flavor: "Frutilla", price: 47000, originalName: "Whey Protein 2 libras - frutilla" },
            { code: "A010", size: "2 lbs (Tarro)", flavor: "Vainilla", price: 52000, originalName: "Whey Protein 2 libras - tarro - vainilla" },
            { code: "A011", size: "2 lbs (Tarro)", flavor: "Chocolate", price: 52000, originalName: "Whey Protein 2 libras - tarro - chocolate" },
            { code: "A012", size: "3 kg", flavor: "Vainilla", price: 142000, originalName: "Whey Protein 3 kg - vainilla" },
            { code: "A013", size: "3 kg", flavor: "Chocolate", price: 142000, originalName: "Whey Protein 3 kg - chocolate", image: "img-imp/creatina.png" }
        ]
    },
    {
        id: "star-whey-collagen",
        brand: "Star Nutrition",
        name: "Whey Protein Collagen",
        category: "proteina",
        variants: [
            { code: "A014", size: "2 lbs", flavor: "Vainilla", price: 45000, originalName: "Whey Protein Collagen 2 libras - vainilla" },
            { code: "A015", size: "2 lbs", flavor: "Chocolate", price: 45000, originalName: "Whey Protein Collagen 2 libras - chocolate" }
        ]
    },
    {
        id: "star-mutant",
        brand: "Star Nutrition",
        name: "Mutant Mass",
        category: "proteina",
        variants: [
            { code: "A016", size: "1.5 kg", flavor: "Vainilla", price: 38500, originalName: "Mutant Mass 1,5 kg - vainilla" },
            { code: "A017", size: "1.5 kg", flavor: "Chocolate", price: 38500, originalName: "Mutant Mass 1,5 kg - chocolate" }
        ]
    },
    {
        id: "star-magnesio",
        brand: "Star Nutrition",
        name: "Magnesio",
        category: "salud",
        variants: [
            { code: "A018", size: "60 caps", flavor: "Único", price: 15500, originalName: "Magnesio 60 cápsulas" }
        ]
    },
    {
        id: "star-colageno",
        brand: "Star Nutrition",
        name: "Colágeno",
        category: "salud",
        variants: [
            { code: "A019", size: "210g", flavor: "Limón", price: 21500, originalName: "Colágeno 210 gramos - limón" },
            { code: "A020", size: "210g", flavor: "Frutos Rojos", price: 21500, originalName: "Colágeno 210 gramos - frutos rojos" }
        ]
    },
    {
        id: "star-v8",
        brand: "Star Nutrition",
        name: "V8 Pump",
        category: "energia",
        variants: [
            { code: "A021", size: "Único", flavor: "Sandía", price: 35000, originalName: "V8 Pump - sandía" },
            { code: "A022", size: "Único", flavor: "Acai", price: 35000, originalName: "V8 Pump - acai" }
        ]
    },
    {
        id: "star-omega3",
        brand: "Star Nutrition",
        name: "Omega 3",
        category: "salud",
        variants: [
            { code: "A023", size: "60 caps", flavor: "Único", price: 35900, originalName: "Omega 3 60 cápsulas" }
        ]
    },
    {
        id: "star-zma",
        brand: "Star Nutrition",
        name: "ZMA",
        category: "salud",
        variants: [
            { code: "A024", size: "90 caps", flavor: "Único", price: 18300, originalName: "ZMA 90 cápsulas" }
        ]
    },
    {
        id: "star-glutamina",
        brand: "Star Nutrition",
        name: "Glutamina",
        category: "aminoacidos",
        variants: [
            { code: "A025", size: "150g", flavor: "Neutro", price: null, originalName: "Glutamina 150 gramos" },
            { code: "A026", size: "300g", flavor: "Neutro", price: 32300, originalName: "Glutamina 300 gramos" }
        ]
    },
    {
        id: "star-resveratrol",
        brand: "Star Nutrition",
        name: "Resveratrol",
        category: "salud",
        variants: [
            { code: "A027", size: "60 caps", flavor: "Único", price: 23500, originalName: "Resveratrol 60 cápsulas" }
        ]
    },
    {
        id: "star-bcaa",
        brand: "Star Nutrition",
        name: "BCAA",
        category: "aminoacidos",
        variants: [
            { code: "A028", size: "120 caps", flavor: "Único", price: 19200, originalName: "BCAA 120 cápsulas" }
        ]
    },
    {
        id: "star-botella",
        brand: "Star Nutrition",
        name: "Botella",
        category: "accesorios",
        variants: [
            { code: "A029", size: "Premium", flavor: "Único", price: 16000, originalName: "Botella Premium" },
            { code: "A030", size: "Básica", flavor: "Único", price: 5500, originalName: "Botella Básica" }
        ]
    },
    {
        id: "ba-creatina",
        brand: "Body Advance",
        name: "Creatina",
        category: "creatina",
        variants: [
            { code: "B001", size: "150g", flavor: "Neutro", price: 12400, originalName: "Creatina 150 gramos" }
        ]
    },
    {
        id: "ba-whey",
        brand: "Body Advance",
        name: "Whey Protein",
        category: "proteina",
        variants: [
            { code: "B002", size: "910g", flavor: "Vainilla", price: 25000, originalName: "Whey Protein 910 gramos - vainilla" },
            { code: "B003", size: "910g", flavor: "Chocolate", price: 25000, originalName: "Whey Protein 910 gramos - chocolate" },
            { code: "B004", size: "3 kg", flavor: "Único", price: 68500, originalName: "Whey Protein 3 kg" }
        ]
    },
    {
        id: "ba-testo",
        brand: "Body Advance",
        name: "Testo",
        category: "energia",
        variants: [
            { code: "B005", size: "240g", flavor: "Uva", price: 20000, originalName: "Testo 240 gramos - Uva" },
            { code: "B006", size: "240g", flavor: "Neutro", price: null, originalName: "Testo 240 gramos - .." }
        ]
    },
    {
        id: "ba-eeaa",
        brand: "Body Advance",
        name: "EEAA - Aminoácidos esenciales",
        category: "aminoacidos",
        variants: [
            { code: "B007", size: "Único", flavor: "Uva", price: 21000, originalName: "EEAA - Aminoácidos esenciales - Uva" },
            { code: "B008", size: "Único", flavor: "Melón", price: 21000, originalName: "EEAA - Aminoácidos esenciales - Melón" }
        ]
    },
    {
        id: "ba-magnesio",
        brand: "Body Advance",
        name: "Magnesio Citrato",
        category: "salud",
        variants: [
            { code: "B009", size: "175g", flavor: "Único", price: 13000, originalName: "Magnesio Citrato 175 gramos" }
        ]
    },
    {
        id: "ba-nitrix",
        brand: "Body Advance",
        name: "Nitrix Bomb",
        category: "energia",
        variants: [
            { code: "B010", size: "90 comp", flavor: "Único", price: 9500, originalName: "Nitrix Bomb 90 comprimidos" }
        ]
    },
    {
        id: "ba-multi",
        brand: "Body Advance",
        name: "Multivitaminico",
        category: "salud",
        variants: [
            { code: "B011", size: "60 comp", flavor: "Único", price: 9500, originalName: "Multivitaminico 60 comprimidos" }
        ]
    }
];
