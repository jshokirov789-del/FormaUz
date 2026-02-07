
(() => {
  const $ = (id) => document.getElementById(id);

  const storage = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (error) {
        return fallback;
      }
    },
    set(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };

  const todayKey = () => new Date().toISOString().slice(0, 10);
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const formatNumber = (value) => Math.round(value).toLocaleString();

  const state = {
    profile: storage.get("formaUz.profile", {
      height: "",
      weight: "",
      age: "",
      gender: "female",
      activity: "1.2",
      deficit: 500
    }),
    steps: storage.get("formaUz.steps", { date: todayKey(), count: 0, goal: 8000 }),
    water: storage.get("formaUz.water", { date: todayKey(), consumed: 0, goal: 2.4 }),
    calories: storage.get("formaUz.calories", { date: todayKey(), consumed: 0, target: 2000 }),
    activityLog: storage.get("formaUz.activityLog", []),
    foodLog: storage.get("formaUz.foodLog", []),
    savedFoods: storage.get("formaUz.savedFoods", []),
    exerciseReps: storage.get("formaUz.exerciseReps", {}),
    chatLog: storage.get("formaUz.chatLog", []),
    settings: storage.get("formaUz.settings", { theme: "light" }),
    videoProgress: storage.get("formaUz.videoProgress", {}),
    weightLog: storage.get("formaUz.weightLog", []),
    calorieLog: storage.get("formaUz.calorieLog", []),
    stepLog: storage.get("formaUz.stepLog", [])
  };

  const motivationalMessages = [
    "Bugungi kichik qadamlar ertangi katta yutuqdir.",
    "Suv ich, harakat qil, takrorla. Tanang seni eshitmoqda.",
    "Barqarorlik intensivlikdan ustun. Kel va uddala.",
    "Kelajakdagi o'zing bu mashg'ulot uchun olqishlayapti.",
    "Aqlli ovqatlan, kuchli harakat qil, yaxshi dam ol.",
    "FormaUz - kundalik motivatsiya dvigateling."
  ];

  const burnRates = [
    { name: "Tez yurish", calsPerMin: 6 },
    { name: "Arqon sakrash", calsPerMin: 12 },
    { name: "Velosiped", calsPerMin: 9 },
    { name: "HIIT", calsPerMin: 13 }
  ];

  const foodDB = [
    { name: "plov", calories: 650, serving: "1 likopcha" },
    { name: "samsa", calories: 300, serving: "1 dona" },
    { name: "lagman", calories: 420, serving: "1 kosa" },
    { name: "shashlik", calories: 250, serving: "100 g" },
    { name: "salad", calories: 120, serving: "1 kosa" },
    { name: "apple", calories: 95, serving: "1 o'rtacha" },
    { name: "banana", calories: 105, serving: "1 o'rtacha" },
    { name: "chicken", calories: 220, serving: "150 g" },
    { name: "rice", calories: 200, serving: "1 piyola" },
    { name: "eggs", calories: 155, serving: "2 ta tuxum" },
    { name: "oatmeal", calories: 150, serving: "1 kosa" },
    { name: "yogurt", calories: 120, serving: "1 piyola" },
    { name: "burger", calories: 500, serving: "1 burger" },
    { name: "pizza", calories: 285, serving: "1 bo'lak" },
    { name: "bread", calories: 80, serving: "1 bo'lak" },
    { name: "soup", calories: 150, serving: "1 kosa" },
    { name: "fish", calories: 200, serving: "150 g" },
    { name: "beef", calories: 250, serving: "100 g" },
    { name: "pasta", calories: 320, serving: "1 kosa" },
    { name: "nuts", calories: 180, serving: "30 g" },
    { name: "juice", calories: 120, serving: "250 ml" },
    { name: "coffee", calories: 30, serving: "1 piyola" },
    { name: "tea", calories: 10, serving: "1 piyola" },
    { name: "ice cream", calories: 200, serving: "1 qoshiq" },
    { name: "chocolate", calories: 210, serving: "40 g" }
  ];
  const exerciseLibrary = [
    { id: "jumping-jacks", name: "Sakrashlar", categories: ["cardio", "fat-burn", "beginner", "home"], duration: 40, reps: 30, level: "Boshlovchi" },
    { id: "high-knees", name: "Tizzani yuqori ko'tarish", categories: ["cardio", "fat-burn"], duration: 45, reps: 40, level: "O'rtacha" },
    { id: "mountain-climbers", name: "Tog'ga chiqish", categories: ["cardio", "fat-burn"], duration: 45, reps: 35, level: "O'rtacha" },
    { id: "burpees", name: "Burpi", categories: ["cardio", "strength", "fat-burn"], duration: 30, reps: 15, level: "Yuqori" },
    { id: "plank-hold", name: "Plank ushlash", categories: ["strength", "beginner"], duration: 45, reps: 1, level: "Boshlovchi" },
    { id: "push-ups", name: "Otjimaniya", categories: ["strength", "home"], duration: 40, reps: 15, level: "O'rtacha" },
    { id: "squats", name: "O'tirib turish", categories: ["strength", "home", "beginner"], duration: 45, reps: 20, level: "Boshlovchi" },
    { id: "reverse-lunges", name: "Orqaga lunj", categories: ["strength", "home"], duration: 45, reps: 20, level: "O'rtacha" },
    { id: "glute-bridges", name: "Dumba ko'prigi", categories: ["strength", "beginner", "home"], duration: 40, reps: 20, level: "Boshlovchi" },
    { id: "bicycle-crunches", name: "Velosiped crunch", categories: ["strength", "fat-burn"], duration: 40, reps: 30, level: "O'rtacha" },
    { id: "russian-twists", name: "Rus burilishi", categories: ["strength", "fat-burn"], duration: 40, reps: 30, level: "O'rtacha" },
    { id: "skaters", name: "Skaterlar", categories: ["cardio", "fat-burn"], duration: 40, reps: 30, level: "O'rtacha" },
    { id: "jump-rope", name: "Arqon sakrash", categories: ["cardio", "fat-burn"], duration: 60, reps: 60, level: "O'rtacha" },
    { id: "shadow-boxing", name: "Soyali boks", categories: ["cardio", "home"], duration: 60, reps: 1, level: "Boshlovchi" },
    { id: "step-ups", name: "Pog'onaga chiqish", categories: ["strength", "home", "beginner"], duration: 45, reps: 20, level: "Boshlovchi" },
    { id: "wall-sit", name: "Devorga o'tirish", categories: ["strength"], duration: 45, reps: 1, level: "O'rtacha" },
    { id: "side-plank", name: "Yon plank", categories: ["strength", "mobility"], duration: 30, reps: 1, level: "Boshlovchi" },
    { id: "yoga-flow", name: "Yoga oqimi", categories: ["mobility", "beginner"], duration: 120, reps: 1, level: "Boshlovchi" },
    { id: "mobility-stretch", name: "Harakatchanlik cho'zilishi", categories: ["mobility", "beginner"], duration: 90, reps: 1, level: "Boshlovchi" },
    { id: "sprint-intervals", name: "Sprint intervallari", categories: ["cardio", "fat-burn"], duration: 40, reps: 8, level: "Yuqori" },
    { id: "stair-climb", name: "Zinapoyaga chiqish", categories: ["cardio", "fat-burn"], duration: 60, reps: 1, level: "O'rtacha" },
    { id: "butt-kicks", name: "Orqa tepish", categories: ["cardio", "beginner"], duration: 40, reps: 35, level: "Boshlovchi" },
    { id: "plank-jacks", name: "Plank sakrash", categories: ["cardio", "fat-burn"], duration: 30, reps: 20, level: "O'rtacha" },
    { id: "bear-crawl", name: "Ayiq yurishi", categories: ["strength", "fat-burn"], duration: 30, reps: 20, level: "Yuqori" },
    { id: "superman", name: "Supermen", categories: ["mobility", "strength"], duration: 40, reps: 20, level: "Boshlovchi" },
    { id: "dead-bug", name: "Dead Bug", categories: ["strength", "beginner"], duration: 40, reps: 20, level: "Boshlovchi" },
    { id: "reverse-crunch", name: "Teskari crunch", categories: ["strength", "fat-burn"], duration: 40, reps: 20, level: "O'rtacha" },
    { id: "calf-raises", name: "Boldir ko'tarish", categories: ["strength", "beginner"], duration: 40, reps: 25, level: "Boshlovchi" },
    { id: "arm-circles", name: "Qo'l aylantirish", categories: ["mobility", "beginner"], duration: 40, reps: 30, level: "Boshlovchi" },
    { id: "hip-openers", name: "Son ochish", categories: ["mobility", "beginner"], duration: 60, reps: 1, level: "Boshlovchi" },
    { id: "kettlebell-swings", name: "Girya siltash", categories: ["strength", "fat-burn"], duration: 40, reps: 20, level: "Yuqori" },
    { id: "band-rows", name: "Rezina lenta tortish", categories: ["strength", "home"], duration: 40, reps: 20, level: "Boshlovchi" },
    { id: "bird-dogs", name: "Qush-it mashqi", categories: ["mobility", "beginner"], duration: 45, reps: 20, level: "Boshlovchi" },
    { id: "lateral-lunges", name: "Yon lunj", categories: ["strength", "home"], duration: 45, reps: 20, level: "O'rtacha" }
  ];
  const videoLibrary = [
    { title: "15 daq butun tana yoqish", query: "15 minute full body workout", length: "15 min", level: "Hamma" },
    { title: "10 daq qorin shakllantirish", query: "10 minute abs workout", length: "10 min", level: "Boshlovchi" },
    { title: "20 daq HIIT terlash", query: "20 minute hiit workout", length: "20 min", level: "O'rtacha" },
    { title: "Past zarbali kardio", query: "low impact cardio workout", length: "25 min", level: "Boshlovchi" },
    { title: "Ertalabki harakatchanlik oqimi", query: "morning mobility routine", length: "12 min", level: "Hamma" },
    { title: "Yuqori tana kuchi", query: "upper body dumbbell workout", length: "30 min", level: "O'rtacha" },
    { title: "Dumba va oyoqlar", query: "glutes and legs workout", length: "25 min", level: "O'rtacha" },
    { title: "Tabata portlashi", query: "tabata workout", length: "18 min", level: "Yuqori" },
    { title: "Raqs kardio partiyasi", query: "dance cardio workout", length: "25 min", level: "Hamma" },
    { title: "Pilates qorin", query: "pilates core workout", length: "20 min", level: "Boshlovchi" },
    { title: "Cho'zilish va tiklanish", query: "full body stretch routine", length: "15 min", level: "Hamma" },
    { title: "Qorin va kardio", query: "core cardio workout", length: "20 min", level: "O'rtacha" },
    { title: "HIIT for Boshlovchis", query: "hiit for beginners", length: "15 min", level: "Boshlovchi" },
    { title: "Tana vazni bilan kuch", query: "bodyweight strength workout", length: "30 min", level: "Hamma" },
    { title: "Pastki tana yoqish", query: "lower body workout", length: "25 min", level: "O'rtacha" },
    { title: "Qo'l va yelkalar", query: "arms and shoulders workout", length: "20 min", level: "Boshlovchi" },
    { title: "Boks kardio", query: "boxing cardio workout", length: "20 min", level: "Hamma" },
    { title: "Terlovchi zinapoya mashqi", query: "stair workout", length: "15 min", level: "O'rtacha" },
    { title: "Qorin barqarorligi", query: "core stability workout", length: "18 min", level: "Boshlovchi" },
    { title: "Butun tana shakllantirish", query: "full body sculpt workout", length: "30 min", level: "O'rtacha" },
    { title: "Tez yog' yoqish", query: "fat burn workout", length: "20 min", level: "Hamma" },
    { title: "Ertalabki yoga", query: "morning yoga flow", length: "20 min", level: "Hamma" },
    { title: "Kechki cho'zilish", query: "evening stretch routine", length: "12 min", level: "Hamma" },
    { title: "Kardio kik", query: "cardio kickboxing workout", length: "25 min", level: "O'rtacha" },
    { title: "Butun tana tonusi", query: "total body toning workout", length: "30 min", level: "Hamma" },
    { title: "Jihozsiz terlash", query: "no equipment workout", length: "20 min", level: "Boshlovchi" },
    { title: "Tezkor qorin tiklash", query: "quick core workout", length: "10 min", level: "Hamma" },
    { title: "HIIT va qorin", query: "hiit and core workout", length: "25 min", level: "Yuqori" },
    { title: "Bootcamp sikli", query: "bootcamp circuit workout", length: "30 min", level: "Yuqori" },
    { title: "Butun tana cho'zilishi", query: "full body stretch", length: "15 min", level: "Hamma" }
  ];
  let activeExercise = null;
  let sessionRemaining = 0;
  let sessionInterval = null;
  let walkInterval = null;
  let currentVideo = null;
  let lastDetectedFood = null;
  let previewUrl = null;
  let notifyInterval = null;
  let installPromptEvent = null;

  function persist() {
    storage.set("formaUz.profile", state.profile);
    storage.set("formaUz.steps", state.steps);
    storage.set("formaUz.water", state.water);
    storage.set("formaUz.calories", state.calories);
    storage.set("formaUz.activityLog", state.activityLog);
    storage.set("formaUz.foodLog", state.foodLog);
    storage.set("formaUz.savedFoods", state.savedFoods);
    storage.set("formaUz.exerciseReps", state.exerciseReps);
    storage.set("formaUz.chatLog", state.chatLog);
    storage.set("formaUz.settings", state.settings);
    storage.set("formaUz.videoProgress", state.videoProgress);
    storage.set("formaUz.weightLog", state.weightLog);
    storage.set("formaUz.calorieLog", state.calorieLog);
    storage.set("formaUz.stepLog", state.stepLog);
  }

  function syncDaily() {
    const today = todayKey();
    if (state.steps.date !== today) {
      state.steps = { date: today, count: 0, goal: state.steps.goal || 8000 };
    }
    if (state.water.date !== today) {
      state.water = { date: today, consumed: 0, goal: state.water.goal || 2.4 };
    }
    if (state.calories.date !== today) {
      state.calories = { date: today, consumed: 0, target: state.calories.target || 2000 };
    }
  }

  function setText(id, text) {
    const el = $(id);
    if (el) {
      el.textContent = text;
    }
  }

  function updateProgress(id, ratio) {
    const el = $(id);
    if (el) {
      el.style.width = `${clamp(ratio * 100, 0, 100)}%`;
    }
  }

  function updateMotivation() {
    const message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    setText("motivationMessage", message);
  }
  function updateDashboard() {
    setText("todayDate", new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" }));
    setText("heroCalories", `${formatNumber(state.calories.target)} kkal`);
    setText("heroWater", `${state.water.goal.toFixed(2)} L`);
    setText("heroSteps", formatNumber(state.steps.count));

    setText("pulseCalories", `${formatNumber(state.calories.consumed)} kkal`);
    setText("pulseWater", `${state.water.consumed.toFixed(2)} L`);
    setText("pulseSteps", formatNumber(state.steps.count));

    updateProgress("calorieProgress", state.calories.target ? state.calories.consumed / state.calories.target : 0);
    updateProgress("waterProgress", state.water.goal ? state.water.consumed / state.water.goal : 0);
    updateProgress("stepProgress", state.steps.goal ? state.steps.count / state.steps.goal : 0);

    setText("dashboardCalories", `${formatNumber(state.calories.consumed)} / ${formatNumber(state.calories.target)} kkal`);
    const calorieLeft = Math.round(state.calories.target - state.calories.consumed);
    setText("calorieDelta", calorieLeft >= 0 ? `${calorieLeft} kkal qoldi` : `${Math.abs(calorieLeft)} kkal oshdi`);
    updateProgress("dashboardCalorieProgress", state.calories.target ? state.calories.consumed / state.calories.target : 0);

    setText("dashboardWater", `${state.water.consumed.toFixed(2)} / ${state.water.goal.toFixed(2)} L`);
    const waterLeft = Number((state.water.goal - state.water.consumed).toFixed(2));
    setText("waterDelta", waterLeft >= 0 ? `${waterLeft} L to go` : `${Math.abs(waterLeft)} L extra`);
    updateProgress("dashboardWaterProgress", state.water.goal ? state.water.consumed / state.water.goal : 0);

    setText("dashboardSteps", `${formatNumber(state.steps.count)} / ${formatNumber(state.steps.goal)} qadam`);
    const stepsLeft = state.steps.goal - state.steps.count;
    setText("stepDelta", stepsLeft >= 0 ? `${formatNumber(stepsLeft)} maqsadgacha` : `${formatNumber(Math.abs(stepsLeft))} maqsaddan oshdi`);
    updateProgress("dashboardStepProgress", state.steps.goal ? state.steps.count / state.steps.goal : 0);

    updateStepsUI();
    updateRecommendations();
    updateFocusPlan();
    updateAssistantHighlights();
    updateCharts();
  }

  function updateStepsUI() {
    setText("stepCount", formatNumber(state.steps.count));
    const calories = Math.round(state.steps.count * 0.04);
    const distance = state.steps.count * 0.0008;
    const minutes = Math.round(state.steps.count / 100);
    setText("stepCalories", `${formatNumber(calories)} kkal`);
    setText("stepDistance", `${distance.toFixed(2)} km`);
    setText("activeMinutes", `${minutes} daq`);

    const ratio = state.steps.goal ? state.steps.count / state.steps.goal : 0;
    const intensity = ratio >= 1 ? "Zo'r" : ratio >= 0.7 ? "Yuqori" : ratio >= 0.4 ? "O'rtacha" : "Yengil";
    setText("activityIntensity", intensity);
    updateProgress("activityProgress", ratio);
    renderActivityLog();
  }

  function updateRecommendations() {
    const tips = [];
    const calorieBalance = state.calories.consumed - state.calories.target;

    if (state.calories.consumed === 0) {
      tips.push("Birinchi ovqatingizni yozing va ovqatlanish tahlili ochilsin.");
    }

    if (calorieBalance > 150) {
      tips.push(`Maqsaddan ${Math.round(calorieBalance)} kkal oshdingiz. ${Math.ceil(calorieBalance / 10)} daqiqa HIIT yoki ${Math.ceil(calorieBalance / 6)} daqiqa tez yurishni sinab ko'ring.`);
    } else {
      const remaining = Math.max(0, Math.round(state.calories.target - state.calories.consumed));
      tips.push(`Sizda ${remaining} kkal qoldi. Oqsil va tolaga urg'u bering.`);
    }

    if (state.steps.count < state.steps.goal * 0.5) {
      tips.push("Qadamlaringizni oshirish uchun 12 daqiqa yuring.");
    }

    if (state.water.consumed < state.water.goal * 0.6) {
      tips.push("Oldinda bo'lish uchun hozir 250 ml suv iching.");
    }

    if (!state.profile.weight) {
      tips.push("Kundalik maqsadlarni shaxsiylashtirish uchun kalkulyatorni ishga tushiring.");
    }

    const list = $("smartTips");
    if (!list) return;
    list.innerHTML = "";
    tips.slice(0, 4).forEach((tip) => {
      const li = document.createElement("li");
      li.textContent = tip;
      list.appendChild(li);
    });
  }

  function updateFocusPlan() {
    const container = $("focusPlan");
    if (!container) return;
    const stepsLeft = Math.max(0, state.steps.goal - state.steps.count);
    const waterLeft = Math.max(0, Number((state.water.goal - state.water.consumed).toFixed(2)));
    const calorieLeft = Math.max(0, Math.round(state.calories.target - state.calories.consumed));
    container.innerHTML = "";
    const items = [
      { title: "Harakat", value: `${formatNumber(stepsLeft)} qadam qoldi`, desc: "3 ta qisqa yurishga bo'ling." },
      { title: "Ovqatlanish", value: `${formatNumber(calorieLeft)} kkal qoldi`, desc: "Yog'siz oqsil va ko'katlar." },
      { title: "Gidratsiya", value: `${waterLeft.toFixed(2)} L ichish kerak`, desc: "Har 30 daqiqada bir yuting." }
    ];
    items.forEach((item) => {
      const div = document.createElement("div");
      div.className = "focus-card";
      div.innerHTML = `<strong>${item.title}</strong><span>${item.value}</span><p class="muted">${item.desc}</p>`;
      container.appendChild(div);
    });
  }

  function updateAssistantHighlights() {
    const list = $("assistantHighlights");
    if (!list) return;
    list.innerHTML = "";
    const highlights = [
      `Kaloriya maqsadi: ${formatNumber(state.calories.target)} kkal`,
      `Suv maqsadi: ${state.water.goal.toFixed(2)} L`,
      `Qolgan qadamlar: ${formatNumber(Math.max(0, state.steps.goal - state.steps.count))}`
    ];
    highlights.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });
  }

  function renderActivityLog() {
    const list = $("activityLog");
    if (!list) return;
    list.innerHTML = "";
    state.activityLog.slice(0, 6).forEach((entry) => {
      const li = document.createElement("li");
      li.textContent = `${entry.time} - ${entry.label}`;
      list.appendChild(li);
    });
  }

  function addActivityLog(label) {
    state.activityLog.unshift({
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      label
    });
    state.activityLog = state.activityLog.slice(0, 6);
  }
  function initCalculator() {
    const form = $("calcForm");
    if (!form) return;

    if (state.profile.height) $("height").value = state.profile.height;
    if (state.profile.weight) $("weight").value = state.profile.weight;
    if (state.profile.age) $("age").value = state.profile.age;
    if (state.profile.gender) $("gender").value = state.profile.gender;
    if (state.profile.activity) $("activity").value = state.profile.activity;
    if (state.profile.deficit) {
      $("deficit").value = state.profile.deficit;
      setText("deficitValue", state.profile.deficit);
    }

    $("deficit").addEventListener("input", (event) => {
      setText("deficitValue", event.target.value);
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      calculateMetrics();
    });

    if (state.profile.weight) {
      calculateMetrics();
    }
  }

  function calculateMetrics() {
    const height = Number($("height").value);
    const weight = Number($("weight").value);
    const age = Number($("age").value);
    const gender = $("gender").value;
    const activity = Number($("activity").value);
    const deficit = Number($("deficit").value);

    if (!height || !weight || !age) return;

    const bmr = gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

    const tdee = bmr * activity;
    const target = Math.max(1200, tdee - deficit);
    const water = Math.max(1.5, weight * 0.033);

    setText("bmrValue", `${Math.round(bmr)} kkal`);
    setText("tdeeValue", `${Math.round(tdee)} kkal`);
    setText("targetValue", `${Math.round(target)} kkal`);
    setText("waterValue", `${water.toFixed(2)} L`);

    state.profile = { height, weight, age, gender, activity: activity.toString(), deficit };
    state.calories.target = Math.round(target);
    state.water.goal = Number(water.toFixed(2));

    persist();
    updateDashboard();
  }

  function initSteps() {
    $("addStepsBtn").addEventListener("click", () => {
      const amount = Number($("stepInput").value);
      if (amount > 0) {
        addSteps(amount);
        $("stepInput").value = "";
      }
    });

    $("add500Btn").addEventListener("click", () => addSteps(500));
    $("add1000Btn").addEventListener("click", () => addSteps(1000));
    $("walkToggle").addEventListener("click", toggleWalk);
  }

  function addSteps(amount) {
    if (!amount || amount <= 0) return;
    state.steps.count += amount;
    addActivityLog(`+${formatNumber(amount)} qadam`);
    persist();
    updateDashboard();
  }

  function toggleWalk() {
    const button = $("walkToggle");
    if (walkInterval) {
      clearInterval(walkInterval);
      walkInterval = null;
      if (button) button.textContent = "Yurishni boshlash";
      addActivityLog("Yurish seansi tugadi");
      persist();
      updateDashboard();
      return;
    }

    if (button) button.textContent = "Yurishni to'xtatish";
    addActivityLog("Yurish seansi boshlandi");
    walkInterval = setInterval(() => {
      const increment = 10 + Math.floor(Math.random() * 10);
      state.steps.count += increment;
      persist();
      updateDashboard();
    }, 1000);
  }
  function initExercises() {
    const filters = $("exerciseFilters");
    if (filters) {
      filters.addEventListener("click", (event) => {
        const button = event.target.closest(".chip");
        if (!button) return;
        filters.querySelectorAll(".chip").forEach((chip) => chip.classList.remove("active"));
        button.classList.add("active");
        renderExercises(button.dataset.filter);
      });
    }

    const grid = $("exerciseGrid");
    if (grid) {
      grid.addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button) return;
        const action = button.dataset.action;
        const exerciseId = button.dataset.id;
        const exercise = exerciseLibrary.find((item) => item.id === exerciseId);
        if (!exercise) return;

        if (action === "select") {
          setActiveExercise(exercise);
        }
        if (action === "start") {
          setActiveExercise(exercise);
          startSession();
        }
        if (action === "rep") {
          incrementReps(exercise);
        }
      });
    }

    $("sessionStart").addEventListener("click", startSession);
    $("sessionPause").addEventListener("click", pauseSession);
    $("sessionReset").addEventListener("click", resetSession);
  }

  function renderExercises(filter = "all") {
    const grid = $("exerciseGrid");
    if (!grid) return;
    grid.innerHTML = "";
    const colors = ["#19d3c5", "#ff7a59", "#ffc857", "#4cd964", "#3b82f6"];

    exerciseLibrary
      .filter((exercise) => filter === "all" || exercise.categories.includes(filter))
      .forEach((exercise, index) => {
        const card = document.createElement("div");
        card.className = "card glass exercise-card";
        const initials = exercise.name
          .split(" ")
          .map((word) => word[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();
        const accent = colors[index % colors.length];

        card.innerHTML = `
          <div class="exercise-media" style="--accent: ${accent}">${initials}</div>
          <div>
            <h4>${exercise.name}</h4>
            <div class="exercise-meta">
              <span>${exercise.level}</span>
              <span>${exercise.duration} soniya</span>
            </div>
          </div>
          <div class="exercise-actions">
            <button class="btn small accent" data-action="start" data-id="${exercise.id}" type="button">Boshlash</button>
            <button class="btn small ghost" data-action="rep" data-id="${exercise.id}" type="button">+ Takror</button>
            <button class="btn small ghost" data-action="select" data-id="${exercise.id}" type="button">Tanlash</button>
          </div>
        `;
        grid.appendChild(card);
      });
  }

  function setActiveExercise(exercise) {
    activeExercise = exercise;
    sessionRemaining = exercise.duration;
    if (!state.exerciseReps[exercise.id]) {
      state.exerciseReps[exercise.id] = 0;
    }
    updateSessionUI();
  }

  function updateSessionUI() {
    if (!activeExercise) return;
    setText("sessionName", activeExercise.name);
    setText("sessionTimer", formatTime(sessionRemaining));
    setText("sessionReps", state.exerciseReps[activeExercise.id] || 0);
  }

  function formatTime(seconds) {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(Math.floor(seconds % 60)).padStart(2, "0");
    return `${minutes}:${secs}`;
  }

  function startSession() {
    if (!activeExercise) return;
    if (sessionInterval) return;
    if (sessionRemaining <= 0) sessionRemaining = activeExercise.duration;

    sessionInterval = setInterval(() => {
      sessionRemaining -= 1;
      updateSessionUI();
      if (sessionRemaining <= 0) {
        clearInterval(sessionInterval);
        sessionInterval = null;
        addActivityLog(`${activeExercise.name} yakunlandi`);
        persist();
        updateDashboard();
      }
    }, 1000);
  }

  function pauseSession() {
    if (sessionInterval) {
      clearInterval(sessionInterval);
      sessionInterval = null;
    }
  }

  function resetSession() {
    pauseSession();
    if (!activeExercise) return;
    sessionRemaining = activeExercise.duration;
    updateSessionUI();
  }

  function incrementReps(exercise) {
    state.exerciseReps[exercise.id] = (state.exerciseReps[exercise.id] || 0) + 1;
    addActivityLog(`${exercise.name} +1 takror`);
    persist();
    updateSessionUI();
  }
  function initVideos() {
    renderVideoLibrary();
    const library = $("videoLibrary");
    if (library) {
      library.addEventListener("click", (event) => {
        const card = event.target.closest(".video-card");
        if (!card) return;
        loadVideo({ title: card.dataset.title, query: card.dataset.query, length: card.dataset.length, level: card.dataset.level });
      });
    }

    $("markWatched").addEventListener("click", () => {
      if (!currentVideo) return;
      state.videoProgress[currentVideo.title] = true;
      persist();
      renderVideoLibrary();
      setText("videoStatus", `Ko'rildi: ${currentVideo.title}`);
    });
  }

  function renderVideoLibrary() {
    const library = $("videoLibrary");
    if (!library) return;
    library.innerHTML = "";
    videoLibrary.forEach((video) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = `video-card ${state.videoProgress[video.title] ? "watched" : ""}`;
      card.dataset.title = video.title;
      card.dataset.query = video.query;
      card.dataset.length = video.length;
      card.dataset.level = video.level;
      card.innerHTML = `
        <span>${video.title}</span>
        <small class="muted">${video.length} - ${video.level}</small>
      `;
      library.appendChild(card);
    });
  }

  function loadVideo(video) {
    currentVideo = video;
    const iframe = $("videoPlayer");
    if (iframe) {
      iframe.src = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(video.query)}`;
    }
    setText("videoStatus", `${video.title} - ${video.length} - ${video.level}`);
  }
  function initFood() {
    const foodImage = $("foodImage");
    if (foodImage) {
      foodImage.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const name = file.name.replace(/\.[^/.]+$/, "");
        if (!$("foodName").value) {
          $("foodName").value = name;
        }
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        previewUrl = URL.createObjectURL(file);
        const preview = $("foodPreview");
        if (preview) {
          preview.innerHTML = `<img src="${previewUrl}" alt="Ovqat ko'rinishi">`;
        }
      });
    }

    $("detectFoodBtn").addEventListener("click", detectFoodCalories);
    $("saveFoodBtn").addEventListener("click", saveDetectedFood);
    $("logFoodBtn").addEventListener("click", logFoodEntry);

    const savedList = $("savedFoodsList");
    if (savedList) {
      savedList.addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button) return;
        $("foodName").value = button.dataset.name;
        $("foodAmount").value = "1";
      });
    }
  }

  function detectFoodCalories() {
    const nameInput = $("foodName").value.trim().toLowerCase();
    const servings = Number($("foodAmount").value) || 1;
    const result = $("foodResult");

    const match = foodDB.find((food) => nameInput.includes(food.name));
    const fallback = { name: nameInput || "Custom meal", calories: 250, serving: "1 serving" };
    const item = match || fallback;
    const totalCalories = Math.round(item.calories * servings);

    lastDetectedFood = { name: item.name, calories: item.calories, serving: item.serving, totalCalories, servings };

    if (result) {
      const burnList = burnRates
        .map((burn) => `<li>${burn.name}: ${Math.ceil(totalCalories / burn.calsPerMin)} daq</li>`)
        .join("");

      result.innerHTML = `
        <h4>${item.name.toUpperCase()}</h4>
        <p>${totalCalories} kkal — ${servings} porsiya</p>
        <p class="muted">Asosiy: ${item.calories} kkal / ${item.serving}</p>
        <div class="note">Tavsiya etilgan yoqish rejasi</div>
        <ul>${burnList}</ul>
      `;
    }
  }

  function saveDetectedFood() {
    if (!lastDetectedFood) return;
    const exists = state.savedFoods.some((food) => food.name === lastDetectedFood.name);
    if (!exists) {
      state.savedFoods.push({
        name: lastDetectedFood.name,
        calories: lastDetectedFood.calories,
        serving: lastDetectedFood.serving
      });
      persist();
      renderSavedFoods();
    }
  }

  function renderSavedFoods() {
    const list = $("savedFoodsList");
    if (!list) return;
    list.innerHTML = "";
    if (state.savedFoods.length === 0) {
      list.innerHTML = "<li class=\"muted\">Hali saqlangan ovqatlar yo'q.</li>";
      return;
    }

    state.savedFoods.forEach((food) => {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.name = food.name;
      button.textContent = `${food.name} - ${food.calories} kkal`;
      item.appendChild(button);
      list.appendChild(item);
    });
  }

  function logFoodEntry() {
    if (!lastDetectedFood) return;
    state.foodLog.push({
      date: todayKey(),
      name: lastDetectedFood.name,
      calories: lastDetectedFood.totalCalories
    });
    state.calories.consumed += lastDetectedFood.totalCalories;
    addActivityLog(`${lastDetectedFood.name} yozildi`);
    persist();
    updateDashboard();
  }
  function initChat() {
    const form = $("chatForm");
    if (!form) return;
    renderChat();

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = $("chatInput");
      const message = input.value.trim();
      if (!message) return;
      input.value = "";
      addMessage("user", message);
      const reply = getBotReply(message);
      addMessage("bot", reply);
      persist();
    });
  }

  function renderChat() {
    const box = $("chatMessages");
    if (!box) return;
    box.innerHTML = "";
    state.chatLog.forEach((message) => {
      const bubble = document.createElement("div");
      bubble.className = `chat-bubble ${message.role}`;
      bubble.textContent = message.text;
      box.appendChild(bubble);
    });
    box.scrollTop = box.scrollHeight;
  }

  function addMessage(role, text) {
    state.chatLog.push({ role, text });
    if (state.chatLog.length > 40) {
      state.chatLog.shift();
    }
    renderChat();
  }

  function getBotReply(text) {
    const lower = text.toLowerCase();
    const caloriesLeft = Math.round(state.calories.target - state.calories.consumed);
    const stepsLeft = Math.max(0, state.steps.goal - state.steps.count);
    const waterLeft = Math.max(0, Number((state.water.goal - state.water.consumed).toFixed(2)));

    if (lower.includes("water") || lower.includes("hydrate")) {
      return `Sizning suv maqsadingiz ${state.water.goal.toFixed(2)} L. Bugun yana ${waterLeft.toFixed(2)} L kerak.`;
    }

    if (lower.includes("calorie") || lower.includes("kkal") || lower.includes("bmr") || lower.includes("tdee")) {
      return `Kaloriya maqsadi: ${formatNumber(state.calories.target)}. You have ${caloriesLeft} kkal qoldi today.`;
    }

    if (lower.includes("step")) {
      return `Maqsadga yetish uchun ${formatNumber(stepsLeft)} qadam qoldi. 12 daqiqalik yurish ko'pini yopadi.`;
    }

    if (lower.includes("workout") || lower.includes("exercise") || lower.includes("train")) {
      return "20 daqiqalik kardio bilan boshlang, so'ngra qorin va harakatchanlik bilan yakunlang. Mashqlar kutubxonasi tayyor.";
    }

    if (lower.includes("lose") || lower.includes("fat") || lower.includes("weight")) {
      return "Barqaror 300-500 kkal defitsitga intiling, oqsilni yetarli qiling va haftasiga 4-5 kun mashq qiling. Siz to'g'ri yo'ldasiz.";
    }

    if (lower.includes("tired") || lower.includes("lazy") || lower.includes("motivat")) {
      return "5 daqiqadan boshlang. Inersiya o'zi olib ketadi. Kichik mashg'ulot ham yutuq.";
    }

    return "Yordam berishga tayyorman. Kaloriya, qadamlar yoki mashg'ulot rejasi haqida so'rang, birga tuzamiz.";
  }
  function initProgress() {
    $("logWeightBtn").addEventListener("click", () => {
      const value = Number($("weightLogInput").value);
      if (!value) return;
      logValue(state.weightLog, value);
      $("weightLogInput").value = "";
      persist();
      updateCharts();
    });

    $("logCaloriesBtn").addEventListener("click", () => {
      const value = Number($("calorieLogInput").value);
      if (!value) return;
      logValue(state.calorieLog, value);
      $("calorieLogInput").value = "";
      persist();
      updateCharts();
    });

    $("logStepsBtn").addEventListener("click", () => {
      const value = Number($("stepLogInput").value);
      if (!value) return;
      logValue(state.stepLog, value);
      $("stepLogInput").value = "";
      persist();
      updateCharts();
    });
  }

  function logValue(logArray, value) {
    const today = todayKey();
    const existing = logArray.find((item) => item.date === today);
    if (existing) {
      existing.value = value;
    } else {
      logArray.push({ date: today, value });
    }
    if (logArray.length > 20) {
      logArray.splice(0, logArray.length - 20);
    }
  }

  function updateCharts() {
    logValue(state.stepLog, state.steps.count);
    logValue(state.calorieLog, state.calories.consumed);
    drawChart($("weightChart"), state.weightLog, "#ff7a59");
    drawChart($("calorieChart"), state.calorieLog, "#19d3c5");
    drawChart($("stepChart"), state.stepLog, "#3b82f6");
    persist();
  }

  function drawChart(canvas, data, color) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.clientWidth || 300;
    const height = canvas.clientHeight || 220;
    const ratio = window.devicePixelRatio || 1;

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.scale(ratio, ratio);
    ctx.clearRect(0, 0, width, height);

    if (data.length === 0) {
      ctx.fillStyle = "rgba(148, 163, 184, 0.8)";
      ctx.font = "14px Manrope";
      ctx.fillText("Hali ma'lumot yo'q", 12, 24);
      return;
    }

    const values = data.map((item) => item.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1 || 1;
    const low = min - padding;
    const high = max + padding;
    const stepX = width / Math.max(values.length - 1, 1);

    ctx.beginPath();
    values.forEach((value, index) => {
      const x = index * stepX;
      const y = height - ((value - low) / (high - low)) * (height - 24) - 12;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    values.forEach((value, index) => {
      const x = index * stepX;
      const y = height - ((value - low) / (high - low)) * (height - 24) - 12;
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  }
  function initOffline() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js")
        .then(() => setText("offlineStatus", "Offlayn kesh tayyor."))
        .catch(() => setText("offlineStatus", "Service worker ro'yxatdan o'tmadi."));
    }

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    updateOnlineStatus();

    const refreshButton = $("refreshCacheBtn");
    if (refreshButton) {
      refreshButton.addEventListener("click", () => {
        if ("caches" in window) {
          caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key)))).then(() => {
            setText("offlineStatus", "Kesh yangilandi.");
          });
        }
      });
    }

    const notifyButton = $("notifyBtn");
    if (notifyButton) {
      notifyButton.addEventListener("click", async () => {
        if (!("Notification" in window)) {
          setText("notifyStatus", "Bu brauzerda bildirishnomalar qo'llab-quvvatlanmaydi.");
          return;
        }
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          setText("notifyStatus", "Ilova ochiq bo'lganda suv eslatmalari yoqildi.");
          if (notifyInterval) clearInterval(notifyInterval);
          notifyInterval = setInterval(() => {
            new Notification("FormaUz Suv eslatmasi", {
              body: "Suv vaqti. Hozir 250 ml iching.",
              icon: "icon.svg"
            });
          }, 2 * 60 * 60 * 1000);
        } else {
          setText("notifyStatus", "Bildirishnoma ruxsati rad etildi.");
        }
      });
    }

    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      installPromptEvent = event;
      const installBtn = $("installBtn");
      if (installBtn) installBtn.hidden = false;
    });

    const installBtn = $("installBtn");
    if (installBtn) {
      installBtn.addEventListener("click", async () => {
        if (!installPromptEvent) return;
        installPromptEvent.prompt();
        await installPromptEvent.userChoice;
        installPromptEvent = null;
        installBtn.hidden = true;
      });
    }
  }

  function updateOnlineStatus() {
    const online = navigator.onLine;
    const status = $("statusOnline");
    if (status) {
      status.textContent = online ? "Onlayn" : "Offlayn";
      status.classList.toggle("offline", !online);
    }
  }

  function initObserver() {
    const items = document.querySelectorAll("[data-reveal]");
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
            }
          });
        },
        { threshold: 0.15 }
      );
      items.forEach((item) => observer.observe(item));
    } else {
      items.forEach((item) => item.classList.add("is-visible"));
    }
  }

  function bindShortcuts() {
    const modeToggle = $("modeToggle");
    if (modeToggle) {
      modeToggle.addEventListener("click", () => {
        state.settings.theme = state.settings.theme === "dark" ? "light" : "dark";
        document.body.classList.toggle("dark", state.settings.theme === "dark");
        modeToggle.textContent = state.settings.theme === "dark" ? "Yorug' rejim" : "Qorong'i rejim";
        persist();
      });
    }

    const openFood = $("openFoodLog");
    if (openFood) {
      openFood.addEventListener("click", () => {
        document.querySelector("#food").scrollIntoView({ behavior: "smooth" });
      });
    }

    const openSteps = $("openSteps");
    if (openSteps) {
      openSteps.addEventListener("click", () => {
        document.querySelector("#activity").scrollIntoView({ behavior: "smooth" });
      });
    }

    const startFocus = $("startFocus");
    if (startFocus) {
      startFocus.addEventListener("click", () => {
        document.querySelector("#dashboard").scrollIntoView({ behavior: "smooth" });
      });
    }

    const quickLog = $("quickLog");
    if (quickLog) {
      quickLog.addEventListener("click", () => {
        document.querySelector("#food").scrollIntoView({ behavior: "smooth" });
        $("foodName").focus();
      });
    }

    const logWaterButtons = [$("logWaterBtn"), $("logWaterBtn2")];
    logWaterButtons.forEach((button) => {
      if (!button) return;
      button.addEventListener("click", () => {
        state.water.consumed = Number((state.water.consumed + 0.25).toFixed(2));
        addActivityLog("+250 ml suv");
        persist();
        updateDashboard();
      });
    });

    const resetDay = $("resetDayBtn");
    if (resetDay) {
      resetDay.addEventListener("click", () => {
        state.steps.count = 0;
        state.water.consumed = 0;
        state.calories.consumed = 0;
        addActivityLog("Kundalik ko'rsatkichlar qayta tiklandi");
        persist();
        updateDashboard();
      });
    }
  }

  function initTheme() {
    document.body.classList.toggle("dark", state.settings.theme === "dark");
    const modeToggle = $("modeToggle");
    if (modeToggle) {
      modeToggle.textContent = state.settings.theme === "dark" ? "Yorug' rejim" : "Qorong'i rejim";
    }
  }

  function init() {
    syncDaily();
    initTheme();
    updateMotivation();
    initCalculator();
    initSteps();
    initExercises();
    initVideos();
    initFood();
    initChat();
    initProgress();
    initOffline();
    initObserver();
    bindShortcuts();
    renderSavedFoods();
    renderExercises();
    renderVideoLibrary();
    updateDashboard();
  }

  document.addEventListener("DOMContentLoaded", init);
})();







