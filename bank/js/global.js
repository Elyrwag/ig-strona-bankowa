// zmienne do przechowywania danych/wartosci domyslnych pomiedzy stronami
let lastPage = "";
let active = "home-button";
let firstTime;
let diagramName = "expenses-week";

const ERRORMESSAGE1 = 'Nieprawidłowe dane';
const ERRORMESSAGE2 = 'Brak wystarczających środków na koncie';
const ERRORMESSAGE3 = 'Przekroczono limit znaków';

// funkcja do zmiany strony (a dokladniej: zawartosci <main>)
// params:
//      headerName: naglowek strony
//      pageURL: sciezka do danego pliku html
//      func: parametr opcjonalny, do wykonania jakis funkcji podczas ladowania strony (patrz: html z przelewami)
function loadPage(headerName, pageURL, func = function (){}) {
    if (lastPage !== pageURL) {
        $('#h1-header').html(headerName);
        $('#main').load(pageURL, (response, status) => {
            if (status === "error") {
                console.log("Wystąpił błąd podczas wczytywania pliku.");
                $('#main').html('<div class="text-center">Nie udało się załadować zawartości.</div>');
            }
            else func();
        });
        lastPage = pageURL;
    }
}

function loadHomePage() {
    loadPage('Strona główna', 'html-podstrony/strona-glowna.html', () => {
        initializeDiagrams();
        initializeHomePage();
    });
    changeActive('home-button');
}

function loadTransactionPage() {
    loadPage('Transakcje', 'html-podstrony/transakcje/transakcje.html');
    changeActive('transactions-button');
}

function loadBankTransfersPage() {
    loadPage('Przelewy', 'html-podstrony/przelewy/przelewy.html', () => {
        initializeForm();
    })
    changeActive('bank-transfers-button');
}

function loadStandingOrdersPage() {
    loadPage('Zlecenia stałe', 'html-podstrony/zlecenia/zlecenia.html');
    changeActive('standing-orders-button');
}

function loadTicketsPage() {
    loadPage('Bilety', 'html-podstrony/bilety/bilety.html');
    changeActive('tickets-button');
}

function loadCardsPage() {
    loadPage('Karty', 'html-podstrony/karty/karty.html', () => {
        initializeCardsPage();
    });
    changeActive('cards-button');
}

function loadSelectedTicketName(selector) {
    const selectedTicket = BankStorage.getTicketName();
    const tileFirstRow = document.querySelector(selector);
    if (tileFirstRow) {
        tileFirstRow.textContent = selectedTicket;
    }
}

function loadSelectedTicketPrice(selector) {
    const selectedTicketPrice = BankStorage.getTicketPrice();
    const tileSecondRow = document.querySelector(selector);
    if (tileSecondRow) {
        tileSecondRow.textContent = formatMoney(selectedTicketPrice);
    }
}

function setupPopup(modal, btn, close) {

    btn.onclick = function() {
        modal.style.display = "block";
    }
    window.onclick = function(event) {
        if (event.target === modal || event.target === close) {
            modal.style.display = "none";
        }
    }
}

function changeActive(active_page) {
    document.getElementById(active).classList.remove('active');
    document.getElementById(active).classList.add('link-dark');
    document.getElementById(active).removeAttribute('aria-current');

    if (active_page !== 'settings-button' && active_page !== 'logout-button') {
        document.getElementById(active_page).classList.add('active');
    }

    document.getElementById(active_page).classList.remove('link-dark');
    document.getElementById(active_page).ariaCurrent = 'page';

    active = active_page;
}