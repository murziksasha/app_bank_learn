'use strict';

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

const displayMovements = (movements) => {
  containerMovements.innerHTML = '';
  movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
      <div class="movements__value">${mov}</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  })
}

displayMovements(account1.movements);

const calcDisplayBalance = (movements) => {
  const balance = movements.reduce((acc, mov) => {
    return acc + mov;
  }, 0);
  labelBalance.textContent = `${balance} EUR`;
};

calcDisplayBalance(account1.movements);

const createUserNames = (accs) => {
  accs.forEach(item => {
    item.username = item.owner
    .toLowerCase()
    .split(' ')
    .map(item=> item[0])
    .join('');
  });
}

createUserNames(accounts);


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const movements = account1.movements;

const deposits = movements.filter((mov)=>{
  return mov > 0;
});

const withdrawals = movements.filter((mov) => mov < 0);


const balance = movements.reduce((a, b) => {
  return a + b;
});


const maximum = movements.reduce((a, b) => {
  return a > b ? a : a = b;
})






/////////////////////////////////////////////////

const data1 = [5, 2, 4, 1, 15, 8, 3];
const data2 = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = (dogAge) => {

  const humanYears = dogAge.map((age) => {
    return age <=2 ? 2 * age : 16 + age * 4;
  })

  console.log(`Human years of set dog's years is ${humanYears.join(' ')}`);

  const humanExclude = humanYears.filter((age, i) => {
   return age >= 18; 
  })

  console.log(`the Age more than 18 years old is ${humanExclude.join(' ')}`);

  const averageYears = (arr) => {
    let result = arr.reduce((a, b) => {
      return a + b;
    }) / arr.length;
    return  Math.trunc(result );
  }

  console.log(`the avarage value of Human's years is ${averageYears(humanExclude)}`);

}

calcAverageHumanAge(data1);
console.log(`====================   Second DATA SET of Doggi`);
calcAverageHumanAge(data2);