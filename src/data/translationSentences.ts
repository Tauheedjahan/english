export interface TranslationSentence {
  id: number;
  hindi: string;
  english: string;
  alternatives: string[];
  category: string;
  keyGrammar: string;
  hint: string;
}

export const DAY_1_TRANSLATION_SENTENCES: TranslationSentence[] = [
  {
    id: 1,
    hindi: "एक घने जंगल में एक तेज़ खरगोश रहता था।",
    english: "A fast hare lived in a dense forest.",
    alternatives: [
      "A speedy hare lived in a thick forest.",
      "In a dense forest lived a quick hare.",
      "A swift hare lived in a lush forest."
    ],
    category: "Story Introduction",
    keyGrammar: "Simple Past tense with regular verb 'lived' for setting past narratives.",
    hint: "Fast hare / lived / dense forest"
  },
  {
    id: 2,
    hindi: "वह हमेशा अपनी तेज़ रफ़्तार पर घमंड करता था।",
    english: "He was always boastful of his fast speed.",
    alternatives: [
      "He always boasted about his great speed.",
      "He was always proud of his quick pace.",
      "He constantly bragged about his swiftness."
    ],
    category: "Character Trait",
    keyGrammar: "Adverb of frequency 'always' with past state-of-being 'was boastful of'.",
    hint: "always boastful / fast speed"
  },
  {
    id: 3,
    hindi: "कछुआ बहुत धीरे-धीरे चलता था।",
    english: "The tortoise used to walk very slowly.",
    alternatives: [
      "The tortoise walked very slowly.",
      "The tortoise was walking very slowly.",
      "The turtle moved at a very slow pace."
    ],
    category: "Character Trait",
    keyGrammar: "'Used to' expresses past habitual action or characteristic; adverb 'slowly' modifies 'walk'.",
    hint: "tortoise / used to walk / slowly"
  },
  {
    id: 4,
    hindi: "खरगोश ने कछुए की धीमी चाल का मज़ाक उड़ाया।",
    english: "The hare made fun of the tortoise's slow pace.",
    alternatives: [
      "The hare mocked the tortoise for moving slowly.",
      "The hare ridiculed the tortoise's slow walk.",
      "The hare laughed at the tortoise's slow pace."
    ],
    category: "Conflict",
    keyGrammar: "Phrasal idiom: 'make fun of' in simple past becomes 'made fun of'.",
    hint: "made fun of / tortoise's slow pace"
  },
  {
    id: 5,
    hindi: "कछुए ने शांत रहकर खरगोश को दौड़ की चुनौती दी।",
    english: "Staying calm, the tortoise challenged the hare to a race.",
    alternatives: [
      "The tortoise remained calm and challenged the hare to a race.",
      "The tortoise challenged the hare to a race while staying calm.",
      "Calmly, the tortoise threw a race challenge to the hare."
    ],
    category: "Challenge",
    keyGrammar: "Participial clause 'Staying calm' sets manner before the main action.",
    hint: "staying calm / challenged the hare / race"
  },
  {
    id: 6,
    hindi: "जंगल के सभी जानवर यह अनोखा मुकाबला देखने आए।",
    english: "All the animals of the forest came to watch this unique contest.",
    alternatives: [
      "All the forest animals gathered to see this unusual race.",
      "Every animal in the forest came to witness this unique match.",
      "The woodland animals arrived to view this rare race."
    ],
    category: "Gathering",
    keyGrammar: "Infinitive of purpose: 'came to watch' explains reason for arrival.",
    hint: "forest animals / came to watch / unique contest"
  },
  {
    id: 7,
    hindi: "दौड़ शुरू होते ही खरगोश हवा की तरह भागा।",
    english: "As soon as the race began, the hare ran like the wind.",
    alternatives: [
      "The moment the race started, the hare dashed forward like the wind.",
      "No sooner had the race begun than the hare sprinted ahead.",
      "As soon as the race commenced, the hare sped off like wind."
    ],
    category: "Race Start",
    keyGrammar: "Subordinating conjunction 'As soon as' paired with simile 'like the wind'.",
    hint: "as soon as / began / ran like the wind"
  },
  {
    id: 8,
    hindi: "कछुआ बिना रुके अपने कदम आगे बढ़ाता रहा।",
    english: "The tortoise kept moving his steps forward without stopping.",
    alternatives: [
      "Without pausing, the tortoise kept walking forward.",
      "The tortoise continued stepping forward steadily.",
      "The tortoise kept moving ahead relentlessly."
    ],
    category: "Perseverance",
    keyGrammar: "'Keep + verb-ing' demonstrates continuous past persistence.",
    hint: "kept moving / forward / without stopping"
  },
  {
    id: 9,
    hindi: "खरगोश ने पीछे मुड़कर देखा तो कछुआ बहुत दूर था।",
    english: "When the hare looked back, the tortoise was far behind.",
    alternatives: [
      "Looking back, the hare noticed the tortoise was miles away.",
      "The hare looked behind and saw the tortoise far in the distance.",
      "When the hare glanced backward, the tortoise was distant."
    ],
    category: "Observation",
    keyGrammar: "Time clause 'When the hare looked back' with adjective phrase 'far behind'.",
    hint: "when looked back / far behind"
  },
  {
    id: 10,
    hindi: "खरगोश ने एक घने पेड़ के नीचे आराम करने का फैसला किया।",
    english: "The hare decided to rest under a shady tree.",
    alternatives: [
      "The hare chose to take a nap beneath a dense tree.",
      "He made up his mind to rest under a leafy tree.",
      "The hare decided to relax under a shady oak tree."
    ],
    category: "Decision",
    keyGrammar: "Verb followed by infinitive: 'decided to rest'; preposition 'under'.",
    hint: "decided to rest / under a shady tree"
  },
  {
    id: 11,
    hindi: "ठंडी हवा के कारण उसे गहरी नींद आ गई।",
    english: "Due to the cool breeze, he fell into a deep sleep.",
    alternatives: [
      "Because of the gentle breeze, he fell fast asleep.",
      "The cool breeze lulled him into a sound sleep.",
      "Owing to the cool air, he drifted into deep slumber."
    ],
    category: "Action",
    keyGrammar: "Prepositional cause 'Due to' followed by idiom 'fell into a deep sleep'.",
    hint: "due to cool breeze / fell into deep sleep"
  },
  {
    id: 12,
    hindi: "दूसरी तरफ, कछुआ लगातार चलता रहा।",
    english: "On the other hand, the tortoise walked continuously.",
    alternatives: [
      "Meanwhile, the tortoise kept walking steadily.",
      "On the flip side, the tortoise never ceased walking.",
      "In contrast, the tortoise plodded on persistently."
    ],
    category: "Contrast",
    keyGrammar: "Contrastive connector 'On the other hand' highlights parallel opposing behavior.",
    hint: "on the other hand / walked continuously"
  },
  {
    id: 13,
    hindi: "उसने खरगोश को सोते हुए पार कर लिया।",
    english: "He passed the sleeping hare.",
    alternatives: [
      "He overtook the hare who was sound asleep.",
      "He walked past the sleeping hare quietly.",
      "He moved past the slumbering rabbit."
    ],
    category: "Turning Point",
    keyGrammar: "Present participle 'sleeping' acts as an adjective modifying 'hare'.",
    hint: "passed / sleeping hare"
  },
  {
    id: 14,
    hindi: "जब खरगोश की आँख खुली, तो सूरज ढल रहा था।",
    english: "When the hare opened his eyes, the sun was setting.",
    alternatives: [
      "By the time the hare woke up, the sun was going down.",
      "As the hare awakened, the sun was about to set.",
      "When the rabbit awoke, twilight was already falling."
    ],
    category: "Turning Point",
    keyGrammar: "Past Continuous 'was setting' for an environmental background event in progress.",
    hint: "when opened eyes / sun was setting"
  },
  {
    id: 15,
    hindi: "वह घबराकर फिनिश लाइन की ओर दौड़ा।",
    english: "He ran toward the finish line in panic.",
    alternatives: [
      "Panicking, he dashed toward the finish line.",
      "He sprinted frantically toward the victory ribbon.",
      "In a state of panic, he rushed to the finish line."
    ],
    category: "Climax",
    keyGrammar: "Directional preposition 'toward' with adverbial manner 'in panic'.",
    hint: "ran toward / finish line / in panic"
  },
  {
    id: 16,
    hindi: "लेकिन कछुआ पहले ही जीत चुका था।",
    english: "However, the tortoise had already won.",
    alternatives: [
      "But the tortoise had already crossed the line.",
      "Yet, the tortoise had already clinched the victory.",
      "Still, the tortoise had already finished the race."
    ],
    category: "Climax",
    keyGrammar: "Past Perfect 'had already won' for completion prior to another past point.",
    hint: "however / had already won"
  },
  {
    id: 17,
    hindi: "सभी जानवरों ने कछुए की जीत पर तालियाँ बजाईं।",
    english: "All the animals applauded the tortoise's victory.",
    alternatives: [
      "Every animal clapped for the tortoise's win.",
      "The woodland animals cheered and applauded the victory.",
      "All creatures cheered the winning tortoise."
    ],
    category: "Resolution",
    keyGrammar: "Past transitive verb 'applauded' with possessive noun 'tortoise\\'s'.",
    hint: "all animals / applauded / tortoise's victory"
  },
  {
    id: 18,
    hindi: "खरगोश को अपनी गलती और अहंकार का एहसास हुआ।",
    english: "The hare realized his mistake and arrogance.",
    alternatives: [
      "The rabbit understood his folly and excessive pride.",
      "The hare came to realize his pride and overconfidence.",
      "The hare felt remorse for his boastfulness and error."
    ],
    category: "Moral Growth",
    keyGrammar: "Transitive mental verb 'realized' followed by coordinate noun phrase.",
    hint: "realized / mistake and arrogance"
  },
  {
    id: 19,
    hindi: "धैर्य और लगन से कठिन लक्ष्य भी हासिल हो जाते हैं।",
    english: "With patience and dedication, even difficult goals are achieved.",
    alternatives: [
      "Patience and perseverance make even tough goals attainable.",
      "Through steady dedication, one can accomplish hard targets.",
      "With diligence and patience, impossible aims become reality."
    ],
    category: "Moral Lesson",
    keyGrammar: "Passive voice 'are achieved' expresses an enduring philosophical truth.",
    hint: "with patience and dedication / difficult goals / achieved"
  },
  {
    id: 20,
    hindi: "धीमी और निरंतर गति ही सफलता दिलाती है।",
    english: "Slow and steady wins the race.",
    alternatives: [
      "Consistency and patience bring lasting success.",
      "Steady effort always triumphs over erratic speed.",
      "A steady and calm pace leads to real victory."
    ],
    category: "Proverb",
    keyGrammar: "Compound subject 'Slow and steady' treated as a singular axiom taking 'wins'.",
    hint: "slow and steady / wins the race"
  },
  {
    id: 21,
    hindi: "अति-आत्मविश्वास हमेशा असफलता की ओर ले जाता है।",
    english: "Overconfidence always leads to failure.",
    alternatives: [
      "Excessive confidence inevitably brings defeat.",
      "Being overconfident always results in loss.",
      "Pride and overconfidence lead straight to failure."
    ],
    category: "Wisdom",
    keyGrammar: "Subject-verb agreement: uncountable noun 'Overconfidence' takes singular 'leads to'.",
    hint: "overconfidence / always leads to / failure"
  },
  {
    id: 22,
    hindi: "कछुए ने कभी अपनी कमजोरियों को रुकावट नहीं बनने दिया।",
    english: "The tortoise never allowed his weaknesses to become an obstacle.",
    alternatives: [
      "The tortoise never let his limitations stop him.",
      "The tortoise never permitted his slow speed to hinder his journey.",
      "He never allowed his physical drawbacks to hold him back."
    ],
    category: "Mindset",
    keyGrammar: "'Allow + object + to-infinitive' ('allowed his weaknesses to become').",
    hint: "never allowed / weaknesses / become an obstacle"
  },
  {
    id: 23,
    hindi: "उसने हर कदम पूरे ध्यान और विश्वास के साथ उठाया।",
    english: "He took every step with complete focus and faith.",
    alternatives: [
      "He placed each step with total focus and confidence.",
      "With full attention and trust, he took every step forward.",
      "He moved every step with total mindfulness and belief."
    ],
    category: "Mindset",
    keyGrammar: "Collocation: 'take steps' with prepositional phrase of manner 'with focus and faith'.",
    hint: "took every step / complete focus / faith"
  },
  {
    id: 24,
    hindi: "जंगल में किसी ने नहीं सोचा था कि कछुआ जीत सकता है।",
    english: "No one in the forest had thought that the tortoise could win.",
    alternatives: [
      "Nobody in the woods imagined that the tortoise would win.",
      "Not a single animal believed the tortoise was capable of winning.",
      "No creature had anticipated a tortoise victory."
    ],
    category: "Reaction",
    keyGrammar: "Negative indefinite pronoun 'No one' followed by Past Perfect 'had thought'.",
    hint: "no one in the forest / had thought / could win"
  },
  {
    id: 25,
    hindi: "सच्ची ताकत शोर मचाने में नहीं, शांत रहने में होती है।",
    english: "True strength lies not in making noise, but in staying calm.",
    alternatives: [
      "Real power is not about shouting, but maintaining quiet resilience.",
      "True power lies in quiet composure, not loud boasting.",
      "Genuine strength resides in calmness rather than noise."
    ],
    category: "Philosophical",
    keyGrammar: "Correlative structure: 'not in [gerund], but in [gerund]'.",
    hint: "true strength lies / not in making noise / in staying calm"
  },
  {
    id: 26,
    hindi: "खरगोश ने कछुए के पास जाकर हाथ मिलाया।",
    english: "The hare walked up to the tortoise and shook hands.",
    alternatives: [
      "The rabbit approached the tortoise and offered a handshake.",
      "The hare went over to the tortoise and shook his hand respectfully.",
      "Stepping forward, the hare congratulated the tortoise with a handshake."
    ],
    category: "Sportsmanship",
    keyGrammar: "Compound predicate: 'walked up to... and shook hands'.",
    hint: "walked up to / shook hands"
  },
  {
    id: 27,
    hindi: "उसने अपनी पराजय को विनम्रता से स्वीकार किया।",
    english: "He accepted his defeat with humility.",
    alternatives: [
      "He gracefully acknowledged his loss.",
      "He accepted the loss humbly and without anger.",
      "With genuine humility, he acknowledged the defeat."
    ],
    category: "Sportsmanship",
    keyGrammar: "Prepositional adverb of manner 'with humility' modifying 'accepted'.",
    hint: "accepted his defeat / with humility"
  },
  {
    id: 28,
    hindi: "उस दिन के बाद दोनों अच्छे दोस्त बन गए।",
    english: "After that day, both became good friends.",
    alternatives: [
      "From that day forward, the two became close friends.",
      "Following that race, both turned into great friends.",
      "They formed a lasting friendship after that day."
    ],
    category: "Epilogue",
    keyGrammar: "Time phrase 'After that day' followed by linking verb 'became'.",
    hint: "after that day / became good friends"
  },
  {
    id: 29,
    hindi: "यह कहानी हमें सिखाती है कि कभी किसी को कम मत समझो।",
    english: "This story teaches us never to underestimate anyone.",
    alternatives: [
      "This tale reminds us not to look down on others.",
      "This fable teaches that we should never undervalue anyone.",
      "The moral teaches us to never judge someone by appearances."
    ],
    category: "Takeaway",
    keyGrammar: "Verb pattern: 'teaches + indirect object + infinitive' ('teaches us to...').",
    hint: "teaches us / never to underestimate anyone"
  },
  {
    id: 30,
    hindi: "निरंतर प्रयास ही हर असंभव काम को संभव बनाता है।",
    english: "Continuous effort alone makes every impossible task possible.",
    alternatives: [
      "Persistent effort is what turns impossible tasks into reality.",
      "Consistent work alone makes the impossible achievable.",
      "Only regular perseverance renders impossible hurdles possible."
    ],
    category: "Core Philosophy",
    keyGrammar: "Adverbial limiter 'alone' with causative structure 'makes [noun phrase] [adjective]'.",
    hint: "continuous effort alone / makes impossible task possible"
  }
];
