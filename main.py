from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Expense(BaseModel):
    title: str
    amount: float
    category: str

expenses = []

# ADD
@app.post("/add-expense")
def add_expense(expense: Expense):
    expenses.append(expense.dict())
    return {"message": "Expense added successfully"}

# GET
@app.get("/get-expenses")
def get_expenses():
    return expenses

# DELETE
@app.delete("/delete-expense/{index}")
def delete_expense(index: int):
    if 0 <= index < len(expenses):
        expenses.pop(index)
        return {"message": "Deleted successfully"}
    return {"error": "Invalid index"}

# UPDATE
@app.put("/update-expense/{index}")
def update_expense(index: int, expense: Expense):
    if 0 <= index < len(expenses):
        expenses[index] = expense.dict()
        return {"message": "Updated successfully"}
    return {"error": "Invalid index"} 