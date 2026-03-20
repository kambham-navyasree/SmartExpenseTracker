const API_URL = "https://smartexpensetracker-bbtu.onrender.com";

let expenses = [];
let chart;

// LOAD DATA WHEN PAGE LOADS
window.onload = function () {
    fetchExpenses();
};

// FETCH EXPENSES
async function fetchExpenses() {
    try {
        const response = await fetch(`${API_URL}/get-expenses`);
        const data = await response.json();

        expenses = data;
        displayExpenses();
        updateTotal();
        updateChart();
    } catch (error) {
        console.error("Error fetching expenses:", error);
    }
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

    try {
        const response = await fetch(`${API_URL}/add-expense`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, amount, category })
        });

        const data = await response.json();
        console.log("Added:", data);

        // Clear inputs
        document.getElementById("title").value = "";
        document.getElementById("amount").value = "";

        fetchExpenses();
    } catch (error) {
        console.error("Error adding expense:", error);
    }
}

// DELETE EXPENSE
async function deleteExpense(id) {
    try {
        await fetch(`${API_URL}/delete-expense/${id}`, {
            method: "DELETE"
        });

        fetchExpenses();
    } catch (error) {
        console.error("Error deleting expense:", error);
    }
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
