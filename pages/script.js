// script.js

document.addEventListener("DOMContentLoaded", function () {
  const board = document.querySelector(".board");
  const board2 = document.querySelector(".board2");
  const resetButton = document.getElementById("resetButton");

  // Define constants for rows and columns
  let N_ROWS = 19;
  let N_COLS = 19;

  // Load data from URL if available
  const loadGameData = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const paramA = urlParams.get("a");
    const paramR = urlParams.get("r");
    const paramC = urlParams.get("c");

    if (paramR != null && paramC != null) {
      N_ROWS = parseInt(paramR);
      N_COLS = parseInt(paramC);
    }
    createBoard();
    if (paramA != null) {
      let savedArray = JSON.parse(atob(paramA));
      arr = [...savedArray];
      renderBoard2();
    } else {
      createBoard2();
    }
  };

  const createBoard = () => {
    // Set CSS properties dynamically based on N_ROWS and N_COLS
    board.style.gridTemplateColumns = `repeat(${N_COLS - 1}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${N_ROWS - 1}, 1fr)`;
    board.style.width = `${(N_COLS - 1) * 20}px`; // Assuming each cell is 20px wide
    board2.style.gridTemplateColumns = `repeat(${N_COLS}, 1fr)`;
    board2.style.gridTemplateRows = `repeat(${N_ROWS}, 1fr)`;
    board2.style.width = `${N_COLS * 20}px`; // Assuming each cell is 20px wide

    arr = Array(N_ROWS * N_COLS).fill(0);

    board.innerHTML = "";
    for (let i = 0; i < (N_ROWS - 1) * (N_COLS - 1); i++) {
      board.insertAdjacentHTML("beforeend", `<div></div>`);
    }
  };

  const createBoard2 = () => {
    board2.innerHTML = "";
    for (let i = 0; i < N_ROWS * N_COLS; i++) {
      board2.insertAdjacentHTML("beforeend", `<div data-id="${i}"></div>`);
    }
  };

  const renderBoard2 = () => {
    board2.innerHTML = "";
    for (let i = 0; i < N_ROWS * N_COLS; i++) {
      board2.insertAdjacentHTML(
        "beforeend",
        `<div data-id="${i}" class="${arr[i]}"></div>`
      );
    }
  };

  board2.addEventListener("click", function (e) {
    if (e.target != board2) {
      if (e.target.classList.contains("w")) {
        e.target.classList.remove("w");
        arr[e.target.dataset.id] = 0;
      } else if (e.target.classList.contains("b")) {
        e.target.classList.remove("b");
        e.target.classList.add("w");
        arr[e.target.dataset.id] = "w";
      } else {
        e.target.classList.add("b");
        arr[e.target.dataset.id] = "b";
      }

      // Save data to URL
      let save = btoa(JSON.stringify(arr));
      window.history.pushState({}, null, `?r=${N_ROWS}&c=${N_COLS}&a=${save}`);
    }
  });

  resetButton.addEventListener("click", function (e) {
    arr = Array(N_ROWS * N_COLS).fill(0);
    createBoard2();
    let save = btoa(JSON.stringify(arr));
    window.history.pushState({}, null, `?r=${N_ROWS}&c=${N_COLS}&a=${save}`);
  });

  // Handle back button
  window.addEventListener("popstate", function (event) {
    loadGameData();
  });

  // Initial load
  loadGameData();
});
