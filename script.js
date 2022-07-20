//'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-02T23:36:17.929Z',
    '2022-07-15T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//second way for this is .pastart(2, 0) method
const zeroAdd = dateElem => {
  return dateElem < 10 ? (dateElem = '0' + dateElem) : dateElem;
};

const formatMovementDate = (date, locale) => {
  const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) {
    return 'Today';
  }

  if (daysPassed === 1) {
    return 'Yesterday';
  }

  if (daysPassed <= 7) {
    return `${daysPassed} days ago`;
  }
  // const day = date.getDate();
  // const month = date.getMonth() + 1;
  // const year = date.getFullYear();
  // return `${zeroAdd(day)}/${zeroAdd(month)}/${zeroAdd(year)}`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: `${currency}`,
  }).format(value);
};

const displayMovements = (acc, sort = false) => {
  containerMovements.innerHTML = '';

  const movem = sort ? acc.slice().sort((a, b) => a - b) : acc;

  movem.movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value"> ${formattedMov}</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = accounts => {
  accounts.balance = accounts.movements.reduce((acc, mov) => {
    return acc + mov;
  }, 0);
  labelBalance.textContent = formatCur(accounts.balance, accounts.locale, accounts.currency);
};

const calcDisplaySummary = accounts => {
  const { movements, interestRate, locale, currency } = accounts;

  const incoms = movements.filter(mov => mov > 0).reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = formatCur(incoms, locale, currency);

  let outcoms = movements.filter(mov => mov < 0);

  if (outcoms.length) {
    outcoms = outcoms.reduce((acc, cur) => acc + cur, 0);
    const formattedOutcom = formatCur(Math.abs(outcoms), accounts.locale, accounts.currency);
    labelSumOut.textContent = `${formattedOutcom}`;
  } else {
    labelSumOut.textContent = `0000€`;
  }

  const interest = movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, cur) => acc + cur);
  labelSumInterest.textContent = formatCur(interest, accounts.locale, accounts.currency);
};

const createUserNames = accs => {
  accs.forEach(item => {
    item.username = item.owner
      .toLowerCase()
      .split(' ')
      .map(item => item[0])
      .join('');
  });
};

createUserNames(accounts);

const updateUI = acc => {
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
  displayMovements(acc);
};

const startLogOutTimer = () => {
  const tick = () => {
    const minutes = String(Math.trunc(time / 60)).padStart(2, 00);
    const secods = String(time % 60).padStart(2, 00);
    //in each call, print ther remaining time to UI
    labelTimer.textContent = `${minutes}:${secods}`;

    //When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = `0`;
    }

    time--;
  };
  //set time to 5 minutes
  let time = 120;
  //call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

let currentAccount, timer;

//Fake always logged in
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;
// finish fake logged in    --------- must be DELETED after develop

btnLogin.addEventListener('click', e => {
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Wlcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = `100`;

    //create Date first WAY how to do it
    // const now = new Date();
    // const day = now.getDate();
    // const month = now.getMonth() + 1;
    // const year = now.getFullYear();
    // const hour = now.getHours();
    // const min = now.getMinutes();

    // labelDate.textContent = `${zeroAdd(day)}/${zeroAdd(month)}/${zeroAdd(year)}, ${hour}:${min}`;

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };

    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);

    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); //remove focus of the field

    if (timer) {
      clearInterval(timer);
    }
    timer = startLogOutTimer();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  clearInterval(timer);
  timer = startLogOutTimer();
  const amount = +inputTransferAmount.value;
  const receiveAcc = accounts.find(acc => acc.username === inputTransferTo.value);

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiveAcc?.username !== currentAccount.username &&
    receiveAcc
  ) {
    currentAccount.movements.push(-amount);
    receiveAcc.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiveAcc.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
  } else {
    alert('Something wrong with transfer, please check value, amunt etc.');
  }
  inputTransferAmount.value = inputTransferTo.value = '';
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = +inputLoanAmount.value;
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(() => {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', e => {
  e.preventDefault(0);
  if (inputCloseUsername.value === currentAccount.username && +inputClosePin.value === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
});

let sorter = false;

btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorter);
  sorter = !sorter;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
