const form = document.getElementById("reminderForm");
const list = document.getElementById("reminderList");
const alarmSound = new Audio("Morning Alarm Tone _ Free Download _ Nature And Birds Sounds _ MUSIC COLORS.mp3");

const stopAlarmBtn = document.getElementById("stopAlarmBtn");


let reminders = JSON.parse(localStorage.getItem("reminders")) || [];

// Ask for notification permission on load
Notification.requestPermission();

// Load existing reminders
renderReminders();

// Add new reminder
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("medName").value.trim();
  const time = document.getElementById("medTime").value;

  if (name && time) {
    reminders.push({ name, time });
    localStorage.setItem("reminders", JSON.stringify(reminders));
    renderReminders();
    form.reset();
  }
});

// Render reminders on the page
function renderReminders() {
  list.innerHTML = "";
  reminders.forEach((reminder, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>💊 ${reminder.name} at ${reminder.time}</span>
      <button onclick="removeReminder(${index})">❌</button>
    `;
    list.appendChild(li);
  });
}

// Remove reminder
function removeReminder(index) {
  reminders.splice(index, 1);
  localStorage.setItem("reminders", JSON.stringify(reminders));
  renderReminders();
}

// Check reminders every minute
let triggeredReminders = [];

setInterval(() => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"

  reminders.forEach((reminder) => {
    const key = `${reminder.name}-${reminder.time}`;

    if (reminder.time === currentTime && !triggeredReminders.includes(key)) {
      triggeredReminders.push(key);
      notifyUser(reminder.name);
    }

    // Clear triggered list every minute
    if (!reminder.time.startsWith(currentTime)) {
      triggeredReminders = triggeredReminders.filter(k => k !== key);
    }
  });
}, 1000); // Check every second

  

// Notify user
function notifyUser(medicineName) {
    try {
      if (Notification.permission === "granted") {
        new Notification(`💊 Time to take: ${medicineName}`);
      }
    } catch (e) {
      console.log("Notification error:", e);
    }
  
    try {
      alarmSound.currentTime = 0;
      alarmSound.play();
      stopAlarmBtn.style.display = "block";
    } catch (e) {
      console.log("Audio error:", e);
    }
  }
  stopAlarmBtn.addEventListener("click", () => {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    stopAlarmBtn.style.display = "none";
  });
  
  

// Alarm Alert
function notifyUser(medicineName) {
    if (Notification.permission === "granted") {
      new Notification(`💊 Time to take: ${medicineName}`);
    }
  
    alarmSound.currentTime = 0;
    alarmSound.play();
  
    // Show "Stop Alarm" button
    stopAlarmBtn.style.display = "block";
  }
  
  
  
