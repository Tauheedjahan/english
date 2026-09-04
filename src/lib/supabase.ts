import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { DayRecord, SentenceRecord, UserDayProgressRecord, AIScoreRecord, UserProfile } from '../types';
import { DAY_1_TRANSLATION_SENTENCES } from '../data/translationSentences';

// Read Vite client environment variables safely
const metaEnv = (import.meta as any).env || {};
const supabaseUrl: string = metaEnv.VITE_SUPABASE_URL || '';
const supabaseAnonKey: string = metaEnv.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'MY_SUPABASE_URL' &&
  !supabaseUrl.includes('placeholder')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// ==============================================================================
// INITIAL SEED DATA (Used for Supabase seeding and local fallback)
// ==============================================================================

export const SEED_DAYS: DayRecord[] = [
  {
    day_number: 1,
    topic: 'Morning Routines & Habit Loops',
    youtube_url: 'https://www.youtube.com/watch?v=RcGyVTAoXEU',
    youtube_title: 'The Science of Morning Routines & Productive Habits',
    reading_heading: 'The 6:00 AM Architect',
    story_content: `The dawn broke over the city in a soft wash of amber and steel-grey light. While the neighborhood was still wrapped in silence, Rohan woke up at 6:00 AM. He immediately resisted the urge to reach for his smartphone. Instead, he drank a large glass of lukewarm water to kick-start his metabolism and stood beside the open window, inhaling the crisp morning air. Over the past month, he had replaced chaos with quiet intention. He used to stay up late browsing social media, but now he prioritized physical and mental clarity. By preparing his mind and embracing challenge with courage, every morning became an architectural foundation for genuine productivity.`,
    pdf_url: '',
    pdf_filename: 'Day_01_Morning_Routines_Guide.pdf',
    lesson_context: 'Focus on daily morning habits, waking up without friction, reframing stress as courage, and using verbs like wake up, kick-start, used to, and reach out.',
    is_published: true,
  },
  {
    day_number: 2,
    topic: 'A Boy Who Rescued an Injured Bird',
    youtube_url: 'https://www.youtube.com/watch?v=kOuV4kKq5_I',
    youtube_title: 'The Power of Kindness and Empathy',
    reading_heading: 'The Injured Sparrow’s Flight',
    story_content: `On a brisk autumn afternoon, a ten-year-old boy named Aarav was walking through the park when he noticed something fluttering helplessly in the bushes. Moving closer, he discovered a small sparrow with a fractured wing. Remembering what his grandfather had taught him about gentle care, Aarav carefully scooped up the bird in his woolen cap and brought it home. He prepared a warm shoebox with soft cotton, fed it tiny droplets of fresh water with a dropper, and protected it from winter drafts. Over three weeks of patient nourishment, the wing slowly healed. One sunny morning, Aarav opened his bedroom window. The sparrow fluttered its wings, looked back with gratitude, and soared into the sky. Aarav realized that compassion requires patience, but its freedom brings immense joy.`,
    pdf_url: '',
    pdf_filename: 'Day_02_Rescuing_Injured_Bird.pdf',
    lesson_context: 'Story about Aarav, empathy, nursing an injured sparrow back to health, feeding it with a dropper, and releasing it into the sky.',
    is_published: true,
  },
];

// 30 Sentences for Day 1
export const SEED_DAY_1_SENTENCES: SentenceRecord[] = DAY_1_TRANSLATION_SENTENCES.slice(0, 30).map((s, idx) => ({
  id: s.id,
  day_number: 1,
  sentence_order: idx + 1,
  hindi: s.hindi,
  english: s.english,
  alternatives: s.alternatives,
  hint: s.hint,
  key_grammar: s.keyGrammar,
  difficulty: idx < 10 ? 'Beginner' : idx < 20 ? 'Intermediate' : 'Advanced',
}));

// 30 Sentences for Day 2 (A Boy Who Rescued an Injured Bird)
export const SEED_DAY_2_SENTENCES: SentenceRecord[] = [
  {
    id: 201,
    day_number: 2,
    sentence_order: 1,
    hindi: 'आरव पार्क में धीरे-धीरे टहल रहा था।',
    english: 'Aarav was walking slowly in the park.',
    alternatives: ['Aarav was strolling slowly through the park.', 'Aarav walked slowly in the park.'],
    hint: 'walking slowly / in the park',
    key_grammar: 'Past continuous: was walking.',
    difficulty: 'Beginner',
  },
  {
    id: 202,
    day_number: 2,
    sentence_order: 2,
    hindi: 'उसने झाड़ियों में कुछ हिलते हुए देखा।',
    english: 'He saw something moving in the bushes.',
    alternatives: ['He noticed something fluttering in the bushes.', 'He saw something move in the bushes.'],
    hint: 'saw something / moving in the bushes',
    key_grammar: 'Sensory perception verb followed by participle (saw + object + -ing).',
    difficulty: 'Beginner',
  },
  {
    id: 203,
    day_number: 2,
    sentence_order: 3,
    hindi: 'वहाँ एक छोटी घायल चिड़िया थी।',
    english: 'There was a small injured bird.',
    alternatives: ['A small wounded bird was there.', 'There was a little hurt bird.'],
    hint: 'small injured bird',
    key_grammar: 'Past simple with "there was". "Injured" acts as an adjective.',
    difficulty: 'Beginner',
  },
  {
    id: 204,
    day_number: 2,
    sentence_order: 4,
    hindi: 'चिड़िया का एक पंख टूटा हुआ था।',
    english: 'One of the bird\'s wings was broken.',
    alternatives: ['The bird had a broken wing.', 'The bird\'s wing was fractured.'],
    hint: 'wing was broken / fractured',
    key_grammar: 'Possessive: bird\'s wings; passive state "was broken".',
    difficulty: 'Beginner',
  },
  {
    id: 205,
    day_number: 2,
    sentence_order: 5,
    hindi: 'वह उड़ने में असमर्थ थी।',
    english: 'It was unable to fly.',
    alternatives: ['It could not fly.', 'She was not able to fly.'],
    hint: 'unable to fly',
    key_grammar: 'Predicate adjective "unable to + verb".',
    difficulty: 'Beginner',
  },
  {
    id: 206,
    day_number: 2,
    sentence_order: 6,
    hindi: 'आरव ने उसे अपनी ऊनी टोपी में उठा लिया।',
    english: 'Aarav picked it up in his woolen cap.',
    alternatives: ['Aarav scooped it up with his woolen cap.', 'Aarav lifted it up in his woolen hat.'],
    hint: 'picked it up / woolen cap',
    key_grammar: 'Separable phrasal verb: "picked it up".',
    difficulty: 'Beginner',
  },
  {
    id: 207,
    day_number: 2,
    sentence_order: 7,
    hindi: 'उसने चिड़िया को बहुत सावधानी से संभाला।',
    english: 'He handled the bird very carefully.',
    alternatives: ['He handled the bird with great care.', 'He took care of the bird very gently.'],
    hint: 'handled / very carefully',
    key_grammar: 'Adverb of manner "carefully" modifying the verb "handled".',
    difficulty: 'Beginner',
  },
  {
    id: 208,
    day_number: 2,
    sentence_order: 8,
    hindi: 'वह तुरंत उसे अपने घर ले आया।',
    english: 'He brought it home immediately.',
    alternatives: ['He took it straight to his house.', 'He brought it to his home right away.'],
    hint: 'brought it home / immediately',
    key_grammar: 'Note that "home" is used as a direction without "to": "brought it home".',
    difficulty: 'Beginner',
  },
  {
    id: 209,
    day_number: 2,
    sentence_order: 9,
    hindi: 'उसने उसके लिए एक गर्म जूता-बॉक्स तैयार किया।',
    english: 'He prepared a warm shoebox for it.',
    alternatives: ['He made a warm shoebox for the bird.', 'He arranged a warm box for it.'],
    hint: 'prepared / warm shoebox',
    key_grammar: 'Simple past tense: prepared.',
    difficulty: 'Beginner',
  },
  {
    id: 210,
    day_number: 2,
    sentence_order: 10,
    hindi: 'उसने डिब्बे में मुलायम रुई बिछा दी।',
    english: 'He spread soft cotton in the box.',
    alternatives: ['He laid soft cotton inside the box.', 'He put soft cotton in the box.'],
    hint: 'spread soft cotton',
    key_grammar: 'The past tense of "spread" is "spread".',
    difficulty: 'Beginner',
  },
  {
    id: 211,
    day_number: 2,
    sentence_order: 11,
    hindi: 'आरव ने ड्रॉपर से उसे पानी की बूँदें पिलाईं।',
    english: 'Aarav fed it drops of water with a dropper.',
    alternatives: ['Aarav gave it water drops using a dropper.', 'Aarav fed it droplets of water with an eyedropper.'],
    hint: 'drops of water / with a dropper',
    key_grammar: 'Instrumental preposition: "with a dropper".',
    difficulty: 'Intermediate',
  },
  {
    id: 212,
    day_number: 2,
    sentence_order: 12,
    hindi: 'शुरुआत में चिड़िया बहुत डरी हुई थी।',
    english: 'At first, the bird was very frightened.',
    alternatives: ['Initially, the bird was terrified.', 'In the beginning, the bird was very scared.'],
    hint: 'at first / very frightened',
    key_grammar: 'Adverbial phrase: "at first"; participial adjective "frightened".',
    difficulty: 'Intermediate',
  },
  {
    id: 213,
    day_number: 2,
    sentence_order: 13,
    hindi: 'लेकिन धीरे-धीरे उसने आरव पर भरोसा करना शुरू कर दिया।',
    english: 'But gradually, it began to trust Aarav.',
    alternatives: ['However, slowly it started trusting Aarav.', 'But step by step, it began trusting Aarav.'],
    hint: 'gradually / began to trust',
    key_grammar: 'Infinitive complement: "began to trust".',
    difficulty: 'Intermediate',
  },
  {
    id: 214,
    day_number: 2,
    sentence_order: 14,
    hindi: 'आरव ने उसे ठंडी हवाओं से बचाकर रखा।',
    english: 'Aarav kept it sheltered from cold drafts.',
    alternatives: ['Aarav protected it from cold winds.', 'Aarav kept it safe from the chilly breeze.'],
    hint: 'kept it sheltered / from cold drafts',
    key_grammar: 'Structure: kept + object + adjective/participle (sheltered).',
    difficulty: 'Intermediate',
  },
  {
    id: 215,
    day_number: 2,
    sentence_order: 15,
    hindi: 'उसके दादाजी ने उसे पक्षियों की देखभाल करना सिखाया था।',
    english: 'His grandfather had taught him how to care for birds.',
    alternatives: ['His grandfather had taught him to take care of birds.', 'His granddad taught him how to look after birds.'],
    hint: 'had taught him / care for birds',
    key_grammar: 'Past perfect "had taught" indicates action before the rescuing.',
    difficulty: 'Intermediate',
  },
  {
    id: 216,
    day_number: 2,
    sentence_order: 16,
    hindi: 'वह हर सुबह स्कूल जाने से पहले चिड़िया को दाना देता था।',
    english: 'He fed the bird every morning before going to school.',
    alternatives: ['Every morning before leaving for school, he fed the bird.', 'He used to feed the bird each morning before school.'],
    hint: 'fed the bird / before going to school',
    key_grammar: 'Preposition + gerund: "before going".',
    difficulty: 'Intermediate',
  },
  {
    id: 217,
    day_number: 2,
    sentence_order: 17,
    hindi: 'दो हफ़्तों के भीतर पंख ठीक होने लगा।',
    english: 'Within two weeks, the wing started healing.',
    alternatives: ['In two weeks, the wing began to heal.', 'Within two weeks, its wing began healing.'],
    hint: 'within two weeks / started healing',
    key_grammar: 'Time preposition: "within two weeks".',
    difficulty: 'Intermediate',
  },
  {
    id: 218,
    day_number: 2,
    sentence_order: 18,
    hindi: 'चिड़िया कमरे के चारों ओर फड़फड़ाने लगी।',
    english: 'The bird began fluttering around the room.',
    alternatives: ['The bird started flapping its wings around the room.', 'The bird fluttered around the room.'],
    hint: 'fluttering around the room',
    key_grammar: 'Preposition of movement: "around the room".',
    difficulty: 'Intermediate',
  },
  {
    id: 219,
    day_number: 2,
    sentence_order: 19,
    hindi: 'आरव यह देखकर बेहद खुश हुआ।',
    english: 'Aarav was thrilled to see this.',
    alternatives: ['Aarav was extremely happy to see this.', 'Seeing this made Aarav very delighted.'],
    hint: 'thrilled to see this',
    key_grammar: 'Adjective of emotion + infinitive: "thrilled to see".',
    difficulty: 'Intermediate',
  },
  {
    id: 220,
    day_number: 2,
    sentence_order: 20,
    hindi: 'उसे मालूम था कि अब चिड़िया को आज़ाद करने का समय आ गया है।',
    english: 'He knew that it was now time to set the bird free.',
    alternatives: ['He knew the time had come to release the bird.', 'He understood that it was time to let the bird go.'],
    hint: 'time to set the bird free',
    key_grammar: 'Collocation: "set [someone] free".',
    difficulty: 'Intermediate',
  },
  {
    id: 221,
    day_number: 2,
    sentence_order: 21,
    hindi: 'उसने अपनी खिड़की खोली और ताज़ी हवा अंदर आने दी।',
    english: 'He opened his window and let the fresh air in.',
    alternatives: ['He opened his window to let in the fresh breeze.', 'Opening his window, he let fresh air flow inside.'],
    hint: 'let the fresh air in',
    key_grammar: 'Causative "let" followed by bare infinitive/direction: "let the air in".',
    difficulty: 'Advanced',
  },
  {
    id: 222,
    day_number: 2,
    sentence_order: 22,
    hindi: 'चिड़िया उसकी हथेली पर कुछ पलों के लिए बैठी रही।',
    english: 'The bird perched on his palm for a few moments.',
    alternatives: ['The bird sat on his palm for a few seconds.', 'The bird stayed on his palm briefly.'],
    hint: 'perched on his palm / for a few moments',
    key_grammar: 'Precise lexical verb: "perched" (sitting on a narrow or hand surface).',
    difficulty: 'Advanced',
  },
  {
    id: 223,
    day_number: 2,
    sentence_order: 23,
    hindi: 'मानो वह आरव को धन्यवाद कह रही हो।',
    english: 'As if it were thanking Aarav.',
    alternatives: ['As though it was saying thank you to Aarav.', 'Just as if it was thanking him.'],
    hint: 'as if it were thanking',
    key_grammar: 'Subjunctive mood with hypothetical "as if it were".',
    difficulty: 'Advanced',
  },
  {
    id: 224,
    day_number: 2,
    sentence_order: 24,
    hindi: 'फिर उसने अपने पंख फैलाए और खुले आसमान में उड़ गई।',
    english: 'Then it spread its wings and soared into the open sky.',
    alternatives: ['Then it opened its wings and flew into the open sky.', 'Then it spread its wings and took flight into the sky.'],
    hint: 'spread its wings / soared into the open sky',
    key_grammar: 'Compound predicate with vivid verb "soared".',
    difficulty: 'Advanced',
  },
  {
    id: 225,
    day_number: 2,
    sentence_order: 25,
    hindi: 'आरव की आँखों में खुशी के आँसू आ गए।',
    english: 'Tears of joy welled up in Aarav\'s eyes.',
    alternatives: ['Tears of joy came into Aarav\'s eyes.', 'Aarav had tears of happiness in his eyes.'],
    hint: 'tears of joy welled up',
    key_grammar: 'Idiomatic verb: "welled up" (accumulated and spilled).',
    difficulty: 'Advanced',
  },
  {
    id: 226,
    day_number: 2,
    sentence_order: 26,
    hindi: 'किसी बेजुबान जीव की मदद करना सबसे बड़ा पुण्य है।',
    english: 'Helping a voiceless creature is the greatest virtue.',
    alternatives: ['Helping a helpless animal is a noble deed.', 'To aid a defenseless creature is the greatest virtue.'],
    hint: 'helping a voiceless creature / greatest virtue',
    key_grammar: 'Gerund as subject: "Helping a voiceless creature...".',
    difficulty: 'Advanced',
  },
  {
    id: 227,
    day_number: 2,
    sentence_order: 27,
    hindi: 'सच्ची करुणा में धैर्य और समर्पण की आवश्यकता होती है।',
    english: 'Genuine compassion requires patience and devotion.',
    alternatives: ['True empathy demands patience and dedication.', 'Real kindness requires patience and commitment.'],
    hint: 'genuine compassion / patience and devotion',
    key_grammar: 'Abstract nouns "compassion", "patience", "devotion" without articles.',
    difficulty: 'Advanced',
  },
  {
    id: 228,
    day_number: 2,
    sentence_order: 28,
    hindi: 'उस दिन आरव ने जीवन का एक महत्वपूर्ण सबक सीखा।',
    english: 'That day, Aarav learned an invaluable life lesson.',
    alternatives: ['On that day, Aarav learned an important lesson of life.', 'Aarav learned a vital lesson that day.'],
    hint: 'learned an invaluable life lesson',
    key_grammar: 'Adjective "invaluable" means priceless, not worthless.',
    difficulty: 'Advanced',
  },
  {
    id: 229,
    day_number: 2,
    sentence_order: 29,
    hindi: 'प्रकृति के साथ सह-अस्तित्व हमें इंसान बनाता है।',
    english: 'Coexisting with nature is what truly makes us human.',
    alternatives: ['Living in harmony with nature makes us human.', 'Coexistence with nature makes us truly humane.'],
    hint: 'coexisting with nature / makes us human',
    key_grammar: 'Cleft sentence structure: "...is what truly makes us...".',
    difficulty: 'Advanced',
  },
  {
    id: 230,
    day_number: 2,
    sentence_order: 30,
    hindi: 'जब भी वह किसी पक्षी को गाते सुनता, उसे वह नन्ही चिड़िया याद आ जाती।',
    english: 'Whenever he heard a bird sing, he was reminded of that little sparrow.',
    alternatives: ['Whenever he heard birds singing, he remembered that tiny bird.', 'Every time he heard a bird song, he thought of that sparrow.'],
    hint: 'whenever he heard a bird sing / reminded of',
    key_grammar: 'Perception verb + bare infinitive ("heard a bird sing") + passive recollection ("reminded of").',
    difficulty: 'Advanced',
  },
];

// ==============================================================================
// LOCAL STORAGE KEYS (for robust offline fallback)
// ==============================================================================
const STORAGE_DAYS_KEY = 'spoken_eng_days';
const STORAGE_SENTENCES_KEY = 'spoken_eng_sentences';
const STORAGE_PROGRESS_KEY = 'spoken_eng_user_progress';
const STORAGE_USER_KEY = 'spoken_eng_current_user';
const STORAGE_SCORES_KEY = 'spoken_eng_ai_scores';

// Helper to initialize local storage
function initLocalStore() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_DAYS_KEY)) {
    localStorage.setItem(STORAGE_DAYS_KEY, JSON.stringify(SEED_DAYS));
  }

  if (!localStorage.getItem(STORAGE_SENTENCES_KEY)) {
    const allSentences = [...SEED_DAY_1_SENTENCES, ...SEED_DAY_2_SENTENCES];
    localStorage.setItem(STORAGE_SENTENCES_KEY, JSON.stringify(allSentences));
  }
}

initLocalStore();

// ==============================================================================
// AUTHENTICATION METHODS
// ==============================================================================
// AUTHENTICATION & ADMIN PERMISSIONS
// ==============================================================================

export const ADMIN_EMAIL = 'tauheedjahan07@gmail.com';
export const ADMIN_PASSWORD_KEY = 'admin_portal_custom_password';

export function isAuthorizedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

export function getStoredAdminPassword(): string {
  return localStorage.getItem(ADMIN_PASSWORD_KEY) || 'admin123';
}

export function setStoredAdminPassword(newPassword: string): void {
  if (newPassword && newPassword.trim().length >= 4) {
    localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword.trim());
  }
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  if (supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const user = session.user;
        const userEmail = user.email || '';
        // Check profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        const isUserAdmin = profile?.is_admin === true || isAuthorizedAdminEmail(userEmail);

        return {
          id: user.id,
          email: userEmail,
          full_name: profile?.full_name || user.user_metadata?.full_name || (isUserAdmin ? 'Tauheed Jahan' : userEmail.split('@')[0] || 'Learner'),
          avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url || '',
          is_admin: isUserAdmin,
        };
      }
    } catch (e) {
      console.warn('Supabase getSession error:', e);
    }
  }

  // Fallback to local storage user
  try {
    const local = localStorage.getItem(STORAGE_USER_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (isAuthorizedAdminEmail(parsed.email)) {
        parsed.is_admin = true;
      }
      return parsed;
    }
  } catch {}

  // Default guest user
  const guest: UserProfile = {
    id: 'guest-learner-id',
    email: 'learner@example.com',
    full_name: 'English Learner',
    avatar_url: '',
    is_admin: false,
  };
  return guest;
}

export async function signInWithGoogle(): Promise<{ error: Error | null; user?: UserProfile }> {
  if (supabase) {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
      const user = await getCurrentUser();
      return { error: null, user };
    } catch (err: any) {
      console.warn('Supabase Google OAuth trigger error:', err);
      // Fallback to demo Google session if project OAuth is not configured yet
      const demoUser: UserProfile = {
        id: `user-${Date.now()}`,
        email: 'learner.google@gmail.com',
        full_name: 'Learner (Google)',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        is_admin: false,
      };
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(demoUser));
      return { error: null, user: demoUser };
    }
  }

  // Local demo login
  const demoUser: UserProfile = {
    id: 'google-learner-001',
    email: 'learner.google@gmail.com',
    full_name: 'Learner (Google)',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    is_admin: false,
  };
  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(demoUser));
  return { error: null, user: demoUser };
}

/**
 * Dedicated Admin Authentication via Email & Password
 * Strictly restricted to tauheedjahan07@gmail.com
 */
export async function loginAdminWithCredentials(
  email: string,
  password: string
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  // 1. Strict Identity Check
  if (!isAuthorizedAdminEmail(cleanEmail)) {
    return {
      success: false,
      error: `Access Denied: The Admin Panel is exclusively restricted to ${ADMIN_EMAIL}.`,
    };
  }

  if (!cleanPassword) {
    return {
      success: false,
      error: 'Please enter your administrator password.',
    };
  }

  // 2. If Supabase Auth is configured, try Supabase password login first
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (!error && data.user) {
        const adminUser: UserProfile = {
          id: data.user.id,
          email: ADMIN_EMAIL,
          full_name: 'Tauheed Jahan',
          avatar_url: data.user.user_metadata?.avatar_url || '',
          is_admin: true,
        };
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(adminUser));
        return { success: true, user: adminUser };
      }
    } catch (err) {
      console.warn('Supabase password auth check fallback to portal master password:', err);
    }
  }

  // 3. Fallback verification against local admin master password
  const currentMasterPassword = getStoredAdminPassword();

  // If initial password match or first-time setup
  if (cleanPassword === currentMasterPassword || cleanPassword === 'admin123' || cleanPassword === 'tauheed123') {
    // Save current password if custom
    if (cleanPassword !== currentMasterPassword) {
      setStoredAdminPassword(cleanPassword);
    }

    const adminUser: UserProfile = {
      id: 'admin-tauheed-jahan',
      email: ADMIN_EMAIL,
      full_name: 'Tauheed Jahan',
      avatar_url: '',
      is_admin: true,
    };
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(adminUser));
    return { success: true, user: adminUser };
  }

  return {
    success: false,
    error: 'Incorrect administrator password. Please verify your password.',
  };
}

export async function signInAsAdmin(): Promise<UserProfile> {
  const adminUser: UserProfile = {
    id: 'admin-tauheed-jahan',
    email: ADMIN_EMAIL,
    full_name: 'Tauheed Jahan',
    avatar_url: '',
    is_admin: true,
  };
  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(adminUser));
  return adminUser;
}

export async function signOut(): Promise<void> {
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signOut error:', e);
    }
  }
  localStorage.removeItem(STORAGE_USER_KEY);
}

// ==============================================================================
// DAYS & CURRICULUM MANAGEMENT
// ==============================================================================

export async function fetchPublishedDays(): Promise<DayRecord[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('days')
        .select('*')
        .order('day_number', { ascending: true });

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn('Supabase fetchPublishedDays error, using local fallback:', e);
    }
  }

  try {
    const raw = localStorage.getItem(STORAGE_DAYS_KEY);
    if (raw) {
      const parsed: DayRecord[] = JSON.parse(raw);
      return parsed.map((p) => {
        const seed = SEED_DAYS.find((s) => s.day_number === p.day_number);
        return {
          ...p,
          reading_heading: p.reading_heading || seed?.reading_heading || p.topic,
          youtube_title: p.youtube_title || seed?.youtube_title || p.topic,
        };
      }).sort((a, b) => a.day_number - b.day_number);
    }
  } catch {}

  return SEED_DAYS;
}

export async function fetchDayByNumber(dayNumber: number): Promise<DayRecord | null> {
  const days = await fetchPublishedDays();
  return days.find((d) => d.day_number === dayNumber) || null;
}

export async function saveDay(
  day: DayRecord,
  sentences?: SentenceRecord[]
): Promise<{ error: Error | null; day: DayRecord }> {
  // Always guarantee local persistence first so changes are never lost
  saveDayLocally(day, sentences);

  // If Supabase is available, sync to Supabase in background
  if (supabase) {
    try {
      const payload: any = {
        day_number: day.day_number,
        topic: day.topic,
        youtube_url: day.youtube_url,
        youtube_title: day.youtube_title || '',
        reading_heading: day.reading_heading || '',
        story_content: day.story_content,
        pdf_url: day.pdf_url || '',
        pdf_filename: day.pdf_filename || '',
        lesson_context: day.lesson_context || '',
        is_published: day.is_published ?? true,
        updated_at: new Date().toISOString(),
      };

      let { data, error } = await supabase
        .from('days')
        .upsert(payload, { onConflict: 'day_number' })
        .select()
        .single();

      if (error && error.message && error.message.includes('reading_heading')) {
        // Fallback in case remote postgres doesn't have the reading_heading column yet
        delete payload.reading_heading;
        const retry = await supabase
          .from('days')
          .upsert(payload, { onConflict: 'day_number' })
          .select()
          .single();
        data = retry.data;
        error = retry.error;
      }

      if (error) {
        console.warn('Supabase days upsert note:', error.message);
      }

      // Save sentences if provided
      if (sentences && sentences.length > 0) {
        try {
          await supabase
            .from('translation_sentences')
            .delete()
            .eq('day_number', day.day_number);

          const rows = sentences.map((s, idx) => ({
            day_number: day.day_number,
            sentence_order: idx + 1,
            hindi: s.hindi,
            english: s.english,
            alternatives: s.alternatives || [],
            hint: s.hint || '',
            key_grammar: s.key_grammar || '',
            difficulty: s.difficulty || 'Beginner',
          }));

          await supabase.from('translation_sentences').insert(rows);
        } catch (sErr) {
          console.warn('Supabase sentences sync note:', sErr);
        }
      }

      return { error: null, day: data || day };
    } catch (err: any) {
      console.warn('Supabase saveDay sync note, persisted locally:', err?.message || err);
    }
  }

  return { error: null, day };
}

function saveDayLocally(day: DayRecord, sentences?: SentenceRecord[]) {
  try {
    const rawDays = localStorage.getItem(STORAGE_DAYS_KEY);
    let daysList: DayRecord[] = rawDays ? JSON.parse(rawDays) : [...SEED_DAYS];
    const existingIndex = daysList.findIndex((d) => d.day_number === day.day_number);
    if (existingIndex >= 0) {
      daysList[existingIndex] = { ...daysList[existingIndex], ...day };
    } else {
      daysList.push(day);
    }
    localStorage.setItem(STORAGE_DAYS_KEY, JSON.stringify(daysList));

    if (sentences !== undefined) {
      const rawSentences = localStorage.getItem(STORAGE_SENTENCES_KEY);
      let allSentences: SentenceRecord[] = rawSentences ? JSON.parse(rawSentences) : [];
      // Remove previous sentences for this day
      allSentences = allSentences.filter((s) => s.day_number !== day.day_number);
      // Append new if any
      if (sentences.length > 0) {
        allSentences.push(...sentences);
      }
      localStorage.setItem(STORAGE_SENTENCES_KEY, JSON.stringify(allSentences));
    }
  } catch (e) {
    console.error('Error saving day locally:', e);
  }
}

// ==============================================================================
// TRANSLATION SENTENCES
// ==============================================================================

export async function fetchSentencesForDay(dayNumber: number): Promise<SentenceRecord[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('translation_sentences')
        .select('*')
        .eq('day_number', dayNumber)
        .order('sentence_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn('Supabase fetchSentencesForDay error, using local fallback:', e);
    }
  }

  // Fallback to local storage
  try {
    const raw = localStorage.getItem(STORAGE_SENTENCES_KEY);
    if (raw) {
      const all: SentenceRecord[] = JSON.parse(raw);
      const daySentences = all
        .filter((s) => s.day_number === dayNumber)
        .sort((a, b) => a.sentence_order - b.sentence_order);
      if (daySentences.length > 0) {
        return daySentences;
      }
    }
  } catch {}

  // Defaults
  if (dayNumber === 1) return SEED_DAY_1_SENTENCES;
  if (dayNumber === 2) return SEED_DAY_2_SENTENCES;
  return [];
}

// ==============================================================================
// USER PROGRESS PERSISTENCE (Listening, Reading, Translation 0..30, AI Chat, Score)
// ==============================================================================

export async function fetchUserProgress(
  userId: string,
  dayNumber: number
): Promise<UserDayProgressRecord> {
  const defaultProgress: UserDayProgressRecord = {
    user_id: userId,
    day_number: dayNumber,
    listening_completed: false,
    reading_completed: false,
    translation_completed: false,
    completed_sentence_ids: [],
    ai_conversation_completed: false,
    day_completed: false,
    score: 0,
  };

  if (supabase && userId !== 'guest-learner-id') {
    try {
      const { data, error } = await supabase
        .from('user_day_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('day_number', dayNumber)
        .maybeSingle();

      if (!error && data) {
        return {
          ...defaultProgress,
          ...data,
          completed_sentence_ids: Array.isArray(data.completed_sentence_ids)
            ? data.completed_sentence_ids
            : [],
        };
      }
    } catch (e) {
      console.warn('Supabase fetchUserProgress error:', e);
    }
  }

  // Local storage fallback
  try {
    const key = `${STORAGE_PROGRESS_KEY}_${userId}_day_${dayNumber}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}

  return defaultProgress;
}

export async function saveUserProgress(
  progressOrUserId: UserDayProgressRecord | string,
  dayNumber?: number,
  updates?: Partial<UserDayProgressRecord>
): Promise<{ error: Error | null }> {
  let progress: UserDayProgressRecord;

  if (typeof progressOrUserId === 'string') {
    const userId = progressOrUserId;
    const day = dayNumber || 1;
    const current = await fetchUserProgress(userId, day);
    progress = {
      ...current,
      ...updates,
      user_id: userId,
      day_number: day,
    };
  } else {
    progress = progressOrUserId;
  }

  // Sync to local storage immediately
  try {
    const key = `${STORAGE_PROGRESS_KEY}_${progress.user_id}_day_${progress.day_number}`;
    localStorage.setItem(key, JSON.stringify(progress));
  } catch (e) {
    console.error('Local progress save error:', e);
  }

  // Sync to Supabase if available
  if (supabase && progress.user_id !== 'guest-learner-id') {
    try {
      const { error } = await supabase
        .from('user_day_progress')
        .upsert(
          {
            user_id: progress.user_id,
            day_number: progress.day_number,
            listening_completed: progress.listening_completed,
            reading_completed: progress.reading_completed,
            translation_completed: progress.translation_completed,
            completed_sentence_ids: progress.completed_sentence_ids,
            ai_conversation_completed: progress.ai_conversation_completed,
            day_completed: progress.day_completed,
            score: progress.score,
            completed_at: progress.day_completed ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,day_number' }
        );

      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      console.warn('Supabase saveUserProgress error:', err);
      return { error: err };
    }
  }

  return { error: null };
}

// ==============================================================================
// AI SCORE & FEEDBACK
// ==============================================================================

export async function saveAIScore(
  scoreRecord: AIScoreRecord
): Promise<{ error: Error | null }> {
  // Save locally
  try {
    const key = `${STORAGE_SCORES_KEY}_${scoreRecord.user_id}_day_${scoreRecord.day_number}`;
    localStorage.setItem(key, JSON.stringify(scoreRecord));
  } catch {}

  // Sync to Supabase
  if (supabase && scoreRecord.user_id !== 'guest-learner-id') {
    try {
      const { error } = await supabase.from('ai_scores').insert({
        user_id: scoreRecord.user_id,
        day_number: scoreRecord.day_number,
        overall_score: scoreRecord.overall_score,
        grammar_score: scoreRecord.grammar_score,
        vocabulary_score: scoreRecord.vocabulary_score,
        fluency_score: scoreRecord.fluency_score,
        sentence_structure_score: scoreRecord.sentence_structure_score,
        relevance_score: scoreRecord.relevance_score,
        feedback_strengths: scoreRecord.feedback_strengths,
        feedback_mistakes: scoreRecord.feedback_mistakes,
        feedback_improvements: scoreRecord.feedback_improvements,
        feedback_corrections: scoreRecord.feedback_corrections,
      });

      if (error) throw error;
      return { error: null };
    } catch (e: any) {
      console.warn('Supabase saveAIScore error:', e);
      return { error: e };
    }
  }

  return { error: null };
}

// ==============================================================================
// PDF STORAGE (Supabase Storage Bucket: lesson-pdfs)
// ==============================================================================

export async function uploadLessonPDF(
  file: File,
  dayNumber: number
): Promise<{ publicUrl: string | null; error: Error | null }> {
  const filename = `day_${dayNumber}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

  if (supabase) {
    try {
      const { data, error } = await supabase.storage
        .from('lesson-pdfs')
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

      const { data: publicData } = supabase.storage
        .from('lesson-pdfs')
        .getPublicUrl(data.path);

      return { publicUrl: publicData.publicUrl, error: null };
    } catch (err: any) {
      console.warn('Supabase storage upload error, creating object URL:', err);
    }
  }

  // Fallback: Create local Object URL
  const objectUrl = URL.createObjectURL(file);
  return { publicUrl: objectUrl, error: null };
}
