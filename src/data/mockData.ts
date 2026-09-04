import { LessonStep, ChatMessage, ReadingPage, MistakeItem } from '../types';

export const INITIAL_LESSON_STEPS: LessonStep[] = [
  {
    id: 1,
    number: '01',
    title: 'Listening (YouTube Video)',
    type: 'listening',
    duration: '8 min',
    completed: false,
    active: true,
    locked: false,
  },
  {
    id: 2,
    number: '02',
    title: 'Reading (PDF Guide)',
    type: 'reading',
    duration: '10 min',
    completed: false,
    active: false,
    locked: true,
  },
  {
    id: 3,
    number: '03',
    title: 'Translation (41 Sentences)',
    type: 'translation',
    duration: '15 min',
    completed: false,
    active: false,
    locked: true,
  },
  {
    id: 4,
    number: '04',
    title: 'AI Conversation (Spoken Fluency)',
    type: 'speaking',
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
      "The quiet moments before dawn hold an extraordinary stillness. At 6:00 AM, before the rush of incoming notifications and demanding emails, the mind exists in its most pristine state. How you choose to design this first hour does not merely determine your morning—it establishes the trajectory for your entire day.",
      "In modern behavioral psychology, this is known as the 'Keystone Habit'. When you consistently wake up at the same hour and execute a predictable sequence—drinking lukewarm water, stretching your muscles, and engaging in deliberate contemplation—you signal to your nervous system that you are in command of your time.",
      "Notice the precise distinction in English between 'I used to wake up late' and 'I am used to waking up early'. The former denotes a habit firmly buried in the past; the latter describes an adaptation that has become natural and effortless in the present."
    ],
    hindi: [
      "भोर से पहले के शांत पल एक असाधारण स्तब्धता समेटे होते हैं। सुबह 6:00 बजे, आने वाले नोटिफिकेशन्स और ज़रूरी ईमेल्स की हड़बड़ाहट से पहले, मस्तिष्क अपनी सबसे शांत और स्पष्ट अवस्था में होता है। आप इस पहले घंटे को कैसे तैयार करते हैं, यह सिर्फ आपकी सुबह तय नहीं करता—बल्कि आपके पूरे दिन की दिशा निर्धारित करता है।",
      "आधुनिक व्यवहार मनोविज्ञान में इसे 'कीस्टोन हैबिट' (मुख्य आधारभूत आदत) कहा जाता है। जब आप लगातार एक ही समय पर उठते हैं और एक निश्चित क्रम का पालन करते हैं—गुनगुना पानी पीना, मांसपेशियों को स्ट्रेच करना और शांत चिंतन करना—तो आप अपने तंत्रिका तंत्र को संकेत देते हैं कि आप अपने समय के स्वामी हैं।",
      "अंग्रेजी में 'I used to wake up late' (मैं पहले देर से उठा करता था) और 'I am used to waking up early' (मुझे जल्दी उठने की आदत है) के बीच के बारीक अंतर पर ध्यान दें। पहला वाक्य भूतकाल की किसी पुरानी आदत को दर्शाता है, जबकि दूसरा वाक्य वर्तमान के उस सहज अनुकूलन का वर्णन करता है जो अब स्वाभाविक बन चुका है।"
    ]
  },
  {
    pageNumber: 2,
    english: [
      "Hydration is the catalytic foundation of mental clarity. During seven to eight hours of nocturnal rest, your body naturally depletes moisture. A tall glass of room-temperature or lukewarm water with a squeeze of fresh lemon gently kick-starts your digestive organs and primes your cognitive faculties.",
      "Many professionals confess, 'I cannot function until I have had my morning espresso.' While caffeine has proven ergogenic benefits, relying solely upon stimulants without prior hydration produces midday fatigue. Cultivate the ritual of hydrating before caffeinating.",
      "Observe the phrasal verb 'kick-start' in conversation: 'A balanced morning routine kick-starts my cognitive momentum.' It implies an energetic, decisive ignition of your daily potential."
    ],
    hindi: [
      "जलयोजन (पानी पीना) मानसिक स्पष्टता की पहली बुनियाद है। सात से आठ घंटे की नींद के दौरान हमारा शरीर स्वाभाविक रूप से नमी खो देता है। ताज़े नींबू के रस के साथ एक गिलास सादा या गुनगुना पानी आपकी पाचन क्रिया को सक्रिय करता है और बौद्धिक क्षमताओं को तरोताज़ा करता है।",
      "कई कामकाजी लोग अक्सर कहते हैं, 'जब तक मुझे सुबह की कॉफी नहीं मिलती, मैं काम ही नहीं कर पाता।' हालांकि कैफीन के अपने लाभ हैं, लेकिन पानी पिए बिना केवल उत्तेजक पदार्थों पर निर्भर रहने से दोपहर में थकान महसूस होने लगती है। कॉफी से पहले पानी पीने का नियम बनाएं।",
      "बातचीत में 'kick-start' जैसे फ्रेजल वर्ब पर ध्यान दें: 'एक संतुलित सुबह की दिनचर्या मेरी मानसिक ऊर्जा को शुरू (kick-start) करती है।' इसका अर्थ है अपनी दैनिक क्षमता को एक ऊर्जावान और दृढ़ शुरुआत देना।"
    ]
  },
  {
    pageNumber: 3,
    english: [
      "Digital discipline in the morning is a non-negotiable safeguard. The instant your fingers unlock your smartphone upon awakening, your mind is bombarded by external agendas, algorithmic anxieties, and global crises. You surrender proactive focus in exchange for reactive panic.",
      "Instead, reserve the initial thirty minutes exclusively for offline endeavors. Allow natural sunlight to meet your retina, setting your circadian biological clock. Review your top three priorities for the day on physical paper, and take pride in proactive composure.",
      "In fluent English, we describe this practice using gerunds: 'Avoiding social media early in the morning prevents cognitive overload.' When expressing advice or standard practices, leading with a gerund phrase lends authority and elegance to your spoken speech."
    ],
    hindi: [
      "सुबह के समय डिजिटल अनुशासन एक ऐसा नियम है जिससे कोई समझौता नहीं किया जा सकता। जागते ही जैसे ही आपकी उंगलियां स्मार्टफोन अनलॉक करती हैं, आपका दिमाग बाहरी मांगों, सूचनाओं के बोझ और चिंताओं से घिर जाता है। आप शांत और केंद्रित रहने के बजाय प्रतिक्रियाशील घबराहट के शिकार हो जाते हैं।",
      "इसके बजाय, शुरुआती तीस मिनट पूरी तरह से ऑफलाइन गतिविधियों के लिए सुरक्षित रखें। प्राकृतिक धूप को अपनी आंखों तक पहुंचने दें, जिससे आपकी जैविक घड़ी संतुलित हो सके। किसी डायरी पर दिन की अपनी शीर्ष तीन प्राथमिकताओं को लिखें और शांत मन से दिन की शुरुआत करें।",
      "प्रवाहपूर्ण अंग्रेजी में इस आदत को जेरंड (gerund) के साथ व्यक्त किया जाता है: 'Avoiding social media early in the morning prevents cognitive overload.' सलाह या नियमों की बात करते समय जेरंड से वाक्य शुरू करना आपकी बातचीत को प्रभावशाली बनाता है।"
    ]
  },
  {
    pageNumber: 4,
    english: [
      "Language learning thrives within the structure of routine. Allocating merely fifteen minutes of deliberate oral practice each morning compounds exponentially across ninety days. Consistency invariably trumps occasional intensity.",
      "Sarah, our case study from the audio dialogue, noted: 'When I practiced every day at the identical hour, English ceased being a chore and became second nature.' By anchoring vocabulary acquisition to your morning coffee or commute, fluency transforms from an abstract goal into a tangible daily reality.",
      "As you conclude this chapter and prepare for the 41 translation sentences, keep your focus on precision: speak every sentence aloud, feel the rhythm of each clause, and embrace each correction as an essential stepping stone toward mastery."
    ],
    hindi: [
      "भाषा सीखने की कला एक नियमित दिनचर्या के अनुशासन में सबसे अधिक फलती-फूलती है। हर सुबह केवल पंद्रह मिनट का एकाग्र मौखिक अभ्यास नब्बे दिनों में चमत्कारी परिणाम देता है। कभी-कभार की जाने वाली कठिन मेहनत की तुलना में रोज़ाना की निरंतरता हमेशा भारी पड़ती है।",
      "हमारे ऑडियो संवाद की शिक्षार्थी सारा ने कहा था: 'जब मैंने हर दिन एक ही समय पर अभ्यास किया, तो अंग्रेजी कोई बोझ नहीं बल्कि मेरी दूसरी प्रकृति बन गई।' जब आप नई शब्दावली सीखने को अपनी सुबह की चाय या दिनचर्या से जोड़ देते हैं, तो धाराप्रवाह बोलना कोई दूर का सपना नहीं बल्कि रोज़ की हकीकत बन जाता है।",
      "जैसे ही आप इस अध्याय को पूरा करके 41 अनुवाद वाक्यों की ओर बढ़ते हैं, अपना ध्यान सटीकता पर रखें: हर वाक्य को बोलकर पढ़ें, उसकी लय को महसूस करें, और हर सुधार को अपनी सफलता की सीढ़ी मानें।"
    ]
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'teacher',
    text: "Welcome to Day 1 Conversation Practice! Today we explored the science of morning routines from your YouTube video, read 'The 6:00 AM Architect', and translated 41 sentences on daily habits.\n\nLet's put this into practice! To begin: What is the very first thing you usually do right after waking up in the morning?",
    timestamp: 'Today',
    tip: 'Try using expressions from today, like: "Right after my alarm goes off, I usually..." or "The first thing I do is..."'
  }
];

export const REPEATED_MISTAKES: MistakeItem[] = [
  {
    id: 'mistake-1',
    title: 'Using "used to" with Gerunds vs Base Verbs',
    category: 'Grammar',
    details: 'Crucial distinction highlighted in Day 1 translation and reading.',
    explanation: 'When speaking of past discontinued habits, use "used to + base verb" (e.g., "I used to wake up late"). Only use "used to + verb-ing" when expressing familiarity ("I am used to waking up early").',
    incorrectExample: 'I used to waking up late when I was a student.',
    correctExample: 'I used to wake up late when I was a student.',
    rule: '"used to" for past habits is strictly followed by the base infinitive form.'
  },
  {
    id: 'mistake-2',
    title: 'Prepositions with Meals and Commutes',
    category: 'Grammar',
    details: 'Observed in sentences 14 and 33.',
    explanation: 'Use "for" with meals (e.g., "for breakfast", "for lunch") and "on" with public transit / travel paths (e.g., "on my way to work", "on the bus").',
    incorrectExample: 'I eat oatmeal in breakfast and listen to podcasts in my way to work.',
    correctExample: 'I eat oatmeal for breakfast and listen to podcasts on my way to work.',
    rule: 'Meals take preposition "for"; transit paths take "on my way to".'
  },
  {
    id: 'mistake-3',
    title: 'Phrasal Verb "Kick-start" & "Tidy up"',
    category: 'Speaking',
    details: 'Emphasized in video dialogue and sentence 29.',
    explanation: '"Kick-start" means to give energetic momentum to a process, and "tidy up" means to neatly organize a space.',
    incorrectExample: 'A glass of water gives a start to my day.',
    correctExample: 'A glass of water kick-starts my day.',
    rule: 'Use natural English idioms and phrasal verbs for fluid conversational cadence.'
  }
];
