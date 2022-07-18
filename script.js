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
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
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

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const displayMovements = (movements, sort = false) => {
  containerMovements.innerHTML = '';

  const movem = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movem.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__value">${mov.toFixed(2)}€</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = accounts => {
  accounts.balance = accounts.movements.reduce((acc, mov) => {
    return acc + mov;
  }, 0);
  labelBalance.textContent = `${accounts.balance} €`;
};

const calcDisplaySummary = account => {
  const { movements, interestRate } = account;

  const incoms = movements.filter(mov => mov > 0).reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${incoms.toFixed(2)}€`;

  let outcoms = movements.filter(mov => mov < 0);

  if (outcoms.length) {
    outcoms = outcoms.reduce((acc, cur) => acc + cur, 0);
    labelSumOut.textContent = `${Math.abs(outcoms.toFixed(2))}€`;
  } else {
    labelSumOut.textContent = `0000€`;
  }

  const interest = movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, cur) => acc + cur);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
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
  displayMovements(acc.movements);
};

let currentAccount;

btnLogin.addEventListener('click', e => {
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Wlcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = `100`;
    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); //remove focus of the field

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiveAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  console.log(amount, receiveAcc);

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiveAcc?.username !== currentAccount.username &&
    receiveAcc
  ) {
    currentAccount.movements.push(-amount);
    receiveAcc.movements.push(amount);
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
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
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
