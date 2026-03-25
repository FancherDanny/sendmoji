import { useState, useEffect, useRef } from "react"
import { db } from "./firebase"
import { ref, set, update, onValue, push } from "firebase/database"

const VERSION = "v0.4.5"
const MADE_BY = "Fanch"

const TOPICS = {
  "🎬 Movies": [
    "Titanic", "The Lion King", "Frozen", "Jurassic Park", "Home Alone",
    "The Godfather", "Toy Story", "Jaws", "Avatar", "Grease",
    "Rocky", "Ghostbusters", "Shrek", "Inception", "Gladiator",
    "Forrest Gump", "The Matrix", "Goodfellas", "Clueless", "Top Gun",
    "Interstellar", "The Dark Knight", "Finding Nemo", "Braveheart", "Elf",
    "Cast Away", "The Revenant", "Parasite", "Joker", "Get Out",
    "Knives Out", "The Truman Show", "Edward Scissorhands", "Beetlejuice",
    "Pulp Fiction", "Fight Club", "Catch Me If You Can", "The Wolf of Wall Street", "Superbad",
    "Mean Girls", "Legally Blonde", "Pretty Woman", "Dirty Dancing", "Flashdance",
    "Back to the Future", "E.T.", "Alien", "The Terminator", "Die Hard",
    "Speed", "Point Break", "Con Air", "The Notebook", "La La Land",
    "Black Swan", "The Social Network", "Moneyball", "Rush", "Ford v Ferrari",
  ],
  "🎵 Songs": [
    "Bohemian Rhapsody", "Thriller", "Imagine", "Shallow", "Happy",
    "Rolling in the Deep", "Smells Like Teen Spirit", "Baby One More Time",
    "Lose Yourself", "Party in the USA", "Wonderwall", "Shape of You",
    "Old Town Road", "Hotline Bling", "Uptown Funk", "Let It Go",
    "Sweet Home Alabama", "Livin on a Prayer", "Mr Brightside", "Toxic",
    "Jolene", "Hotel California", "Stairway to Heaven", "Purple Rain", "Respect",
    "Born to Run", "Like a Prayer", "Crazy in Love", "Single Ladies", "Halo",
    "Bad Guy", "Ocean Eyes", "Drivers License", "Levitating", "Blinding Lights",
    "Watermelon Sugar", "Dynamite", "Stay", "Peaches", "Good 4 U",
    "Can't Stop the Feeling", "Shake It Off", "Blank Space", "Love Story", "You Belong With Me",
    "Yellow", "Fix You", "The Scientist", "Clocks", "Sky Full of Stars",
    "Somebody That I Used to Know", "Pumped Up Kicks", "Radioactive", "Demons", "Natural",
    "Seven Nation Army", "Flowers", "Cruel Summer", "Anti-Hero", "As It Was",
    "Unholy", "Heat Waves", "Stay With Me", "Thinking Out Loud", "Perfect",
  ],
  "📚 Books": [
    "Harry Potter", "The Great Gatsby", "Moby Dick", "Frankenstein",
    "The Hobbit", "Pride and Prejudice", "The Jungle Book", "Dracula",
    "Little Women", "The Odyssey", "Animal Farm", "Lord of the Flies",
    "Charlotte's Web", "The Alchemist", "Sherlock Holmes", "Robinson Crusoe",
    "Alice in Wonderland", "The Hunger Games", "Gone with the Wind", "Dune",
    "The Catcher in the Rye", "To Kill a Mockingbird", "Of Mice and Men", "1984", "Brave New World",
    "The Grapes of Wrath", "Fahrenheit 451", "The Old Man and the Sea", "Catch-22", "Slaughterhouse-Five",
    "The Da Vinci Code", "The Girl with the Dragon Tattoo", "Gone Girl", "Big Little Lies", "Twilight",
    "The Fault in Our Stars", "Divergent", "The Maze Runner", "Percy Jackson", "Eragon",
    "James and the Giant Peach", "Matilda", "The BFG", "Charlie and the Chocolate Factory", "The Witches",
    "Lord of the Rings", "The Chronicles of Narnia", "A Game of Thrones", "Ender's Game", "The Giver",
    "Where the Wild Things Are", "Goodnight Moon", "The Very Hungry Caterpillar", "Green Eggs and Ham", "Cat in the Hat",
  ],
  "🌍 Places": [
    "Paris", "New York City", "The Great Wall", "Antarctica", "Las Vegas",
    "The Amazon", "Mount Everest", "Hawaii", "Hollywood", "The Sahara",
    "Tokyo", "The Grand Canyon", "Rome", "The North Pole", "Niagara Falls",
    "The Great Barrier Reef", "Times Square", "Machu Picchu", "Dubai", "Venice",
    "The Eiffel Tower", "The Colosseum", "Stonehenge", "The Pyramids", "The Sphinx",
    "Angkor Wat", "The Taj Mahal", "Big Ben", "The Louvre", "The Vatican",
    "Mount Fuji", "Yellowstone", "The Nile", "Area 51", "Alcatraz",
    "Disney World", "Hollywood Sign", "Golden Gate Bridge", "Sydney Opera House", "Uluru",
    "The Serengeti", "Victoria Falls", "Santorini", "Barcelona", "Amsterdam",
    "Prague", "Marrakech", "Bora Bora", "The Maldives", "Fiji",
    "Iceland", "Patagonia", "The Dead Sea", "The Galapagos", "Easter Island",
    "The Black Forest", "The Swiss Alps", "Death Valley", "Monument Valley", "Roswell",
  ],
  "🎮 Video Games": [
    "Mario", "Minecraft", "Fortnite", "Zelda", "Pokemon",
    "Call of Duty", "Grand Theft Auto", "The Sims", "Halo", "Tetris",
    "Among Us", "Roblox", "Pac-Man", "Sonic the Hedgehog", "Street Fighter",
    "Mortal Kombat", "Final Fantasy", "World of Warcraft", "Overwatch", "League of Legends",
    "Donkey Kong", "Space Invaders", "Super Smash Bros", "Animal Crossing", "Stardew Valley",
    "Red Dead Redemption", "The Last of Us", "God of War", "Elden Ring", "Cyberpunk 2077",
    "Portal", "Half-Life", "Doom", "Tomb Raider", "Resident Evil",
    "Metal Gear Solid", "Bioshock", "Borderlands", "Fallout", "Skyrim",
  ],
  "🏆 Sports & Athletes": [
    "LeBron James", "Michael Jordan", "Serena Williams", "Tiger Woods", "Muhammad Ali",
    "Usain Bolt", "Michael Phelps", "Simone Biles", "Wayne Gretzky", "Tom Brady",
    "Cristiano Ronaldo", "Lionel Messi", "Roger Federer", "Rafael Nadal", "Novak Djokovic",
    "Mike Tyson", "Babe Ruth", "Michael Schumacher", "Pelé", "Kobe Bryant",
    "Super Bowl", "World Cup", "Olympics", "Tour de France", "Wimbledon",
    "NBA Finals", "World Series", "The Masters", "Stanley Cup", "Grand Prix",
    "Slam Dunk", "Home Run", "Touchdown", "Hat Trick", "Hole in One",
    "Marathon", "Relay Race", "Penalty Kick", "Free Throw", "Grand Slam",
  ],
  "🦸 Superheroes & Villains": [
    "Superman", "Batman", "Spider-Man", "Wonder Woman", "Iron Man",
    "Captain America", "Thor", "Black Panther", "The Hulk", "Wolverine",
    "Aquaman", "The Flash", "Green Lantern", "Hawkeye", "Black Widow",
    "Thanos", "The Joker", "Lex Luthor", "Magneto", "Doctor Doom",
    "Deadpool", "Doctor Strange", "Ant-Man", "Scarlet Witch", "Vision",
    "Loki", "Venom", "Green Goblin", "Two-Face", "Bane",
    "Catwoman", "Harley Quinn", "Poison Ivy", "Mystique", "Ultron",
    "Daredevil", "Punisher", "Ghost Rider", "Silver Surfer", "Galactus",
  ],
  "🐾 Animals": [
    "Lion", "Elephant", "Giraffe", "Penguin", "Dolphin",
    "Cheetah", "Gorilla", "Panda", "Kangaroo", "Crocodile",
    "Flamingo", "Peacock", "Octopus", "Shark", "Eagle",
    "Wolf", "Fox", "Koala", "Polar Bear", "Grizzly Bear",
    "Chimpanzee", "Orangutan", "Gorilla", "Baboon", "Lemur",
    "Zebra", "Rhinoceros", "Hippopotamus", "Camel", "Llama",
    "Platypus", "Komodo Dragon", "Snow Leopard", "Narwhal", "Axolotl",
    "Bald Eagle", "Hummingbird", "Toucan", "Parrot", "Flamingo",
    "Great White Shark", "Blue Whale", "Orca", "Manta Ray", "Jellyfish",
    "Tarantula", "Scorpion", "Monarch Butterfly", "Firefly", "Praying Mantis",
  ],
  "🍕 Food": [
    "Pizza", "Sushi", "Tacos", "Hamburger", "Ice Cream",
    "Spaghetti", "Hot Dog", "Fried Chicken", "Pancakes", "Lobster",
    "Nachos", "Ramen", "Cheesecake", "Donuts", "Guacamole",
    "Waffles", "Burrito", "Popcorn", "Mac and Cheese", "Croissant",
    "French Fries", "Onion Rings", "Chicken Wings", "Mozzarella Sticks", "Chili Cheese Fries",
    "Corn Dog", "Funnel Cake", "Cotton Candy", "Churros", "Soft Pretzel",
    "Grilled Cheese", "BLT", "Philly Cheesesteak", "Pulled Pork", "Baby Back Ribs",
    "Eggs Benedict", "French Toast", "Cinnamon Roll", "Bagel", "English Muffin",
    "Clam Chowder", "Shrimp Cocktail", "Crab Cakes", "Fish and Chips", "Fish Tacos",
    "Pad Thai", "Dumplings", "Spring Rolls", "Peking Duck", "General Tso Chicken",
    "Falafel", "Hummus", "Shawarma", "Kebab", "Baklava",
    "Tiramisu", "Creme Brulee", "Macarons", "Eclairs", "Gelato",
    "Milkshake", "Root Beer Float", "Lemonade", "Sweet Tea", "Boba Tea",
  ]
}

const EMOJI_LIST = [
  // Nature & Weather
  { emoji: "🌊", keywords: ["water", "wave", "ocean", "sea", "surf", "flood", "tide", "blue", "beach", "shallow", "deep", "lady gaga", "a star is born", "bradley cooper"] },
  { emoji: "🧊", keywords: ["ice", "cold", "freeze", "iceberg", "frozen", "chill", "arctic", "cube"] },
  { emoji: "🔥", keywords: ["fire", "hot", "burn", "flame", "heat", "blaze", "inferno", "campfire"] },
  { emoji: "⛈️", keywords: ["storm", "thunder", "lightning", "rain", "cloud", "weather", "dark"] },
  { emoji: "🌪️", keywords: ["tornado", "wind", "storm", "spin", "twister", "cyclone", "disaster"] },
  { emoji: "🌈", keywords: ["rainbow", "color", "sky", "bright", "spectrum", "pride", "colorful"] },
  { emoji: "☀️", keywords: ["sun", "sunny", "hot", "bright", "day", "summer", "warm", "shine"] },
  { emoji: "🌙", keywords: ["moon", "night", "dark", "sky", "lunar", "crescent", "sleep", "dream"] },
  { emoji: "⭐", keywords: ["star", "night", "sky", "shine", "famous", "celebrity", "wish"] },
  { emoji: "🌋", keywords: ["volcano", "lava", "fire", "eruption", "mountain", "explosion", "hawaii"] },
  { emoji: "🏜️", keywords: ["desert", "sand", "sahara", "hot", "dry", "camel", "cactus", "empty", "dune", "spice", "arrakis", "monument valley", "arizona", "uluru", "outback", "red rock"] },
  { emoji: "🌲", keywords: ["tree", "forest", "nature", "green", "wood", "jungle", "pine", "tall"] },
  { emoji: "🌺", keywords: ["flower", "bloom", "hawaii", "tropical", "pretty", "garden", "pink"] },
  { emoji: "🍄", keywords: ["mushroom", "fungi", "forest", "mario", "super", "toadstool", "red"] },
  { emoji: "🌍", keywords: ["world", "earth", "globe", "planet", "travel", "international", "global", "avatar", "pandora", "alien planet"] },
  { emoji: "🏔️", keywords: ["mountain", "everest", "peak", "snow", "climb", "high", "alps", "rocky"] },
  { emoji: "🏝️", keywords: ["island", "beach", "tropical", "hawaii", "paradise", "palm", "castaway", "bora bora", "fiji", "polynesia", "tahiti", "pacific", "south sea", "resort", "lagoon"] },
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
  { emoji: "🪨", keywords: ["rock", "stone", "hard", "heavy", "solid", "mountain", "throw", "uluru", "ayers rock", "sacred", "red", "monument"] },
  { emoji: "🌑", keywords: ["dark", "night", "moon", "black", "shadow", "eclipse", "space"] },
  { emoji: "💧", keywords: ["drop", "water", "rain", "tear", "drip", "blue", "wet", "cry"] },
  { emoji: "⚡", keywords: ["lightning", "electric", "power", "fast", "quick", "speed", "bolt", "thunder", "energy", "zeus", "time"] },
  { emoji: "🌤️", keywords: ["partly cloudy", "sun", "cloud", "weather", "day", "sky", "nice"] },
  { emoji: "⏱️", keywords: ["timer", "stopwatch", "time", "clock", "speed", "quick", "fast", "countdown", "race"] },
  { emoji: "⏰", keywords: ["alarm", "clock", "time", "wake", "morning", "ring", "buzz", "countdown"] },
  { emoji: "⌚", keywords: ["watch", "clock", "time", "wrist", "hour", "minute", "second", "tick"] },
  { emoji: "🕐", keywords: ["clock", "time", "hour", "one", "schedule", "tick", "round"] },
  { emoji: "📅", keywords: ["calendar", "date", "schedule", "time", "day", "month", "plan", "event"] },
  { emoji: "⏳", keywords: ["hourglass", "time", "sand", "wait", "countdown", "slow", "patience", "running out"] },
  { emoji: "🕰️", keywords: ["clock", "time", "antique", "hour", "minute", "old", "grandfather", "tick"] },
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
  { emoji: "🐆", keywords: ["leopard", "cheetah", "spots", "fast", "quick", "speed", "africa", "jungle", "cat", "wild"] },
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
  { emoji: "🐍", keywords: ["snake", "slither", "poison", "coil", "dangerous", "reptile", "hiss"] },
  { emoji: "🦎", keywords: ["lizard", "reptile", "green", "tongue", "gecko", "chameleon", "crawl"] },
  { emoji: "🐙", keywords: ["octopus", "tentacle", "ocean", "eight", "arms", "ink", "sea", "smart"] },
  { emoji: "🦑", keywords: ["squid", "ocean", "tentacle", "ink", "sea", "deep", "calamari"] },
  { emoji: "🦞", keywords: ["lobster", "seafood", "ocean", "red", "fancy", "claws", "boil"] },
  { emoji: "🐠", keywords: ["fish", "tropical", "color", "swim", "ocean", "clown", "nemo"] },
  { emoji: "🐬", keywords: ["dolphin", "ocean", "smart", "jump", "swim", "friendly", "navy"] },
  { emoji: "🦭", keywords: ["seal", "arctic", "swim", "bark", "fish", "flippers", "beach"] },
  { emoji: "🐇", keywords: ["rabbit", "hop", "easter", "carrot", "white", "ears", "fast", "quick", "bunny", "speed"] },
  { emoji: "🐿️", keywords: ["squirrel", "nuts", "tree", "acorn", "bushy", "tail", "forest", "store"] },
  { emoji: "🦫", keywords: ["beaver", "dam", "wood", "canada", "teeth", "build", "river", "tail"] },
  { emoji: "🐓", keywords: ["rooster", "chicken", "farm", "crow", "morning", "wake", "feather"] },
  { emoji: "🦃", keywords: ["turkey", "thanksgiving", "farm", "feather", "gobble", "bird"] },
  { emoji: "🐝", keywords: ["bee", "honey", "sting", "yellow", "black", "hive", "flower", "buzz"] },
  { emoji: "🐛", keywords: ["caterpillar", "worm", "green", "leaf", "slow", "transform", "bug"] },
  { emoji: "🕷️", keywords: ["spider", "web", "creepy", "bug", "scary", "spiderman", "eight legs"] },
  { emoji: "🦟", keywords: ["mosquito", "bite", "buzz", "blood", "annoying", "summer", "itch"] },
  { emoji: "🦁", keywords: ["lion", "roar", "africa", "mane", "king", "pride", "animal"] },
  { emoji: "🐴", keywords: ["horse", "ride", "stable", "farm", "gallop", "pony", "mane", "wild west"] },
  { emoji: "🦙", keywords: ["llama", "alpaca", "peru", "wool", "south america", "fluffy", "spit"] },
  { emoji: "🦬", keywords: ["bison", "buffalo", "west", "herd", "stampede", "american", "horns"] },
  { emoji: "🐑", keywords: ["sheep", "wool", "farm", "white", "lamb", "fluffy", "baa", "counting"] },
  { emoji: "🐐", keywords: ["goat", "farm", "horns", "mountain", "stubborn", "billy", "gruff"] },
  { emoji: "🐄", keywords: ["cow", "farm", "milk", "moo", "spots", "pasture", "dairy", "beef"] },
  { emoji: "🐖", keywords: ["pig", "farm", "oink", "pink", "mud", "bacon", "pork", "snout"] },
  { emoji: "🐕", keywords: ["dog", "pet", "bark", "loyal", "woof", "puppy", "fetch", "friend"] },
  { emoji: "🐈", keywords: ["cat", "pet", "meow", "purr", "whiskers", "feline", "kitten", "paws"] },
  { emoji: "🐓", keywords: ["chicken", "rooster", "farm", "cluck", "egg", "feather", "bird"] },
  { emoji: "🦢", keywords: ["swan", "white", "elegant", "lake", "graceful", "bird", "neck", "beautiful"] },
  { emoji: "🦜", keywords: ["parrot", "colorful", "talk", "tropical", "bird", "repeat", "pirate"] },
  { emoji: "🐦", keywords: ["bird", "fly", "tweet", "feather", "wing", "small", "nest", "chirp"] },
  { emoji: "🦋", keywords: ["butterfly", "wings", "colorful", "flutter", "flower", "transform", "pretty"] },

  // People & Emotions
  { emoji: "👨", keywords: ["man", "male", "guy", "person", "adult", "father", "dad", "him", "he", "dude", "brother"] },
  { emoji: "👩", keywords: ["woman", "female", "girl", "person", "adult", "mother", "mom", "her", "she", "lady", "sister", "legally blonde", "elle woods", "clueless", "valley girl", "blonde", "jolene", "matilda"] },
  { emoji: "👶", keywords: ["baby", "infant", "newborn", "small", "child", "cute", "young", "tiny"] },
  { emoji: "👦", keywords: ["boy", "child", "kid", "young", "son", "male", "little", "school"] },
  { emoji: "👧", keywords: ["girl", "child", "kid", "young", "daughter", "female", "little", "school"] },
  { emoji: "👴", keywords: ["old man", "grandfather", "grandpa", "elderly", "senior", "aged", "wise"] },
  { emoji: "👵", keywords: ["old woman", "grandmother", "grandma", "elderly", "senior", "aged", "wise"] },
  { emoji: "👸", keywords: ["queen", "princess", "girl", "woman", "lady", "royal", "crown", "fairy tale"] },
  { emoji: "🤴", keywords: ["king", "prince", "man", "guy", "boy", "royal", "crown", "charming"] },
  { emoji: "🧙", keywords: ["wizard", "magic", "harry", "witch", "spell", "wand", "old", "sorcerer", "matilda", "telekinesis", "power", "roald dahl"] },
  { emoji: "🦸", keywords: ["hero", "super", "power", "cape", "save", "strong", "superman", "marvel"] },
  { emoji: "🦹", keywords: ["villain", "evil", "bad", "super", "dark", "enemy", "sinister"] },
  { emoji: "🧛", keywords: ["vampire", "dracula", "blood", "dark", "night", "bite", "cape", "immortal"] },
  { emoji: "🧟", keywords: ["zombie", "dead", "brain", "horror", "walk", "undead", "apocalypse", "thriller", "michael jackson", "dance", "night", "vincent price"] },
  { emoji: "👨‍🚀", keywords: ["astronaut", "space", "moon", "rocket", "nasa", "gravity", "orbit"] },
  { emoji: "👮", keywords: ["police", "cop", "law", "badge", "arrest", "crime", "officer"] },
  { emoji: "💃", keywords: ["dance", "woman", "salsa", "move", "music", "spin", "tango", "flamenco", "dirty dancing", "lift", "watermelon", "grease", "sandy"] },
  { emoji: "🕺", keywords: ["dance", "man", "groove", "move", "music", "disco", "saturday", "night", "grease", "danny", "pulp fiction", "tarantino", "twist"] },
  { emoji: "😢", keywords: ["sad", "cry", "tears", "emotional", "upset", "weep", "heartbreak"] },
  { emoji: "😂", keywords: ["laugh", "funny", "joke", "happy", "lol", "hilarious", "comedy"] },
  { emoji: "😱", keywords: ["scared", "shock", "horror", "scream", "fear", "panic", "surprised"] },
  { emoji: "😍", keywords: ["love", "heart eyes", "crush", "adore", "beautiful", "smitten"] },
  { emoji: "🤔", keywords: ["think", "wonder", "question", "hmm", "ponder", "curious", "idea"] },
  { emoji: "😴", keywords: ["sleep", "tired", "dream", "night", "rest", "snore", "bed", "lazy", "inception", "layers", "subconscious"] },
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
  { emoji: "👽", keywords: ["alien", "space", "ufo", "green", "extraterrestrial", "weird", "martian", "et", "phone", "home", "roswell", "spielberg", "bicycle", "finger", "glowing", "elliot"] },
  { emoji: "🤖", keywords: ["robot", "machine", "ai", "tech", "future", "metal", "beep", "android"] },
  { emoji: "👹", keywords: ["demon", "monster", "evil", "red", "horns", "oni", "japan", "scary", "unholy", "sinful", "forbidden", "dark"] },
  { emoji: "🎃", keywords: ["pumpkin", "halloween", "jack", "lantern", "october", "carve", "orange"] },
  { emoji: "🧑‍🤝‍🧑", keywords: ["couple", "friends", "together", "pair", "people", "hold hands", "walk"] },
  { emoji: "👨‍👩‍👧‍👦", keywords: ["family", "parents", "kids", "children", "home", "together", "love"] },
  { emoji: "🏃", keywords: ["run", "running", "fast", "quick", "sprint", "jog", "race", "exercise", "chase", "flee", "speed"] },
  { emoji: "🚶", keywords: ["walk", "walking", "stroll", "person", "go", "slow", "wander", "hike"] },
  { emoji: "🧍", keywords: ["stand", "standing", "person", "wait", "still", "upright"] },
  { emoji: "🧎", keywords: ["kneel", "kneeling", "pray", "bow", "propose", "down", "worship"] },
  { emoji: "🤸", keywords: ["gymnast", "cartwheel", "flip", "exercise", "flexible", "acrobat", "sport"] },
  { emoji: "⛹️", keywords: ["basketball", "sport", "dribble", "ball", "player", "jump", "shoot"] },
  { emoji: "🏋️", keywords: ["weightlifting", "gym", "lift", "strong", "barbell", "workout", "muscle"] },
  { emoji: "🤼", keywords: ["wrestling", "fight", "grapple", "sport", "match", "battle", "two"] },
  { emoji: "🤺", keywords: ["fencing", "sword", "sport", "duel", "fence", "compete", "olympic"] },
  { emoji: "🏇", keywords: ["horse racing", "jockey", "race", "horse", "bet", "fast", "derby", "sport"] },
  { emoji: "🧘", keywords: ["yoga", "meditate", "calm", "peace", "relax", "zen", "stretch", "lotus"] },
  { emoji: "🛀", keywords: ["bath", "relax", "clean", "soak", "tub", "wash", "bubble", "spa"] },

  // Clothing & Shoes
  { emoji: "👟", keywords: ["sneaker", "shoe", "shoes", "running", "sport", "nike", "casual", "footwear", "kick", "trainer"] },
  { emoji: "👠", keywords: ["heel", "shoe", "shoes", "high heel", "woman", "fancy", "formal", "footwear", "stiletto"] },
  { emoji: "👡", keywords: ["sandal", "shoe", "shoes", "woman", "summer", "open toe", "footwear", "strappy"] },
  { emoji: "👢", keywords: ["boot", "shoe", "shoes", "cowboy", "western", "tall", "leather", "footwear", "rain"] },
  { emoji: "🥾", keywords: ["hiking boot", "boot", "shoe", "shoes", "outdoor", "trail", "mountain", "footwear", "trek"] },
  { emoji: "🥿", keywords: ["flat", "shoe", "shoes", "slip on", "casual", "woman", "footwear", "loafer"] },
  { emoji: "👞", keywords: ["shoe", "shoes", "dress shoe", "formal", "oxford", "leather", "man", "footwear"] },
  { emoji: "🩴", keywords: ["flip flop", "sandal", "shoe", "shoes", "beach", "summer", "thong", "footwear", "casual"] },
  { emoji: "🧦", keywords: ["sock", "foot", "warm", "cotton", "stripe", "pair", "feet", "ankle"] },
  { emoji: "👒", keywords: ["hat", "sun hat", "woman", "summer", "straw", "garden", "fashion", "head"] },
  { emoji: "🎩", keywords: ["top hat", "magic", "fancy", "gentleman", "hat", "formal", "trick", "black"] },
  { emoji: "⛑️", keywords: ["helmet", "hard hat", "construction", "safety", "protect", "head", "worker"] },
  { emoji: "👑", keywords: ["crown", "king", "queen", "royal", "winner", "champion", "gold", "head"] },
  { emoji: "🎓", keywords: ["graduation", "cap", "school", "diploma", "college", "student", "degree", "hat"] },
  { emoji: "👔", keywords: ["tie", "shirt", "formal", "business", "man", "suit", "office", "dress"] },
  { emoji: "👗", keywords: ["dress", "woman", "fashion", "wear", "clothing", "gown", "outfit", "clothes"] },
  { emoji: "👘", keywords: ["kimono", "japan", "traditional", "robe", "silk", "fashion", "asian", "clothes"] },
  { emoji: "🥻", keywords: ["sari", "india", "traditional", "dress", "woman", "fashion", "wrap", "clothes"] },
  { emoji: "🩱", keywords: ["swimsuit", "swim", "beach", "one piece", "pool", "woman", "bathing suit"] },
  { emoji: "👙", keywords: ["bikini", "beach", "swim", "summer", "woman", "two piece", "pool", "tan"] },
  { emoji: "🩲", keywords: ["underwear", "briefs", "swim", "shorts", "boxer", "beach", "man"] },
  { emoji: "🩳", keywords: ["shorts", "summer", "beach", "casual", "sport", "legs", "clothing"] },
  { emoji: "👕", keywords: ["tshirt", "shirt", "casual", "top", "clothing", "wear", "cotton", "clothes"] },
  { emoji: "🧥", keywords: ["coat", "jacket", "winter", "warm", "fashion", "outerwear", "clothing"] },
  { emoji: "🥼", keywords: ["lab coat", "doctor", "scientist", "white coat", "medical", "research", "clean"] },
  { emoji: "🦺", keywords: ["vest", "safety", "construction", "reflective", "orange", "worker", "jacket"] },
  { emoji: "🎒", keywords: ["backpack", "school", "bag", "travel", "hike", "carry", "student", "pack"] },
  { emoji: "👜", keywords: ["purse", "bag", "handbag", "woman", "fashion", "carry", "shopping"] },
  { emoji: "👝", keywords: ["clutch", "bag", "small", "woman", "purse", "fashion", "carry"] },
  { emoji: "🧳", keywords: ["suitcase", "luggage", "travel", "trip", "pack", "vacation", "bag"] },
  { emoji: "💍", keywords: ["ring", "diamond", "engagement", "wedding", "marry", "propose", "jewelry", "love"] },
  { emoji: "💎", keywords: ["diamond", "jewel", "gem", "precious", "sparkle", "rich", "ring", "shine"] },
  { emoji: "👓", keywords: ["glasses", "eyewear", "vision", "see", "nerd", "read", "spectacles", "eyes"] },
  { emoji: "🕶️", keywords: ["sunglasses", "cool", "sun", "shades", "summer", "beach", "style", "dark"] },
  { emoji: "🧤", keywords: ["gloves", "hand", "winter", "warm", "cold", "boxing", "protect", "fingers"] },
  { emoji: "🧣", keywords: ["scarf", "winter", "neck", "warm", "cold", "wrap", "fashion", "cozy"] },
  { emoji: "🧢", keywords: ["cap", "hat", "baseball", "sport", "casual", "sun", "head", "snapback"] },

  // Food & Drink
  { emoji: "🍕", keywords: ["pizza", "food", "italian", "cheese", "slice", "pepperoni", "dough"] },
  { emoji: "🍟", keywords: ["french fries", "fries", "fast food", "potato", "crispy", "salty", "mcdonalds", "ketchup", "chips"] },
  { emoji: "🍣", keywords: ["sushi", "japanese", "fish", "rice", "roll", "raw", "salmon", "tuna"] },
  { emoji: "🌮", keywords: ["taco", "mexican", "food", "wrap", "shell", "salsa", "tuesday", "nachos", "chips", "jalapeno", "tortilla"] },
  { emoji: "🍔", keywords: ["burger", "hamburger", "food", "beef", "grill", "fast food", "bun"] },
  { emoji: "🍦", keywords: ["ice cream", "cold", "sweet", "dessert", "cone", "summer", "vanilla", "gelato", "italian", "scoop", "creamy", "flavor"] },
  { emoji: "🍩", keywords: ["donut", "sweet", "dessert", "ring", "glaze", "dough", "sprinkles"] },
  { emoji: "🎂", keywords: ["cake", "birthday", "sweet", "celebrate", "candle", "party", "slice"] },
  { emoji: "🍫", keywords: ["chocolate", "sweet", "candy", "brown", "dessert", "cocoa", "bar"] },
  { emoji: "🍿", keywords: ["popcorn", "movie", "cinema", "snack", "butter", "corn", "salt"] },
  { emoji: "☕", keywords: ["coffee", "hot", "drink", "morning", "cafe", "espresso", "latte", "tiramisu", "italian dessert", "mascarpone", "ladyfinger"] },
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
  { emoji: "🧀", keywords: ["cheese", "dairy", "yellow", "pizza", "mouse", "swiss", "cheddar", "nachos", "melted", "topping"] },
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
  { emoji: "🧄", keywords: ["garlic", "cooking", "italian", "vampire", "smell", "flavor", "herb"] },
  { emoji: "🧅", keywords: ["onion", "cooking", "cry", "layers", "flavor", "peel", "ogre", "shrek", "swamp", "donkey", "fiona"] },
  { emoji: "🥕", keywords: ["carrot", "orange", "vegetable", "rabbit", "healthy", "crunch", "bugs bunny"] },
  { emoji: "🥜", keywords: ["peanut", "nut", "butter", "allergy", "snack", "shell", "elephant"] },
  { emoji: "🍞", keywords: ["bread", "toast", "bake", "wheat", "loaf", "butter", "sandwich"] },
  { emoji: "🧁", keywords: ["cupcake", "sweet", "frosting", "birthday", "bake", "small", "cake"] },
  { emoji: "🍰", keywords: ["cake", "slice", "sweet", "dessert", "strawberry", "layer", "birthday", "cheesecake", "cheese"] },
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
  { emoji: "🍗", keywords: ["chicken", "fried chicken", "drumstick", "food", "meat", "bbq", "wing"] },
  { emoji: "🥩", keywords: ["steak", "meat", "beef", "grill", "red meat", "dinner", "rare", "food"] },
  { emoji: "🍖", keywords: ["meat", "bone", "bbq", "ribs", "pork", "food", "grill", "carnivore"] },
  { emoji: "🥚", keywords: ["egg", "breakfast", "chicken", "oval", "white", "yolk", "cook", "shell"] },
  { emoji: "🧈", keywords: ["butter", "dairy", "spread", "yellow", "bread", "cook", "fat", "creamy"] },
  { emoji: "🥓", keywords: ["bacon", "breakfast", "pork", "sizzle", "crispy", "meat", "strip", "food"] },
  { emoji: "🥪", keywords: ["sandwich", "bread", "lunch", "food", "deli", "sub", "eat", "meal"] },
  { emoji: "🌶️", keywords: ["chili", "hot", "spicy", "pepper", "red", "burn", "heat", "mexican"] },
  { emoji: "🫙", keywords: ["jar", "preserve", "pickles", "mason", "store", "container", "glass"] },

  // Sports & Activities
  { emoji: "⚽", keywords: ["soccer", "football", "sport", "kick", "goal", "ball", "world cup", "pitch"] },
  { emoji: "🏀", keywords: ["basketball", "sport", "hoop", "dunk", "nba", "ball", "court", "bounce"] },
  { emoji: "🏈", keywords: ["football", "american football", "sport", "nfl", "touchdown", "field", "ball"] },
  { emoji: "⚾", keywords: ["baseball", "sport", "pitch", "bat", "home run", "mlb", "ball", "diamond"] },
  { emoji: "🎾", keywords: ["tennis", "sport", "racket", "court", "serve", "wimbledon", "ball", "net"] },
  { emoji: "🏐", keywords: ["volleyball", "sport", "spike", "net", "beach", "ball", "serve", "dig"] },
  { emoji: "🏉", keywords: ["rugby", "sport", "oval", "ball", "tackle", "scrum", "try", "field"] },
  { emoji: "🎱", keywords: ["pool", "billiards", "eight ball", "cue", "table", "game", "shoot", "ball"] },
  { emoji: "🏓", keywords: ["ping pong", "table tennis", "sport", "paddle", "ball", "spin", "serve"] },
  { emoji: "🏸", keywords: ["badminton", "sport", "racket", "shuttle", "net", "birdie", "serve"] },
  { emoji: "🥊", keywords: ["boxing", "glove", "fight", "punch", "sport", "ring", "knockout", "match"] },
  { emoji: "🥋", keywords: ["martial arts", "karate", "judo", "taekwondo", "belt", "kick", "sport"] },
  { emoji: "🎯", keywords: ["target", "aim", "goal", "bullseye", "hit", "focus", "darts", "precise"] },
  { emoji: "🏹", keywords: ["bow", "arrow", "archery", "shoot", "aim", "hunt", "cupid", "target"] },
  { emoji: "🎣", keywords: ["fishing", "fish", "rod", "catch", "lake", "hobby", "bait", "outdoor"] },
  { emoji: "🤿", keywords: ["diving", "scuba", "ocean", "mask", "underwater", "explore", "reef"] },
  { emoji: "🎿", keywords: ["ski", "skiing", "snow", "mountain", "winter", "slope", "alps", "fast", "cold"] },
  { emoji: "🛷", keywords: ["sled", "snow", "winter", "slide", "downhill", "christmas", "cold", "fun"] },
  { emoji: "🏂", keywords: ["snowboard", "snow", "mountain", "winter", "trick", "slope", "sport"] },
  { emoji: "🪂", keywords: ["parachute", "sky", "jump", "skydive", "fall", "air", "extreme", "adventure"] },
  { emoji: "🏋️", keywords: ["weightlifting", "gym", "lift", "strong", "exercise", "barbell", "sport"] },
  { emoji: "🤸", keywords: ["gymnastics", "flip", "cartwheel", "flexible", "sport", "acrobat", "jump"] },
  { emoji: "⛷️", keywords: ["skiing", "ski", "snow", "mountain", "winter", "slope", "downhill", "sport"] },
  { emoji: "🏊", keywords: ["swimming", "swim", "pool", "water", "sport", "stroke", "lane", "race"] },
  { emoji: "🚴", keywords: ["cycling", "bike", "bicycle", "ride", "sport", "race", "pedal", "tour"] },
  { emoji: "🏌️", keywords: ["golf", "sport", "club", "swing", "course", "hole", "green", "putt"] },
  { emoji: "🤾", keywords: ["handball", "throw", "sport", "ball", "court", "goal", "jump"] },
  { emoji: "🧗", keywords: ["climbing", "rock", "mountain", "scale", "grip", "wall", "sport", "high"] },
  { emoji: "🏄", keywords: ["surfing", "surf", "wave", "ocean", "beach", "board", "ride", "hawaii"] },
  { emoji: "🚣", keywords: ["rowing", "boat", "oar", "river", "water", "sport", "paddle", "crew"] },
  { emoji: "🤽", keywords: ["water polo", "swim", "sport", "pool", "ball", "water", "throw"] },

  // Places & Travel
  { emoji: "🗼", keywords: ["paris", "eiffel", "tower", "france", "romantic", "tall", "iron"] },
  { emoji: "🗽", keywords: ["new york", "statue", "liberty", "america", "nyc", "freedom", "green"] },
  { emoji: "🏰", keywords: ["castle", "kingdom", "royal", "fairy tale", "medieval", "tower", "moat"] },
  { emoji: "🎡", keywords: ["ferris wheel", "carnival", "fair", "ride", "fun", "park", "london eye"] },
  { emoji: "🎢", keywords: ["roller coaster", "ride", "fast", "fun", "theme park", "scary", "drop"] },
  { emoji: "🛕", keywords: ["temple", "india", "religion", "ancient", "worship", "asia", "hindu"] },
  { emoji: "⛩️", keywords: ["shrine", "japan", "tokyo", "gate", "red", "torii", "shinto"] },
  { emoji: "🗿", keywords: ["moai", "easter island", "statue", "stone", "ancient", "mystery", "head"] },
  { emoji: "🏟️", keywords: ["stadium", "arena", "sports", "crowd", "game", "concert", "colosseum", "gladiator", "rome", "maximus", "fight", "ancient"] },
  { emoji: "🌉", keywords: ["bridge", "night", "city", "golden gate", "river", "lights", "san francisco"] },
  { emoji: "🏙️", keywords: ["city", "skyline", "buildings", "urban", "night", "downtown", "metropolis", "divergent", "faction", "dystopia", "future", "chicago", "tris", "dauntless"] },
  { emoji: "✈️", keywords: ["plane", "fly", "travel", "airport", "trip", "jet", "vacation"] },
  { emoji: "🚀", keywords: ["rocket", "space", "launch", "nasa", "moon", "fast", "blast", "spacex", "interstellar", "wormhole", "blackhole", "nolan"] },
  { emoji: "🛸", keywords: ["ufo", "alien", "space", "fly", "mystery", "extraterrestrial", "area 51", "roswell", "new mexico", "crash", "conspiracy"] },
  { emoji: "⛵", keywords: ["sailboat", "ocean", "wind", "water", "sail", "boat", "cruise"] },
  { emoji: "🚂", keywords: ["train", "rail", "steam", "travel", "fast", "locomotive", "track"] },
  { emoji: "🚁", keywords: ["helicopter", "fly", "rotor", "blade", "rescue", "military", "hover"] },
  { emoji: "🛶", keywords: ["canoe", "paddle", "river", "kayak", "water", "boat", "outdoors"] },
  { emoji: "🏕️", keywords: ["camping", "tent", "fire", "outdoor", "nature", "forest", "stars", "hike"] },
  { emoji: "🗺️", keywords: ["map", "treasure", "travel", "explore", "journey", "navigate", "world"] },
  { emoji: "🧭", keywords: ["compass", "navigate", "direction", "north", "explore", "guide", "lost"] },
  { emoji: "🚗", keywords: ["car", "drive", "road", "fast", "vehicle", "travel", "auto"] },
  { emoji: "🚢", keywords: ["ship", "boat", "cruise", "vessel", "titanic", "ocean liner", "sail", "sea"] },
  { emoji: "⚓", keywords: ["anchor", "ship", "boat", "sea", "navy", "port", "sailor", "dock"] },
  { emoji: "🏴‍☠️", keywords: ["pirate", "flag", "skull", "ship", "treasure", "sea", "jolly roger", "hook"] },
  { emoji: "🏖️", keywords: ["beach", "sand", "sun", "ocean", "summer", "vacation", "waves", "relax"] },
  { emoji: "🌃", keywords: ["night", "city", "stars", "dark", "lights", "skyline", "moon", "urban"] },
  { emoji: "🏠", keywords: ["house", "home", "building", "live", "inside", "shelter", "roof", "family", "parasite", "rich", "mansion", "class"] },
  { emoji: "🏢", keywords: ["office", "building", "work", "city", "corporate", "business", "tall"] },
  { emoji: "🏦", keywords: ["bank", "money", "finance", "save", "rich", "vault", "institution"] },
  { emoji: "🏥", keywords: ["hospital", "doctor", "medical", "sick", "health", "nurse", "emergency"] },
  { emoji: "🏫", keywords: ["school", "education", "learn", "kids", "class", "study", "teacher"] },
  { emoji: "🏪", keywords: ["store", "shop", "buy", "mall", "retail", "market", "front", "convenience"] },
  { emoji: "🏩", keywords: ["love hotel", "romance", "hearts", "pink", "couples", "intimate"] },
  { emoji: "🏨", keywords: ["hotel", "stay", "room", "travel", "bed", "lobby", "resort", "night"] },
  { emoji: "⛪", keywords: ["church", "religion", "pray", "cross", "worship", "christian", "steeple", "unholy", "sam smith", "forbidden", "sacred"] },
  { emoji: "🕌", keywords: ["mosque", "islam", "pray", "religion", "dome", "crescent", "worship"] },
  { emoji: "🕍", keywords: ["synagogue", "jewish", "religion", "pray", "worship", "star of david"] },

  // Objects & Symbols
  { emoji: "💎", keywords: ["diamond", "jewel", "necklace", "gem", "ring", "sparkle", "precious", "shine"] },
  { emoji: "👑", keywords: ["crown", "king", "queen", "royal", "winner", "champion", "gold"] },
  { emoji: "🗡️", keywords: ["sword", "fight", "knight", "battle", "weapon", "sharp", "duel", "excalibur"] },
  { emoji: "⚔️", keywords: ["swords", "fight", "battle", "war", "cross", "duel", "knight", "clash", "weapon", "gladiator", "arena", "roman", "maximus"] },
  { emoji: "🛡️", keywords: ["shield", "protect", "knight", "defense", "armor", "guard", "block"] },
  { emoji: "🔮", keywords: ["crystal ball", "magic", "future", "predict", "witch", "fortune", "see"] },
  { emoji: "💣", keywords: ["bomb", "explode", "danger", "blast", "tick", "destroy", "countdown", "war", "dynamite", "tnt", "explosive", "fuse", "bts", "bang"] },
  { emoji: "🔫", keywords: ["gun", "pistol", "shoot", "weapon", "bang", "bullet", "wild west", "cop", "fire", "armed", "cowboy", "crime", "war", "police", "revolver", "shot", "pulp fiction", "tarantino", "gangster"] },
  { emoji: "🪃", keywords: ["boomerang", "australia", "throw", "return", "curved", "outback", "come back"] },
  { emoji: "🪖", keywords: ["helmet", "military", "soldier", "army", "war", "protect", "camouflage"] },
  { emoji: "🎖️", keywords: ["medal", "military", "honor", "award", "soldier", "war", "brave"] },
  { emoji: "🚨", keywords: ["alarm", "police", "emergency", "siren", "red", "alert", "danger", "crime"] },
  { emoji: "🔑", keywords: ["key", "lock", "open", "secret", "door", "unlock", "access"] },
  { emoji: "📚", keywords: ["book", "read", "library", "school", "study", "learn", "knowledge", "matilda", "roald dahl", "1984", "orwell", "dystopia"] },
  { emoji: "🎭", keywords: ["drama", "theatre", "act", "play", "mask", "performance", "stage"] },
  { emoji: "🎬", keywords: ["movie", "film", "cinema", "action", "director", "cut", "scene", "clapboard"] },
  { emoji: "🎵", keywords: ["music", "note", "song", "melody", "tune", "sing", "sound", "jolene", "dolly parton", "country", "levitating", "dua lipa", "float"] },
  { emoji: "🎸", keywords: ["guitar", "music", "rock", "band", "string", "electric", "strum"] },
  { emoji: "🎻", keywords: ["violin", "music", "orchestra", "strings", "bow", "classical", "concert"] },
  { emoji: "🥁", keywords: ["drum", "music", "beat", "rhythm", "band", "percussion", "rock"] },
  { emoji: "🎺", keywords: ["trumpet", "music", "jazz", "blow", "brass", "band"] },
  { emoji: "🎹", keywords: ["piano", "music", "keys", "classical", "keyboard", "play", "concert"] },
  { emoji: "🎷", keywords: ["saxophone", "jazz", "music", "blow", "cool", "blues", "band"] },
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
  { emoji: "🎮", keywords: ["game", "video game", "controller", "play", "fun", "console", "ps5", "xbox", "halo", "master chief", "spartan", "shooter", "nintendo", "mario", "zelda", "pokemon", "fortnite", "minecraft", "gaming"] },
  { emoji: "🧪", keywords: ["test tube", "science", "chemistry", "lab", "experiment", "liquid", "research"] },
  { emoji: "🔬", keywords: ["microscope", "science", "tiny", "lab", "biology", "cell", "research"] },
  { emoji: "🧬", keywords: ["dna", "genetics", "science", "biology", "helix", "code", "life"] },
  { emoji: "📡", keywords: ["satellite", "signal", "broadcast", "antenna", "space", "receive", "dish"] },
  { emoji: "🔦", keywords: ["flashlight", "light", "dark", "beam", "torch", "explore", "search"] },
  { emoji: "🕯️", keywords: ["candle", "light", "flame", "dark", "romantic", "glow", "wax", "birthday"] },
  { emoji: "🪄", keywords: ["magic wand", "trick", "wizard", "spell", "poof", "fantasy", "abracadabra"] },
  { emoji: "🎩", keywords: ["top hat", "magic", "fancy", "gentleman", "pull rabbit", "hat", "trick"] },
  { emoji: "⛏️", keywords: ["pickaxe", "mine", "dig", "gold", "mountain", "work", "minecraft"] },
  { emoji: "🔧", keywords: ["wrench", "fix", "tool", "mechanic", "repair", "bolt", "engineer"] },
  { emoji: "⚙️", keywords: ["gear", "machine", "settings", "cog", "mechanism", "factory", "work"] },
  { emoji: "🧱", keywords: ["brick", "wall", "build", "lego", "construction", "red", "block"] },
  { emoji: "🪞", keywords: ["mirror", "reflect", "vanity", "look", "snow white", "glass", "selfie"] },
  { emoji: "🚪", keywords: ["door", "entrance", "exit", "open", "knock", "close", "opportunity"] },
  { emoji: "📜", keywords: ["scroll", "map", "old", "document", "ancient", "letter", "parchment"] },
  { emoji: "📷", keywords: ["camera", "photo", "picture", "shoot", "snap", "lens", "photography"] },
  { emoji: "🎥", keywords: ["camera", "movie", "film", "record", "video", "director", "shoot"] },
  { emoji: "📺", keywords: ["tv", "television", "watch", "show", "screen", "remote", "channel", "1984", "orwell", "big brother", "surveillance", "dystopia"] },
  { emoji: "🎙️", keywords: ["microphone", "sing", "record", "podcast", "radio", "voice", "speak"] },
  { emoji: "🧸", keywords: ["teddy bear", "toy", "soft", "cute", "child", "hug", "stuffed", "comfort"] },
  { emoji: "🎁", keywords: ["gift", "present", "wrap", "birthday", "surprise", "box", "ribbon"] },
  { emoji: "🎉", keywords: ["party", "celebrate", "fun", "confetti", "birthday", "cheer", "pop"] },
  { emoji: "🎈", keywords: ["balloon", "party", "float", "red", "celebrate", "birthday", "air"] },
  { emoji: "✨", keywords: ["sparkle", "magic", "shine", "glitter", "star", "special", "fairy", "levitating", "float", "hover", "halo", "glow"] },
  { emoji: "🧩", keywords: ["puzzle", "piece", "solve", "mystery", "fit", "game", "jigsaw"] },
  { emoji: "♟️", keywords: ["chess", "strategy", "game", "king", "queen", "pawn", "think", "checkmate"] },
  { emoji: "🎲", keywords: ["dice", "random", "game", "luck", "roll", "chance", "board game"] },
  { emoji: "🃏", keywords: ["card", "joker", "game", "magic", "trick", "wild", "poker", "play"] },
  { emoji: "🧧", keywords: ["red envelope", "chinese new year", "money", "gift", "lucky", "red"] },
  { emoji: "🛟", keywords: ["lifebuoy", "rescue", "save", "float", "ring", "safety", "ocean"] },
  { emoji: "🦇", keywords: ["bat", "night", "dracula", "vampire", "dark", "cave", "halloween", "fly"] },
  { emoji: "🪦", keywords: ["grave", "death", "buried", "tombstone", "cemetery", "rip", "ghost"] },
  { emoji: "🔪", keywords: ["knife", "cut", "sharp", "horror", "cook", "weapon", "blade", "stab"] },
  { emoji: "☠️", keywords: ["skull", "crossbones", "pirate", "poison", "death", "danger", "dead"] },
  { emoji: "🎪", keywords: ["circus", "fun", "show", "entertainment", "tent", "clown", "acrobat"] },
  { emoji: "❤️", keywords: ["love", "heart", "romance", "valentines", "care", "red", "passion"] },
  { emoji: "💔", keywords: ["heartbreak", "sad", "loss", "broken", "hurt", "split", "end"] },
  { emoji: "💥", keywords: ["explosion", "bang", "pow", "comic", "crash", "impact", "boom"] },
  { emoji: "🌀", keywords: ["spiral", "cyclone", "dizzy", "spin", "tornado", "swirl", "hypnotic", "inception", "spinning", "top", "dream"] },
  { emoji: "👍", keywords: ["yes", "good", "approve", "agree", "like", "thumbs up", "ok", "correct"] },
  { emoji: "👎", keywords: ["no", "bad", "disagree", "dislike", "thumbs down", "wrong", "reject"] },
  { emoji: "✅", keywords: ["yes", "check", "correct", "done", "complete", "right", "confirm", "true"] },
  { emoji: "❌", keywords: ["no", "wrong", "cancel", "false", "x", "stop", "delete", "incorrect"] },
  { emoji: "💬", keywords: ["talk", "speak", "say", "chat", "word", "message", "conversation", "text"] },
  { emoji: "👋", keywords: ["wave", "hello", "goodbye", "hi", "bye", "greet", "hand"] },
  { emoji: "🤝", keywords: ["handshake", "deal", "agree", "meet", "partner", "shake", "business"] },
  { emoji: "🙏", keywords: ["pray", "please", "thank", "hope", "wish", "beg", "grateful", "namaste"] },
  { emoji: "😡", keywords: ["angry", "mad", "rage", "furious", "red", "upset", "anger", "hostile"] },
  { emoji: "😮", keywords: ["surprised", "shocked", "wow", "gasp", "open mouth", "amazed", "oh"] },
  { emoji: "💯", keywords: ["perfect", "100", "yes", "correct", "excellent", "full", "complete", "real"] },
  { emoji: "🚫", keywords: ["no", "not", "banned", "forbidden", "stop", "cancel", "prohibited", "never"] },
  { emoji: "🏁", keywords: ["checkered flag", "finish", "race", "win", "end", "formula one", "done"] },
  { emoji: "🚩", keywords: ["red flag", "warning", "danger", "mark", "signal", "alert", "flag"] },
  { emoji: "🏳️", keywords: ["white flag", "surrender", "peace", "give up", "truce", "flag"] },
  { emoji: "‼️", keywords: ["exclamation", "important", "urgent", "double", "warning", "shout", "loud", "emphasis", "wow"] },
  { emoji: "❓", keywords: ["question", "confused", "unknown", "ask", "wonder", "huh", "what", "mystery"] },
  { emoji: "❗", keywords: ["exclamation", "important", "alert", "warning", "urgent", "shout", "emphasis"] },
  { emoji: "⁉️", keywords: ["what", "exclamation", "question", "surprise", "confused", "shocked", "huh"] },
  { emoji: "💢", keywords: ["anger", "mad", "frustration", "comic", "vein", "annoyed", "rage", "symbol"] },
  { emoji: "💬", keywords: ["speech", "talk", "say", "chat", "bubble", "message", "word", "conversation"] },
  { emoji: "💭", keywords: ["thought", "think", "dream", "imagine", "wonder", "bubble", "idea", "cloud"] },

  // Misc additions for topic coverage
  { emoji: "🪱", keywords: ["worm", "parasite", "crawl", "underground", "dune", "sandworm", "bug", "soil", "gross", "dig"] },
  { emoji: "🌐", keywords: ["avatar", "pandora", "global", "planet", "world", "alien", "blue", "network", "web", "sphere"] },
  { emoji: "⭕", keywords: ["halo", "ring", "circle", "round", "zero", "loop", "orbit", "glow", "sacred"] },
  { emoji: "💼", keywords: ["briefcase", "business", "work", "lawyer", "pulp fiction", "carry", "suit", "office", "professional"] },
  { emoji: "⚖️", keywords: ["law", "justice", "balance", "legally blonde", "court", "judge", "lawyer", "fair", "scales"] },
  { emoji: "💅", keywords: ["nails", "fashion", "beauty", "salon", "clueless", "valley girl", "pink", "manicure", "feminine", "glamour"] },
  { emoji: "🏛️", keywords: ["santorini", "greece", "columns", "ancient", "architecture", "marble", "monument", "classic", "white", "temple"] },

  // Craft, sewing, tools
  { emoji: "🧵", keywords: ["thread", "string", "sew", "needle", "stitch", "yarn", "fabric", "craft", "thin"] },
  { emoji: "🪡", keywords: ["spool", "thread", "string", "sew", "craft", "wind", "yarn", "needle"] },
  { emoji: "🧶", keywords: ["yarn", "knit", "wool", "string", "craft", "ball", "soft", "loop"] },
  { emoji: "📌", keywords: ["pin", "push pin", "tack", "stick", "map", "point", "red", "attach"] },
  { emoji: "📍", keywords: ["pin", "location", "map", "point", "place", "mark", "stick", "red"] },
  { emoji: "🪢", keywords: ["knot", "rope", "string", "tie", "bind", "loop", "tangle", "twist"] },
  { emoji: "🔗", keywords: ["chain", "link", "connect", "string", "attach", "bind", "together"] },
  { emoji: "💉", keywords: ["needle", "syringe", "shot", "inject", "medical", "vaccine", "sharp", "doctor"] },
  { emoji: "🪡", keywords: ["needle", "thread", "sew", "string", "craft", "thin", "sharp"] },
  { emoji: "🎋", keywords: ["bamboo", "stick", "green", "japan", "tall", "thin", "pole", "nature"] },
  { emoji: "🥢", keywords: ["chopsticks", "sticks", "eat", "japanese", "chinese", "food", "pair", "thin"] },
  { emoji: "🪄", keywords: ["wand", "stick", "magic", "wizard", "spell", "thin", "wave"] },
  { emoji: "🏒", keywords: ["hockey stick", "stick", "sport", "ice", "hockey", "hit", "puck"] },
  { emoji: "🥍", keywords: ["lacrosse", "stick", "sport", "net", "field", "catch", "throw"] },
  { emoji: "🎿", keywords: ["ski", "stick", "pole", "snow", "winter", "sport", "slide"] },
  { emoji: "🖊️", keywords: ["pen", "stick", "write", "thin", "ink", "point", "draw"] },

  // Food additions
  { emoji: "🥨", keywords: ["pretzel", "bread", "twisted", "baked", "salty", "snack", "german", "knot", "dough"] },
  { emoji: "🍘", keywords: ["cracker", "rice cracker", "japanese", "thin", "crispy", "snack", "flat"] },
  { emoji: "🫙", keywords: ["cracker", "jar", "container", "store", "preserve", "glass"] },
  { emoji: "🥟", keywords: ["dumpling", "dumplings", "chinese", "japanese", "gyoza", "potsticker", "steam", "fold", "asian", "dim sum"] },
  { emoji: "🧆", keywords: ["falafel", "chickpea", "middle eastern", "fried", "ball", "pita", "hummus", "crispy", "israeli"] },
  { emoji: "🍅", keywords: ["tomato", "red", "vegetable", "fruit", "blt", "salad", "sauce", "ketchup", "fresh", "garden"] },
  { emoji: "🥬", keywords: ["lettuce", "green", "salad", "leaf", "blt", "wrap", "fresh", "crispy", "vegetable"] },
  { emoji: "🫘", keywords: ["beans", "chickpea", "hummus", "legume", "protein", "brown", "kidney", "black bean"] },
  { emoji: "🧇", keywords: ["churro", "waffle", "fried", "dough", "sweet", "crispy", "cinnamon", "spanish", "fair", "snack"] },
  { emoji: "🍮", keywords: ["custard", "creme brulee", "flan", "pudding", "dessert", "caramel", "french", "sweet", "brulee"] },
  { emoji: "🥙", keywords: ["kebab", "wrap", "pita", "middle eastern", "grilled", "meat", "falafel", "turkish", "shawarma"] },
  { emoji: "🧋", keywords: ["tiramisu", "boba", "bubble tea", "coffee", "creamy", "italian", "layered", "mascarpone"] },

  // Colors — squares and circles
  { emoji: "🟥", keywords: ["red", "square", "color", "block", "bright", "stop", "danger"] },
  { emoji: "🟧", keywords: ["orange", "square", "color", "block", "warm", "bright"] },
  { emoji: "🟨", keywords: ["yellow", "square", "color", "block", "bright", "sun", "gold"] },
  { emoji: "🟩", keywords: ["green", "square", "color", "block", "nature", "go", "safe"] },
  { emoji: "🟦", keywords: ["blue", "square", "color", "block", "sky", "ocean", "cool", "avatar", "pandora", "navi"] },
  { emoji: "🟪", keywords: ["purple", "square", "color", "block", "violet", "royal", "grape"] },
  { emoji: "🟫", keywords: ["brown", "square", "color", "block", "earth", "wood", "chocolate"] },
  { emoji: "⬛", keywords: ["black", "square", "color", "block", "dark", "night", "void"] },
  { emoji: "⬜", keywords: ["white", "square", "color", "block", "blank", "empty", "clean", "snow", "pure"] },
  { emoji: "🔴", keywords: ["red", "circle", "color", "round", "stop", "danger", "dot"] },
  { emoji: "🟠", keywords: ["orange", "circle", "color", "round", "warm", "bright"] },
  { emoji: "🟡", keywords: ["yellow", "circle", "color", "round", "sun", "bright", "gold"] },
  { emoji: "🟢", keywords: ["green", "circle", "color", "round", "go", "nature", "safe"] },
  { emoji: "🔵", keywords: ["blue", "circle", "color", "round", "sky", "ocean", "cool"] },
  { emoji: "🟣", keywords: ["purple", "circle", "color", "round", "violet", "royal"] },
  { emoji: "🟤", keywords: ["brown", "circle", "color", "round", "earth", "wood", "chocolate"] },
  { emoji: "⚫", keywords: ["black", "circle", "color", "round", "dark", "night", "dot"] },
  { emoji: "⚪", keywords: ["white", "circle", "color", "round", "blank", "empty", "clean", "snow"] },
  { emoji: "🔶", keywords: ["orange", "diamond", "color", "shape", "bright", "large"] },
  { emoji: "🔷", keywords: ["blue", "diamond", "color", "shape", "cool", "large"] },
  { emoji: "🔸", keywords: ["orange", "diamond", "color", "shape", "small", "bright"] },
  { emoji: "🔹", keywords: ["blue", "diamond", "color", "shape", "small", "cool"] },

  // Olive / food colors
  { emoji: "🫒", keywords: ["olive", "green", "food", "mediterranean", "italian", "oil", "small", "salty", "branch"] },
  { emoji: "🌿", keywords: ["olive", "green", "herb", "branch", "leaf", "plant", "nature", "fresh", "natural", "organic", "raw", "born", "imagine dragons"] },

  // Country flags
  { emoji: "🇺🇸", keywords: ["usa", "america", "united states", "american", "flag", "stars", "stripes"] },
  { emoji: "🇬🇧", keywords: ["uk", "britain", "england", "british", "flag", "union jack", "london"] },
  { emoji: "🇫🇷", keywords: ["france", "french", "paris", "flag", "europe"] },
  { emoji: "🇩🇪", keywords: ["germany", "german", "deutschland", "flag", "europe"] },
  { emoji: "🇯🇵", keywords: ["japan", "japanese", "tokyo", "flag", "asia", "rising sun"] },
  { emoji: "🇨🇳", keywords: ["china", "chinese", "beijing", "flag", "asia"] },
  { emoji: "🇰🇷", keywords: ["korea", "south korea", "korean", "flag", "asia", "seoul"] },
  { emoji: "🇧🇷", keywords: ["brazil", "brazilian", "flag", "south america", "amazon"] },
  { emoji: "🇲🇽", keywords: ["mexico", "mexican", "flag", "latin america", "spanish"] },
  { emoji: "🇨🇦", keywords: ["canada", "canadian", "maple leaf", "flag", "north america"] },
  { emoji: "🇦🇺", keywords: ["australia", "australian", "flag", "down under", "sydney"] },
  { emoji: "🇮🇳", keywords: ["india", "indian", "flag", "asia", "mumbai", "delhi"] },
  { emoji: "🇮🇹", keywords: ["italy", "italian", "rome", "flag", "europe", "pizza", "pasta"] },
  { emoji: "🇪🇸", keywords: ["spain", "spanish", "madrid", "flag", "europe", "barcelona"] },
  { emoji: "🇵🇹", keywords: ["portugal", "portuguese", "lisbon", "flag", "europe"] },
  { emoji: "🇷🇺", keywords: ["russia", "russian", "moscow", "flag", "europe", "asia"] },
  { emoji: "🇳🇱", keywords: ["netherlands", "dutch", "holland", "amsterdam", "flag", "europe"] },
  { emoji: "🇧🇪", keywords: ["belgium", "belgian", "brussels", "flag", "europe", "chocolate", "waffles"] },
  { emoji: "🇨🇭", keywords: ["switzerland", "swiss", "zurich", "flag", "europe", "chocolate", "alps"] },
  { emoji: "🇦🇹", keywords: ["austria", "austrian", "vienna", "flag", "europe", "alps"] },
  { emoji: "🇸🇪", keywords: ["sweden", "swedish", "stockholm", "flag", "scandinavia", "europe"] },
  { emoji: "🇳🇴", keywords: ["norway", "norwegian", "oslo", "flag", "scandinavia", "europe"] },
  { emoji: "🇩🇰", keywords: ["denmark", "danish", "copenhagen", "flag", "scandinavia", "europe"] },
  { emoji: "🇫🇮", keywords: ["finland", "finnish", "helsinki", "flag", "scandinavia", "europe"] },
  { emoji: "🇵🇱", keywords: ["poland", "polish", "warsaw", "flag", "europe"] },
  { emoji: "🇬🇷", keywords: ["greece", "greek", "athens", "flag", "europe", "mediterranean", "santorini", "island", "white", "blue dome"] },
  { emoji: "🇹🇷", keywords: ["turkey", "turkish", "istanbul", "flag", "europe", "asia"] },
  { emoji: "🇸🇦", keywords: ["saudi arabia", "saudi", "riyadh", "flag", "middle east", "arabic"] },
  { emoji: "🇦🇪", keywords: ["uae", "dubai", "emirates", "arab", "flag", "middle east"] },
  { emoji: "🇮🇱", keywords: ["israel", "israeli", "jerusalem", "flag", "middle east"] },
  { emoji: "🇪🇬", keywords: ["egypt", "egyptian", "cairo", "pyramids", "flag", "africa"] },
  { emoji: "🇿🇦", keywords: ["south africa", "flag", "africa", "cape town"] },
  { emoji: "🇳🇬", keywords: ["nigeria", "nigerian", "lagos", "flag", "africa"] },
  { emoji: "🇰🇪", keywords: ["kenya", "kenyan", "nairobi", "flag", "africa"] },
  { emoji: "🇦🇷", keywords: ["argentina", "argentinian", "buenos aires", "flag", "south america"] },
  { emoji: "🇨🇴", keywords: ["colombia", "colombian", "bogota", "flag", "south america"] },
  { emoji: "🇨🇱", keywords: ["chile", "chilean", "santiago", "flag", "south america"] },
  { emoji: "🇵🇪", keywords: ["peru", "peruvian", "lima", "flag", "south america", "machu picchu"] },
  { emoji: "🇹🇭", keywords: ["thailand", "thai", "bangkok", "flag", "asia", "southeast asia"] },
  { emoji: "🇻🇳", keywords: ["vietnam", "vietnamese", "hanoi", "flag", "asia", "southeast asia"] },
  { emoji: "🇵🇭", keywords: ["philippines", "filipino", "manila", "flag", "asia", "southeast asia"] },
  { emoji: "🇮🇩", keywords: ["indonesia", "indonesian", "jakarta", "bali", "flag", "asia"] },
  { emoji: "🇲🇾", keywords: ["malaysia", "malaysian", "kuala lumpur", "flag", "asia"] },
  { emoji: "🇸🇬", keywords: ["singapore", "singaporean", "flag", "asia", "southeast asia"] },
  { emoji: "🇳🇿", keywords: ["new zealand", "kiwi", "flag", "pacific", "auckland"] },
  { emoji: "🇮🇪", keywords: ["ireland", "irish", "dublin", "flag", "europe", "shamrock"] },
  { emoji: "🇨🇿", keywords: ["czech republic", "czechia", "prague", "flag", "europe"] },
  { emoji: "🇭🇺", keywords: ["hungary", "hungarian", "budapest", "flag", "europe"] },
  { emoji: "🇷🇴", keywords: ["romania", "romanian", "bucharest", "flag", "europe"] },
  { emoji: "🇺🇦", keywords: ["ukraine", "ukrainian", "kyiv", "flag", "europe"] },
  { emoji: "🇵🇰", keywords: ["pakistan", "pakistani", "islamabad", "flag", "asia"] },
  { emoji: "🇧🇩", keywords: ["bangladesh", "bangladeshi", "dhaka", "flag", "asia"] },
  { emoji: "🇲🇦", keywords: ["morocco", "moroccan", "marrakech", "flag", "africa", "north africa"] },
  { emoji: "🇨🇺", keywords: ["cuba", "cuban", "havana", "flag", "caribbean", "latin america"] },
  { emoji: "🇯🇲", keywords: ["jamaica", "jamaican", "kingston", "flag", "caribbean", "reggae"] },
  { emoji: "🇮🇸", keywords: ["iceland", "icelandic", "reykjavik", "flag", "europe", "nordic"] },
  { emoji: "🇵🇦", keywords: ["panama", "panamanian", "flag", "central america", "canal"] },
  { emoji: "🎌", keywords: ["japan", "flag", "crossed", "country", "asian", "tokyo", "red"] },
  { emoji: "🏴‍☠️", keywords: ["pirate", "flag", "skull", "ship", "treasure", "jolly roger"] },
  { emoji: "🚩", keywords: ["red flag", "warning", "danger", "mark", "signal", "alert"] },

  // Video Game emojis
  { emoji: "🎮", keywords: ["video game", "controller", "play", "console", "xbox", "playstation", "nintendo", "gaming", "gamer", "joystick"] },
  { emoji: "👾", keywords: ["alien", "space invaders", "pixel", "arcade", "retro", "game", "monster", "8 bit", "video game"] },
  { emoji: "🕹️", keywords: ["joystick", "arcade", "retro", "game", "control", "play", "old school", "pac man"] },
  { emoji: "🃏", keywords: ["card", "wild", "joker", "game", "poker", "play", "trump"] },
  { emoji: "🧱", keywords: ["brick", "block", "minecraft", "build", "lego", "wall", "construction", "tetris"] },
  { emoji: "⛏️", keywords: ["pickaxe", "mine", "minecraft", "dig", "craft", "gold", "diamond", "cave"] },
  { emoji: "🏰", keywords: ["castle", "zelda", "kingdom", "medieval", "princess", "tower", "fortress", "dungeon"] },
  { emoji: "🍄", keywords: ["mushroom", "mario", "power up", "super", "grow", "toadstool", "1up"] },
  { emoji: "⭐", keywords: ["star", "mario", "power", "collect", "shine", "invincible", "wish", "super"] },
  { emoji: "🔫", keywords: ["gun", "shoot", "call of duty", "fortnite", "fps", "weapon", "battle", "war"] },
  { emoji: "🗡️", keywords: ["sword", "zelda", "link", "fight", "knight", "weapon", "slash", "rpg"] },
  { emoji: "🐲", keywords: ["dragon", "pokemon", "fantasy", "breathe fire", "beast", "legend", "dragonite"] },
  { emoji: "⚡", keywords: ["pikachu", "pokemon", "electric", "thunder", "lightning", "bolt", "fast", "power"] },
  { emoji: "🎯", keywords: ["target", "aim", "sniper", "call of duty", "bullseye", "precision", "hit", "shoot"] },
  { emoji: "🏆", keywords: ["trophy", "win", "champion", "achievement", "unlocked", "gold", "first place", "victory"] },
  { emoji: "💎", keywords: ["diamond", "minecraft", "gem", "rare", "precious", "collect", "currency", "wealth"] },
  { emoji: "🧟", keywords: ["zombie", "undead", "call of duty", "apocalypse", "horror", "shuffle", "brain", "dead"] },
  { emoji: "🚗", keywords: ["car", "gta", "grand theft auto", "racing", "drive", "vehicle", "speed", "road"] },
  { emoji: "🏙️", keywords: ["city", "gta", "grand theft auto", "urban", "downtown", "skyline", "crime", "streets"] },
  { emoji: "🌿", keywords: ["creeper", "minecraft", "green", "plant", "nature", "jungle", "grass", "garden"] },
  { emoji: "🎪", keywords: ["circus", "fortnite", "event", "show", "battle royale", "arena", "spectacle"] },
  { emoji: "🪂", keywords: ["parachute", "fortnite", "drop", "skydive", "battle royale", "land", "fall", "air"] },
  { emoji: "🏝️", keywords: ["island", "fortnite", "battle royale", "tropical", "map", "zone", "paradise"] },
  { emoji: "🦑", keywords: ["squid", "splatoon", "ink", "ocean", "tentacle", "nintendo", "shoot"] },

  // Sports emojis  
  { emoji: "⚽", keywords: ["soccer", "football", "messi", "ronaldo", "world cup", "kick", "goal", "pitch", "pele"] },
  { emoji: "🏀", keywords: ["basketball", "lebron", "jordan", "kobe", "nba", "dunk", "hoop", "court", "slam"] },
  { emoji: "🏈", keywords: ["football", "nfl", "tom brady", "touchdown", "super bowl", "field", "quarterback"] },
  { emoji: "⚾", keywords: ["baseball", "babe ruth", "home run", "pitcher", "mlb", "bat", "world series"] },
  { emoji: "🎾", keywords: ["tennis", "federer", "nadal", "djokovic", "serena", "wimbledon", "racket", "serve"] },
  { emoji: "🥊", keywords: ["boxing", "muhammad ali", "mike tyson", "punch", "fight", "ring", "knockout", "jab"] },
  { emoji: "🏊", keywords: ["swimming", "michael phelps", "pool", "olympics", "stroke", "race", "water", "gold"] },
  { emoji: "🏃", keywords: ["running", "usain bolt", "sprint", "marathon", "race", "fast", "athletics", "track"] },
  { emoji: "🤸", keywords: ["gymnastics", "simone biles", "flip", "vault", "olympics", "flexible", "routine"] },
  { emoji: "⛳", keywords: ["golf", "tiger woods", "hole", "club", "fairway", "putt", "green", "birdie", "masters"] },
  { emoji: "🏒", keywords: ["hockey", "gretzky", "puck", "stick", "ice", "nhl", "stanley cup", "slap shot"] },
  { emoji: "🚴", keywords: ["cycling", "tour de france", "bike", "race", "pedal", "road", "velodrome", "sprint"] },
  { emoji: "🏋️", keywords: ["weightlifting", "strong", "olympics", "lift", "barbell", "gym", "power", "clean jerk"] },
  { emoji: "🥇", keywords: ["gold medal", "olympics", "first place", "champion", "winner", "podium", "best"] },
  { emoji: "🏟️", keywords: ["stadium", "arena", "super bowl", "world cup", "crowd", "game", "sport", "event"] },
  { emoji: "🎽", keywords: ["jersey", "uniform", "team", "sport", "wear", "athlete", "number", "kit"] },
  { emoji: "🏄", keywords: ["surfing", "pipeline", "wave", "board", "beach", "ocean", "ride", "wipeout"] },
  { emoji: "🎿", keywords: ["skiing", "downhill", "alpine", "slope", "winter", "olympics", "snow", "slalom"] },
  { emoji: "🤼", keywords: ["wrestling", "wwe", "grapple", "pin", "match", "ring", "takedown", "submission"] },
  { emoji: "🏇", keywords: ["horse racing", "derby", "jockey", "bet", "thoroughbred", "kentucky", "race", "gallop"] },

  // Superhero emojis
  { emoji: "🦸", keywords: ["superhero", "hero", "super", "cape", "power", "save", "strong", "marvel", "dc", "comic"] },
  { emoji: "🦹", keywords: ["villain", "evil", "bad guy", "nemesis", "dark", "sinister", "enemy", "joker", "thanos"] },
  { emoji: "🕷️", keywords: ["spider", "spiderman", "web", "spider-man", "peter parker", "marvel", "swing", "arachnid"] },
  { emoji: "🦇", keywords: ["bat", "batman", "bruce wayne", "gotham", "dark knight", "night", "cave", "dc"] },
  { emoji: "⚡", keywords: ["flash", "lightning", "electric", "speed", "fast", "bolt", "thunder", "quicksilver", "dc"] },
  { emoji: "🔨", keywords: ["hammer", "thor", "mjolnir", "worthy", "asgard", "thunder god", "avengers", "strike"] },
  { emoji: "🛡️", keywords: ["shield", "captain america", "defend", "protect", "vibranium", "avengers", "marvel", "block"] },
  { emoji: "💚", keywords: ["hulk", "green", "smash", "angry", "strong", "gamma", "bruce banner", "avengers"] },
  { emoji: "🕶️", keywords: ["cool", "iron man", "tony stark", "sunglasses", "style", "billionaire", "genius"] },
  { emoji: "🌙", keywords: ["moon knight", "night", "dark", "batman", "shadow", "lurk", "crescent", "lunar"] },
  { emoji: "🕸️", keywords: ["web", "spiderman", "spider", "trap", "sticky", "swing", "network", "spin"] },
  { emoji: "💜", keywords: ["thanos", "purple", "infinity", "gauntlet", "snap", "villain", "powerful", "marvel"] },
  { emoji: "🌊", keywords: ["aquaman", "ocean", "water", "sea", "atlantis", "wave", "trident", "dc"] },
  { emoji: "👑", keywords: ["black panther", "king", "wakanda", "royal", "crown", "vibranium", "africa", "marvel"] },
  { emoji: "🐺", keywords: ["wolverine", "claws", "animal", "feral", "x-men", "mutant", "logan", "adamantium"] },
  { emoji: "🃏", keywords: ["joker", "wild card", "batman villain", "chaos", "card", "clown", "gotham", "madman"] },
  { emoji: "💣", keywords: ["bomb", "villain", "explosion", "destroy", "danger", "boom", "detonate", "threat"] },
  { emoji: "🎭", keywords: ["two-face", "mask", "duality", "villain", "actor", "persona", "dc", "batman"] },
  { emoji: "❄️", keywords: ["ice", "frozen", "mr freeze", "iceman", "cold", "crystal", "winter", "chill", "frostbite"] },
  { emoji: "🔥", keywords: ["fire", "human torch", "flame", "burn", "hot", "blaze", "pyro", "inferno", "ghost rider"] },
  { emoji: "🧲", keywords: ["magnet", "magneto", "attract", "metal", "pull", "force", "mutant", "x-men", "villain"] },
  { emoji: "💸", keywords: ["money", "lex luthor", "billionaire", "rich", "corporate", "villain", "power", "wealth"] },
  { emoji: "🃏", keywords: ["harley quinn", "joker", "chaos", "clown", "wild", "batman", "gotham", "villain"] },

  // Gap fixes for new categories
  { emoji: "🔪", keywords: ["among us", "kill", "impostor", "sus", "knife", "blade", "sharp", "stab", "horror"] },
  { emoji: "🚀", keywords: ["among us", "space", "spaceship", "rocket", "crew", "task", "nasa", "launch", "blast"] },
  { emoji: "🤖", keywords: ["ultron", "robot", "ai", "android", "machine", "avengers", "metal", "cyber", "doom"] },
  { emoji: "🌆", keywords: ["cyberpunk", "city", "neon", "future", "night city", "dystopia", "urban", "2077", "tech"] },
  { emoji: "💀", keywords: ["doom", "skull", "death", "game", "demon", "hell", "undead", "bones", "bane"] },
  { emoji: "🔵", keywords: ["mystique", "blue", "shapeshifter", "mutant", "x-men", "circle", "color", "round"] },
  { emoji: "🦶", keywords: ["pele", "brazil", "soccer", "kick", "foot", "football", "legend", "goal", "brazil"] },
  { emoji: "🌌", keywords: ["galactus", "space", "universe", "cosmos", "stars", "galaxy", "infinite", "vast", "silver surfer"] },
  { emoji: "🏔️", keywords: ["bane", "mountain", "strong", "villain", "batman", "rise", "dark knight", "mask", "breaks"] },

  // Animals — expanded
  { emoji: "🐒", keywords: ["monkey", "primate", "jungle", "banana", "swing", "ape", "climb", "zoo", "silly"] },
  { emoji: "🦍", keywords: ["gorilla", "ape", "kong", "donkey kong", "donkey", "strong", "jungle", "big", "pound", "chest", "nintendo", "mario", "barrel"] },
  { emoji: "🐴", keywords: ["donkey", "mule", "bray", "stubborn", "farm", "kick", "horse", "grey", "beast"] },
  { emoji: "🦄", keywords: ["unicorn", "magic", "rare", "horn", "rainbow", "fantasy", "horse", "mythical"] },
  { emoji: "🐊", keywords: ["crocodile", "snap", "swamp", "reptile", "teeth", "green", "danger", "croc"] },
  { emoji: "🦋", keywords: ["butterfly", "transform", "wings", "colorful", "flutter", "change", "cocoon"] },
  { emoji: "🐌", keywords: ["snail", "slow", "shell", "garden", "slime", "trail", "pace", "crawl"] },
  { emoji: "🦗", keywords: ["cricket", "bug", "chirp", "jump", "insect", "grass", "night", "sound"] },
  { emoji: "🦠", keywords: ["virus", "bacteria", "germ", "micro", "sick", "tiny", "spread", "infection", "covid"] },
  { emoji: "🐾", keywords: ["paw", "animal", "tracks", "dog", "cat", "footprint", "pet", "clue"] },
  { emoji: "🦴", keywords: ["bone", "dog", "skeleton", "chew", "fossil", "dinosaur", "fetch", "treat"] },

  // Nintendo / Gaming items
  { emoji: "🍄", keywords: ["mario", "mushroom", "power up", "1up", "super mario", "nintendo", "grow", "toadstool"] },
  { emoji: "⭐", keywords: ["star", "mario", "invincible", "collect", "shine", "nintendo", "zelda", "wish", "power"] },
  { emoji: "🔴", keywords: ["nintendo", "mario", "red", "circle", "stop", "button", "dot", "color"] },
  { emoji: "🎮", keywords: ["nintendo", "switch", "controller", "gaming", "play", "console", "handheld", "game"] },
  { emoji: "👾", keywords: ["nintendo", "retro", "arcade", "8 bit", "pixel", "space invaders", "old school", "classic"] },
  { emoji: "🟡", keywords: ["pac-man", "pacman", "yellow", "circle", "dot", "chomp", "ghost", "arcade", "gold"] },

  // Objects — ladder, tools, misc
  { emoji: "🪜", keywords: ["ladder", "climb", "steps", "reach", "rung", "fire escape", "donkey kong", "donkey", "kong", "ascend", "tall", "nintendo"] },
  { emoji: "🔩", keywords: ["bolt", "screw", "metal", "fix", "tight", "nut", "fasten", "mechanical", "tool"] },
  { emoji: "🪝", keywords: ["hook", "hang", "catch", "crane", "pirate", "captain hook", "latch", "attach"] },
  { emoji: "🧲", keywords: ["magnet", "attract", "pull", "metal", "stick", "force", "north", "south", "mario"] },
  { emoji: "📦", keywords: ["box", "package", "crate", "ship", "minecraft", "item", "storage", "cargo", "present"] },
  { emoji: "🪣", keywords: ["bucket", "water", "carry", "pail", "spill", "paint", "list", "kick the bucket"] },
  { emoji: "🔑", keywords: ["key", "unlock", "door", "zelda", "dungeon", "secret", "access", "open", "lock"] },
  { emoji: "🗝️", keywords: ["old key", "antique", "unlock", "dungeon", "zelda", "secret", "castle", "treasure", "ancient"] },
  { emoji: "💰", keywords: ["coin", "mario", "money", "gold", "collect", "rich", "treasure", "bag", "dollar"] },
  { emoji: "🪙", keywords: ["coin", "mario", "gold", "collect", "metal", "flip", "currency", "treasure", "shiny"] },

  // Law, crime, justice
  { emoji: "⛓️", keywords: ["chain", "handcuffs", "arrest", "prisoner", "bound", "jail", "metal", "link", "shackle", "captive"] },
  { emoji: "🔒", keywords: ["lock", "jail", "prison", "secure", "locked", "padlock", "closed", "trapped", "cell"] },
  { emoji: "🚔", keywords: ["police car", "cop", "arrest", "siren", "law", "crime", "chase", "blue light"] },
  { emoji: "👮", keywords: ["police", "officer", "cop", "law", "badge", "arrest", "jail", "handcuff", "authority"] },
  { emoji: "🏛️", keywords: ["court", "justice", "law", "judge", "trial", "government", "columns", "senate", "building"] },
  { emoji: "⚖️", keywords: ["justice", "law", "balance", "court", "judge", "fair", "scales", "trial", "verdict"] },
  { emoji: "🔐", keywords: ["locked", "secure", "prison", "cell", "key", "padlock", "closed", "trap", "jail"] },
  { emoji: "🚨", keywords: ["siren", "alarm", "police", "emergency", "arrest", "crime", "red light", "alert"] },
  { emoji: "📋", keywords: ["clipboard", "list", "record", "evidence", "document", "report", "checklist", "case"] },
  { emoji: "🕵️", keywords: ["detective", "spy", "investigate", "clue", "mystery", "case", "solve", "undercover", "magnify"] },
  { emoji: "🔍", keywords: ["magnify", "search", "investigate", "detective", "clue", "find", "look", "evidence", "zoom"] },

  // US States (searchable by name)
  { emoji: "🌵", keywords: ["arizona", "texas", "new mexico", "nevada", "desert", "southwest", "cactus", "dry", "west"] },
  { emoji: "🎰", keywords: ["nevada", "las vegas", "casino", "gamble", "slot", "bet", "luck", "jackpot", "gambler"] },
  { emoji: "🌽", keywords: ["iowa", "illinois", "indiana", "corn belt", "midwest", "farm", "field", "harvest", "yellow"] },
  { emoji: "🦞", keywords: ["maine", "boston", "new england", "lobster", "seafood", "ocean", "northeast", "coast"] },
  { emoji: "🍑", keywords: ["georgia", "peach", "south", "sweet", "fruit", "southern", "state"] },
  { emoji: "🌲", keywords: ["oregon", "washington", "pacific northwest", "forest", "evergreen", "tree", "woods", "rain"] },
  { emoji: "🌊", keywords: ["hawaii", "california", "florida", "ocean", "surf", "beach", "coast", "waves"] },
  { emoji: "❄️", keywords: ["alaska", "minnesota", "michigan", "wisconsin", "cold", "snow", "winter", "north", "frozen"] },
  { emoji: "🏔️", keywords: ["colorado", "montana", "wyoming", "rocky mountains", "peak", "climb", "altitude", "ski"] },
  { emoji: "🎸", keywords: ["tennessee", "nashville", "country music", "memphis", "blues", "music", "guitar", "twang"] },
  { emoji: "🌶️", keywords: ["new mexico", "louisiana", "texas", "spicy", "hot", "pepper", "cajun", "south", "heat"] },
  { emoji: "🎷", keywords: ["louisiana", "new orleans", "jazz", "saxophone", "blues", "music", "creole", "bayou"] },
  { emoji: "🏈", keywords: ["texas", "ohio", "florida", "football", "nfl", "friday night", "gridiron", "tailgate"] },
  { emoji: "🦅", keywords: ["pennsylvania", "new york", "america", "eagle", "freedom", "bald", "soar", "patriot"] },
  { emoji: "🍎", keywords: ["new york", "apple", "big apple", "red", "teacher", "juice", "orchard", "newton"] },
  { emoji: "🎭", keywords: ["new york", "broadway", "theatre", "drama", "performance", "show", "stage", "act"] },
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

const DIFFICULTIES = {
  easy: {
    label: "😌 Easy",
    color: "#00aa44",
    timerSeconds: null,   // no timer
    description: "No timer · Hints are free",
  },
  medium: {
    label: "😅 Medium",
    color: "#ff9900",
    timerSeconds: 60,
    description: "60 seconds · Standard rules",
  },
  hard: {
    label: "😈 Hard",
    color: "#cc0000",
    timerSeconds: 35,
    description: "35 seconds · Max 5 emojis",
  },
}

const ROOM_WORDS = [
  "MANGO", "TIGER", "DISCO", "PIZZA", "NINJA", "LEMON", "PANDA", "COBRA",
  "HIPPO", "SALSA", "GECKO", "BURRO", "OLIVE", "TANGO", "RHINO", "CACTUS",
  "BACON", "SOLAR", "BISON", "CRANE", "DINGO", "EMBER", "FLINT", "GUAVA",
  "HAZEL", "IGLOO", "JELLY", "KARMA", "LASER", "MAPLE", "NEON", "ORBIT",
  "PIXEL", "QUAIL", "RAVEN", "STORM", "TULIP", "ULTRA", "VIPER", "WALTZ",
  "XENON", "YACHT", "ZEBRA", "BLAZE", "CHESS", "DRIFT", "EPOCH", "FROST",
  "GLOOM", "HYENA", "IVORY", "JOKER", "KNACK", "LUNAR", "MOOSE", "NOBLE",
  "OZONE", "PLUTO", "QUIRK", "REBEL", "SNACK", "TROUT", "UMBRA", "VAPOR"
]

const TEAM_NAME_PRESETS = [
  ["🔥 Fire", "💧 Water", "⚡ Thunder", "🌪️ Storm", "🦁 Lions", "🐺 Wolves"],
  ["🍕 Pizza", "🌮 Tacos", "🍔 Burgers", "🌯 Burritos", "🍣 Sushi", "🍜 Ramen"],
  ["🚀 Rockets", "🛸 UFOs", "🌙 Moons", "⭐ Stars", "🪐 Saturn", "🌍 Earth"],
  ["🎯 Bulls", "🎲 Dice", "♟️ Kings", "🃏 Jokers", "🎰 Aces", "🎳 Strikers"],
]

const CREDITS = [
  { role: "Creator", name: "Danny Fancher", emoji: "🎯" },
  { role: "Inspiration", name: "Tietje Sisters — Chey & Delicia", emoji: "💍" },
  { role: "#1 Beta Tester", name: "MamaBear (Sue)", emoji: "🐻" },
  { role: "Code Master", name: "Claude.AI", emoji: "🤖" },
]

const CHEAT_MESSAGES = {
  mamabear: "🐻 Welcome back Mom! Your bonus hints are ready...",
  hayden:   "⚡ Rayden has entered the arena...",
  bert:     "⏸️ Timer freeze unlocked. Use it wisely.",
  justin:   "🚀 MrSpacemanGuy is online. Extra hints loaded.",
  carrie:   "💖 CFanch1 activated. Tap the footer for a secret hint...",
  chey:     "💍 Something sparkly is waiting... Tap it for a hint.",
  delicia:  "🎲 The Dungeon Master has arrived. Tap the footer for a secret hint.",
}

const ONBOARDING_CARDS = [
  {
    emoji: "🎯",
    title: "Guess the Word",
    desc: "One emoji at a time, your teammate tries to describe a secret word.",
    bg: "#0066ff",
  },
  {
    emoji: "👁️",
    title: "Clue Giver",
    desc: "You see the secret word. Search for emojis and tap to send them — no talking!",
    bg: "#ff6600",
  },
  {
    emoji: "👂",
    title: "Guesser",
    desc: "Watch the emojis come in. Type your guess in the box at the bottom.",
    bg: "#00aa44",
  },
  {
    emoji: "⏱️",
    title: "Beat the Clock",
    desc: "Guess correctly before time runs out to score a point. Most points wins!",
    bg: "#cc0000",
  },
]

const HOW_TO_PLAY_STEPS = [
  { emoji: "👥", title: "Form Teams", desc: "Split into 2 teams. Each team has a Clue Giver and a Guesser." },
  { emoji: "🎯", title: "Get a Topic", desc: "The Clue Giver sees a secret word — don't show your screen!" },
  { emoji: "🔍", title: "Search Emojis", desc: "Type keywords to find emojis that hint at the topic. Send them one by one." },
  { emoji: "🤔", title: "Guess It!", desc: "The Guesser sees the emojis and types their answer. No words from the Clue Giver!" },
  { emoji: "🏆", title: "Score Points", desc: "Guess correctly before time runs out to score. Most points wins!" },
]

function generateRoomCode() {
  return ROOM_WORDS[Math.floor(Math.random() * ROOM_WORDS.length)]
}

// Track used topics per session to avoid repeats
const usedTopics = {}

function getRandomTopic(category) {
  const list = TOPICS[category]
  if (!usedTopics[category]) usedTopics[category] = []
  // Reset if all used
  if (usedTopics[category].length >= list.length) usedTopics[category] = []
  // Shuffle remaining unused
  const unused = list.filter(t => !usedTopics[category].includes(t))
  const pick = unused[Math.floor(Math.random() * unused.length)]
  usedTopics[category].push(pick)
  return pick
}

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

// ============================================================
// 8-BIT MUSIC ENGINE (Web Audio API, no files needed)
// ============================================================
let audioCtx = null
let musicNodes = []
let musicPlaying = false

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  return audioCtx
}

// Chiptune melody — gritty fast 8-bit arcade beat
const MELODY = [
  220, 220, 330, 220, 196, 165, 196, 220,
  220, 330, 440, 330, 220, 165, 196, 220,
  262, 262, 392, 262, 220, 196, 220, 262,
  330, 262, 220, 196, 165, 196, 220, 165,
  220, 294, 330, 294, 262, 220, 247, 262,
  294, 330, 392, 330, 294, 247, 220, 247,
]

function playChiptune() {
  if (musicPlaying) return
  try {
    const ctx = getAudioCtx()
    if (ctx.state === "suspended") ctx.resume()
    musicPlaying = true
    let noteIndex = 0
    const BPM = 200
    const noteDur = 60 / BPM

    function scheduleNote() {
      if (!musicPlaying) return
      const freq = MELODY[noteIndex % MELODY.length]
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = "sawtooth"
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      gain.gain.setValueAtTime(0.02, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + noteDur * 0.8)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + noteDur)
      musicNodes.push(osc)
      noteIndex++
      if (musicPlaying) {
        setTimeout(scheduleNote, noteDur * 1000)
      }
    }
    scheduleNote()
  } catch(e) { console.log("Audio error:", e) }
}

function stopChiptune() {
  musicPlaying = false
  musicNodes.forEach(n => { try { n.stop() } catch(e) {} })
  musicNodes = []
}

// ============================================================
// SHARE SCORE CARD (Canvas → Web Share API)
// ============================================================
async function shareScoreCard({ scores, topic, sentEmojis, correct, rounds, currentRound, difficulty, wrongGuesses, teamNames, players, cheater }) {
  const canvas = document.createElement("canvas")
  canvas.width = 600
  canvas.height = 480
  const ctx = canvas.getContext("2d")

  // Background
  ctx.fillStyle = "#0a0a1a"
  ctx.fillRect(0, 0, 600, 480)

  // Title
  ctx.fillStyle = "#0066ff"
  ctx.font = "bold 34px monospace"
  ctx.textAlign = "center"
  ctx.fillText("🎯 GuessMoji", 300, 52)

  // Difficulty pill
  const diffColors = { easy: "#00aa44", medium: "#ff9900", hard: "#cc0000" }
  const diffLabels = { easy: "EASY", medium: "MEDIUM", hard: "HARD" }
  ctx.fillStyle = diffColors[difficulty] || "#ff9900"
  ctx.beginPath()
  ctx.roundRect(230, 62, 140, 26, 13)
  ctx.fill()
  ctx.fillStyle = "white"
  ctx.font = "bold 13px monospace"
  ctx.fillText(diffLabels[difficulty] || "MEDIUM", 300, 80)

  // Result
  ctx.fillStyle = correct ? "#00aa44" : "#cc0000"
  ctx.font = "bold 26px monospace"
  ctx.fillText(correct ? "✅ Guessed it!" : "❌ Time's Up!", 300, 125)

  // Cheater message
  if (cheater) {
    ctx.fillStyle = "#ff6600"
    ctx.font = "bold 14px monospace"
    ctx.fillText("🤨 Zero emojis?! Cheater cheater!", 300, 148)
  }

  // Topic
  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 22px monospace"
  ctx.fillText(`"${topic}"`, 300, cheater ? 172 : 158)

  // Emojis sent
  if (sentEmojis.length > 0) {
    ctx.font = "28px serif"
    const totalW = sentEmojis.slice(0, 10).length * 38
    const startX = 300 - totalW / 2 + 14
    sentEmojis.slice(0, 10).forEach((e, i) => {
      ctx.fillText(e, startX + i * 38, 210)
    })
  }

  // Scores — only playing teams, show team name and players
  const teamColors = { "Team 1": "#0066ff", "Team 2": "#ff6600", "Team 3": "#00aa44" }
  const playingTeams = Object.entries(scores).filter(([t]) => {
    const playersOnTeam = Object.values(players || {}).some(p => p.team === t)
    return playersOnTeam
  })
  const colW = 600 / Math.max(playingTeams.length, 1)
  playingTeams.forEach(([teamKey, score], i) => {
    const x = colW * i + colW / 2
    const displayName = (teamNames || {})[teamKey] || teamKey
    const teamPlayers = Object.entries(players || {}).filter(([, p]) => p.team === teamKey).map(([n]) => n)
    ctx.fillStyle = teamColors[teamKey] || "#aaa"
    ctx.font = "bold 16px monospace"
    ctx.fillText(displayName, x, 250)
    ctx.fillStyle = "#aaa"
    ctx.font = "12px monospace"
    ctx.fillText(teamPlayers.join(" & "), x, 268)
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 30px monospace"
    ctx.fillText(score, x, 304)
  })

  // Wrong guesses
  if (wrongGuesses && wrongGuesses.length > 0) {
    ctx.fillStyle = "#cc0000"
    ctx.font = "12px monospace"
    const wgText = "❌ " + wrongGuesses.slice(0, 5).join("  ❌ ")
    ctx.fillText(wgText.length > 60 ? wgText.slice(0, 60) + "..." : wgText, 300, 335)
  }

  // Round info
  ctx.fillStyle = "#555"
  ctx.font = "13px monospace"
  ctx.fillText(`Round ${currentRound} of ${rounds}  •  GuessMoji`, 300, 462)

  // Convert to blob and share
  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      try {
        const file = new File([blob], "guessmoji-score.png", { type: "image/png" })
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: "GuessMoji",
            text: `We just played GuessMoji! ${correct ? "✅ Guessed it!" : "❌ Ran out of time!"} The word was "${topic}"`,
            files: [file],
          })
        } else {
          // Fallback: download the image
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = "guessmoji-score.png"
          a.click()
          URL.revokeObjectURL(url)
        }
      } catch(e) { console.log("Share error:", e) }
      resolve()
    }, "image/png")
  })
}

function GuesserAutoReady({ onReady, teamColor }) {
  const [countdown, setCountdown] = useState(3)
  useEffect(() => {
    if (countdown <= 0) { onReady(); return }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "48px", fontWeight: "bold", color: "white", opacity: 0.9 }}>{countdown}</div>
      <p style={{ color: "white", opacity: 0.7, fontSize: "14px", margin: "4px 0 16px" }}>Heading to guesser screen...</p>
      <button onClick={() => { setCountdown(0) }} style={{ padding: "14px 40px", fontSize: "20px", borderRadius: "12px", background: "white", color: teamColor, border: "none", cursor: "pointer", fontWeight: "bold" }}>
        Go Now ✊
      </button>
    </div>
  )
}

const DIFFICULTY_BADGE_COLORS = { easy: "#00aa44", medium: "#ff9900", hard: "#cc0000" }
const DIFFICULTY_LABELS = { easy: "😌 EASY", medium: "😅 MED", hard: "😈 HARD" }

function DifficultyBadge({ difficulty, timer }) {
  const isEasy = difficulty === "easy"
  const isHard = difficulty === "hard"
  const color = DIFFICULTY_BADGE_COLORS[difficulty] || "#ff9900"
  const timerColor = timer <= 10 ? "#cc0000" : color
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
      {!isEasy && (
        <span style={{ fontSize: "20px", fontWeight: "bold", color: timerColor, minWidth: "60px", textAlign: "right" }}>
          ⏱️ {timer}s
        </span>
      )}
      <span style={{ fontSize: "11px", background: color, color: "white", borderRadius: "6px", padding: "3px 7px", fontWeight: "bold", letterSpacing: "0.5px", flexShrink: 0 }}>
        {DIFFICULTY_LABELS[difficulty] || "😅 MED"}
      </span>
    </div>
  )
}

function Footer({ nickname, onHint, onShowCredits }) {
  const nl = nickname?.toLowerCase() || ""
  const isMamabear = nl === "mamabear"
  const isHayden = nl === "hayden"
  const isCarrie = nl === "carrie"
  const isChey = nl === "chey"
  const isDelicia = nl === "delicia"

  return (
    <div style={{ textAlign: "center", marginTop: "32px", paddingBottom: "16px" }}>
      <span
        onClick={onShowCredits}
        style={{ fontSize: "11px", color: "#bbb", letterSpacing: "0.5px", cursor: "pointer" }}
      >
        🎯 GuessMoji {VERSION} · Made by {MADE_BY}
      </span>
      {isMamabear && Math.random() < 0.4 && (
        <div style={{ fontSize: "11px", color: "#ffaacc", marginTop: "4px" }}>
          Love you Mom ❤️
        </div>
      )}
      {isHayden && (
        <div style={{ fontSize: "11px", color: "#aaa", marginTop: "4px" }}>
          🇩🇪 Guten Tag
        </div>
      )}
      {isCarrie && (
        <div
          onClick={onHint}
          style={{ fontSize: "11px", color: "#ff69b4", marginTop: "4px", cursor: "pointer", textDecoration: "underline" }}
        >
          💖 CFanch1
        </div>
      )}
      {isChey && (
        <div
          onClick={onHint}
          style={{ fontSize: "13px", marginTop: "4px", cursor: "pointer" }}
          title="Click for a hint..."
        >
          💍
        </div>
      )}
      {isDelicia && (
        <div
          onClick={onHint}
          style={{ fontSize: "11px", color: "#9b59b6", marginTop: "4px", cursor: "pointer", textDecoration: "underline" }}
        >
          🎲 Dungeon Master
        </div>
      )}
    </div>
  )
}

function Logo({ onTap, center = false }) {
  return (
    <div onClick={onTap} style={{ cursor: "pointer", userSelect: "none", margin: "0 0 8px", textAlign: center ? "center" : "left", width: center ? "100%" : "auto" }}>
      <span style={{ fontSize: "22px", fontWeight: "bold", color: "#0066ff" }}>🎯 GuessMoji</span>
    </div>
  )
}

export default function App() {
  const [nickname, setNickname] = useState("")
  const [screen, setScreen] = useState("home")
  const [showHowToPlay, setShowHowToPlay] = useState(false)
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
  const [readyPlayers, setReadyPlayers] = useState({})
  const [codeCopied, setCodeCopied] = useState(false)
  const [hintUsed, setHintUsed] = useState(false)
  const [hintTexts, setHintTexts] = useState([])
  const [hintCount, setHintCount] = useState(0)
  const [roundStartTime, setRoundStartTime] = useState(null)
  const [pingEmoji, setPingEmoji] = useState(null)
  const [tappedEmoji, setTappedEmoji] = useState(null)
  const [emojiGroups, setEmojiGroups] = useState([[]])
  const [muted, setMuted] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [forfeitRequested, setForfeitRequested] = useState(false)
  const [teammateForfeit, setTeammateForfeit] = useState(false)
  const [shufflesLeft, setShufflesLeft] = useState(0)
  const [teamNames, setTeamNames] = useState({ "Team 1": "Team 1", "Team 2": "Team 2", "Team 3": "Team 3" })
  const [editingTeam, setEditingTeam] = useState(null)
  const [editingName, setEditingName] = useState("")
  const [difficulty, setDifficulty] = useState("medium")
  const [showCredits, setShowCredits] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingCard, setOnboardingCard] = useState(0)
  const [suggestion, setSuggestion] = useState("")
  const [suggestionSent, setSuggestionSent] = useState(false)
  const [showSuggest, setShowSuggest] = useState(false)
  const [cheatMessage, setCheatMessage] = useState("")
  const [cheatVisible, setCheatVisible] = useState(false)
  const [suggestedEmoji, setSuggestedEmoji] = useState(null)
  const [suggestionUsed, setSuggestionUsed] = useState(false)
  const [timerPaused, setTimerPaused] = useState(false)

  const searchRef = useRef(null)
  const screenRef = useRef(screen)
  const countdownRef = useRef(null)
  const timerActiveRef = useRef(false)
  const difficultyRef = useRef("medium")
  const lastStatusRef = useRef("")

  useEffect(() => { screenRef.current = screen }, [screen])
  useEffect(() => { countdownRef.current = countdown }, [countdown])
  useEffect(() => { timerActiveRef.current = timerActive }, [timerActive])
  useEffect(() => { difficultyRef.current = difficulty }, [difficulty])

  const countdownWords = ["Ready", "Set", "GO!"]
  const teamColor = TEAM_COLORS[team] || "#999"

  useEffect(() => {
    if (!roomCode) return
    const roomRef = ref(db, `rooms/${roomCode}`)
    const unsub = onValue(roomRef, (snapshot) => {
      const data = snapshot.val()
      if (!data) return

      setPlayers(data.players || {})
      setReadyPlayers(data.ready || {})
      if (data.hints) setHintTexts(Array.isArray(data.hints) ? data.hints : [data.hints])
      else if (data.hint) setHintTexts([data.hint])
      else setHintTexts([])
      if (data.teamNames) setTeamNames(data.teamNames)
      if (data.ping !== undefined) setPingEmoji(data.ping)
      // Sync forfeit states
      if (data.forfeit && nickname && data.players) {
        const myTeam = data.players?.[nickname]?.team
        // Find teammate forfeit status
        const teammateEntry = Object.entries(data.players || {}).find(([n, p]) => n !== nickname && p.team === myTeam)
        if (teammateEntry) {
          setTeammateForfeit(data.forfeit[teammateEntry[0]] === true)
        }
        // Check if both forfeited — only clue giver triggers endRound
        if (data.roles) {
          const myRole = data.roles?.[nickname]
          if (myTeam && myRole === "clue") {
            const myTeamPlayers = Object.entries(data.players || {}).filter(([, p]) => p.team === myTeam).map(([n]) => n)
            const allForfeited = myTeamPlayers.length > 0 && myTeamPlayers.every(n => data.forfeit[n] === true)
            if (allForfeited && data.status !== "roundend" && data.status !== "nextround") {
              endRound(false)
            }
          }
        }
      } else {
        setTeammateForfeit(false)
      }

      // Clear emojis immediately on nextround — don't wait for Firebase null propagation
      if (data.status === "nextround") {
        setReceivedEmojis([])
        setSentEmojis([])
        setEmojiGroups([[]])
      } else if (data.emojis) {
        setReceivedEmojis(Object.values(data.emojis).filter(e => e !== null))
      } else {
        setReceivedEmojis([])
      }
      // Always sync topic from Firebase to prevent stale topic display
      if (data.topic && data.status !== "nextround") {
        setCurrentTopic(data.topic)
      }

      if (data.status === "ended") {
        resetAllState()
        return
      }

      if (data.status !== "nextround") {
        setWrongGuesses(data.wrongGuesses || [])
      }

      if (data.status === "countdown" && countdownRef.current === null && !timerActiveRef.current && lastStatusRef.current !== "countdown") {
        lastStatusRef.current = "countdown"
        if (screenRef.current === "role") {
          const isClue = data.roles?.[nickname] === "clue"
          setScreen(isClue ? "cluegiver" : "guesser")
        }
        setCountdown(0)
        // Start music on countdown
        if (!muted) playChiptune()
        let index = 0
        const interval = setInterval(() => {
          index += 1
          if (index >= countdownWords.length) {
            clearInterval(interval)
            setCountdown(null)
            // Use difficultyRef so we always get the current difficulty
            const diff = difficultyRef.current || "medium"
            const secs = DIFFICULTIES[diff]?.timerSeconds
            if (secs && diff !== "easy") {
              setTimer(secs)
              setGuesserTimer(secs)
              setTimerActive(true)
              timerActiveRef.current = true
              setGuesserActive(true)
            } else {
              // Easy mode: NO timer ever
              setTimerActive(false)
              timerActiveRef.current = false
              setGuesserActive(true)
            }
            setRoundStartTime(Date.now())
            setTimeout(() => searchRef.current?.focus(), 100)
          } else {
            setCountdown(index)
          }
        }, 800)
      }

      if (data.status === "roundend" && lastStatusRef.current !== "nextround") {
        stopChiptune()
        timerActiveRef.current = false
        countdownRef.current = null
        lastStatusRef.current = "roundend"
        setCorrect(data.correct || false)
        setSentEmojis(data.emojis ? Object.values(data.emojis) : [])
        setScores(data.scores || { "Team 1": 0, "Team 2": 0, "Team 3": 0 })
        setTimerActive(false)
        setGuesserActive(false)
        setScreen("roundend")
      }

      if (data.status === "nextround") {
        lastStatusRef.current = "nextround"
        const newRound = data.currentRound || 1
        const myRole = data.roles?.[nickname] || "guesser"
        const myTeam = data.players?.[nickname]?.team || ""
        const myTeammate = Object.entries(data.players || {}).find(
          ([n, p]) => n !== nickname && p.team === myTeam
        )?.[0] || ""
        const nextDiff = data.difficulty || "medium"
        const nextSecs = DIFFICULTIES[nextDiff]?.timerSeconds || 60
        const nextShuffles = nextDiff === "easy" ? 999 : nextDiff === "medium" ? 1 : 0
        setCurrentTopic(data.topic || "")
        setCurrentRound(newRound)
        setScores(data.scores || { "Team 1": 0, "Team 2": 0, "Team 3": 0 })
        if (data.teamNames) setTeamNames(data.teamNames)
        setRole(myRole)
        setTeam(myTeam)
        setTeammate(myTeammate)
        setDifficulty(nextDiff)
        setShufflesLeft(nextShuffles)
        setSentEmojis([])
        setReceivedEmojis([])
        setEmojiGroups([[]])
        setTimer(nextSecs)
        setTimerActive(false)
        setGuesserActive(false)
        setCountdown(null)
        setGuess("")
        setWrongGuesses([])
        setCorrect(false)
        setGuesserTimer(nextSecs)
        setSearch("")
        setHintUsed(false)
        setHintTexts([])
        lastStatusRef.current = ""
        countdownRef.current = null
        timerActiveRef.current = false
        setScreen("role")
      }

      if (data.status === "gameover") {
        setScores(data.scores || { "Team 1": 0, "Team 2": 0, "Team 3": 0 })
        setScreen("gameover")
      }

      if (data.status === "playing" && screenRef.current === "waiting") {
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
        const d = data.difficulty || "medium"
        setDifficulty(d)
        setShufflesLeft(d === "easy" ? 999 : d === "medium" ? 1 : 0)
        if (data.teamNames) setTeamNames(data.teamNames)
        setScreen("role")
      }
    })
    return () => unsub()
  }, [roomCode, nickname])

  useEffect(() => {
    if (!timerActive || timer <= 0 || timerPaused) return
    const interval = setInterval(() => setTimer(t => t - 1), 1000)
    return () => clearInterval(interval)
  }, [timerActive, timer, timerPaused])

  useEffect(() => {
    if (!guesserActive || guesserTimer <= 0 || difficulty === "easy" || timerPaused) return
    const interval = setInterval(() => setGuesserTimer(t => t - 1), 1000)
    return () => clearInterval(interval)
  }, [guesserActive, guesserTimer, difficulty, timerPaused])

  useEffect(() => {
    if (timerActive && timer <= 0 && difficulty !== "easy") {
      stopChiptune()
      setTimerActive(false)
      endRound(false)
    }
  }, [timer, timerActive, difficulty])

  useEffect(() => {
    if (guesserActive && guesserTimer <= 0 && difficulty !== "easy") {
      stopChiptune()
      setGuesserActive(false)
      setScreen("roundend")
    }
  }, [guesserTimer, guesserActive, difficulty])

  const resetAllState = () => {
    stopChiptune()
    // Clear all refs so new game starts clean
    lastStatusRef.current = ""
    countdownRef.current = null
    timerActiveRef.current = false
    difficultyRef.current = "medium"
    setTeam(""); setScreen("home"); setGameMode("sameroom"); setDifficulty("medium")
    setRounds(3); setCurrentRound(1); setScores({ "Team 1": 0, "Team 2": 0, "Team 3": 0 })
    setJoinCode(""); setSearch(""); setSentEmojis([]); setTimer(60)
    setTimerActive(false); setCountdown(null); setReceivedEmojis([])
    setGuess(""); setWrongGuesses([]); setCorrect(false)
    setGuesserTimer(60); setGuesserActive(false)
    setCategory(""); setCurrentTopic(""); setRoomCode(""); setRole("")
    setIsHost(false); setPlayers({}); setTeammate("")
    setHintUsed(false); setHintTexts([])
    setTeamNames({ "Team 1": "Team 1", "Team 2": "Team 2", "Team 3": "Team 3" }); setEditingTeam(null)
  }

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
    resetAllState()
    setShowResetConfirm(false)
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
      difficulty,
      currentRound: 1,
      status: "waiting",
      scores: { "Team 1": 0, "Team 2": 0, "Team 3": 0 },
      players: { [nickname]: { team: "unassigned" } }
    })
    setScreen("waiting")
  }

  const joinGame = async () => {
    if (joinCode.length < 4) return
    onValue(ref(db, `rooms/${joinCode}`), async (snapshot) => {
      const data = snapshot.val()
      if (!data) { alert("Room not found!"); return }
      setRoomCode(joinCode)
      setRounds(data.rounds)
      setCategory(data.category)
      setDifficulty(data.difficulty || "medium")
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
      difficulty,
      emojis: null,
      correct: false,
      wrongGuesses: null,
      ready: null,
      hint: null,
      forfeit: null,
      scores
    })
  }

  const startCountdown = async () => {
    await update(ref(db, `rooms/${roomCode}`), { status: "countdown" })
  }

  // Whole-word keyword match: "man" won't match "mango" or "romance"
  const searchLower = search.trim().toLowerCase()
  const filteredEmojis = searchLower === ""
    ? []
    : EMOJI_LIST.filter(e => e.keywords.some(k => {
        const words = k.split(" ")
        return words.some(w => w === searchLower || w.startsWith(searchLower))
      }))

  const maxEmojis = difficulty === "hard" ? 5 : Infinity
  // Check if teammate has requested forfeit
  const canSendMore = sentEmojis.length < maxEmojis

  const sendEmoji = async (emoji) => {
    if (!canSendMore) return
    setSentEmojis(prev => [...prev, emoji])
    setEmojiGroups(prev => {
      const groups = [...prev]
      groups[groups.length - 1] = [...groups[groups.length - 1], emoji]
      return groups
    })
    setSearch("")
    if (searchRef.current) searchRef.current.value = ""
    await push(ref(db, `rooms/${roomCode}/emojis`), emoji)
    searchRef.current?.focus()
  }

  const shuffleTopic = async () => {
    if (shufflesLeft <= 0) return
    const newTopic = getRandomTopic(category)
    setCurrentTopic(newTopic)
    if (shufflesLeft !== 999) setShufflesLeft(s => s - 1)
    await update(ref(db, `rooms/${roomCode}`), { topic: newTopic })
  }

  const requestForfeit = async () => {
    if (forfeitRequested) {
      // Cancel forfeit
      setForfeitRequested(false)
      await update(ref(db, `rooms/${roomCode}/forfeit`), { [nickname]: false })
    } else {
      // Request forfeit
      setForfeitRequested(true)
      await update(ref(db, `rooms/${roomCode}/forfeit`), { [nickname]: true })
    }
  }

  const addNewLine = async () => {
    setEmojiGroups(prev => [...prev, []])
    await push(ref(db, `rooms/${roomCode}/emojis`), "↵")
    searchRef.current?.focus()
  }

  const pingEmojiToGuesser = async (emoji) => {
    setPingEmoji(emoji)
    await update(ref(db, `rooms/${roomCode}`), { ping: emoji })
    // Clear ping after 2s
    setTimeout(async () => {
      setPingEmoji(null)
      await update(ref(db, `rooms/${roomCode}`), { ping: null })
    }, 2000)
  }

  const normalizeGuess = (str) => {
    const base = str.trim().toLowerCase().replace(/^the\s+/, "").replace(/['']/g, "'").replace(/\s+/g, " ")
    return base
  }
  // Also check spaceless version for compound words like hummingbird/humming bird
  const normalizeNoSpaces = (str) => normalizeGuess(str).replace(/\s/g, "")

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return s === 0 ? `${m}m` : `${m}m ${s}s`
  }

  const submitGuess = async () => {
    if (!guess.trim()) return
    if (normalizeGuess(guess) === normalizeGuess(currentTopic) ||
        normalizeNoSpaces(guess) === normalizeNoSpaces(currentTopic)) {
      endRound(true)
    } else {
      const newWrong = [...wrongGuesses, guess.trim()]
      setWrongGuesses(newWrong)
      setGuess("")
      await update(ref(db, `rooms/${roomCode}`), { wrongGuesses: newWrong })
    }
  }

  const togglePauseTimer = () => {
    if (!isBert) return
    setTimerPaused(p => !p)
  }

  const toggleMute = () => {
    if (muted) {
      setMuted(false)
      if (timerActive || guesserActive) playChiptune()
    } else {
      setMuted(true)
      stopChiptune()
    }
  }

  const saveTeamName = async (teamKey, newName) => {
    if (!newName.trim()) return
    const updated = { ...teamNames, [teamKey]: newName.trim() }
    setTeamNames(updated)
    setEditingTeam(null)
    await update(ref(db, `rooms/${roomCode}`), { teamNames: updated })
  }

  // Easter egg nickname checks
  const nickLower = nickname?.toLowerCase() || ""
  const isMamabear = nickLower === "mamabear"
  const isHayden = nickLower === "hayden"
  const isBert = nickLower === "bert"
  const isJustin = nickLower === "justin"
  const isCarrie = nickLower === "carrie"
  const isChey = nickLower === "chey"
  const isDelicia = nickLower === "delicia"
  const isFanch = nickLower === "fanch"

  // Justin gets display name override
  const displayNickname = isJustin ? "🚀 MrSpacemanGuy" : nickname

  // Hint count max — Mamabear +5, Justin +2, others get easter egg hints via footer
  const maxHints = difficulty === "easy"
    ? (isMamabear ? 7 : isJustin ? 4 : 2)
    : (isMamabear ? 6 : isJustin ? 3 : 1)
  const hintsLeft = maxHints - hintCount

  const useHint = async () => {
    if (hintCount >= maxHints) return
    const newCount = hintCount + 1
    setHintCount(newCount)
    let hintMsg = ""
    if (newCount === 1) {
      hintMsg = `Hint 1: First letter is "${currentTopic[0].toUpperCase()}"`
    } else if (newCount === 2) {
      // Second hint: word count
      const words = currentTopic.split(" ")
      hintMsg = words.length === 1
        ? `Hint 2: ${currentTopic.length} letters`
        : `Hint 2: ${words.length} words`
    }
    if (newCount >= maxHints) setHintUsed(true)
    const newHints = [...hintTexts, hintMsg]
    setHintTexts(newHints)
    if (difficulty === "medium") {
      const newTimer = Math.max(1, guesserTimer - 10)
      setGuesserTimer(newTimer)
    }
    await update(ref(db, `rooms/${roomCode}`), { hints: newHints, hint: hintMsg })
  }

  // Suggest an emoji for Easy mode
  const suggestEmoji = () => {
    if (suggestionUsed) return
    // Find emojis relevant to the current topic
    const topicWords = currentTopic.toLowerCase().replace(/[^a-z ]/g, "").split(" ").filter(w => w.length > 2)
    const relevant = EMOJI_LIST.filter(e =>
      e.keywords.some(k => topicWords.some(w => k.includes(w) || w.includes(k)))
    )
    const pool = relevant.length > 0 ? relevant : EMOJI_LIST
    const pick = pool[Math.floor(Math.random() * pool.length)]
    setSuggestedEmoji(pick.emoji)
    setSuggestionUsed(true)
  }

  // CREDITS SCREEN
  if (showCredits) {
    return (
      <div style={{ fontFamily: "sans-serif", padding: "24px", maxWidth: "400px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "48px" }}>🎯</div>
          <h2 style={{ fontSize: "28px", color: "#0066ff", margin: "8px 0 4px" }}>GuessMoji</h2>
          <p style={{ color: "#999", fontSize: "13px", margin: 0 }}>{VERSION}</p>
        </div>

        {CREDITS.map((c, i) => (
          <div key={i} style={{ background: "#f9f9f9", borderRadius: "12px", padding: "16px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{ fontSize: "32px", flexShrink: 0 }}>{c.emoji}</span>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: "11px", color: "#999", letterSpacing: "1px", margin: "0 0 2px", textTransform: "uppercase" }}>{c.role}</p>
              <p style={{ fontSize: "16px", fontWeight: "bold", color: "#111", margin: 0 }}>{c.name}</p>
            </div>
          </div>
        ))}

        <div style={{ background: "#fff8e1", borderRadius: "12px", padding: "14px 16px", marginBottom: "20px", textAlign: "center" }}>
          <p style={{ fontSize: "12px", color: "#aa6600", margin: "0 0 4px" }}>🤫 PSST</p>
          <p style={{ fontSize: "13px", color: "#aa6600", margin: 0 }}>Some nicknames unlock secret powers...</p>
        </div>

        <button
          onClick={() => setShowCredits(false)}
          style={{ width: "100%", padding: "14px", fontSize: "17px", borderRadius: "12px", background: "#0066ff", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}
        >
          Back to Game 🎯
        </button>
      </div>
    )
  }

  // ONBOARDING
  if (showOnboarding) {
    const card = ONBOARDING_CARDS[onboardingCard]
    const isLast = onboardingCard === ONBOARDING_CARDS.length - 1
    const finishOnboarding = () => {
      localStorage.setItem("guessmoji_seen_onboarding", "true")
      setShowOnboarding(false)
      // If they came from Let's Play, go to lobby. If from How to Play link, stay on home.
      if (nickname.trim() && screen === "home") {
        setScreen("lobby")
      }
    }
    return (
      <div style={{ fontFamily: "sans-serif", minHeight: "100dvh", background: card.bg, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "40px 24px 32px", boxSizing: "border-box", textAlign: "center", color: "white" }}>
        {/* Progress dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          {ONBOARDING_CARDS.map((_, i) => (
            <div key={i} style={{ width: i === onboardingCard ? "24px" : "8px", height: "8px", borderRadius: "4px", background: i === onboardingCard ? "white" : "rgba(255,255,255,0.4)", transition: "width 0.3s" }} />
          ))}
        </div>

        {/* Card content */}
        <div>
          <div style={{ fontSize: "100px", marginBottom: "24px" }}>{card.emoji}</div>
          <h1 style={{ fontSize: "32px", fontWeight: "bold", margin: "0 0 16px" }}>{card.title}</h1>
          <p style={{ fontSize: "18px", opacity: 0.9, lineHeight: "1.5", maxWidth: "300px", margin: "0 auto" }}>{card.desc}</p>
        </div>

        {/* Buttons */}
        <div>
          <button
            onClick={() => {
              if (isLast) finishOnboarding()
              else setOnboardingCard(c => c + 1)
            }}
            style={{ width: "100%", padding: "16px", fontSize: "20px", borderRadius: "14px", background: "white", color: card.bg, border: "none", cursor: "pointer", fontWeight: "bold", marginBottom: "12px" }}
          >
            {isLast ? "Let's Play! 🎯" : "Next →"}
          </button>
          <button
            onClick={finishOnboarding}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", fontSize: "15px", cursor: "pointer", textDecoration: "underline" }}
          >
            Skip
          </button>
        </div>
      </div>
    )
  }

  // HOW TO PLAY
  if (showHowToPlay) {
    return (
      <div style={{ fontFamily: "sans-serif", padding: "24px", maxWidth: "400px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ fontSize: "40px" }}>🎯</div>
          <h2 style={{ fontSize: "26px", color: "#0066ff", margin: "8px 0 4px" }}>How to Play</h2>
          <p style={{ color: "#999", fontSize: "13px", margin: 0 }}>GuessMoji</p>
        </div>
        {HOW_TO_PLAY_STEPS.map((step, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "18px", background: "#f9f9f9", borderRadius: "12px", padding: "14px 16px" }}>
            <div style={{ fontSize: "30px", minWidth: "36px", textAlign: "center" }}>{step.emoji}</div>
            <div>
              <div style={{ fontWeight: "bold", fontSize: "15px", color: "#111", marginBottom: "3px" }}>{step.title}</div>
              <div style={{ fontSize: "14px", color: "#555", lineHeight: "1.4" }}>{step.desc}</div>
            </div>
          </div>
        ))}
        <button onClick={() => { setShowHowToPlay(false); setSuggestionSent(false); setSuggestion(""); setShowSuggest(false) }} style={{ width: "100%", padding: "14px", fontSize: "17px", borderRadius: "12px", background: "#0066ff", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", marginTop: "8px" }}>
          Got it! Let's Play 🎯
        </button>
        <div style={{ marginTop: "16px", background: "#f9f9f9", borderRadius: "12px", padding: "16px" }}>
          <p style={{ fontSize: "13px", fontWeight: "bold", color: "#333", margin: "0 0 8px" }}>💡 Suggest a Feature</p>
          <p style={{ fontSize: "12px", color: "#999", margin: "0 0 10px" }}>Got an idea? We'd love to hear it!</p>
          {suggestionSent ? (
            <div style={{ textAlign: "center", padding: "10px" }}>
              <div style={{ fontSize: "32px" }}>🎉</div>
              <p style={{ fontSize: "14px", color: "#00aa44", fontWeight: "bold", margin: "6px 0 0" }}>Thanks! We got it.</p>
            </div>
          ) : (
            <>
              <textarea
                placeholder="What would make GuessMoji better?"
                value={suggestion}
                onChange={e => setSuggestion(e.target.value)}
                rows={3}
                style={{ width: "100%", padding: "10px", fontSize: "14px", borderRadius: "8px", border: "1px solid #ddd", boxSizing: "border-box", resize: "none", fontFamily: "sans-serif" }}
              />
              <button
                onClick={() => {
                  if (!suggestion.trim()) return
                  const subject = encodeURIComponent("GuessMoji Feature Suggestion")
                  const body = encodeURIComponent(`Hey Fanch!

Here's my GuessMoji suggestion:

${suggestion}

— Sent from GuessMoji ${VERSION}`)
                  window.location.href = `mailto:fancher.danny@gmail.com?subject=${subject}&body=${body}`
                  setSuggestionSent(true)
                  setSuggestion("")
                }}
                disabled={!suggestion.trim()}
                style={{ width: "100%", marginTop: "8px", padding: "10px", fontSize: "15px", borderRadius: "10px", background: suggestion.trim() ? "#0066ff" : "#ccc", color: "white", border: "none", cursor: suggestion.trim() ? "pointer" : "not-allowed", fontWeight: "bold" }}
              >
                Send Suggestion 📬
              </button>
            </>
          )}
        </div>
        <button onClick={() => { setShowHowToPlay(false); setShowCredits(true) }} style={{ width: "100%", padding: "10px", fontSize: "14px", borderRadius: "10px", background: "none", border: "1px solid #eee", color: "#999", cursor: "pointer", marginTop: "8px" }}>
          🎬 Credits
        </button>
        <Footer nickname={nickname} onHint={useHint} onShowCredits={() => setShowCredits(true)} />
      </div>
    )
  }

  // RESET CONFIRM
  if (showResetConfirm) {
    return (
      <div style={{ fontFamily: "sans-serif", padding: "20px", minHeight: "100dvh", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div style={{ fontSize: "48px" }}>😬</div>
        <h2 style={{ fontSize: "24px", margin: "16px 0" }}>{resetMessage}</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "24px" }}>
          <button onClick={confirmReset} style={{ padding: "12px 30px", fontSize: "18px", borderRadius: "12px", background: "#cc0000", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}>Yeah, reset</button>
          <button onClick={() => setShowResetConfirm(false)} style={{ padding: "12px 30px", fontSize: "18px", borderRadius: "12px", background: "#0066ff", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}>No, stay!</button>
        </div>
      </div>
    )
  }

  // WAITING / LOBBY
  if (screen === "waiting") {
    const playerList = Object.entries(players)
    const allAssigned = playerList.every(([, p]) => p.team && p.team !== "unassigned")
    return (
      <div style={{ fontFamily: "sans-serif", padding: "20px", maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
        <Logo onTap={handleLogoTap} center />
        <p style={{ color: "#999", fontSize: "14px" }}>Room Code</p>
        <div
          onClick={() => { navigator.clipboard.writeText(roomCode); setCodeCopied(true); setTimeout(() => setCodeCopied(false), 2000) }}
          style={{ fontSize: "44px", fontWeight: "bold", letterSpacing: "8px", color: "#0066ff", margin: "8px 0 4px", cursor: "pointer", userSelect: "none" }}
        >
          {roomCode}
          <div style={{ fontSize: "13px", letterSpacing: "0px", color: codeCopied ? "#00aa44" : "#aaa", marginTop: "4px" }}>
            {codeCopied ? "✅ Copied!" : "👆 tap to copy"}
          </div>
        </div>
        <p style={{ color: "#999", fontSize: "13px", marginBottom: "4px" }}>{category} · {rounds} rounds</p>
        <p style={{ fontSize: "13px", fontWeight: "bold", color: DIFFICULTIES[difficulty]?.color || "#999", marginBottom: "20px" }}>{DIFFICULTIES[difficulty]?.label} · {DIFFICULTIES[difficulty]?.description}</p>
        <p style={{ fontSize: "13px", color: "#999", margin: "0 0 10px", letterSpacing: "1px" }}>PLAYERS</p>
        {playerList.map(([name, info]) => {
          const tc = TEAM_COLORS[info.team] || "#999"
          const displayName = teamNames[info.team] || info.team
          return (
            <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: "12px", marginBottom: "8px", background: info.team !== "unassigned" ? tc : "#f5f5f5", border: `2px solid ${tc}` }}>
              <span style={{ fontWeight: "bold", fontSize: "16px", color: info.team !== "unassigned" ? "white" : "#111" }}>{name} {name === nickname ? "👤" : ""}</span>
              {isHost ? (
                <button onClick={() => assignTeam(name, info.team)} style={{ padding: "6px 14px", fontSize: "13px", borderRadius: "8px", background: info.team !== "unassigned" ? "rgba(255,255,255,0.25)" : "#eee", color: info.team !== "unassigned" ? "white" : "#333", border: info.team !== "unassigned" ? "1px solid rgba(255,255,255,0.4)" : "none", cursor: "pointer", fontWeight: "bold" }}>
                  {info.team === "unassigned" ? "Assign +" : displayName}
                </button>
              ) : (
                <span style={{ color: info.team !== "unassigned" ? "white" : "#999", fontWeight: "bold", fontSize: "14px" }}>{info.team === "unassigned" ? "Waiting..." : displayName}</span>
              )}
            </div>
          )
        })}

        {isHost && allAssigned && (
          <div style={{ margin: "12px 0", background: "#f0f0f0", borderRadius: "12px", padding: "12px" }}>
            <p style={{ fontSize: "12px", color: "#999", margin: "0 0 8px", letterSpacing: "1px" }}>TEAM NAMES</p>
            {[...new Set(playerList.map(([,p]) => p.team).filter(t => t && t !== "unassigned"))].map(teamKey => (
              <div key={teamKey} style={{ marginBottom: "8px" }}>
                {editingTeam === teamKey ? (
                  <div>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "6px" }}>
                      {TEAM_NAME_PRESETS[Math.floor(Math.random() * 0) % TEAM_NAME_PRESETS.length + 0].map((preset, i) => (
                        <button key={i} onClick={() => saveTeamName(teamKey, preset)} style={{ padding: "4px 10px", fontSize: "13px", borderRadius: "8px", background: "#fff", border: `1px solid ${TEAM_COLORS[teamKey]}`, cursor: "pointer", color: TEAM_COLORS[teamKey] }}>{preset}</button>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <input autoFocus value={editingName} onChange={e => setEditingName(e.target.value)} onKeyDown={e => { if (e.key === "Enter") saveTeamName(teamKey, editingName) }} placeholder="Custom name..." style={{ flex: 1, padding: "6px 10px", borderRadius: "8px", border: `2px solid ${TEAM_COLORS[teamKey]}`, fontSize: "14px" }} />
                      <button onClick={() => saveTeamName(teamKey, editingName)} style={{ padding: "6px 12px", borderRadius: "8px", background: TEAM_COLORS[teamKey], color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}>✓</button>
                      <button onClick={() => setEditingTeam(null)} style={{ padding: "6px 12px", borderRadius: "8px", background: "#eee", color: "#666", border: "none", cursor: "pointer" }}>✕</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "bold", color: TEAM_COLORS[teamKey], fontSize: "15px" }}>{teamNames[teamKey] || teamKey}</span>
                    <button onClick={() => { setEditingTeam(teamKey); setEditingName(teamNames[teamKey] || teamKey) }} style={{ padding: "4px 12px", fontSize: "12px", borderRadius: "8px", background: "#eee", border: "none", cursor: "pointer", color: "#666" }}>✏️ Rename</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {isHost && (
          <div style={{ marginTop: "16px", display: "flex", gap: "10px", justifyContent: "center" }}>
            <button onClick={randomizeTeams} style={{ padding: "10px 20px", fontSize: "15px", borderRadius: "10px", background: "#888", color: "white", border: "none", cursor: "pointer" }}>🎲 Randomize</button>
            <button onClick={startGame} disabled={!allAssigned || playerList.length < 2} style={{ padding: "10px 24px", fontSize: "15px", borderRadius: "10px", background: allAssigned && playerList.length >= 2 ? "#0066ff" : "#aaa", color: "white", border: "none", cursor: allAssigned && playerList.length >= 2 ? "pointer" : "not-allowed", fontWeight: "bold" }}>
              Start Game →
            </button>
          </div>
        )}
        {!isHost && <p style={{ color: "#999", marginTop: "20px" }}>⏳ Waiting for host to start...</p>}
        <Footer nickname={nickname} onHint={useHint} onShowCredits={() => setShowCredits(true)} />
      </div>
    )
  }

  // ROUND END
  if (screen === "roundend") {
    const gotIt = correct
    return (
      <div style={{ fontFamily: "sans-serif", padding: "20px", maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
        <Logo onTap={handleLogoTap} center />
        <div style={{ background: gotIt ? "#e6ffe6" : "#ffe6e6", border: `2px solid ${gotIt ? "#00aa44" : "#cc0000"}`, borderRadius: "16px", padding: "24px", margin: "16px 0" }}>
          <div style={{ fontSize: "60px" }}>{gotIt ? "🎉" : "⏰"}</div>
          <h2 style={{ color: gotIt ? "#00aa44" : "#cc0000", margin: "8px 0" }}>{gotIt ? "Got it!" : "Time's Up!"}</h2>
          <p style={{ fontSize: "18px", margin: "8px 0", color: "#111" }}>The answer was <strong>{currentTopic}</strong></p>
          {gotIt && sentEmojis.length === 0 && (
            <p style={{ color: "#ff6600", fontSize: "15px", fontWeight: "bold" }}>🤨 Cheater cheater pumpkin eater! Zero emojis?!</p>
          )}
          {gotIt && sentEmojis.length > 0 && (
            <p style={{ color: "#666", fontSize: "14px" }}>
              {difficulty === "easy" && roundStartTime
                ? `Solved in ${formatTime(Math.round((Date.now() - roundStartTime) / 1000))}`
                : `Solved in ${formatTime(DIFFICULTIES[difficulty]?.timerSeconds - guesserTimer || 0)}`} with {sentEmojis.length} emoji{sentEmojis.length !== 1 ? "s" : ""}
            </p>
          )}
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
              <span style={{ fontWeight: "bold", color: "white", fontSize: "16px" }}>{teamNames[t] || t}</span>
              <span style={{ fontSize: "26px", fontWeight: "bold", color: "white" }}>{s}</span>
            </div>
          ))}
        </div>
        <p style={{ color: "#999", fontSize: "14px" }}>Round {currentRound} of {rounds}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "8px", flexWrap: "wrap" }}>
          <button onClick={confirmReset} style={{ padding: "12px 20px", fontSize: "15px", borderRadius: "12px", background: "#ccc", color: "white", border: "none", cursor: "pointer" }}>🏠 End</button>
          <button
            onClick={async () => {
              setSharing(true)
              await shareScoreCard({ scores, topic: currentTopic, sentEmojis, correct, rounds, currentRound, difficulty, wrongGuesses, teamNames, players, cheater: correct && sentEmojis.length === 0 })
              setSharing(false)
            }}
            style={{ padding: "12px 20px", fontSize: "15px", borderRadius: "12px", background: "#6c3fc5", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}
          >
            {sharing ? "..." : "📤 Share"}
          </button>
          {isHost ? (
            <button onClick={nextRound} style={{ padding: "12px 20px", fontSize: "15px", borderRadius: "12px", background: teamColor, color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}>
              {currentRound >= rounds ? "🏆 Results" : "Next →"}
            </button>
          ) : (
            <p style={{ color: "#999", fontSize: "14px", margin: "12px 0" }}>Waiting for host...</p>
          )}
        </div>
        <Footer nickname={nickname} onHint={useHint} onShowCredits={() => setShowCredits(true)} />
      </div>
    )
  }

  // GAME OVER
  if (screen === "gameover") {
    const teamsInGame = [...new Set(Object.values(players).map(p => p.team).filter(t => t && t !== "unassigned"))]
    const sorted = teamsInGame.map(t => [t, scores[t] || 0]).sort((a, b) => b[1] - a[1])
    return (
      <div style={{ fontFamily: "sans-serif", padding: "20px", maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
        <Logo onTap={handleLogoTap} center />
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
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={async () => {
              setSharing(true)
              await shareScoreCard({ scores, topic: currentTopic, sentEmojis, correct, rounds, currentRound: rounds, difficulty, wrongGuesses, teamNames, players, cheater: correct && sentEmojis.length === 0 })
              setSharing(false)
            }}
            style={{ padding: "14px 28px", fontSize: "18px", borderRadius: "12px", background: "#6c3fc5", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}
          >
            {sharing ? "..." : "📤 Share Results"}
          </button>
          <button onClick={confirmReset} style={{ padding: "14px 28px", fontSize: "18px", borderRadius: "12px", background: "#0066ff", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}>🔄 Play Again</button>
        </div>
        <Footer nickname={nickname} onHint={useHint} onShowCredits={() => setShowCredits(true)} />
      </div>
    )
  }

  // GUESSER SCREEN
  if (screen === "guesser") {
    return (
      // FIX: min-height 100dvh + width 100% fills full phone screen, no white border
      <div style={{ fontFamily: "sans-serif", padding: "20px", maxWidth: "400px", margin: "0 auto", minHeight: "100dvh", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
          <Logo onTap={handleLogoTap} />
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {isBert && timerActive && (
              <button onClick={togglePauseTimer} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", padding: "4px" }} title="Bert's special power">
                {timerPaused ? "▶️" : "⏸️"}
              </button>
            )}
            <button onClick={toggleMute} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", padding: "4px" }}>{muted ? "🔇" : "🔊"}</button>
            <DifficultyBadge difficulty={difficulty} timer={guesserTimer} />
          </div>
        </div>
        {countdown !== null && (
          <div style={{ fontSize: "100px", fontWeight: "bold", textAlign: "center", color: teamColor, margin: "20px 0" }}>
            {countdownWords[countdown]}
          </div>
        )}
        <div style={{ background: "#f9f9f9", border: `2px solid ${teamColor}`, borderRadius: "12px", padding: "16px", margin: "16px 0", minHeight: "80px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <p style={{ margin: 0, fontSize: "12px", color: teamColor, letterSpacing: "1px" }}>CLUES FROM {teammate.toUpperCase() || "YOUR TEAMMATE"}</p>
            <p style={{ margin: 0, fontSize: "11px", color: "#aaa" }}>{category}</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {receivedEmojis.length === 0
              ? <p style={{ color: "#ccc", margin: 0 }}>
                  Waiting for clues...
                  {isFanch && currentTopic && (
                    <span style={{ fontSize: "10px", color: "rgba(0,0,0,0.08)", userSelect: "none", marginLeft: "8px" }}>{currentTopic}</span>
                  )}
                </p>
              : (() => {
                  const groups = [[]]
                  receivedEmojis.forEach(e => {
                    if (e === "↵") groups.push([])
                    else groups[groups.length - 1].push(e)
                  })
                  return (<>
                    {isFanch && currentTopic && <p style={{ fontSize: "10px", color: "rgba(0,0,0,0.07)", margin: "0 0 4px", userSelect: "none" }}>{currentTopic}</p>}
                    {groups.filter(g => g.length > 0).map((group, gi) => (
                    <div key={gi} style={{ display: "flex", flexWrap: "wrap", gap: "6px", width: "100%", paddingBottom: gi < groups.length - 1 ? "8px" : "0", marginBottom: gi < groups.length - 1 ? "8px" : "0", borderBottom: gi < groups.length - 1 ? "1px dashed #ddd" : "none" }}>
                      {group.map((e, i) => (
                        <span
                          key={i}
                          onClick={() => {
                            setTappedEmoji(e + i + gi)
                            setTimeout(() => setTappedEmoji(null), 600)
                          }}
                          style={{
                            fontSize: "40px",
                            display: "inline-block",
                            cursor: "pointer",
                            transform: pingEmoji === e ? "scale(1.5)" : tappedEmoji === e + i + gi ? "scale(1.6)" : "scale(1)",
                            transition: "transform 0.15s",
                            filter: pingEmoji === e ? "drop-shadow(0 0 8px gold)" : tappedEmoji === e + i + gi ? "drop-shadow(0 0 6px #0066ff)" : "none"
                          }}>
                          {e}
                        </span>
                      ))}
                    </div>
                  ))}
                  </>)
                })()
            }
          </div>
        </div>
        {!guesserActive && countdown === null && (
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <p style={{ color: teamColor, fontSize: "18px", margin: "0 0 10px" }}>⏳ Waiting for {teammate || "clue giver"} to start...</p>
            {readyPlayers[nickname] && !readyPlayers[teammate] && (
              <p style={{ color: "#999", fontSize: "14px", margin: 0 }}>👀 {teammate || "Teammate"} hasn't hit ready yet...</p>
            )}
            {readyPlayers[teammate] && (
              <p style={{ color: "#00aa44", fontSize: "15px", fontWeight: "bold", margin: 0 }}>✅ {teammate} is ready!</p>
            )}
          </div>
        )}
        {guesserActive && (
          <>
            {hintTexts.length > 0 && (
              <div style={{ background: "#fff8e1", border: "2px solid #ffcc00", borderRadius: "10px", padding: "8px 14px", marginBottom: "10px" }}>
                {hintTexts.map((h, i) => (
                  <div key={i} style={{ fontSize: "14px", fontWeight: "bold", color: "#aa6600", marginBottom: i < hintTexts.length - 1 ? "4px" : "0" }}>
                    💡 {h}
                  </div>
                ))}
              </div>
            )}
            {wrongGuesses.length === 0 && receivedEmojis.length > 0 && (
              <p style={{ fontSize: "12px", color: teamColor, margin: "0 0 4px", textAlign: "center", opacity: 0.8 }}>👆 Type your guess below!</p>
            )}
            <input
              autoFocus
              type="text"
              placeholder="Type your guess..."
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") submitGuess() }}
              style={{ width: "100%", padding: "12px", fontSize: "18px", borderRadius: "12px", border: `2px solid ${teamColor}`, boxSizing: "border-box", marginBottom: "10px" }}
            />
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={submitGuess} style={{ flex: 1, padding: "12px", fontSize: "18px", borderRadius: "12px", background: teamColor, color: "white", border: "none", cursor: "pointer" }}>Submit Guess ✊</button>
              {difficulty !== "hard" && (
                <button
                  onClick={useHint}
                  disabled={hintCount >= maxHints}
                  style={{ padding: "12px 16px", fontSize: "16px", borderRadius: "12px", background: hintCount >= maxHints ? "#eee" : "#fff8e1", color: hintCount >= maxHints ? "#aaa" : "#aa6600", border: `2px solid ${hintCount >= maxHints ? "#eee" : "#ffcc00"}`, cursor: hintCount >= maxHints ? "not-allowed" : "pointer", fontWeight: "bold", whiteSpace: "nowrap" }}
                >
                  {hintsLeft === 0 ? "💡 Used" : difficulty === "easy" ? `💡 Hint (${hintsLeft} left)` : "💡 -10s"}
                </button>
              )}
            </div>
            <button
              onClick={requestForfeit}
              style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "10px", background: "none", border: `2px solid ${teammateForfeit ? "#ff6600" : forfeitRequested ? "#cc0000" : "#eee"}`, color: teammateForfeit ? "#ff6600" : forfeitRequested ? "#cc0000" : "#aaa", cursor: "pointer", marginTop: "8px", fontWeight: forfeitRequested || teammateForfeit ? "bold" : "normal" }}
            >
              {teammateForfeit && !forfeitRequested ? "⚠️ Teammate wants to forfeit! Tap to confirm" : forfeitRequested ? "🏳️ Forfeit requested — tap to cancel" : "🏳️ Forfeit round"}
            </button>
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
      <div style={{ fontFamily: "sans-serif", padding: "20px", maxWidth: "400px", margin: "0 auto", minHeight: "100dvh", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
          <Logo onTap={handleLogoTap} />
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {isBert && timerActive && (
              <button onClick={togglePauseTimer} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", padding: "4px" }} title="Bert's special power">
                {timerPaused ? "▶️" : "⏸️"}
              </button>
            )}
            <button onClick={toggleMute} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", padding: "4px" }}>{muted ? "🔇" : "🔊"}</button>
            <DifficultyBadge difficulty={difficulty} timer={timer} />
          </div>
        </div>
        <div style={{ background: teamColor, color: "white", borderRadius: "12px", padding: "12px 16px", textAlign: "center", margin: "8px 0", position: "sticky", top: "0", zIndex: 9 }}>
          <p style={{ margin: 0, fontSize: "11px", opacity: 0.6 }}>{category}</p>
          <p style={{ margin: 0, fontSize: "12px", opacity: 0.8 }}>YOUR TOPIC</p>
          <h1 style={{ margin: "4px 0 0", fontSize: "28px" }}>{currentTopic}</h1>
          {difficulty !== "hard" && !timerActive && !guesserActive && (
            <button onClick={shuffleTopic} style={{ marginTop: "8px", padding: "4px 14px", fontSize: "13px", borderRadius: "8px", background: "rgba(255,255,255,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.4)", cursor: shufflesLeft > 0 ? "pointer" : "not-allowed", opacity: shufflesLeft > 0 ? 1 : 0.5 }}>
              🔀 Shuffle {difficulty === "easy" ? "∞" : shufflesLeft > 0 ? `(${shufflesLeft} left)` : "(used)"}
            </button>
          )}
        </div>
        {countdown !== null && (
          <div style={{ fontSize: "100px", fontWeight: "bold", textAlign: "center", color: teamColor, margin: "20px 0" }}>
            {countdownWords[countdown]}
          </div>
        )}
        {!timerActive && !guesserActive && countdown === null && (
          <>
            <p style={{ color: readyPlayers[teammate] ? "#00aa44" : "#999", fontSize: "14px", textAlign: "center", margin: "0 0 10px", fontWeight: readyPlayers[teammate] ? "bold" : "normal" }}>
              {readyPlayers[teammate] ? `✅ ${teammate} is on the guesser screen!` : `⏳ ${teammate || "Guesser"} is heading over...`}
            </p>
            <button onClick={startCountdown} style={{ width: "100%", padding: "14px", fontSize: "18px", borderRadius: "12px", background: teamColor, color: "white", border: "none", cursor: "pointer", marginBottom: "16px", fontWeight: "bold" }}>
              Start Round ▶️
            </button>
          </>
        )}
        <div style={{ minHeight: "50px", background: "#f5f5f5", borderRadius: "12px", padding: "10px", marginBottom: "4px" }}>
          {sentEmojis.length === 0
            ? <p style={{ color: "#999", margin: 0, fontSize: "14px" }}>Sent emojis appear here... Tap to ping 👆</p>
            : emojiGroups.map((group, gi) => (
                <div key={gi} style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: gi < emojiGroups.length - 1 ? "6px" : "0", paddingBottom: gi < emojiGroups.length - 1 ? "6px" : "0", borderBottom: gi < emojiGroups.length - 1 ? "1px dashed #ddd" : "none" }}>
                  {group.map((e, i) => (
                    <button key={i} onClick={() => pingEmojiToGuesser(e)}
                      style={{ fontSize: "26px", background: pingEmoji === e ? teamColor : "white", border: `2px solid ${pingEmoji === e ? teamColor : "#ddd"}`, borderRadius: "8px", padding: "4px 6px", cursor: "pointer", transform: pingEmoji === e ? "scale(1.2)" : "scale(1)", transition: "all 0.15s" }}>
                      {e}
                    </button>
                  ))}
                </div>
              ))
          }
        </div>
        {(timerActive || (difficulty === "easy" && guesserActive)) && sentEmojis.length > 0 && (
          <button onClick={addNewLine} style={{ width: "100%", padding: "6px", fontSize: "13px", borderRadius: "8px", background: "none", border: `1px dashed ${teamColor}`, color: teamColor, cursor: "pointer", marginBottom: "4px" }}>
            ↵ New Line
          </button>
        )}
        {difficulty === "hard" && (
          <p style={{ fontSize: "12px", color: canSendMore ? "#cc0000" : "#cc0000", fontWeight: "bold", margin: "0 0 12px", textAlign: "right" }}>
            {canSendMore ? `😈 ${maxEmojis - sentEmojis.length} emoji${maxEmojis - sentEmojis.length !== 1 ? "s" : ""} left` : "🚫 Max emojis reached!"}
          </p>
        )}
        {(timerActive || (difficulty === "easy" && guesserActive)) && (
          <button
            onClick={requestForfeit}
            style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "10px", background: "none", border: `2px solid ${teammateForfeit ? "#ff6600" : forfeitRequested ? "#cc0000" : "#eee"}`, color: teammateForfeit ? "#ff6600" : forfeitRequested ? "#cc0000" : "#aaa", cursor: "pointer", marginBottom: "8px", fontWeight: forfeitRequested || teammateForfeit ? "bold" : "normal" }}
          >
            {teammateForfeit && !forfeitRequested ? "⚠️ Teammate wants to forfeit! Tap to confirm" : forfeitRequested ? "🏳️ Forfeit requested — tap to cancel" : "🏳️ Forfeit round"}
          </button>
        )}
        {timerActive && (
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
        {!timerActive && guesserActive && difficulty === "easy" && wrongGuesses.length > 0 && (
          <div style={{ background: "#fff8f8", border: "2px solid #ffcccc", borderRadius: "12px", padding: "10px", marginBottom: "12px" }}>
            <p style={{ margin: "0 0 6px", fontSize: "12px", color: "#cc0000", letterSpacing: "1px" }}>THEIR GUESSES SO FAR</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {wrongGuesses.map((g, i) => <span key={i} style={{ background: "#ffe0e0", color: "#cc0000", padding: "4px 10px", borderRadius: "20px", fontSize: "14px" }}>❌ {g}</span>)}
            </div>
          </div>
        )}
        <input
          ref={searchRef}
          type="text"
          placeholder="Search emojis..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={!timerActive && !(difficulty === "easy" && guesserActive)}
          style={{ width: "100%", padding: "12px", fontSize: "16px", borderRadius: "12px", border: `2px solid ${teamColor}`, boxSizing: "border-box", marginBottom: "12px", background: (timerActive || (difficulty === "easy" && guesserActive)) ? "white" : "#f0f0f0", color: (timerActive || (difficulty === "easy" && guesserActive)) ? "black" : "#aaa", position: "sticky", bottom: "8px", zIndex: 10 }}
        />
        {search.trim() !== "" && filteredEmojis.length === 0 && (
          <p style={{ color: "#999", textAlign: "center" }}>No emojis found. Try another word.</p>
        )}
        {difficulty === "easy" && (timerActive || guesserActive) && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <button
              onClick={suggestEmoji}
              disabled={suggestionUsed}
              style={{ padding: "8px 16px", fontSize: "14px", borderRadius: "10px", background: suggestionUsed ? "#f0f0f0" : "#e8f4ff", color: suggestionUsed ? "#aaa" : "#0066ff", border: `1px solid ${suggestionUsed ? "#ddd" : "#0066ff"}`, cursor: suggestionUsed ? "not-allowed" : "pointer", fontWeight: "bold", whiteSpace: "nowrap" }}
            >
              {suggestionUsed ? "✨ Suggested!" : "✨ Suggest Emoji"}
            </button>
            {suggestedEmoji && (
              <button
                onClick={() => sendEmoji(suggestedEmoji)}
                style={{ fontSize: "32px", background: "#fffbe6", border: "2px solid #ffcc00", borderRadius: "10px", padding: "6px 10px", cursor: "pointer", animation: "pulse 0.5s ease" }}
              >
                {suggestedEmoji}
              </button>
            )}
          </div>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", paddingBottom: "120px" }}>
          {filteredEmojis.map((e, i) => (
            <button key={i} onClick={() => sendEmoji(e.emoji)} style={{ fontSize: "40px", background: "none", border: "2px solid #eee", borderRadius: "12px", padding: "8px", cursor: "pointer" }}>{e.emoji}</button>
          ))}
        </div>
      </div>
    )
  }

  // ROLE SCREEN
  if (screen === "role") {
    const isClue = role === "clue"
    return (
      <div style={{ fontFamily: "sans-serif", background: teamColor, minHeight: "100dvh", color: "white", padding: "20px 20px 40px", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <p style={{ fontSize: "14px", letterSpacing: "2px", opacity: 0.8 }}>🔒 DON'T SHOW YOUR SCREEN</p>
        <p style={{ fontSize: "14px", opacity: 0.7 }}>Round {currentRound} of {rounds} · {team} · {DIFFICULTIES[difficulty]?.label || "Medium"}</p>
        <h1 style={{ fontSize: "28px", marginTop: "20px" }}>Hey {displayNickname}!</h1>
        {isHayden && (
          <div style={{ fontSize: "22px", fontWeight: "bold", color: "white", background: "rgba(0,0,0,0.3)", borderRadius: "10px", padding: "8px 16px", margin: "8px auto", maxWidth: "300px" }}>
            ⚡ FINISH HIM, RAYDEN! ⚡
          </div>
        )}
        <p style={{ fontSize: "20px", opacity: 0.9 }}>You are the</p>
        <div style={{ fontSize: "52px", fontWeight: "bold", margin: "20px 0" }}>{isClue ? "👁️ CLUE GIVER" : "👂 GUESSER"}</div>
        <p style={{ fontSize: "18px", opacity: 0.85, maxWidth: "300px", margin: "0 auto" }}>
          {isClue
            ? `Search for emojis and send them to ${teammate || "your teammate"} one at a time!`
            : `Watch for emojis from ${teammate || "your teammate"} and type your guess!`}
        </p>
        <br /><br />
        <button onClick={() => setScreen(isClue ? "cluegiver" : "guesser")} style={{ padding: "14px 40px", fontSize: "20px", borderRadius: "12px", background: "white", color: teamColor, border: "none", cursor: "pointer", fontWeight: "bold" }}>
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
      <div style={{ fontFamily: "sans-serif", padding: "20px 20px 40px", minHeight: "100dvh", boxSizing: "border-box", textAlign: "center", overflowY: "auto" }}>
        <Logo onTap={handleLogoTap} center />
        <p>Game Mode:</p>
        <button onClick={() => setGameMode("sameroom")} style={{ padding: "10px 20px", fontSize: "16px", borderRadius: "8px", margin: "5px", background: gameMode === "sameroom" ? "#0066ff" : "#eee", color: gameMode === "sameroom" ? "white" : "black", border: "none", cursor: "pointer" }}>🏠 Same Room</button>
        <button onClick={() => setGameMode("remote")} style={{ padding: "10px 20px", fontSize: "16px", borderRadius: "8px", margin: "5px", background: gameMode === "remote" ? "#0066ff" : "#eee", color: gameMode === "remote" ? "white" : "black", border: "none", cursor: "pointer" }}>🌐 Remote</button>
        <p>Difficulty:</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "8px" }}>
          {Object.entries(DIFFICULTIES).map(([key, d]) => (
            <button key={key} onClick={() => setDifficulty(key)} style={{ padding: "10px 16px", fontSize: "15px", borderRadius: "10px", background: difficulty === key ? d.color : "#eee", color: difficulty === key ? "white" : "#333", border: difficulty === key ? `2px solid ${d.color}` : "2px solid #eee", cursor: "pointer", fontWeight: difficulty === key ? "bold" : "normal" }}>
              {d.label}
            </button>
          ))}
        </div>
        <p style={{ fontSize: "13px", color: DIFFICULTIES[difficulty].color, margin: "0 0 16px", fontWeight: "bold" }}>{DIFFICULTIES[difficulty].description}</p>
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
        <Footer nickname={nickname} onHint={useHint} onShowCredits={() => setShowCredits(true)} />
      </div>
    )
  }

  // JOIN SCREEN
  if (screen === "join") {
    return (
      <div style={{ fontFamily: "sans-serif", padding: "20px", minHeight: "100dvh", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <Logo onTap={handleLogoTap} center />
        <p>Enter the room code:</p>
        <input type="text" placeholder="Room code..." value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} maxLength={8} style={{ padding: "10px", fontSize: "32px", borderRadius: "8px", border: "2px solid #ff6600", textAlign: "center", letterSpacing: "6px", width: "100%", maxWidth: "260px", boxSizing: "border-box" }} />
        <br /><br />
        <button onClick={() => setScreen("lobby")} style={{ padding: "10px 30px", fontSize: "16px", borderRadius: "8px", background: "#ccc", color: "white", border: "none", cursor: "pointer", margin: "5px" }}>← Back</button>
        <button onClick={joinGame} style={{ padding: "10px 30px", fontSize: "16px", borderRadius: "8px", background: "#ff6600", color: "white", border: "none", cursor: "pointer", margin: "5px" }}>Join →</button>
        <Footer nickname={nickname} onHint={useHint} onShowCredits={() => setShowCredits(true)} />
      </div>
    )
  }

  // LOBBY SCREEN
  if (screen === "lobby") {
    return (
      <div style={{ fontFamily: "sans-serif", padding: "20px", minHeight: "100dvh", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <Logo onTap={handleLogoTap} center />
        <p style={{ fontSize: "18px" }}>Hey <strong>{nickname}</strong>! 👋</p>
        <br />
        <button onClick={() => setScreen("create")} style={{ padding: "10px 30px", fontSize: "18px", borderRadius: "8px", background: "#0066ff", color: "white", border: "none", cursor: "pointer", margin: "10px" }}>🎮 Create Game</button>
        <br />
        <button onClick={() => setScreen("join")} style={{ padding: "10px 30px", fontSize: "18px", borderRadius: "8px", background: "#ff6600", color: "white", border: "none", cursor: "pointer", margin: "10px" }}>🔗 Join Game</button>
        <Footer nickname={nickname} onHint={useHint} onShowCredits={() => setShowCredits(true)} />
      </div>
    )
  }

  // HOME SCREEN
  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px", minHeight: "100dvh", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <Logo onTap={null} center />
      <p style={{ color: "#999", fontSize: "14px", margin: "0 0 24px" }}>Send emojis. Guess the word.</p>
      <input
        type="text"
        placeholder="Your nickname..."
        value={nickname}
        onChange={(e) => {
          const val = e.target.value
          setNickname(val)
          const msg = CHEAT_MESSAGES[val.toLowerCase().trim()]
          if (msg) {
            setCheatMessage(msg)
            setCheatVisible(true)
          } else {
            setCheatVisible(false)
            setCheatMessage("")
          }
        }}
        onKeyDown={(e) => { if (e.key === "Enter" && nickname.trim()) setScreen("lobby") }}
        style={{ padding: "10px", fontSize: "18px", borderRadius: "8px", border: "1px solid #ccc", width: "100%", boxSizing: "border-box", maxWidth: "300px" }}
      />
      {cheatVisible && cheatMessage && (
        <div style={{
          marginTop: "12px",
          padding: "10px 16px",
          background: "#fff8e1",
          border: "1px solid #ffcc00",
          borderRadius: "10px",
          fontSize: "14px",
          color: "#aa6600",
          fontWeight: "bold",
          maxWidth: "300px",
          margin: "12px auto 0",
          animation: "fadeIn 0.4s ease"
        }}>
          {cheatMessage}
        </div>
      )}
      {nickname.trim() && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={() => {
            const seen = localStorage.getItem("guessmoji_seen_onboarding")
            if (!seen) {
              setShowOnboarding(true)
              setOnboardingCard(0)
            } else {
              setScreen("lobby")
            }
          }} style={{ padding: "14px 40px", fontSize: "20px", borderRadius: "12px", background: "#0066ff", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}>
            Let's Play →
          </button>
        </div>
      )}
      <div style={{ marginTop: "24px" }}>
        <button onClick={() => { setShowOnboarding(true); setOnboardingCard(0) }} style={{ background: "none", border: "none", color: "#0066ff", fontSize: "15px", cursor: "pointer", textDecoration: "underline" }}>
          ❓ How to Play
        </button>
      </div>
      <Footer nickname={nickname} onHint={useHint} onShowCredits={() => setShowCredits(true)} />
    </div>
  )
}
