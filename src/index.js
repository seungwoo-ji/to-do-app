import './assets/styles/style.css';

class Task {
  constructor(description) {
    this.id = Date.now().toString();
    this.isCompleted = false;
    this.description = description;
  }
}

class App {
  constructor() {
    // TODO: load saved tasks from the local storage
    this.tasks = [];
  }

  addTask(description) {
    const listEl = document.querySelector('.list');
    const taskTemplateEl = document.querySelector('.task-template');
    const taskEl = document.importNode(taskTemplateEl.content, true);

    const newTask = new Task(description);
    const taskInputEl = taskEl.querySelector('input');
    taskInputEl.id = newTask.id;
    const taskLabelEl = taskEl.querySelector('label');
    taskLabelEl.htmlFor = newTask.id;
    taskLabelEl.textContent = newTask.description;

    this.tasks.push(newTask);
    listEl.append(taskEl);

    // TODO: remove the console logs
    console.log('task added: ', newTask);
    console.dir(this.tasks);
  }

  toggleTask(id) {
    const task = this.tasks.find((t) => t.id === id);
    task.isCompleted = !task.isCompleted;

    const taskEl = document.getElementById(id);
    taskEl.closest('.list__task').classList.toggle('list__task--completed');

    // TODO: remove the console logs
    console.log('task toggled: ', task);
    console.dir(this.tasks);
  }

  removeTask() {}

  removeCompleted() {}

  displayAll() {}

  displayActive() {}

  displayCompleted() {}

  save() {}
}

const formEl = document.querySelector('.new-task-form');
const inputEl = document.querySelector('#new-task');
const listEl = document.querySelector('.list');

const todoApp = new App();

formEl.addEventListener('submit', (e) => {
  e.preventDefault();
  const task = inputEl.value.trim();

  if (task) {
    todoApp.addTask(task);
  }

  inputEl.value = null;
});

listEl.addEventListener('click', (e) => {
  if (e.target.getAttribute('type') === 'checkbox') {
    todoApp.toggleTask(e.target.id);
  }
});
