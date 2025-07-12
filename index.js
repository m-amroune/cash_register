const cash = document.querySelector("#cash");
const changeDue = document.querySelector("#change-due");
const btn = document.querySelector("#purchase-btn");
const cid = document.querySelector("#cash-in-drawer");

let price = 19.5;

// Recording available funds in the cash drawer
let cashRegister = {
    status: "",
    cid: [
        ["PENNY", 1.00],
        ["NICKEL", 2.00],
        ["DIME", 3.00],
        ["QUARTER", 4.00],
        ["ONE", 90],
        ["FIVE", 50],
        ["TEN", 20],
        ["TWENTY", 60],
        ["ONE HUNDRED", 100]
    ],
    changeDue: 0
};

// Currencies units and their values
const currencyUnits = {
    "PENNY": 0.01,
    "NICKEL": 0.05,
    "DIME": 0.10,
    "QUARTER": 0.25,
    "ONE": 1.00,
    "FIVE": 5.00,
    "TEN": 10.00,
    "TWENTY": 20.00,
    "ONE HUNDRED": 100.00
};

//  Function to calculte the amount of change to return
const getChange = () => {
    let change = cashRegister.cashGiven - price;
    cashRegister.changeDue = change;
};

// Function to check whether change can be given
const isChangeAvailable = () => {
    const totalFunds = getCashTotal();
    const changeDue = cashRegister.changeDue;

    if (totalFunds < changeDue) {
        cashRegister.status = "INSUFFICIENT_FUNDS";
        return false;
    } else {
        cashRegister.status = "Sufficient Funds";
        return true;
    }
};

// Function to calculate the total available funds
const getCashTotal = () => {
    let totalCash = 0;
    cashRegister.cid.forEach(([currency, amount]) => {
        totalCash += amount;
    });
    return totalCash;
};

const getTotal = (arr) => arr.reduce((sum, [, amount]) => sum + amount, 0);

// Fuction to update the displayed total in the cash drawer
const updateDisplayTotal = () => {
    const totalCash = getCashTotal();  
     document.querySelector("#price-screen").innerText = `Total: $${price.toFixed(2)}` 
};


// Function to process the calculation of currencies to return
const chargeDue = () => {
  let changeArray = [];
  let change = cashRegister.changeDue;
  let register = cashRegister.cid.map(([unit, amount]) => [unit, amount]); 

  // Currency from largest to smallest
  for (let i = register.length - 1; i >= 0; i--) {
    let [currency, totalAvailable] = register[i];
    let unitValue = currencyUnits[currency];
    let amountToReturn = 0;

    // return as much as possible this currency
    while (change >= unitValue && totalAvailable >= unitValue) {
      change = Math.round((change - unitValue) * 100) / 100;
      totalAvailable = Math.round((totalAvailable - unitValue) * 100) / 100;
      amountToReturn += unitValue;
    }

    register[i][1] = totalAvailable;

    if (amountToReturn > 0) {
      changeArray.push([currency, amountToReturn]);
    }
  }

  // Update drawer after transaction
  changeArray.forEach(([currency, amountReturned]) => {
    for (let i = 0; i < cashRegister.cid.length; i++) {
      if (cashRegister.cid[i][0] === currency) {
        cashRegister.cid[i][1] = Math.round((cashRegister.cid[i][1] - amountReturned) * 100) / 100;
      }
    }
  });

  // Calculations to determinate the status
  const remainingChange = Math.round(change * 100) / 100;
  const totalCashAfter = getCashTotal();

  if (remainingChange > 0) {
    cashRegister.status = "INSUFFICIENT_FUNDS";
    changeDue.innerHTML = "<strong>Status</strong>  : INSUFFICIENT_FUNDS";
  } else if (totalCashAfter === 0) {
    cashRegister.status = "CLOSED";
    changeDue.innerHTML = `<strong>Status</strong>  : CLOSED ${changeArray.map(([currency, amount]) => `${currency}: $${amount.toFixed(2)}`).join(" ")}`;
  } else {
    cashRegister.status = "OPEN";
    changeDue.innerHTML = `<strong>Status</strong> : OPEN<br> ${changeArray.map(([currency, amount]) => `<strong>${currency}</strong>: $${amount.toFixed(2)}`).join("<br>")}`;
  }

  displayCid();
  updateDisplayTotal();

  console.log("Change rendu :", changeArray);
  return changeArray;
};



// Event for the event on the purchase button
btn.addEventListener("click", () => {
  let userCash = parseFloat(cash.value);
  if (isNaN(userCash)) {
    alert("Please enter a valid amount.");
    return;
  }

  cashRegister.cashGiven = userCash;
  document.querySelector("#change-due").innerText = `Amount Given: $${userCash.toFixed(2)}`;

  if (cashRegister.cashGiven < price) {
    alert("Customer does not have enough money to purchase the item");
    changeDue.innerText = "Status: INSUFFICIENT_FUNDS";
    return;
  }

  if (cashRegister.cashGiven === price) {
    changeDue.innerText = "No change due - customer paid with exact cash";
    return;
  }

  getChange(); 

  if (isChangeAvailable()) {
    chargeDue(); // calculation + update cid + disqplay status
    // 
  } else {
    changeDue.innerText = "Status: INSUFFICIENT_FUNDS";
  }
});


// Display funds in cash drawer
const displayCid = () => {
    let cidText = cashRegister.cid.map(([currency, amount]) => {
        return `${currency}: $${amount.toFixed(2)}`;
    }).join("<br>");

    cid.innerHTML = cidText;
   
};
displayCid();

