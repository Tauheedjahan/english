const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'curriculum_db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

db.days = [
  {
    day_number: 1,
    topic: 'The Tortoise and the Hare',
    youtube_url: 'https://www.youtube.com/watch?v=W1hqarMIik8',
    youtube_title: 'The Tortoise and the Hare',
    reading_heading: 'The Tortoise and the Hare',
    story_content: 'In a peaceful forest, a boastful hare constantly mocked a slow-moving tortoise. Tired of the hare\'s arrogance, the tortoise calmly challenged him to a race. All the woodland animals gathered at sunrise to watch the unusual contest. The race began, and the hare leaped ahead with incredible speed, leaving the tortoise far behind. Confident that victory was guaranteed, the hare decided to take a short nap beneath a shady oak tree. Meanwhile, the patient tortoise kept taking one steady step after another without resting. When the hare finally woke up and sprinted frantically toward the finish line, he was shocked to see the tortoise crossing the ribbon. The gentle tortoise looked at the crowd and smiled, proving that slow and steady wins the race.',
    pdf_url: '',
    pdf_filename: 'Day_01_The_Tortoise_and_the_Hare.pdf',
    lesson_context: 'Story of the boastful hare and the determined tortoise. Key themes: perseverance, arrogance versus humility, steady effort, and narrative past tenses.',
    is_published: true,
    updated_at: new Date().toISOString()
  },
  {
    day_number: 2,
    topic: 'A Boy Who Rescued an Injured Bird',
    youtube_url: 'https://www.youtube.com/watch?v=kOuV4kKq5_I',
    youtube_title: 'The Power of Kindness and Empathy',
    reading_heading: 'The Injured Sparrow\'s Flight',
    story_content: 'On a brisk autumn afternoon, a ten-year-old boy named Aarav was walking through the park when he noticed something fluttering helplessly in the bushes. Moving closer, he discovered a small sparrow with a fractured wing. Remembering what his grandfather had taught him about gentle care, Aarav carefully scooped up the bird in his woolen cap and brought it home. He prepared a warm shoebox with soft cotton, fed it tiny droplets of fresh water with a dropper, and protected it from winter drafts. Over three weeks of patient nourishment, the wing slowly healed. One sunny morning, Aarav opened his bedroom window. The sparrow fluttered its wings, looked back with gratitude, and soared into the sky. Aarav realized that compassion requires patience, but its freedom brings immense joy.',
    pdf_url: '',
    pdf_filename: 'Day_02_Rescuing_Injured_Bird.pdf',
    lesson_context: 'Story about Aarav, empathy, nursing an injured sparrow back to health, feeding it with a dropper, and releasing it into the sky.',
    is_published: true,
    updated_at: new Date().toISOString()
  }
];

const day1Sentences = [
  {
    day_number: 1,
    sentence_order: 1,
    hindi: "एक घने जंगल में एक तेज़ खरगोश रहता था।",
    english: "A fast hare lived in a dense forest.",
    alternatives: ["A speedy hare lived in a thick forest.", "In a dense forest lived a quick hare."],
    hint: "Fast hare, lived, dense forest",
    key_grammar: "Simple Past tense with regular verb 'lived'",
    difficulty: "Beginner"
  },
  {
    day_number: 1,
    sentence_order: 2,
    hindi: "वह हमेशा अपनी तेज़ रफ़्तार पर घमंड करता था।",
    english: "He was always boastful of his fast speed.",
    alternatives: ["He always boasted about his great speed.", "He was always proud of his quick pace."],
    hint: "Always, boasted about, speed",
    key_grammar: "Past habitual action with adverb 'always'",
    difficulty: "Beginner"
  },
  {
    day_number: 1,
    sentence_order: 3,
    hindi: "कछुआ बहुत धीरे-धीरे चलता था।",
    english: "The tortoise used to walk very slowly.",
    alternatives: ["The tortoise was walking very slowly.", "The tortoise walked very slowly."],
    hint: "Tortoise, slowly, walked",
    key_grammar: "Adverb of manner 'slowly' modifying the verb 'walk'",
    difficulty: "Beginner"
  },
  {
    day_number: 1,
    sentence_order: 4,
    hindi: "खरगोश ने कछुए की धीमी चाल का मज़ाक उड़ाया।",
    english: "The hare made fun of the tortoise's slow pace.",
    alternatives: ["The hare mocked the tortoise for moving slowly.", "The hare ridiculed the tortoise's slow walk."],
    hint: "Made fun of, slow pace",
    key_grammar: "Phrasal verb 'make fun of' in simple past 'made fun of'",
    difficulty: "Intermediate"
  },
  {
    day_number: 1,
    sentence_order: 5,
    hindi: "कछुए ने शांत रहकर खरगोश को दौड़ की चुनौती दी।",
    english: "Staying calm, the tortoise challenged the hare to a race.",
    alternatives: ["The tortoise remained calm and challenged the hare to a race.", "The tortoise challenged the hare to a race while staying calm."],
    hint: "Staying calm, challenged, race",
    key_grammar: "Participial clause 'Staying calm' setting the context",
    difficulty: "Intermediate"
  },
  {
    day_number: 1,
    sentence_order: 6,
    hindi: "जंगल के सभी जानवर यह अनोखा मुकाबला देखने आए।",
    english: "All the animals of the forest came to watch this unique contest.",
    alternatives: ["All the forest animals gathered to see this unusual race.", "Every animal in the forest came to see the match."],
    hint: "Forest animals, came to watch, unique contest",
    key_grammar: "Infinitive of purpose: 'came to watch'",
    difficulty: "Intermediate"
  },
  {
    day_number: 1,
    sentence_order: 7,
    hindi: "दौड़ शुरू होते ही खरगोश हवा की तरह भागा।",
    english: "As soon as the race began, the hare ran like the wind.",
    alternatives: ["The moment the race started, the hare dashed forward like the wind.", "No sooner had the race begun than the hare sprinted ahead."],
    hint: "As soon as, began, ran like the wind",
    key_grammar: "Conjunction 'As soon as' introducing an immediate past event",
    difficulty: "Advanced"
  },
  {
    day_number: 1,
    sentence_order: 8,
    hindi: "कछुआ बिना रुके अपने कदम आगे बढ़ाता रहा।",
    english: "The tortoise kept moving his steps forward without stopping.",
    alternatives: ["Without pausing, the tortoise kept walking forward.", "The tortoise continued stepping forward steadily."],
    hint: "Kept moving, without stopping",
    key_grammar: "'Keep + verb-ing' expressing sustained continuity in the past",
    difficulty: "Intermediate"
  },
  {
    day_number: 1,
    sentence_order: 9,
    hindi: "खरगोश ने पीछे मुड़कर देखा तो कछुआ बहुत दूर था।",
    english: "When the hare looked back, the tortoise was far behind.",
    alternatives: ["Looking back, the hare noticed the tortoise was miles away.", "The hare looked behind and saw the tortoise far in the distance."],
    hint: "Looked back, far behind",
    key_grammar: "Time clause 'When the hare looked back' followed by state-of-being",
    difficulty: "Intermediate"
  },
  {
    day_number: 1,
    sentence_order: 10,
    hindi: "खरगोश ने एक घने पेड़ के नीचे आराम करने का फैसला किया।",
    english: "The hare decided to rest under a shady tree.",
    alternatives: ["The hare chose to take a nap beneath a dense tree.", "He made up his mind to rest under an oak tree."],
    hint: "Decided to rest, under a shady tree",
    key_grammar: "Verb + infinitive: 'decided to rest'",
    difficulty: "Beginner"
  },
  {
    day_number: 1,
    sentence_order: 11,
    hindi: "ठंडी हवा के कारण उसे गहरी नींद आ गई।",
    english: "Due to the cool breeze, he fell into a deep sleep.",
    alternatives: ["Because of the gentle breeze, he fell fast asleep.", "The cool breeze put him into a deep slumber."],
    hint: "Due to cool breeze, fell into deep sleep",
    key_grammar: "Prepositional phrase 'Due to' showing cause and effect",
    difficulty: "Intermediate"
  },
  {
    day_number: 1,
    sentence_order: 12,
    hindi: "दूसरी तरफ, कछुआ लगातार चलता रहा।",
    english: "On the other hand, the tortoise walked continuously.",
    alternatives: ["Meanwhile, the tortoise kept walking steadily.", "On the flip side, the tortoise never stopped marching."],
    hint: "On the other hand, walked continuously",
    key_grammar: "Transition connector 'On the other hand' linking contrasting actions",
    difficulty: "Intermediate"
  },
  {
    day_number: 1,
    sentence_order: 13,
    hindi: "उसने खरगोश को सोते हुए पार कर लिया।",
    english: "He passed the sleeping hare.",
    alternatives: ["He overtook the hare who was sound asleep.", "He walked past the sleeping hare without making a sound."],
    hint: "Passed, sleeping hare",
    key_grammar: "Participle 'sleeping' functioning as an adjective",
    difficulty: "Beginner"
  },
  {
    day_number: 1,
    sentence_order: 14,
    hindi: "जब खरगोश की आँख खुली, तो सूरज ढल रहा था।",
    english: "When the hare opened his eyes, the sun was setting.",
    alternatives: ["By the time the hare woke up, the sun was going down.", "As the hare awakened, the sun was about to set."],
    hint: "When opened eyes, sun was setting",
    key_grammar: "Past Continuous tense 'was setting' indicating an ongoing background event",
    difficulty: "Intermediate"
  },
  {
    day_number: 1,
    sentence_order: 15,
    hindi: "वह घबराकर फिनिश लाइन की ओर दौड़ा।",
    english: "He ran toward the finish line in panic.",
    alternatives: ["Panicking, he dashed toward the finish line.", "He sprinted frantically toward the victory ribbon."],
    hint: "Ran toward, finish line, panic",
    key_grammar: "Prepositional direction 'toward' and adverbial phrase 'in panic'",
    difficulty: "Intermediate"
  },
  {
    day_number: 1,
    sentence_order: 16,
    hindi: "लेकिन कछुआ पहले ही जीत चुका था।",
    english: "However, the tortoise had already won.",
    alternatives: ["But the tortoise had already crossed the line.", "Yet, the tortoise had already clinched the victory."],
    hint: "However, had already won",
    key_grammar: "Past Perfect tense 'had already won' showing an action completed before another past event",
    difficulty: "Intermediate"
  },
  {
    day_number: 1,
    sentence_order: 17,
    hindi: "सभी जानवरों ने कछुए की जीत पर तालियाँ बजाईं।",
    english: "All the animals applauded the tortoise's victory.",
    alternatives: ["Every animal clapped for the tortoise's win.", "The animals cheered and clapped for the victorious tortoise."],
    hint: "Applauded, tortoise's victory",
    key_grammar: "Transitive verb 'applauded' with possessive noun 'tortoise\\'s'",
    difficulty: "Intermediate"
  },
  {
    day_number: 1,
    sentence_order: 18,
    hindi: "खरगोश को अपनी गलती और अहंकार का एहसास हुआ।",
    english: "The hare realized his mistake and arrogance.",
    alternatives: ["The rabbit understood his folly and excessive pride.", "The hare came to realize his pride and overconfidence."],
    hint: "Realized, mistake, arrogance",
    key_grammar: "Compound abstract direct object: 'his mistake and arrogance'",
    difficulty: "Intermediate"
  },
  {
    day_number: 1,
    sentence_order: 19,
    hindi: "धैर्य और लगन से कठिन लक्ष्य भी हासिल हो जाते हैं।",
    english: "With patience and dedication, even difficult goals are achieved.",
    alternatives: ["Patience and perseverance make even tough goals attainable.", "Through steady dedication, one can accomplish hard targets."],
    hint: "Patience and dedication, difficult goals, achieved",
    key_grammar: "Passive voice 'are achieved' expressing general truth",
    difficulty: "Advanced"
  },
  {
    day_number: 1,
    sentence_order: 20,
    hindi: "धीमी और निरंतर गति ही सफलता दिलाती है।",
    english: "Slow and steady wins the race.",
    alternatives: ["Consistency and patience bring lasting success.", "Steady effort always triumphs over erratic speed."],
    hint: "Slow and steady, wins the race",
    key_grammar: "Idiomatic proverb functioning as a singular concept subject",
    difficulty: "Beginner"
  }
];

// Assign IDs and insert into DB
db.sentences = day1Sentences.map((s, idx) => ({
  id: 100 + idx + 1,
  ...s
}));

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Seeded curriculum_db.json successfully with', db.days.length, 'days and', db.sentences.length, 'sentences.');
