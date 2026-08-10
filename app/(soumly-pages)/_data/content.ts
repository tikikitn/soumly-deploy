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
};

// Category definition used for both curated and generated categories.
type AnyCategoryDefinition = {
  raw?: readonly string[];
  slug: string;
  label: string;
  icon: string;
  count?: number;
  note?: string;
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
    return {
      slug: definition.slug,
      label: definition.label,
      icon: definition.icon,
      count,
      note: `${count} produit${count > 1 ? "s" : ""}`,
    };
  })
  .filter((category) => category.count > 0)
  .sort((first, second) => second.count - first.count);

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
