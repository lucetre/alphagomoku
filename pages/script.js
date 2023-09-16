// script.js

document.addEventListener("DOMContentLoaded", function () {
    const board2 = document.querySelector('.board2');
    const resetButton = document.getElementById('resetButton');
    
    // Define constants for rows and columns
    const N_ROWS = 19;
    const N_COLS = 19;
    
    let arr = Array(N_ROWS * N_COLS).fill(0);

    // Load data from URL if available
    const loadGameData = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const myParam = urlParams.get('a');
        if (myParam != null) {
            let savedArray = JSON.parse(atob(myParam));
            arr = [...savedArray];
            renderBoard2();
        } else {
            createBoard2();
        }
    };

    const createBoard2 = () => {
        for (let i = 0; i < N_ROWS * N_COLS; i++) {
            board2.insertAdjacentHTML('beforeend', `<div data-id="${i}"></div>`);
        }
    };

    const renderBoard2 = () => {
        board2.innerHTML = '';
        for (let i = 0; i < N_ROWS * N_COLS; i++) {
            board2.insertAdjacentHTML('beforeend', `<div data-id="${i}" class="${arr[i]}"></div>`);
        }
    };

    board2.addEventListener('click', function (e) {
        if (e.target != board2) {
            if (e.target.classList.contains('w')) {
                e.target.classList.remove('w');
                arr[e.target.dataset.id] = 0;
            } else if (e.target.classList.contains('b')) {
                e.target.classList.remove('b');
                e.target.classList.add('w');
                arr[e.target.dataset.id] = 'w';
            } else {
                e.target.classList.add('b');
                arr[e.target.dataset.id] = 'b';
            }

            // Save data to URL
            let save = btoa(JSON.stringify(arr));
            window.history.pushState({}, null, '?a=' + save);
        }
    });

    resetButton.addEventListener('click', function (e) {
        arr = Array(N_ROWS * N_COLS).fill(0);
        createBoard2();
        let save = btoa(JSON.stringify(arr));
        window.history.pushState({}, null, '?a=' + save);
    });

    // Handle back button
    window.addEventListener('popstate', function (event) {
        loadGameData();
    });

    // Initial load
    loadGameData();
});
