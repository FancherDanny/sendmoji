import { useState, useEffect, useRef } from "react"
import { db } from "./firebase"
import { ref, set, update, onValue, push } from "firebase/database"

const VERSION = "v0.3.0"
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
  { emoji: "👩", keywords: ["woman", "female", "girl", "person", "adult", "mother", "mom", "her", "she", "lady", "sister"] },
  { emoji: "👶", keywords: ["baby", "infant", "newborn", "small", "child", "cute", "young", "tiny"] },
  { emoji: "👦", keywords: ["boy", "child", "kid", "young", "son", "male", "little", "school"] },
  { emoji: "👧", keywords: ["girl", "child", "kid", "young", "daughter", "female", "little", "school"] },
  { emoji: "👴", keywords: ["old man", "grandfather", "grandpa", "elderly", "senior", "aged", "wise"] },
  { emoji: "👵", keywords: ["old woman", "grandmother", "grandma", "elderly", "senior", "aged", "wise"] },
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
  { emoji: "🏕️", keywords: ["camping", "tent", "fire", "outdoor", "nature", "forest", "stars", "hike"] },
  { emoji: "🗺️", keywords: ["map", "treasure", "travel", "explore", "journey", "navigate", "world"] },
  { emoji: "🧭", keywords: ["compass", "navigate", "direction", "north", "explore", "guide", "lost"] },
  { emoji: "🚗", keywords: ["car", "drive", "road", "fast", "vehicle", "travel", "auto"] },
  { emoji: "🚢", keywords: ["ship", "boat", "cruise", "vessel", "titanic", "ocean liner", "sail", "sea"] },
  { emoji: "⚓", keywords: ["anchor", "ship", "boat", "sea", "navy", "port", "sailor", "dock"] },
  { emoji: "🏴‍☠️", keywords: ["pirate", "flag", "skull", "ship", "treasure", "sea", "jolly roger", "hook"] },
  { emoji: "🏖️", keywords: ["beach", "sand", "sun", "ocean", "summer", "vacation", "waves", "relax"] },
  { emoji: "🌃", keywords: ["night", "city", "stars", "dark", "lights", "skyline", "moon", "urban"] },
  { emoji: "🏠", keywords: ["house", "home", "building", "live", "inside", "shelter", "roof", "family"] },
  { emoji: "🏢", keywords: ["office", "building", "work", "city", "corporate", "business", "tall"] },
  { emoji: "🏦", keywords: ["bank", "money", "finance", "save", "rich", "vault", "institution"] },
  { emoji: "🏥", keywords: ["hospital", "doctor", "medical", "sick", "health", "nurse", "emergency"] },
  { emoji: "🏫", keywords: ["school", "education", "learn", "kids", "class", "study", "teacher"] },
  { emoji: "🏪", keywords: ["store", "shop", "buy", "mall", "retail", "market", "front", "convenience"] },
  { emoji: "🏩", keywords: ["love hotel", "romance", "hearts", "pink", "couples", "intimate"] },
  { emoji: "🏨", keywords: ["hotel", "stay", "room", "travel", "bed", "lobby", "resort", "night"] },
  { emoji: "⛪", keywords: ["church", "religion", "pray", "cross", "worship", "christian", "steeple"] },
  { emoji: "🕌", keywords: ["mosque", "islam", "pray", "religion", "dome", "crescent", "worship"] },
  { emoji: "🕍", keywords: ["synagogue", "jewish", "religion", "pray", "worship", "star of david"] },

  // Objects & Symbols
  { emoji: "💎", keywords: ["diamond", "jewel", "necklace", "gem", "ring", "sparkle", "precious", "shine"] },
  { emoji: "👑", keywords: ["crown", "king", "queen", "royal", "winner", "champion", "gold"] },
  { emoji: "🗡️", keywords: ["sword", "fight", "knight", "battle", "weapon", "sharp", "duel", "excalibur"] },
  { emoji: "⚔️", keywords: ["swords", "fight", "battle", "war", "cross", "duel", "knight", "clash", "weapon"] },
  { emoji: "🛡️", keywords: ["shield", "protect", "knight", "defense", "armor", "guard", "block"] },
  { emoji: "🔮", keywords: ["crystal ball", "magic", "future", "predict", "witch", "fortune", "see"] },
  { emoji: "💣", keywords: ["bomb", "explode", "danger", "blast", "tick", "destroy", "countdown", "war"] },
  { emoji: "🔫", keywords: ["gun", "pistol", "shoot", "weapon", "bang", "bullet", "wild west", "cop", "fire", "armed", "cowboy", "crime", "war", "police", "revolver", "shot"] },
  { emoji: "🪃", keywords: ["boomerang", "australia", "throw", "return", "curved", "outback", "come back"] },
  { emoji: "🪖", keywords: ["helmet", "military", "soldier", "army", "war", "protect", "camouflage"] },
  { emoji: "🎖️", keywords: ["medal", "military", "honor", "award", "soldier", "war", "brave"] },
  { emoji: "🚨", keywords: ["alarm", "police", "emergency", "siren", "red", "alert", "danger", "crime"] },
  { emoji: "🔑", keywords: ["key", "lock", "open", "secret", "door", "unlock", "access"] },
  { emoji: "📚", keywords: ["book", "read", "library", "school", "study", "learn", "knowledge"] },
  { emoji: "🎭", keywords: ["drama", "theatre", "act", "play", "mask", "performance", "stage"] },
  { emoji: "🎬", keywords: ["movie", "film", "cinema", "action", "director", "cut", "scene", "clapboard"] },
  { emoji: "🎵", keywords: ["music", "note", "song", "melody", "tune", "sing", "sound"] },
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
  { emoji: "🎮", keywords: ["game", "video game", "controller", "play", "fun", "console", "ps5", "xbox"] },
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
  { emoji: "📺", keywords: ["tv", "television", "watch", "show", "screen", "remote", "channel"] },
  { emoji: "🎙️", keywords: ["microphone", "sing", "record", "podcast", "radio", "voice", "speak"] },
  { emoji: "🧸", keywords: ["teddy bear", "toy", "soft", "cute", "child", "hug", "stuffed", "comfort"] },
  { emoji: "🎁", keywords: ["gift", "present", "wrap", "birthday", "surprise", "box", "ribbon"] },
  { emoji: "🎉", keywords: ["party", "celebrate", "fun", "confetti", "birthday", "cheer", "pop"] },
  { emoji: "🎈", keywords: ["balloon", "party", "float", "red", "celebrate", "birthday", "air"] },
  { emoji: "✨", keywords: ["sparkle", "magic", "shine", "glitter", "star", "special", "fairy"] },
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
  { emoji: "🌀", keywords: ["spiral", "cyclone", "dizzy", "spin", "tornado", "swirl", "hypnotic"] },
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
async function shareScoreCard({ scores, topic, sentEmojis, correct, rounds, currentRound, difficulty }) {
  const canvas = document.createElement("canvas")
  canvas.width = 600
  canvas.height = 400
  const ctx = canvas.getContext("2d")

  // Background
  ctx.fillStyle = "#0a0a1a"
  ctx.fillRect(0, 0, 600, 400)

  // Title
  ctx.fillStyle = "#0066ff"
  ctx.font = "bold 36px monospace"
  ctx.textAlign = "center"
  ctx.fillText("🎯 GuessMoji", 300, 60)

  // Difficulty pill
  const diffColors = { easy: "#00aa44", medium: "#ff9900", hard: "#cc0000" }
  const diffLabels = { easy: "EASY", medium: "MEDIUM", hard: "HARD" }
  ctx.fillStyle = diffColors[difficulty] || "#ff9900"
  ctx.beginPath()
  ctx.roundRect(230, 75, 140, 28, 14)
  ctx.fill()
  ctx.fillStyle = "white"
  ctx.font = "bold 14px monospace"
  ctx.fillText(diffLabels[difficulty] || "MEDIUM", 300, 94)

  // Topic reveal
  ctx.fillStyle = correct ? "#00aa44" : "#cc0000"
  ctx.font = "bold 28px monospace"
  ctx.fillText(correct ? "✅ Guessed it!" : "❌ Times Up!", 300, 145)
  ctx.fillStyle = "#ffffff"
  ctx.font = "22px monospace"
  ctx.fillText(`"${topic}"`, 300, 180)

  // Emojis sent
  if (sentEmojis.length > 0) {
    ctx.font = "32px serif"
    const startX = 300 - (sentEmojis.length * 22)
    sentEmojis.slice(0, 10).forEach((e, i) => {
      ctx.fillText(e, startX + i * 44, 230)
    })
  }

  // Scores
  const teamColors = { "Team 1": "#0066ff", "Team 2": "#ff6600", "Team 3": "#00aa44" }
  const entries = Object.entries(scores).filter(([, s]) => s > 0 || true)
  ctx.font = "bold 20px monospace"
  entries.forEach(([team, score], i) => {
    const x = 150 + i * 150
    ctx.fillStyle = teamColors[team] || "#ffffff"
    ctx.fillText(team, x, 275)
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 32px monospace"
    ctx.fillText(score, x, 310)
    ctx.font = "bold 20px monospace"
  })

  // Round info
  ctx.fillStyle = "#666"
  ctx.font = "14px monospace"
  ctx.fillText(`Round ${currentRound} of ${rounds}  •  guessmoji.app`, 300, 370)

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

function Footer({ nickname }) {
  const isMamabear = nickname?.toLowerCase() === "mamabear"
  return (
    <div style={{ textAlign: "center", marginTop: "32px", paddingBottom: "16px" }}>
      <span style={{ fontSize: "11px", color: "#bbb", letterSpacing: "0.5px" }}>
        🎯 GuessMoji {VERSION} · Made by {MADE_BY}
      </span>
      {isMamabear && Math.random() < 0.4 && (
        <div style={{ fontSize: "11px", color: "#ffaacc", marginTop: "4px" }}>
          Love you Mom ❤️
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
  const [hintText, setHintText] = useState("")
  const [muted, setMuted] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [teamNames, setTeamNames] = useState({ "Team 1": "Team 1", "Team 2": "Team 2", "Team 3": "Team 3" })
  const [editingTeam, setEditingTeam] = useState(null)
  const [editingName, setEditingName] = useState("")
  const [difficulty, setDifficulty] = useState("medium")

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
      if (data.hint) setHintText(data.hint)
      if (data.teamNames) setTeamNames(data.teamNames)

      if (data.emojis) {
        setReceivedEmojis(Object.values(data.emojis))
      } else {
        setReceivedEmojis([])
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
            setTimeout(() => searchRef.current?.focus(), 100)
          } else {
            setCountdown(index)
          }
        }, 800)
      }

      if (data.status === "roundend") {
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
        const newRound = data.currentRound || 1
        const myRole = data.roles?.[nickname] || "guesser"
        const myTeam = data.players?.[nickname]?.team || ""
        const myTeammate = Object.entries(data.players || {}).find(
          ([n, p]) => n !== nickname && p.team === myTeam
        )?.[0] || ""
        const nextDiff = data.difficulty || "medium"
        const nextSecs = DIFFICULTIES[nextDiff]?.timerSeconds || 60
        setCurrentTopic(data.topic || "")
        setCurrentRound(newRound)
        setScores(data.scores || { "Team 1": 0, "Team 2": 0, "Team 3": 0 })
        setRole(myRole)
        setTeam(myTeam)
        setTeammate(myTeammate)
        setDifficulty(nextDiff)
        setSentEmojis([])
        setReceivedEmojis([])
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
        setHintText("")
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
        setDifficulty(data.difficulty || "medium")
        setScreen("role")
      }
    })
    return () => unsub()
  }, [roomCode, nickname])

  useEffect(() => {
    if (!timerActive || timer <= 0) return
    const interval = setInterval(() => setTimer(t => t - 1), 1000)
    return () => clearInterval(interval)
  }, [timerActive, timer])

  useEffect(() => {
    if (!guesserActive || guesserTimer <= 0 || difficulty === "easy") return
    const interval = setInterval(() => setGuesserTimer(t => t - 1), 1000)
    return () => clearInterval(interval)
  }, [guesserActive, guesserTimer, difficulty])

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
    setHintUsed(false); setHintText("")
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
  const canSendMore = sentEmojis.length < maxEmojis

  const sendEmoji = async (emoji) => {
    if (!canSendMore) return
    setSentEmojis(prev => [...prev, emoji])
    setSearch("")
    if (searchRef.current) searchRef.current.value = ""
    await push(ref(db, `rooms/${roomCode}/emojis`), emoji)
    searchRef.current?.focus()
  }

  const normalizeGuess = (str) => str.trim().toLowerCase().replace(/^the\s+/, "")

  const submitGuess = async () => {
    if (!guess.trim()) return
    if (normalizeGuess(guess) === normalizeGuess(currentTopic)) {
      endRound(true)
    } else {
      const newWrong = [...wrongGuesses, guess.trim()]
      setWrongGuesses(newWrong)
      setGuess("")
      await update(ref(db, `rooms/${roomCode}`), { wrongGuesses: newWrong })
    }
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

  const useHint = async () => {
    if (hintUsed) return
    const firstLetter = currentTopic[0].toUpperCase()
    const hintMsg = `First letter: ${firstLetter}`
    setHintUsed(true)
    setHintText(hintMsg)
    // Deduct time on medium (10s), free on easy, disabled on hard
    if (difficulty === "medium") {
      const newTimer = Math.max(1, guesserTimer - 10)
      setGuesserTimer(newTimer)
    }
    await update(ref(db, `rooms/${roomCode}`), { hint: hintMsg })
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
        <button onClick={() => setShowHowToPlay(false)} style={{ width: "100%", padding: "14px", fontSize: "17px", borderRadius: "12px", background: "#0066ff", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", marginTop: "8px" }}>
          Got it! Let's Play 🎯
        </button>
        <Footer nickname={nickname} />
      </div>
    )
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
        <Footer nickname={nickname} />
      </div>
    )
  }

  // ROUND END
  if (screen === "roundend") {
    const gotIt = correct
    return (
      <div style={{ fontFamily: "sans-serif", padding: "20px", maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
        <Logo onTap={handleLogoTap} />
        <div style={{ background: gotIt ? "#e6ffe6" : "#ffe6e6", border: `2px solid ${gotIt ? "#00aa44" : "#cc0000"}`, borderRadius: "16px", padding: "24px", margin: "16px 0" }}>
          <div style={{ fontSize: "60px" }}>{gotIt ? "🎉" : "⏰"}</div>
          <h2 style={{ color: gotIt ? "#00aa44" : "#cc0000", margin: "8px 0" }}>{gotIt ? "Got it!" : "Time's Up!"}</h2>
          <p style={{ fontSize: "18px", margin: "8px 0", color: "#111" }}>The answer was <strong>{currentTopic}</strong></p>
          {gotIt && sentEmojis.length === 0 && (
            <p style={{ color: "#ff6600", fontSize: "15px", fontWeight: "bold" }}>🤨 Cheater cheater pumpkin eater! Zero emojis?!</p>
          )}
          {gotIt && sentEmojis.length > 0 && (
            <p style={{ color: "#666", fontSize: "14px" }}>Solved in {60 - guesserTimer}s with {sentEmojis.length} emoji{sentEmojis.length !== 1 ? "s" : ""}</p>
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
              <span style={{ fontWeight: "bold", color: "white", fontSize: "16px" }}>{t}</span>
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
              await shareScoreCard({ scores, topic: currentTopic, sentEmojis, correct, rounds, currentRound, difficulty })
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
        <Footer nickname={nickname} />
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
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={async () => {
              setSharing(true)
              await shareScoreCard({ scores, topic: currentTopic, sentEmojis, correct, rounds, currentRound: rounds, difficulty })
              setSharing(false)
            }}
            style={{ padding: "14px 28px", fontSize: "18px", borderRadius: "12px", background: "#6c3fc5", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}
          >
            {sharing ? "..." : "📤 Share Results"}
          </button>
          <button onClick={confirmReset} style={{ padding: "14px 28px", fontSize: "18px", borderRadius: "12px", background: "#0066ff", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}>🔄 Play Again</button>
        </div>
        <Footer nickname={nickname} />
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
          <p style={{ margin: "0 0 8px", fontSize: "12px", color: teamColor, letterSpacing: "1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>CLUES FROM {teammate.toUpperCase() || "YOUR TEAMMATE"}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {receivedEmojis.length === 0
              ? <p style={{ color: "#ccc", margin: 0 }}>Waiting for clues...</p>
              : receivedEmojis.map((e, i) => <span key={i} style={{ fontSize: "40px" }}>{e}</span>)
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
            {hintText && (
              <div style={{ background: "#fff8e1", border: "2px solid #ffcc00", borderRadius: "10px", padding: "8px 14px", marginBottom: "10px", fontSize: "14px", fontWeight: "bold", color: "#aa6600" }}>
                💡 {hintText}
              </div>
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
                  disabled={hintUsed}
                  style={{ padding: "12px 16px", fontSize: "16px", borderRadius: "12px", background: hintUsed ? "#eee" : "#fff8e1", color: hintUsed ? "#aaa" : "#aa6600", border: `2px solid ${hintUsed ? "#eee" : "#ffcc00"}`, cursor: hintUsed ? "not-allowed" : "pointer", fontWeight: "bold", whiteSpace: "nowrap" }}
                >
                  {hintUsed ? "💡 Used" : difficulty === "easy" ? "💡 Hint" : "💡 -10s"}
                </button>
              )}
            </div>
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
            <button onClick={toggleMute} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", padding: "4px" }}>{muted ? "🔇" : "🔊"}</button>
            <DifficultyBadge difficulty={difficulty} timer={timer} />
          </div>
        </div>
        <div style={{ background: teamColor, color: "white", borderRadius: "12px", padding: "12px 16px", textAlign: "center", margin: "8px 0", position: "sticky", top: "0", zIndex: 9 }}>
          <p style={{ margin: 0, fontSize: "12px", opacity: 0.8 }}>YOUR TOPIC</p>
          <h1 style={{ margin: "4px 0 0", fontSize: "28px" }}>{currentTopic}</h1>
        </div>
        {countdown !== null && (
          <div style={{ fontSize: "100px", fontWeight: "bold", textAlign: "center", color: teamColor, margin: "20px 0" }}>
            {countdownWords[countdown]}
          </div>
        )}
        {!timerActive && countdown === null && (
          <>
            <p style={{ color: readyPlayers[teammate] ? "#00aa44" : "#999", fontSize: "14px", textAlign: "center", margin: "0 0 10px", fontWeight: readyPlayers[teammate] ? "bold" : "normal" }}>
              {readyPlayers[teammate] ? `✅ ${teammate} is on the guesser screen!` : `⏳ ${teammate || "Guesser"} is heading over...`}
            </p>
            <button onClick={startCountdown} style={{ width: "100%", padding: "14px", fontSize: "18px", borderRadius: "12px", background: teamColor, color: "white", border: "none", cursor: "pointer", marginBottom: "16px", fontWeight: "bold" }}>
              Start Round ▶️
            </button>
          </>
        )}
        <div style={{ minHeight: "50px", background: "#f5f5f5", borderRadius: "12px", padding: "10px", marginBottom: "4px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {sentEmojis.length === 0
            ? <p style={{ color: "#999", margin: 0, fontSize: "14px" }}>Sent emojis appear here...</p>
            : sentEmojis.map((e, i) => <span key={i} style={{ fontSize: "28px" }}>{e}</span>)
          }
        </div>
        {difficulty === "hard" && (
          <p style={{ fontSize: "12px", color: canSendMore ? "#cc0000" : "#cc0000", fontWeight: "bold", margin: "0 0 12px", textAlign: "right" }}>
            {canSendMore ? `😈 ${maxEmojis - sentEmojis.length} emoji${maxEmojis - sentEmojis.length !== 1 ? "s" : ""} left` : "🚫 Max emojis reached!"}
          </p>
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
      <div style={{ textAlign: "center", marginTop: "80px", fontFamily: "sans-serif", background: teamColor, minHeight: "100dvh", color: "white", padding: "20px", boxSizing: "border-box" }}>
        <p style={{ fontSize: "14px", letterSpacing: "2px", opacity: 0.8 }}>🔒 DON'T SHOW YOUR SCREEN</p>
        <p style={{ fontSize: "14px", opacity: 0.7 }}>Round {currentRound} of {rounds} · {team} · {DIFFICULTIES[difficulty]?.label || "Medium"}</p>
        <h1 style={{ fontSize: "28px", marginTop: "20px" }}>Hey {nickname}!</h1>
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
      <div style={{ textAlign: "center", marginTop: "40px", fontFamily: "sans-serif", padding: "20px" }}>
        <Logo onTap={handleLogoTap} />
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
        <Footer nickname={nickname} />
      </div>
    )
  }

  // JOIN SCREEN
  if (screen === "join") {
    return (
      <div style={{ textAlign: "center", marginTop: "100px", fontFamily: "sans-serif", padding: "20px" }}>
        <Logo onTap={handleLogoTap} />
        <p>Enter the room code:</p>
        <input type="text" placeholder="Room code..." value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} maxLength={8} style={{ padding: "10px", fontSize: "32px", borderRadius: "8px", border: "2px solid #ff6600", textAlign: "center", letterSpacing: "6px", width: "100%", maxWidth: "260px", boxSizing: "border-box" }} />
        <br /><br />
        <button onClick={() => setScreen("lobby")} style={{ padding: "10px 30px", fontSize: "16px", borderRadius: "8px", background: "#ccc", color: "white", border: "none", cursor: "pointer", margin: "5px" }}>← Back</button>
        <button onClick={joinGame} style={{ padding: "10px 30px", fontSize: "16px", borderRadius: "8px", background: "#ff6600", color: "white", border: "none", cursor: "pointer", margin: "5px" }}>Join →</button>
        <Footer nickname={nickname} />
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
        <Footer nickname={nickname} />
      </div>
    )
  }

  // HOME SCREEN
  return (
    <div style={{ textAlign: "center", marginTop: "80px", fontFamily: "sans-serif", padding: "20px" }}>
      <h1 style={{ fontSize: "36px", margin: "0 0 4px" }}>🎯 GuessMoji</h1>
      <p style={{ color: "#999", fontSize: "14px", margin: "0 0 24px" }}>Send emojis. Guess the word.</p>
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
      <div style={{ marginTop: "24px" }}>
        <button onClick={() => setShowHowToPlay(true)} style={{ background: "none", border: "none", color: "#0066ff", fontSize: "15px", cursor: "pointer", textDecoration: "underline" }}>
          ❓ How to Play
        </button>
      </div>
      <Footer nickname={nickname} />
    </div>
  )
}
