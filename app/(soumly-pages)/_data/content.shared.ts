// Soumly shared lightweight module — types, constants and pure helpers.
// IMPORTANT: this module must NEVER import app/products.ts (the 41MB catalog).
// Client Components import from here / from content.client.ts.

export type StoreOffer = {
	store: string;
	price: number;
	oldPrice: number;
	url: string;
	color: string;
	delivery: string;
	availability: string;
	updatedAt: string;
};

export type Product = {
	id: string;
	name: string;
	brand: string;
	category: string;
	categorySlug: string;
	image: string;
	price: number;
	oldPrice: number;
	rating: number;
	reviews: number;
	stores: number;
	discount: number;
	badge?: string;
	tag?: string;
	description: string;
	specs: Array<[string, string]>;
	offers: StoreOffer[];
};

export type Category = {
	slug: string;
	label: string;
	icon: string;
	count: number;
	note: string;
	family: string;
};

export type Family = {
	slug: string;
	label: string;
	icon: string;
};

// Family groups (primini real structure): family -> groups -> categories
export type FamilyGroup = {
	name: string;
	image: string;
	categories: { slug: string; label: string }[];
};

export const FAMILY_GROUPS: Record<string, FamilyGroup[]> = {
	informatique: [
		{
			name: "Ordinateurs",
			image: "https://cdn.primini.tn/138_9b3fa903-5d06-4bee-ab3e-690df57cd4d3.jpg",
			categories: [
				{ slug: "tablettes", label: "Tablettes" },
				{ slug: "ordinateurs-portables", label: "Ordinateurs portables" },
				{ slug: "ordinateurs-de-bureau", label: "Ordinateurs de bureau" },
				{ slug: "serveurs", label: "Serveurs" },
			],
		},
		{
			name: "Composants",
			image: "https://cdn.primini.tn/138_d867783f-d31a-443c-a82c-47b1097089d4.jpg",
			categories: [
				{ slug: "cartes-mere", label: "Cartes mères" },
				{ slug: "processeurs", label: "Processeurs" },
				{ slug: "cartes-graphiques", label: "Cartes graphiques" },
				{ slug: "computer-cases", label: "Boîtiers PC" },
				{ slug: "barrettes-memoires", label: "Barrettes mémoires" },
			],
		},
		{
			name: "Périphériques",
			image: "https://cdn.primini.tn/138_2de4ca24-9b0b-4ada-afb3-ac4408d92bab.jpg",
			categories: [
				{ slug: "moniteurs", label: "Moniteurs" },
				{ slug: "scanners", label: "Scanners" },
				{ slug: "ensemble-clavier-et-souris", label: "Ensemble Clavier et Souris" },
			],
		},
		{
			name: "Stockages",
			image: "https://cdn.primini.tn/138_362f7e6c-c8ee-497d-9842-4dc32cc3f6cc.jpg",
			categories: [
				{ slug: "cartes-memoires", label: "Cartes Mémoires" },
				{ slug: "serveurs-nas", label: "Serveurs de stockage" },
				{ slug: "lecteurs-graveurs-optiques", label: "Lecteurs de disques optiques" },
				{ slug: "cle-usb", label: "Clé USB" },
			],
		},
		{
			name: "Câbles pour ordinateurs et périphériques",
			image: "https://cdn.primini.tn/138_a24ca3ce-709d-4e9c-941a-bd645f4a5ea0.jpg",
			categories: [
				{ slug: "cables-hdmi", label: "Câbles HDMI" },
				{ slug: "changeurs-de-genre-de-cable", label: "Changeurs de genre de câble" },
				{ slug: "cables-video-et-adaptateurs", label: "Câbles vidéo et adaptateurs" },
				{ slug: "cables-audio", label: "Câbles audio" },
				{ slug: "cables-lightning", label: "Câbles Lightning" },
			],
		},
		{
			name: "Réseaux et connectivité",
			image: "https://cdn.primini.tn/138_6c96359d-3253-4bf6-8090-ad802e6ce8ad.jpg",
			categories: [
				{ slug: "routeurs", label: "Routeurs" },
				{ slug: "wireless-access-points", label: "Points d'accès réseaux locaux sans fil" },
				{ slug: "hubs-et-switches", label: "Hubs et Switches" },
				{ slug: "usb-hubs", label: "USB Hubs" },
				{ slug: "cables-de-reseau", label: "Câbles De Réseau" },
			],
		},
	],
	telephonie: [
		{
			name: "Accessoires d'équipements de télécommunications",
			image: "https://cdn.primini.tn/138_87087873-18b8-4f09-b1aa-c8348214c1ee.jpg",
			categories: [{ slug: "accessoires-pour-smartwatch", label: "Accessoires pour smartwatch" }],
		},
		{
			name: "Smartphones",
			image: "https://cdn.primini.tn/138_0194252135525-apple-i-phone-12-64go-noir-1.jpg",
			categories: [
				{ slug: "smartphones", label: "Smartphones" },
				{ slug: "telephone-portables", label: "Téléphones portables" },
				{ slug: "smart-watches", label: "Smartwatches" },
				{ slug: "montres", label: "Montres" },
			],
		},
		{
			name: "Accessoires Téléphones",
			image: "https://cdn.primini.tn/138_b277b0bf-7584-42ed-b125-a0c1eefa150a.jpg",
			categories: [
				{ slug: "etuis-coques", label: "Etuis et Coques" },
				{ slug: "car-holder", label: "Car Holder" },
				{ slug: "docking-stations", label: "Stations d'accueil" },
				{ slug: "films-protecteurs", label: "Films Protecteurs" },
				{ slug: "cables-telephone", label: "Câbles" },
			],
		},
	],
	"image-et-son": [
		{
			name: "Équipements de photo et de vidéo",
			image: "https://cdn.primini.tn/138_2265a34d-bde0-445f-af3c-ec1c8f8f41cb.jpg",
			categories: [{ slug: "photos-et-videos", label: "Photos et vidéos" }],
		},
		{
			name: "Équipements audiovisuels",
			image: "https://cdn.primini.tn/138_0d4cfab7-8005-4b6d-80c0-c50bc47b4b07.jpg",
			categories: [
				{
					slug: "pieces-et-accessoires-d-equipements-audiovisuels",
					label: "Pièces et accessoires d'équipements audiovisuels",
				},
			],
		},
	],
	"photo-camera": [],
	electromenager: [
		{
			name: "Réfrigérateurs et congélateurs",
			image: "https://cdn.primini.tn/138_dbef2a69-fb61-46bb-a750-c2fe6441cc47.jpg",
			categories: [
				{ slug: "refrigerateurs", label: "Réfrigérateurs" },
				{ slug: "congelateurs", label: "Congélateurs" },
				{ slug: "cave-a-vin", label: "Cave à vin" },
			],
		},
		{
			name: "Chauffages",
			image: "https://cdn.primini.tn/138_32fa5d67-8aa2-4b4f-a2cb-8793f4a4f48d.jpg",
			categories: [
				{ slug: "radiateur-bain-huile", label: "Radiateur bain d'huile" },
				{ slug: "radiateurs-electriques", label: "Radiateurs Électriques" },
				{ slug: "chauffage-a-gaz", label: "Chauffage à Gaz" },
			],
		},
	],
	"petit-electromenager": [
		{
			name: "Machines à café",
			image: "https://cdn.primini.tn/138_5be459ae-3694-4247-a92c-6aa63f5043ee.jpg",
			categories: [{ slug: "espresso-machine", label: "Espresso Machine" }],
		},
		{
			name: "Appareils de cuisson",
			image: "https://cdn.primini.tn/138_b4be3d5c-a8e4-4725-935e-9717ececf298.jpg",
			categories: [
				{ slug: "cocotte-minute", label: "Cocotte-minute" },
				{ slug: "cuiseurs-a-riz", label: "Cuiseurs à riz" },
				{ slug: "cuiseur-a-vapeur", label: "Cuiseur à Vapeur" },
				{ slug: "cuiseurs-a-oeufs", label: "Cuiseurs à œufs" },
			],
		},
		{
			name: "Robot Pétrin et Robot de Cuisine Multifonction",
			image: "https://cdn.primini.tn/138_c8c91e75-e730-42f0-b861-9bd410d8defa.jpg",
			categories: [
				{ slug: "robots-multifonction", label: "Robots Multifonction" },
				{ slug: "robot-petrin", label: "Robot Pétrin" },
			],
		},
		{
			name: "Juicers",
			image: "https://cdn.primini.tn/138_9e2019d6-7d97-49d3-bc4b-9b85a99c0d1c.jpg",
			categories: [{ slug: "presse-agrumes", label: "Presse-agrumes" }],
		},
		{
			name: "Grille Pains",
			image: "https://cdn.primini.tn/138_7d0ae546-e7aa-4eb0-a934-541c675ed8ca.jpg",
			categories: [{ slug: "grill-panini", label: "Grill Panini" }],
		},
	],
	"sante-beaute": [
		{
			name: "Toiletries",
			image: "https://cdn.primini.tn/138_76f37a57-bdbe-4811-9f27-85f7570dbc74.jpg",
			categories: [{ slug: "eaux-de-toilette", label: "Eaux de toilette" }],
		},
		{
			name: "Moniteurs de santé",
			image: "https://cdn.primini.tn/138_[object Object]",
			categories: [
				{ slug: "tensiometres-pression-arterielle", label: "Tensiomètres" },
				{ slug: "equipement-medical", label: "Équipement médical" },
			],
		},
		{
			name: "Pharmaceutiques & médicaments",
			image: "",
			categories: [
				{ slug: "pese-personnes", label: "Pèse Personnes" },
				{ slug: "thermometres", label: "Thermomètres" },
				{
					slug: "vitamines-et-complements-alimentaires",
					label: "Vitamines et compléments alimentaires",
				},
			],
		},
		{
			name: "Visage",
			image: "",
			categories: [
				{ slug: "zone-de-la-bouche-et-des-levres", label: "Zone de la bouche et des lèvres" },
				{ slug: "toniques-et-soin-apaisant-visage", label: "Toniques et soin apaisant visage" },
			],
		},
		{
			name: "Cheveux",
			image: "",
			categories: [{ slug: "soin-sans-rincage", label: "Soin sans rinçage" }],
		},
		{
			name: "Corps",
			image: "",
			categories: [
				{ slug: "deodorants-et-antitranspirants", label: "Déodorants et antitranspirants" },
				{ slug: "cellulite-et-vergetures", label: "Cellulite et vergetures" },
			],
		},
		{
			name: "Parfums",
			image: "https://cdn.primini.tn/138_[object Object]",
			categories: [{ slug: "eaux-de-parfum", label: "Eaux de parfum" }],
		},
		{
			name: "Dents",
			image: "",
			categories: [
				{ slug: "blanchiment-des-dents", label: "Blanchiment des dents" },
				{ slug: "brosses-a-dents", label: "Brosses à dents" },
				{ slug: "soins-interdentaires", label: "Soins interdentaires" },
				{ slug: "bains-de-bouche-et-sprays-buccaux", label: "Bains de bouche et sprays buccaux" },
			],
		},
		{
			name: "Hommes",
			image: "https://cdn.primini.tn/138_9c228982-1961-4051-8cd1-46db8b2ea551.jpg",
			categories: [
				{ slug: "rasage", label: "Rasage" },
				{ slug: "corps", label: "Corps" },
				{ slug: "visage-pour-hommes", label: "Visage" },
				{ slug: "cheveux-hommes", label: "Cheveux" },
				{ slug: "soins-pour-barbe", label: "Soins pour barbe" },
			],
		},
	],
	maquillage: [
		{
			name: "Yeux",
			image: "https://cdn.primini.tn/138_06f57a47-60d2-46f3-b2fd-6a230a55e50c.jpg",
			categories: [
				{ slug: "fards-a-paupieres", label: "Fards à paupières" },
				{ slug: "mascaras", label: "Mascaras" },
				{ slug: "crayons-pour-les-yeux", label: "Crayons pour les yeux" },
			],
		},
		{
			name: "Lèvres",
			image: "https://cdn.primini.tn/138_4467431f-3a3c-460c-a4b0-a5e37184a8e6.jpg",
			categories: [
				{ slug: "rouges-a-levres", label: "Rouges à lèvres" },
				{ slug: "crayons-a-levres", label: "Crayons à lèvres" },
				{ slug: "brillants-a-levres", label: "Brillants à lèvres" },
				{ slug: "baumes-a-levres", label: "Baumes à lèvres" },
			],
		},
		{
			name: "Visage",
			image: "https://cdn.primini.tn/138_690c86ed-120b-4c05-9d8b-82599c7a051c.jpg",
			categories: [
				{ slug: "fards", label: "Fards" },
				{ slug: "poudres", label: "Poudres" },
				{ slug: "fond-de-teint", label: "Fond de teint" },
				{ slug: "correcteurs", label: "Correcteurs" },
				{ slug: "fixateur-de-maquillage", label: "Fixateur de maquillage" },
			],
		},
		{
			name: "Sourcils",
			image: "https://cdn.primini.tn/138_7a5dd017-6f67-4db0-8667-5fbb59821c92.jpg",
			categories: [
				{ slug: "crayons-sourcils", label: "Crayons sourcils" },
				{ slug: "mascaras-et-gels-sourcils", label: "Mascaras et gels sourcils" },
			],
		},
		{
			name: "Accessoires maquillage",
			image: "https://cdn.primini.tn/138_[object Object]",
			categories: [{ slug: "pinces-a-epiler", label: "Pinces à épiler" }],
		},
		{
			name: "Ongles",
			image: "https://cdn.primini.tn/138_f34c597d-d17f-465d-bbc2-c40ae6cfd63a.jpg",
			categories: [
				{ slug: "vernis-a-ongles", label: "Vernis à ongles" },
				{ slug: "dissolvants-a-ongles", label: "Dissolvants à ongles" },
			],
		},
		{
			name: "Pinceaux et éponges",
			image: "https://cdn.primini.tn/138_a90a42fe-934e-4013-8644-00d5072fe68c.jpg",
			categories: [
				{ slug: "pinceaux-pour-maquillage-du-visage", label: "Pinceaux pour maquillage du visage" },
				{ slug: "eponges", label: "Eponges" },
			],
		},
		{
			name: "Palettes",
			image: "https://cdn.primini.tn/138_b243c7b1-5172-48a5-8b1f-673ae4dae5aa.jpg",
			categories: [
				{ slug: "palettes-de-fards-a-paupieres", label: "Palettes de fards à paupières" },
			],
		},
	],
};

export const FAMILY_LABELS: Record<string, string> = {
	informatique: "Informatique",
	telephonie: "Téléphonie & Accessoires",
	"image-et-son": "TV | Photo & Son",
	"photo-camera": "Photo & Caméra",
	electromenager: "Gros électroménager",
	"petit-electromenager": "Petit électroménager",
	"sante-beaute": "Beauté & Santé",
	maquillage: "Maquillage",
};

export const FAMILY_DEFINITIONS: Family[] = [
	{ slug: "informatique", label: "Informatique", icon: "Laptop" },
	{ slug: "telephonie", label: "Téléphonie & Accessoires", icon: "Smartphone" },
	{ slug: "image-et-son", label: "TV | Photo & Son", icon: "Headphones" },
	{ slug: "photo-camera", label: "Photo & Caméra", icon: "Camera" },
	{ slug: "electromenager", label: "Gros électroménager", icon: "Refrigerator" },
	{ slug: "petit-electromenager", label: "Petit électroménager", icon: "Microwave" },
	{ slug: "cuisine", label: "Cuisine", icon: "CookingPot" },
	{ slug: "sante-beaute", label: "Beauté & Santé", icon: "Sparkles" },
	{ slug: "maquillage", label: "Maquillage", icon: "Palette" },
	{ slug: "mode", label: "Mode & Accessoires", icon: "Shirt" },
	{ slug: "maison-jardin", label: "Maison & Jardin", icon: "Home" },
	{ slug: "bebe-enfants", label: "Bébé & Enfants", icon: "ToyBrick" },
	{ slug: "sport", label: "Sport & Fitness", icon: "Dumbbell" },
	{ slug: "bureau", label: "Bureau & Papeterie", icon: "FolderOpen" },
	{ slug: "animaux", label: "Animaux", icon: "PawPrint" },
];
export const guides = [
	{
		slug: "choisir-smartphone-2026",
		title: "Comment choisir son smartphone ?",
		excerpt: "Les critères utiles pour comparer l’écran, l’autonomie, la photo et le stockage.",
		category: "Smartphones",
		readTime: "7 min",
		icon: "Smartphone",
		tone: 1,
	},
	{
		slug: "choisir-pc-portable",
		title: "Bien choisir son PC portable",
		excerpt: "Processeur, mémoire, stockage et écran : adaptez la configuration à votre usage.",
		category: "Informatique",
		readTime: "8 min",
		icon: "Laptop",
		tone: 2,
	},
	{
		slug: "comprendre-ecrans",
		title: "Comprendre les écrans PC",
		excerpt: "Taille, définition, fréquence et type de dalle expliqués simplement.",
		category: "Informatique",
		readTime: "6 min",
		icon: "MonitorPlay",
		tone: 3,
	},
	{
		slug: "casque-ou-ecouteurs",
		title: "Casque ou écouteurs : que choisir ?",
		excerpt: "Confort, isolation, microphone et autonomie selon votre quotidien.",
		category: "Audio",
		readTime: "5 min",
		icon: "Headphones",
		tone: 4,
	},
	{
		slug: "climatiseur-economique",
		title: "Choisir un climatiseur économique",
		excerpt: "Puissance, technologie inverter et consommation selon la surface.",
		category: "Maison",
		readTime: "7 min",
		icon: "AirVent",
		tone: 1,
	},
	{
		slug: "comparer-prix-en-ligne",
		title: "Comparer un prix correctement",
		excerpt:
			"Référence exacte, livraison, garantie et disponibilité : les vérifications essentielles.",
		category: "Conseils",
		readTime: "4 min",
		icon: "BadgeCheck",
		tone: 2,
	},
];

export function formatPrice(value: number) {
	const hasCents = Math.abs(value - Math.round(value)) > 0.0001;
	// Regular ASCII space as thousands separator (fr-TN emits a narrow
	// no-break space that renders as glued digits on some devices).
	const formatted = new Intl.NumberFormat("fr-TN", {
		minimumFractionDigits: hasCents ? 2 : 0,
		maximumFractionDigits: 2,
	})
		.format(value)
		.replace(/[\u202f\u00a0]/g, " ");
	return `${formatted} DT`;
}
