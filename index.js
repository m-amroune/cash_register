
const cash = document.querySelector("#cash")
const changeDue = document.querySelector("#change-due")
const btn = document.querySelector("#purchase-btn")







let cashRegister = {
    price: 3.26,
    cashGiven: 10,
    status:"",
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
    changeDue:0,
    
}



const getChange = () => {
    let change = cashRegister.cashGiven -  cashRegister.price
    cashRegister.changeDue = change;
     console.log(`Change due: $${cashRegister.changeDue}`);

    
}
getChange()

const getCashTotal = () => {
 let totalCash = 0;

     for(let i=0; i < cashRegister.cid.length; i++){
        totalCash += cashRegister.cid[i][1];
     }
     return totalCash
}

const isChangeAvailable = () => {
    const totalFunds = getCashTotal();
    const changeDue = cashRegister.changeDue;

    if(totalFunds < changeDue){
        cashRegister.status = "INSUFFICIENT_FUNDS";
        return false;
    } else{
        cashRegister.status = "Sufficient Funds"; 
        return true;
    }
}