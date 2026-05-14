// Numéro WhatsApp (format international sans +)
const WHATSAPP_NUMBER = "2250000000000";

const data = [
    {
        id: 1,
        category: "hp",
        title: "HP",
        model: "ProBook 440 G",
        price: "",
        description: "Ordinateur portable professionnel, performant et durable.",
        img: "../images/HP/440 g4/21.jpg",
        previews: [
            { img: "../images/HP/440 g4/21.jpg", label: "Vue 1" },
            { img: "../images/HP/440 g4/17.jpg", label: "Vue 2" }
        ]
    },
    {
        id: 2,
        category: "hp",
        title: "HP",
        model: "ProBook 450",
        price: "",
        description: "Core i3, 256GB SSD, RAM 8GB, écran 15,6\" - Idéal pour le travail.",
        img: "../images/HP/450/2.jpg",
        previews: [
            { img: "../images/HP/450/2.jpg", label: "Vue 1" },
            { img: "../images/HP/450/16.jpg", label: "Vue 2" }
        ]
    },
    {
        id: 3,
        category: "hp",
        title: "HP",
        model: "ProBook 640",
        price: "",
        description: "Performance et mobilité pour les professionnels en déplacement.",
        img: "../images/HP/640/1.jpg",
        previews: [
            { img: "../images/HP/640/1.jpg", label: "Vue 1" },
            { img: "../images/HP/640/15.jpg", label: "Vue 2" }
        ]
    },
    {
        id: 4,
        category: "hp",
        title: "HP",
        model: "EliteBook",
        price: "",
        description: "Gamme premium HP, conception haut de gamme et performances optimales.",
        img: "../images/HP/Elitebook/38.png",
        previews: [
            { img: "../images/HP/Elitebook/38.png", label: "Vue 1" },
            { img: "../images/HP/Elitebook/26.png", label: "Vue 2" },
            { img: "../images/HP/Elitebook/24.png", label: "Vue 3" }
        ]
    },
    {
        id: 5,
        category: "dell",
        title: "Dell",
        model: "",
        price: "",
        description: "Ordinateur Dell fiable pour tous vos besoins informatiques.",
        img: "../images/Dell/42.png",
        previews: [
            { img: "../images/Dell/42.png", label: "Vue 1" }
        ]
    },
    {
        id: 6,
        category: "dell",
        title: "Dell",
        model: "Latitude 5480",
        price: "",
        description: "Ordinateur Dell fiable pour tous vos besoins informatiques.",
        img: "../images/Dell/5480/3.png",
        previews: [
            { img: "../images/Dell/5480/1.png", label: "Vue 1" },
            { img: "../images/Dell/5480/2.png", label: "Vue 2" },
            { img: "../images/Dell/5480/3.png", label: "Vue 3" },
        ]
    },
    {
        id: 7,
        category: "all-in-one",
        title: "PC All in One",
        model: "",
        price: "",
        description: "Écran intégré, design compact et élégant. Gain de place assuré.",
        img: "../images/all_in_one/31.png",
        previews: [
            { img: "../images/all_in_one/31.png", label: "Vue 1" },
            { img: "../images/all_in_one/32.png", label: "Vue 2" },
            { img: "../images/all_in_one/33.png", label: "Vue 3" },
        ]
    },
    {
        id: 8,
        category: "lenovo",
        title: "Lenovo ThinkPad",
        model: "Yoga",
        price: "",
        description: "Ultrabook polyvalent, écran tactile, design élégant et léger.",
        img: "../images/Lenovo/yoga/117.png",
        previews: [
            { img: "../images/Lenovo/yoga/115.png", label: "Vue 1" },
            { img: "../images/Lenovo/yoga/116.png", label: "Vue 2" },
            { img: "../images/Lenovo/yoga/117.png", label: "Vue 3" },
        ]
    },
    {
        id: 9,
        category: "lenovo",
        title: "Lenovo ThinkPad",
        model: "X1 Carbon",
        price: "",
        description: "Ultraportable premium, léger et ultra-performant pour les professionnels.",
        img: "../images/Lenovo/X1_carbonne/113.png",
        previews: [
            { img: "../images/Lenovo/X1_carbonne/112.png", label: "Vue 1" },
            { img: "../images/Lenovo/X1_carbonne/114.png", label: "Vue 2" },
            { img: "../images/Lenovo/X1_carbonne/113.png", label: "Vue 3" },
        ]
    },
    {
        id: 22,
        category: "audio",
        title: "Ampli 30W",
        model: "",
        price: "",
        description: "Amplificateur de son, petit modèle de 30W.",
        img: "../images/5.jpg"
    },
    {
        id: 25,
        category: "audio",
        title: "Ampli Zealot",
        model: "Zealot S127",
        price: "",
        description: "Amplificateur de son compact et puissant, modèle Zealot S127.",
        img: "../images/1111.webp"
    },
    {
        id: 26,
        category: "audio",
        title: "Ampli Zealot",
        model: "Zealot ZE01",
        price: "",
        description: "Amplificateur de son compact et puissant, modèle Zealot ZE01.",
        img: "../images/1112.jpg"
    },
    {
        id: 30,
        category: "reseau",
        title: "TP-Link",
        model: "Extendeur",
        price: "",
        description: "Extendeur de réseau sans fil, étend la portée de votre Wi-Fi.",
        img: "../images/3171_300mbps_.jpg"
    },
    {
        id: 31,
        category: "reseau",
        title: "TP-Link",
        model: "Répéteur",
        price: "",
        description: "Étendez votre réseau sans fil sur une grande distance.",
        img: "../images/repeater1.jpg"
    },
    {
        id: 32,
        category: "reseau",
        title: "Clé USB Bluetooth",
        model: "",
        price: "",
        description: "Ajoutez le Bluetooth à votre PC facilement via USB.",
        img: "../images/blue-clef.jpg"
    },
    {
        id: 33,
        category: "reseau",
        title: "Clé USB Wi-Fi",
        model: "Carte Réseau USB",
        price: "",
        description: "Améliorez votre signal Wi-Fi ou ajoutez une carte réseau via USB.",
        img: "../images/802_1n.webp"
    },
];