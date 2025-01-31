const todoInput = document.getElementById("todo-input");
const addbtn = document.getElementById("add-task-btn");
const todoList = document.getElementById("todo-list");
const deleteBtn = document.getElementById("delete-btn");
let tasks = [];

const saveTasks = function () {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Generate Markup for Todo Task
const generateTask = () => {
  const task = todoInput.value.trim();
  if (!task) return;

  const newTask = {
    id: Date.now(),
    isCompleted: false,
    text: task,
  };
  tasks.push(newTask);
  renderTask(newTask);
  saveTasks();
  todoInput.value = "";
};
const renderTask = function (task) {
  const markup = `<li
              id="${task.id}"
              class="grid grid-flow-col justify-between px-4 w-full col-span-1 border-2 max-h-16 bg-white items-center overflow-clip cursor-pointer leading-tight"
            >
              ${task.text}
              <button
                id="delete-btn"
                type="button"
                class="text-center  h-10 max-w-fit p-2 mx-2 my-2 self-start focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              >
                Delete
              </button>
            </li>`;
  todoList.insertAdjacentHTML("beforeend", markup);
};
const renderTasks = function (task) {
  renderTask(task);
};

// Add Todo action in the list
addbtn.addEventListener("click", () => {
  generateTask();
});

//Handle Keyboard event to add task in the list
document.addEventListener("keypress", (e) => {
  console.log(e.key);
  if (e.key === "Enter") generateTask();
});

// Retrieve todo actions from local storage on reload
document.addEventListener("DOMContentLoaded", () => {
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => renderTasks(task));
});

// Delete Todo Task from List
todoList.addEventListener("click", (e) => {
  if (e.target.type === "button") {
    const task = e.target.closest("li");
    tasks = tasks.filter((t) => t.id !== Number(task.id));
    task.remove();
    saveTasks();
  }
});
