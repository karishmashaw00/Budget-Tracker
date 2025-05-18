"use strict"; // Ensures stricter parsing and error handling in the code

// Selecting DOM elements
const errorMesgEl = document.querySelector(".error_message");
const budgetInputEl = document.querySelector(".budget_input");
const expenseDesEl = document.querySelector(".expensess_input");
const expenseAmountEl = document.querySelector(".expensess_amount");
const tblRecordEl = document.querySelector(".tbl_data");
const cardsContainer = document.querySelector(".cards");

// Card elements for displaying values
const budgetCardEl = document.querySelector(".budget_card");
const expensesCardEl = document.querySelector(".expenses_card");
const balanceCardEl = document.querySelector(".balance_card");

// Track the list of expenses and a unique ID for each item
let itemList = [];
let itemId = 0;

// ================== Event Listener Setup ==================
function btnEvents() {
  const btnBudgetCal = document.querySelector("#btn_budget");
  const btnExpensesCal = document.querySelector("#btn_expenses");

  // Budget button click event
  btnBudgetCal.addEventListener("click", (e) => {
    e.preventDefault();
    budgetFun();
  });

  // Expenses button click event
  btnExpensesCal.addEventListener("click", (e) => {
    e.preventDefault();
    expensesFun();
  });
}

// Run button setup when page loads
document.addEventListener("DOMContentLoaded", btnEvents);

// ================== Add Expense Function ==================
function expensesFun() {
  let expensesDescValue = expenseDesEl.value;
  let expenseAmountValue = expenseAmountEl.value;

  // Validation: check if inputs are empty or invalid
  if (
    expensesDescValue == "" ||
    expenseAmountValue == "" ||
    budgetInputEl < 0
  ) {
    errorMessage("Please Enter Expenses Desc or Expnese Amount!");
  } else {
    let amount = parseInt(expenseAmountValue); // Convert amount to number

    // Clear inputs
    expenseAmountEl.value = "";
    expenseDesEl.value = "";

    // Create an expense object
    let expenses = {
      id: itemId,
      title: expensesDescValue,
      amount: amount,
    };
    itemId++;
    itemList.push(expenses); // Store expense in list

    addExpenses(expenses); // Add to UI
    showBalance();         // Update balance
  }
}

// ================== Add Expense to UI ==================
function addExpenses(expensesPara) {
  // Create HTML for the new expense row
  const html = `<ul class="tbl_tr_content">
            <li data-id=${expensesPara.id}>${expensesPara.id + 1}</li>
            <li>${expensesPara.title}</li>
            <li><span>₹</span>${expensesPara.amount}</li>
            <li>
              <button type="button" class="btn_edit">Edit</button>
              <button type="button" class="btn_delete">Delete</button>
            </li>
          </ul>`;

  // Insert into DOM
  tblRecordEl.insertAdjacentHTML("beforeend", html);

  // Handle Edit and Delete actions
  const btnEdit = document.querySelectorAll(".btn_edit");
  const btnDel = document.querySelectorAll(".btn_delete");
  const content_id = document.querySelectorAll(".tbl_tr_content");

  // Edit Button Functionality
  btnEdit.forEach((btnedit) => {
    btnedit.addEventListener("click", (el) => {
      let id;

      // Get the data-id for the selected item
      content_id.forEach((ids) => {
        id = ids.firstElementChild.dataset.id;
      });

      // Remove item from DOM
      let element = el.target.parentElement.parentElement;
      element.remove();

      // Get the expense object and fill inputs for editing
      let expenses = itemList.filter(function (item) {
        return item.id == id;
      });

      expenseDesEl.value = expenses[0].title;
      expenseAmountEl.value = expenses[0].amount;

      // Remove item from the itemList temporarily
      let temp_list = itemList.filter(function (item) {
        return item.id != id;
      });

      itemList = temp_list;
    });
  });

  // Delete Button Functionality
  btnDel.forEach((btndel) => {
    btndel.addEventListener("click", (el) => {
      let id;

      // Get the data-id of item to be deleted
      content_id.forEach((ids) => {
        id = ids.firstElementChild.dataset.id;
      });

      // Remove item from DOM
      let element = el.target.parentElement.parentElement;
      element.remove();

      // Remove from data array
      let temp_list = itemList.filter(function (item) {
        return item.id != id;
      });

      itemList = temp_list;
      showBalance(); // Update balance after deletion
    });
  });
}

// ================== Budget Function ==================
function budgetFun() {
  const budgetValue = budgetInputEl.value;

  // Validation for empty or negative input
  if (budgetValue == "" || budgetValue < 0) {
    errorMessage("Please Enter Your Budget or More Than 0");
  } else {
    // Set budget card value
    budgetCardEl.textContent = budgetValue;
    budgetInputEl.value = ""; // Clear input
    showBalance();            // Recalculate balance
  }
}

// ================== Show Remaining Balance ==================
function showBalance() {
  const expenses = totalExpenses(); // Calculate total expense
  const total = parseInt(budgetCardEl.textContent) - expenses; // Calculate balance
  balanceCardEl.textContent = total; // Show balance
}

// ================== Calculate Total Expenses ==================
function totalExpenses() {
  let total = 0;

  if (itemList.length > 0) {
    total = itemList.reduce(function (acc, curr) {
      acc += curr.amount;
      return acc;
    }, 0);
  }

  expensesCardEl.textContent = total; // Show total expenses
  return total;
}

// ================== Show Error Messages ==================
function errorMessage(message) {
  errorMesgEl.innerHTML = `<p>${message}</p>`; // Show error message
  errorMesgEl.classList.add("error");         // Add error class for styling

  // Remove error message after 2.5 seconds
  setTimeout(() => {
    errorMesgEl.classList.remove("error");
  }, 2500);
}
