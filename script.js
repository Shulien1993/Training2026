// SUPABASE CONNECTION

const SUPABASE_URL = "https://mebnvbaglydeegzfjotz.supabase.co";
const SUPABASE_KEY = "sb_publishable_vlA-cs_kUFXtN0AZ5fGNZA_6hc7VWHV";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// SUPABASE AUTHENTICATION

async function loginToSupabase() {
    const { data: { session }, error: sessionError } =
        await supabaseClient.auth.getSession();

    if (sessionError) {
        console.error("Kunde inte kontrollera inloggningen:", sessionError);
        return false;
    }

    // Redan inloggad
    if (session) {
        return true;
    }

    // Första inloggningen på enheten
    const email = prompt("Ange din e-postadress:");
    if (!email) return false;

    const password = prompt("Ange ditt lösenord:");
    if (!password) return false;

    const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        console.error("Inloggningen misslyckades:", error);
        alert("Kunde inte logga in. Kontrollera dina uppgifter.");
        return false;
    }

    console.log("Inloggad i Supabase!");
    return true;
}

const contentArea = document.getElementById("contentArea");
const workoutPanel = document.getElementById("workoutPanel");
const sectionTitle = document.getElementById("sectionTitle");
const backBtn = document.getElementById("backBtn");
const completeWorkoutBtn = document.getElementById("completeWorkoutBtn");

const personalBest = document.getElementById("personalBest");
const completedWorkouts = document.getElementById("completedWorkouts");
const currentView = document.getElementById("currentView");
const personalBestLabel = document.getElementById("personalBestLabel");

const intervalStatCard = document.getElementById("intervalStatCard");
const intervalBest = document.getElementById("intervalBest");
const intervalBestLabel = document.getElementById("intervalBestLabel");
const latestRunningTime =
    document.getElementById("latestRunningTime");

const latestIntervalTime =
    document.getElementById("latestIntervalTime");

const completedWorkoutsLabel =
    document.getElementById("completedWorkoutsLabel");

const tabButtons = document.querySelectorAll(".tab-btn");

let activeWorkout = "Alla";
let activeExercise = null;

let workoutCount = JSON.parse(localStorage.getItem("workoutCount")) || {
    Rygg: 10,
    Ben: 0,
    Bröst: 0,
    Axlar: 0,
    Armar: 0,
    Kondition: 0
};

let completedSets = JSON.parse(localStorage.getItem("completedSets")) || {};
let runningSessions = JSON.parse(localStorage.getItem("runningSessions")) || [];

const workoutTemplates = {
    Rygg: {
        "Deadlift ( Barbell )": {
            repTarget: "4 - 6",
            setTarget: "3 - 4",
            sets: [
                { set: 1, weight: 105, reps: 6 },
                { set: 2, weight: 105, reps: 6 },
                { set: 3, weight: 105, reps: 4 }
            ]
        },

                "Chin Ups ( Bodyweight )": {
            repTarget: "6 - 10",
            setTarget: "1 - 4",
            sets: [
                { set: 1, weight: "BW", reps: 6 },
                { set: 2, weight: "BW", reps: 6 },
                { set: 3, weight: "BW", reps: 6 },
                { set: 3, weight: "BW", reps: 6 }
            ]
        },

                "Barbell Bent Over Row": {
            repTarget: "6 - 10",
            setTarget: "3 - 4",
            sets: [
                { set: 1, weight: 42.5, reps: 10 },
                { set: 2, weight: 42.5, reps: 10 },
                { set: 3, weight: 42.5, reps: 7 }
            ]
        },

        "Single Arm Row ( Dumbbell )": {
            repTarget: "10 - 15",
            setTarget: "1 - 3",
            sets: [
                { set: 1, weight: 20, reps: 15 },
                { set: 2, weight: 20, reps: 15 },
                { set: 3, weight: 20, reps: 14 }
            ]
        },

        "Neck Extensions": {
            repTarget: "15 - 25",
            setTarget: "1 - 3",
            sets: [
                { set: 1, weight: 1.25, reps: 22 },
                { set: 2, weight: 1.25, reps: 17 },
                { set: 3, weight: 1.25, reps: 15 }
            ]
        }
    },

    Ben: {
        "Squat ( Barbell )": {
            repTarget: "4 - 6",
            setTarget: "3 - 4",
            sets: [
                { set: 1, weight: 102.5, reps: 6 },
                { set: 2, weight: 102.5, reps: 5 },
                { set: 3, weight: 102.5, reps: 5 }
            ]
        },

        "Leg Press": {
            repTarget: "8 - 10",
            setTarget: "3 - 4",
            sets: [
                { set: 1, weight: 32.5, reps: 10 },
                { set: 2, weight: 32.5, reps: 10 },
                { set: 3, weight: 32.5, reps: 10 }
            ]
        },

        "Hamstring": {
            repTarget: "6 - 8",
            setTarget: "1 - 3",
            sets: [
                { set: 1, weight: 32.5, reps: 10 },
                { set: 2, weight: 32.5, reps: 9 },
                { set: 3, weight: 32.5, reps: 9 }
            ]
        },

        "Romanian Deadlift ( Barbell )": {
            repTarget: "6 - 8",
            setTarget: "3 - 4",
            sets: [
                { set: 1, weight: 60, reps: 6 },
                { set: 2, weight: 60, reps: 6 },
                { set: 3, weight: 60, reps: 6 }
            ]
        },

        "Calf Raises": {
            repTarget: "10 - 15",
            setTarget: "1 - 3",
            sets: [
                { set: 1, weight: 20, reps: 15 },
                { set: 2, weight: 20, reps: 15 },
                { set: 3, weight: 20, reps: 15 }
            ]
        },

        "Neck Extensions": {
            repTarget: "15 - 25",
            setTarget: "1 - 3",
            sets: [
                { set: 1, weight: 1.25, reps: 17 },
                { set: 2, weight: 1.25, reps: 16 },
                { set: 3, weight: 1.25, reps: 15 }
            ]
        }
    },
    Axlar: {
        "Shoulder Press ( Barbell )": {
            repTarget: "4 - 8",
            setTarget: "1 - 4",
            sets: [
                { set: 1, weight: 42.5, reps: 8 },
                { set: 2, weight: 42.5, reps: 5 },
                { set: 3, weight: 42.5, reps: 4 },
                { set: 4, weight: 42.5, reps: 4 }
            ]
        },

        "Lateral Raises": {
            repTarget: "12 - 20",
            setTarget: "1 - 4",
            sets: [
                { set: 1, weight: 10, reps: 20 },
                { set: 2, weight: 10, reps: 20 },
                { set: 3, weight: 10, reps: 20 },
                { set: 4, weight: 10, reps: 17 }
            ]
        },

        "Reverse Flyes": {
            repTarget: "15 - 25",
            setTarget: "1 - 3",
            sets: [
                { set: 1, weight: 5, reps: 16 },
                { set: 2, weight: 5, reps: 15 },
                { set: 3, weight: 5, reps: 15 }
            ]
        },

        "Shrugs ( Barbell )": {
            repTarget: "12 - 20",
            setTarget: "1 - 3",
            sets: [
                { set: 1, weight: 62.5, reps: 14 },
                { set: 2, weight: 62.5, reps: 12 },
                { set: 3, weight: 62.5, reps: 12 }
            ]
        },

        "Side Plank": {
            repTarget: "10 - 14",
            setTarget: "1 - 3",
            sets: [
                { set: 1, weight: "BW", reps: "31 sek" },
                { set: 2, weight: "BW", reps: "30 sek" },
                { set: 3, weight: "BW", reps: "30 sek" }
            ]
        },
    },
    Armar: {
        "Barbell Curl": {
            repTarget: "6 - 8",
            setTarget: "3 - 4",
            sets: [
                { set: 1, weight: 42.5, reps: 8 },
                { set: 2, weight: 42.5, reps: 7 },
                { set: 3, weight: 42.5, reps: 7 },
                { set: 4, weight: 42.5, reps: 7 }
            ]
        },

        "Hammer Curls ( Dumbells )": {
            repTarget: "8 - 12",
            setTarget: "1 - 3",
            sets: [
                { set: 1, weight: 20, reps: 12 },
                { set: 2, weight: 20, reps: 12 },
                { set: 3, weight: 20, reps: 12 }
            ]
        },

        "Bench Triceps Push ( Barbell )": {
            repTarget: "8 - 12",
            setTarget: "1 - 3",
            sets: [
                { set: 1, weight: 42.5, reps: 10 },
                { set: 2, weight: 42.5, reps: 9 },
                { set: 3, weight: 42.5, reps: 9 }
            ]
        },

        "Hanging Leg Raises": {
            repTarget: "8 - 12",
            setTarget: "1 - 3",
            sets: [
                { set: 1, weight: 1.25, reps: 10 },
                { set: 2, weight: 1.25, reps: 9 },
                { set: 3, weight: 1.25, reps: 9 }
            ]
        },
    },
    Bröst: {
        "Bench Press ( Barbell )": {
            repTarget: "4 - 6",
            setTarget: "2 - 4",
            sets: [
                { set: 1, weight: 62.5, reps: 6 },
                { set: 2, weight: 62.5, reps: 6 },
                { set: 3, weight: 62.5, reps: 6 },
                { set: 4, weight: 62.5, reps: 4 }
            ]
        },

        "Incline Bench Press ( Barbell )": {
            repTarget: "8 - 10",
            setTarget: "2 - 4",
            sets: [
                { set: 1, weight: 62.5, reps: 10 },
                { set: 2, weight: 62.5, reps: 10 },
                { set: 3, weight: 62.5, reps: 10 },
                { set: 4, weight: 62.5, reps: 8 }
            ]
        },

        "Decline Bench Press ( Barbell )": {
            repTarget: "6 - 8",
            setTarget: "1 - 3",
            sets: [
                { set: 1, weight: 65, reps: 6 },
                { set: 2, weight: 65, reps: 6 },
                { set: 3, weight: 65, reps: 6 }
            ]
        },

        "Pullover ( Dumbell )": {
            repTarget: "10 - 12",
            setTarget: "1 - 3",
            sets: [
                { set: 1, weight: 20, reps: 12 },
                { set: 2, weight: 20, reps: 12 },
                { set: 3, weight: 20, reps: 12 }
            ]
        },

        "Chest Flyes ( Dumbell )": {
            repTarget: "12 - 15",
            setTarget: "1 - 3",
            sets: [
                { set: 1, weight: 15, reps: 15 },
                { set: 2, weight: 15, reps: 14 },
                { set: 3, weight: 15, reps: 13 }
            ]
        },

        "Abs Wheel Rollout": {
            repTarget: "11 - 16",
            setTarget: "1 - 3",
            sets: [
                { set: 1, weight: "BW", reps: 16 },
                { set: 2, weight: "BW", reps: 16 },
                { set: 3, weight: "BW", reps: 16 }
            ]
        },
    },
    Kondition: {},

};

tabButtons.forEach(button => {
    button.addEventListener("click", function () {
        tabButtons.forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");

        activeWorkout = this.dataset.workout;
        activeExercise = null;

        renderPage();
    });
});

backBtn.addEventListener("click", function () {
    activeExercise = null;
    renderPage();
});

completeWorkoutBtn.addEventListener("click", function () {
    if (activeWorkout === "Alla") {
        return;
    }

    workoutCount[activeWorkout]++;

    saveWorkoutCount();
    updateStats();

    completeWorkoutBtn.textContent = `${activeWorkout}pass klart`;
    completeWorkoutBtn.classList.add("done");

    setTimeout(() => {
        completeWorkoutBtn.textContent = "Markera pass klart";
        completeWorkoutBtn.classList.remove("done");
    }, 1200);
});

function renderPage() {
    updateCompleteWorkoutButton();

    currentView.textContent = activeWorkout;

    if (activeWorkout === "Alla") {
        renderAllView();
        updateStats();
        return;
    }

    workoutPanel.classList.remove("hidden");

    if (activeWorkout === "Kondition") {
        renderConditionView();
        updateStats();
        return;
    }

    if (activeExercise) {
        renderExerciseDetail();
        updateStats();
        return;
    }

    renderWorkoutView();
    updateStats();
}

function renderAllView() {
    workoutPanel.classList.add("hidden");
    backBtn.classList.add("hidden");
    contentArea.innerHTML = "";
}

function renderWorkoutView() {
    backBtn.classList.add("hidden");
    sectionTitle.textContent = `${activeWorkout} - färdiga övningar`;

    const workout = workoutTemplates[activeWorkout];

    if (!workout || Object.keys(workout).length === 0) {
        contentArea.innerHTML = `
            <p class="empty">
                Inga färdiga övningar tillagda för ${activeWorkout} ännu.
            </p>
        `;
        return;
    }

    contentArea.innerHTML = "";

    const grid = document.createElement("div");
    grid.classList.add("exercise-grid");

    Object.keys(workout).forEach(exerciseName => {
        const card = document.createElement("article");
        card.classList.add("exercise-card");

        card.innerHTML = `
            <h3>${exerciseName}</h3>
            <p>Klicka för att öppna set, vikt och reps.</p>
        `;

        card.addEventListener("click", function () {
            activeExercise = exerciseName;
            renderPage();
        });

        grid.appendChild(card);
    });

    contentArea.appendChild(grid);
}

function renderConditionView() {
    backBtn.classList.add("hidden");
    sectionTitle.textContent = "Kondition - 5 km";

    contentArea.innerHTML = `

        <div class="running-card">
            <div class="running-form">

                <div>
                    <label>Träningstyp</label>
                    <select id="runningType">
                        <option value="Löpning">Löpning</option>
                        <option value="Intervall">Intervall</option>
                    </select>
                </div>

                <div>
                    <label>Område</label>
                    <select id="runningLocation">
                        <option value="Enköping">Enköping</option>
                        <option value="Bålsta">Bålsta</option>
                        <option value="Sala">Sala</option>
                    </select>
                </div>

                <div>
                    <label>Distans</label>
                    <input type="text" value="5 km" disabled>
                </div>

                <div>
                    <label>Tid</label>
                    <input
                        type="text"
                        id="runningTime"
                        placeholder="Ex: 33:58"
                    >
                </div>

                <div>
                    <label>Datum</label>
                    <input
                        type="date"
                        id="runningDate"
                        value="${getTodayDateKey()}"
                    >
                </div>

                <button id="saveRunningBtn" type="button">
                    Spara löpning
                </button>
            </div>

            <div id="runningHistory" class="running-history"></div>
        </div>
    `;

    const runningType = document.getElementById("runningType");
    const saveRunningBtn = document.getElementById("saveRunningBtn");

    runningType.addEventListener("change", function () {
        saveRunningBtn.textContent =
            this.value === "Intervall"
                ? "Spara intervallpass"
                : "Spara löpning";
    });

    saveRunningBtn.addEventListener("click", saveRunningSession);

    renderRunningHistory();
}

function renderExerciseDetail() {
    backBtn.classList.remove("hidden");
    sectionTitle.textContent = activeExercise;

    const exerciseData = workoutTemplates[activeWorkout][activeExercise];
    const sets = exerciseData.sets;

    contentArea.innerHTML = "";

    const targetBox = document.createElement("div");
    targetBox.classList.add("target-box");

    targetBox.innerHTML = `
    <div>
        <span>Set target</span>
        <strong>${exerciseData.setTarget}</strong>
    </div>

        <div>
        <span>Rep target</span>
        <strong>${exerciseData.repTarget}</strong>
    </div>
`;

    contentArea.appendChild(targetBox);

    const list = document.createElement("div");
    list.classList.add("set-list");

    sets.forEach(setData => {
        const setId = `${activeWorkout}-${activeExercise}-set-${setData.set}`;
        const isDone = completedSets[setId];

        const card = document.createElement("article");
        card.classList.add("set-card");

        card.innerHTML = `
            <div class="set-number">Set ${setData.set}</div>

<div>
    <strong>
        ${setData.weight === "BW"
                ? "BW"
                : `${setData.weight.toString().replace(".", ",")} kg`}
    </strong>

    <p>
        ${setData.weight === "BW"
                ? "Kroppsvikt"
                : "Vikt"}
    </p>
</div>

            <div>
                <strong>${setData.reps}</strong>
                <p>Reps</p>
            </div>

            <button class="done-btn ${isDone ? "done" : ""}" data-set-id="${setId}">
                ${isDone ? "Klar" : "Markera klar"}
            </button>
        `;

        list.appendChild(card);
    });

    contentArea.appendChild(list);

    document.querySelectorAll(".done-btn").forEach(button => {
        button.addEventListener("click", function () {
            const setId = this.dataset.setId;

            completedSets[setId] = !completedSets[setId];

            if (!completedSets[setId]) {
                delete completedSets[setId];
            }

            saveCompletedSets();
            renderPage();
        });
    });
}

function updateStats() {
    const doneSetIds = Object.keys(completedSets);

    let bestWeight = 0;

if (activeWorkout === "Kondition") {
    const bestRun = getBestRunningTime("Löpning");
    const bestInterval = getBestRunningTime("Intervall");

    intervalStatCard.classList.remove("hidden");

    personalBest.textContent =
        bestRun || "Ingen tid";

    intervalBest.textContent =
        bestInterval || "Ingen tid";

    completedWorkouts.textContent =
        runningSessions.length;

    completedWorkoutsLabel.textContent =
        "Pass gjorda";

    return;
}

    intervalStatCard.classList.add("hidden");

    personalBestLabel.textContent = "Löpning - Personbästa";
    completedWorkoutsLabel.textContent = "Pass gjorda";

    doneSetIds.forEach(id => {
        const setData = findSetById(id);

        if (setData && typeof setData.weight === "number") {
            if (setData.weight > bestWeight) {
                bestWeight = setData.weight;
            }
        }
    });

    personalBest.textContent = `${bestWeight} kg`;

    if (activeWorkout === "Alla") {
        const totalPasses =
            workoutCount.Rygg +
            workoutCount.Ben +
            workoutCount.Bröst +
            workoutCount.Axlar +
            workoutCount.Armar +
            workoutCount.Kondition;

        completedWorkouts.textContent = totalPasses;
    } else {
        completedWorkouts.textContent =
            workoutCount[activeWorkout] || 0;
    }
}

function findSetById(id) {
    for (const workoutName in workoutTemplates) {
        const workout = workoutTemplates[workoutName];

        for (const exerciseName in workout) {
            const sets = workout[exerciseName].sets;

            for (const setData of sets) {
                const currentId = `${workoutName}-${exerciseName}-set-${setData.set}`;

                if (currentId === id) {
                    return setData;
                }
            }
        }
    }

    return null;
}

function saveCompletedSets() {
    localStorage.setItem("completedSets", JSON.stringify(completedSets));
    saveToSupabase();
}

function saveWorkoutCount() {
    localStorage.setItem("workoutCount", JSON.stringify(workoutCount));
    saveToSupabase();
}

function saveRunningSessions() {
    localStorage.setItem(
        "runningSessions",
        JSON.stringify(runningSessions)
    );

    saveToSupabase();
}

function updateCompleteWorkoutButton() {
    if (activeWorkout === "Alla" || activeWorkout === "Kondition") {
        completeWorkoutBtn.classList.add("hidden");
        return;
    }

    completeWorkoutBtn.classList.remove("hidden");
    completeWorkoutBtn.textContent = `Markera ${activeWorkout.toLowerCase()}pass klart`;
}

function saveRunningSession() {
    const typeElement = document.getElementById("runningType");
    const locationElement = document.getElementById("runningLocation");
    const timeElement = document.getElementById("runningTime");
    const dateElement = document.getElementById("runningDate");

    if (
        !typeElement ||
        !locationElement ||
        !timeElement ||
        !dateElement
    ) {
        console.error("Konditionsformulärets fält kunde inte hittas.");
        return;
    }

    const type = typeElement.value;
    const location = locationElement.value;
    const time = timeElement.value.trim();
    const date = dateElement.value;

    if (!time || !date) {
        alert("Fyll i både tid och datum.");
        return;
    }

    if (!isValidRunningTime(time)) {
        alert(
            "Skriv tiden som minuter:sekunder, till exempel 33:58."
        );
        return;
    }

    const session = {
        id: Date.now(),
        type,
        location,
        distance: "5 km",
        time,
        date
    };

    runningSessions.unshift(session);

    saveRunningSessions();

    // Uppdatera konditionssidan direkt.
    renderConditionView();
    updateStats();
}

function renderRunningHistory() {

    const runningHistory = document.getElementById("runningHistory");

    if (!runningHistory) {
        return;
    }

    if (runningSessions.length === 0) {
        runningHistory.innerHTML = `
            <p class="empty">Inga löppass sparade ännu.</p>
        `;
        return;
    }

    runningHistory.innerHTML = "";

    runningSessions.forEach(session => {
        const item = document.createElement("div");
        item.classList.add("running-item");

        item.innerHTML = `
<div>
    <strong>${session.type || "Löpning"}</strong>
    <p>${session.location} • ${session.date}</p>
</div>

    <div class="running-actions">
        <div>
            <strong>${session.time}</strong>
            <p>${session.distance}</p>
        </div>

        <button class="delete-run-btn"
            onclick="deleteRunningSession(${session.id})">
            Ta bort
        </button>
    </div>
`;

        runningHistory.appendChild(item);
    });
}

function getTodayDateKey() {
    const today = new Date();
    return today.toISOString().split("T")[0];
}

function getLatestRunningTime(trainingType) {
    const matchingSessions = runningSessions.filter(session => {
        const sessionType = session.type || "Löpning";

        return sessionType === trainingType;
    });

    if (matchingSessions.length === 0) {
        return null;
    }

    return matchingSessions[0].time;
}

function getBestRunningTime(trainingType) {
    const matchingSessions = runningSessions.filter(session => {
        const sessionType = session.type || "Löpning";
        return sessionType === trainingType;
    });

    if (matchingSessions.length === 0) {
        return null;
    }

    return matchingSessions
        .map(session => session.time)
        .sort((a, b) => {
            return convertTimeToSeconds(a) - convertTimeToSeconds(b);
        })[0];
}

function isValidRunningTime(time) {
    const timePattern = /^\d{1,3}:[0-5]\d$/;

    if (!timePattern.test(time)) {
        return false;
    }

    return convertTimeToSeconds(time) > 0;
}

function convertTimeToSeconds(time) {
    const parts = time.split(":").map(Number);

    if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
    }

    if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }

    return 999999;
}

localStorage.setItem("workoutCount", JSON.stringify(workoutCount));
saveRunningSessions();

renderPage();

window.deleteRunningSession = deleteRunningSession;

// HÄMTA TRÄNINGSDATA FRÅN SUPABASE

async function loadFromSupabase() {

    const { data: { user }, error: userError } =
        await supabaseClient.auth.getUser();

    if (userError || !user) {
        console.error("Kunde inte identifiera användaren:", userError);
        return false;
    }

    const { data, error } = await supabaseClient
        .from("workout_data")
        .select("completed_sets, workout_count, running_sessions")
        .eq("user_id", user.id)
        .maybeSingle();

    if (error) {
        console.error("Kunde inte hämta träningsdata:", error);
        return false;
    }

    // Finns ingen data i Supabase ännu?
    if (!data) {
        console.log("Ingen träningsdata finns i Supabase ännu.");
        return true;
    }

    // Uppdatera våra JavaScript-variabler
    completedSets = data.completed_sets || {};
    workoutCount = data.workout_count || {};
    runningSessions = data.running_sessions || [];

    // Spara även lokalt som en extra kopia
    localStorage.setItem(
        "completedSets",
        JSON.stringify(completedSets)
    );

    localStorage.setItem(
        "workoutCount",
        JSON.stringify(workoutCount)
    );

    localStorage.setItem(
        "runningSessions",
        JSON.stringify(runningSessions)
    );

    console.log("Träningsdata hämtad från Supabase!");

    return true;
}

// SPARA TRÄNINGSDATA TILL SUPABASE

async function saveToSupabase() {

    const { data: { user }, error: userError } =
        await supabaseClient.auth.getUser();

    if (userError || !user) {
        console.error("Ingen inloggad användare:", userError);
        return false;
    }

    const { error } = await supabaseClient
        .from("workout_data")
        .upsert({
            user_id: user.id,
            completed_sets: completedSets,
            workout_count: workoutCount,
            running_sessions: runningSessions,
            updated_at: new Date().toISOString()
        }, {
            onConflict: "user_id"
        });

    if (error) {
        console.error("Kunde inte spara träningsdata:", error);
        return false;
    }

    console.log("Träningsdata sparad i Supabase!");

    return true;
}

async function initApp() {

    const loggedIn = await loginToSupabase();

    if (!loggedIn) {
        console.error("Kunde inte logga in på Supabase.");
        return;
    }

    const loaded = await loadFromSupabase();

    if (!loaded) {
        console.error("Kunde inte hämta träningsdata.");
        return;
    }

    renderPage();

    console.log("Träningsloggen är synkroniserad!");
}

initApp();
