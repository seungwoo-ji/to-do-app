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
    this.updateTaskCount();

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

    this.updateTaskCount();
  }

  removeTask(id) {
    const index = this.tasks.findIndex((t) => t.id === id);
    this.tasks.splice(index, 1);

    const taskEl = document.getElementById(id);
    taskEl.closest('.list__task').remove();

    this.updateTaskCount();

    // TODO: remove the console logs
    console.log('task deleted of id:', id);
    console.dir(this.tasks);
  }

  clearCompleted() {}

  displayAll() {}

  displayActive() {}

  displayCompleted() {}

  updateTaskCount() {
    const countEl = document.querySelector('.status__count');
    const count = this.tasks.filter((t) => t.isCompleted === false).length;
    if (count) {
      countEl.textContent =
        count > 1 ? `${count} items left` : `${count} item left`;
    } else {
      countEl.textContent = `0 item left`;
    }
  }

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
  // toggle checkbox event
  if (e.target.getAttribute('type') === 'checkbox') {
    todoApp.toggleTask(e.target.id);
  }
  // delete task event
  else if (e.target.className === 'list__delete-task') {
    todoApp.removeTask(e.target.parentNode.querySelector('input').id);
  }
});
