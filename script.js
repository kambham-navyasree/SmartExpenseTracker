const API_URL = "http://127.0.0.1:8000";

let expenses = [];
let chart;

// LOAD DATA WHEN PAGE LOADS
window.onload = function () {
    fetchExpenses();
};

// FETCH EXPENSES
async function fetchExpenses() {
    const response = await fetch(`${API_URL}/get-expenses`);
    expenses = await response.json();
    displayExpenses();
    updateTotal();
    updateChart();
}

// ADD EXPENSE
async function addExpense() {
    const title = document.getElementById("title").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const category = document.getElementById("category").value;

    if (!title || !amount || !category) {
        alert("Please fill all fields");
        return;
    }

    await fetch(`${API_URL}/add-expense`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, amount, category })
    });

    document.getElementById("title").value = "";
    document.getElementById("amount").value = "";

    fetchExpenses();
}

// DELETE EXPENSE (NOW USING ID)
async function deleteExpense(id) {
    await fetch(`${API_URL}/delete-expense/${id}`, {
        method: "DELETE"
    });

    fetchExpenses();
}

// DISPLAY EXPENSES
function displayExpenses() {
    const list = document.getElementById("expense-list");
    list.innerHTML = "";

    expenses.forEach(exp => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${exp.title} - ₹${exp.amount} (${exp.category})
            <button onclick="deleteExpense(${exp.id})">Delete</button>
        `;
        list.appendChild(li);
    });
}

// UPDATE TOTAL
function updateTotal() {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    document.getElementById("total").innerText = total.toFixed(2);
}

// UPDATE CHART
function updateChart() {
    const categoryTotals = {};

    expenses.forEach(exp => {
        if (!categoryTotals[exp.category]) {
            categoryTotals[exp.category] = 0;
        }
        categoryTotals[exp.category] += exp.amount;
    });

    const ctx = document.getElementById("expenseChart").getContext("2d");

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
                data: Object.values(categoryTotals)
            }]
        }
    });
}
