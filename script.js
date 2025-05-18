"use strict";

// Selecting elements from the DOM
const errorMesgEl = document.querySelector(".error_message");
const budgetInputEl = document.querySelector(".budget_input");
const expenseDesEl = document.querySelector(".expensess_input");
const expenseAmountEl = document.querySelector(".expensess_amount");
const tblRecordEl = document.querySelector(".tbl_data");
const cardsContainer = document.querySelector(".cards");

const budgetCardEl = document.querySelector(".budget_card");
const expensesCardEl = document.querySelector(".expenses_card");
const balanceCardEl = document.querySelector(".balance_card");

let itemList = [];
let itemId = 0;

// ============ Add Event Listeners to Buttons ============
function btnEvents() {
  const btnBudgetCal = document.querySelector("#btn_budget");
  const btnExpensesCal = document.querySelector("#btn_expenses");

  btnBudgetCal.addEventListener("click", (e) => {
    e.preventDefault();
    budgetFun();
  });

  btnExpensesCal.addEventListener("click", (e) => {
    e.preventDefault();
    expensesFun();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  btnEvents();
  loadFromLocalStorage(); // Load saved data when app loads
});

// ============ Add New Expense ============
function expensesFun() {
  let expensesDescValue = expenseDesEl.value;
  let expenseAmountValue = expenseAmountEl.value;

  if (
    expensesDescValue == "" ||
    expenseAmountValue == "" ||
    budgetInputEl < 0
  ) {
    errorMessage("Please Enter Expenses Desc or Expnese Amount!");
  } else {
    let amount = parseInt(expenseAmountValue);

    expenseAmountEl.value = "";
    expenseDesEl.value = "";

    let expenses = {
      id: itemId,
      title: expensesDescValue,
      amount: amount,
    };
    itemId++;
    itemList.push(expenses);

    saveToLocalStorage(); // Save data
    addExpenses(expenses);
    showBalance();
  }
}

// ============ Add Expense to UI ============
function addExpenses(expensesPara) {
  const html = `<ul class="tbl_tr_content">
    <li data-id=${expensesPara.id}>${expensesPara.id + 1}</li>
    <li>${expensesPara.title}</li>
    <li><span>₹</span>${expensesPara.amount}</li>
    <li>
      <button type="button" class="btn_edit">Edit</button>
      <button type="button" class="btn_delete">Delete</button>
    </li>
  </ul>`;

  tblRecordEl.insertAdjacentHTML("beforeend", html);

  const btnEdit = document.querySelectorAll(".btn_edit");
  const btnDel = document.querySelectorAll(".btn_delete");
  const content_id = document.querySelectorAll(".tbl_tr_content");

  // Edit Button
  btnEdit.forEach((btnedit) => {
    btnedit.addEventListener("click", (el) => {
      let id;
      content_id.forEach((ids) => {
        id = ids.firstElementChild.dataset.id;
      });

      let element = el.target.parentElement.parentElement;
      element.remove();

      let expenses = itemList.filter(function (item) {
        return item.id == id;
      });

      expenseDesEl.value = expenses[0].title;
      expenseAmountEl.value = expenses[0].amount;

      let temp_list = itemList.filter(function (item) {
        return item.id != id;
      });

      itemList = temp_list;
      saveToLocalStorage(); // Save updated data
      showBalance();
    });
  });

  // Delete Button
  btnDel.forEach((btndel) => {
    btndel.addEventListener("click", (el) => {
      let id;
      content_id.forEach((ids) => {
        id = ids.firstElementChild.dataset.id;
      });

      let element = el.target.parentElement.parentElement;
      element.remove();

      let temp_list = itemList.filter(function (item) {
        return item.id != id;
      });

      itemList = temp_list;
      saveToLocalStorage(); // Save updated data
      showBalance();
    });
  });
}

// ============ Add Budget ============
function budgetFun() {
  const budgetValue = budgetInputEl.value;

  if (budgetValue == "" || budgetValue < 0) {
    errorMessage("Please Enter Your Budget or More Than 0");
  } else {
    budgetCardEl.textContent = budgetValue;
    budgetInputEl.value = "";
    saveToLocalStorage(); // Save budget
    showBalance();
  }
}

// ============ Show Remaining Balance ============
function showBalance() {
  const expenses = totalExpenses();
  const total = parseInt(budgetCardEl.textContent || 0) - expenses;
  balanceCardEl.textContent = total;
}

// ============ Calculate Total Expenses ============
function totalExpenses() {
  let total = 0;

  if (itemList.length > 0) {
    total = itemList.reduce(function (acc, curr) {
      acc += curr.amount;
      return acc;
    }, 0);
  }

  expensesCardEl.textContent = total;
  return total;
}

// ============ Error Message ============
function errorMessage(message) {
  errorMesgEl.innerHTML = `<p>${message}</p>`;
  errorMesgEl.classList.add("error");
  setTimeout(() => {
    errorMesgEl.classList.remove("error");
  }, 2500);
}

// ============ Save to Local Storage ============
function saveToLocalStorage() {
  localStorage.setItem("budget", budgetCardEl.textContent);
  localStorage.setItem("expenses", JSON.stringify(itemList));
}

// ============ Load from Local Storage ============
function loadFromLocalStorage() {
  const savedBudget = localStorage.getItem("budget");
  const savedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];

  if (savedBudget) {
    budgetCardEl.textContent = savedBudget;
  }

  itemList = savedExpenses;
  itemId = itemList.length ? Math.max(...itemList.map(e => e.id)) + 1 : 0;

  itemList.forEach((expense) => {
    addExpenses(expense);
  });

  showBalance();
}
