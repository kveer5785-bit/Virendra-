import {
  UserProfile,
  DailyActivity,
  FoodItem,
  WearableDevice,
  Specialist,
  HealthAppointment,
  DayHistoryRecord,
  FitnessArticle,
  ExerciseRoutine,
  LoggedWorkout,
} from '../types/health';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Alex Rivera',
  age: 31,
  weightKg: 72,
  heightCm: 178,
  dailyStepGoal: 10000,
  dailyCalorieBudget: 2200,
  dailyWaterGoalMl: 2500,
  activeWearableId: 'apple_watch_ultra_2',
  adsenseConfig: {
    publisherId: 'ca-pub-3718193681856121',
    leaderboardSlotId: '1234567890',
    articleSlotId: '2345678901',
    sidebarSlotId: '3456789012',
    enableAutoAds: true,
    testMode: false,
    adUnitsEnabled: true,
  },
};

// Returns current local date as YYYY-MM-DD
export function getLocalTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const INITIAL_ACTIVITY: DailyActivity = {
  date: getLocalTodayDateString(),
  steps: 8420,
  stepGoal: 10000,
  distanceKm: 6.4,
  activeMinutes: 52,
  activeCaloriesBurned: 354,
  cadenceSpm: 118,
  isLiveTracking: false,
  hourlySteps: [
    { hour: 7, steps: 420 },
    { hour: 8, steps: 1250 },
    { hour: 9, steps: 890 },
    { hour: 10, steps: 610 },
    { hour: 11, steps: 780 },
    { hour: 12, steps: 1420 },
    { hour: 13, steps: 950 },
    { hour: 14, steps: 520 },
    { hour: 15, steps: 1180 },
    { hour: 16, steps: 400 },
  ],
};

// Generates 6 previous days of history for immediate weekly progress visualization
export function generateInitialWeeklyHistory(): DayHistoryRecord[] {
  const days: DayHistoryRecord[] = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  // Past 6 days
  for (let i = 6; i >= 1; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayLabel = dayNames[d.getDay()];

    const sampleSteps = [10450, 8920, 11200, 7840, 10150, 9600][6 - i] || 9000;
    const goal = 10000;
    const distanceKm = Number(((sampleSteps * 0.76) / 1000).toFixed(2));
    const activeCalories = Math.round(sampleSteps * 0.042);
    const caloriesConsumed = [2150, 2280, 2090, 2350, 2180, 2220][6 - i] || 2200;
    const waterIntakeMl = [2600, 2400, 2750, 2100, 2500, 2450][6 - i] || 2500;
    const vitalityScore = Math.min(Math.round((sampleSteps / goal) * 50 + 40), 96);

    days.push({
      date: dateStr,
      dayLabel,
      steps: sampleSteps,
      stepGoal: goal,
      distanceKm,
      activeCalories,
      caloriesConsumed,
      waterIntakeMl,
      vitalityScore,
      completed: sampleSteps >= goal,
    });
  }

  return days;
}

export const INITIAL_MEALS: FoodItem[] = [
  {
    id: 'meal_1',
    mealType: 'breakfast',
    name: 'Greek Yogurt Bowl with Berries, Chia & Almonds',
    calories: 380,
    proteinG: 28,
    carbsG: 34,
    fatG: 14,
    timeLogged: '08:15 AM',
  },
  {
    id: 'meal_2',
    mealType: 'lunch',
    name: 'Grilled Salmon Quinoa Bowl with Steamed Broccoli',
    calories: 620,
    proteinG: 44,
    carbsG: 52,
    fatG: 22,
    timeLogged: '01:10 PM',
  },
  {
    id: 'meal_3',
    mealType: 'snack',
    name: 'Whey Isolate Shake with 1 Medium Banana',
    calories: 240,
    proteinG: 27,
    carbsG: 29,
    fatG: 2,
    timeLogged: '04:30 PM',
  },
];

export const INITIAL_WEARABLES: WearableDevice[] = [
  {
    id: 'apple_watch_ultra_2',
    name: 'Apple Watch Ultra 2',
    model: 'Titanium 49mm (A2986)',
    type: 'apple_watch',
    platform: 'ios',
    batteryLevel: 86,
    lastSync: '2 mins ago',
    status: 'connected',
    syncedMetrics: ['Steps', 'Active Energy', 'Resting HR', 'HRV', 'Sleep Stages', 'VO2 Max (Est.)'],
    firmwareVersion: 'watchOS 11.2',
  },
  {
    id: 'pixel_watch_3',
    name: 'Google Pixel Watch 3',
    model: 'Obsidian 45mm WiFi/LTE',
    type: 'pixel_watch',
    platform: 'android',
    batteryLevel: 91,
    lastSync: '18 mins ago',
    status: 'connected',
    syncedMetrics: ['Steps', 'Health Connect', 'Cardio Load', 'Skin Temp', 'SpO2'],
    firmwareVersion: 'Wear OS 5.1',
  },
  {
    id: 'garmin_forerunner_965',
    name: 'Garmin Forerunner 965',
    model: 'Titanium Bezel AMOLED',
    type: 'garmin',
    platform: 'cross_platform',
    batteryLevel: 74,
    lastSync: '1 hour ago',
    status: 'connected',
    syncedMetrics: ['Cadence SPM', 'Training Readiness', 'Body Battery', 'Stress Level'],
    firmwareVersion: 'v19.18',
  },
  {
    id: 'whoop_4',
    name: 'WHOOP 4.0 Strap',
    model: 'Onyx Pro Band',
    type: 'whoop',
    platform: 'cross_platform',
    batteryLevel: 62,
    lastSync: '35 mins ago',
    status: 'connected',
    syncedMetrics: ['Recovery Index', 'Day Strain', 'Respiratory Rate', 'HRV (ms)'],
    firmwareVersion: '4.12.0',
  },
];

export const INITIAL_SPECIALISTS: Specialist[] = [
  {
    id: 'spec_1',
    name: 'Dr. Elena Rostova, PhD, CSCS',
    title: 'Exercise Physiologist & Human Performance Specialist',
    specialty: 'Cardiovascular Conditioning & Step Cadence',
    credentials: 'PhD Exercise Science · Certified Strength & Conditioning Specialist',
    rating: 4.98,
    reviewsCount: 142,
    availableDays: ['Today', 'Tomorrow', 'Thursday', 'Friday'],
    slots: ['09:30 AM', '11:00 AM', '02:00 PM', '04:30 PM'],
    consultationFee: '$75 / 30m',
    avatarColor: 'from-emerald-500 to-teal-700',
    bio: 'Specializes in analyzing wearable movement patterns, aerobic threshold pacing, and daily step distribution to maximize stamina and joint resilience.',
  },
  {
    id: 'spec_2',
    name: 'Marcus Vance, MS, CSCS',
    title: 'Sports Performance & Movement Coach',
    specialty: 'Gait Efficiency & Progressive Overload',
    credentials: 'MS Biomechanics · Olympic Training Consultant',
    rating: 4.95,
    reviewsCount: 118,
    availableDays: ['Today', 'Tomorrow', 'Wednesday', 'Saturday'],
    slots: ['10:00 AM', '01:30 PM', '03:15 PM', '05:00 PM'],
    consultationFee: '$70 / 30m',
    avatarColor: 'from-blue-500 to-indigo-700',
    bio: 'Guides runners and walkers on optimizing stride cadence, active energy pacing, and injury-prevention protocols for high-volume walking routines.',
  },
  {
    id: 'spec_3',
    name: 'Sophia Lin, MS, RD, CSSD',
    title: 'Board Certified Sports Dietitian',
    specialty: 'Metabolic Energy Balance & Macro Pacing',
    credentials: 'MS Clinical Nutrition · Certified Specialist in Sports Dietetics (CSSD)',
    rating: 4.97,
    reviewsCount: 184,
    availableDays: ['Tomorrow', 'Thursday', 'Friday'],
    slots: ['11:30 AM', '01:00 PM', '03:45 PM'],
    consultationFee: '$75 / 30m',
    avatarColor: 'from-rose-500 to-orange-600',
    bio: 'Creates sustainable caloric budgeting frameworks aligned with your wearable energy expenditure, preserving lean mass and metabolic health.',
  },
  {
    id: 'spec_4',
    name: 'Julian Thorne, MEd, CSCS',
    title: 'Circadian Rhythm & Sleep Optimization Coach',
    specialty: 'Autonomic Recovery & Sleep Architecture',
    credentials: 'Certified Sleep Coach · Applied Human Performance Fellow',
    rating: 4.92,
    reviewsCount: 96,
    availableDays: ['Today', 'Thursday', 'Saturday'],
    slots: ['10:30 AM', '02:30 PM', '04:00 PM'],
    consultationFee: '$65 / 30m',
    avatarColor: 'from-purple-500 to-violet-800',
    bio: 'Helps fitness enthusiasts decode wearable HRV readings, sleep cycles, and daily light exposure to accelerate neuromuscular recovery.',
  },
];

export const INITIAL_APPOINTMENTS: HealthAppointment[] = [
  {
    id: 'apt_101',
    specialistId: 'spec_1',
    specialistName: 'Dr. Elena Rostova, PhD, CSCS',
    specialistTitle: 'Exercise Physiologist & Human Performance Specialist',
    consultationType: 'video',
    focusArea: 'Step & Cardio Optimization',
    date: '2026-10-22',
    timeSlot: '11:00 AM',
    status: 'confirmed',
    patientNotes: 'Review step cadence consistency and discuss Zone 2 aerobic walking pacing.',
    includeHealthVitals: true,
    meetingLink: 'https://pulsefit.health/coaching/room-84820-elena',
    createdAt: '2026-10-19T14:22:00Z',
  },
  {
    id: 'apt_102',
    specialistId: 'spec_3',
    specialistName: 'Sophia Lin, MS, RD, CSSD',
    specialistTitle: 'Board Certified Sports Dietitian',
    consultationType: 'wearable_review',
    focusArea: 'Calorie Deficit & Macros',
    date: '2026-10-14',
    timeSlot: '01:00 PM',
    status: 'completed',
    patientNotes: 'Adjusted protein intake to 1.8g/kg based on daily active calorie burn of 450+ kcal.',
    includeHealthVitals: true,
    createdAt: '2026-10-12T09:15:00Z',
  },
];

export const FITNESS_ARTICLES: FitnessArticle[] = [
  {
    id: 'art_1',
    title: 'The Science of Daily Steps: Evidence, Non-Exercise Activity (NEAT), and Health',
    slug: 'science-of-daily-steps-neat',
    category: 'Movement',
    readTime: '5 min read',
    publishedDate: 'October 2026',
    author: 'PulseFit Sports Science Editorial',
    summary: 'Why the 10,000-step target originated as a marketing campaign, what contemporary epidemiological research actually says about daily volume, and how non-exercise activity thermogenesis (NEAT) drives metabolic health.',
    content: [
      'The ubiquitous 10,000-step benchmark dates back to 1965 in Japan, when the Yamasa Clock Company released a pedometer named Manpo-kei, which translates literally to "10,000-steps meter." While conceived as a marketing slogan, modern clinical exercise physiology has extensively examined whether this number holds genuine biological significance.',
      'Recent systematic reviews published in The Lancet and JAMA analyzing over 50,000 adults demonstrate that all-cause mortality benefits begin plateauing between 7,500 and 8,500 steps per day for adults aged 60 and older, and between 8,000 and 10,000 steps per day for younger adults. Beyond this threshold, incremental longevity benefits continue at a diminishing rate, while cardiovascular conditioning and orthopedic load increase.',
      'Critically, step accumulation represents the foundation of Non-Exercise Activity Thermogenesis (NEAT). Unlike formal gym sessions, which typically comprise 3–5 hours per week, NEAT accounts for up to 15%–30% of total daily energy expenditure. Regular walking promotes lipoprotein lipase activity in skeletal muscle, aiding glucose clearance and insulin sensitivity without creating significant central nervous system fatigue.',
      'Pacing matters as well: Accumulating steps in brisk intervals (100–125 steps per minute) elicits Zone 1 and low Zone 2 aerobic adaptation, stimulating mitochondrial biogenesis and capillary density in slow-twitch muscle fibers.'
    ],
    actionableTakeaways: [
      'Aim for a baseline floor of 7,500 steps daily before pursuing aggressive cardio routines.',
      'Break prolonged sedentary periods with a 5-minute brisk walk (approx. 500 steps) every 90 minutes.',
      'Target a cadence of 105–120 steps per minute during dedicated walking intervals to trigger aerobic benefit.'
    ]
  },
  {
    id: 'art_2',
    title: 'Energy Balance & Caloric Pacing: Preserving Lean Muscle in a Deficit',
    slug: 'caloric-deficit-energy-balance-lean-mass',
    category: 'Nutrition',
    readTime: '6 min read',
    publishedDate: 'October 2026',
    author: 'PulseFit Sports Science Editorial',
    summary: 'How to calculate a moderate, sustainable energy deficit, avoid adaptive thermogenesis (metabolic slowdown), and preserve hard-earned skeletal muscle with strategic protein pacing.',
    content: [
      'Sustainable fat loss is governed by the first law of thermodynamics: energy consumed must remain lower than total daily energy expenditure (TDEE). However, human physiology is not a static bomb calorimeter; our bodies employ adaptive thermogenic compensations when energy availability plummets too rapidly.',
      'Severe caloric deficits (greater than 25% below maintenance) frequently trigger downregulations in resting metabolic rate (RMR), reductions in spontaneous movement (NEAT), elevated cortisol, and accelerated loss of lean skeletal muscle mass. In contrast, an intentional deficit of 300 to 500 kcal per day allows for predictable lipid oxidation while sparing functional contractile tissue.',
      'Protein intake is the primary nutritional lever for muscle preservation in an energy deficit. Peer-reviewed sports nutrition literature consistently demonstrates that individuals in a hypocaloric state require 1.6 to 2.2 grams of dietary protein per kilogram of body weight (0.73–1.0 g/lb). Distributing this protein evenly across 3 to 4 daily meals (~0.4 g/kg per feeding) ensures consistent stimulation of Muscle Protein Synthesis (MPS) via the leucine trigger mechanism.',
      'Pairing this caloric pacing with progressive resistance training signals to the neuroendocrine system that skeletal muscle is essential, preventing muscle catabolism.'
    ],
    actionableTakeaways: [
      'Maintain a moderate daily deficit of 300–500 kcal rather than crash dieting to prevent metabolic adaptation.',
      'Consume 1.6–2.2g of protein per kilogram of body weight, divided across 3–4 meals daily.',
      'Track wearable active energy expenditure as an approximation trend rather than an absolute truth.'
    ]
  },
  {
    id: 'art_3',
    title: 'Heart Rate Variability (HRV) Explained: Interpreting Autonomic Recovery',
    slug: 'understanding-heart-rate-variability-autonomic-recovery',
    category: 'Recovery',
    readTime: '4 min read',
    publishedDate: 'October 2026',
    author: 'PulseFit Sports Science Editorial',
    summary: 'What photoplethysmography (PPG) sensors in modern wearables actually measure when tracking rMSSD, and why higher HRV signals parasympathetic dominance.',
    content: [
      'Heart Rate Variability (HRV) measures the variation in time (measured in milliseconds) between consecutive heartbeats, known as the R-R interval. Contrary to popular intuition, a healthy resting heart does not beat like a rigid metronome; slight variations indicate a flexible, highly responsive autonomic nervous system (ANS).',
      'The ANS comprises two antagonistic branches: the sympathetic nervous system ("fight or flight") and the parasympathetic nervous system ("rest, digest, and repair"). When you are well-recovered, adequately hydrated, and physically unstressed, the parasympathetic vagus nerve exerts strong inhibitory control over the sinoatrial node, resulting in higher beat-to-beat variability.',
      'Most consumer wearables (Apple Watch, Garmin, Whoop, Oura) calculate HRV using the Root Mean Square of Successive Differences (rMSSD) during deep nocturnal sleep. A significant drop in your rolling 7-day HRV baseline often precedes conscious symptoms of overtraining, acute psychological stress, systemic inflammation, or impending illness by 24 to 48 hours.',
      'Crucially, HRV is highly individualized: comparing your absolute score (e.g., 55 ms) to someone else\'s (e.g., 85 ms) is biologically meaningless. The key signal is your deviation from your personal 30-day rolling baseline.'
    ],
    actionableTakeaways: [
      'Evaluate HRV trends against your personal 14-day rolling average, not external benchmarks.',
      'If your HRV drops more than 1.5 standard deviations below your baseline, schedule an active recovery day.',
      'Avoid heavy late-night meals and alcohol, both of which severely suppress parasympathetic nocturnal HRV.'
    ]
  },
  {
    id: 'art_4',
    title: 'Hydration Physiology: Fluid Dynamics, Sodium Pacing & Physical Output',
    slug: 'hydration-physiology-fluid-dynamics-sodium',
    category: 'Nutrition',
    readTime: '5 min read',
    publishedDate: 'October 2026',
    author: 'PulseFit Sports Science Editorial',
    summary: 'The difference between intracellular hydration and simple water ingestion, why electrolyte balance dictates muscular endurance, and how to pace fluid intake.',
    content: [
      'Dehydration of just 2% of total body mass has been shown in controlled clinical exercise trials to induce a 10% to 15% reduction in aerobic performance, elevate core temperature, and increase cardiovascular strain during routine walking and running workouts.',
      'However, optimal hydration involves more than drinking plain distilled water. When we sweat, we excrete not only water but critical mineral electrolytes—primarily sodium, followed by potassium, magnesium, and chloride. Consuming excessive plain water without adequate sodium during prolonged physical activity can dilute plasma osmolality, potentially leading to exercise-associated hyponatremia (EAH).',
      'Sodium is the primary cation in extracellular fluid; it maintains blood volume, drives cellular nutrient transport via sodium-glucose cotransporters, and enables nerve impulses that trigger muscular contractions.',
      'For active individuals logging 8,000+ steps per day, standard baseline hydration starts around 30–35 ml per kilogram of body weight, with an additional 400–600 ml per hour of vigorous physical activity in warm environments.'
    ],
    actionableTakeaways: [
      'Drink 30–35 ml of fluid per kg of body weight daily as a baseline starting point.',
      'Add a pinch of unrefined salt or balanced electrolytes to morning water to support cellular hydration.',
      'Monitor urine color: a pale straw hue indicates optimal hydration; dark amber indicates immediate fluid requirement.'
    ]
  },
  {
    id: 'art_5',
    title: 'How Wearable Sensors Work: Accelerometers, Photoplethysmography & Limits',
    slug: 'how-wearable-sensors-work-accelerometers-ppg',
    category: 'Wearables',
    readTime: '5 min read',
    publishedDate: 'October 2026',
    author: 'PulseFit Sports Science Editorial',
    summary: 'An engineering overview of triaxial MEMS accelerometers, optical green-light PPG heart rate monitors, and why consumer fitness wearables are estimation tools rather than medical instruments.',
    content: [
      'Modern consumer wearables rely on miniature Micro-Electro-Mechanical Systems (MEMS) triaxial accelerometers to detect motion. These silicone micro-cantilevers deflect under inertial force, converting physical acceleration along X, Y, and Z axes into electrical capacitance readings measured at 25 to 100 Hz.',
      'Pedometer algorithms parse this continuous signal using peak-detection thresholds and band-pass filtering to isolate rhythmic human gait frequencies (typically 1.4 to 3.2 Hz). Because the sensor sits on your wrist or in your pocket, non-walking arm gestures (e.g., typing, gesturing, brushing teeth) or road vibrations during driving can occasionally generate false-positive step artifacts.',
      'Heart rate detection utilizes Photoplethysmography (PPG). Green LEDs illuminate capillary beds beneath the dermis, and sensitive photodiode sensors measure the fraction of light reflected back. Because oxygenated hemoglobin absorbs green light, each ventricular ejection pulsates blood through the microvasculature, producing a rhythmic dip in reflected light that equates to heart rate.',
      'Understanding these physical limitations is essential: consumer wearables are exceptional tools for trend monitoring and behavior modification, but they are not certified diagnostic medical equipment. Skin pigmentation, wrist tightness, cadence lock, and ambient temperature can influence optical readings.'
    ],
    actionableTakeaways: [
      'Wear your fitness tracker snugly above the wrist bone for optimal optical sensor signal-to-noise ratio.',
      'Use wearable step counts and calorie burns as consistent relative benchmarks rather than absolute laboratory values.',
      'Clean optical sensor glass weekly to prevent sweat and skin oil buildup from degrading photodiode accuracy.'
    ]
  }
];

export const INITIAL_EXERCISE_ROUTINES: ExerciseRoutine[] = [
  {
    id: 'routine_post_meal',
    title: 'Post-Meal Glucose Blaster',
    subtitle: 'Blunts postprandial blood sugar spikes & speeds digestion',
    category: 'Metabolic',
    durationMins: 10,
    intensity: 'Low',
    targetHeartRateZone: 'Zone 1-2 (95 - 115 BPM)',
    caloriesBurnEstimate: 48,
    stepsEstimate: 1100,
    primaryBenefit: 'Insulin-independent GLUT4 glucose uptake',
    scientificRationale: 'Contracting large skeletal muscle groups (quadriceps, calves, glutes) pulls glucose directly from circulation without requiring elevated insulin, suppressing glycemic excursions by up to 52%.',
    intervals: [
      {
        name: 'Digestive Acclimation Walk',
        durationSecs: 180,
        instruction: 'Walk at a gentle, relaxed cadence. Focus on upright posture and gentle abdominal breathing.',
        formCue: 'Relax shoulders, maintain neutral spine, pace at ~90-95 steps/min.',
      },
      {
        name: 'Brisk Metabolic Acceleration',
        durationSecs: 240,
        instruction: 'Increase stride cadence to an aerobic pace. Swing arms naturally to recruit upper body musculature.',
        formCue: 'Keep head held high, drive lightly through the balls of feet at ~115 steps/min.',
      },
      {
        name: 'Standing Soleus Calf Pump Interval',
        durationSecs: 120,
        instruction: 'Transition to walking heel-to-toe with exaggerated calf push-offs to activate the deep soleus muscle.',
        formCue: 'Full ankle range of motion; feel gentle tension across the gastrocnemius & soleus.',
      },
      {
        name: 'Recovery Wind-Down',
        durationSecs: 60,
        instruction: 'Taper your cadence down. Take long, diaphragmatic inhales through the nose and slow exhales through the mouth.',
        formCue: 'Allow heart rate to normalize, ending in an energized state.',
      },
    ],
  },
  {
    id: 'routine_zone2_fatburn',
    title: 'Zone 2 Mitochondrial Aerobic Walk',
    subtitle: 'Maximizes cellular fat oxidation & aerobic endurance',
    category: 'Cardio',
    durationMins: 15,
    intensity: 'Moderate',
    targetHeartRateZone: 'Zone 2 (115 - 135 BPM)',
    caloriesBurnEstimate: 82,
    stepsEstimate: 1750,
    primaryBenefit: 'Peak lipid oxidation & mitochondrial density',
    scientificRationale: 'At Zone 2 intensity, blood lactate stays below 2.0 mmol/L, prompting type-1 slow-twitch muscle fibers to utilize long-chain fatty acids for up to 85% of total ATP generation.',
    intervals: [
      {
        name: 'Aerobic Warm-Up',
        durationSecs: 120,
        instruction: 'Start at a comfortable conversational pace. Check breathing rhythm (nasal breathing preferred).',
        formCue: 'Engage core gently, maintain light heel-to-midfoot strike.',
      },
      {
        name: 'Sustained FatMax Cadence',
        durationSecs: 660,
        instruction: 'Lock into a steady, rhythmic cadence of 118–124 SPM. You should be able to speak full sentences without gasping.',
        formCue: 'Smooth continuous rhythm; avoid bursts or sudden slowdowns.',
      },
      {
        name: 'Cadence Surge Finish',
        durationSecs: 60,
        instruction: 'Slightly elevate your pace for a 1-minute cardiovascular finish at ~130 SPM.',
        formCue: 'Drive knees forward, breathe deeply into the lower lungs.',
      },
      {
        name: 'Gradual Decompression',
        durationSecs: 60,
        instruction: 'Ease cadence back down to baseline recovery pace.',
        formCue: 'Shake out arms and hands, return to nasal breathing.',
      },
    ],
  },
  {
    id: 'routine_7min_scientific',
    title: '7-Minute Clinical Bodyweight Circuit',
    subtitle: 'ACSM evidence-based functional full-body conditioning',
    category: 'Strength',
    durationMins: 7,
    intensity: 'High',
    targetHeartRateZone: 'Zone 3-4 (130 - 160 BPM)',
    caloriesBurnEstimate: 65,
    stepsEstimate: 450,
    primaryBenefit: 'Whole-body muscular endurance & EPOC afterburn',
    scientificRationale: 'Developed by the American College of Sports Medicine, high-intensity circuit training (HICT) produces molecular adaptations comparable to traditional endurance training in a fraction of the time.',
    intervals: [
      {
        name: 'Jumping Jacks',
        durationSecs: 30,
        instruction: 'Rhythmic full-body jumps with synchronous arm clapping overhead.',
        formCue: 'Land softly on the balls of feet, keep knees slightly bent.',
      },
      {
        name: 'Transition / Rest',
        durationSecs: 10,
        instruction: 'Deep breaths; step over to a sturdy wall.',
        formCue: 'Slow your breathing rate down.',
      },
      {
        name: 'Wall Sit',
        durationSecs: 30,
        instruction: 'Slide down the wall until thighs are parallel to the floor (90° knee angle).',
        formCue: 'Press lower back flat against wall, hands on hips or chest (not thighs).',
      },
      {
        name: 'Transition / Rest',
        durationSecs: 10,
        instruction: 'Shake legs out and prepare for push-ups on floor or elevated counter.',
        formCue: 'Breathe through the nose.',
      },
      {
        name: 'Push-Ups (Floor or Incline)',
        durationSecs: 30,
        instruction: 'Controlled descents with elbows at 45 degrees, driving up strongly.',
        formCue: 'Solid plank line from ears to heels; do not let hips sag.',
      },
      {
        name: 'Transition / Rest',
        durationSecs: 10,
        instruction: 'Transition to supine position on mat for crunches.',
        formCue: 'Inhale deeply.',
      },
      {
        name: 'Abdominal Crunches',
        durationSecs: 30,
        instruction: 'Lift shoulder blades off the ground by compressing the ribcage toward pelvis.',
        formCue: 'Do not pull on the neck; focus on abdominal tension.',
      },
      {
        name: 'Transition / Rest',
        durationSecs: 10,
        instruction: 'Stand up by a secure bench or stair.',
        formCue: 'Prepare for step-ups.',
      },
      {
        name: 'Step-Ups onto Platform / Chair',
        durationSecs: 30,
        instruction: 'Step up onto elevated surface, alternating lead foot every repetition.',
        formCue: 'Drive through the heel of the leading foot to engage glutes.',
      },
      {
        name: 'Transition / Rest',
        durationSecs: 10,
        instruction: 'Set feet shoulder-width apart for bodyweight squats.',
        formCue: 'Arms straight out for counterbalance.',
      },
      {
        name: 'Bodyweight Air Squats',
        durationSecs: 30,
        instruction: 'Hips back and down into a deep squat, knees tracking in line with toes.',
        formCue: 'Keep chest proud, drive upward through whole foot.',
      },
      {
        name: 'Transition / Rest',
        durationSecs: 10,
        instruction: 'Position hands behind you on edge of chair/couch for triceps dips.',
        formCue: 'Fingers pointing forward.',
      },
      {
        name: 'Triceps Dips',
        durationSecs: 30,
        instruction: 'Lower pelvis toward floor by flexing elbows to 90 degrees, then extend.',
        formCue: 'Keep back close to the chair edge, avoid shrugging shoulders.',
      },
      {
        name: 'Transition / Rest',
        durationSecs: 10,
        instruction: 'Move to floor for forearm plank.',
        formCue: 'Forearms parallel.',
      },
      {
        name: 'Forearm Core Plank',
        durationSecs: 30,
        instruction: 'Hold rigid isometric plank on elbows and toes.',
        formCue: 'Squeeze glutes, draw navel toward spine, pull elbows toward toes.',
      },
      {
        name: 'Transition / Rest',
        durationSecs: 10,
        instruction: 'Stand up for high knee sprint intervals.',
        formCue: 'Shake out arms.',
      },
      {
        name: 'High Knees Cadence Drill',
        durationSecs: 30,
        instruction: 'Drive knees up toward hip level in quick alternation with rapid arm drive.',
        formCue: 'Stay tall, spring off the balls of feet.',
      },
      {
        name: 'Transition / Rest',
        durationSecs: 10,
        instruction: 'Step forward for alternating lunges.',
        formCue: 'Square hips.',
      },
      {
        name: 'Alternating Forward Lunges',
        durationSecs: 30,
        instruction: 'Step forward, lower back knee toward ground, push back to standing.',
        formCue: 'Front knee stays over ankle, torso stays upright.',
      },
      {
        name: 'Transition / Rest',
        durationSecs: 10,
        instruction: 'Final exercise: Side plank holds.',
        formCue: 'Line elbow under shoulder.',
      },
      {
        name: 'Side Plank (15s each side)',
        durationSecs: 30,
        instruction: 'Elevate hips into straight lateral line on forearm. Switch sides at 15s.',
        formCue: 'Keep hip lifted high; engage lateral obliques.',
      },
    ],
  },
  {
    id: 'routine_desk_mobility',
    title: 'Desk Worker Posture & Spine Decompression',
    subtitle: 'Reverses sitting strain, neck tension & anterior pelvic tilt',
    category: 'Mobility',
    durationMins: 4,
    intensity: 'Low',
    targetHeartRateZone: 'Resting / Zone 1 (< 95 BPM)',
    caloriesBurnEstimate: 18,
    stepsEstimate: 150,
    primaryBenefit: 'Thoracic extension & hip flexor lengthening',
    scientificRationale: 'Prolonged sitting causes chronic shortening of the psoas and pectoralis minor, while inhibiting gluteal firing. Targeted active mobility restores synovial fluid circulation and decreases postural disc compression.',
    intervals: [
      {
        name: 'Standing Wall Angels & Chest Opener',
        durationSecs: 60,
        instruction: 'Stand against a wall or upright. Draw arms up in a "W" shape, gently squeezing shoulder blades together and releasing.',
        formCue: 'Keep ribs pinned down; do not hyperextend lower back.',
      },
      {
        name: 'Standing Hip Flexor & Psoas Lunge Stretch',
        durationSecs: 60,
        instruction: 'Step one foot forward in a staggered stance. Tuck pelvis under (posterior tilt) and shift weight forward until front of hip stretches.',
        formCue: 'Squeeze the glute of the rear trailing leg to deepen the stretch.',
      },
      {
        name: 'Standing Thoracic Spine Rotations',
        durationSecs: 60,
        instruction: 'Cross arms over chest. Keep hips facing forward while rotating torso gently from left to right.',
        formCue: 'Movement originates from mid-back (ribcage), not the lumbar spine.',
      },
      {
        name: 'Cervical Retractions & Neck Decompression',
        durationSecs: 60,
        instruction: 'Perform gentle chin tucks (double chin motion) while elongating the crown of your head toward the ceiling.',
        formCue: 'Feel deep neck flexors engage while suboccipital muscles stretch.',
      },
    ],
  },
  {
    id: 'routine_soleus_pump',
    title: 'Soleus Metabolic Pushup (Seated)',
    subtitle: 'High-efficiency glucose & lipid clearance during desk work',
    category: 'Metabolic',
    durationMins: 5,
    intensity: 'Low',
    targetHeartRateZone: 'Resting / Zone 1 (< 95 BPM)',
    caloriesBurnEstimate: 24,
    stepsEstimate: 300,
    primaryBenefit: 'Metabolic rate elevation with zero joint strain',
    scientificRationale: 'The soleus muscle is comprised predominantly of slow-twitch oxidative fibers that prioritize blood glucose and free fatty acids over intramuscular glycogen, allowing sustained contractions without muscular fatigue.',
    intervals: [
      {
        name: 'Rhythmic Seated Heel Raises',
        durationSecs: 150,
        instruction: 'Sit upright with knees bent at 90 degrees and feet flat. Plant the balls of your feet firmly and raise heels as high as possible, then lower under control.',
        formCue: 'Pause for 1 second at the top of each calf extension; maintain steady tempo.',
      },
      {
        name: 'Ankle Range-of-Motion Circles',
        durationSecs: 30,
        instruction: 'Lift feet slightly and circle ankles slowly clockwise, then counter-clockwise.',
        formCue: 'Mobilize the talocrural joint and stretch Achilles tendon.',
      },
      {
        name: 'Cadence Soleus Pumping',
        durationSecs: 120,
        instruction: 'Accelerate the heel raising cadence to a brisk rhythm (approx 1 raise every second).',
        formCue: 'Feel continuous warm metabolic activation in deep calf muscles without straining knees.',
      },
    ],
  },
];

export const INITIAL_LOGGED_WORKOUTS: LoggedWorkout[] = [
  {
    id: 'wk_1',
    routineTitle: 'Post-Meal Glucose Blaster',
    category: 'Metabolic',
    durationMins: 10,
    caloriesBurned: 48,
    stepsContributed: 1120,
    completedAt: 'Today, 1:15 PM',
    intensity: 'Low',
  },
  {
    id: 'wk_2',
    routineTitle: 'Zone 2 Mitochondrial Aerobic Walk',
    category: 'Cardio',
    durationMins: 15,
    caloriesBurned: 84,
    stepsContributed: 1780,
    completedAt: 'Yesterday, 8:30 AM',
    intensity: 'Moderate',
  },
];

