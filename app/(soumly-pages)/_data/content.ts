import {
  products as sourceProducts,
  type Offer as SourceOffer,
  type Product as SourceProduct,
} from "../../products";

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
  "informatique": [
    { name: "Ordinateurs", image: "https://cdn.primini.tn/138_9b3fa903-5d06-4bee-ab3e-690df57cd4d3.jpg", categories: [{ slug: "tablettes", label: "Tablettes" }, { slug: "ordinateurs-portables", label: "Ordinateurs portables" }, { slug: "ordinateurs-de-bureau", label: "Ordinateurs de bureau" }, { slug: "serveurs", label: "Serveurs" }] },
    { name: "Composants", image: "https://cdn.primini.tn/138_d867783f-d31a-443c-a82c-47b1097089d4.jpg", categories: [{ slug: "cartes-mere", label: "Cartes mères" }, { slug: "processeurs", label: "Processeurs" }, { slug: "cartes-graphiques", label: "Cartes graphiques" }, { slug: "computer-cases", label: "Boîtiers PC" }, { slug: "barrettes-memoires", label: "Barrettes mémoires" }] },
    { name: "Périphériques", image: "https://cdn.primini.tn/138_2de4ca24-9b0b-4ada-afb3-ac4408d92bab.jpg", categories: [{ slug: "moniteurs", label: "Moniteurs" }, { slug: "scanners", label: "Scanners" }, { slug: "ensemble-clavier-et-souris", label: "Ensemble Clavier et Souris" }] },
    { name: "Stockages", image: "https://cdn.primini.tn/138_362f7e6c-c8ee-497d-9842-4dc32cc3f6cc.jpg", categories: [{ slug: "cartes-memoires", label: "Cartes Mémoires" }, { slug: "serveurs-nas", label: "Serveurs de stockage" }, { slug: "lecteurs-graveurs-optiques", label: "Lecteurs de disques optiques" }, { slug: "cle-usb", label: "Clé USB" }] },
    { name: "Câbles pour ordinateurs et périphériques", image: "https://cdn.primini.tn/138_a24ca3ce-709d-4e9c-941a-bd645f4a5ea0.jpg", categories: [{ slug: "cables-hdmi", label: "Câbles HDMI" }, { slug: "changeurs-de-genre-de-cable", label: "Changeurs de genre de câble" }, { slug: "cables-video-et-adaptateurs", label: "Câbles vidéo et adaptateurs" }, { slug: "cables-audio", label: "Câbles audio" }, { slug: "cables-lightning", label: "Câbles Lightning" }] },
    { name: "Réseaux et connectivité", image: "https://cdn.primini.tn/138_6c96359d-3253-4bf6-8090-ad802e6ce8ad.jpg", categories: [{ slug: "routeurs", label: "Routeurs" }, { slug: "wireless-access-points", label: "Points d'accès réseaux locaux sans fil" }, { slug: "hubs-et-switches", label: "Hubs et Switches" }, { slug: "usb-hubs", label: "USB Hubs" }, { slug: "cables-de-reseau", label: "Câbles De Réseau" }] },
  ],
  "telephonie": [
    { name: "Accessoires d'équipements de télécommunications", image: "https://cdn.primini.tn/138_87087873-18b8-4f09-b1aa-c8348214c1ee.jpg", categories: [{ slug: "accessoires-pour-smartwatch", label: "Accessoires pour smartwatch" }] },
    { name: "Accessoires Téléphones", image: "https://cdn.primini.tn/138_b277b0bf-7584-42ed-b125-a0c1eefa150a.jpg", categories: [{ slug: "etuis-coques", label: "Etuis et Coques" }, { slug: "car-holder", label: "Car Holder" }, { slug: "docking-stations", label: "Stations d'accueil" }, { slug: "films-protecteurs", label: "Films Protecteurs" }, { slug: "cables-telephone", label: "Câbles" }] },
  ],
  "image-et-son": [
    { name: "Équipements de photo et de vidéo", image: "https://cdn.primini.tn/138_2265a34d-bde0-445f-af3c-ec1c8f8f41cb.jpg", categories: [{ slug: "photos-et-videos", label: "Photos et vidéos" }] },
    { name: "Équipements audiovisuels", image: "https://cdn.primini.tn/138_0d4cfab7-8005-4b6d-80c0-c50bc47b4b07.jpg", categories: [{ slug: "pieces-et-accessoires-d-equipements-audiovisuels", label: "Pièces et accessoires d'équipements audiovisuels" }] },
  ],
  "photo-camera": [
  ],
  "electromenager": [
    { name: "Réfrigérateurs et congélateurs", image: "https://cdn.primini.tn/138_dbef2a69-fb61-46bb-a750-c2fe6441cc47.jpg", categories: [{ slug: "refrigerateurs", label: "Réfrigérateurs" }, { slug: "congelateurs", label: "Congélateurs" }, { slug: "cave-a-vin", label: "Cave à vin" }] },
    { name: "Chauffages", image: "https://cdn.primini.tn/138_32fa5d67-8aa2-4b4f-a2cb-8793f4a4f48d.jpg", categories: [{ slug: "radiateur-bain-huile", label: "Radiateur bain d'huile" }, { slug: "radiateurs-electriques", label: "Radiateurs Électriques" }, { slug: "chauffage-a-gaz", label: "Chauffage à Gaz" }] },
  ],
  "petit-electromenager": [
    { name: "Machines à café", image: "https://cdn.primini.tn/138_5be459ae-3694-4247-a92c-6aa63f5043ee.jpg", categories: [{ slug: "espresso-machine", label: "Espresso Machine" }] },
    { name: "Appareils de cuisson", image: "https://cdn.primini.tn/138_b4be3d5c-a8e4-4725-935e-9717ececf298.jpg", categories: [{ slug: "cocotte-minute", label: "Cocotte-minute" }, { slug: "cuiseurs-a-riz", label: "Cuiseurs à riz" }, { slug: "cuiseur-a-vapeur", label: "Cuiseur à Vapeur" }, { slug: "cuiseurs-a-oeufs", label: "Cuiseurs à œufs" }] },
    { name: "Robot Pétrin et Robot de Cuisine Multifonction", image: "https://cdn.primini.tn/138_c8c91e75-e730-42f0-b861-9bd410d8defa.jpg", categories: [{ slug: "robots-multifonction", label: "Robots Multifonction" }, { slug: "robot-petrin", label: "Robot Pétrin" }] },
    { name: "Juicers", image: "https://cdn.primini.tn/138_9e2019d6-7d97-49d3-bc4b-9b85a99c0d1c.jpg", categories: [{ slug: "presse-agrumes", label: "Presse-agrumes" }] },
    { name: "Grille Pains", image: "https://cdn.primini.tn/138_7d0ae546-e7aa-4eb0-a934-541c675ed8ca.jpg", categories: [{ slug: "grill-panini", label: "Grill Panini" }] },
  ],
  "sante-beaute": [
    { name: "Toiletries", image: "https://cdn.primini.tn/138_76f37a57-bdbe-4811-9f27-85f7570dbc74.jpg", categories: [{ slug: "eaux-de-toilette", label: "Eaux de toilette" }] },
    { name: "Moniteurs de santé", image: "https://cdn.primini.tn/138_[object Object]", categories: [{ slug: "tensiometres-pression-arterielle", label: "Tensiomètres" }, { slug: "equipement-medical", label: "Équipement médical" }] },
    { name: "Pharmaceutiques & médicaments", image: "", categories: [{ slug: "pese-personnes", label: "Pèse Personnes" }, { slug: "thermometres", label: "Thermomètres" }, { slug: "vitamines-et-complements-alimentaires", label: "Vitamines et compléments alimentaires" }] },
    { name: "Visage", image: "", categories: [{ slug: "zone-de-la-bouche-et-des-levres", label: "Zone de la bouche et des lèvres" }, { slug: "toniques-et-soin-apaisant-visage", label: "Toniques et soin apaisant visage" }] },
    { name: "Cheveux", image: "", categories: [{ slug: "soin-sans-rincage", label: "Soin sans rinçage" }] },
    { name: "Corps", image: "", categories: [{ slug: "deodorants-et-antitranspirants", label: "Déodorants et antitranspirants" }, { slug: "cellulite-et-vergetures", label: "Cellulite et vergetures" }] },
    { name: "Parfums", image: "https://cdn.primini.tn/138_[object Object]", categories: [{ slug: "eaux-de-parfum", label: "Eaux de parfum" }] },
    { name: "Dents", image: "", categories: [{ slug: "blanchiment-des-dents", label: "Blanchiment des dents" }, { slug: "brosses-a-dents", label: "Brosses à dents" }, { slug: "soins-interdentaires", label: "Soins interdentaires" }, { slug: "bains-de-bouche-et-sprays-buccaux", label: "Bains de bouche et sprays buccaux" }] },
    { name: "Hommes", image: "https://cdn.primini.tn/138_9c228982-1961-4051-8cd1-46db8b2ea551.jpg", categories: [{ slug: "rasage", label: "Rasage" }, { slug: "corps", label: "Corps" }, { slug: "visage-pour-hommes", label: "Visage" }, { slug: "cheveux-hommes", label: "Cheveux" }, { slug: "soins-pour-barbe", label: "Soins pour barbe" }] },
  ],
  "maquillage": [
    { name: "Yeux", image: "https://cdn.primini.tn/138_06f57a47-60d2-46f3-b2fd-6a230a55e50c.jpg", categories: [{ slug: "fards-a-paupieres", label: "Fards à paupières" }, { slug: "mascaras", label: "Mascaras" }, { slug: "crayons-pour-les-yeux", label: "Crayons pour les yeux" }] },
    { name: "Lèvres", image: "https://cdn.primini.tn/138_4467431f-3a3c-460c-a4b0-a5e37184a8e6.jpg", categories: [{ slug: "rouges-a-levres", label: "Rouges à lèvres" }, { slug: "crayons-a-levres", label: "Crayons à lèvres" }, { slug: "brillants-a-levres", label: "Brillants à lèvres" }, { slug: "baumes-a-levres", label: "Baumes à lèvres" }] },
    { name: "Visage", image: "https://cdn.primini.tn/138_690c86ed-120b-4c05-9d8b-82599c7a051c.jpg", categories: [{ slug: "fards", label: "Fards" }, { slug: "poudres", label: "Poudres" }, { slug: "fond-de-teint", label: "Fond de teint" }, { slug: "correcteurs", label: "Correcteurs" }, { slug: "fixateur-de-maquillage", label: "Fixateur de maquillage" }] },
    { name: "Sourcils", image: "https://cdn.primini.tn/138_7a5dd017-6f67-4db0-8667-5fbb59821c92.jpg", categories: [{ slug: "crayons-sourcils", label: "Crayons sourcils" }, { slug: "mascaras-et-gels-sourcils", label: "Mascaras et gels sourcils" }] },
    { name: "Accessoires maquillage", image: "https://cdn.primini.tn/138_[object Object]", categories: [{ slug: "pinces-a-epiler", label: "Pinces à épiler" }] },
    { name: "Ongles", image: "https://cdn.primini.tn/138_f34c597d-d17f-465d-bbc2-c40ae6cfd63a.jpg", categories: [{ slug: "vernis-a-ongles", label: "Vernis à ongles" }, { slug: "dissolvants-a-ongles", label: "Dissolvants à ongles" }] },
    { name: "Pinceaux et éponges", image: "https://cdn.primini.tn/138_a90a42fe-934e-4013-8644-00d5072fe68c.jpg", categories: [{ slug: "pinceaux-pour-maquillage-du-visage", label: "Pinceaux pour maquillage du visage" }, { slug: "eponges", label: "Eponges" }] },
    { name: "Palettes", image: "https://cdn.primini.tn/138_b243c7b1-5172-48a5-8b1f-673ae4dae5aa.jpg", categories: [{ slug: "palettes-de-fards-a-paupieres", label: "Palettes de fards à paupières" }] },
  ],
};

export const FAMILY_LABELS: Record<string, string> = {
  "informatique": "Informatique",
  "telephonie": "Téléphonie & Accessoires",
  "image-et-son": "TV | Photo & Son",
  "photo-camera": "Photo & Caméra",
  "electromenager": "Gros électroménager",
  "petit-electromenager": "Petit électroménager",
  "sante-beaute": "Beauté & Santé",
  "maquillage": "Maquillage",
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

// Category definition used for both curated and generated categories.
type AnyCategoryDefinition = {
  raw?: readonly string[];
  slug: string;
  label: string;
  icon: string;
  count?: number;
  note?: string;
  family?: string;
};

const CATEGORY_ICONS: Record<string, string> = {
  "acces-et-controles": "Lock",
  "accessoires-de-bain-pour-bebes": "ToyBrick",
  "accessoires-de-camera-camescope": "Camera",
  "accessoires-de-console-de-jeux": "Gamepad2",
  "accessoires-de-decoration-d-interieur": "Image",
  "accessoires-de-musculation-des-mains": "Dumbbell",
  "accessoires-de-nettoyeur-a-pression": "Wind",
  "accessoires-de-systeme-de-paiement-en-point-de-vente": "Calculator",
  "accessoires-et-materiel-menagers": "Sparkles",
  "accessoires-imprimantes-et-scanners": "Printer",
  "accessoires-parfums": "SprayCan",
  "accessoires-pour-cheveux": "Scissors",
  "accessoires-pour-corps": "Droplet",
  "accessoires-pour-dents": "Smile",
  "accessoires-pour-piscine": "Waves",
  "accessoires-pour-smartwatch": "Watch",
  "accessoires-pour-visage": "Sparkles",
  "accessoires-telephones": "Smartphone",
  "agrafes": "FolderOpen",
  "agrafeuses": "FolderOpen",
  "alimentation-du-sportif": "Pill",
  "alimentation-pc": "Cpu",
  "alimentations-d-energie-non-interruptibles": "Zap",
  "ampoules-led": "Lamp",
  "appareil-a-raclette": "CookingPot",
  "appareils-a-emballage-sous-vide": "Utensils",
  "appareils-anti-moustiques-insectes": "Stethoscope",
  "appareils-de-cuisson": "Utensils",
  "appareils-electriques": "Wind",
  "appareils-electroniques": "Cpu",
  "appareils-photo-numeriques": "Camera",
  "apres-shampoings": "Scissors",
  "apres-shampoings-baumes": "Scissors",
  "arrosages-et-irrigations-de-jardin": "Sprout",
  "arroseurs": "Waves",
  "aspirateurs": "Wind",
  "aspirateurs-balai": "Wind",
  "aspirateurs-de-table": "Wind",
  "aspirateurs-nasaux-pour-bebe": "Wind",
  "assiettes": "UtensilsCrossed",
  "autocuiseurs-pour-cuisiniere": "Microwave",
  "bagages": "Backpack",
  "baignoires-pour-bebes": "ToyBrick",
  "bain-de-bebe": "ToyBrick",
  "bain-moussant-pour-douche": "ShowerHead",
  "bains-de-bebe": "ToyBrick",
  "bains-de-bouche-et-sprays-buccaux": "Smile",
  "balances-de-cuisine": "Scale",
  "ballons-de-football": "Volleyball",
  "bancs-de-musculation": "Dumbbell",
  "barbecue-bb-qs": "Flame",
  "barres-d-halteres": "Dumbbell",
  "barrettes-memoires": "MemoryStick",
  "batons-supports-pour-selfies": "Layers",
  "batterie-pc-portable": "Battery",
  "batteries": "Battery",
  "batteurs": "Blend",
  "baumes-a-levres": "Paintbrush",
  "bavoirs-pour-bebes": "ToyBrick",
  "bebe-enfants": "ToyBrick",
  "biberons": "Baby",
  "biberons-et-vaisselle-pour-bebes": "Baby",
  "blanchiment-des-dents": "Smile",
  "blenders": "Blend",
  "blocs-notes": "FolderOpen",
  "boites-a-outils": "Wrench",
  "boites-hermetiques-alimentaires": "UtensilsCrossed",
  "boitiers-d-equipement-reseau": "Network",
  "boitiers-de-disques-de-stockage": "HardDrive",
  "bouilloires": "CupSoda",
  "bracelets": "Watch",
  "brillants-a-levres": "Paintbrush",
  "brosse-soufflante-chauffante": "Wind",
  "brosses-a-dents": "Smile",
  "brosses-a-dents-electrique": "Smile",
  "brosses-a-dents-electriques": "Smile",
  "brosses-a-dents-nettoyage": "Smile",
  "brosses-et-supports-pour-toilettes": "ToyBrick",
  "cables-antivol": "Network",
  "cables-audio": "Network",
  "cables-de-reseau": "Network",
  "cables-de-telephones-portables": "Network",
  "cables-hdmi": "Network",
  "cables-lightning": "Network",
  "cables-pour-ordinateurs-et-peripheriques": "Laptop",
  "cables-telephone": "Network",
  "cables-video-et-adaptateurs": "Network",
  "caisses-enregistreuses": "Calculator",
  "calculatrices": "Calculator",
  "camera-lenses": "Camera",
  "camera-tripods": "Camera",
  "cameras-de-surveillance": "Camera",
  "camescopes": "Camera",
  "capsules-et-dosettes-de-cafe": "Coffee",
  "car-holder": "Smartphone",
  "cartes-graphiques": "Cpu",
  "cartes-memoires": "HardDrive",
  "cartes-mere": "Cpu",
  "cartouches-de-toner": "Printer",
  "casques": "Headphones",
  "casseroles": "UtensilsCrossed",
  "casseroles-a-sauce": "UtensilsCrossed",
  "cave-a-vin": "Refrigerator",
  "cellulite-et-vergetures": "Droplet",
  "centrifugeuses-et-presse-agrumes": "Blend",
  "chaises-de-camping": "Armchair",
  "chaises-hautes": "ToyBrick",
  "chaises-restaurant": "Armchair",
  "changeurs-de-genre-de-cable": "Network",
  "chapeaux": "Shirt",
  "chargeurs-de-telephones-portables": "Battery",
  "chauffage-a-gaz": "AirVent",
  "chauffage-refroidissement-et-qualite-de-l-air": "AirVent",
  "chauffages": "AirVent",
  "chauffe-bain": "CupSoda",
  "chauffe-biberons": "CupSoda",
  "chaussettes": "Shirt",
  "chaussures": "Footprints",
  "chaussures-d-athletisme": "Footprints",
  "chaussures-de-sport-a-la-mode": "Footprints",
  "chemises-et-hauts": "Shirt",
  "cheveux": "Scissors",
  "cheveux-hommes": "Scissors",
  "cheveux-pour-enfant": "Scissors",
  "ciseaux-a-bouts-ronds": "Scissors",
  "claquettes-et-tongs": "Footprints",
  "claviers": "Keyboard",
  "cle-usb": "HardDrive",
  "cles-a-fourche": "Wrench",
  "climatiseurs": "AirVent",
  "cocotte-minute": "Utensils",
  "coffres-forts": "Lock",
  "coffrets-cadeaux-de-parfum": "SprayCan",
  "coffrets-de-sciences-pour-enfant": "ToyBrick",
  "coffrets-pour-femme": "ToyBrick",
  "coffrets-pour-les-bebes": "ToyBrick",
  "colliers": "Watch",
  "colliers-harnais-et-laisses-pour-chiens-et-chats": "Watch",
  "colorations-cheveux": "Scissors",
  "compas-a-secteur": "Compass",
  "composants": "Cpu",
  "computer-backpack": "Laptop",
  "computer-cases": "Laptop",
  "computer-chargers": "Laptop",
  "congelateurs": "Refrigerator",
  "consoles-de-jeux": "Gamepad2",
  "consommables": "Printer",
  "cookware": "UtensilsCrossed",
  "corps": "Droplet",
  "correcteurs": "Palette",
  "couches-jetables": "ToyBrick",
  "couches-jetables-pour-bebe": "ToyBrick",
  "couleurs-de-cheveux": "Scissors",
  "couteaux-de-cuisine": "UtensilsCrossed",
  "couteaux-de-poche": "UtensilsCrossed",
  "couteaux-electriques": "UtensilsCrossed",
  "couverts-et-coutellerie": "UtensilsCrossed",
  "couvertures-de-lit": "Armchair",
  "crayons-a-levres": "Paintbrush",
  "crayons-de-couleur": "PenTool",
  "crayons-pour-les-yeux": "Palette",
  "crayons-sourcils": "Palette",
  "creme-mains": "Droplet",
  "cremes-corporelles-hydratants": "Droplet",
  "cremes-corporelles-soin": "Droplet",
  "cremes-et-gels-pour-les-yeux": "Sparkles",
  "cremes-et-hydratants-pour-le-corps": "Droplet",
  "cremes-et-hydratants-pour-le-visage": "Sparkles",
  "cremes-hydratantes-pour-le-visage": "Sparkles",
  "cremes-pour-le-visage": "Sparkles",
  "cremes-pour-les-yeux": "Sparkles",
  "cremes-solaires": "Sun",
  "cremes-teintees": "Sparkles",
  "crepieres": "CookingPot",
  "cuiseur-a-vapeur": "Microwave",
  "cuiseurs-a-oeufs": "Utensils",
  "cuiseurs-a-riz": "Utensils",
  "cuisinieres": "Microwave",
  "decors-muraux": "Image",
  "defroisseurs": "Flame",
  "demaquillant-et-nettoyant": "Sparkles",
  "demaquillants-visage": "Sparkles",
  "demaquillants-yeux": "Sparkles",
  "dentifrices": "Smile",
  "dentifrices-dents": "Smile",
  "deodorants-et-anti-transpirants": "ShowerHead",
  "deodorants-et-antitranspirants": "ShowerHead",
  "destructeur-de-papier": "FolderOpen",
  "detartrants": "Sparkles",
  "digital-tv-boxes": "Tv",
  "disques-durs": "HardDrive",
  "disques-durs-externes": "HardDrive",
  "disques-ssd": "HardDrive",
  "distributeurs-de-savon": "Sparkles",
  "docking-stations": "Layers",
  "eaux-de-parfum": "SprayCan",
  "eaux-de-parfum-pour-femme": "SprayCan",
  "eaux-de-parfum-pour-homme": "SprayCan",
  "eaux-de-toilette": "SprayCan",
  "eaux-de-toilette-femme": "SprayCan",
  "eaux-de-toilette-homme": "SprayCan",
  "eaux-micellaires": "Droplets",
  "eclairage-exterieur": "Lamp",
  "eclairages-de-plafond": "Lamp",
  "ecouteurs": "Headphones",
  "enceintes-portables": "Headphones",
  "ensemble-clavier-et-souris": "Mouse",
  "ensembles-de-meubles-de-jardin": "Armchair",
  "ensembles-de-meubles-pour-enfants": "Armchair",
  "epilateurs": "Sparkle",
  "eponges": "Sparkles",
  "equipement-medical": "Stethoscope",
  "equipement-pour-sports-de-raquette": "Volleyball",
  "equipement-pour-sports-nautiques": "Volleyball",
  "equipements-de-fitness": "Dumbbell",
  "equipements-de-scene-et-de-studio": "Headphones",
  "equipements-et-jeux-de-recreation-et-sportifs": "Gamepad2",
  "equipements-pour-terrain-de-jeux": "Gamepad2",
  "erotisme-corps": "ShowerHead",
  "espresso-machine": "Coffee",
  "etuis-coques": "Shield",
  "etuis-et-housses-d-appareils-photo": "Backpack",
  "eviers": "Wrench",
  "exfoliants-pour-le-visage": "Sparkles",
  "faits-tout": "CookingPot",
  "fards": "Palette",
  "fards-a-paupieres": "Palette",
  "fauteuils": "Armchair",
  "fauteuils-pour-enfants": "Armchair",
  "fer-a-repasser": "Flame",
  "fers-a-boucler": "Wind",
  "figurines-pour-enfants": "ToyBrick",
  "films-protecteurs": "Shield",
  "fixateur-de-maquillage": "Palette",
  "flotteurs-de-plage-et-de-piscine": "Waves",
  "fond-de-teint": "Palette",
  "fontaine-eau-fraiche": "CupSoda",
  "forets": "Wrench",
  "fouets": "UtensilsCrossed",
  "fournitures-de-bureau": "FolderOpen",
  "fours": "Microwave",
  "friteuses": "UtensilsCrossed",
  "game-controllers": "Gamepad2",
  "gamelles": "PawPrint",
  "gants-de-sport": "Dumbbell",
  "gaufriers": "CookingPot",
  "gels-de-toilette-intime": "ShowerHead",
  "gels-dents-gencives": "Smile",
  "gels-douche-bain": "ShowerHead",
  "gels-douches": "ShowerHead",
  "gels-lubrifiants-erotisme": "ShowerHead",
  "gels-nettoyants-visage": "Sparkles",
  "glacieres": "UtensilsCrossed",
  "gommages-corporels": "Droplet",
  "gommages-pour-le-corps": "Droplet",
  "gommages-pour-le-visage": "Sparkles",
  "gourdes": "UtensilsCrossed",
  "grill-panini": "CookingPot",
  "grille-pains": "Utensils",
  "groupes-electrogenes": "Zap",
  "hachoirs": "Blend",
  "halteres": "Dumbbell",
  "haut-parleurs": "Headphones",
  "haut-parleurs-conférence": "Headphones",
  "hochets": "ToyBrick",
  "home-cinema-systems": "Tv",
  "hottes-aspirantes": "Wind",
  "hubs-et-switches": "Network",
  "huiles-cheveux": "Scissors",
  "huiles-pour-le-corps": "Droplet",
  "image-et-son": "Disc3",
  "imprimantes": "Printer",
  "imprimantes-jets-d-encres": "Printer",
  "imprimantes-laser": "Printer",
  "imprimantes-pour-etiquettes": "Printer",
  "informatique": "Cpu",
  "instruments-de-mesure-de-la-distance": "Ruler",
  "jeux": "Gamepad2",
  "jeux-d-imitation": "Gamepad2",
  "jeux-de-societe": "Gamepad2",
  "jeux-videos": "Gamepad2",
  "jouets": "ToyBrick",
  "jouets-a-chevaucher": "ToyBrick",
  "jouets-d-apprentissage": "ToyBrick",
  "jouets-de-construction": "ToyBrick",
  "jouets-de-piscine": "ToyBrick",
  "jouets-electroniques-pour-enfants": "ToyBrick",
  "jouets-et-jeux-d-eveil-d-adresse": "Gamepad2",
  "jouets-interactifs": "ToyBrick",
  "jouets-musicaux": "ToyBrick",
  "jouets-pour-bebes": "ToyBrick",
  "jouets-sets-de-jeux": "Gamepad2",
  "kits-de-loisirs-creatifs-et-artistiques-pour-enfants": "ToyBrick",
  "kits-de-natation": "Volleyball",
  "laits-corporels": "Droplet",
  "laits-pour-le-corps": "Droplet",
  "laminateurs-et-fournitures": "FolderOpen",
  "lampes-de-camping": "Lamp",
  "lampes-de-table": "Lamp",
  "laques-cheveux": "Scissors",
  "lave-vaisselles": "WashingMachine",
  "lecteurs-graveurs-optiques": "Disc3",
  "lessives": "Sparkles",
  "lisseurs": "Wind",
  "litieres-et-effractions-pour-chiens-et-chats": "PawPrint",
  "livres": "BookOpen",
  "livres-et-pages-a-colorier": "BookOpen",
  "logiciels": "Code2",
  "logiciels-systemes-dexploitation": "Code2",
  "lots-de-casseroles": "UtensilsCrossed",
  "lumieres-de-nuit-pour-bebe": "ToyBrick",
  "lunettes-de-natation": "Footprints",
  "lunettes-de-soleil": "Glasses",
  "machine-a-laver": "WashingMachine",
  "machine-a-pain": "Utensils",
  "machines-a-cafe": "Coffee",
  "machines-a-coudre": "Scissors",
  "machines-electriques-a-souder": "Wrench",
  "machines-et-fours-a-pizzas": "Microwave",
  "marmites": "UtensilsCrossed",
  "marqueurs": "PenTool",
  "marteaux-rotatifs": "Wrench",
  "mascaras": "Palette",
  "mascaras-et-gels-sourcils": "Palette",
  "masques-cheveux": "Scissors",
  "masques-pour-cheveux": "Scissors",
  "masques-pour-le-visage": "Sparkles",
  "masques-visage": "Sparkles",
  "matelas-gonflable": "Armchair",
  "materiel-de-coiffure": "Scissors",
  "materiel-pour-imprimante": "Printer",
  "meubles-de-salon": "Armchair",
  "meubles-pour-la-maison": "Armchair",
  "meuleuses-d-angle": "Wrench",
  "micro-ondes": "Microwave",
  "microphones": "Headphones",
  "mixeurs": "Blend",
  "mobilier-de-bureau": "Table",
  "moniteurs": "MonitorPlay",
  "moniteurs-video-pour-bebe": "MonitorPlay",
  "montres": "Watch",
  "moules-a-gateaux": "UtensilsCrossed",
  "moules-a-gaufres": "UtensilsCrossed",
  "moulins-a-cafe": "Coffee",
  "mousses-nettoyantes-pour-le-visage": "Sparkles",
  "nettoyant": "Droplets",
  "nettoyeur-haute-pression": "Wind",
  "nourriture-boissons-tabac": "ShoppingBag",
  "nourriture-pour-chiens-et-chats": "PawPrint",
  "onduleurs": "Zap",
  "ordinateurs": "Laptop",
  "ordinateurs-de-bureau": "Laptop",
  "ordinateurs-portables": "Laptop",
  "organiseurs-de-bureau": "FolderOpen",
  "outils-de-maquillage": "Palette",
  "outils-de-soins-personnels": "Sparkles",
  "outils-sans-fil": "Wrench",
  "palettes-de-fards-a-paupieres": "Palette",
  "pantalons": "Shirt",
  "papiers-imprimante": "FolderOpen",
  "parasols-de-terrasse": "Image",
  "parcs": "ToyBrick",
  "parfums-beaute": "SprayCan",
  "parfums-et-maquillage-pour-enfants": "SprayCan",
  "parfums-pour-enfants": "SprayCan",
  "parfums-pour-femme": "SprayCan",
  "parfums-unisexes": "SprayCan",
  "peignes-et-brosses-cheveux": "Scissors",
  "peintures-pour-loisir": "Paintbrush",
  "pellicules-polaroid": "Camera",
  "peluches": "ToyBrick",
  "perceuses": "Wrench",
  "pese-personnes": "Scale",
  "petites-pieces-et-boites-a-outils": "Wrench",
  "pieces-et-accessoires-d-equipements-audiovisuels": "Disc3",
  "piles-domestiques": "Battery",
  "pinceaux-pour-maquillage-du-visage": "Palette",
  "pinces": "UtensilsCrossed",
  "piscines-de-jeux-pour-enfants": "Gamepad2",
  "piscines-hors-sol": "Waves",
  "pistolets-a-peinture": "Wrench",
  "pistolets-eau-buses": "Waves",
  "placards-et-armoires-de-chambre-a-coucher": "Armchair",
  "plaques-de-cuisson": "CookingPot",
  "platines": "Disc3",
  "plats": "UtensilsCrossed",
  "poeles": "CookingPot",
  "pompes-a-eaux": "Droplet",
  "ponceuses-portatives": "Wrench",
  "portes-savon": "Sparkles",
  "pots-rangement": "Box",
  "poubelles": "Sparkles",
  "poudres": "Palette",
  "poupees": "ToyBrick",
  "poussettes-pour-bebe": "ToyBrick",
  "powerbank": "Battery",
  "preservatifs": "Heart",
  "presse-agrumes": "Blend",
  "processeurs": "Cpu",
  "produits-apres-rasage": "Scissors",
  "produits-d-archivage": "FolderOpen",
  "produits-de-coiffure": "Scissors",
  "produits-de-soins-de-cheveux-de-bebe": "Scissors",
  "produits-de-soins-de-la-peau": "HeartPulse",
  "produits-de-soins-des-yeux": "Eye",
  "produits-de-soins-pour-la-peau": "HeartPulse",
  "produits-de-traitement-oculaire": "Eye",
  "produits-de-traitements-dermatologiques-corporels": "Droplet",
  "produits-nettoyants-et-lavants-visage": "Sparkles",
  "produits-rasage": "Scissors",
  "produits-solaires-pour-enfants": "Sun",
  "projecteurs": "Tv",
  "protection-contre-le-rayonnement-solaire": "Sun",
  "protection-contre-le-rayonnement-solaire-pour-le-corps": "Sun",
  "protection-solaire-cheveux": "Sun",
  "protections-d-ecran-de-telephone-portable": "Shield",
  "protections-pour-circuit": "Cpu",
  "purificateurs-d-air-liquides": "Droplets",
  "puzzles": "ToyBrick",
  "raccords-des-tuyaux-d-eau": "Wrench",
  "radiateur-bain-huile": "AirVent",
  "radiateurs-electriques": "AirVent",
  "radios-portables": "Headphones",
  "rasage": "Scissors",
  "rasoirs-et-tondeuses": "Scissors",
  "recepteurs-tv": "Tv",
  "recharges-d-encre-pour-imprimante": "Printer",
  "recipients-alimentaires-pour-enfants": "UtensilsCrossed",
  "refrigerateurs": "Refrigerator",
  "refroidissement-cpu": "Cpu",
  "refroidissement-d-ordinateur": "Cpu",
  "refroidissement-laptop": "Cpu",
  "relaxation": "Moon",
  "relieuses": "FolderOpen",
  "robes": "Shirt",
  "robinets": "Wrench",
  "robinets-de-salle-de-bain": "Wrench",
  "robot-petrin": "Blend",
  "robots-aspirateurs": "Wind",
  "robots-multifonction": "Blend",
  "rouges-a-levres": "Paintbrush",
  "routeurs": "Network",
  "sac-a-dos-scolaire": "Backpack",
  "sacoches-ordinateurs-portables": "Laptop",
  "sacs-a-dos": "Backpack",
  "sacs-a-mains-et-sacs-en-bandouliere": "Backpack",
  "sante-beaute": "HeartPulse",
  "savons-liquides": "ShowerHead",
  "savons-solides": "ShowerHead",
  "scanners": "Printer",
  "scies-sauteuses": "Wrench",
  "scooters": "Bike",
  "scooters-electriques": "Bike",
  "seche-cheveux": "Wind",
  "seche-linges": "WashingMachine",
  "serums-capillaires-soins": "Scissors",
  "serums-visage": "Sparkles",
  "serveurs": "Monitor",
  "serveurs-nas": "Monitor",
  "shampoings": "Scissors",
  "shampoings-cheveux": "Scissors",
  "shampoings-cheveux-beaute": "Scissors",
  "sieges-auto-bebe": "ToyBrick",
  "sieges-de-toilette-pour-bébé": "ToyBrick",
  "sieges-pour-jeux-videos": "Gamepad2",
  "smart-watches": "Watch",
  "smartphones": "Smartphone",
  "soin-de-la-peau-de-l-apos-enfant": "HeartPulse",
  "soin-des-pieds": "Droplet",
  "soin-sans-rincage": "Sparkles",
  "soin-visage": "Sparkles",
  "soins-de-sante": "HeartPulse",
  "soins-du-corps-pour-enfants": "Droplet",
  "soins-interdentaires": "Smile",
  "soins-pour-barbe": "Scissors",
  "soins-visage-pour-enfants": "Sparkles",
  "sommeil-de-l-enfant": "Moon",
  "sorbetieres": "Utensils",
  "souris": "Mouse",
  "sports-loisirs": "Volleyball",
  "stations-d-accueil-ordinateurs": "Laptop",
  "stockages": "HardDrive",
  "styling": "Scissors",
  "stylos-a-bille": "PenTool",
  "stylos-feutres": "PenTool",
  "stylos-fins": "PenTool",
  "supports": "Layers",
  "supports-d-ecrans": "MonitorPlay",
  "systemes-de-reliure-pour-maintenir-les-papiers-et-les-documents": "FolderOpen",
  "systemes-de-surveillance": "Camera",
  "systemes-videophone": "Smartphone",
  "tableaux": "Image",
  "tableaux-blancs": "Image",
  "tableaux-d-affichage-accessoires": "Image",
  "tables-de-camping": "Armchair",
  "tables-de-repassage": "Flame",
  "tablettes": "Tablet",
  "tablettes-graphiques": "Tablet",
  "tailles-haie-electriques": "Wrench",
  "tambours-d-imprimante": "Printer",
  "tamis-de-cuisine": "UtensilsCrossed",
  "tapis-d-eveil-et-de-jeux-pour-bebes": "Gamepad2",
  "tapis-de-course": "Dumbbell",
  "tapis-de-souris": "Mouse",
  "tasses": "UtensilsCrossed",
  "telephone-portables": "Smartphone",
  "telephones-fixes": "Smartphone",
  "televiseurs": "Tv",
  "tensiometres-pression-arterielle": "Stethoscope",
  "tenus-et-vetements-de-sport": "Shirt",
  "tetes-de-rechange": "ToyBrick",
  "tetines-pour-bebe": "Baby",
  "tetines-pour-biberons": "Baby",
  "thermometres": "Stethoscope",
  "tires-lait": "Baby",
  "tondeuses-a-gazon": "Wrench",
  "toniques-et-soin-apaisant-visage": "Sparkles",
  "torches-et-lampes-de-poche": "Lamp",
  "tournevis-manuels": "Wrench",
  "tringles-a-rideaux-de-douche": "Image",
  "trottinettes-electriques": "Bike",
  "trousses-a-crayons": "PenTool",
  "tv-accessories": "Tv",
  "usb-hubs": "Network",
  "ustensiles-de-cuisine": "UtensilsCrossed",
  "ustensiles-de-cuisine-gadgets": "UtensilsCrossed",
  "vaisselles": "UtensilsCrossed",
  "valises": "Backpack",
  "vehicules-pour-enfants": "ToyBrick",
  "velos-d-appartement": "Bike",
  "velos-et-accessoires": "Bike",
  "ventilateurs": "AirVent",
  "vernis-a-ongles": "Palette",
  "verres-et-tasses": "UtensilsCrossed",
  "visage-pour-hommes": "User",
  "visseuses-electriques-et-visseuses-a-percussion": "Wrench",
  "vitamines-et-complements-alimentaires": "Pill",
  "webcams": "Camera",
  "wireless-access-points": "Network",
  "yaourtieres": "Utensils",
  "zone-de-la-bouche-et-des-levres": "Paintbrush",
};

const CATEGORY_FAMILY: Record<string, string> = {
  "acces-et-controles": "informatique",
  "accessoires-de-bain-pour-bebes": "bebe-enfants",
  "accessoires-de-camera-camescope": "photo-camera",
  "accessoires-de-console-de-jeux": "bebe-enfants",
  "accessoires-de-decoration-d-interieur": "maison-jardin",
  "accessoires-de-musculation-des-mains": "sport",
  "accessoires-de-nettoyeur-a-pression": "petit-electromenager",
  "accessoires-de-systeme-de-paiement-en-point-de-vente": "bureau",
  "accessoires-et-materiel-menagers": "maison-jardin",
  "accessoires-imprimantes-et-scanners": "informatique",
  "accessoires-parfums": "sante-beaute",
  "accessoires-pour-cheveux": "sante-beaute",
  "accessoires-pour-corps": "sante-beaute",
  "accessoires-pour-dents": "sante-beaute",
  "accessoires-pour-piscine": "maison-jardin",
  "accessoires-pour-smartwatch": "mode",
  "accessoires-pour-visage": "sante-beaute",
  "accessoires-telephones": "telephonie",
  "agrafes": "bureau",
  "agrafeuses": "bureau",
  "alimentation-du-sportif": "sport",
  "alimentation-pc": "informatique",
  "alimentations-d-energie-non-interruptibles": "informatique",
  "ampoules-led": "maison-jardin",
  "appareil-a-raclette": "petit-electromenager",
  "appareils-a-emballage-sous-vide": "petit-electromenager",
  "appareils-anti-moustiques-insectes": "petit-electromenager",
  "appareils-de-cuisson": "petit-electromenager",
  "appareils-electriques": "petit-electromenager",
  "appareils-electroniques": "informatique",
  "appareils-photo-numeriques": "photo-camera",
  "apres-shampoings": "sante-beaute",
  "apres-shampoings-baumes": "sante-beaute",
  "arrosages-et-irrigations-de-jardin": "maison-jardin",
  "arroseurs": "maison-jardin",
  "aspirateurs": "petit-electromenager",
  "aspirateurs-balai": "petit-electromenager",
  "aspirateurs-de-table": "petit-electromenager",
  "aspirateurs-nasaux-pour-bebe": "bebe-enfants",
  "assiettes": "cuisine",
  "autocuiseurs-pour-cuisiniere": "electromenager",
  "bagages": "mode",
  "baignoires-pour-bebes": "bebe-enfants",
  "bain-de-bebe": "bebe-enfants",
  "bain-moussant-pour-douche": "sante-beaute",
  "bains-de-bebe": "bebe-enfants",
  "bains-de-bouche-et-sprays-buccaux": "sante-beaute",
  "balances-de-cuisine": "petit-electromenager",
  "ballons-de-football": "sport",
  "bancs-de-musculation": "sport",
  "barbecue-bb-qs": "cuisine",
  "barres-d-halteres": "sport",
  "barrettes-memoires": "informatique",
  "batons-supports-pour-selfies": "photo-camera",
  "batterie-pc-portable": "telephonie",
  "batteries": "telephonie",
  "batteurs": "petit-electromenager",
  "baumes-a-levres": "maquillage",
  "bavoirs-pour-bebes": "bebe-enfants",
  "bebe-enfants": "bebe-enfants",
  "biberons": "bebe-enfants",
  "biberons-et-vaisselle-pour-bebes": "bebe-enfants",
  "blanchiment-des-dents": "sante-beaute",
  "blenders": "petit-electromenager",
  "blocs-notes": "bureau",
  "boites-a-outils": "maison-jardin",
  "boites-hermetiques-alimentaires": "cuisine",
  "boitiers-d-equipement-reseau": "informatique",
  "boitiers-de-disques-de-stockage": "informatique",
  "bouilloires": "petit-electromenager",
  "bracelets": "mode",
  "brillants-a-levres": "maquillage",
  "brosse-soufflante-chauffante": "petit-electromenager",
  "brosses-a-dents": "sante-beaute",
  "brosses-a-dents-electrique": "sante-beaute",
  "brosses-a-dents-electriques": "sante-beaute",
  "brosses-a-dents-nettoyage": "sante-beaute",
  "brosses-et-supports-pour-toilettes": "maison-jardin",
  "cables-antivol": "informatique",
  "cables-audio": "informatique",
  "cables-de-reseau": "informatique",
  "cables-de-telephones-portables": "telephonie",
  "cables-hdmi": "informatique",
  "cables-lightning": "informatique",
  "cables-pour-ordinateurs-et-peripheriques": "informatique",
  "cables-telephone": "telephonie",
  "cables-video-et-adaptateurs": "informatique",
  "caisses-enregistreuses": "bureau",
  "calculatrices": "bureau",
  "camera-lenses": "photo-camera",
  "camera-tripods": "photo-camera",
  "cameras-de-surveillance": "photo-camera",
  "camescopes": "photo-camera",
  "capsules-et-dosettes-de-cafe": "petit-electromenager",
  "car-holder": "telephonie",
  "cartes-graphiques": "informatique",
  "cartes-memoires": "informatique",
  "cartes-mere": "informatique",
  "cartouches-de-toner": "informatique",
  "casques": "image-et-son",
  "casseroles": "cuisine",
  "casseroles-a-sauce": "cuisine",
  "cave-a-vin": "electromenager",
  "cellulite-et-vergetures": "sante-beaute",
  "centrifugeuses-et-presse-agrumes": "petit-electromenager",
  "chaises-de-camping": "maison-jardin",
  "chaises-hautes": "bebe-enfants",
  "chaises-restaurant": "maison-jardin",
  "changeurs-de-genre-de-cable": "informatique",
  "chapeaux": "mode",
  "chargeurs-de-telephones-portables": "telephonie",
  "chauffage-a-gaz": "electromenager",
  "chauffage-refroidissement-et-qualite-de-l-air": "electromenager",
  "chauffages": "electromenager",
  "chauffe-bain": "petit-electromenager",
  "chauffe-biberons": "bebe-enfants",
  "chaussettes": "mode",
  "chaussures": "mode",
  "chaussures-d-athletisme": "sport",
  "chaussures-de-sport-a-la-mode": "mode",
  "chemises-et-hauts": "mode",
  "cheveux": "sante-beaute",
  "cheveux-hommes": "sante-beaute",
  "cheveux-pour-enfant": "sante-beaute",
  "ciseaux-a-bouts-ronds": "bureau",
  "claquettes-et-tongs": "mode",
  "claviers": "informatique",
  "cle-usb": "informatique",
  "cles-a-fourche": "maison-jardin",
  "climatiseurs": "electromenager",
  "cocotte-minute": "petit-electromenager",
  "coffres-forts": "maison-jardin",
  "coffrets-cadeaux-de-parfum": "sante-beaute",
  "coffrets-de-sciences-pour-enfant": "bebe-enfants",
  "coffrets-pour-femme": "sante-beaute",
  "coffrets-pour-les-bebes": "bebe-enfants",
  "colliers": "mode",
  "colliers-harnais-et-laisses-pour-chiens-et-chats": "animaux",
  "colorations-cheveux": "sante-beaute",
  "compas-a-secteur": "bureau",
  "composants": "informatique",
  "computer-backpack": "informatique",
  "computer-cases": "informatique",
  "computer-chargers": "informatique",
  "congelateurs": "electromenager",
  "consoles-de-jeux": "bebe-enfants",
  "consommables": "informatique",
  "cookware": "cuisine",
  "corps": "sante-beaute",
  "correcteurs": "maquillage",
  "couches-jetables": "bebe-enfants",
  "couches-jetables-pour-bebe": "bebe-enfants",
  "couleurs-de-cheveux": "sante-beaute",
  "couteaux-de-cuisine": "cuisine",
  "couteaux-de-poche": "cuisine",
  "couteaux-electriques": "cuisine",
  "couverts-et-coutellerie": "cuisine",
  "couvertures-de-lit": "maison-jardin",
  "crayons-a-levres": "maquillage",
  "crayons-de-couleur": "bureau",
  "crayons-pour-les-yeux": "maquillage",
  "crayons-sourcils": "maquillage",
  "creme-mains": "sante-beaute",
  "cremes-corporelles-hydratants": "sante-beaute",
  "cremes-corporelles-soin": "sante-beaute",
  "cremes-et-gels-pour-les-yeux": "sante-beaute",
  "cremes-et-hydratants-pour-le-corps": "sante-beaute",
  "cremes-et-hydratants-pour-le-visage": "sante-beaute",
  "cremes-hydratantes-pour-le-visage": "sante-beaute",
  "cremes-pour-le-visage": "sante-beaute",
  "cremes-pour-les-yeux": "sante-beaute",
  "cremes-solaires": "sante-beaute",
  "cremes-teintees": "sante-beaute",
  "crepieres": "petit-electromenager",
  "cuiseur-a-vapeur": "petit-electromenager",
  "cuiseurs-a-oeufs": "petit-electromenager",
  "cuiseurs-a-riz": "petit-electromenager",
  "cuisinieres": "electromenager",
  "decors-muraux": "maison-jardin",
  "defroisseurs": "petit-electromenager",
  "demaquillant-et-nettoyant": "sante-beaute",
  "demaquillants-visage": "sante-beaute",
  "demaquillants-yeux": "sante-beaute",
  "dentifrices": "sante-beaute",
  "dentifrices-dents": "sante-beaute",
  "deodorants-et-anti-transpirants": "sante-beaute",
  "deodorants-et-antitranspirants": "sante-beaute",
  "destructeur-de-papier": "bureau",
  "detartrants": "maison-jardin",
  "digital-tv-boxes": "image-et-son",
  "disques-durs": "informatique",
  "disques-durs-externes": "informatique",
  "disques-ssd": "informatique",
  "distributeurs-de-savon": "maison-jardin",
  "docking-stations": "informatique",
  "eaux-de-parfum": "sante-beaute",
  "eaux-de-parfum-pour-femme": "sante-beaute",
  "eaux-de-parfum-pour-homme": "sante-beaute",
  "eaux-de-toilette": "sante-beaute",
  "eaux-de-toilette-femme": "sante-beaute",
  "eaux-de-toilette-homme": "sante-beaute",
  "eaux-micellaires": "sante-beaute",
  "eclairage-exterieur": "maison-jardin",
  "eclairages-de-plafond": "maison-jardin",
  "ecouteurs": "image-et-son",
  "enceintes-portables": "image-et-son",
  "ensemble-clavier-et-souris": "informatique",
  "ensembles-de-meubles-de-jardin": "maison-jardin",
  "ensembles-de-meubles-pour-enfants": "maison-jardin",
  "epilateurs": "sante-beaute",
  "eponges": "maison-jardin",
  "equipement-medical": "sante-beaute",
  "equipement-pour-sports-de-raquette": "sport",
  "equipement-pour-sports-nautiques": "sport",
  "equipements-de-fitness": "sport",
  "equipements-de-scene-et-de-studio": "image-et-son",
  "equipements-et-jeux-de-recreation-et-sportifs": "bebe-enfants",
  "equipements-pour-terrain-de-jeux": "bebe-enfants",
  "erotisme-corps": "sante-beaute",
  "espresso-machine": "petit-electromenager",
  "etuis-coques": "telephonie",
  "etuis-et-housses-d-appareils-photo": "photo-camera",
  "eviers": "maison-jardin",
  "exfoliants-pour-le-visage": "sante-beaute",
  "faits-tout": "cuisine",
  "fards": "maquillage",
  "fards-a-paupieres": "maquillage",
  "fauteuils": "maison-jardin",
  "fauteuils-pour-enfants": "maison-jardin",
  "fer-a-repasser": "petit-electromenager",
  "fers-a-boucler": "petit-electromenager",
  "figurines-pour-enfants": "bebe-enfants",
  "films-protecteurs": "telephonie",
  "fixateur-de-maquillage": "maquillage",
  "flotteurs-de-plage-et-de-piscine": "maison-jardin",
  "fond-de-teint": "maquillage",
  "fontaine-eau-fraiche": "petit-electromenager",
  "forets": "maison-jardin",
  "fouets": "cuisine",
  "fournitures-de-bureau": "bureau",
  "fours": "electromenager",
  "friteuses": "petit-electromenager",
  "game-controllers": "bebe-enfants",
  "gamelles": "animaux",
  "gants-de-sport": "sport",
  "gaufriers": "petit-electromenager",
  "gels-de-toilette-intime": "sante-beaute",
  "gels-dents-gencives": "sante-beaute",
  "gels-douche-bain": "sante-beaute",
  "gels-douches": "sante-beaute",
  "gels-lubrifiants-erotisme": "sante-beaute",
  "gels-nettoyants-visage": "sante-beaute",
  "glacieres": "cuisine",
  "gommages-corporels": "sante-beaute",
  "gommages-pour-le-corps": "sante-beaute",
  "gommages-pour-le-visage": "sante-beaute",
  "gourdes": "cuisine",
  "grill-panini": "petit-electromenager",
  "grille-pains": "petit-electromenager",
  "groupes-electrogenes": "electromenager",
  "hachoirs": "petit-electromenager",
  "halteres": "sport",
  "haut-parleurs": "image-et-son",
  "haut-parleurs-conférence": "image-et-son",
  "hochets": "bebe-enfants",
  "home-cinema-systems": "image-et-son",
  "hottes-aspirantes": "electromenager",
  "hubs-et-switches": "informatique",
  "huiles-cheveux": "sante-beaute",
  "huiles-pour-le-corps": "sante-beaute",
  "image-et-son": "image-et-son",
  "imprimantes": "informatique",
  "imprimantes-jets-d-encres": "informatique",
  "imprimantes-laser": "informatique",
  "imprimantes-pour-etiquettes": "informatique",
  "informatique": "informatique",
  "instruments-de-mesure-de-la-distance": "maison-jardin",
  "jeux": "bebe-enfants",
  "jeux-d-imitation": "bebe-enfants",
  "jeux-de-societe": "bebe-enfants",
  "jeux-videos": "bebe-enfants",
  "jouets": "bebe-enfants",
  "jouets-a-chevaucher": "bebe-enfants",
  "jouets-d-apprentissage": "bebe-enfants",
  "jouets-de-construction": "bebe-enfants",
  "jouets-de-piscine": "maison-jardin",
  "jouets-electroniques-pour-enfants": "bebe-enfants",
  "jouets-et-jeux-d-eveil-d-adresse": "bebe-enfants",
  "jouets-interactifs": "bebe-enfants",
  "jouets-musicaux": "bebe-enfants",
  "jouets-pour-bebes": "bebe-enfants",
  "jouets-sets-de-jeux": "bebe-enfants",
  "kits-de-loisirs-creatifs-et-artistiques-pour-enfants": "bebe-enfants",
  "kits-de-natation": "sport",
  "laits-corporels": "sante-beaute",
  "laits-pour-le-corps": "sante-beaute",
  "laminateurs-et-fournitures": "bureau",
  "lampes-de-camping": "maison-jardin",
  "lampes-de-table": "maison-jardin",
  "laques-cheveux": "sante-beaute",
  "lave-vaisselles": "electromenager",
  "lecteurs-graveurs-optiques": "informatique",
  "lessives": "maison-jardin",
  "lisseurs": "petit-electromenager",
  "litieres-et-effractions-pour-chiens-et-chats": "animaux",
  "livres": "bureau",
  "livres-et-pages-a-colorier": "bureau",
  "logiciels": "informatique",
  "logiciels-systemes-dexploitation": "informatique",
  "lots-de-casseroles": "cuisine",
  "lumieres-de-nuit-pour-bebe": "maison-jardin",
  "lunettes-de-natation": "mode",
  "lunettes-de-soleil": "mode",
  "machine-a-laver": "electromenager",
  "machine-a-pain": "petit-electromenager",
  "machines-a-cafe": "petit-electromenager",
  "machines-a-coudre": "petit-electromenager",
  "machines-electriques-a-souder": "maison-jardin",
  "machines-et-fours-a-pizzas": "cuisine",
  "marmites": "cuisine",
  "marqueurs": "bureau",
  "marteaux-rotatifs": "maison-jardin",
  "mascaras": "maquillage",
  "mascaras-et-gels-sourcils": "maquillage",
  "masques-cheveux": "sante-beaute",
  "masques-pour-cheveux": "sante-beaute",
  "masques-pour-le-visage": "sante-beaute",
  "masques-visage": "sante-beaute",
  "matelas-gonflable": "maison-jardin",
  "materiel-de-coiffure": "sante-beaute",
  "materiel-pour-imprimante": "informatique",
  "meubles-de-salon": "maison-jardin",
  "meubles-pour-la-maison": "maison-jardin",
  "meuleuses-d-angle": "maison-jardin",
  "micro-ondes": "electromenager",
  "microphones": "image-et-son",
  "mixeurs": "petit-electromenager",
  "mobilier-de-bureau": "maison-jardin",
  "moniteurs": "informatique",
  "moniteurs-video-pour-bebe": "photo-camera",
  "montres": "mode",
  "moules-a-gateaux": "cuisine",
  "moules-a-gaufres": "cuisine",
  "moulins-a-cafe": "petit-electromenager",
  "mousses-nettoyantes-pour-le-visage": "sante-beaute",
  "nettoyant": "sante-beaute",
  "nettoyeur-haute-pression": "petit-electromenager",
  "nourriture-boissons-tabac": "image-et-son",
  "nourriture-pour-chiens-et-chats": "animaux",
  "onduleurs": "informatique",
  "ordinateurs": "informatique",
  "ordinateurs-de-bureau": "informatique",
  "ordinateurs-portables": "informatique",
  "organiseurs-de-bureau": "bureau",
  "outils-de-maquillage": "maquillage",
  "outils-de-soins-personnels": "sante-beaute",
  "outils-sans-fil": "maison-jardin",
  "palettes-de-fards-a-paupieres": "maquillage",
  "pantalons": "mode",
  "papiers-imprimante": "informatique",
  "parasols-de-terrasse": "maison-jardin",
  "parcs": "bebe-enfants",
  "parfums-beaute": "sante-beaute",
  "parfums-et-maquillage-pour-enfants": "sante-beaute",
  "parfums-pour-enfants": "sante-beaute",
  "parfums-pour-femme": "sante-beaute",
  "parfums-unisexes": "sante-beaute",
  "peignes-et-brosses-cheveux": "sante-beaute",
  "peintures-pour-loisir": "maison-jardin",
  "pellicules-polaroid": "photo-camera",
  "peluches": "bebe-enfants",
  "perceuses": "maison-jardin",
  "pese-personnes": "sante-beaute",
  "petites-pieces-et-boites-a-outils": "maison-jardin",
  "pieces-et-accessoires-d-equipements-audiovisuels": "image-et-son",
  "piles-domestiques": "informatique",
  "pinceaux-pour-maquillage-du-visage": "maquillage",
  "pinces": "cuisine",
  "piscines-de-jeux-pour-enfants": "bebe-enfants",
  "piscines-hors-sol": "maison-jardin",
  "pistolets-a-peinture": "maison-jardin",
  "pistolets-eau-buses": "maison-jardin",
  "placards-et-armoires-de-chambre-a-coucher": "maison-jardin",
  "plaques-de-cuisson": "electromenager",
  "platines": "image-et-son",
  "plats": "cuisine",
  "poeles": "cuisine",
  "pompes-a-eaux": "maison-jardin",
  "ponceuses-portatives": "maison-jardin",
  "portes-savon": "maison-jardin",
  "pots-rangement": "maison-jardin",
  "poubelles": "maison-jardin",
  "poudres": "maquillage",
  "poupees": "bebe-enfants",
  "poussettes-pour-bebe": "bebe-enfants",
  "powerbank": "telephonie",
  "preservatifs": "sante-beaute",
  "presse-agrumes": "petit-electromenager",
  "processeurs": "informatique",
  "produits-apres-rasage": "sante-beaute",
  "produits-d-archivage": "bureau",
  "produits-de-coiffure": "sante-beaute",
  "produits-de-soins-de-cheveux-de-bebe": "sante-beaute",
  "produits-de-soins-de-la-peau": "sante-beaute",
  "produits-de-soins-des-yeux": "sante-beaute",
  "produits-de-soins-pour-la-peau": "sante-beaute",
  "produits-de-traitement-oculaire": "sante-beaute",
  "produits-de-traitements-dermatologiques-corporels": "sante-beaute",
  "produits-nettoyants-et-lavants-visage": "sante-beaute",
  "produits-rasage": "sante-beaute",
  "produits-solaires-pour-enfants": "sante-beaute",
  "projecteurs": "image-et-son",
  "protection-contre-le-rayonnement-solaire": "sante-beaute",
  "protection-contre-le-rayonnement-solaire-pour-le-corps": "sante-beaute",
  "protection-solaire-cheveux": "sante-beaute",
  "protections-d-ecran-de-telephone-portable": "telephonie",
  "protections-pour-circuit": "informatique",
  "purificateurs-d-air-liquides": "petit-electromenager",
  "puzzles": "bebe-enfants",
  "raccords-des-tuyaux-d-eau": "maison-jardin",
  "radiateur-bain-huile": "electromenager",
  "radiateurs-electriques": "electromenager",
  "radios-portables": "image-et-son",
  "rasage": "sante-beaute",
  "rasoirs-et-tondeuses": "sante-beaute",
  "recepteurs-tv": "image-et-son",
  "recharges-d-encre-pour-imprimante": "informatique",
  "recipients-alimentaires-pour-enfants": "cuisine",
  "refrigerateurs": "electromenager",
  "refroidissement-cpu": "informatique",
  "refroidissement-d-ordinateur": "informatique",
  "refroidissement-laptop": "informatique",
  "relaxation": "sante-beaute",
  "relieuses": "bureau",
  "robes": "mode",
  "robinets": "maison-jardin",
  "robinets-de-salle-de-bain": "maison-jardin",
  "robot-petrin": "petit-electromenager",
  "robots-aspirateurs": "petit-electromenager",
  "robots-multifonction": "petit-electromenager",
  "rouges-a-levres": "maquillage",
  "routeurs": "informatique",
  "sac-a-dos-scolaire": "mode",
  "sacoches-ordinateurs-portables": "mode",
  "sacs-a-dos": "mode",
  "sacs-a-mains-et-sacs-en-bandouliere": "mode",
  "sante-beaute": "sante-beaute",
  "savons-liquides": "sante-beaute",
  "savons-solides": "sante-beaute",
  "scanners": "informatique",
  "scies-sauteuses": "maison-jardin",
  "scooters": "sport",
  "scooters-electriques": "sport",
  "seche-cheveux": "petit-electromenager",
  "seche-linges": "electromenager",
  "serums-capillaires-soins": "sante-beaute",
  "serums-visage": "sante-beaute",
  "serveurs": "informatique",
  "serveurs-nas": "informatique",
  "shampoings": "sante-beaute",
  "shampoings-cheveux": "sante-beaute",
  "shampoings-cheveux-beaute": "sante-beaute",
  "sieges-auto-bebe": "bebe-enfants",
  "sieges-de-toilette-pour-bébé": "bebe-enfants",
  "sieges-pour-jeux-videos": "bebe-enfants",
  "smart-watches": "mode",
  "smartphones": "telephonie",
  "soin-de-la-peau-de-l-apos-enfant": "sante-beaute",
  "soin-des-pieds": "sante-beaute",
  "soin-sans-rincage": "sante-beaute",
  "soin-visage": "sante-beaute",
  "soins-de-sante": "sante-beaute",
  "soins-du-corps-pour-enfants": "sante-beaute",
  "soins-interdentaires": "sante-beaute",
  "soins-pour-barbe": "sante-beaute",
  "soins-visage-pour-enfants": "sante-beaute",
  "sommeil-de-l-enfant": "bebe-enfants",
  "sorbetieres": "petit-electromenager",
  "souris": "informatique",
  "sports-loisirs": "sport",
  "stations-d-accueil-ordinateurs": "informatique",
  "stockages": "informatique",
  "styling": "sante-beaute",
  "stylos-a-bille": "bureau",
  "stylos-feutres": "bureau",
  "stylos-fins": "bureau",
  "supports": "informatique",
  "supports-d-ecrans": "informatique",
  "systemes-de-reliure-pour-maintenir-les-papiers-et-les-documents": "bureau",
  "systemes-de-surveillance": "informatique",
  "systemes-videophone": "maison-jardin",
  "tableaux": "maison-jardin",
  "tableaux-blancs": "bureau",
  "tableaux-d-affichage-accessoires": "bureau",
  "tables-de-camping": "maison-jardin",
  "tables-de-repassage": "petit-electromenager",
  "tablettes": "informatique",
  "tablettes-graphiques": "informatique",
  "tailles-haie-electriques": "maison-jardin",
  "tambours-d-imprimante": "informatique",
  "tamis-de-cuisine": "cuisine",
  "tapis-d-eveil-et-de-jeux-pour-bebes": "bebe-enfants",
  "tapis-de-course": "sport",
  "tapis-de-souris": "informatique",
  "tasses": "cuisine",
  "telephone-portables": "telephonie",
  "telephones-fixes": "telephonie",
  "televiseurs": "image-et-son",
  "tensiometres-pression-arterielle": "sante-beaute",
  "tenus-et-vetements-de-sport": "sport",
  "tetes-de-rechange": "bebe-enfants",
  "tetines-pour-bebe": "bebe-enfants",
  "tetines-pour-biberons": "bebe-enfants",
  "thermometres": "sante-beaute",
  "tires-lait": "bebe-enfants",
  "tondeuses-a-gazon": "maison-jardin",
  "toniques-et-soin-apaisant-visage": "sante-beaute",
  "torches-et-lampes-de-poche": "maison-jardin",
  "tournevis-manuels": "maison-jardin",
  "tringles-a-rideaux-de-douche": "maison-jardin",
  "trottinettes-electriques": "sport",
  "trousses-a-crayons": "bureau",
  "tv-accessories": "image-et-son",
  "usb-hubs": "informatique",
  "ustensiles-de-cuisine": "cuisine",
  "ustensiles-de-cuisine-gadgets": "cuisine",
  "vaisselles": "cuisine",
  "valises": "mode",
  "vehicules-pour-enfants": "bebe-enfants",
  "velos-d-appartement": "sport",
  "velos-et-accessoires": "sport",
  "ventilateurs": "petit-electromenager",
  "vernis-a-ongles": "maquillage",
  "verres-et-tasses": "cuisine",
  "visage-pour-hommes": "sante-beaute",
  "visseuses-electriques-et-visseuses-a-percussion": "maison-jardin",
  "vitamines-et-complements-alimentaires": "sante-beaute",
  "webcams": "informatique",
  "wireless-access-points": "informatique",
  "yaourtieres": "petit-electromenager",
  "zone-de-la-bouche-et-des-levres": "sante-beaute",
};

function familyFor(slug: string): string {
  return CATEGORY_FAMILY[slug] ?? "divers";
}



function humanizeCategory(slug: string) {
  return slug
    .split("-")
    .map((word) => (word.length > 2 ? word[0].toUpperCase() + word.slice(1) : word))
    .join(" ");
}

const CATEGORY_DEFINITIONS = [
  { raw: ["596-smartphone-tunisie", "smartphones"], slug: "smartphones", label: "Smartphones", icon: "Smartphone" },
  { raw: ["301-pc-portable-tunisie", "PC Portable", "pc-portables"], slug: "pc-portables", label: "PC portables", icon: "Laptop" },
  { raw: ["373-pc-de-bureau"], slug: "pc-de-bureau", label: "PC de bureau", icon: "Monitor" },
  { raw: ["667-ecran-pc-tunisie", "ecrans", "moniteurs"], slug: "ecrans", label: "Écrans", icon: "MonitorPlay" },
  { raw: ["338-casque-ecouteurs", "casques-ecouteurs", "casques", "ecouteurs"], slug: "casques-ecouteurs", label: "Casques & écouteurs", icon: "Headphones" },
  { raw: ["334-souris-informatique", "souris"], slug: "souris", label: "Souris", icon: "Mouse" },
  { raw: ["704-claviers", "claviers"], slug: "claviers", label: "Claviers", icon: "Keyboard" },
  { raw: ["457-climatiseur-tunisie-chaud-froid"], slug: "climatiseurs", label: "Climatiseurs", icon: "AirVent" },
  { raw: ["331-sac-a-dos-tunisie"], slug: "sacs-accessoires", label: "Sacs & accessoires", icon: "Backpack" },
] as const;

type CategoryDefinition = (typeof CATEGORY_DEFINITIONS)[number];
const categoryByRaw: Map<string, AnyCategoryDefinition> = new Map(
  CATEGORY_DEFINITIONS.flatMap((category) =>
    category.raw.map((raw) => [raw, category] as const),
  ),
);

// Generated definitions for categories found in the data but not declared above.
const generatedCategories = new Map<string, AnyCategoryDefinition>();
function categoryFor(rawSlug: string): AnyCategoryDefinition {
  const known = categoryByRaw.get(rawSlug);
  if (known) return known;
  let generated = generatedCategories.get(rawSlug);
  if (!generated) {
    generated = {
      slug: rawSlug,
      label: humanizeCategory(rawSlug),
      icon: CATEGORY_ICONS[rawSlug] ?? "ShoppingBag",
      count: 0,
      note: "",
      family: familyFor(rawSlug),
    };
    generatedCategories.set(rawSlug, generated);
  }
  return generated;
}

const STORE_DETAILS: Record<string, { color: string; delivery: string; availability: string }> = {
  Tunisianet: {
    color: "#6d4aff",
    delivery: "Voir les conditions de livraison",
    availability: "Disponibilité à confirmer",
  },
  Spacenet: {
    color: "#ef3f4f",
    delivery: "Voir les conditions de livraison",
    availability: "Disponibilité à confirmer",
  },
};

// Color palette for additional stores (primini merchant list)
const STORE_COLORS = [
  "#6347f5", "#ff4757", "#2ed573", "#1e90ff", "#ffa502", "#a55eea",
  "#ff6348", "#3742fa", "#7bed9f", "#70a1ff", "#ff6b81", "#f368e0",
];
let storeColorIndex = 0;
function storeColor(store: string) {
  let hash = 0;
  for (let i = 0; i < store.length; i++) hash = (hash * 31 + store.charCodeAt(i)) | 0;
  return STORE_COLORS[Math.abs(hash) % STORE_COLORS.length];
}
function getStoreDetails(name: string) {
  const key = name === "Tunisianet" ? "Tunisianet" : name === "Spacenet" ? "Spacenet" : name;
  return STORE_DETAILS[key] ?? {
    color: storeColor(name),
    delivery: "Voir les conditions de livraison",
    availability: "Disponibilité à confirmer",
  };
}

const GENERIC_TOKENS = new Set([
  "pc", "portable", "ordinateur", "laptop", "tunisie", "de", "du", "la", "le", "les",
  "avec", "sans", "pour", "noir", "blanc", "silver", "gris", "blue", "bleu", "red", "rouge",
  "gaming", "gamer",
]);

const BRAND_NAMES = [
  "Spirit of Gamer", "Cooler Master", "Western Digital", "Hewlett Packard",
  "Apple", "Samsung", "Xiaomi", "Redmi", "Oppo", "Infinix", "Tecno", "Itel", "Honor",
  "Realme", "Nokia", "Motorola", "Huawei", "OnePlus", "Lenovo", "ThinkPad", "HP", "Dell",
  "Asus", "Acer", "MSI", "Gigabyte", "Logitech", "Redragon", "Razer", "SteelSeries", "HyperX",
  "Corsair", "Trust", "JBL", "Sony", "Philips", "LG", "TCL", "Hisense", "Haier", "Biolux",
  "Candy", "Beko", "Bosch", "Indesit", "Dahua", "Hikvision", "AOC", "ViewSonic", "Hama",
  "Rapoo", "Marvo", "Meetion", "Fantech", "Thermaltake", "Lexar", "Kingston", "Sandisk",
].sort((first, second) => second.length - first.length);

const BRAND_STOP_WORDS = new Set([
  "smartphone", "telephone", "téléphone", "pc", "ordinateur", "portable", "ecran", "écran", "moniteur",
  "casque", "ecouteur", "écouteur", "ecouteurs", "écouteurs", "souris", "clavier", "climatiseur",
  "sac", "housse", "filaire", "fil", "sans", "micro", "gamer", "gaming", "dos", "optique", "mecanique",
  "mécanique", "sans-fil", "avec", "pour", "usb", "rgb", "noir", "blanc", "bleu", "gris", "silver",
]);

function simplify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function offerSlug(url: string) {
  try {
    return decodeURIComponent(new URL(url).pathname.split("/").filter(Boolean).at(-1) ?? "")
      .replace(/^\d+-/, "")
      .replace(/\.html$/, "");
  } catch {
    return "";
  }
}

function comparisonTokens(value: string) {
  return new Set(
    simplify(value)
      .replace(/^\d+-/, "")
      .replace(/\.html$/, "")
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 1 && !GENERIC_TOKENS.has(token)),
  );
}

function similarity(first: string, second: string) {
  const firstTokens = comparisonTokens(first);
  const secondTokens = comparisonTokens(second);
  let shared = 0;
  for (const token of firstTokens) {
    if (secondTokens.has(token)) shared += 1;
  }
  return shared / Math.max(firstTokens.size, secondTokens.size, 1);
}

function storeName(offer: SourceOffer): string | null {
  const value = simplify(offer.store);
  if (!value) return null;
  if (value.includes("tunisianet")) return "Tunisianet";
  if (value.includes("spacenet")) return "Spacenet";
  // Any other merchant: keep its display name (title-cased first word-ish)
  return offer.store;
}

function validMerchantUrl(url: string, _store: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function merchantPrice(value: number, store: string) {
  // Tunisianet raw prices are in millimes (e.g. 169000) -> divide by 1000.
  // Other stores (primini feed) already carry DT values.
  const normalized = store === "Tunisianet" && value > 1000 ? value / 1000 : value;
  return Number(normalized.toFixed(3));
}

function merchantOldPrice(value: number, price: number, store: string) {
  const normalized = merchantPrice(value, store);
  if (!Number.isFinite(normalized) || normalized < price || normalized > price * 3) return price;
  return normalized;
}

function inferBrand(name: string) {
  const normalized = simplify(name);
  const known = BRAND_NAMES.find((brand) => normalized.includes(simplify(brand)));
  if (known) return known === "Hewlett Packard" ? "HP" : known;

  const candidate = name
    .replace(/[|/()\[\],:;+]/g, " ")
    .split(/\s+/)
    .map((word) => word.replace(/[^\p{L}\p{N}-]/gu, ""))
    .find((word) => {
      const token = simplify(word);
      return token.length > 2 && !BRAND_STOP_WORDS.has(token) && !/^\d/.test(token);
    });
  return candidate || "Autre marque";
}

function normalizeOffer(source: SourceOffer, productId: string): (StoreOffer & { similarity: number }) | null {
  const merchant = storeName(source);
  if (!merchant || !validMerchantUrl(source.url, merchant)) return null;
  const match = similarity(productId, offerSlug(source.url));
  if (match < 0.2) return null;

  const price = merchantPrice(source.price, merchant);
  if (!Number.isFinite(price) || price <= 0) return null;
  const details = getStoreDetails(merchant);
  return {
    store: merchant,
    price,
    oldPrice: merchantOldPrice(source.oldPrice, price, merchant),
    url: source.url,
    color: details.color,
    delivery: details.delivery,
    availability: details.availability,
    updatedAt: "Prix issu du dernier relevé importé",
    similarity: match,
  };
}

function productOffers(group: SourceProduct[]) {
  const productId = group[0].id;
  const bestByStore = new Map<string, StoreOffer & { similarity: number }>();
  for (const rawOffer of group.flatMap((product) => product.offers ?? [])) {
    const offer = normalizeOffer(rawOffer, productId);
    if (!offer) continue;
    const current = bestByStore.get(offer.store);
    if (!current || offer.similarity > current.similarity || (offer.similarity === current.similarity && offer.price < current.price)) {
      bestByStore.set(offer.store, offer);
    }
  }
  return [...bestByStore.values()]
    .map((offer): StoreOffer => ({
      store: offer.store,
      price: offer.price,
      oldPrice: offer.oldPrice,
      url: offer.url,
      color: offer.color,
      delivery: offer.delivery,
      availability: offer.availability,
      updatedAt: offer.updatedAt,
    }))
    .sort((first, second) => first.price - second.price);
}

const groupedProducts = new Map<string, SourceProduct[]>();
for (const sourceProduct of sourceProducts) {
  const existing = groupedProducts.get(sourceProduct.id) ?? [];
  existing.push(sourceProduct);
  groupedProducts.set(sourceProduct.id, existing);
}

export const products: Product[] = [...groupedProducts.values()]
  .flatMap((group): Product[] => {
    const source = group[0];
    const category = categoryFor(source.category);
    const offers = productOffers(group);
    if (!category || offers.length === 0) return [];
    const bestOffer = offers[0];
    const oldPrice = Math.max(bestOffer.price, bestOffer.oldPrice);
    const discount = oldPrice > bestOffer.price
      ? Math.round(((oldPrice - bestOffer.price) / oldPrice) * 100)
      : 0;
    const brand = inferBrand(source.name);
    const product: Product = {
      id: source.id,
      name: source.name,
      brand,
      category: category.label,
      categorySlug: category.slug,
      image: source.image,
      price: bestOffer.price,
      oldPrice,
      rating: 0,
      reviews: 0,
      stores: offers.length,
      discount,
      badge: discount > 0 ? "Promotion" : undefined,
      tag: offers.length > 1 ? "Prix comparé" : undefined,
      description: offers.length > 1
        ? `${source.name} est actuellement référencé chez ${offers.length} boutiques. Comparez les prix et ouvrez directement l’offre du marchand.`
        : `${source.name} est actuellement référencé chez une boutique. Consultez le prix et les conditions du marchand avant l’achat.`,
      specs: [
        ["Marque", brand],
        ["Catégorie", category.label],
        ["Boutiques référencées", String(offers.length)],
        ["Référence Soumly", source.id],
      ] as Array<[string, string]>,
      offers,
    };
    return [product];
  });

const allDefinitions = [
  ...CATEGORY_DEFINITIONS,
  ...[...generatedCategories.values()],
];

export const categories: Category[] = allDefinitions
  .map((definition) => {
    const count = products.filter((product) => product.categorySlug === definition.slug).length;
    const rawSlug = definition.raw?.[0] ?? definition.slug;
    return {
      slug: definition.slug,
      label: definition.label,
      icon: definition.icon,
      count,
      note: `${count} produit${count > 1 ? "s" : ""}`,
      family: familyFor(rawSlug),
    };
  })
  .filter((category) => category.count > 0)
  .sort((first, second) => second.count - first.count);

export function getFamilies() {
  return FAMILY_DEFINITIONS.map((family) => {
    const familyCategories = categories.filter((category) => category.family === family.slug);
    const familyProducts = familyCategories.reduce((sum, category) => sum + category.count, 0);
    return { ...family, categoryCount: familyCategories.length, productCount: familyProducts };
  }).filter((family) => family.productCount > 0);
}

export function getFamilyCategories(familySlug: string) {
  return categories.filter((category) => category.family === familySlug);
}

export const stores = (["Tunisianet", "Spacenet"] as const).map((name) => {
  const storeProducts = products.filter((product) => product.offers.some((offer) => offer.store === name));
  const representedCategories = [...new Set(storeProducts.map((product) => product.category))];
  return {
    name,
    initials: name === "Tunisianet" ? "TN" : "SN",
    color: STORE_DETAILS[name].color,
    rating: 0,
    reviews: 0,
    offers: storeProducts.length,
    categories: representedCategories.join(" · "),
    url: name === "Tunisianet" ? "https://www.tunisianet.com.tn/" : "https://spacenet.tn/",
  };
});

export const guides = [
  { slug: "choisir-smartphone-2026", title: "Comment choisir son smartphone ?", excerpt: "Les critères utiles pour comparer l’écran, l’autonomie, la photo et le stockage.", category: "Smartphones", readTime: "7 min", icon: "Smartphone", tone: 1 },
  { slug: "choisir-pc-portable", title: "Bien choisir son PC portable", excerpt: "Processeur, mémoire, stockage et écran : adaptez la configuration à votre usage.", category: "Informatique", readTime: "8 min", icon: "Laptop", tone: 2 },
  { slug: "comprendre-ecrans", title: "Comprendre les écrans PC", excerpt: "Taille, définition, fréquence et type de dalle expliqués simplement.", category: "Informatique", readTime: "6 min", icon: "MonitorPlay", tone: 3 },
  { slug: "casque-ou-ecouteurs", title: "Casque ou écouteurs : que choisir ?", excerpt: "Confort, isolation, microphone et autonomie selon votre quotidien.", category: "Audio", readTime: "5 min", icon: "Headphones", tone: 4 },
  { slug: "climatiseur-economique", title: "Choisir un climatiseur économique", excerpt: "Puissance, technologie inverter et consommation selon la surface.", category: "Maison", readTime: "7 min", icon: "AirVent", tone: 1 },
  { slug: "comparer-prix-en-ligne", title: "Comparer un prix correctement", excerpt: "Référence exacte, livraison, garantie et disponibilité : les vérifications essentielles.", category: "Conseils", readTime: "4 min", icon: "BadgeCheck", tone: 2 },
];

export function getCategory(slug?: string) {
  return categories.find((category) => category.slug === slug) ?? null;
}

export function getProduct(slug?: string) {
  return products.find((product) => product.id === slug) ?? null;
}

export function relatedProducts(product: Product, limit = 4) {
  return products
    .filter((candidate) => candidate.id !== product.id && candidate.categorySlug === product.categorySlug)
    .slice(0, limit);
}

export function formatPrice(value: number) {
  const hasCents = Math.abs(value - Math.round(value)) > 0.0001;
  return `${new Intl.NumberFormat("fr-TN", {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value)} DT`;
}
