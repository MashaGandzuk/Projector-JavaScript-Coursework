"use strict";

// ---------- Constants ----------

const DateDiffUnit = {
  days: "days",
  hours: "hours",
  minutes: "minutes",
  seconds: "seconds"
}

const DaysOfWeek = {
  allDays: "all days",
  weekDays: "weekdays",
  weekEnds: "weekends"
}

const startDateInput = document.getElementById("start-date");
const endDateInput = document.getElementById("end-date");
const daysOfWeekFieldset = document.getElementById("days-of-week-options");
const diffUnitFieldset = document.getElementById("diff-unit-options");
const datesResultSpan = document.querySelector("#dates-result span");
const historyToggler = document.getElementById("dates-history-toggler");
const historyContent = document.getElementById("dates-history-content");
const historyTableBody = historyContent.querySelector("table tbody");
const localStorageHistoryKey = "datesHistory";

// ---------- Functions ----------

function updateEndDateInputIsEnabled() {
  endDateInput.disabled = startDateInput.value === '';
}

function updateDateInputsMinMax() {
  if (startDateInput.value !== '') {
    endDateInput.setAttribute('min', startDateInput.value);
  }
  if (endDateInput.value !== '') {
    startDateInput.setAttribute('max', endDateInput.value);
  }
}

function updateDateInputValue(input, date) {
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  input.value = `${date.getFullYear()}-${month}-${day}`
  input.dispatchEvent(new Event('change'));
}

function pushToHistory(startDate, endDate, result) {
  var data = JSON.parse(localStorage.getItem(localStorageHistoryKey) || "[]");
  data.unshift({ startDate: startDate, endDate: endDate, result: result });
  if (data.length > 10) {
    data.pop();
  }
  localStorage.setItem(localStorageHistoryKey, JSON.stringify(data));
}

function renderHistory() {
  var data = JSON.parse(localStorage.getItem(localStorageHistoryKey) || "[]");
  if (data.length === 0) {
    return;
  }

  var html = "";
  data.forEach((row) => {
    const startDate = new Date(row.startDate);
    const endDate = new Date(row.endDate);
    html += `<tr>`;
    html += `<td>${startDate.toLocaleDateString()}</td>`;
    html += `<td>${endDate.toLocaleDateString()}</td>`;
    html += `<td>${row.result}</td>`;
    html += `</tr>`;
  });
  historyTableBody.innerHTML = html;
}

function populateOptions() {
  var html = "";
  var i = 0;
  Object.keys(DateDiffUnit).forEach((key) => {
    const value = DateDiffUnit[key];
    html += `<div>`
    html += `<input type="radio" name="diffUnit" id="diff-unit-${key}" value="${value}" ${i === 0 ? "checked" : ""}/>`
    html += `<label for="diff-unit-${key}">${value}</label>`
    html += `</div>`
    i += 1;
  });
  diffUnitFieldset.innerHTML += html;

  html = "";
  i = 0;
  Object.keys(DaysOfWeek).forEach((key) => {
    const value = DaysOfWeek[key];
    html += `<div>`
    html += `<input type="radio" name="daysOfWeek" id="days-of-week-${key}" value="${value}" ${i === 0 ? "checked" : ""}/>`
    html += `<label for="days-of-week-${key}">${value}</label>`
    html += `</div>`
    i += 1;
  });
  daysOfWeekFieldset.innerHTML += html;
}

function calcDateDiff() {
  if (startDateInput.value === '' || endDateInput.value === '') {
    datesResultSpan.textContent = "—";
    return
  }

  const startDate = new Date(startDateInput.value);
  const endDate = new Date(endDateInput.value);
  const daysOfWeek = document.querySelector('input[name="daysOfWeek"]:checked').value;
  const diffUnit = document.querySelector('input[name="diffUnit"]:checked').value;

  var daysDiff = 0;
  var currentDate = new Date(startDate);
  // Loop over each day between the start and end and check if it should be included.
  while (currentDate < endDate) {
    const currentDayOfWeek = currentDate.getDay();
    switch (daysOfWeek) {
      case DaysOfWeek.allDays:
        daysDiff += 1;
        break;
      case DaysOfWeek.weekDays:
        daysDiff += (currentDayOfWeek >= 1 && currentDayOfWeek <= 5) ? 1 : 0;
        break;
      case DaysOfWeek.weekEnds:
        daysDiff += (currentDayOfWeek === 0 || currentDayOfWeek === 6) ? 1 : 0;
        break;
      default:
        console.log('Error: unknown day of week type "' + daysOfWeek + '"');
        break;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  var result;
  switch (diffUnit) {
    case DateDiffUnit.days:
      result = `${daysDiff} ${diffUnit}`;
      break;
    case DateDiffUnit.hours:
      result = `${daysDiff * 24} ${diffUnit}`;
      break;
    case DateDiffUnit.minutes:
      result = `${daysDiff * 24 * 60} ${diffUnit}`;
      break;
    case DateDiffUnit.seconds:
      result = `${daysDiff * 24 * 60 * 60} ${diffUnit}`;
      break;
    default:
      console.log('Error: unknown diff unit "' + diffUnit + '"');
      break;
  }

  datesResultSpan.textContent = result;
  pushToHistory(startDate, endDate, result);
  renderHistory();
}

populateOptions();
renderHistory();

// ---------- Event listeners -----------

startDateInput.addEventListener("change", function () {
  updateEndDateInputIsEnabled();
  updateDateInputsMinMax();
  calcDateDiff();
});

endDateInput.addEventListener("change", function () {
  updateDateInputsMinMax();
  calcDateDiff();
});

document.querySelectorAll('input[name="daysOfWeek"], input[name="diffUnit"]').forEach((input) => {
  input.addEventListener('change', calcDateDiff);
});

document.getElementById("end-date-helper-week").addEventListener("click", function (event) {
  event.preventDefault();
  if (startDateInput.value === '') {
    return
  }

  const newEndDate = new Date(startDateInput.value);
  newEndDate.setDate(newEndDate.getDate() + 7);
  updateDateInputValue(endDateInput, newEndDate)
});

document.getElementById('end-date-helper-month').addEventListener("click", function (event) {
  event.preventDefault();
  if (startDateInput.value === '') {
    return
  }

  const newEndDate = new Date(startDateInput.value);
  newEndDate.setDate(newEndDate.getDate() + 30);
  updateDateInputValue(endDateInput, newEndDate)
});

historyToggler.addEventListener("click", function () {
  historyToggler.classList.toggle("active");
  historyContent.classList.toggle("visible");
});