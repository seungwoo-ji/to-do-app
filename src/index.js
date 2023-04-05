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
    this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  }

  addTask(description) {
    const listEl = document.querySelector('.list');
    const newTask = new Task(description);
    const newTaskEl = this.#createTask(newTask);

    this.tasks.push(newTask);
    listEl.append(newTaskEl);
    this.#updateTaskCount();
    this.#save();

    // TODO: remove the console logs
    console.log('task added: ', newTask);
    console.dir(this.tasks);
  }

  toggleTask(id) {
    const task = this.tasks.find((t) => t.id === id);
    task.isCompleted = !task.isCompleted;

    const taskEl = document.getElementById(id);
    taskEl.closest('.list__task').classList.toggle('list__task--completed');
    this.#updateTaskCount();
    this.#save();

    // TODO: remove the console logs
    console.log('task toggled: ', task);
    console.dir(this.tasks);
  }

  removeTask(id) {
    const index = this.tasks.findIndex((t) => t.id === id);
    this.tasks.splice(index, 1);

    const taskEl = document.getElementById(id);
    taskEl.closest('.list__task').remove();

    this.#updateTaskCount();
    this.#save();

    // TODO: remove the console logs
    console.log('task deleted of id:', id);
    console.dir(this.tasks);
  }

  clearCompleted() {
    this.tasks = this.tasks.filter((t) => {
      if (t.isCompleted) {
        const taskEl = document
          .getElementById(t.id)
          .closest('.list__task--completed');
        taskEl.remove();

        return false;
      }

      return true;
    });

    this.#save();

    // TODO: remove the console logs
    console.log('completed tasks are cleared');
    console.dir(this.tasks);
  }

  displayAll() {
    const listEl = document.querySelector('.list');
    const taskEls = this.tasks.map((t) => this.#createTask(t));
    listEl.replaceChildren(...taskEls);

    // TODO: remove the console logs
    console.log('display all tasks');
    console.dir(this.tasks);
  }

  displayActive() {
    const listEl = document.querySelector('.list');
    const taskEls = this.tasks
      .filter((t) => !t.isCompleted)
      .map((t) => this.#createTask(t));
    listEl.replaceChildren(...taskEls);

    // TODO: remove the console logs
    console.log('display active tasks');
    console.dir(this.tasks);
  }

  displayCompleted() {
    const listEl = document.querySelector('.list');
    const taskEls = this.tasks
      .filter((t) => t.isCompleted)
      .map((t) => this.#createTask(t));
    listEl.replaceChildren(...taskEls);

    // TODO: remove the console logs
    console.log('display completed tasks');
    console.dir(this.tasks);
  }

  #createTask(task) {
    const taskTemplateEl = document.querySelector('.task-template');
    const taskEl = document.importNode(taskTemplateEl.content, true);
    const taskListEl = taskEl.querySelector('li');
    const taskInputEl = taskEl.querySelector('input');
    const taskLabelEl = taskEl.querySelector('label');

    taskInputEl.id = task.id;
    taskLabelEl.htmlFor = task.id;
    taskLabelEl.textContent = task.description;

    if (task.isCompleted) {
      taskListEl.classList.add('list__task--completed');
      taskInputEl.checked = true;
    }

    return taskListEl;
  }

  #updateTaskCount() {
    const countEl = document.querySelector('.status__count');
    const count = this.tasks.filter((t) => t.isCompleted === false).length;
    if (count) {
      countEl.textContent =
        count > 1 ? `${count} items left` : `${count} item left`;
    } else {
      countEl.textContent = `0 item left`;
    }
  }

  #save() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));

    // TODO: remove the console logs
    console.log('saved the tasks');
    console.dir(this.tasks);
  }
}

const formEl = document.querySelector('.new-task-form');
const listEl = document.querySelector('.list');
const clearEl = document.querySelector('.clear-completed-tasks');
const navEl = document.querySelector('.nav__items');

const todoApp = new App();

formEl.addEventListener('submit', (e) => {
  e.preventDefault();
  const inputEl = e.target.querySelector('#new-task');
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

clearEl.addEventListener('click', (e) => {
  todoApp.clearCompleted();
});

navEl.addEventListener('click', (e) => {
  navEl.querySelector('.nav__current').classList.remove('nav__current');
  e.target.classList.add('nav__current');

  if (e.target.classList.contains('nav__completed')) {
    todoApp.displayCompleted();
  } else if (e.target.classList.contains('nav__active')) {
    todoApp.displayActive();
  } else {
    todoApp.displayAll();
  }
});
