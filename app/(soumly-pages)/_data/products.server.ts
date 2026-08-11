// Soumly SERVER-ONLY data module.
// This module imports the full product catalog (app/products.ts) and must
// NEVER be imported by a file containing "use client".
// Query functions here run on the server; Client Components receive only
// the data they need as props.
import {
	type Offer as SourceOffer,
	type Product as SourceProduct,
	products as sourceProducts,
} from "../../products";
import {
	type Category,
	FAMILY_DEFINITIONS,
	FAMILY_GROUPS,
	FAMILY_LABELS,
	type PaginatedProducts,
	type Product,
	type ProductSummary,
	type StoreOffer,
} from "./content.shared";

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
	agrafes: "FolderOpen",
	agrafeuses: "FolderOpen",
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
	arroseurs: "Waves",
	aspirateurs: "Wind",
	"aspirateurs-balai": "Wind",
	"aspirateurs-de-table": "Wind",
	"aspirateurs-nasaux-pour-bebe": "Wind",
	assiettes: "UtensilsCrossed",
	"autocuiseurs-pour-cuisiniere": "Microwave",
	bagages: "Backpack",
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
	batteries: "Battery",
	batteurs: "Blend",
	"baumes-a-levres": "Paintbrush",
	"bavoirs-pour-bebes": "ToyBrick",
	"bebe-enfants": "ToyBrick",
	biberons: "Baby",
	"biberons-et-vaisselle-pour-bebes": "Baby",
	"blanchiment-des-dents": "Smile",
	blenders: "Blend",
	"blocs-notes": "FolderOpen",
	"boites-a-outils": "Wrench",
	"boites-hermetiques-alimentaires": "UtensilsCrossed",
	"boitiers-d-equipement-reseau": "Network",
	"boitiers-de-disques-de-stockage": "HardDrive",
	bouilloires: "CupSoda",
	bracelets: "Watch",
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
	calculatrices: "Calculator",
	"camera-lenses": "Camera",
	"camera-tripods": "Camera",
	"cameras-de-surveillance": "Camera",
	camescopes: "Camera",
	"capsules-et-dosettes-de-cafe": "Coffee",
	"car-holder": "Smartphone",
	"cartes-graphiques": "Cpu",
	"cartes-memoires": "HardDrive",
	"cartes-mere": "Cpu",
	"cartouches-de-toner": "Printer",
	casques: "Headphones",
	casseroles: "UtensilsCrossed",
	"casseroles-a-sauce": "UtensilsCrossed",
	"cave-a-vin": "Refrigerator",
	"cellulite-et-vergetures": "Droplet",
	"centrifugeuses-et-presse-agrumes": "Blend",
	"chaises-de-camping": "Armchair",
	"chaises-hautes": "ToyBrick",
	"chaises-restaurant": "Armchair",
	"changeurs-de-genre-de-cable": "Network",
	chapeaux: "Shirt",
	"chargeurs-de-telephones-portables": "Battery",
	"chauffage-a-gaz": "AirVent",
	"chauffage-refroidissement-et-qualite-de-l-air": "AirVent",
	chauffages: "AirVent",
	"chauffe-bain": "CupSoda",
	"chauffe-biberons": "CupSoda",
	chaussettes: "Shirt",
	chaussures: "Footprints",
	"chaussures-d-athletisme": "Footprints",
	"chaussures-de-sport-a-la-mode": "Footprints",
	"chemises-et-hauts": "Shirt",
	cheveux: "Scissors",
	"cheveux-hommes": "Scissors",
	"cheveux-pour-enfant": "Scissors",
	"ciseaux-a-bouts-ronds": "Scissors",
	"claquettes-et-tongs": "Footprints",
	claviers: "Keyboard",
	"cle-usb": "HardDrive",
	"cles-a-fourche": "Wrench",
	climatiseurs: "AirVent",
	"cocotte-minute": "Utensils",
	"coffres-forts": "Lock",
	"coffrets-cadeaux-de-parfum": "SprayCan",
	"coffrets-de-sciences-pour-enfant": "ToyBrick",
	"coffrets-pour-femme": "ToyBrick",
	"coffrets-pour-les-bebes": "ToyBrick",
	colliers: "Watch",
	"colliers-harnais-et-laisses-pour-chiens-et-chats": "Watch",
	"colorations-cheveux": "Scissors",
	"compas-a-secteur": "Compass",
	composants: "Cpu",
	"computer-backpack": "Laptop",
	"computer-cases": "Laptop",
	"computer-chargers": "Laptop",
	congelateurs: "Refrigerator",
	"consoles-de-jeux": "Gamepad2",
	consommables: "Printer",
	cookware: "UtensilsCrossed",
	corps: "Droplet",
	correcteurs: "Palette",
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
	crepieres: "CookingPot",
	"cuiseur-a-vapeur": "Microwave",
	"cuiseurs-a-oeufs": "Utensils",
	"cuiseurs-a-riz": "Utensils",
	cuisinieres: "Microwave",
	"decors-muraux": "Image",
	defroisseurs: "Flame",
	"demaquillant-et-nettoyant": "Sparkles",
	"demaquillants-visage": "Sparkles",
	"demaquillants-yeux": "Sparkles",
	dentifrices: "Smile",
	"dentifrices-dents": "Smile",
	"deodorants-et-anti-transpirants": "ShowerHead",
	"deodorants-et-antitranspirants": "ShowerHead",
	"destructeur-de-papier": "FolderOpen",
	detartrants: "Sparkles",
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
	ecouteurs: "Headphones",
	"enceintes-portables": "Headphones",
	"ensemble-clavier-et-souris": "Mouse",
	"ensembles-de-meubles-de-jardin": "Armchair",
	"ensembles-de-meubles-pour-enfants": "Armchair",
	epilateurs: "Sparkle",
	eponges: "Sparkles",
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
	eviers: "Wrench",
	"exfoliants-pour-le-visage": "Sparkles",
	"faits-tout": "CookingPot",
	fards: "Palette",
	"fards-a-paupieres": "Palette",
	fauteuils: "Armchair",
	"fauteuils-pour-enfants": "Armchair",
	"fer-a-repasser": "Flame",
	"fers-a-boucler": "Wind",
	"figurines-pour-enfants": "ToyBrick",
	"films-protecteurs": "Shield",
	"fixateur-de-maquillage": "Palette",
	"flotteurs-de-plage-et-de-piscine": "Waves",
	"fond-de-teint": "Palette",
	"fontaine-eau-fraiche": "CupSoda",
	forets: "Wrench",
	fouets: "UtensilsCrossed",
	"fournitures-de-bureau": "FolderOpen",
	fours: "Microwave",
	friteuses: "UtensilsCrossed",
	"game-controllers": "Gamepad2",
	gamelles: "PawPrint",
	"gants-de-sport": "Dumbbell",
	gaufriers: "CookingPot",
	"gels-de-toilette-intime": "ShowerHead",
	"gels-dents-gencives": "Smile",
	"gels-douche-bain": "ShowerHead",
	"gels-douches": "ShowerHead",
	"gels-lubrifiants-erotisme": "ShowerHead",
	"gels-nettoyants-visage": "Sparkles",
	glacieres: "UtensilsCrossed",
	"gommages-corporels": "Droplet",
	"gommages-pour-le-corps": "Droplet",
	"gommages-pour-le-visage": "Sparkles",
	gourdes: "UtensilsCrossed",
	"grill-panini": "CookingPot",
	"grille-pains": "Utensils",
	"groupes-electrogenes": "Zap",
	hachoirs: "Blend",
	halteres: "Dumbbell",
	"haut-parleurs": "Headphones",
	"haut-parleurs-conférence": "Headphones",
	hochets: "ToyBrick",
	"home-cinema-systems": "Tv",
	"hottes-aspirantes": "Wind",
	"hubs-et-switches": "Network",
	"huiles-cheveux": "Scissors",
	"huiles-pour-le-corps": "Droplet",
	"image-et-son": "Disc3",
	imprimantes: "Printer",
	"imprimantes-jets-d-encres": "Printer",
	"imprimantes-laser": "Printer",
	"imprimantes-pour-etiquettes": "Printer",
	informatique: "Cpu",
	"instruments-de-mesure-de-la-distance": "Ruler",
	jeux: "Gamepad2",
	"jeux-d-imitation": "Gamepad2",
	"jeux-de-societe": "Gamepad2",
	"jeux-videos": "Gamepad2",
	jouets: "ToyBrick",
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
	lessives: "Sparkles",
	lisseurs: "Wind",
	"litieres-et-effractions-pour-chiens-et-chats": "PawPrint",
	livres: "BookOpen",
	"livres-et-pages-a-colorier": "BookOpen",
	logiciels: "Code2",
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
	marmites: "UtensilsCrossed",
	marqueurs: "PenTool",
	"marteaux-rotatifs": "Wrench",
	mascaras: "Palette",
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
	microphones: "Headphones",
	mixeurs: "Blend",
	"mobilier-de-bureau": "Table",
	moniteurs: "MonitorPlay",
	"moniteurs-video-pour-bebe": "MonitorPlay",
	montres: "Watch",
	"moules-a-gateaux": "UtensilsCrossed",
	"moules-a-gaufres": "UtensilsCrossed",
	"moulins-a-cafe": "Coffee",
	"mousses-nettoyantes-pour-le-visage": "Sparkles",
	nettoyant: "Droplets",
	"nettoyeur-haute-pression": "Wind",
	"nourriture-boissons-tabac": "ShoppingBag",
	"nourriture-pour-chiens-et-chats": "PawPrint",
	onduleurs: "Zap",
	ordinateurs: "Laptop",
	"ordinateurs-de-bureau": "Laptop",
	"ordinateurs-portables": "Laptop",
	"organiseurs-de-bureau": "FolderOpen",
	"outils-de-maquillage": "Palette",
	"outils-de-soins-personnels": "Sparkles",
	"outils-sans-fil": "Wrench",
	"palettes-de-fards-a-paupieres": "Palette",
	pantalons: "Shirt",
	"papiers-imprimante": "FolderOpen",
	"parasols-de-terrasse": "Image",
	parcs: "ToyBrick",
	"parfums-beaute": "SprayCan",
	"parfums-et-maquillage-pour-enfants": "SprayCan",
	"parfums-pour-enfants": "SprayCan",
	"parfums-pour-femme": "SprayCan",
	"parfums-unisexes": "SprayCan",
	"peignes-et-brosses-cheveux": "Scissors",
	"peintures-pour-loisir": "Paintbrush",
	"pellicules-polaroid": "Camera",
	peluches: "ToyBrick",
	perceuses: "Wrench",
	"pese-personnes": "Scale",
	"petites-pieces-et-boites-a-outils": "Wrench",
	"pieces-et-accessoires-d-equipements-audiovisuels": "Disc3",
	"piles-domestiques": "Battery",
	"pinceaux-pour-maquillage-du-visage": "Palette",
	pinces: "UtensilsCrossed",
	"piscines-de-jeux-pour-enfants": "Gamepad2",
	"piscines-hors-sol": "Waves",
	"pistolets-a-peinture": "Wrench",
	"pistolets-eau-buses": "Waves",
	"placards-et-armoires-de-chambre-a-coucher": "Armchair",
	"plaques-de-cuisson": "CookingPot",
	platines: "Disc3",
	plats: "UtensilsCrossed",
	poeles: "CookingPot",
	"pompes-a-eaux": "Droplet",
	"ponceuses-portatives": "Wrench",
	"portes-savon": "Sparkles",
	"pots-rangement": "Box",
	poubelles: "Sparkles",
	poudres: "Palette",
	poupees: "ToyBrick",
	"poussettes-pour-bebe": "ToyBrick",
	powerbank: "Battery",
	preservatifs: "Heart",
	"presse-agrumes": "Blend",
	processeurs: "Cpu",
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
	projecteurs: "Tv",
	"protection-contre-le-rayonnement-solaire": "Sun",
	"protection-contre-le-rayonnement-solaire-pour-le-corps": "Sun",
	"protection-solaire-cheveux": "Sun",
	"protections-d-ecran-de-telephone-portable": "Shield",
	"protections-pour-circuit": "Cpu",
	"purificateurs-d-air-liquides": "Droplets",
	puzzles: "ToyBrick",
	"raccords-des-tuyaux-d-eau": "Wrench",
	"radiateur-bain-huile": "AirVent",
	"radiateurs-electriques": "AirVent",
	"radios-portables": "Headphones",
	rasage: "Scissors",
	"rasoirs-et-tondeuses": "Scissors",
	"recepteurs-tv": "Tv",
	"recharges-d-encre-pour-imprimante": "Printer",
	"recipients-alimentaires-pour-enfants": "UtensilsCrossed",
	refrigerateurs: "Refrigerator",
	"refroidissement-cpu": "Cpu",
	"refroidissement-d-ordinateur": "Cpu",
	"refroidissement-laptop": "Cpu",
	relaxation: "Moon",
	relieuses: "FolderOpen",
	robes: "Shirt",
	robinets: "Wrench",
	"robinets-de-salle-de-bain": "Wrench",
	"robot-petrin": "Blend",
	"robots-aspirateurs": "Wind",
	"robots-multifonction": "Blend",
	"rouges-a-levres": "Paintbrush",
	routeurs: "Network",
	"sac-a-dos-scolaire": "Backpack",
	"sacoches-ordinateurs-portables": "Laptop",
	"sacs-a-dos": "Backpack",
	"sacs-a-mains-et-sacs-en-bandouliere": "Backpack",
	"sante-beaute": "HeartPulse",
	"savons-liquides": "ShowerHead",
	"savons-solides": "ShowerHead",
	scanners: "Printer",
	"scies-sauteuses": "Wrench",
	scooters: "Bike",
	"scooters-electriques": "Bike",
	"seche-cheveux": "Wind",
	"seche-linges": "WashingMachine",
	"serums-capillaires-soins": "Scissors",
	"serums-visage": "Sparkles",
	serveurs: "Monitor",
	"serveurs-nas": "Monitor",
	shampoings: "Scissors",
	"shampoings-cheveux": "Scissors",
	"shampoings-cheveux-beaute": "Scissors",
	"sieges-auto-bebe": "ToyBrick",
	"sieges-de-toilette-pour-bébé": "ToyBrick",
	"sieges-pour-jeux-videos": "Gamepad2",
	"smart-watches": "Watch",
	smartphones: "Smartphone",
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
	sorbetieres: "Utensils",
	souris: "Mouse",
	"sports-loisirs": "Volleyball",
	"stations-d-accueil-ordinateurs": "Laptop",
	stockages: "HardDrive",
	styling: "Scissors",
	"stylos-a-bille": "PenTool",
	"stylos-feutres": "PenTool",
	"stylos-fins": "PenTool",
	supports: "Layers",
	"supports-d-ecrans": "MonitorPlay",
	"systemes-de-reliure-pour-maintenir-les-papiers-et-les-documents": "FolderOpen",
	"systemes-de-surveillance": "Camera",
	"systemes-videophone": "Smartphone",
	tableaux: "Image",
	"tableaux-blancs": "Image",
	"tableaux-d-affichage-accessoires": "Image",
	"tables-de-camping": "Armchair",
	"tables-de-repassage": "Flame",
	tablettes: "Tablet",
	"tablettes-graphiques": "Tablet",
	"tailles-haie-electriques": "Wrench",
	"tambours-d-imprimante": "Printer",
	"tamis-de-cuisine": "UtensilsCrossed",
	"tapis-d-eveil-et-de-jeux-pour-bebes": "Gamepad2",
	"tapis-de-course": "Dumbbell",
	"tapis-de-souris": "Mouse",
	tasses: "UtensilsCrossed",
	"telephone-portables": "Smartphone",
	"telephones-fixes": "Smartphone",
	televiseurs: "Tv",
	"tensiometres-pression-arterielle": "Stethoscope",
	"tenus-et-vetements-de-sport": "Shirt",
	"tetes-de-rechange": "ToyBrick",
	"tetines-pour-bebe": "Baby",
	"tetines-pour-biberons": "Baby",
	thermometres: "Stethoscope",
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
	vaisselles: "UtensilsCrossed",
	valises: "Backpack",
	"vehicules-pour-enfants": "ToyBrick",
	"velos-d-appartement": "Bike",
	"velos-et-accessoires": "Bike",
	ventilateurs: "AirVent",
	"vernis-a-ongles": "Palette",
	"verres-et-tasses": "UtensilsCrossed",
	"visage-pour-hommes": "User",
	"visseuses-electriques-et-visseuses-a-percussion": "Wrench",
	"vitamines-et-complements-alimentaires": "Pill",
	webcams: "Camera",
	"wireless-access-points": "Network",
	yaourtieres: "Utensils",
	"zone-de-la-bouche-et-des-levres": "Paintbrush",
};

const CATEGORY_FAMILY: Record<string, string> = {
	"acces-et-controles": "informatique",
	"accessoires-de-bain-pour-bebes": "bebe-enfants",
	"accessoires-de-camera-camescope": "photo-camera",
	"accessoires-de-console-de-jeux": "divers",
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
	agrafes: "bureau",
	agrafeuses: "bureau",
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
	arroseurs: "maison-jardin",
	aspirateurs: "petit-electromenager",
	"aspirateurs-balai": "petit-electromenager",
	"aspirateurs-de-table": "petit-electromenager",
	"aspirateurs-nasaux-pour-bebe": "bebe-enfants",
	assiettes: "cuisine",
	"autocuiseurs-pour-cuisiniere": "electromenager",
	bagages: "mode",
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
	batteries: "telephonie",
	batteurs: "petit-electromenager",
	"baumes-a-levres": "maquillage",
	"bavoirs-pour-bebes": "bebe-enfants",
	"bebe-enfants": "bebe-enfants",
	biberons: "bebe-enfants",
	"biberons-et-vaisselle-pour-bebes": "bebe-enfants",
	"blanchiment-des-dents": "sante-beaute",
	blenders: "petit-electromenager",
	"blocs-notes": "bureau",
	"boites-a-outils": "maison-jardin",
	"boites-hermetiques-alimentaires": "cuisine",
	"boitiers-d-equipement-reseau": "informatique",
	"boitiers-de-disques-de-stockage": "informatique",
	bouilloires: "petit-electromenager",
	bracelets: "mode",
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
	calculatrices: "bureau",
	"camera-lenses": "photo-camera",
	"camera-tripods": "photo-camera",
	"cameras-de-surveillance": "photo-camera",
	camescopes: "photo-camera",
	"capsules-et-dosettes-de-cafe": "petit-electromenager",
	"car-holder": "telephonie",
	"cartes-graphiques": "informatique",
	"cartes-memoires": "informatique",
	"cartes-mere": "informatique",
	"cartouches-de-toner": "informatique",
	casques: "image-et-son",
	casseroles: "cuisine",
	"casseroles-a-sauce": "cuisine",
	"cave-a-vin": "electromenager",
	"cellulite-et-vergetures": "sante-beaute",
	"centrifugeuses-et-presse-agrumes": "petit-electromenager",
	"chaises-de-camping": "maison-jardin",
	"chaises-hautes": "bebe-enfants",
	"chaises-restaurant": "maison-jardin",
	"changeurs-de-genre-de-cable": "informatique",
	chapeaux: "mode",
	"chargeurs-de-telephones-portables": "telephonie",
	"chauffage-a-gaz": "electromenager",
	"chauffage-refroidissement-et-qualite-de-l-air": "electromenager",
	chauffages: "electromenager",
	"chauffe-bain": "petit-electromenager",
	"chauffe-biberons": "bebe-enfants",
	chaussettes: "mode",
	chaussures: "mode",
	"chaussures-d-athletisme": "sport",
	"chaussures-de-sport-a-la-mode": "mode",
	"chemises-et-hauts": "mode",
	cheveux: "sante-beaute",
	"cheveux-hommes": "sante-beaute",
	"cheveux-pour-enfant": "sante-beaute",
	"ciseaux-a-bouts-ronds": "bureau",
	"claquettes-et-tongs": "mode",
	claviers: "informatique",
	"cle-usb": "informatique",
	"cles-a-fourche": "maison-jardin",
	climatiseurs: "electromenager",
	"cocotte-minute": "petit-electromenager",
	"coffres-forts": "maison-jardin",
	"coffrets-cadeaux-de-parfum": "sante-beaute",
	"coffrets-de-sciences-pour-enfant": "bebe-enfants",
	"coffrets-pour-femme": "sante-beaute",
	"coffrets-pour-les-bebes": "bebe-enfants",
	colliers: "mode",
	"colliers-harnais-et-laisses-pour-chiens-et-chats": "animaux",
	"colorations-cheveux": "sante-beaute",
	"compas-a-secteur": "bureau",
	composants: "informatique",
	"computer-backpack": "informatique",
	"computer-cases": "informatique",
	"computer-chargers": "informatique",
	congelateurs: "electromenager",
	"consoles-de-jeux": "divers",
	consommables: "informatique",
	cookware: "cuisine",
	corps: "sante-beaute",
	correcteurs: "maquillage",
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
	crepieres: "petit-electromenager",
	"cuiseur-a-vapeur": "petit-electromenager",
	"cuiseurs-a-oeufs": "petit-electromenager",
	"cuiseurs-a-riz": "petit-electromenager",
	cuisinieres: "electromenager",
	"decors-muraux": "maison-jardin",
	defroisseurs: "petit-electromenager",
	"demaquillant-et-nettoyant": "sante-beaute",
	"demaquillants-visage": "sante-beaute",
	"demaquillants-yeux": "sante-beaute",
	dentifrices: "sante-beaute",
	"dentifrices-dents": "sante-beaute",
	"deodorants-et-anti-transpirants": "sante-beaute",
	"deodorants-et-antitranspirants": "sante-beaute",
	"destructeur-de-papier": "bureau",
	detartrants: "maison-jardin",
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
	ecouteurs: "image-et-son",
	"enceintes-portables": "image-et-son",
	"ensemble-clavier-et-souris": "informatique",
	"ensembles-de-meubles-de-jardin": "maison-jardin",
	"ensembles-de-meubles-pour-enfants": "maison-jardin",
	epilateurs: "sante-beaute",
	eponges: "maison-jardin",
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
	eviers: "maison-jardin",
	"exfoliants-pour-le-visage": "sante-beaute",
	"faits-tout": "cuisine",
	fards: "maquillage",
	"fards-a-paupieres": "maquillage",
	fauteuils: "maison-jardin",
	"fauteuils-pour-enfants": "maison-jardin",
	"fer-a-repasser": "petit-electromenager",
	"fers-a-boucler": "petit-electromenager",
	"figurines-pour-enfants": "bebe-enfants",
	"films-protecteurs": "telephonie",
	"fixateur-de-maquillage": "maquillage",
	"flotteurs-de-plage-et-de-piscine": "maison-jardin",
	"fond-de-teint": "maquillage",
	"fontaine-eau-fraiche": "petit-electromenager",
	forets: "maison-jardin",
	fouets: "cuisine",
	"fournitures-de-bureau": "bureau",
	fours: "electromenager",
	friteuses: "petit-electromenager",
	"game-controllers": "divers",
	gamelles: "animaux",
	"gants-de-sport": "sport",
	gaufriers: "petit-electromenager",
	"gels-de-toilette-intime": "sante-beaute",
	"gels-dents-gencives": "sante-beaute",
	"gels-douche-bain": "sante-beaute",
	"gels-douches": "sante-beaute",
	"gels-lubrifiants-erotisme": "sante-beaute",
	"gels-nettoyants-visage": "sante-beaute",
	glacieres: "cuisine",
	"gommages-corporels": "sante-beaute",
	"gommages-pour-le-corps": "sante-beaute",
	"gommages-pour-le-visage": "sante-beaute",
	gourdes: "cuisine",
	"grill-panini": "petit-electromenager",
	"grille-pains": "petit-electromenager",
	"groupes-electrogenes": "electromenager",
	hachoirs: "petit-electromenager",
	halteres: "sport",
	"haut-parleurs": "image-et-son",
	"haut-parleurs-conférence": "image-et-son",
	hochets: "bebe-enfants",
	"home-cinema-systems": "image-et-son",
	"hottes-aspirantes": "electromenager",
	"hubs-et-switches": "informatique",
	"huiles-cheveux": "sante-beaute",
	"huiles-pour-le-corps": "sante-beaute",
	"image-et-son": "image-et-son",
	imprimantes: "informatique",
	"imprimantes-jets-d-encres": "informatique",
	"imprimantes-laser": "informatique",
	"imprimantes-pour-etiquettes": "informatique",
	informatique: "informatique",
	"instruments-de-mesure-de-la-distance": "maison-jardin",
	jeux: "bebe-enfants",
	"jeux-d-imitation": "bebe-enfants",
	"jeux-de-societe": "bebe-enfants",
	"jeux-videos": "divers",
	jouets: "bebe-enfants",
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
	lessives: "maison-jardin",
	lisseurs: "petit-electromenager",
	"litieres-et-effractions-pour-chiens-et-chats": "animaux",
	livres: "bureau",
	"livres-et-pages-a-colorier": "bureau",
	logiciels: "informatique",
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
	marmites: "cuisine",
	marqueurs: "bureau",
	"marteaux-rotatifs": "maison-jardin",
	mascaras: "maquillage",
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
	microphones: "image-et-son",
	mixeurs: "petit-electromenager",
	"mobilier-de-bureau": "maison-jardin",
	moniteurs: "informatique",
	"moniteurs-video-pour-bebe": "photo-camera",
	montres: "mode",
	"moules-a-gateaux": "cuisine",
	"moules-a-gaufres": "cuisine",
	"moulins-a-cafe": "petit-electromenager",
	"mousses-nettoyantes-pour-le-visage": "sante-beaute",
	nettoyant: "sante-beaute",
	"nettoyeur-haute-pression": "petit-electromenager",
	"nourriture-boissons-tabac": "image-et-son",
	"nourriture-pour-chiens-et-chats": "animaux",
	onduleurs: "informatique",
	ordinateurs: "informatique",
	"ordinateurs-de-bureau": "informatique",
	"ordinateurs-portables": "informatique",
	"organiseurs-de-bureau": "bureau",
	"outils-de-maquillage": "maquillage",
	"outils-de-soins-personnels": "sante-beaute",
	"outils-sans-fil": "maison-jardin",
	"palettes-de-fards-a-paupieres": "maquillage",
	pantalons: "mode",
	"papiers-imprimante": "informatique",
	"parasols-de-terrasse": "maison-jardin",
	parcs: "bebe-enfants",
	"parfums-beaute": "sante-beaute",
	"parfums-et-maquillage-pour-enfants": "sante-beaute",
	"parfums-pour-enfants": "sante-beaute",
	"parfums-pour-femme": "sante-beaute",
	"parfums-unisexes": "sante-beaute",
	"peignes-et-brosses-cheveux": "sante-beaute",
	"peintures-pour-loisir": "maison-jardin",
	"pellicules-polaroid": "photo-camera",
	peluches: "bebe-enfants",
	perceuses: "maison-jardin",
	"pese-personnes": "sante-beaute",
	"petites-pieces-et-boites-a-outils": "maison-jardin",
	"pieces-et-accessoires-d-equipements-audiovisuels": "image-et-son",
	"piles-domestiques": "informatique",
	"pinceaux-pour-maquillage-du-visage": "maquillage",
	pinces: "cuisine",
	"piscines-de-jeux-pour-enfants": "bebe-enfants",
	"piscines-hors-sol": "maison-jardin",
	"pistolets-a-peinture": "maison-jardin",
	"pistolets-eau-buses": "maison-jardin",
	"placards-et-armoires-de-chambre-a-coucher": "maison-jardin",
	"plaques-de-cuisson": "electromenager",
	platines: "image-et-son",
	plats: "cuisine",
	poeles: "cuisine",
	"pompes-a-eaux": "maison-jardin",
	"ponceuses-portatives": "maison-jardin",
	"portes-savon": "maison-jardin",
	"pots-rangement": "maison-jardin",
	poubelles: "maison-jardin",
	poudres: "maquillage",
	poupees: "bebe-enfants",
	"poussettes-pour-bebe": "bebe-enfants",
	powerbank: "telephonie",
	preservatifs: "sante-beaute",
	"presse-agrumes": "petit-electromenager",
	processeurs: "informatique",
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
	projecteurs: "image-et-son",
	"protection-contre-le-rayonnement-solaire": "sante-beaute",
	"protection-contre-le-rayonnement-solaire-pour-le-corps": "sante-beaute",
	"protection-solaire-cheveux": "sante-beaute",
	"protections-d-ecran-de-telephone-portable": "telephonie",
	"protections-pour-circuit": "informatique",
	"purificateurs-d-air-liquides": "petit-electromenager",
	puzzles: "bebe-enfants",
	"raccords-des-tuyaux-d-eau": "maison-jardin",
	"radiateur-bain-huile": "electromenager",
	"radiateurs-electriques": "electromenager",
	"radios-portables": "image-et-son",
	rasage: "sante-beaute",
	"rasoirs-et-tondeuses": "sante-beaute",
	"recepteurs-tv": "image-et-son",
	"recharges-d-encre-pour-imprimante": "informatique",
	"recipients-alimentaires-pour-enfants": "cuisine",
	refrigerateurs: "electromenager",
	"refroidissement-cpu": "informatique",
	"refroidissement-d-ordinateur": "informatique",
	"refroidissement-laptop": "informatique",
	relaxation: "sante-beaute",
	relieuses: "bureau",
	robes: "mode",
	robinets: "maison-jardin",
	"robinets-de-salle-de-bain": "maison-jardin",
	"robot-petrin": "petit-electromenager",
	"robots-aspirateurs": "petit-electromenager",
	"robots-multifonction": "petit-electromenager",
	"rouges-a-levres": "maquillage",
	routeurs: "informatique",
	"sac-a-dos-scolaire": "mode",
	"sacoches-ordinateurs-portables": "mode",
	"sacs-a-dos": "mode",
	"sacs-a-mains-et-sacs-en-bandouliere": "mode",
	"sante-beaute": "sante-beaute",
	"savons-liquides": "sante-beaute",
	"savons-solides": "sante-beaute",
	scanners: "informatique",
	"scies-sauteuses": "maison-jardin",
	scooters: "sport",
	"scooters-electriques": "sport",
	"seche-cheveux": "petit-electromenager",
	"seche-linges": "electromenager",
	"serums-capillaires-soins": "sante-beaute",
	"serums-visage": "sante-beaute",
	serveurs: "informatique",
	"serveurs-nas": "informatique",
	shampoings: "sante-beaute",
	"shampoings-cheveux": "sante-beaute",
	"shampoings-cheveux-beaute": "sante-beaute",
	"sieges-auto-bebe": "bebe-enfants",
	"sieges-de-toilette-pour-bébé": "bebe-enfants",
	"sieges-pour-jeux-videos": "divers",
	"smart-watches": "mode",
	smartphones: "telephonie",
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
	sorbetieres: "petit-electromenager",
	souris: "informatique",
	"sports-loisirs": "sport",
	"stations-d-accueil-ordinateurs": "informatique",
	stockages: "informatique",
	styling: "sante-beaute",
	"stylos-a-bille": "bureau",
	"stylos-feutres": "bureau",
	"stylos-fins": "bureau",
	supports: "informatique",
	"supports-d-ecrans": "informatique",
	"systemes-de-reliure-pour-maintenir-les-papiers-et-les-documents": "bureau",
	"systemes-de-surveillance": "informatique",
	"systemes-videophone": "maison-jardin",
	tableaux: "maison-jardin",
	"tableaux-blancs": "bureau",
	"tableaux-d-affichage-accessoires": "bureau",
	"tables-de-camping": "maison-jardin",
	"tables-de-repassage": "petit-electromenager",
	tablettes: "informatique",
	"tablettes-graphiques": "informatique",
	"tailles-haie-electriques": "maison-jardin",
	"tambours-d-imprimante": "informatique",
	"tamis-de-cuisine": "cuisine",
	"tapis-d-eveil-et-de-jeux-pour-bebes": "bebe-enfants",
	"tapis-de-course": "sport",
	"tapis-de-souris": "informatique",
	tasses: "cuisine",
	"telephone-portables": "telephonie",
	"telephones-fixes": "telephonie",
	televiseurs: "image-et-son",
	"tensiometres-pression-arterielle": "sante-beaute",
	"tenus-et-vetements-de-sport": "sport",
	"tetes-de-rechange": "bebe-enfants",
	"tetines-pour-bebe": "bebe-enfants",
	"tetines-pour-biberons": "bebe-enfants",
	thermometres: "sante-beaute",
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
	vaisselles: "cuisine",
	valises: "mode",
	"vehicules-pour-enfants": "bebe-enfants",
	"velos-d-appartement": "sport",
	"velos-et-accessoires": "sport",
	ventilateurs: "petit-electromenager",
	"vernis-a-ongles": "maquillage",
	"verres-et-tasses": "cuisine",
	"visage-pour-hommes": "sante-beaute",
	"visseuses-electriques-et-visseuses-a-percussion": "maison-jardin",
	"vitamines-et-complements-alimentaires": "sante-beaute",
	webcams: "informatique",
	"wireless-access-points": "informatique",
	yaourtieres: "petit-electromenager",
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
	{
		raw: ["596-smartphone-tunisie", "smartphones"],
		slug: "smartphones",
		label: "Smartphones",
		icon: "Smartphone",
	},
	{
		raw: ["301-pc-portable-tunisie", "PC Portable", "pc-portables"],
		slug: "pc-portables",
		label: "PC portables",
		icon: "Laptop",
	},
	{ raw: ["373-pc-de-bureau"], slug: "pc-de-bureau", label: "PC de bureau", icon: "Monitor" },
	{
		raw: ["667-ecran-pc-tunisie", "ecrans", "moniteurs"],
		slug: "ecrans",
		label: "Écrans",
		icon: "MonitorPlay",
	},
	{
		raw: ["338-casque-ecouteurs", "casques-ecouteurs", "casques", "ecouteurs"],
		slug: "casques-ecouteurs",
		label: "Casques & écouteurs",
		icon: "Headphones",
	},
	{ raw: ["334-souris-informatique", "souris"], slug: "souris", label: "Souris", icon: "Mouse" },
	{ raw: ["704-claviers", "claviers"], slug: "claviers", label: "Claviers", icon: "Keyboard" },
	{
		raw: ["457-climatiseur-tunisie-chaud-froid"],
		slug: "climatiseurs",
		label: "Climatiseurs",
		icon: "AirVent",
	},
	{
		raw: ["331-sac-a-dos-tunisie"],
		slug: "sacs-accessoires",
		label: "Sacs & accessoires",
		icon: "Backpack",
	},
] as const;

const categoryByRaw: Map<string, AnyCategoryDefinition> = new Map(
	CATEGORY_DEFINITIONS.flatMap((category) => category.raw.map((raw) => [raw, category] as const)),
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
	"#6347f5",
	"#ff4757",
	"#2ed573",
	"#1e90ff",
	"#ffa502",
	"#a55eea",
	"#ff6348",
	"#3742fa",
	"#7bed9f",
	"#70a1ff",
	"#ff6b81",
	"#f368e0",
];
function storeColor(store: string) {
	let hash = 0;
	for (let i = 0; i < store.length; i++) hash = (hash * 31 + store.charCodeAt(i)) | 0;
	return STORE_COLORS[Math.abs(hash) % STORE_COLORS.length];
}
function getStoreDetails(name: string) {
	const key = name === "Tunisianet" ? "Tunisianet" : name === "Spacenet" ? "Spacenet" : name;
	return (
		STORE_DETAILS[key] ?? {
			color: storeColor(name),
			delivery: "Voir les conditions de livraison",
			availability: "Disponibilité à confirmer",
		}
	);
}

const GENERIC_TOKENS = new Set([
	"pc",
	"portable",
	"ordinateur",
	"laptop",
	"tunisie",
	"de",
	"du",
	"la",
	"le",
	"les",
	"avec",
	"sans",
	"pour",
	"noir",
	"blanc",
	"silver",
	"gris",
	"blue",
	"bleu",
	"red",
	"rouge",
	"gaming",
	"gamer",
]);

const BRAND_NAMES = [
	"Spirit of Gamer",
	"Cooler Master",
	"Western Digital",
	"Hewlett Packard",
	"Apple",
	"Samsung",
	"Xiaomi",
	"Redmi",
	"Oppo",
	"Infinix",
	"Tecno",
	"Itel",
	"Honor",
	"Realme",
	"Nokia",
	"Motorola",
	"Huawei",
	"OnePlus",
	"Lenovo",
	"ThinkPad",
	"HP",
	"Dell",
	"Asus",
	"Acer",
	"MSI",
	"Gigabyte",
	"Logitech",
	"Redragon",
	"Razer",
	"SteelSeries",
	"HyperX",
	"Corsair",
	"Trust",
	"JBL",
	"Sony",
	"Philips",
	"LG",
	"TCL",
	"Hisense",
	"Haier",
	"Biolux",
	"Candy",
	"Beko",
	"Bosch",
	"Indesit",
	"Dahua",
	"Hikvision",
	"AOC",
	"ViewSonic",
	"Hama",
	"Rapoo",
	"Marvo",
	"Meetion",
	"Fantech",
	"Thermaltake",
	"Lexar",
	"Kingston",
	"Sandisk",
].sort((first, second) => second.length - first.length);

const BRAND_STOP_WORDS = new Set([
	"smartphone",
	"telephone",
	"téléphone",
	"pc",
	"ordinateur",
	"portable",
	"ecran",
	"écran",
	"moniteur",
	"casque",
	"ecouteur",
	"écouteur",
	"ecouteurs",
	"écouteurs",
	"souris",
	"clavier",
	"climatiseur",
	"sac",
	"housse",
	"filaire",
	"fil",
	"sans",
	"micro",
	"gamer",
	"gaming",
	"dos",
	"optique",
	"mecanique",
	"mécanique",
	"sans-fil",
	"avec",
	"pour",
	"usb",
	"rgb",
	"noir",
	"blanc",
	"bleu",
	"gris",
	"silver",
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

function validMerchantUrl(url: string) {
	try {
		const parsed = new URL(url);
		return parsed.protocol === "https:" || parsed.protocol === "http:";
	} catch {
		return false;
	}
}

function merchantPrice(value: number) {
	// All prices come from the primini feed and are already in DT
	// (millimes conversion applied at scrape time). Do NOT divide.
	return Number(value.toFixed(3));
}

function merchantOldPrice(value: number, price: number) {
	const normalized = merchantPrice(value);
	if (!Number.isFinite(normalized) || normalized < price || normalized > price * 3) return price;
	return normalized;
}

function inferBrand(name: string) {
	const normalized = simplify(name);
	const known = BRAND_NAMES.find((brand) => normalized.includes(simplify(brand)));
	if (known) return known === "Hewlett Packard" ? "HP" : known;

	const candidate = name
		.replace(/[|/()[\],:;+]/g, " ")
		.split(/\s+/)
		.map((word) => word.replace(/[^\p{L}\p{N}-]/gu, ""))
		.find((word) => {
			const token = simplify(word);
			return token.length > 2 && !BRAND_STOP_WORDS.has(token) && !/^\d/.test(token);
		});
	return candidate || "Autre marque";
}

function normalizeOffer(
	source: SourceOffer,
	productId: string,
): (StoreOffer & { similarity: number }) | null {
	const merchant = storeName(source);
	if (!merchant || !validMerchantUrl(source.url)) return null;
	const match = similarity(productId, offerSlug(source.url));
	if (match < 0.2) return null;

	const price = merchantPrice(source.price);
	if (!Number.isFinite(price) || price <= 0) return null;
	const details = getStoreDetails(merchant);
	return {
		store: merchant,
		price,
		oldPrice: merchantOldPrice(source.oldPrice, price),
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
	const rejected: SourceOffer[] = [];
	for (const rawOffer of group.flatMap((product) => product.offers ?? [])) {
		const offer = normalizeOffer(rawOffer, productId);
		if (!offer) {
			rejected.push(rawOffer);
			continue;
		}
		const current = bestByStore.get(offer.store);
		if (
			!current ||
			offer.similarity > current.similarity ||
			(offer.similarity === current.similarity && offer.price < current.price)
		) {
			bestByStore.set(offer.store, offer);
		}
	}
	// Fallback: if every offer was rejected by the URL-similarity guard
	// (merchant URLs often use their own naming), keep the cheapest one
	// so the product does not silently disappear from the catalog.
	if (bestByStore.size === 0 && rejected.length > 0) {
		const fallback = rejected.reduce((cheapest, offer) =>
			(offer.price ?? Infinity) < (cheapest.price ?? Infinity) ? offer : cheapest,
		);
		const normalized = normalizeOffer(fallback, productId);
		if (normalized) bestByStore.set(normalized.store, normalized);
	}
	return [...bestByStore.values()]
		.map(
			(offer): StoreOffer => ({
				store: offer.store,
				price: offer.price,
				oldPrice: offer.oldPrice,
				url: offer.url,
				color: offer.color,
				delivery: offer.delivery,
				availability: offer.availability,
				updatedAt: offer.updatedAt,
			}),
		)
		.sort((first, second) => first.price - second.price);
}

const groupedProducts = new Map<string, SourceProduct[]>();
for (const sourceProduct of sourceProducts) {
	const existing = groupedProducts.get(sourceProduct.id) ?? [];
	existing.push(sourceProduct);
	groupedProducts.set(sourceProduct.id, existing);
}

export const products: Product[] = [...groupedProducts.values()].flatMap((group): Product[] => {
	const source = group[0];
	const category = categoryFor(source.category);
	const offers = productOffers(group);
	if (!category || offers.length === 0) return [];
	const bestOffer = offers[0];
	const oldPrice = Math.max(bestOffer.price, bestOffer.oldPrice);
	// Only show a discount when it is backed by real price data:
	// oldPrice must actually be higher than the current price. The
	// discount coming from primini (sourceDiscount) compares against
	// aberrant reference prices and produces fake -99% badges, so we
	// ignore it and compute only from real offers.
	const computedDiscount =
		oldPrice > bestOffer.price ? Math.round(((oldPrice - bestOffer.price) / oldPrice) * 100) : 0;
	const discount = computedDiscount;
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
		description:
			offers.length > 1
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

const allDefinitions = [...CATEGORY_DEFINITIONS, ...[...generatedCategories.values()]];

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
	const storeProducts = products.filter((product) =>
		product.offers.some((offer) => offer.store === name),
	);
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

export function getCategory(slug?: string) {
	return categories.find((category) => category.slug === slug) ?? null;
}

export function getProduct(slug?: string) {
	if (!slug) return null;
	// Accept both legacy "prim-<id>-<slug>" URLs and the new clean
	// "<id>-<slug>" form (prim- prefix dropped from product ids).
	const clean = slug.replace(/^prim-/, "");
	return products.find((product) => product.id === clean || product.id === slug) ?? null;
}

export function relatedProducts(product: Product, limit = 4) {
	return products
		.filter(
			(candidate) => candidate.id !== product.id && candidate.categorySlug === product.categorySlug,
		)
		.slice(0, limit);
}

// ---- Phase 2B: category/listing server queries ----

export function toSummary(product: Product): ProductSummary {
	return {
		id: product.id,
		name: product.name,
		image: product.image,
		category: product.category,
		categorySlug: product.categorySlug,
		price: product.price,
		oldPrice: product.oldPrice,
		discount: product.discount,
		stores: product.stores,
		badge: product.badge,
		tag: product.tag,
	};
}

// Paginated products for one category (server-side slicing — the browser
// only ever receives the current page's cards).
export function getCategoryProducts({
	slug,
	page = 1,
	pageSize = 36,
	sort = "name",
}: {
	slug: string;
	page?: number;
	pageSize?: number;
	sort?: string;
}): PaginatedProducts {
	const all = products.filter((product) => product.categorySlug === slug);
	const total = all.length;
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	const safePage = Math.min(Math.max(1, page), totalPages);
	const sorted = sortProductsServer(all, sort);
	const start = (safePage - 1) * pageSize;
	return {
		products: sorted.slice(start, start + pageSize).map(toSummary),
		total,
		page: safePage,
		pageSize,
		totalPages,
	};
}

// All products of a family (group cards + first page).
export function getFamilyProducts({
	slug,
	page = 1,
	pageSize = 36,
	sort = "name",
}: {
	slug: string;
	page?: number;
	pageSize?: number;
	sort?: string;
}): PaginatedProducts {
	const groups = FAMILY_GROUPS[slug] ?? [];
	const groupSlugs = new Set(groups.flatMap((group) => group.categories.map((c) => c.slug)));
	const all = products.filter((product) => groupSlugs.has(product.categorySlug));
	const total = all.length;
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	const safePage = Math.min(Math.max(1, page), totalPages);
	const sorted = sortProductsServer(all, sort);
	const start = (safePage - 1) * pageSize;
	return {
		products: sorted.slice(start, start + pageSize).map(toSummary),
		total,
		page: safePage,
		pageSize,
		totalPages,
	};
}

function sortProductsServer(items: Product[], sort: string) {
	const result = [...items];
	if (sort === "price-asc") return result.sort((a, b) => a.price - b.price);
	if (sort === "price-desc") return result.sort((a, b) => b.price - a.price);
	if (sort === "discount") return result.sort((a, b) => b.discount - a.discount);
	return result.sort((a, b) => a.name.localeCompare(b.name, "fr"));
}

// Family metadata for the categories index page (no products needed).
export function getCategoryStats() {
	const families = getFamilies();
	return {
		families,
		totalProducts: products.length,
		totalCategories: categories.length,
		multiStore: products
			.filter((product) => product.stores > 1)
			.slice(0, 4)
			.map(toSummary),
	};
}

// ---- Phase 2C: homepage server data ----

// Homepage featured families (order matters — matches the current UI).
const HOMEPAGE_FAMILIES = [
	"informatique",
	"telephonie",
	"electromenager",
	"petit-electromenager",
	"cuisine",
	"sante-beaute",
	"maison-jardin",
	"bebe-enfants",
];

export function getHomepageData() {
	const families = getFamilies();
	const catalogCategories = categories;
	// Rails: for each featured family, rank products like the old client logic.
	const categoryRank = (slug: string) => {
		if (slug === "smartphones" || slug === "telephone-portables") return 0;
		if (slug === "ordinateurs-portables" || slug === "ordinateurs-de-bureau") return 1;
		if (slug === "tablettes" || slug === "moniteurs") return 2;
		if (
			[
				"peluches",
				"jouets-pour-bebes",
				"jouets-d-apprentissage",
				"hochets",
				"biberons",
				"tires-lait",
				"couches-jetables-pour-bebe",
				"poussettes-pour-bebe",
			].includes(slug)
		)
			return 1;
		return 3;
	};

	const familyRails = HOMEPAGE_FAMILIES.map((slug) => {
		const groups = FAMILY_GROUPS[slug] ?? [];
		const groupSlugs = new Set(groups.flatMap((group) => group.categories.map((c) => c.slug)));
		if (groupSlugs.size === 0) {
			for (const category of catalogCategories) {
				if (category.family === slug) groupSlugs.add(category.slug);
			}
		}
		const railProducts = products
			.filter((product) => groupSlugs.has(product.categorySlug))
			.sort((a, b) => {
				const diff = categoryRank(a.categorySlug) - categoryRank(b.categorySlug);
				if (diff !== 0) return diff;
				return b.price - a.price;
			})
			.slice(0, 12)
			.map(toSummary);
		return { slug, label: FAMILY_LABELS[slug] ?? slug, products: railProducts };
	}).filter((rail) => rail.products.length > 0);

	// Offer filters: derived from the featured families' categories (same as before).
	const familySlugs = new Set(HOMEPAGE_FAMILIES);
	const offerFilters = [
		"Tout",
		...new Set(catalogCategories.filter((c) => familySlugs.has(c.family)).map((c) => c.label)),
	];

	// Offers by category: keep the client filter working WITHOUT the full catalog.
	const promoted = [...products].sort((a, b) => (b.discount || 0) - (a.discount || 0));
	const offersByCategory: Record<string, ProductSummary[]> = {};
	for (const label of offerFilters) {
		const pool = label === "Tout" ? promoted : promoted.filter((p) => p.category === label);
		offersByCategory[label] = pool.slice(0, 12).map(toSummary);
	}

	// Popular rail: multi-store products.
	const popular = products
		.filter((product) => product.stores > 1)
		.slice(0, 12)
		.map(toSummary);

	// Max discount for the hero badge.
	const maximumDiscount = Math.max(0, ...products.map((product) => product.discount));

	return {
		families,
		familyRails,
		offerFilters,
		offersByCategory,
		popular,
		maximumDiscount,
	};
}

// ---- Phase 2C/2D: search ----

// Safe search normalization: lowercase + strip accents + collapse whitespace.
export function normalizeSearch(value: string): string {
	return value
		.trim()
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/\s+/g, " ")
		.slice(0, 80);
}

function searchMatches(product: Product, normalized: string): boolean {
	const haystack = normalizeSearch(`${product.name} ${product.category}`);
	return haystack.includes(normalized);
}

// Shared search core: rank matches (starts-with first, then contains),
// then slice. Used by both autocomplete and the results page.
export function searchProducts(query: string, limit = 8) {
	const normalized = normalizeSearch(query);
	if (normalized.length < 2) return [] as ProductSummary[];
	const starts = products.filter((product) => product.name.toLowerCase().startsWith(normalized));
	const contains = products.filter(
		(product) =>
			!product.name.toLowerCase().startsWith(normalized) && searchMatches(product, normalized),
	);
	return starts.concat(contains).slice(0, limit).map(toSummary);
}

// Paginated search for the /recherche results page (server-side slicing).
export function searchProductsPaginated({
	query,
	page = 1,
	pageSize = 36,
	sort = "relevance",
}: {
	query: string;
	page?: number;
	pageSize?: number;
	sort?: string;
}): PaginatedProducts {
	const normalized = normalizeSearch(query);
	if (normalized.length < 2) {
		return { products: [], total: 0, page: 1, pageSize, totalPages: 1 };
	}
	const starts = products.filter((product) => product.name.toLowerCase().startsWith(normalized));
	const contains = products.filter(
		(product) =>
			!product.name.toLowerCase().startsWith(normalized) && searchMatches(product, normalized),
	);
	let all = starts.concat(contains);
	if (sort === "price-asc") all = [...all].sort((a, b) => a.price - b.price);
	else if (sort === "price-desc") all = [...all].sort((a, b) => b.price - a.price);
	else if (sort === "discount") all = [...all].sort((a, b) => b.discount - a.discount);

	const total = all.length;
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	const safePage = Math.min(Math.max(1, page), totalPages);
	const start = (safePage - 1) * pageSize;
	return {
		products: all.slice(start, start + pageSize).map(toSummary),
		total,
		page: safePage,
		pageSize,
		totalPages,
	};
}

// Phase 2E: resolve a bounded set of product ids to lightweight summaries.
// Preserves requested order, ignores missing ids, caps at 100.
export function getProductsByIds(ids: string[]): ProductSummary[] {
	const unique = [...new Set(ids)].slice(0, 100);
	const byId = new Map(products.map((product) => [product.id, product]));
	return unique
		.map((id) => byId.get(id))
		.filter((product): product is Product => Boolean(product))
		.map(toSummary);
}
