"use strict";

// ---------- Constants ----------

const apiKey = "R3FFIosTE2I6fVNY5ZVEW8d4nqhYaIft";
const url = "https://calendarific.com/api/v2";
const countrySelection = document.querySelector("#country-selection");
const yearSelection = document.querySelector("#year-selection");
const showHolidaysBtn = document.querySelector("#show-holidays-btn");
const holidaysContent = document.getElementById("holidays-content");
const holidaysTableBody = holidaysContent.querySelector("table tbody");
const holidaysTable = document.getElementById("holidays-table");
const sortTableBtn = document.getElementById("sort-table-btn");

let holidaysData = [];

const SortDirection = {
  asc: "ascending",
  desc: "descending",
};

// ---------- Functions ----------

async function showCountries() {
  try {
    const response = await fetch(`${url}/countries?&api_key=${apiKey}`);
    if (!response.ok) {
      throw new Error(`Couldn't fetch countries`);
    }
    if (response.ok) {
      const data = await response.json();
      data.response.countries.forEach((country) => {
        let countryOption = document.createElement("option");
        countryOption.textContent = country.country_name;
        countryOption.value = country["iso-3166"];
        countrySelection.appendChild(countryOption);
      });
      return;
    }
  } catch (e) {
    alert(e.message);
  }
}

function showYears() {
  const currentYear = new Date().getFullYear();

  for (let i = 2001; i <= 2049; i++) {
    let yearsOption = document.createElement("option");
    yearsOption.textContent = i;
    yearsOption.value = i;
    yearSelection.appendChild(yearsOption);
    if (i === currentYear) {
      yearsOption.selected = true;
    }
  }
}

async function showHolidays() {
  const country = countrySelection.value;
  const year = yearSelection.value;

  showHolidaysBtn.disabled = true;
  try {
    const response = await fetch(
      `${url}/holidays?&api_key=${apiKey}&country=${country}&year=${year}`
    );
    if (!response.ok) {
      throw new Error(`Couldn't fetch holidays`);
    }
    if (response.ok) {
      const result = await response.json();

      holidaysData = result.response.holidays.map((item) => {
        return {
          date: new Date(item.date.iso),
          name: item.name,
        };
      });

      renderTable();
    }
  } catch (e) {
    alert(e.message);
  } finally {
    showHolidaysBtn.disabled = false;
  }
}

function renderTable() {
  var html = "";
  holidaysData.forEach((item) => {
    html += `<tr>`;
    html += `<td>${item.date.toLocaleDateString()}</td>`;
    html += `<td>${item.name}</td>`;
    html += `</tr>`;
  });
  holidaysTableBody.innerHTML = html;
}

function sortTable(direction) {
  holidaysData.sort(function (a, b) {
    return direction === SortDirection.asc ? a.date - b.date : b.date - a.date;
  });
}

showCountries();
showYears();

// ---------- Event listeners -----------

countrySelection.addEventListener("change", function () {
  const isCountryNotSelected = countrySelection.value === "";
  yearSelection.disabled = isCountryNotSelected;
  showHolidaysBtn.disabled = isCountryNotSelected;
});

showHolidaysBtn.addEventListener("click", function () {
  showHolidays();
});

sortTableBtn.addEventListener("click", function () {
  sortTableBtn.classList.toggle(SortDirection.asc);
  const newSortDirection = sortTableBtn.classList.contains(SortDirection.asc)
    ? SortDirection.asc
    : SortDirection.desc;
  sortTable(newSortDirection);
  renderTable();
});
