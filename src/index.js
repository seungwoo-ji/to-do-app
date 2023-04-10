import './assets/styles/style.css';

class Task {
  constructor(description) {
    this.id = Date.now().toString();
    this.isCompleted = false;
    this.description = description;
  }
}

class App {
  #tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  #isDarkMode = JSON.parse(localStorage.getItem('darkMode')) || false;

  constructor() {
    if (this.#isDarkMode) this.toggleDarkMode();
    this.#updateTaskCount();
    this.displayAll();
  }

  addTask(description) {
    const listEl = document.querySelector('.list');
    const newTask = new Task(description);
    const newTaskEl = this.#connectDrag(this.#createTask(newTask));

    this.#tasks.push(newTask);
    listEl.append(newTaskEl);
    this.#updateTaskCount();
    this.#save();
  }

  toggleTask(id) {
    const task = this.#tasks.find((t) => t.id === id);
    task.isCompleted = !task.isCompleted;

    const taskEl = document.getElementById(id);
    taskEl.closest('.list__task').classList.toggle('list__task--completed');
    this.#updateTaskCount();
    this.#save();
  }

  removeTask(id) {
    const index = this.#tasks.findIndex((t) => t.id === id);
    this.#tasks.splice(index, 1);

    const taskEl = document.getElementById(id);
    taskEl.closest('.list__task').remove();

    this.#updateTaskCount();
    this.#save();
  }

  clearCompleted() {
    this.#tasks = this.#tasks.filter((t) => {
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
  }

  displayAll() {
    const listEl = document.querySelector('.list');
    const taskEls = this.#tasks.map((t) =>
      this.#connectDrag(this.#createTask(t))
    );
    listEl.replaceChildren(...taskEls);
  }

  displayActive() {
    const listEl = document.querySelector('.list');
    const taskEls = this.#tasks
      .filter((t) => !t.isCompleted)
      .map((t) => this.#connectDrag(this.#createTask(t)));
    listEl.replaceChildren(...taskEls);
  }

  displayCompleted() {
    const listEl = document.querySelector('.list');
    const taskEls = this.#tasks
      .filter((t) => t.isCompleted)
      .map((t) => this.#connectDrag(this.#createTask(t)));
    listEl.replaceChildren(...taskEls);
  }

  toggleDarkMode() {
    const body = document.body;
    this.#isDarkMode = body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', this.#isDarkMode);
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
    const count = this.#tasks.filter((t) => t.isCompleted === false).length;
    if (count) {
      countEl.textContent =
        count > 1 ? `${count} items left` : `${count} item left`;
    } else {
      countEl.textContent = `0 item left`;
    }
  }

  #save() {
    localStorage.setItem('tasks', JSON.stringify(this.#tasks));
  }

  #connectDrag(taskEl) {
    taskEl.setAttribute('draggable', true);
    taskEl.addEventListener('drag', this.#handleDrag.bind(this));
    taskEl.addEventListener('dragend', this.#handleDrop.bind(this));
    taskEl.addEventListener('dragover', (e) => e.preventDefault());

    return taskEl;
  }

  #handleDrag(event) {
    const draggedEl = event.target;
    const listEl = draggedEl.parentNode;
    const coordX = event.clientX;
    const coordY = event.clientY;
    const currentEl = document.elementFromPoint(coordX, coordY);

    draggedEl.classList.add('dragging-task');

    if (currentEl && currentEl.parentNode === listEl) {
      if (currentEl === draggedEl) return;

      const draggedIndex = this.#tasks.findIndex(
        (t) => t.id === draggedEl.querySelector('input').id
      );
      const task = this.#tasks.splice(draggedIndex, 1);
      const currentIndex = this.#tasks.findIndex(
        (t) => t.id === currentEl.querySelector('input').id
      );

      // dragging the task upwards
      if (draggedEl === currentEl.nextSibling) {
        listEl.insertBefore(draggedEl, currentEl);
        this.#tasks.splice(currentIndex, 0, ...task);
      }
      // dragging the task downwards
      else {
        listEl.insertBefore(draggedEl, currentEl.nextSibling);
        this.#tasks.splice(currentIndex + 1, 0, ...task);
      }
    }
  }

  #handleDrop(event) {
    event.target.classList.remove('dragging-task');
    this.#save();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const formEl = document.querySelector('.new-task-form');
  const listEl = document.querySelector('.list');
  const clearEl = document.querySelector('.clear-completed-tasks');
  const navEls = document.querySelectorAll('.nav__items');
  const themeEl = document.querySelector('.theme-switcher');
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

  navEls.forEach((navEl) => {
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
  });

  themeEl.addEventListener('click', (e) => {
    todoApp.toggleDarkMode();
  });
});
