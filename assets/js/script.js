const storageKeyPrefix = "hour";
const currentDaySelector = "#currentDay";
const clockSelector = "#The-clock, #clock";

function formatHourLabel(hour) {
  if (hour === 0) {
    return "12:00 AM";
  }

  if (hour === 12) {
    return "12:00 PM";
  }

  if (hour > 12) {
    return `${hour - 12}:00 PM`;
  }

  return `${hour}:00 AM`;
}

function add24timeBlocksDivs() {
  const container = document.querySelector(".container");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  for (let hour = 0; hour < 24; hour += 1) {
    const timeBlockDiv = document.createElement("div");
    timeBlockDiv.className = "row time-block";
    timeBlockDiv.id = `${storageKeyPrefix}${hour}`;
    timeBlockDiv.dataset.hour = String(hour);

    const displayHourText = document.createElement("div");
    displayHourText.className = "col-md-2 hour";
    displayHourText.textContent = formatHourLabel(hour);

    const textareaInputCell = document.createElement("textarea");
    textareaInputCell.className = "col-md-8 description";
    textareaInputCell.placeholder = "Add a task";

    const columnSaveBtn = document.createElement("button");
    columnSaveBtn.className = "btn saveBtn col-md-2";
    columnSaveBtn.dataset.hour = String(hour);
    columnSaveBtn.setAttribute("aria-label", `Save task for ${formatHourLabel(hour)}`);

    const savebuttonIcon = document.createElement("i");
    savebuttonIcon.className = "fas fa-save";

    columnSaveBtn.appendChild(savebuttonIcon);
    timeBlockDiv.append(displayHourText, textareaInputCell, columnSaveBtn);
    container.appendChild(timeBlockDiv);
  }
}

function loadSavedTasks() {
  $(".time-block").each(function loadBlockText() {
    const blockHour = $(this).data("hour");
    const blockDescription = $(this).children(".description");
    const blockText = localStorage.getItem(`${storageKeyPrefix}${blockHour}`);

    if (blockText !== null) {
      blockDescription.val(blockText);
    }
  });
}

function updateHeaderTime() {
  const momentHelpers = globalThis.schedulerMoment;
  const momentLib = globalThis.moment;

  if (!momentLib) {
    return null;
  }

  const now = momentHelpers?.getCurrentMoment?.() ?? momentLib();
  const currentDayText = momentHelpers?.formatCurrentDay?.(now) ?? now.format("dddd, MMMM D, YYYY");
  const clockText = momentHelpers?.formatClockTime?.(now) ?? now.format("hh:mm:ss:SSS A");

  $(currentDaySelector).text(currentDayText);
  $(clockSelector).text(clockText);
  return now;
}

function timeTracker() {
  const now = updateHeaderTime();

  if (!now) {
    return;
  }

  const timeNow = now.hour();

  $(".time-block").each(function updateBlockState() {
    const blockTime = Number.parseInt($(this).data("hour"), 10);
    $(this).removeClass("past present future");

    if (blockTime < timeNow) {
      $(this).addClass("past");
    } else if (blockTime === timeNow) {
      $(this).addClass("present");
    } else {
      $(this).addClass("future");
    }
  });
}

$(document).ready(() => {
  add24timeBlocksDivs();
  loadSavedTasks();

  $(document).on("click", ".saveBtn", function saveTask() {
    const grabText = $(this).siblings(".description").val();
    const grabTime = $(this).data("hour");
    localStorage.setItem(`${storageKeyPrefix}${grabTime}`, grabText);
  });

  timeTracker();
  setInterval(timeTracker, 0);
});