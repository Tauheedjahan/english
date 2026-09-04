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
    hindi: "मैं आमतौर पर सुबह छह बजे उठता हूँ।",
    english: "I usually wake up at six in the morning.",
    alternatives: [
      "I usually wake up at 6 am.",
      "I generally wake up at 6 in the morning.",
      "I usually get up at six in the morning."
    ],
    category: "Waking & Awakening",
    keyGrammar: "Use 'wake up' for stopping sleep, 'usually' precedes the main verb.",
    hint: "usually wake up / at six"
  },
  {
    id: 2,
    hindi: "अलार्म बजने के तुरंत बाद मैं बिस्तर छोड़ देता हूँ।",
    english: "I get out of bed right after the alarm goes off.",
    alternatives: [
      "I leave the bed right after the alarm rings.",
      "I get up right after the alarm goes off.",
      "Immediately after the alarm goes off, I get out of bed."
    ],
    category: "Waking & Awakening",
    keyGrammar: "Phrasal verb: 'goes off' means to sound or ring; 'get out of bed' means physically standing up.",
    hint: "get out of bed / alarm goes off"
  },
  {
    id: 3,
    hindi: "मैं अपनी सुबह की चाय से पहले हमेशा एक गिलास गुनगुना पानी पीता हूँ।",
    english: "I always drink a glass of lukewarm water before my morning tea.",
    alternatives: [
      "I always drink a glass of warm water before my morning tea.",
      "Before my morning tea, I always drink a glass of lukewarm water."
    ],
    category: "Morning Hydration",
    keyGrammar: "'Lukewarm' refers to moderately warm water.",
    hint: "lukewarm water / before my morning tea"
  },
  {
    id: 4,
    hindi: "क्या आप सुबह जल्दी उठने के आदी हैं?",
    english: "Are you used to waking up early in the morning?",
    alternatives: [
      "Are you accustomed to waking up early in the morning?",
      "Are you used to getting up early in the morning?"
    ],
    category: "Habitual Structures",
    keyGrammar: "'Be used to' is followed by a gerund (verb + ing), not the base verb.",
    hint: "used to waking up / early in the morning"
  },
  {
    id: 5,
    hindi: "मैं पहले देर से उठा करता था, लेकिन अब मेरी दिनचर्या बदल गई है।",
    english: "I used to wake up late, but now my routine has changed.",
    alternatives: [
      "I used to get up late, but now my routine has changed.",
      "Previously I used to wake up late, but now my routine has changed."
    ],
    category: "Habitual Structures",
    keyGrammar: "'Used to' (past habit) takes the base infinitive: 'used to wake up'.",
    hint: "used to wake up / now my routine has changed"
  },
  {
    id: 6,
    hindi: "ताज़ी हवा लेने के लिए मैं बालकनी की खिड़कियाँ खोलता हूँ।",
    english: "I open the balcony windows to get some fresh air.",
    alternatives: [
      "I open the windows of the balcony to let in fresh air.",
      "To get fresh air, I open the balcony windows."
    ],
    category: "Morning Environment",
    keyGrammar: "'To get' is an infinitive of purpose.",
    hint: "open the balcony windows / fresh air"
  },
  {
    id: 7,
    hindi: "वह हर सुबह पंद्रह मिनट ध्यान लगाती है।",
    english: "She meditates for fifteen minutes every morning.",
    alternatives: [
      "She practices meditation for fifteen minutes every morning.",
      "Every morning she meditates for 15 minutes."
    ],
    category: "Mindfulness",
    keyGrammar: "Simple present with third-person singular 'meditates'; preposition 'for' specifies duration.",
    hint: "meditates for fifteen minutes"
  },
  {
    id: 8,
    hindi: "एक अच्छी सुबह की दिनचर्या पूरे दिन के लिए सकारात्मक माहौल तैयार करती है।",
    english: "A good morning routine sets a positive tone for the entire day.",
    alternatives: [
      "A healthy morning routine sets a positive tone for the whole day.",
      "A good morning routine establishes a positive tone for the entire day."
    ],
    category: "Mindfulness",
    keyGrammar: "Idiom: 'sets a positive tone' means creates the right atmosphere.",
    hint: "sets a positive tone / entire day"
  },
  {
    id: 9,
    hindi: "मैं अपने दिन की शुरुआत फोन चेक किए बिना करता हूँ।",
    english: "I start my day without checking my phone.",
    alternatives: [
      "I begin my day without looking at my phone.",
      "I start the day without checking my smartphone."
    ],
    category: "Digital Discipline",
    keyGrammar: "Preposition 'without' is followed by gerund 'checking'.",
    hint: "without checking my phone"
  },
  {
    id: 10,
    hindi: "हल्का व्यायाम मुझे ऊर्जावान महसूस करने में मदद करता है।",
    english: "Light exercise helps me feel energized.",
    alternatives: [
      "Light workout helps me feel full of energy.",
      "Mild exercise helps me feel energized throughout the day."
    ],
    category: "Physical Wellbeing",
    keyGrammar: "'Help someone do / feel something' (bare infinitive or to-infinitive).",
    hint: "light exercise / feel energized"
  },
  {
    id: 11,
    hindi: "नाश्ता करने से पहले मैं अपने दांत ब्रश करता हूँ और नहाता हूँ।",
    english: "Before having breakfast, I brush my teeth and take a shower.",
    alternatives: [
      "Before breakfast, I brush my teeth and take a bath.",
      "I brush my teeth and shower before having breakfast."
    ],
    category: "Personal Hygiene",
    keyGrammar: "Collocations: 'brush teeth', 'take a shower'.",
    hint: "brush my teeth / take a shower"
  },
  {
    id: 12,
    hindi: "मेरे पिता सुबह का अखबार पढ़ते हुए अपनी चाय पीते हैं।",
    english: "My father drinks his tea while reading the morning newspaper.",
    alternatives: [
      "My father sips his tea while reading the morning newspaper.",
      "While reading the morning paper, my father drinks his tea."
    ],
    category: "Family Routines",
    keyGrammar: "Participle clause with 'while' expressing simultaneous actions.",
    hint: "drinks his tea while reading"
  },
  {
    id: 13,
    hindi: "स्वस्थ नाश्ता आपके मस्तिष्क को सक्रिय रखने के लिए आवश्यक है।",
    english: "A healthy breakfast is essential to keep your brain active.",
    alternatives: [
      "A nutritious breakfast is necessary to keep your mind alert.",
      "A healthy breakfast is vital for keeping your brain active."
    ],
    category: "Breakfast & Nutrition",
    keyGrammar: "'Essential to keep' emphasizes necessity.",
    hint: "essential to keep / brain active"
  },
  {
    id: 14,
    hindi: "मैं अक्सर नाश्ते में दलिया और ताजे फल खाना पसंद करता हूँ।",
    english: "I often prefer to eat oatmeal and fresh fruits for breakfast.",
    alternatives: [
      "I often like having oatmeal and fresh fruit for breakfast.",
      "I usually prefer porridge and fresh fruits for breakfast."
    ],
    category: "Breakfast & Nutrition",
    keyGrammar: "Preposition 'for' is used with meals: 'for breakfast'.",
    hint: "prefer to eat oatmeal / for breakfast"
  },
  {
    id: 15,
    hindi: "क्या आप समय बचाने के लिए रात में ही अपने कपड़े तैयार कर लेते हैं?",
    english: "Do you prepare your clothes at night to save time?",
    alternatives: [
      "Do you lay out your clothes at night to save time?",
      "Do you pick your outfit the night before to save time?"
    ],
    category: "Daily Planning",
    keyGrammar: "Infinitive of purpose: 'to save time'.",
    hint: "prepare your clothes / to save time"
  },
  {
    id: 16,
    hindi: "वह हमेशा समय पर अपने कार्यालय पहुँचने की कोशिश करता है।",
    english: "He always tries to reach his office on time.",
    alternatives: [
      "He always tries to get to his office on time.",
      "He always aims to arrive at his office punctually."
    ],
    category: "Punctuality",
    keyGrammar: "'On time' means punctual; 'in time' means with time to spare.",
    hint: "tries to reach / on time"
  },
  {
    id: 17,
    hindi: "काम शुरू करने से पहले मैं अपनी दैनिक प्राथमिकताओं की एक सूची बनाता हूँ।",
    english: "Before starting work, I make a list of my daily priorities.",
    alternatives: [
      "Prior to beginning work, I create a list of my daily priorities.",
      "I list my daily priorities before I start working."
    ],
    category: "Productivity",
    keyGrammar: "Collocation: 'make a list', 'daily priorities'.",
    hint: "make a list / daily priorities"
  },
  {
    id: 18,
    hindi: "सुबह की शांति मुझे रचनात्मक रूप से सोचने में मदद करती है।",
    english: "The morning calm helps me think creatively.",
    alternatives: [
      "The morning silence allows me to think creatively.",
      "The quiet of the morning helps me think creatively."
    ],
    category: "Mindfulness",
    keyGrammar: "Adverb 'creatively' modifies verb 'think'.",
    hint: "morning calm / think creatively"
  },
  {
    id: 19,
    hindi: "मैं अपने काम पर जाने से पहले अपने पालतू कुत्ते को टहलाने ले जाता हूँ।",
    english: "I take my pet dog for a walk before heading to work.",
    alternatives: [
      "I walk my pet dog before leaving for work.",
      "Before going to work, I take my dog out for a walk."
    ],
    category: "Daily Life",
    keyGrammar: "Idiom: 'take ... for a walk'; 'heading to work' (phrasal verb for traveling towards).",
    hint: "take my dog for a walk / heading to work"
  },
  {
    id: 20,
    hindi: "आपको सुबह उठते ही सोशल मीडिया देखने से बचना चाहिए।",
    english: "You should avoid checking social media as soon as you wake up.",
    alternatives: [
      "You ought to avoid looking at social media immediately after waking up.",
      "Avoid checking social media right after waking up."
    ],
    category: "Digital Discipline",
    keyGrammar: "'Avoid' requires a gerund: 'avoid checking'. 'As soon as' introduces temporal clause.",
    hint: "avoid checking / as soon as you wake up"
  },
  {
    id: 21,
    hindi: "धूप में कुछ मिनट बिताना हमारी जैविक घड़ी को दुरुस्त रखता है।",
    english: "Spending a few minutes in sunlight regulates our biological clock.",
    alternatives: [
      "Spending a few minutes in the sun sets our circadian rhythm.",
      "A few minutes in the sunlight helps regulate our biological clock."
    ],
    category: "Health & Biology",
    keyGrammar: "Gerund phrase 'Spending a few minutes' functions as the subject.",
    hint: "spending a few minutes / biological clock"
  },
  {
    id: 22,
    hindi: "मेरी माँ हमेशा सुबह जल्दी उठकर ताज़ा खाना बनाती हैं।",
    english: "My mother always wakes up early in the morning and cooks fresh food.",
    alternatives: [
      "My mother always gets up early and prepares fresh meals.",
      "My mom always wakes up early in the morning to prepare fresh food."
    ],
    category: "Family Routines",
    keyGrammar: "Compound predicate: 'wakes up ... and cooks'.",
    hint: "wakes up early / cooks fresh food"
  },
  {
    id: 23,
    hindi: "मैं संगीत सुनते हुए अपने कमरे को व्यवस्थित करता हूँ।",
    english: "I tidy up my room while listening to music.",
    alternatives: [
      "I clean my room while listening to music.",
      "While listening to music, I organize my room."
    ],
    category: "Organization",
    keyGrammar: "Phrasal verb: 'tidy up' means clean and put things in order.",
    hint: "tidy up my room / while listening to music"
  },
  {
    id: 24,
    hindi: "अगर मैं अपनी सुबह की दिनचर्या छोड़ देता हूँ, तो मैं आलस महसूस करता हूँ।",
    english: "If I skip my morning routine, I feel sluggish.",
    alternatives: [
      "If I miss my morning routine, I feel lazy.",
      "Whenever I skip my morning routine, I feel lethargic."
    ],
    category: "Conditionals",
    keyGrammar: "Zero conditional for habitual truths: 'If + present simple, present simple'.",
    hint: "skip my morning routine / feel sluggish"
  },
  {
    id: 25,
    hindi: "वह काम पर जाने के लिए सुबह 8:30 बजे बस पकड़ती है।",
    english: "She catches the bus at 8:30 AM to commute to work.",
    alternatives: [
      "She takes the bus at 8:30 in the morning to go to work.",
      "She boards the bus at 8:30 am for work."
    ],
    category: "Commuting",
    keyGrammar: "Collocation: 'catch the bus'; 'commute to work'.",
    hint: "catches the bus / commute to work"
  },
  {
    id: 26,
    hindi: "संगति ही किसी भी नई आदत को बनाए रखने की असली कुंजी है।",
    english: "Consistency is the real key to maintaining any new habit.",
    alternatives: [
      "Consistency is the true key to sustaining any new habit.",
      "Being consistent is the secret to keeping any new habit."
    ],
    category: "Habit Formation",
    keyGrammar: "'The key to' is followed by a gerund ('maintaining').",
    hint: "consistency / real key to maintaining"
  },
  {
    id: 27,
    hindi: "मैं दिन के सबसे महत्वपूर्ण कार्य को सबसे पहले पूरा करता हूँ।",
    english: "I tackle the most important task of the day first.",
    alternatives: [
      "I complete the most crucial task of the day first.",
      "First thing, I handle the most important task of the day."
    ],
    category: "Productivity",
    keyGrammar: "Verb 'tackle' means to confront and deal with energetically.",
    hint: "tackle the most important task"
  },
  {
    id: 28,
    hindi: "क्या आपने कभी सुबह की सैर के फायदों को महसूस किया है?",
    english: "Have you ever felt the benefits of a morning walk?",
    alternatives: [
      "Have you ever experienced the benefits of morning walks?",
      "Did you ever notice the advantages of a morning walk?"
    ],
    category: "Experience",
    keyGrammar: "Present perfect 'Have you ever felt' expresses life experience.",
    hint: "have you ever felt / benefits of a morning walk"
  },
  {
    id: 29,
    hindi: "एक गिलास नींबू पानी पाचन क्रिया को शुरू करने में मदद करता है।",
    english: "A glass of lemon water helps kick-start the digestive system.",
    alternatives: [
      "A glass of warm lemon water helps stimulate digestion.",
      "Drinking lemon water helps jump-start your digestion."
    ],
    category: "Health & Nutrition",
    keyGrammar: "Idiom: 'kick-start' means to give vigorous initial impetus.",
    hint: "kick-start / digestive system"
  },
  {
    id: 30,
    hindi: "मैं अपने बैग को एक रात पहले ही पैक कर लेता हूँ ताकि सुबह हड़बड़ी न हो।",
    english: "I pack my bag the night before so there is no morning rush.",
    alternatives: [
      "I pack my bag the previous night to avoid rushing in the morning.",
      "To avoid the morning hurry, I pack my bag the night before."
    ],
    category: "Daily Planning",
    keyGrammar: "'So' / 'so that' expresses consequence and purpose.",
    hint: "the night before / no morning rush"
  },
  {
    id: 31,
    hindi: "सुबह का समय नई शब्दावली और अंग्रेजी सीखने के लिए सबसे अच्छा होता है।",
    english: "The morning is the best time to learn new vocabulary and English.",
    alternatives: [
      "Morning is the ideal time for acquiring new English vocabulary.",
      "The morning hours are best for learning new vocabulary in English."
    ],
    category: "Language Learning",
    keyGrammar: "Superlative 'the best time' followed by infinitive 'to learn'.",
    hint: "the best time / new vocabulary"
  },
  {
    id: 32,
    hindi: "वह काम शुरू करने से पहले पंद्रह मिनट प्रेरणादायक किताबें पढ़ती है।",
    english: "She reads inspirational books for fifteen minutes before starting work.",
    alternatives: [
      "She spends fifteen minutes reading inspiring books before work.",
      "Before starting work, she reads motivational books for 15 minutes."
    ],
    category: "Continuous Growth",
    keyGrammar: "'Inspirational' is an adjective modifying 'books'.",
    hint: "reads inspirational books / before starting work"
  },
  {
    id: 33,
    hindi: "मैं काम पर जाने के रास्ते में अक्सर अंग्रेजी पॉडकास्ट सुनता हूँ।",
    english: "I often listen to English podcasts on my way to work.",
    alternatives: [
      "On my way to work, I frequently listen to English podcasts.",
      "I usually tune in to English podcasts during my commute."
    ],
    category: "Passive Listening",
    keyGrammar: "Prepositional phrase: 'on my way to work'. 'Listen' always takes 'to'.",
    hint: "listen to English podcasts / on my way to work"
  },
  {
    id: 34,
    hindi: "समय प्रबंधन तनाव को कम करने और उत्पादकता बढ़ाने में मदद करता है।",
    english: "Time management helps reduce stress and boost productivity.",
    alternatives: [
      "Managing your time helps lower stress and increase productivity.",
      "Time management helps in reducing stress and enhancing productivity."
    ],
    category: "Productivity",
    keyGrammar: "Parallel verbs: 'reduce stress and boost productivity'.",
    hint: "reduce stress / boost productivity"
  },
  {
    id: 35,
    hindi: "मैं सुबह देर तक सोने के बजाय रात को जल्दी सोने को प्राथमिकता देता हूँ।",
    english: "I prioritize sleeping early at night rather than sleeping in late.",
    alternatives: [
      "I prefer going to bed early rather than waking up late.",
      "Instead of sleeping late, I prioritize an early bedtime."
    ],
    category: "Sleep Hygiene",
    keyGrammar: "Phrasal verb: 'sleep in' means to sleep longer than usual in the morning.",
    hint: "prioritize sleeping early / sleeping in late"
  },
  {
    id: 36,
    hindi: "अपने लक्ष्यों को रोज़ सुबह लिखना आपको केंद्रित रखता है।",
    english: "Writing down your goals every morning keeps you focused.",
    alternatives: [
      "Writing your goals each morning keeps you centered.",
      "Noting down your goals every morning maintains your focus."
    ],
    category: "Goal Setting",
    keyGrammar: "Gerund 'Writing down' serves as singular subject; verb is 'keeps'.",
    hint: "writing down your goals / keeps you focused"
  },
  {
    id: 37,
    hindi: "क्या आपके पास सुबह का कोई निश्चित समय सारिणी है?",
    english: "Do you have a fixed morning schedule?",
    alternatives: [
      "Do you have a set timetable for your mornings?",
      "Do you follow a structured morning routine?"
    ],
    category: "Habitual Structures",
    keyGrammar: "'Schedule' / 'routine' collocated with adjective 'fixed' or 'structured'.",
    hint: "fixed morning schedule"
  },
  {
    id: 38,
    hindi: "एक संतुलित दिनचर्या मानसिक स्पष्टता और शांति प्रदान करती है।",
    english: "A balanced routine provides mental clarity and peace.",
    alternatives: [
      "A balanced daily routine gives mental clarity and tranquility.",
      "Having a balanced routine brings clarity of mind and peace."
    ],
    category: "Mindfulness",
    keyGrammar: "Abstract nouns: 'mental clarity' and 'peace'.",
    hint: "balanced routine / mental clarity and peace"
  },
  {
    id: 39,
    hindi: "मैं अपने सहकर्मियों को मुस्कान के साथ 'सुप्रभात' कहता हूँ।",
    english: "I greet my colleagues with a smile and say good morning.",
    alternatives: [
      "I cheerfully wish my coworkers good morning with a smile.",
      "I greet my teammates with a smile every morning."
    ],
    category: "Workplace Etiquette",
    keyGrammar: "Verb 'greet' takes direct object without preposition ('greet my colleagues').",
    hint: "greet my colleagues / with a smile"
  },
  {
    id: 40,
    hindi: "छोटी-छोटी दैनिक आदतें समय के साथ बड़े परिणाम लाती हैं।",
    english: "Small daily habits lead to remarkable results over time.",
    alternatives: [
      "Small everyday habits produce big results over time.",
      "Tiny daily habits yield significant outcomes in the long run."
    ],
    category: "Atomic Habits",
    keyGrammar: "Phrasal verb: 'lead to'; time phrase: 'over time'.",
    hint: "small daily habits / remarkable results over time"
  },
  {
    id: 41,
    hindi: "मैं आज नए उत्साह और ऊर्जा के साथ अंग्रेजी सीखने के लिए तैयार हूँ।",
    english: "I am ready to learn English today with renewed enthusiasm and energy.",
    alternatives: [
      "I am prepared to practice English today with fresh energy and enthusiasm.",
      "Today I am ready to study English with enthusiasm and energy."
    ],
    category: "Empowerment & Milestone",
    keyGrammar: "Collocation: 'renewed enthusiasm and energy'.",
    hint: "ready to learn English / renewed enthusiasm"
  }
];
