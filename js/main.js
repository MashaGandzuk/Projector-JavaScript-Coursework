"use strict";

function openTab(tabNumber) {
  // Activate the needed tablink
  document.querySelectorAll(".tablink").forEach((t) => {
    t.className = t.className.replace(" active", "");
  });
  document.getElementById("tablink-" + tabNumber).className += " active";

  // Present the needed tabcontent
  document.querySelectorAll(".tabcontent").forEach((t) => {
    t.style.display = "none";
  });
  document.getElementById("tabcontent-" + tabNumber).style.display = "block";
}

openTab(1);
