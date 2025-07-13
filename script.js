const form = document.getElementById("reminderForm");
const list = document.getElementById("reminderList");
const alarmSound = new Audio("Morning Alarm Tone _ Free Download _ Nature And Birds Sounds _ MUSIC COLORS.mp3");
const stopAlarmBtn = document.getElementById("stopAlarmBtn");

let reminders = JSON.parse(localStorage.getItem("reminders")) || [];

// Ask notification permission
Notification.requestPermission();

// Initial render
renderReminders();
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const patientName = document.getElementById("patientName").value.trim();
  const patientAge = parseInt(document.getElementById("patientAge").value.trim());
  const medName = document.getElementById("medName").value.trim();
  const medTime = document.getElementById("medTime").value;

  if (!patientName || isNaN(patientAge) || patientAge <= 0 || !medName || !medTime) {
    alert("Please enter valid patient details. Age must be a positive number.");
    return;
  }

  reminders.push({ patientName, patientAge, medName, medTime });
  localStorage.setItem("reminders", JSON.stringify(reminders));
  renderReminders();
  form.reset();
});

function renderReminders() {
  list.innerHTML = "";

  reminders.forEach((reminder, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        🤵 <strong>${reminder.patientName}</strong> (Age: ${reminder.patientAge})<br>
        💊 ${reminder.medName} at 🕐 ${reminder.medTime}
      </div>
      <div>
        <button onclick="editReminder(${index})">✏️</button>
        <button onclick="removeReminder(${index})">❌</button>
      </div>
    `;
    list.appendChild(li);
  });
}

function removeReminder(index) {
  reminders.splice(index, 1);
  localStorage.setItem("reminders", JSON.stringify(reminders));
  renderReminders();
}

// Edit reminder
function editReminder(index) {
  const li = list.children[index];
  const reminder = reminders[index];

  li.innerHTML = `
    <div>
      🤵 <input type="text" id="editName${index}" value="${reminder.patientName}" /> <br>
      🔢 <input type="number" id="editAge${index}" value="${reminder.patientAge}" /><br>
      💊 <input type="text" id="editMed${index}" value="${reminder.medName}" />
      <br>🕐 <input type="time" id="editTime${index}" value="${reminder.medTime}" />
    </div>
    <div style="margin-top: 10px;">
      <button onclick="saveReminder(${index})">✅ Save</button>
      <button onclick="renderReminders()">❌ Cancel</button>
    </div>
  `;
}


let triggeredReminders = [];

setInterval(() => {
  const now = new Date();

  reminders.forEach((reminder) => {
    const reminderTime = new Date(reminder.medTime);
    const key = `${reminder.patientName}-${reminder.medName}-${reminder.medTime}`;

    // Match year, month, day, hour, and minute
    const isSameMinute =
      now.getFullYear() === reminderTime.getFullYear() &&
      now.getMonth() === reminderTime.getMonth() &&
      now.getDate() === reminderTime.getDate() &&
      now.getHours() === reminderTime.getHours() &&
      now.getMinutes() === reminderTime.getMinutes();

    if (isSameMinute && !triggeredReminders.includes(key)) {
      triggeredReminders.push(key);
      notifyUser(reminder.patientName, reminder.medName);
    }

    // Reset triggers if time has passed
    const nowMinusOneMin = new Date(now.getTime() - 60000);
    if (reminderTime < nowMinusOneMin) {
      triggeredReminders = triggeredReminders.filter(k => k !== key);
    }
  });
}, 1000); // Check every second

function notifyUser(patientName, medicineName) {
  if (Notification.permission === "granted") {
    new Notification(`💊 ${patientName}, it's time to take ${medicineName}!`);
  }

  alarmSound.currentTime = 0;
  alarmSound.play();
  stopAlarmBtn.style.display = "block";
}

stopAlarmBtn.addEventListener("click", () => {
  alarmSound.pause();
  alarmSound.currentTime = 0;
  stopAlarmBtn.style.display = "none";
});

// new function 
function saveReminder(index) {
  const updatedName = document.getElementById(`editName${index}`).value.trim();
  const updatedAge = parseInt(document.getElementById(`editAge${index}`).value.trim());
  const updatedMed = document.getElementById(`editMed${index}`).value.trim();
  const updatedTime = document.getElementById(`editTime${index}`).value;

  if (!updatedName || isNaN(updatedAge) || updatedAge <= 0 || !updatedMed || !updatedTime) {
    alert("Please enter valid patient details. Age must be a positive number.");
    return;
  }

  reminders[index] = {
    patientName: updatedName,
    patientAge: updatedAge,
    medName: updatedMed,
    medTime: updatedTime
  };
  localStorage.setItem("reminders", JSON.stringify(reminders));
  renderReminders();
}

