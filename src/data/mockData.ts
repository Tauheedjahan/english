import { LessonStep, ChatMessage, ReadingPage, MistakeItem } from '../types';

export const INITIAL_LESSON_STEPS: LessonStep[] = [
  {
    id: 1,
    number: '01',
    title: 'Listening',
    type: 'listening',
    duration: '8 min',
    completed: false,
    active: true,
    locked: false,
  },
  {
    id: 2,
    number: '02',
    title: 'Questions',
    type: 'questions',
    duration: '5 min',
    completed: false,
    active: false,
    locked: true,
  },
  {
    id: 3,
    number: '03',
    title: 'Speaking',
    type: 'speaking',
    duration: '10 min',
    completed: false,
    active: false,
    locked: true,
  },
  {
    id: 4,
    number: '04',
    title: 'Reading',
    type: 'reading',
    duration: '7 min',
    completed: false,
    active: false,
    locked: true,
  },
  {
    id: 5,
    number: '05',
    title: 'Questions',
    type: 'questions',
    duration: '5 min',
    completed: false,
    active: false,
    locked: true,
  },
  {
    id: 6,
    number: '06',
    title: 'Translation',
    type: 'translation',
    duration: '6 min',
    completed: false,
    active: false,
    locked: true,
  },
  {
    id: 7,
    number: '07',
    title: 'Assessment',
    type: 'assessment',
    duration: '10 min',
    completed: false,
    active: false,
    locked: true,
  },
];

export const READING_PAGES: ReadingPage[] = [
  {
    pageNumber: 1,
    english: [
      "The old clock tower struck midnight, its deep chime echoing through the empty, cobbled streets of Oxford. Sarah pulled her coat tighter against the sudden chill, her breath pluming in the crisp air. She hadn't intended to be out this late, but the library archives were a labyrinth of forgotten lore, and she had lost herself among the dusty tomes.",
      "A faint rustling caught her attention. It seemed to emanate from the shadowed alleyway next to the apothecary. Her logical mind told her it was merely a stray cat, perhaps a fox foraging for scraps. Yet, an inexplicable curiosity, a tremor of anticipation, rooted her to the spot.",
      "As she peered into the gloom, a soft, emerald luminescence began to pulse. It wasn't the harsh glare of a modern streetlamp, but a gentle, organic glow, like a captive firefly. The light revealed the outline of a heavy, oak door set deeply into the stone wall—a door she swore had never been there before."
    ],
    hindi: [
      "पुरानी घड़ी की मीनार ने आधी रात का घंटा बजाया, जिसकी गहरी गूंज ऑक्सफोर्ड की सुनसान, पथरीली गलियों में गूंज उठी। सारा ने अचानक आई ठंड से बचने के लिए अपने कोट को कसकर लपेट लिया, उसकी सांसें सर्द हवा में भाप बनकर उड़ रही थीं। उसका इतनी देर बाहर रहने का कोई इरादा नहीं था, लेकिन पुस्तकालय के अभिलेखागार भूली-बिसरी कहानियों की एक भूलभुलैया थे, और वह धूल भरी पुरानी किताबों के बीच खो गई थी।",
      "तभी एक हल्की सी सरसराहट ने उसका ध्यान आकर्षित किया। ऐसा लगा कि यह आवाज दवा विक्रेता की दुकान के बगल वाली अंधेरी गली से आ रही थी। उसके तार्किक दिमाग ने कहा कि यह सिर्फ कोई आवारा बिल्ली होगी, या शायद खाने की तलाश में कोई लोमड़ी। फिर भी, एक अकथनीय जिज्ञासा और उत्सुकता के कंपकंपाहट ने उसके कदम वहीं रोक दिए।",
      "जैसे ही उसने अंधेरे में झांका, एक हल्की पन्ना-हरी चमक धीरे-धीरे धड़कने लगी। यह किसी आधुनिक स्ट्रीटलाइट की तेज रोशनी नहीं थी, बल्कि एक कोमल, प्राकृतिक चमक थी, जैसे किसी पकड़े हुए जुगनू की रोशनी। इस प्रकाश ने पत्थर की दीवार में गहराई से लगे एक भारी ओक के दरवाजे की रूपरेखा को उजागर कर दिया—एक ऐसा दरवाजा जिसके बारे में वह कसम खा सकती थी कि वह पहले कभी वहां नहीं था।"
    ]
  },
  {
    pageNumber: 2,
    english: [
      "Her heart beat in tandem with the pulsing glow. She took a cautious step forward, the cobblestones cold beneath the soles of her leather boots. In her palm, she held a brass pocket watch handed down from her grandfather—a watch that had suddenly ceased ticking the moment the bell struck twelve.",
      "As she touched the tarnished iron knocker of the door, a faint vibration ran through her fingertips. It wasn't cold metal; it was warm, like living wood bathed in summer afternoon sun. Carved intricately across the timber was an inscription in antique script: 'Only what is spoken with truth shall open the threshold.'"
    ],
    hindi: [
      "उसका दिल उस धड़कती रोशनी के साथ तेजी से धड़कने लगा। उसने संभलकर एक कदम आगे बढ़ाया, उसके चमड़े के जूतों के नीचे पत्थर की सड़क ठंडी थी। अपनी हथेली में उसने पीतल की एक पुरानी जेब घड़ी थाम रखी थी जो उसके दादाजी से मिली थी—एक ऐसी घड़ी जिसने ठीक बारह बजते ही अचानक टिक-टिक करना बंद कर दिया था।",
      "जैसे ही उसने दरवाजे के पुराने लोहे के कुंडे को छुआ, उसकी उंगलियों में एक हल्की सी सिहरन दौड़ गई। यह कोई ठंडा धातु नहीं था; यह गर्म था, मानो गर्मियों की दोपहर की धूप में तपी जीवित लकड़ी हो। लकड़ी पर प्राचीन लिपि में जटिल नक्काशी की गई थी: 'केवल वही जो सत्य के साथ बोला जाए, इस चौखट को पार करा सकता है।'"
    ]
  },
  {
    pageNumber: 3,
    english: [
      "Sarah hesitated. In all her years studying linguistics and folklore, she had never encountered an artifact responsive to human vocal cadence. She cleared her dry throat and whispered, 'I seek understanding, not power.'",
      "Instantly, the heavy lock clicked with the sound of a dozen tumblers shifting into perfect alignment. The oak door swung slowly inward without making a sound, revealing a candlelit corridor lined from floor to arched ceiling with leather-bound manuscripts and brass astrolabes."
    ],
    hindi: [
      "सारा झिझकी। भाषाविज्ञान और लोककथाओं के अपने वर्षों के अध्ययन में, उसने कभी भी ऐसा कोई उपकरण नहीं देखा था जो मानव आवाज की लय पर प्रतिक्रिया दे। उसने अपने सूखे गले को साफ किया और धीरे से कहा, 'मैं समझ की तलाश में हूँ, शक्ति की नहीं।'",
      "तत्काल, भारी ताला एक साथ कई चाबियों के सही तालमेल में बैठने जैसी आवाज के साथ खुल गया। ओक का दरवाजा बिना कोई आवाज किए धीरे-धीरे अंदर की ओर खुला, और सामने एक मोमबत्तियों से जगमगाता गलियारा दिखाई दिया जिसकी दीवारों पर फर्श से लेकर मेहराबदार छत तक चमड़े की जिल्द वाली पांडुलिपियां और पीतल के यंत्र सजे थे।"
    ]
  },
  {
    pageNumber: 4,
    english: [
      "Stepping inside, the door sealed softly behind her. The air was rich with the scent of aged parchment, dried lavender, and beeswax. At the end of the long hall sat a mahogany desk, upon which rested a silver quill hovering gently above a blank sheet of vellum.",
      "As she approached, the quill began to write in elegant cursive script, spelling out words as if anticipating her unspoken inquiries. 'Every journey begins with a word, and every fluency with courage.'"
    ],
    hindi: [
      "अंदर कदम रखते ही दरवाजा उसके पीछे हौले से बंद हो गया। हवा पुरानी पांडुलिपियों, सूखे लैवेंडर और मोम की महक से भरी हुई थी। लंबे दालान के छोर पर महोगनी की एक मेज थी, जिस पर एक चांदी का पंखनुमा कलम कोरे चर्मपत्र के ऊपर धीरे-धीरे तैर रहा था।",
      "जैसे ही वह पास पहुँची, कलम ने खूबसूरत लिखावट में लिखना शुरू किया, मानो उसके अनकहे सवालों का पहले से अनुमान लगा रहा हो: 'प्रत्येक यात्रा की शुरुआत एक शब्द से होती है, और प्रत्येक धाराप्रवाहता का जन्म साहस से होता है।'"
    ]
  },
  {
    pageNumber: 5,
    english: [
      "Sarah smiled, feeling the apprehension dissolve into wonder. She reached out and grasped the quill. For the first time in months, her thoughts felt crystalline and clear. She was no longer just an observer of language; she had stepped into its living tapestry.",
      "With a steady hand, she wrote her reply beneath the prompt: 'I am ready to begin.'"
    ],
    hindi: [
      "सारा मुस्कुराई, उसने महसूस किया कि उसकी घबराहट विस्मय और आनंद में बदल गई थी। उसने हाथ बढ़ाकर कलम थाम ली। महीनों में पहली बार उसके विचार पूरी तरह से स्पष्ट और केंद्रित थे। अब वह केवल भाषा की दर्शक नहीं थी; वह उसके जीवंत ताने-बाने में शामिल हो चुकी थी।",
      "स्थिर हाथों से, उसने उस पंक्ति के ठीक नीचे अपना उत्तर लिखा: 'मैं शुरुआत करने के लिए तैयार हूँ।'"
    ]
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'teacher',
    text: "Hello Sarah! Ready to practice speaking about past habits today? Let's start with a simple question: What is something you used to do as a child but don't do anymore?",
    timestamp: 'Today',
    tip: 'Try starting with: "When I was younger, I used to..."'
  },
  {
    id: 'msg-2',
    sender: 'student',
    text: "When I was younger, I used to playing the piano every day after school, but now I don't have time.",
    timestamp: 'Today'
  },
  {
    id: 'msg-3',
    sender: 'teacher',
    text: "Good start! I understand exactly what you mean. However, let's look at a small grammar point.",
    timestamp: 'Today',
    correction: {
      original: '...used to playing...',
      corrected: 'play',
      rule: '"used to" is followed by the base form of the verb, not the -ing form.'
    },
    followup: "Can you try saying that sentence again?"
  }
];

export const REPEATED_MISTAKES: MistakeItem[] = [
  {
    id: 'mistake-1',
    title: 'Using "much" vs "many"',
    category: 'Grammar',
    details: 'Incorrectly applied in 3 recent exercises.',
    explanation: '"Much" is used with uncountable nouns (e.g., water, time, money), whereas "many" is used with countable plural nouns (e.g., books, apples, mistakes).',
    incorrectExample: 'I don\'t have many time left before class.',
    correctExample: 'I don\'t have much time left before class.',
    rule: 'Use "much" for singular/uncountable quantities and "many" for countable items that can be enumerated.'
  },
  {
    id: 'mistake-2',
    title: 'Word stress in polysyllabic words',
    category: 'Speaking',
    details: 'AI Teacher noted hesitation 4 times.',
    explanation: 'In words ending in "-tion", "-sion", or "-ic", the stress falls almost invariably on the penultimate (second-to-last) syllable.',
    incorrectExample: 'CON-ver-sa-tion (stress on first syllable)',
    correctExample: 'con-ver-SA-tion (primary stress on "sa")',
    rule: 'Words ending in "-tion" (information, preparation, situation) emphasize the syllable right before "-tion".'
  },
  {
    id: 'mistake-3',
    title: 'Gerunds following prepositions',
    category: 'Grammar',
    details: 'Flagged in Day 1 speaking practice.',
    explanation: 'When a verb directly follows a preposition (in, on, at, about, forward to), it must take the gerund (-ing) form.',
    incorrectExample: 'I look forward to see you tomorrow.',
    correctExample: 'I look forward to seeing you tomorrow.',
    rule: 'The "to" in "look forward to" is a preposition, requiring the gerund "seeing".'
  }
];
