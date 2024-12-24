"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2024-12-18T10:51:36.790Z",
    "2024-12-22T20:36:17.929Z",
    "2024-12-23T17:01:17.194Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// Refresh UI on Transfer, Deposit, Loan
const refreshUI = () => {
  // TODO: display transactions/movements
  displayMovements(currentUser);

  // TODO: display balance
  calcDisplayBalance(currentUser);

  // TODO: display account summary
  calcDisplaySummary(currentUser);
};
const formatCurrency = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};
const formatDate = (datePassed, locale = navigator.language) => {
  const calcDaysPassed = (datePassed, currDate = new Date()) =>
    Math.round(Math.abs(currDate - datePassed) / (24 * 60 * 60 * 1000));
  const daysPassed = calcDaysPassed(datePassed);
  if (daysPassed === 0) return "Today";
  else if (daysPassed === 1) return "Yesterday";
  else if (daysPassed <= 7) return `${daysPassed} days ago`;
  return new Intl.DateTimeFormat(locale).format(datePassed);
};
// 1. Display Movements
const displayMovements = function (currAc, sort = false) {
  containerMovements.innerHTML = "";
  console.log(currAc);
  const combinedMovements = currAc.movements.map((mov, i) => ({
    movements: mov,
    movementDate: currAc.movementsDates.at(i),
  }));
  // console.log(combinedMovements);
  // Check if sort is applied or Not
  (sort
    ? combinedMovements.sort(
        (currTxn, txn) => currTxn.movements - txn.movements
      )
    : combinedMovements
  ).forEach(function (obj, i) {
    const { movements, movementDate } = obj;
    const type = movements > 0 ? "deposit" : "withdrawal";
    const movement = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${formatDate(
        new Date(movementDate),
        currAc.locale
      )}</div>
      <div class="movements__value">${formatCurrency(
        movements,
        currAc.locale,
        currAc.currency
      )}</div>
    </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", movement);
  });
};

//2. Computing Usernames
const createUsername = function (accts) {
  accts.forEach(function (txns) {
    txns.username = txns.owner
      .toLowerCase()
      .split(" ")
      .map((user) => user[0])
      .join("");
    //console.log(txns.username);
  });
};

createUsername(accounts);
// console.log(accounts);

//3. Dispaly Balance of User account
const calcDisplayBalance = function (currAc) {
  const options = {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  };
  currAc.balance = currAc.movements.reduce((acc, txn) => acc + txn, 0);
  labelBalance.textContent = `${formatCurrency(
    currAc.balance,
    currAc.locale,
    currAc.currency
  )}`;
  labelDate.textContent = `${new Intl.DateTimeFormat(
    currAc.locale,
    options
  ).format(new Date(currAc.movementsDates.at(-1)))}`.padStart(2, 0);
};

//4. Display Transactions/Movements Summary
const calcDisplaySummary = function (currAcc) {
  labelSumIn.textContent = `${formatCurrency(
    currAcc.movements
      .filter((income) => income > 0)
      .reduce((acc, income) => acc + income, 0)
      .toFixed(2),
    currAcc.locale,
    currAcc.currency
  )}`;

  labelSumOut.textContent = `${formatCurrency(
    currAcc.movements
      .filter((deduct) => deduct < 0)
      .reduce((acc, deduct) => acc + deduct, 0)
      .toFixed(2),
    currAcc.locale,
    currAcc.currency
  )}`;

  labelSumInterest.textContent = `${formatCurrency(
    currAcc.movements
      .filter((interest) => interest > 0)
      .map((interest) => (interest * currAcc.interestRate) / 100)
      .reduce((acc, interest) => acc + interest, 0)
      .toFixed(2),
    currAcc.locale,
    currAcc.currency
  )}`;
};

// 5. Implementing Login Functionality
let currentUser, timer;

const startLogoutTimer = () => {
  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearTimeout(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }

    time--;
  };

  // set time for logout
  let time = 300;

  tick();
  if (timer) clearTimeout(timer);
  timer = setInterval(tick, 1000);
  return timer;
};
const verifyCurrentUser = (e) => {
  e.preventDefault();
  currentUser = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  // console.log(currentUser);
  if (currentUser?.pin === Number(inputLoginPin.value)) {
    // Welcome user
    labelWelcome.textContent = `Welcome back, ${
      currentUser.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    // inputLoginPin.value = "****";
    // inputLoginPin.disabled = true;
    refreshUI();
    // call logout timer
    startLogoutTimer();
  }
};
btnLogin.addEventListener("click", verifyCurrentUser);

//6. Transferring Amount
const transferAmount = (e) => {
  e.preventDefault();
  // console.log("Transferred");
  const amount = Number(inputTransferAmount.value);
  const receiver = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";
  if (
    amount > 0 &&
    receiver &&
    currentUser.balance >= amount &&
    receiver?.username !== currentUser.username
  ) {
    //Do Transfer
    currentUser.movements.push(-amount);
    currentUser.movementsDates.push(new Date().toISOString());
    receiver.movements.push(amount);
    receiver.movementsDates.push(new Date().toISOString());
    // Reset Timer
    clearInterval(timer);
    timer = startLogoutTimer();
    // Refresh UI
    refreshUI();
  }
};
btnTransfer.addEventListener("click", transferAmount);

//7. Close an account

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    currentUser.username === inputCloseUsername.value &&
    currentUser.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentUser.username
    );
    // console.log(index);
    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

// 8. Requesting a loan
const requestLoan = function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentUser.movements.some((deposit) => deposit >= amount * 0.1)
  ) {
    setTimeout(() => {
      currentUser.movements.push(amount);
      currentUser.movementsDates.push(new Date().toISOString());
      clearInterval(timer);
      timer = startLogoutTimer();
      refreshUI();
    }, 2500);
    // console.log(currentUser);

    // console.log("loan granted");
  }
  inputLoanAmount.value = "";
};
btnLoan.addEventListener("click", requestLoan);

//9. Adding Sorting functionality
let sort = false;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  displayMovements(currentUser, !sort);
  sort = !sort;
});

//10. Filter By Method
const filteredMovements = account1.movements.filter((txn) => txn > 0);
// TODO: add frontend button to filter movements based on Deposit / Withdrawl

// Group By
const typeOfACs = Object.groupBy(accounts, ({ type }) => type);
console.log(typeOfACs);

const arr = new Array(7);
arr.fill(Math.random() * 10, 0);
console.log(arr);
