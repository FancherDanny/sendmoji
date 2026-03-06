import { useState, useEffect, useRef } from "react"
import { db } from "./firebase"
import { ref, set, update, onValue, push } from "firebase/database"

const TOPICS = {
  "🎬 Movies": [
    "Titanic", "The Lion King", "Frozen", "Jurassic Park", "Home Alone",
    "The Godfather", "Toy Story", "Jaws", "Avatar", "Grease",
    "Rocky", "Ghostbusters", "Shrek", "Inception", "Gladiator",
    "Forrest Gump", "The Matrix", "Goodfellas", "Clueless", "Top Gun"
  ],
  "🎵 Songs": [
    "Bohemian Rhapsody", "Thriller", "Imagine", "Shallow", "Happy",
    "Rolling in the Deep", "Smells Like Teen Spirit", "Baby One More Time",
    "Lose Yourself", "Party in the USA", "Wonderwall", "Shape of You",
    "Old Town Road", "Hotline Bling", "Uptown Funk", "Let It Go",
    "Sweet Home Alabama", "Livin on a Prayer", "Mr Brightside", "Toxic"
  ],
  "📚 Books": [
    "Harry Potter", "The Great Gatsby", "Moby Dick", "Frankenstein",
    "The Hobbit", "Pride and Prejudice", "The Jungle Book", "Dracula",
    "Little Women", "The Odyssey", "Animal Farm", "Lord of the Flies",
    "Charlotte's Web", "The Alchemist", "Sherlock Holmes", "Robinson Crusoe",
    "Alice in Wonderland", "The Hunger Games", "Gone with the Wind", "Dune"
  ],
  "🌍 Places": [
    "Paris", "New York City", "The Great Wall", "Antarctica", "Las Vegas",
    "The Amazon", "Mount Everest", "Hawaii", "Hollywood", "The Sahara",
    "Tokyo", "The Grand Canyon", "Rome", "The North Pole", "Niagara Falls",
    "The Great Barrier Reef", "Times Square", "Machu Picchu", "Dubai", "Venice"
  ],
  "🍕 Food": [
    "Pizza", "Sushi", "Tacos", "Hamburger", "Ice Cream",
    "Spaghetti", "Hot Dog", "Fried Chicken", "Pancakes", "Lobster",
    "Nachos", "Ramen", "Cheesecake", "Donuts", "Guacamole",
    "Waffles", "Burrito", "Popcorn", "Mac and Cheese", "Croissant"
  ]
}

const EMOJI_LIST = [
  // Nature & Weather
  { emoji: "🌊", keywords: ["water", "wave", "ocean", "sea", "surf", "flood", "tide", "blue", "beach"] },
  { emoji: "🧊", keywords: ["ice", "cold", "freeze", "iceberg", "frozen", "chill", "arctic", "cube"] },
  { emoji: "🔥", keywords: ["fire", "hot", "burn", "flame", "heat", "blaze", "inferno", "campfire"] },
  { emoji: "⛈️", keywords: ["storm", "thunder", "lightning", "rain", "cloud", "weather", "dark"] },
  { emoji: "🌪️", keywords: ["tornado", "wind", "storm", "spin", "twister", "cyclone", "disaster"] },
  { emoji: "🌈", keywords: ["rainbow", "color", "sky", "bright", "spectrum", "pride", "colorful"] },
  { emoji: "☀️", keywords: ["sun", "sunny", "hot", "bright", "day", "summer", "warm", "shine"] },
  { emoji: "🌙", keywords: ["moon", "night", "dark", "sky", "lunar", "crescent", "sleep", "dream"] },
  { emoji: "⭐", keywords: ["star", "night", "sky", "shine", "famous", "celebrity", "wish"] },
  { emoji: "🌋", keywords: ["volcano", "lava", "fire", "eruption", "mountain", "explosion", "hawaii"] },
  { emoji: "🏜️", keywords: ["desert", "sand", "sahara", "hot", "dry", "camel", "cactus", "empty"] },
  { emoji: "🌲", keywords: ["tree", "forest", "nature", "green", "wood", "jungle", "pine", "tall"] },
  { emoji: "🌺", keywords: ["flower", "bloom", "hawaii", "tropical", "pretty", "garden", "pink"] },
  { emoji: "🍄", keywords: ["mushroom", "fungi", "forest", "mario", "super", "toadstool", "red"] },
  { emoji: "🌍", keywords: ["world", "earth", "globe", "planet", "travel", "international", "global"] },
  { emoji: "🏔️", keywords: ["mountain", "everest", "peak", "snow", "climb", "high", "alps", "rocky"] },
  { emoji: "🏝️", keywords: ["island", "beach", "tropical", "hawaii", "paradise", "palm", "castaway"] },
  { emoji: "🌅", keywords: ["sunset", "sunrise", "horizon", "sky", "ocean", "dawn", "dusk", "morning"] },
  { emoji: "❄️", keywords: ["snow", "cold", "winter", "freeze", "flake", "ice", "frozen", "blizzard"] },
  { emoji: "🌬️", keywords: ["wind", "cold", "blow", "air", "freeze", "breeze", "gust", "breath"] },
  { emoji: "🌵", keywords: ["cactus", "desert", "mexico", "dry", "prickly", "west", "spike", "green"] },
  { emoji: "🦋", keywords: ["butterfly", "fly", "pretty", "transform", "change", "wings", "colorful"] },
  { emoji: "🐚", keywords: ["shell", "ocean", "beach", "sea", "spiral", "conch", "collect"] },
  { emoji: "🌿", keywords: ["leaf", "plant", "green", "nature", "herb", "grow", "garden", "fresh"] },
  { emoji: "🍀", keywords: ["clover", "luck", "lucky", "green", "four", "irish", "shamrock"] },
  { emoji: "🌸", keywords: ["blossom", "cherry", "pink", "japan", "spring", "flower", "pretty"] },
  { emoji: "🌻", keywords: ["sunflower", "yellow", "sun", "flower", "summer", "bright", "field"] },
  { emoji: "🍁", keywords: ["maple", "leaf", "canada", "fall", "autumn", "red", "orange", "change"] },
  { emoji: "🌾", keywords: ["wheat", "grain", "farm", "harvest", "field", "gold", "bread", "grass"] },
  { emoji: "🪨", keywords: ["rock", "stone", "hard", "heavy", "solid", "mountain", "throw"] },
  { emoji: "🌑", keywords: ["dark", "night", "moon", "black", "shadow", "eclipse", "space"] },
  { emoji: "💧", keywords: ["drop", "water", "rain", "tear", "drip", "blue", "wet", "cry"] },
  { emoji: "🌊", keywords: ["wave", "ocean", "surf", "sea", "water", "beach", "tide"] },
  { emoji: "⚡", keywords: ["lightning", "electric", "power", "fast", "bolt", "thunder", "energy", "zeus"] },
  { emoji: "🌤️", keywords: ["partly cloudy", "sun", "cloud", "weather", "day", "sky", "nice"] },
  { emoji: "🌧️", keywords: ["rain", "cloud", "wet", "storm", "pour", "umbrella", "grey"] },
  { emoji: "🌨️", keywords: ["snow", "cloud", "winter", "cold", "blizzard", "flake", "white"] },
  { emoji: "🌫️", keywords: ["fog", "mist", "cloud", "grey", "hazy", "mysterious", "smoke"] },

  // Animals
  { emoji: "🦁", keywords: ["lion", "king", "animal", "pride", "jungle", "roar", "africa", "mane"] },
  { emoji: "🐋", keywords: ["whale", "ocean", "moby", "sea", "big", "blue", "swim", "giant"] },
  { emoji: "🦈", keywords: ["shark", "ocean", "danger", "jaw", "swim", "teeth", "attack", "jaws"] },
  { emoji: "🐘", keywords: ["elephant", "big", "africa", "trunk", "memory", "jungle", "grey", "large"] },
  { emoji: "🦊", keywords: ["fox", "clever", "orange", "sly", "wild", "cunning", "forest", "tail"] },
  { emoji: "🐺", keywords: ["wolf", "howl", "pack", "wild", "forest", "danger", "grey", "moon"] },
  { emoji: "🦅", keywords: ["eagle", "bird", "fly", "america", "freedom", "soar", "bald", "hunt"] },
  { emoji: "🐉", keywords: ["dragon", "fire", "fantasy", "myth", "fly", "beast", "magic", "china"] },
  { emoji: "🦄", keywords: ["unicorn", "magic", "fantasy", "horn", "rainbow", "myth", "horse", "rare"] },
  { emoji: "🐊", keywords: ["crocodile", "alligator", "swamp", "snap", "danger", "reptile", "teeth"] },
  { emoji: "🦀", keywords: ["crab", "ocean", "beach", "sideways", "shell", "sea", "red", "claws"] },
  { emoji: "🐢", keywords: ["turtle", "slow", "shell", "ocean", "sea", "old", "green", "ninja"] },
  { emoji: "🦜", keywords: ["parrot", "bird", "talk", "colorful", "pirate", "tropical", "repeat"] },
  { emoji: "🐸", keywords: ["frog", "green", "jump", "pond", "swamp", "croak", "lily", "rain"] },
  { emoji: "🦓", keywords: ["zebra", "stripes", "africa", "black", "white", "horse", "pattern"] },
  { emoji: "🐆", keywords: ["leopard", "cheetah", "spots", "fast", "africa", "jungle", "cat", "wild"] },
  { emoji: "🦒", keywords: ["giraffe", "tall", "neck", "africa", "spots", "long", "savanna"] },
  { emoji: "🦏", keywords: ["rhino", "horn", "africa", "tough", "heavy", "grey", "charge"] },
  { emoji: "🦛", keywords: ["hippo", "water", "africa", "big", "heavy", "mouth", "river"] },
  { emoji: "🐪", keywords: ["camel", "desert", "hump", "sand", "egypt", "travel", "dry"] },
  { emoji: "🦘", keywords: ["kangaroo", "australia", "jump", "pouch", "baby", "hop", "outback"] },
  { emoji: "🐻", keywords: ["bear", "forest", "honey", "big", "brown", "hibernate", "grizzly"] },
  { emoji: "🐼", keywords: ["panda", "china", "bamboo", "black", "white", "cute", "rare", "bear"] },
  { emoji: "🐨", keywords: ["koala", "australia", "tree", "sleep", "cute", "grey", "eucalyptus"] },
  { emoji: "🐯", keywords: ["tiger", "stripes", "jungle", "hunt", "orange", "cat", "asia", "fierce"] },
  { emoji: "🦝", keywords: ["raccoon", "bandit", "trash", "night", "mask", "ring", "tail", "clever"] },
  { emoji: "🦔", keywords: ["hedgehog", "spikes", "roll", "cute", "small", "sonic", "forest"] },
  { emoji: "🦦", keywords: ["otter", "river", "swim", "cute", "hold", "hands", "sea", "float"] },
  { emoji: "🐧", keywords: ["penguin", "ice", "antarctic", "black", "white", "swim", "cold", "bird"] },
  { emoji: "🦆", keywords: ["duck", "pond", "quack", "swim", "yellow", "feather", "bird", "water"] },
  { emoji: "🦉", keywords: ["owl", "wise", "night", "hunt", "hoot", "forest", "bird", "moon"] },
  { emoji: "🦚", keywords: ["peacock", "feathers", "colorful", "display", "proud", "beautiful", "bird"] },
  { emoji: "🦩", keywords: ["flamingo", "pink", "stand", "one leg", "tropical", "bird", "elegant"] },
  { emoji: "🐊", keywords: ["alligator", "swamp", "snap", "green", "reptile", "florida", "teeth"] },
  { emoji: "🐍", keywords: ["snake", "slither", "poison", "coil", "dangerous", "reptile", "hiss"] },
  { emoji: "🦎", keywords: ["lizard", "reptile", "green", "tongue", "gecko", "chameleon", "crawl"] },
  { emoji: "🐙", keywords: ["octopus", "tentacle", "ocean", "eight", "arms", "ink", "sea", "smart"] },
  { emoji: "🦑", keywords: ["squid", "ocean", "tentacle", "ink", "sea", "deep", "calamari"] },
  { emoji: "🦞", keywords: ["lobster", "seafood", "ocean", "red", "fancy", "claws", "boil"] },
  { emoji: "🐠", keywords: ["fish", "tropical", "color", "swim", "ocean", "clown", "nemo"] },
  { emoji: "🐬", keywords: ["dolphin", "ocean", "smart", "jump", "swim", "friendly", "navy"] },
  { emoji: "🦭", keywords: ["seal", "arctic", "swim", "bark", "fish", "flippers", "beach"] },
  { emoji: "🐇", keywords: ["rabbit", "hop", "easter", "carrot", "white", "ears", "fast", "bunny"] },
  { emoji: "🐿️", keywords: ["squirrel", "nuts", "tree", "acorn", "bushy", "tail", "forest", "store"] },
  { emoji: "🦫", keywords: ["beaver", "dam", "wood", "canada", "teeth", "build", "river", "tail"] },
  { emoji: "🐓", keywords: ["rooster", "chicken", "farm", "crow", "morning", "wake", "feather"] },
  { emoji: "🦃", keywords: ["turkey", "thanksgiving", "farm", "feather", "gobble", "bird"] },
  { emoji: "🐝", keywords: ["bee", "honey", "sting", "yellow", "black", "hive", "flower", "buzz"] },
  { emoji: "🦋", keywords: ["butterfly", "wings", "colorful", "flutter", "flower", "transform"] },
  { emoji: "🐛", keywords: ["caterpillar", "worm", "green", "leaf", "slow", "transform", "bug"] },
  { emoji: "🕷️", keywords: ["spider", "web", "creepy", "bug", "scary", "spiderman", "eight legs"] },
  { emoji: "🦟", keywords: ["mosquito", "bite", "buzz", "blood", "annoying", "summer", "itch"] },
  { emoji: "🐘", keywords: ["elephant", "trunk", "big", "memory", "grey", "africa", "tusk", "ivory"] },

  // People & Emotions
  { emoji: "👸", keywords: ["queen", "princess", "girl", "woman", "lady", "royal", "crown", "fairy tale"] },
  { emoji: "🤴", keywords: ["king", "prince", "man", "guy", "boy", "royal", "crown", "charming"] },
  { emoji: "🧙", keywords: ["wizard", "magic", "harry", "witch", "spell", "wand", "old", "sorcerer"] },
  { emoji: "🦸", keywords: ["hero", "super", "power", "cape", "save", "strong", "superman", "marvel"] },
  { emoji: "🦹", keywords: ["villain", "evil", "bad", "super", "dark", "enemy", "sinister"] },
  { emoji: "🧛", keywords: ["vampire", "dracula", "blood", "dark", "night", "bite", "cape", "immortal"] },
  { emoji: "🧟", keywords: ["zombie", "dead", "brain", "horror", "walk", "undead", "apocalypse"] },
  { emoji: "👨‍🚀", keywords: ["astronaut", "space", "moon", "rocket", "nasa", "gravity", "orbit"] },
  { emoji: "👮", keywords: ["police", "cop", "law", "badge", "arrest", "crime", "officer"] },
  { emoji: "💃", keywords: ["dance", "woman", "salsa", "move", "music", "spin", "tango", "flamenco"] },
  { emoji: "🕺", keywords: ["dance", "man", "groove", "move", "music", "disco", "saturday", "night"] },
  { emoji: "😢", keywords: ["sad", "cry", "tears", "emotional", "upset", "weep", "heartbreak"] },
  { emoji: "😂", keywords: ["laugh", "funny", "joke", "happy", "lol", "hilarious", "comedy"] },
  { emoji: "😱", keywords: ["scared", "shock", "horror", "scream", "fear", "panic", "surprised"] },
  { emoji: "😍", keywords: ["love", "heart eyes", "crush", "adore", "beautiful", "smitten"] },
  { emoji: "🤔", keywords: ["think", "wonder", "question", "hmm", "ponder", "curious", "idea"] },
  { emoji: "😴", keywords: ["sleep", "tired", "dream", "night", "rest", "snore", "bed", "lazy"] },
  { emoji: "👀", keywords: ["look", "see", "watch", "eyes", "stare", "spy", "observe", "peek"] },
  { emoji: "💪", keywords: ["strong", "muscle", "power", "flex", "gym", "force", "workout"] },
  { emoji: "🙌", keywords: ["celebrate", "cheer", "praise", "win", "clap", "yay", "high five"] },
  { emoji: "🤡", keywords: ["clown", "circus", "funny", "joke", "silly", "makeup", "scary"] },
  { emoji: "🥷", keywords: ["ninja", "stealth", "japan", "sword", "shadow", "secret", "fighter"] },
  { emoji: "🧜", keywords: ["mermaid", "ocean", "myth", "fish", "tail", "sea", "ariel", "fantasy"] },
  { emoji: "🧝", keywords: ["elf", "fantasy", "magic", "forest", "legolas", "archer", "tolkien"] },
  { emoji: "🧚", keywords: ["fairy", "magic", "wings", "tiny", "tinkerbell", "dust", "fantasy"] },
  { emoji: "🤠", keywords: ["cowboy", "west", "hat", "ranch", "rodeo", "lasso", "horse", "texas"] },
  { emoji: "🥸", keywords: ["disguise", "glasses", "nose", "spy", "undercover", "secret", "fake"] },
  { emoji: "🤯", keywords: ["mind blown", "explode", "shocked", "amazing", "unbelievable", "wow"] },
  { emoji: "🥳", keywords: ["party", "celebrate", "birthday", "fun", "hat", "cheer", "confetti"] },
  { emoji: "😎", keywords: ["cool", "sunglasses", "awesome", "chill", "confident", "swagger"] },
  { emoji: "🤫", keywords: ["shush", "quiet", "secret", "whisper", "silent", "hush", "ssh"] },
  { emoji: "🤥", keywords: ["lie", "pinocchio", "nose", "fake", "dishonest", "fib", "lying"] },
  { emoji: "🫡", keywords: ["salute", "respect", "yes sir", "military", "honor", "soldier"] },
  { emoji: "👻", keywords: ["ghost", "haunted", "spooky", "halloween", "spirit", "scary", "boo"] },
  { emoji: "💀", keywords: ["death", "dead", "skull", "die", "bones", "scary", "halloween", "crossbones"] },
  { emoji: "👽", keywords: ["alien", "space", "ufo", "green", "extraterrestrial", "weird", "martian"] },
  { emoji: "🤖", keywords: ["robot", "machine", "ai", "tech", "future", "metal", "beep", "android"] },
  { emoji: "👹", keywords: ["demon", "monster", "evil", "red", "horns", "oni", "japan", "scary"] },
  { emoji: "🎃", keywords: ["pumpkin", "halloween", "jack", "lantern", "october", "carve", "orange"] },

  // Food & Drink
  { emoji: "🍕", keywords: ["pizza", "food", "italian", "cheese", "slice", "pepperoni", "dough"] },
  { emoji: "🍣", keywords: ["sushi", "japanese", "fish", "rice", "roll", "raw", "salmon", "tuna"] },
  { emoji: "🌮", keywords: ["taco", "mexican", "food", "wrap", "shell", "salsa", "tuesday"] },
  { emoji: "🍔", keywords: ["burger", "hamburger", "food", "beef", "grill", "fast food", "bun"] },
  { emoji: "🍦", keywords: ["ice cream", "cold", "sweet", "dessert", "cone", "summer", "vanilla"] },
  { emoji: "🍩", keywords: ["donut", "sweet", "dessert", "ring", "glaze", "dough", "sprinkles"] },
  { emoji: "🎂", keywords: ["cake", "birthday", "sweet", "celebrate", "candle", "party", "slice"] },
  { emoji: "🍫", keywords: ["chocolate", "sweet", "candy", "brown", "dessert", "cocoa", "bar"] },
  { emoji: "🍿", keywords: ["popcorn", "movie", "cinema", "snack", "butter", "corn", "salt"] },
  { emoji: "☕", keywords: ["coffee", "hot", "drink", "morning", "cafe", "espresso", "latte"] },
  { emoji: "🍷", keywords: ["wine", "drink", "red", "grape", "fancy", "glass", "vineyard"] },
  { emoji: "🥂", keywords: ["champagne", "celebrate", "toast", "party", "wedding", "new year", "clink"] },
  { emoji: "🍺", keywords: ["beer", "drink", "pub", "cold", "brew", "glass", "foam", "bar"] },
  { emoji: "🥑", keywords: ["avocado", "guacamole", "green", "food", "healthy", "toast", "millennial"] },
  { emoji: "🍜", keywords: ["ramen", "noodles", "soup", "japanese", "bowl", "broth", "slurp"] },
  { emoji: "🥞", keywords: ["pancakes", "breakfast", "syrup", "stack", "morning", "flat", "fluffy"] },
  { emoji: "🌭", keywords: ["hot dog", "sausage", "mustard", "baseball", "grill", "frank", "ketchup"] },
  { emoji: "🧇", keywords: ["waffle", "breakfast", "syrup", "grid", "sweet", "crispy", "belgian"] },
  { emoji: "🥐", keywords: ["croissant", "french", "bread", "breakfast", "butter", "pastry", "paris"] },
  { emoji: "🍝", keywords: ["spaghetti", "pasta", "italian", "noodles", "sauce", "meatball", "bolognese"] },
  { emoji: "🌯", keywords: ["burrito", "wrap", "mexican", "food", "roll", "tortilla", "bean"] },
  { emoji: "🧀", keywords: ["cheese", "dairy", "yellow", "pizza", "mouse", "swiss", "cheddar"] },
  { emoji: "🍓", keywords: ["strawberry", "red", "fruit", "sweet", "berry", "fresh", "summer"] },
  { emoji: "🍌", keywords: ["banana", "yellow", "fruit", "monkey", "slip", "tropical", "peel"] },
  { emoji: "🍎", keywords: ["apple", "red", "fruit", "teacher", "newton", "snow white", "juice"] },
  { emoji: "🍉", keywords: ["watermelon", "summer", "green", "red", "seed", "fruit", "sweet", "big"] },
  { emoji: "🍇", keywords: ["grapes", "wine", "purple", "fruit", "bunch", "vineyard", "sweet"] },
  { emoji: "🍊", keywords: ["orange", "citrus", "fruit", "vitamin", "juice", "peel", "round"] },
  { emoji: "🍋", keywords: ["lemon", "sour", "yellow", "citrus", "juice", "bitter", "tart"] },
  { emoji: "🥭", keywords: ["mango", "tropical", "fruit", "orange", "sweet", "juice", "india"] },
  { emoji: "🍍", keywords: ["pineapple", "tropical", "fruit", "hawaii", "spongebob", "sweet", "spiky"] },
  { emoji: "🥝", keywords: ["kiwi", "green", "fruit", "new zealand", "tiny", "fuzzy", "sweet"] },
  { emoji: "🍑", keywords: ["peach", "fruit", "orange", "soft", "fuzzy", "sweet", "georgia"] },
  { emoji: "🍒", keywords: ["cherry", "red", "fruit", "sweet", "top", "pair", "small"] },
  { emoji: "🫐", keywords: ["blueberry", "blue", "fruit", "small", "muffin", "antioxidant", "sweet"] },
  { emoji: "🥦", keywords: ["broccoli", "green", "vegetable", "healthy", "tree", "vitamin", "chef"] },
  { emoji: "🌽", keywords: ["corn", "yellow", "vegetable", "farm", "pop", "summer", "barbecue"] },
  { emoji: "🍄", keywords: ["mushroom", "fungi", "forest", "mario", "pizza", "soup", "earthy"] },
  { emoji: "🧄", keywords: ["garlic", "cooking", "italian", "vampire", "smell", "flavor", "herb"] },
  { emoji: "🧅", keywords: ["onion", "cooking", "cry", "layers", "flavor", "peel", "ogre"] },
  { emoji: "🥕", keywords: ["carrot", "orange", "vegetable", "rabbit", "healthy", "crunch", "bugs bunny"] },
  { emoji: "🥜", keywords: ["peanut", "nut", "butter", "allergy", "snack", "shell", "elephant"] },
  { emoji: "🍞", keywords: ["bread", "toast", "bake", "wheat", "loaf", "butter", "sandwich"] },
  { emoji: "🧁", keywords: ["cupcake", "sweet", "frosting", "birthday", "bake", "small", "cake"] },
  { emoji: "🍰", keywords: ["cake", "slice", "sweet", "dessert", "strawberry", "layer", "birthday"] },
  { emoji: "🍭", keywords: ["lollipop", "candy", "sweet", "swirl", "stick", "colorful", "sugar"] },
  { emoji: "🍬", keywords: ["candy", "sweet", "wrapper", "sugar", "halloween", "treat", "colorful"] },
  { emoji: "🍯", keywords: ["honey", "bee", "sweet", "jar", "gold", "bear", "sticky"] },
  { emoji: "🧃", keywords: ["juice", "box", "drink", "straw", "fruit", "kids", "pack"] },
  { emoji: "🥤", keywords: ["soda", "cup", "drink", "straw", "fast food", "cola", "fizzy"] },
  { emoji: "🧋", keywords: ["boba", "bubble tea", "taiwan", "pearls", "milk tea", "drink", "tapioca"] },
  { emoji: "🍵", keywords: ["tea", "hot", "drink", "green", "cup", "calm", "japan", "herbal"] },
  { emoji: "🥛", keywords: ["milk", "white", "drink", "dairy", "cow", "calcium", "glass"] },
  { emoji: "🍶", keywords: ["sake", "japan", "rice wine", "hot", "drink", "asian", "bottle"] },
  { emoji: "🥃", keywords: ["whiskey", "drink", "glass", "scotch", "bourbon", "ice", "aged"] },

  // Places & Travel
  { emoji: "🗼", keywords: ["paris", "eiffel", "tower", "france", "romantic", "tall", "iron"] },
  { emoji: "🗽", keywords: ["new york", "statue", "liberty", "america", "nyc", "freedom", "green"] },
  { emoji: "🏰", keywords: ["castle", "kingdom", "royal", "fairy tale", "medieval", "tower", "moat"] },
  { emoji: "🎡", keywords: ["ferris wheel", "carnival", "fair", "ride", "fun", "park", "london eye"] },
  { emoji: "🎢", keywords: ["roller coaster", "ride", "fast", "fun", "theme park", "scary", "drop"] },
  { emoji: "🛕", keywords: ["temple", "india", "religion", "ancient", "worship", "asia", "hindu"] },
  { emoji: "⛩️", keywords: ["shrine", "japan", "tokyo", "gate", "red", "torii", "shinto"] },
  { emoji: "🗿", keywords: ["moai", "easter island", "statue", "stone", "ancient", "mystery", "head"] },
  { emoji: "🏟️", keywords: ["stadium", "arena", "sports", "crowd", "game", "concert", "colosseum"] },
  { emoji: "🌉", keywords: ["bridge", "night", "city", "golden gate", "river", "lights", "san francisco"] },
  { emoji: "🏙️", keywords: ["city", "skyline", "buildings", "urban", "night", "downtown", "metropolis"] },
  { emoji: "✈️", keywords: ["plane", "fly", "travel", "airport", "trip", "jet", "vacation"] },
  { emoji: "🚀", keywords: ["rocket", "space", "launch", "nasa", "moon", "fast", "blast", "spacex"] },
  { emoji: "🛸", keywords: ["ufo", "alien", "space", "fly", "mystery", "extraterrestrial", "area 51"] },
  { emoji: "⛵", keywords: ["sailboat", "ocean", "wind", "water", "sail", "boat", "cruise"] },
  { emoji: "🚂", keywords: ["train", "rail", "steam", "travel", "fast", "locomotive", "track"] },
  { emoji: "🚁", keywords: ["helicopter", "fly", "rotor", "blade", "rescue", "military", "hover"] },
  { emoji: "🛶", keywords: ["canoe", "paddle", "river", "kayak", "water", "boat", "outdoors"] },
  { emoji: "🏄", keywords: ["surf", "wave", "ocean", "beach", "board", "ride", "hawaii", "cool"] },
  { emoji: "🤿", keywords: ["diving", "scuba", "ocean", "mask", "underwater", "explore", "reef"] },
  { emoji: "🎿", keywords: ["ski", "snow", "mountain", "winter", "slope", "alps", "fast", "cold"] },
  { emoji: "🏕️", keywords: ["camping", "tent", "fire", "outdoor", "nature", "forest", "stars", "hike"] },
  { emoji: "🗺️", keywords: ["map", "treasure", "travel", "explore", "journey", "navigate", "world"] },
  { emoji: "🧭", keywords: ["compass", "navigate", "direction", "north", "explore", "guide", "lost"] },
  { emoji: "🚗", keywords: ["car", "drive", "road", "fast", "vehicle", "travel", "auto"] },
  { emoji: "🚢", keywords: ["ship", "boat", "cruise", "vessel", "titanic", "ocean liner", "sail", "sea"] },
  { emoji: "⚓", keywords: ["anchor", "ship", "boat", "sea", "navy", "port", "sailor", "dock"] },
  { emoji: "🏴‍☠️", keywords: ["pirate", "flag", "skull", "ship", "treasure", "sea", "jolly roger", "hook"] },
  { emoji: "🌁", keywords: ["fog", "bridge", "city", "san francisco", "golden gate", "mist", "grey"] },
  { emoji: "🏖️", keywords: ["beach", "sand", "sun", "ocean", "summer", "vacation", "waves", "relax"] },
  { emoji: "🏔️", keywords: ["mountain", "snow", "peak", "climb", "high", "rocky", "hike", "altitude"] },
  { emoji: "🌃", keywords: ["night", "city", "stars", "dark", "lights", "skyline", "moon", "urban"] },
  { emoji: "🎠", keywords: ["carousel", "fun", "ride", "park", "horse", "spin", "fair", "children"] },

  // Objects & Symbols
  { emoji: "💎", keywords: ["diamond", "jewel", "necklace", "gem", "ring", "sparkle", "precious", "shine"] },
  { emoji: "👑", keywords: ["crown", "king", "queen", "royal", "winner", "champion", "gold"] },
  { emoji: "🗡️", keywords: ["sword", "fight", "knight", "battle", "weapon", "sharp", "duel", "excalibur"] },
  { emoji: "🛡️", keywords: ["shield", "protect", "knight", "defense", "armor", "guard", "block"] },
  { emoji: "🔮", keywords: ["crystal ball", "magic", "future", "predict", "witch", "fortune", "see"] },
  { emoji: "💣", keywords: ["bomb", "explode", "danger", "blast", "tick", "destroy", "countdown"] },
  { emoji: "🔑", keywords: ["key", "lock", "open", "secret", "door", "unlock", "access"] },
  { emoji: "📚", keywords: ["book", "read", "library", "school", "study", "learn", "knowledge"] },
  { emoji: "🎭", keywords: ["drama", "theatre", "act", "play", "mask", "performance", "stage"] },
  { emoji: "🎬", keywords: ["movie", "film", "cinema", "action", "director", "cut", "scene", "clapboard"] },
  { emoji: "🎵", keywords: ["music", "note", "song", "melody", "tune", "sing", "sound"] },
  { emoji: "🎸", keywords: ["guitar", "music", "rock", "band", "string", "electric", "strum"] },
  { emoji: "🎻", keywords: ["violin", "music", "orchestra", "strings", "bow", "classical", "concert"] },
  { emoji: "🥁", keywords: ["drum", "music", "beat", "rhythm", "band", "percussion", "rock"] },
  { emoji: "🎺", keywords: ["trumpet", "music", "jazz", "blow", "brass", "band", "jazz"] },
  { emoji: "🎹", keywords: ["piano", "music", "keys", "classical", "keyboard", "play", "concert"] },
  { emoji: "🎷", keywords: ["saxophone", "jazz", "music", "blow", "cool", "blues", "band"] },
  { emoji: "🪗", keywords: ["accordion", "french", "music", "squeeze", "folk", "polka", "paris"] },
  { emoji: "🏆", keywords: ["trophy", "win", "champion", "gold", "prize", "award", "best", "winner"] },
  { emoji: "🥇", keywords: ["gold", "first", "win", "medal", "champion", "best", "number one", "olympic"] },
  { emoji: "💰", keywords: ["money", "rich", "cash", "gold", "wealth", "dollar", "bag", "greedy"] },
  { emoji: "💊", keywords: ["pill", "medicine", "drug", "health", "sick", "tablet", "pharmacy"] },
  { emoji: "⚗️", keywords: ["science", "lab", "chemistry", "experiment", "potion", "flask", "beaker"] },
  { emoji: "🔭", keywords: ["telescope", "space", "stars", "astronomy", "look", "far", "galaxy"] },
  { emoji: "🧲", keywords: ["magnet", "attract", "pull", "force", "metal", "stick", "north south"] },
  { emoji: "💡", keywords: ["idea", "light", "bright", "invention", "think", "bulb", "eureka"] },
  { emoji: "📱", keywords: ["phone", "mobile", "call", "text", "app", "screen", "iphone"] },
  { emoji: "🖥️", keywords: ["computer", "screen", "tech", "digital", "work", "monitor", "pc"] },
  { emoji: "🎮", keywords: ["game", "video game", "controller", "play", "fun", "console", "ps5", "xbox"] },
  { emoji: "🧪", keywords: ["test tube", "science", "chemistry", "lab", "experiment", "liquid", "research"] },
  { emoji: "🔬", keywords: ["microscope", "science", "tiny", "lab", "biology", "cell", "research"] },
  { emoji: "🧬", keywords: ["dna", "genetics", "science", "biology", "helix", "code", "life"] },
  { emoji: "🛸", keywords: ["ufo", "alien", "fly", "space", "abduct", "mystery", "roswell"] },
  { emoji: "📡", keywords: ["satellite", "signal", "broadcast", "antenna", "space", "receive", "dish"] },
  { emoji: "🔦", keywords: ["flashlight", "light", "dark", "beam", "torch", "explore", "search"] },
  { emoji: "🕯️", keywords: ["candle", "light", "flame", "dark", "romantic", "glow", "wax", "birthday"] },
  { emoji: "🪄", keywords: ["magic wand", "trick", "wizard", "spell", "poof", "fantasy", "abracadabra"] },
  { emoji: "🎩", keywords: ["top hat", "magic", "fancy", "gentleman", "pull rabbit", "hat", "trick"] },
  { emoji: "🪃", keywords: ["boomerang", "australia", "throw", "return", "curved", "outback"] },
  { emoji: "🏹", keywords: ["arrow", "bow", "shoot", "aim", "hunt", "target", "archery", "cupid"] },
  { emoji: "⛏️", keywords: ["pickaxe", "mine", "dig", "gold", "mountain", "work", "minecraft"] },
  { emoji: "🔧", keywords: ["wrench", "fix", "tool", "mechanic", "repair", "bolt", "engineer"] },
  { emoji: "⚙️", keywords: ["gear", "machine", "settings", "cog", "mechanism", "factory", "work"] },
  { emoji: "🧱", keywords: ["brick", "wall", "build", "lego", "construction", "red", "block"] },
  { emoji: "🪞", keywords: ["mirror", "reflect", "vanity", "look", "snow white", "glass", "selfie"] },
  { emoji: "🚪", keywords: ["door", "entrance", "exit", "open", "knock", "close", "opportunity"] },
  { emoji: "📜", keywords: ["scroll", "map", "old", "document", "ancient", "letter", "parchment"] },
  { emoji: "🗞️", keywords: ["newspaper", "news", "print", "read", "headline", "press", "reporter"] },
  { emoji: "📰", keywords: ["newspaper", "news", "headline", "read", "daily", "press", "print"] },
  { emoji: "📷", keywords: ["camera", "photo", "picture", "shoot", "snap", "lens", "photography"] },
  { emoji: "🎥", keywords: ["camera", "movie", "film", "record", "video", "director", "shoot"] },
  { emoji: "📺", keywords: ["tv", "television", "watch", "show", "screen", "remote", "channel"] },
  { emoji: "🎙️", keywords: ["microphone", "sing", "record", "podcast", "radio", "voice", "speak"] },
  { emoji: "🎚️", keywords: ["slider", "mix", "music", "studio", "level", "adjust", "sound"] },
  { emoji: "🧸", keywords: ["teddy bear", "toy", "soft", "cute", "child", "hug", "stuffed", "comfort"] },
  { emoji: "🎁", keywords: ["gift", "present", "wrap", "birthday", "surprise", "box", "ribbon"] },
  { emoji: "🎉", keywords: ["party", "celebrate", "fun", "confetti", "birthday", "cheer", "pop"] },
  { emoji: "🎊", keywords: ["confetti", "party", "celebrate", "pop", "colorful", "new year", "cheer"] },
  { emoji: "🎈", keywords: ["balloon", "party", "float", "red", "celebrate", "birthday", "air"] },
  { emoji: "🎏", keywords: ["streamer", "colorful", "celebrate", "japan", "fish", "flag", "wind"] },
  { emoji: "🧨", keywords: ["firecracker", "explode", "chinese new year", "loud", "red", "bang"] },
  { emoji: "✨", keywords: ["sparkle", "magic", "shine", "glitter", "star", "special", "fairy"] },
  { emoji: "🎯", keywords: ["target", "aim", "goal", "bullseye", "hit", "focus", "darts", "precise"] },
  { emoji: "🧩", keywords: ["puzzle", "piece", "solve", "mystery", "fit", "game", "jigsaw"] },
  { emoji: "♟️", keywords: ["chess", "strategy", "game", "king", "queen", "pawn", "think", "checkmate"] },
  { emoji: "🎲", keywords: ["dice", "random", "game", "luck", "roll", "chance", "board game"] },
  { emoji: "🃏", keywords: ["card", "joker", "game", "magic", "trick", "wild", "poker", "play"] },
  { emoji: "🀄", keywords: ["mahjong", "china", "tile", "game", "dragon", "bamboo", "chinese"] },
  { emoji: "🎴", keywords: ["flower card", "japan", "game", "hanafuda", "card", "floral"] },
  { emoji: "🧧", keywords: ["red envelope", "chinese new year", "money", "gift", "lucky", "red"] },

  // Ships, Transport & Adventure
  { emoji: "🚢", keywords: ["ship", "boat", "cruise", "vessel", "titanic", "ocean", "sail"] },
  { emoji: "⚓", keywords: ["anchor", "ship", "sea", "navy", "port", "sailor", "weight"] },
  { emoji: "🛟", keywords: ["lifebuoy", "rescue", "save", "float", "ring", "safety", "ocean"] },
  { emoji: "🧭", keywords: ["compass", "navigate", "north", "direction", "explore", "lost"] },

  // Horror & Dark
  { emoji: "🕷️", keywords: ["spider", "web", "creepy", "bug", "scary", "spiderman", "arachnid"] },
  { emoji: "🦇", keywords: ["bat", "night", "dracula", "vampire", "dark", "cave", "halloween", "fly"] },
  { emoji: "🪦", keywords: ["grave", "death", "buried", "tombstone", "cemetery", "rip", "ghost"] },
  { emoji: "🔪", keywords: ["knife", "cut", "sharp", "horror", "cook", "weapon", "blade"] },
  { emoji: "☠️", keywords: ["skull", "crossbones", "pirate", "poison", "death", "danger", "dead"] },

  // Misc & Fun
  { emoji: "🎪", keywords: ["circus", "fun", "show", "entertainment", "tent", "clown", "acrobat"] },
  { emoji: "🧳", keywords: ["luggage", "travel", "trip", "bag", "suitcase", "pack", "vacation"] },
  { emoji: "❤️", keywords: ["love", "heart", "romance", "valentines", "care", "red", "passion"] },
  { emoji: "💔", keywords: ["heartbreak", "sad", "loss", "broken", "hurt", "split", "end"] },
  { emoji: "💫", keywords: ["dizzy", "stars", "floating", "dream", "magic", "sparkle", "spin"] },
  { emoji: "🌟", keywords: ["star", "glow", "famous", "shine", "bright", "celebrity", "special"] },
  { emoji: "💥", keywords: ["explosion", "bang", "pow", "comic", "crash", "impact", "boom"] },
  { emoji: "💨", keywords: ["wind", "fast", "blow", "air", "gone", "speed", "dash", "ghost"] },
  { emoji: "💦", keywords: ["sweat", "water", "splash", "wet", "drop", "swim", "rain"] },
  { emoji: "🌀", keywords: ["spiral", "cyclone", "dizzy", "spin", "tornado", "swirl", "hypnotic"] },
  { emoji: "🔴", keywords: ["red", "circle", "stop", "danger", "alert", "button", "dot"] },
  { emoji: "🟡", keywords: ["yellow", "circle", "caution", "sun", "gold", "dot", "warning"] },
  { emoji: "🟢", keywords: ["green", "circle", "go", "safe", "nature", "dot", "button"] },
  { emoji: "⬛", keywords: ["black", "square", "dark", "night", "block", "void", "solid"] },
  { emoji: "⬜", keywords: ["white", "square", "blank", "empty", "clean", "snow", "pure"] },
  { emoji: "🏳️", keywords: ["white flag", "surrender", "peace", "give up", "truce"] },
  { emoji: "🚩", keywords: ["red flag", "warning", "danger", "mark", "signal", "alert"] },
  { emoji: "🏁", keywords: ["checkered flag", "finish", "race", "win", "end", "formula one", "done"] },
{ emoji: "🎌", keywords: ["japan", "flag", "crossed", "country", "asian", "tokyo", "red"] },
    // Communication & Gestures
  { emoji: "🏠", keywords: ["house", "home", "building", "live", "inside", "shelter", "roof", "family"] },
  { emoji: "🏡", keywords: ["house", "home", "garden", "cottage", "suburb", "cozy", "family", "yard"] },
  { emoji: "👍", keywords: ["yes", "good", "approve", "agree", "like", "thumbs up", "ok", "correct"] },
  { emoji: "👎", keywords: ["no", "bad", "disagree", "dislike", "thumbs down", "wrong", "reject", "boo"] },
  { emoji: "✅", keywords: ["yes", "check", "correct", "done", "complete", "right", "confirm", "true"] },
  { emoji: "❌", keywords: ["no", "wrong", "cancel", "false", "x", "stop", "delete", "incorrect", "not"] },
  { emoji: "⬆️", keywords: ["up", "above", "rise", "increase", "north", "higher", "top", "climb"] },
  { emoji: "⬇️", keywords: ["down", "below", "fall", "decrease", "south", "lower", "bottom", "drop"] },
  { emoji: "➡️", keywords: ["right", "next", "forward", "east", "go", "direction", "arrow", "continue"] },
  { emoji: "⬅️", keywords: ["left", "back", "west", "return", "arrow", "direction", "previous", "undo"] },
  { emoji: "💬", keywords: ["talk", "speak", "say", "chat", "word", "message", "conversation", "text"] },
  { emoji: "🗣️", keywords: ["speak", "talk", "loud", "voice", "announce", "shout", "say", "person"] },
  { emoji: "👋", keywords: ["wave", "hello", "goodbye", "hi", "bye", "greet", "hand"] },
  { emoji: "🤝", keywords: ["handshake", "deal", "agree", "meet", "partner", "shake", "business"] },
  { emoji: "🙏", keywords: ["pray", "please", "thank", "hope", "wish", "beg", "grateful", "namaste"] },
  { emoji: "😡", keywords: ["angry", "mad", "rage", "furious", "red", "upset", "anger", "hostile"] },
  { emoji: "😤", keywords: ["frustrated", "annoyed", "huff", "steam", "proud", "determined", "nose"] },
  { emoji: "😮", keywords: ["surprised", "shocked", "wow", "gasp", "open mouth", "amazed", "oh"] },
  { emoji: "🤐", keywords: ["zip", "silent", "secret", "quiet", "mouth shut", "shush", "no talking"] },
  { emoji: "😴", keywords: ["sleep", "tired", "dream", "night", "rest", "snore", "bed", "lazy", "boring"] },
  { emoji: "🔊", keywords: ["loud", "sound", "volume", "speaker", "noise", "hear", "audio", "music"] },
  { emoji: "🔇", keywords: ["mute", "silent", "quiet", "no sound", "off", "volume", "shush"] },
  { emoji: "⏫", keywords: ["up", "fast forward", "increase", "rise", "level up", "higher", "boost"] },
  { emoji: "⏬", keywords: ["down", "decrease", "drop", "lower", "fall", "sink", "reduce"] },
  { emoji: "🔁", keywords: ["repeat", "loop", "again", "cycle", "redo", "replay", "circular"] },
  { emoji: "⏹️", keywords: ["stop", "end", "halt", "finish", "square", "cancel", "cease"] },
  { emoji: "▶️", keywords: ["play", "start", "go", "begin", "forward", "video", "run", "launch"] },
  { emoji: "⏸️", keywords: ["pause", "wait", "stop", "hold", "break", "freeze", "rest"] },
  { emoji: "🆕", keywords: ["new", "fresh", "latest", "recent", "update", "novel", "modern"] },
  { emoji: "🆓", keywords: ["free", "no cost", "open", "liberty", "available", "gratis"] },
  { emoji: "🔝", keywords: ["top", "best", "up", "highest", "number one", "above", "peak"] },
  { emoji: "💯", keywords: ["perfect", "100", "yes", "correct", "excellent", "full", "complete", "real"] },
  { emoji: "🚫", keywords: ["no", "not", "banned", "forbidden", "stop", "cancel", "prohibited", "never"] },
  { emoji: "⛔", keywords: ["stop", "no", "forbidden", "blocked", "cancel", "do not", "halt", "red"] },
  { emoji: "🆗", keywords: ["ok", "okay", "fine", "agree", "yes", "accepted", "alright"] },
  { emoji: "🔃", keywords: ["refresh", "reload", "repeat", "cycle", "rotate", "sync", "redo"] },
  { emoji: "↩️", keywords: ["back", "return", "undo", "reply", "go back", "reverse", "left"] },
  { emoji: "🏘️", keywords: ["neighborhood", "houses", "village", "suburb", "town", "community", "homes"] },
  { emoji: "🏗️", keywords: ["construction", "build", "crane", "work", "scaffold", "new", "develop"] },
  { emoji: "🏢", keywords: ["office", "building", "work", "city", "corporate", "business", "tall"] },
  { emoji: "🏦", keywords: ["bank", "money", "finance", "save", "rich", "vault", "institution"] },
]

const RESET_MESSAGES = [
  "Bail on the crew? Really?",
  "Your team needs you... but ok?",
  "Running away? 👀",
  "You sure? They were SO close!",
  "Quitter alert! You sure?",
  "Ghost your team? Bold move.",
  "The emojis will miss you 😢",
  "Starting over? Coward. (just kidding) Sure?",
]

const TEAM_COLORS = {
  "Team 1": "#0066ff",
  "Team 2": "#ff6600",
  "Team 3": "#00aa44",
  "unassigned": "#999"
}

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

function getRandomTopic(category) {
  const list = TOPICS[category]
  return list[Math.floor(Math.random() * list.length)]
}

// Given players object and current round, assign roles within each team
// Odd rounds: first joined = clue, second joined = guesser. Even rounds: swap.
function assignRoles(players, round) {
  const teams = {}
  Object.entries(players).forEach(([name, info]) => {
    if (!info.team || info.team === "unassigned") return
    if (!teams[info.team]) teams[info.team] = []
    teams[info.team].push(name)
  })
  const roles = {}
  Object.entries(teams).forEach(([team, members]) => {
    members.forEach((name, idx) => {
      const isEvenRound = round % 2 === 0
      const isClue = isEvenRound ? idx !== 0 : idx === 0
      roles[name] = isClue ? "clue" : "guesser"
    })
  })
  return roles
}

function Logo({ onTap }) {
  return (
    <div onClick={onTap} style={{ cursor: "pointer", userSelect: "none", margin: "0 0 8px", display: "flex", alignItems: "center", gap: "8px" }}>
      <img src="/logo.png" alt="Sendmoji" style={{ height: "48px", width: "auto" }} />
    </div>
  )
}

export default function App() {
  const [nickname, setNickname] = useState("")
  const [screen, setScreen] = useState("home")
  const [gameMode, setGameMode] = useState("sameroom")
  const [rounds, setRounds] = useState(3)
  const [currentRound, setCurrentRound] = useState(1)
  const [scores, setScores] = useState({ "Team 1": 0, "Team 2": 0, "Team 3": 0 })
  const [joinCode, setJoinCode] = useState("")
  const [role, setRole] = useState("")
  const [team, setTeam] = useState("")
  const [isHost, setIsHost] = useState(false)
  const [roomCode, setRoomCode] = useState("")
  const [search, setSearch] = useState("")
  const [sentEmojis, setSentEmojis] = useState([])
  const [timer, setTimer] = useState(60)
  const [timerActive, setTimerActive] = useState(false)
  const [countdown, setCountdown] = useState(null)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [resetMessage, setResetMessage] = useState("")
  const [category, setCategory] = useState("")
  const [currentTopic, setCurrentTopic] = useState("")
  const [players, setPlayers] = useState({})
  const [receivedEmojis, setReceivedEmojis] = useState([])
  const [guess, setGuess] = useState("")
  const [wrongGuesses, setWrongGuesses] = useState([])
  const [correct, setCorrect] = useState(false)
  const [guesserTimer, setGuesserTimer] = useState(60)
  const [guesserActive, setGuesserActive] = useState(false)
  const [teammate, setTeammate] = useState("")

  const searchRef = useRef(null)
  const screenRef = useRef(screen)
  useEffect(() => { screenRef.current = screen }, [screen])
  const countdownWords = ["Ready", "Set", "GO!"]
  const teamColor = TEAM_COLORS[team] || "#999"
  const [codeCopied, setCodeCopied] = useState(false)


  // Firebase room listener
  useEffect(() => {
    if (!roomCode) return
    const roomRef = ref(db, `rooms/${roomCode}`)
    const unsub = onValue(roomRef, (snapshot) => {
      const data = snapshot.val()
      if (!data) return

      setPlayers(data.players || {})

      // Sync emojis to guesser in real time
      if (data.emojis) {
        setReceivedEmojis(Object.values(data.emojis))
      } else {
        setReceivedEmojis([])
      }

      // Host ended game — send everyone home
      if (data.status === "ended") {
        setNickname(""); setTeam(""); setScreen("home"); setGameMode("sameroom")
        setRounds(3); setCurrentRound(1); setScores({ "Team 1": 0, "Team 2": 0, "Team 3": 0 })
        setJoinCode(""); setSearch(""); setSentEmojis([]); setTimer(60)
        setTimerActive(false); setCountdown(null); setReceivedEmojis([])
        setGuess(""); setWrongGuesses([]); setCorrect(false)
        setGuesserTimer(60); setGuesserActive(false)
        setCategory(""); setCurrentTopic(""); setRoomCode(""); setRole("")
        setIsHost(false); setPlayers({}); setTeammate("")
      }
      if (data.status !== "nextround") {
        if (data.wrongGuesses) {
          setWrongGuesses(data.wrongGuesses)
        } else {
          setWrongGuesses([])
        }
      }
      // Countdown triggered by host
      if (data.status === "countdown") {
        setCountdown(0)
        let index = 0
        const interval = setInterval(() => {
          index += 1
          if (index >= countdownWords.length) {
            clearInterval(interval)
            setCountdown(null)
            setTimerActive(true)
            setGuesserActive(true)
            setTimeout(() => searchRef.current?.focus(), 100)
          } else {
            setCountdown(index)
          }
        }, 800)
      }

      // Round end
      if (data.status === "roundend") {
        setCorrect(data.correct || false)
        setSentEmojis(data.emojis ? Object.values(data.emojis) : [])
        setScores(data.scores || { "Team 1": 0, "Team 2": 0, "Team 3": 0 })
        setTimerActive(false)
        setGuesserActive(false)
        setScreen("roundend")
      }

      // Next round
      if (data.status === "nextround") {
        const newRound = data.currentRound || 1
        const myRole = data.roles?.[nickname] || "guesser"
        const myTeam = data.players?.[nickname]?.team || ""
        const myTeammate = Object.entries(data.players || {}).find(
          ([n, p]) => n !== nickname && p.team === myTeam
        )?.[0] || ""
        setCurrentTopic(data.topic || "")
        setCurrentRound(newRound)
        setScores(data.scores || { "Team 1": 0, "Team 2": 0, "Team 3": 0 })
        setRole(myRole)
        setTeam(myTeam)
        setTeammate(myTeammate)
        setSentEmojis([])
        setReceivedEmojis([])
        setTimer(60)
        setTimerActive(false)
        setCountdown(null)
        setGuess("")
        setWrongGuesses([])
        setCorrect(false)
        setGuesserTimer(60)
        setGuesserActive(false)
        setSearch("")
        setScreen("role")
      }

      // Game over
      if (data.status === "gameover") {
        setScores(data.scores || { "Team 1": 0, "Team 2": 0, "Team 3": 0 })
        setScreen("gameover")
      }

      // Host started game — go to role screen
      if (data.status === "playing" && screen === "waiting") {
        const myRole = data.roles?.[nickname] || "guesser"
        const myTeam = data.players?.[nickname]?.team || ""
        const myTeammate = Object.entries(data.players || {}).find(
          ([n, p]) => n !== nickname && p.team === myTeam
        )?.[0] || ""
        setRole(myRole)
        setTeam(myTeam)
        setTeammate(myTeammate)
        setCurrentTopic(data.topic || "")
        setCurrentRound(data.currentRound || 1)
        setRounds(data.rounds || 3)
        setCategory(data.category || "")
        setScreen("role")
      }
    })
    return () => unsub()
  }, [roomCode, nickname])

  // Clue giver timer
  useEffect(() => {
    if (!timerActive) return
    if (timer <= 0) return
    const interval = setInterval(() => setTimer(t => t - 1), 1000)
    return () => clearInterval(interval)
  }, [timerActive, timer])

  // Guesser timer
  useEffect(() => {
    if (!guesserActive) return
    if (guesserTimer <= 0) return
    const interval = setInterval(() => setGuesserTimer(t => t - 1), 1000)
    return () => clearInterval(interval)
  }, [guesserActive, guesserTimer])

  // Clue giver timer ran out
  useEffect(() => {
    if (timerActive && timer <= 0) {
      setTimerActive(false)
      endRound(false)
    }
  }, [timer, timerActive])

  // Guesser timer ran out
  useEffect(() => {
    if (guesserActive && guesserTimer <= 0) {
      setGuesserActive(false)
      setScreen("roundend")
    }
  }, [guesserTimer, guesserActive])

  const endRound = async (won) => {
    const newScores = { ...scores }
    if (won) newScores[team] = (newScores[team] || 0) + 1
    setScores(newScores)
    setCorrect(won)
    await update(ref(db, `rooms/${roomCode}`), {
      status: "roundend",
      correct: won,
      scores: newScores
    })
    setScreen("roundend")
  }

  const handleLogoTap = () => {
    const msg = RESET_MESSAGES[Math.floor(Math.random() * RESET_MESSAGES.length)]
    setResetMessage(msg)
    setShowResetConfirm(true)
  }

  const confirmReset = async () => {
    if (roomCode) {
      await update(ref(db, `rooms/${roomCode}`), { status: "ended" })
    }
    setNickname(""); setTeam(""); setScreen("home"); setGameMode("sameroom")
    setRounds(3); setCurrentRound(1); setScores({ "Team 1": 0, "Team 2": 0, "Team 3": 0 })
    setJoinCode(""); setSearch(""); setSentEmojis([]); setTimer(60)
    setTimerActive(false); setCountdown(null); setReceivedEmojis([])
    setGuess(""); setWrongGuesses([]); setCorrect(false)
    setGuesserTimer(60); setGuesserActive(false); setShowResetConfirm(false)
    setCategory(""); setCurrentTopic(""); setRoomCode(""); setRole("")
    setIsHost(false); setPlayers({}); setTeammate("")
  }

  const createGame = async () => {
    if (!category) return
    const code = generateRoomCode()
    setRoomCode(code)
    setIsHost(true)
    await set(ref(db, `rooms/${code}`), {
      host: nickname,
      category,
      rounds,
      currentRound: 1,
      status: "waiting",
      scores: { "Team 1": 0, "Team 2": 0, "Team 3": 0 },
      players: { [nickname]: { team: "unassigned" } }
    })
    setScreen("waiting")
  }

  const joinGame = async () => {
    if (joinCode.length !== 6) return
    onValue(ref(db, `rooms/${joinCode}`), async (snapshot) => {
      const data = snapshot.val()
      if (!data) { alert("Room not found!"); return }
      setRoomCode(joinCode)
      setRounds(data.rounds)
      setCategory(data.category)
      setIsHost(false)
      await update(ref(db, `rooms/${joinCode}/players`), {
        [nickname]: { team: "unassigned" }
      })
      setScreen("waiting")
    }, { onlyOnce: true })
  }

  const assignTeam = async (playerName, currentTeam) => {
    const order = ["unassigned", "Team 1", "Team 2", "Team 3"]
    const next = order[(order.indexOf(currentTeam) + 1) % order.length]
    await update(ref(db, `rooms/${roomCode}/players/${playerName}`), { team: next })
  }

  const randomizeTeams = async () => {
    const playerNames = Object.keys(players)
    const shuffled = [...playerNames].sort(() => Math.random() - 0.5)
    const updates = {}
    shuffled.forEach((name, i) => {
      updates[`${name}/team`] = i % 2 === 0 ? "Team 1" : "Team 2"
    })
    await update(ref(db, `rooms/${roomCode}/players`), updates)
  }

  const startGame = async () => {
    const allAssigned = Object.values(players).every(p => p.team && p.team !== "unassigned")
    if (!allAssigned) { alert("All players must be assigned to a team!"); return }
    const topic = getRandomTopic(category)
    const roles = assignRoles(players, 1)
    const myRole = roles[nickname]
    const myTeam = players[nickname]?.team || ""
    const myTeammate = Object.entries(players).find(
      ([n, p]) => n !== nickname && p.team === myTeam
    )?.[0] || ""
    setRole(myRole)
    setTeam(myTeam)
    setTeammate(myTeammate)
    setCurrentTopic(topic)
    setCurrentRound(1)
    await update(ref(db, `rooms/${roomCode}`), {
      status: "playing",
      topic,
      currentRound: 1,
      roles
    })
    setScreen("role")
  }

  const nextRound = async () => {
    if (currentRound >= rounds) {
      await update(ref(db, `rooms/${roomCode}`), { status: "gameover", scores })
      setScreen("gameover")
      return
    }
    const newRound = currentRound + 1
    const newTopic = getRandomTopic(category)
    const newRoles = assignRoles(players, newRound)
    await update(ref(db, `rooms/${roomCode}`), {
      status: "nextround",
      topic: newTopic,
      currentRound: newRound,
      roles: newRoles,
      emojis: null,
      correct: false,
      wrongGuesses: null,
      scores
    })
  }

  const startCountdown = async () => {
    await update(ref(db, `rooms/${roomCode}`), { status: "countdown" })
  }

  const filteredEmojis = search.trim() === ""
    ? []
    : EMOJI_LIST.filter(e => e.keywords.some(k => k.includes(search.toLowerCase())))

  const sendEmoji = async (emoji) => {
    setSentEmojis(prev => [...prev, emoji])
    setSearch("")
    await push(ref(db, `rooms/${roomCode}/emojis`), emoji)
    searchRef.current?.focus()
  }

  const submitGuess = async () => {
    if (!guess.trim()) return
    if (guess.trim().toLowerCase() === currentTopic.toLowerCase()) {
      endRound(true)
    } else {
      const newWrong = [...wrongGuesses, guess.trim()]
      setWrongGuesses(newWrong)
      setGuess("")
      await update(ref(db, `rooms/${roomCode}`), { wrongGuesses: newWrong })
    }
  }

  // RESET CONFIRM
  if (showResetConfirm) {
    return (
      <div style={{ textAlign: "center", marginTop: "120px", fontFamily: "sans-serif", padding: "20px" }}>
        <div style={{ fontSize: "48px" }}>😬</div>
        <h2 style={{ fontSize: "24px", margin: "16px 0" }}>{resetMessage}</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "24px" }}>
          <button onClick={confirmReset} style={{ padding: "12px 30px", fontSize: "18px", borderRadius: "12px", background: "#cc0000", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}>Yeah, reset</button>
          <button onClick={() => setShowResetConfirm(false)} style={{ padding: "12px 30px", fontSize: "18px", borderRadius: "12px", background: "#0066ff", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}>No, stay!</button>
        </div>
      </div>
    )
  }

  // WAITING / LOBBY SCREEN
  if (screen === "waiting") {
    const playerList = Object.entries(players)
    const allAssigned = playerList.every(([, p]) => p.team && p.team !== "unassigned")
    return (
      <div style={{ textAlign: "center", marginTop: "40px", fontFamily: "sans-serif", padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
        <Logo onTap={handleLogoTap} />
        <p style={{ color: "#999", fontSize: "14px" }}>Room Code</p>
        <div
          onClick={() => {
            navigator.clipboard.writeText(roomCode)
            setCodeCopied(true)
            setTimeout(() => setCodeCopied(false), 2000)
          }}
          style={{ fontSize: "44px", fontWeight: "bold", letterSpacing: "8px", color: "#0066ff", margin: "8px 0 4px", cursor: "pointer", userSelect: "none" }}
        >
          {roomCode}
          <div style={{ fontSize: "13px", letterSpacing: "0px", color: codeCopied ? "#00aa44" : "#aaa", marginTop: "4px" }}>
            {codeCopied ? "✅ Copied!" : "👆 tap to copy"}
          </div>
        </div>
        <p style={{ color: "#999", fontSize: "13px", marginBottom: "20px" }}>{category} · {rounds} rounds</p>

        <p style={{ fontSize: "13px", color: "#999", margin: "0 0 10px", letterSpacing: "1px" }}>PLAYERS</p>

        {playerList.map(([name, info]) => {
          const tc = TEAM_COLORS[info.team] || "#999"
          return (
            <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: "12px", marginBottom: "8px", background: "#f5f5f5", border: `2px solid ${tc}` }}>
              <span style={{ fontWeight: "bold", fontSize: "16px" }}>{name} {name === nickname ? "👤" : ""}</span>
              {isHost ? (
                <button
                  onClick={() => assignTeam(name, info.team)}
                  style={{ padding: "6px 14px", fontSize: "13px", borderRadius: "8px", background: tc, color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}
                >
                  {info.team === "unassigned" ? "Assign +" : info.team}
                </button>
              ) : (
                <span style={{ color: tc, fontWeight: "bold", fontSize: "14px" }}>{info.team === "unassigned" ? "Waiting..." : info.team}</span>
              )}
            </div>
          )
        })}

        {isHost && (
          <div style={{ marginTop: "16px", display: "flex", gap: "10px", justifyContent: "center" }}>
            <button
              onClick={randomizeTeams}
              style={{ padding: "10px 20px", fontSize: "15px", borderRadius: "10px", background: "#888", color: "white", border: "none", cursor: "pointer" }}
            >
              🎲 Randomize
            </button>
            <button
              onClick={startGame}
              disabled={!allAssigned || playerList.length < 2}
              style={{ padding: "10px 24px", fontSize: "15px", borderRadius: "10px", background: allAssigned && playerList.length >= 2 ? "#0066ff" : "#aaa", color: "white", border: "none", cursor: allAssigned && playerList.length >= 2 ? "pointer" : "not-allowed", fontWeight: "bold" }}
            >
              Start Game →
            </button>
          </div>
        )}

        {!isHost && (
          <p style={{ color: "#999", marginTop: "20px" }}>⏳ Waiting for host to start...</p>
        )}
      </div>
    )
  }

  // ROUND END
  if (screen === "roundend") {
    const gotIt = correct
    const maxLen = Math.max(sentEmojis.length, 1)
    return (
      <div style={{ fontFamily: "sans-serif", padding: "20px", maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
        <Logo onTap={handleLogoTap} />
        <div style={{ background: gotIt ? "#e6ffe6" : "#ffe6e6", border: `2px solid ${gotIt ? "#00aa44" : "#cc0000"}`, borderRadius: "16px", padding: "24px", margin: "16px 0" }}>
          <div style={{ fontSize: "60px" }}>{gotIt ? "🎉" : "⏰"}</div>
          <h2 style={{ color: gotIt ? "#00aa44" : "#cc0000", margin: "8px 0" }}>{gotIt ? "Got it!" : "Time's Up!"}</h2>
          <p style={{ fontSize: "18px", margin: "8px 0", color: "#111" }}>The answer was <strong>{currentTopic}</strong></p>
          {gotIt && <p style={{ color: "#666", fontSize: "14px" }}>Solved in {60 - guesserTimer}s with {sentEmojis.length} emoji{sentEmojis.length !== 1 ? "s" : ""}</p>}
        </div>

        {sentEmojis.length > 0 && (
          <>
            <p style={{ fontSize: "13px", color: "#999", margin: "8px 0", letterSpacing: "1px" }}>CLUES SENT</p>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center", marginBottom: "16px" }}>
              {sentEmojis.map((e, i) => (
                <div key={i} style={{ width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", borderRadius: "8px", background: "#f5f5f5", border: "2px solid #eee" }}>{e}</div>
              ))}
            </div>
          </>
        )}

        {wrongGuesses.length > 0 && (
          <>
            <p style={{ fontSize: "13px", color: "#999", margin: "8px 0", letterSpacing: "1px" }}>WRONG GUESSES 😬</p>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center", marginBottom: "16px" }}>
              {wrongGuesses.map((g, i) => (
                <span key={i} style={{ background: "#ffe0e0", color: "#cc0000", padding: "4px 10px", borderRadius: "20px", fontSize: "14px" }}>❌ {g}</span>
              ))}
            </div>
          </>
        )}


        <p style={{ fontSize: "13px", color: "#999", margin: "8px 0", letterSpacing: "1px" }}>SCORES</p>
        <div style={{ marginBottom: "20px" }}>
          {Object.entries(scores).filter(([t]) => {
            const teamsInGame = [...new Set(Object.values(players).map(p => p.team).filter(t => t && t !== "unassigned"))]
            return teamsInGame.includes(t)
          }).map(([t, s]) => (
            <div key={t} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderRadius: "10px", marginBottom: "8px", background: t === team ? TEAM_COLORS[t] : "#333", border: `2px solid ${t === team ? TEAM_COLORS[t] : "#555"}` }}>
              <span style={{ fontWeight: "bold", color: "white", fontSize: "16px" }}>{t}</span>
              <span style={{ fontSize: "26px", fontWeight: "bold", color: "white" }}>{s}</span>
            </div>
          ))}
        </div>

        <p style={{ color: "#999", fontSize: "14px" }}>Round {currentRound} of {rounds}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "8px" }}>
          <button onClick={confirmReset} style={{ padding: "12px 24px", fontSize: "16px", borderRadius: "12px", background: "#ccc", color: "white", border: "none", cursor: "pointer" }}>🏠 End Game</button>
          {isHost ? (
            <button onClick={nextRound} style={{ padding: "12px 24px", fontSize: "16px", borderRadius: "12px", background: teamColor, color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}>
              {currentRound >= rounds ? "🏆 See Results" : "Next Round →"}
            </button>
          ) : (
            <p style={{ color: "#999", fontSize: "14px", margin: "12px 0" }}>Waiting for host...</p>
          )}
        </div>
      </div>
    )
  }

  // GAME OVER
  if (screen === "gameover") {
    const teamsInGame = [...new Set(Object.values(players).map(p => p.team).filter(t => t && t !== "unassigned"))]
    const sorted = teamsInGame.map(t => [t, scores[t] || 0]).sort((a, b) => b[1] - a[1])
    return (
      <div style={{ fontFamily: "sans-serif", padding: "20px", maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
        <Logo onTap={handleLogoTap} />
        <div style={{ fontSize: "72px", margin: "20px 0" }}>🏆</div>
        <h1 style={{ fontSize: "32px", color: "#0066ff" }}>Game Over!</h1>
        <p style={{ fontSize: "20px" }}>Winner: <strong style={{ color: TEAM_COLORS[sorted[0][0]] }}>{sorted[0][0]}</strong></p>
        <div style={{ margin: "20px 0" }}>
          {sorted.map(([t, s], i) => (
            <div key={t} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: "10px", marginBottom: "8px", background: i === 0 ? "#fff8e1" : "#f9f9f9", border: i === 0 ? "2px solid #ffcc00" : "2px solid #eee" }}>
              <span style={{ fontSize: "20px" }}>{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</span>
              <span style={{ fontWeight: "bold", color: TEAM_COLORS[t] }}>{t}</span>
              <span style={{ fontSize: "28px", fontWeight: "bold" }}>{s} pts</span>
            </div>
          ))}
        </div>
        <button onClick={confirmReset} style={{ padding: "14px 40px", fontSize: "20px", borderRadius: "12px", background: "#0066ff", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}>🔄 Play Again</button>
      </div>
    )
  }

  // GUESSER SCREEN
  if (screen === "guesser") {
    return (
      <div style={{ fontFamily: "sans-serif", padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Logo onTap={handleLogoTap} />
          <div style={{ fontSize: "28px", fontWeight: "bold", color: guesserTimer <= 10 ? "red" : teamColor }}>⏱️ {guesserTimer}s</div>
        </div>

        {countdown !== null && (
          <div style={{ fontSize: "100px", fontWeight: "bold", textAlign: "center", color: teamColor, margin: "20px 0" }}>
            {countdownWords[countdown]}
          </div>
        )}

        <div style={{ background: "#f9f9f9", border: `2px solid ${teamColor}`, borderRadius: "12px", padding: "16px", margin: "16px 0", minHeight: "80px" }}>
          <p style={{ margin: "0 0 8px", fontSize: "12px", color: teamColor, letterSpacing: "1px" }}>CLUES FROM {teammate.toUpperCase() || "YOUR TEAMMATE"}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {receivedEmojis.length === 0
              ? <p style={{ color: "#ccc", margin: 0 }}>Waiting for clues...</p>
              : receivedEmojis.map((e, i) => <span key={i} style={{ fontSize: "40px" }}>{e}</span>)
            }
          </div>
        </div>

        {!guesserActive && countdown === null && (
          <p style={{ textAlign: "center", color: teamColor, fontSize: "18px", marginTop: "30px" }}>⏳ Waiting for {teammate || "clue giver"} to start...</p>
        )}

        {guesserActive && (
          <>
            <input
              autoFocus
              type="text"
              placeholder="Type your guess..."
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") submitGuess() }}
              style={{ width: "100%", padding: "12px", fontSize: "18px", borderRadius: "12px", border: `2px solid ${teamColor}`, boxSizing: "border-box", marginBottom: "10px" }}
            />
            <button onClick={submitGuess} style={{ width: "100%", padding: "12px", fontSize: "18px", borderRadius: "12px", background: teamColor, color: "white", border: "none", cursor: "pointer" }}>Submit Guess ✊</button>
          </>
        )}

        {wrongGuesses.length > 0 && (
          <div style={{ marginTop: "16px" }}>
            <p style={{ fontSize: "13px", color: "#999", margin: "0 0 6px" }}>WRONG GUESSES</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {wrongGuesses.map((g, i) => <span key={i} style={{ background: "#ffe0e0", color: "#cc0000", padding: "4px 10px", borderRadius: "20px", fontSize: "14px" }}>❌ {g}</span>)}
            </div>
          </div>
        )}
      </div>
    )
  }

  // CLUE GIVER SCREEN
  if (screen === "cluegiver") {
    return (
      <div style={{ fontFamily: "sans-serif", padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Logo onTap={handleLogoTap} />
          <div style={{ fontSize: "28px", fontWeight: "bold", color: timer <= 10 ? "red" : teamColor }}>⏱️ {timer}s</div>
        </div>

        <div style={{ background: teamColor, color: "white", borderRadius: "12px", padding: "16px", textAlign: "center", margin: "16px 0" }}>
          <p style={{ margin: 0, fontSize: "14px", opacity: 0.8 }}>YOUR TOPIC — SEND TO {teammate.toUpperCase() || "YOUR TEAMMATE"}</p>
          <h1 style={{ margin: "8px 0 0", fontSize: "32px" }}>{currentTopic}</h1>
        </div>

        {countdown !== null && (
          <div style={{ fontSize: "100px", fontWeight: "bold", textAlign: "center", color: teamColor, margin: "20px 0" }}>
            {countdownWords[countdown]}
          </div>
        )}

        {!timerActive && countdown === null && (
          <button onClick={startCountdown} style={{ width: "100%", padding: "14px", fontSize: "18px", borderRadius: "12px", background: teamColor, color: "white", border: "none", cursor: "pointer", marginBottom: "16px", fontWeight: "bold" }}>
            Start Round ▶️
          </button>
        )}

        <div style={{ minHeight: "50px", background: "#f5f5f5", borderRadius: "12px", padding: "10px", marginBottom: "16px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {sentEmojis.length === 0
            ? <p style={{ color: "#999", margin: 0, fontSize: "14px" }}>Sent emojis appear here...</p>
            : sentEmojis.map((e, i) => <span key={i} style={{ fontSize: "28px" }}>{e}</span>)
          }
        </div>

        {timerActive && gameMode === "remote" && (
          <div style={{ background: "#fff8f8", border: "2px solid #ffcccc", borderRadius: "12px", padding: "10px", marginBottom: "12px" }}>
            <p style={{ margin: "0 0 6px", fontSize: "12px", color: "#cc0000", letterSpacing: "1px" }}>THEIR GUESSES SO FAR</p>
            {wrongGuesses.length === 0
              ? <p style={{ color: "#ccc", margin: 0, fontSize: "13px" }}>No guesses yet...</p>
              : <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {wrongGuesses.map((g, i) => <span key={i} style={{ background: "#ffe0e0", color: "#cc0000", padding: "4px 10px", borderRadius: "20px", fontSize: "14px" }}>❌ {g}</span>)}
                </div>
            }
          </div>
        )}

        <input
          ref={searchRef}
          type="text"
          placeholder="Search emojis..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={!timerActive}
          style={{ width: "100%", padding: "12px", fontSize: "16px", borderRadius: "12px", border: `2px solid ${teamColor}`, boxSizing: "border-box", marginBottom: "12px", background: timerActive ? "white" : "#f0f0f0", color: timerActive ? "black" : "#aaa" }}
        />

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
          {filteredEmojis.map((e, i) => (
            <button key={i} onClick={() => sendEmoji(e.emoji)} style={{ fontSize: "40px", background: "none", border: "2px solid #eee", borderRadius: "12px", padding: "8px", cursor: "pointer" }}>{e.emoji}</button>
          ))}
        </div>
        {search.trim() !== "" && filteredEmojis.length === 0 && (
          <p style={{ color: "#999", textAlign: "center" }}>No emojis found. Try another word.</p>
        )}
      </div>
    )
  }

  // ROLE SCREEN
  if (screen === "role") {
    const isClue = role === "clue"
    return (
      <div style={{ textAlign: "center", marginTop: "80px", fontFamily: "sans-serif", background: teamColor, minHeight: "100vh", color: "white", padding: "20px" }}>
        <p style={{ fontSize: "14px", letterSpacing: "2px", opacity: 0.8 }}>🔒 DON'T SHOW YOUR SCREEN</p>
        <p style={{ fontSize: "14px", opacity: 0.7 }}>Round {currentRound} of {rounds} · {team}</p>
        <h1 style={{ fontSize: "28px", marginTop: "20px" }}>Hey {nickname}!</h1>
        <p style={{ fontSize: "20px", opacity: 0.9 }}>You are the</p>
        <div style={{ fontSize: "52px", fontWeight: "bold", margin: "20px 0" }}>{isClue ? "👁️ CLUE GIVER" : "👂 GUESSER"}</div>
        <p style={{ fontSize: "18px", opacity: 0.85, maxWidth: "300px", margin: "0 auto" }}>
          {isClue
            ? `Search for emojis and send them to ${teammate || "your teammate"} one at a time!`
            : `Watch for emojis from ${teammate || "your teammate"} and type your guess!`}
        </p>
        <br /><br />
        <button
          onClick={() => setScreen(isClue ? "cluegiver" : "guesser")}
          style={{ padding: "14px 40px", fontSize: "20px", borderRadius: "12px", background: "white", color: teamColor, border: "none", cursor: "pointer", fontWeight: "bold" }}
        >
          I'm Ready ✊
        </button>
        <br /><br />
        <span onClick={handleLogoTap} style={{ fontSize: "14px", opacity: 0.6, cursor: "pointer", textDecoration: "underline" }}>🎯 GuessMoji</span>
      </div>
    )
  }

  // CREATE SCREEN
  if (screen === "create") {
    return (
      <div style={{ textAlign: "center", marginTop: "40px", fontFamily: "sans-serif", padding: "20px" }}>
        <Logo onTap={handleLogoTap} />
        <p>Game Mode:</p>
        <button onClick={() => setGameMode("sameroom")} style={{ padding: "10px 20px", fontSize: "16px", borderRadius: "8px", margin: "5px", background: gameMode === "sameroom" ? "#0066ff" : "#eee", color: gameMode === "sameroom" ? "white" : "black", border: "none", cursor: "pointer" }}>🏠 Same Room</button>
        <button onClick={() => setGameMode("remote")} style={{ padding: "10px 20px", fontSize: "16px", borderRadius: "8px", margin: "5px", background: gameMode === "remote" ? "#0066ff" : "#eee", color: gameMode === "remote" ? "white" : "black", border: "none", cursor: "pointer" }}>🌐 Remote</button>
        <p>Number of Rounds:</p>
        <button onClick={() => setRounds(r => Math.max(1, r - 1))} style={{ fontSize: "24px", background: "none", border: "none", cursor: "pointer" }}>➖</button>
        <span style={{ fontSize: "32px", fontWeight: "bold", margin: "0 20px" }}>{rounds}</span>
        <button onClick={() => setRounds(r => r + 1)} style={{ fontSize: "24px", background: "none", border: "none", cursor: "pointer" }}>➕</button>
        <p>Category:</p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px", marginBottom: "20px" }}>
          {Object.keys(TOPICS).map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} style={{ padding: "10px 16px", fontSize: "15px", borderRadius: "10px", background: category === cat ? "#0066ff" : "#eee", color: category === cat ? "white" : "black", border: "none", cursor: "pointer", fontWeight: category === cat ? "bold" : "normal" }}>{cat}</button>
          ))}
        </div>
        <button onClick={() => setScreen("lobby")} style={{ padding: "10px 30px", fontSize: "16px", borderRadius: "8px", background: "#ccc", color: "white", border: "none", cursor: "pointer", margin: "5px" }}>← Back</button>
        <button onClick={createGame} style={{ padding: "10px 30px", fontSize: "16px", borderRadius: "8px", background: category ? "#0066ff" : "#aaa", color: "white", border: "none", cursor: category ? "pointer" : "not-allowed", margin: "5px" }}>Create Room →</button>
        {!category && <p style={{ color: "#cc0000", fontSize: "13px" }}>Pick a category first!</p>}
      </div>
    )
  }

  // JOIN SCREEN
  if (screen === "join") {
    return (
      <div style={{ textAlign: "center", marginTop: "100px", fontFamily: "sans-serif", padding: "20px" }}>
        <Logo onTap={handleLogoTap} />
        <p>Enter the room code:</p>
        <input type="text" placeholder="Room code..." value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} maxLength={6} style={{ padding: "10px", fontSize: "32px", borderRadius: "8px", border: "2px solid #ff6600", textAlign: "center", letterSpacing: "6px", width: "100%", maxWidth: "260px", boxSizing: "border-box" }} />
        <br /><br />
        <button onClick={() => setScreen("lobby")} style={{ padding: "10px 30px", fontSize: "16px", borderRadius: "8px", background: "#ccc", color: "white", border: "none", cursor: "pointer", margin: "5px" }}>← Back</button>
        <button onClick={joinGame} style={{ padding: "10px 30px", fontSize: "16px", borderRadius: "8px", background: "#ff6600", color: "white", border: "none", cursor: "pointer", margin: "5px" }}>Join →</button>
      </div>
    )
  }

  // LOBBY SCREEN
  if (screen === "lobby") {
    return (
      <div style={{ textAlign: "center", marginTop: "100px", fontFamily: "sans-serif" }}>
        <Logo onTap={handleLogoTap} />
        <p style={{ fontSize: "18px" }}>Hey <strong>{nickname}</strong>! 👋</p>
        <br />
        <button onClick={() => setScreen("create")} style={{ padding: "10px 30px", fontSize: "18px", borderRadius: "8px", background: "#0066ff", color: "white", border: "none", cursor: "pointer", margin: "10px" }}>🎮 Create Game</button>
        <br />
        <button onClick={() => setScreen("join")} style={{ padding: "10px 30px", fontSize: "18px", borderRadius: "8px", background: "#ff6600", color: "white", border: "none", cursor: "pointer", margin: "10px" }}>🔗 Join Game</button>
      </div>
    )
  }

  // HOME SCREEN
  return (
    <div style={{ textAlign: "center", marginTop: "80px", fontFamily: "sans-serif", padding: "20px" }}>
      <h1>🎯 GuessMoji</h1>
      <p>Enter your nickname to start</p>
      <input
        type="text"
        placeholder="Your nickname..."
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && nickname.trim()) setScreen("lobby") }}
        style={{ padding: "10px", fontSize: "18px", borderRadius: "8px", border: "1px solid #ccc", width: "100%", boxSizing: "border-box", maxWidth: "300px" }}
      />
      {nickname.trim() && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={() => setScreen("lobby")} style={{ padding: "14px 40px", fontSize: "20px", borderRadius: "12px", background: "#0066ff", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}>
            Let's Play →
          </button>
        </div>
      )}
    </div>
  )
}