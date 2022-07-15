//'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
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
      <div class="movements__value">${mov}€</div>
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

  const incoms = movements.filter(mov => mov > 0).reduce((acc, cur) => acc + cur);
  labelSumIn.textContent = `${incoms}€`;

  let outcoms = movements.filter(mov => mov < 0);
  if (outcoms.length) {
    outcoms = movements.reduce((acc, cur) => acc + cur);
    labelSumOut.textContent = `${Math.abs(outcoms)}€`;
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

//this is a nice title => This Is a Nice Title
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

const recomF = arr => {
  arr.forEach(item => {
    item.recomFood = Math.trunc(item.weight ** 0.75 * 28);
  });
};

recomF(dogs);
const ownersEatTooMuch = [],
  ownersEatTooLittle = [];

const compareFactFood = arr => {
  arr.forEach(item => {
    if (item.owners.includes('Sarah')) {
      if (item.curFood > item.recomFood) {
        console.log(`your dog eat more for ${item.curFood - item.recomFood}`);
      } else {
        console.log(`your dog eat less for ${item.recomFood - item.curFood}`);
      }
    }
    item.curFood > item.recomFood ? ownersEatTooMuch.push(item.owners) : ownersEatTooLittle.push(item.owners);
  });
};

compareFactFood(dogs);

console.log(`too much is ${ownersEatTooMuch.flat().join(',  ')}`);
console.log(`too little is ${ownersEatTooLittle.flat().join(', ')}`);

console.log(dogs);
console.log(dogs.some(dog => dog.curFood === dog.recomFood));

console.log(dogs.some(dog => dog.curFood > dog.recomFood * 0.9 && dog.curFood < dog.recFood * 1.1));

const shallowCopy = dogs.slice().sort((a, b) => a.recomFood - b.recomFood);

console.log(shallowCopy);
