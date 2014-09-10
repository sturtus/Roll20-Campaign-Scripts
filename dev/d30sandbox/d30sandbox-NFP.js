//  -----------------------------------   Natural Features & Phenomena (by Terrain Type) ----------------------------------- 

d30sandbox.nfp = {table: "NFP", tableName: "NATURAL FEATURES & PHENOMENA BY TERRAIN TYPE", results: [
	{ 
		terrain: "Hills", 
		chance: 6,
		results: [
			"bluff",
			"butte",
			"cave, fracture*",     // 50% chance this feature houses a lair 
			"cave, lava tube*",     // 50% chance this feature houses a lair 
			"cave, limestone*",     // 50% chance this feature houses a lair 
			"cave, talus*",     // 50% chance this feature houses a lair 
			"crag",
			"cuesta (w/ cliff)",
			"dell",
			"draw",
			"escarpment",
			"esker",
			"glen",
			"gulch",
			"hillock/knoll",
			"lake",
			"lava dome",
			"lava lake",
			"limestone pavement",
			"mesa",
			"plateau",
			"pond",
			"rock outcropping",
			"rock shelter*",     // 50% chance this feature houses a lair 
			"spring, artesian",
			"spring, hot",
			"strath",
			"terrace",
			"tor",
			"well"
		]
	},

	{
		terrain: "Mountains", 
		chance: 10, 
		results: [
			"bluff",
			"cave, fracture*",     // 50% chance this feature houses a lair 
			"cave, lava tube*",     // 50% chance this feature houses a lair 
			"cave, limestone*",     // 50% chance this feature houses a lair 
			"cave, talus*",     // 50% chance this feature houses a lair 
			"cliff",
			"crag",
			"crater lake",
			"dry lake",
			"fluvial terrace",
			"geyser",
			"gorge",
			"gulch",
			"hoodoo (tent rock)",
			"kettle (lake)",
			"lava dome",
			"lava lake",
			"ledge",
			"mountain pass",
			"natural arch",
			"pseudocrater",
			"ravine",
			"ridge",
			"rock shelter*",     // 50% chance this feature houses a lair 
			"spring",
			"summit",
			"valley",
			"volcanic cone",
			"volcanic crater",
			"volcanic vent",
		]
	},



	{
		terrain: "Forest", 
		chance: 8, 
		results: [
			"brook",
			"cave, fracture*",     // 50% chance this feature houses a lair 
			"cave, limestone*",     // 50% chance this feature houses a lair 
			"cave, talus*",     // 50% chance this feature houses a lair 
			"clearing (natural)",
			"cloud forest (fog)",
			"copse",
			"crooked trees",
			"dead forest",
			"den tree*",     // 50% chance this feature houses a lair 
			"forked trees",
			"gully",
			"grotto",
			"heavy canopy",
			"heavy underbrush",
			"lake",
			"primeval forest",
			"pond",
			"rock outcropping",
			"rock shelter*",     // 50% chance this feature houses a lair 
			"rot, widespread",
			"sinkhole",
			"spring, artesian",
			"spring, hot",
			"stream",
			"sylvan grove",
			"sylvan forest",
			"thicket",
			"well",
			"wolf tree*"
		]
	},

	{
		terrain: "Plains", 
		chance: 4, 
		results: [
			"aquifer",
			"butte",
			"cave, fracture*",     // 50% chance this feature houses a lair 
			"cave, limestone*",     // 50% chance this feature houses a lair 
			"crater lake",
			"dry lake",
			"escarpment",
			"esker",
			"gulch",
			"heavy shrubs",
			"heavy underbrush",
			"hillock/knoll",
			"lake",
			"lava dome",
			"limestone pavement",
			"mesa",
			"mud pits",
			"plateau",
			"pond",
			"ridge",
			"riparian zone",
			"rock outcropping",
			"rock shelter",
			"sinkhole",
			"strath",
			"tar pit",
			"thicket",
			"tor",
			"vernal pool",
			"well"
		]
	},

	{
	terrain: "Swamp",
	chance: 17,
		results: [
			"crooked trees",
			"cypress dome",
			"dam, natural",
			"heavy algae",
			"heavy canopy",
			"heavy mossing",
			"heavy muck",
			"heavy pathogens, air",
			"heavy pathogens, surface",
			"heavy pathogens, water",
			"heavy plants, ermergent",
			"heavy plants, floating",
			"heavy plants, submerged",
			"island, small",
			"island, medium",
			"island, large",
			"islands, small (scatters)",
			"natural gas vent†",     // highly flammable; susceptible to combustion in presence of open flame
			"marsh gas†",     // highly flammable; susceptible to combustion in presence of open flame
			"mud flat",
			"quicksand",
			"rocky area",
			"rot, widespread",
			"shallow water",
			"slough/channel",
			"spring, acidic hot",
			"tar pit",
			"turbid water",
			"volcanic vent",
			"volcanic vent w/ tuff ring"
		]
	},

	{
		terrain: "Desert",
		chance: 4,
		resultes: [
			"aquifer",
			"bedrock outcrop",
			"bluff",
			"butte",
			"cacti",
			"cave, limestone*",     // 50% chance this feature houses a lair 
			"cave, talus*",     // 50% chance this feature houses a lair 
			"chasm",
			"crag",
			"crater lake, dry",
			"cuesta (w/cliff)",
			"dunes",
			"escarpment",
			"eskar",
			"gulch",
			"hoodoo (tent rock)",
			"mesa",
			"limestone pavement",
			"quicksand",
			"oasis",
			"pediment",
			"playa",
			"rock shelter",
			"sailing stones",
			"sinkhole",
			"shrubs",
			"terrace",
			"trees",
			"valley",
			"well, dry"
		]
	},

	{
		terrain: "Coast",
		chance: 9,
		results: [
			"barachois",
			"bay",
			"bight",
			"blowout",
			"bog",
			"cave, sea*",     // 50% chance this feature houses a lair 
			"coastal dunes",
			"cove",
			"estuary",
			"firth",
			"fjord",
			"kelp bed (subtidal)",
			"lagoon",
			"lake/loch",
			"marine meadow",
			"mangrove swamp",
			"mud flat",
			"quicksand",
			"rocky shore",
			"sand beach",
			"sand flat",
			"salt flat",
			"salt marsh",
			"salt meadow",
			"salting",
			"sea loch (inlet)",
			"seabed (subtidal)",
			"shingle beach",
			"pebble beach",
			"tide pool"
		]
	},
]};
