const STORAGE_KEY = 'todo-list-items-v1';
let tasks = loadTasks();
let currentFilter = 'all';

const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const taskCount = document.getElementById('taskCount');
const progressText = document.getElementById('progressText');
const progressBar = document.getElementById('progressBar');
const progressPercent = document.getElementById('progressPercent');
const progressRing = document.querySelector('.progress-ring');
const dateText = document.getElementById('dateText');
const clearCompleted = document.getElementById('clearCompleted');

dateText.textContent = new Intl.DateTimeFormat(undefined, {
  weekday: 'long', month: 'long', day: 'numeric'
}).format(new Date());

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.unshift({ id: crypto.randomUUID(), text, completed: false, createdAt: Date.now() });
  saveTasks();
  taskInput.value = '';
  taskInput.focus();
  render();
}

function toggleTask(id) {
  tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  render();
}

function filteredTasks() {
  if (currentFilter === 'active') return tasks.filter(t => !t.completed);
  if (currentFilter === 'completed') return tasks.filter(t => t.completed);
  return tasks;
}

function render() {
  taskList.innerHTML = '';
  const visible = filteredTasks();

  visible.forEach(task => {
    const row = document.createElement('article');
    row.className = `task${task.completed ? ' completed' : ''}`;
    row.innerHTML = `
      <button class="check" type="button" aria-label="${task.completed ? 'Mark as active' : 'Mark as completed'}">✓</button>
      <div class="task-main">
        <p class="task-text"></p>
        <div class="task-meta">${task.completed ? 'Completed' : 'To do'}</div>
      </div>
      <button class="delete" type="button" aria-label="Delete task">✕</button>
    `;
    row.querySelector('.task-text').textContent = task.text;
    row.querySelector('.check').addEventListener('click', () => toggleTask(task.id));
    row.querySelector('.delete').addEventListener('click', () => deleteTask(task.id));
    taskList.appendChild(row);
  });

  emptyState.hidden = visible.length !== 0;
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  progressText.textContent = `${completed} of ${total} completed`;
  progressBar.style.width = `${percent}%`;
  progressPercent.textContent = `${percent}%`;
  progressRing.style.background = `radial-gradient(circle at center, #020617 57%, transparent 58%), conic-gradient(#818cf8 ${percent * 3.6}deg, #1e293b 0deg)`;
  taskCount.textContent = `${total} task${total === 1 ? '' : 's'}`;
  clearCompleted.disabled = completed === 0;

  document.querySelectorAll('.filter').forEach(btn => btn.classList.toggle('active', btn.dataset.filter === currentFilter));
}

addButton.addEventListener('click', addTask);
taskInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') addTask();
});
document.querySelectorAll('.filter').forEach(btn => {
  btn.addEventListener('click', () => { currentFilter = btn.dataset.filter; render(); });
});
clearCompleted.addEventListener('click', () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  render();
});

render();
