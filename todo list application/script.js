let pendingTasks = [];
let completedTasks = [];

function showPopup(msg) {
  const popup = document.getElementById("popup");
  popup.textContent = msg;
  popup.style.display = "block";
  setTimeout(() => { popup.style.display = "none"; }, 2000);
}

function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  if (!text) {
    showPopup("Please enter your task");
    return;
  }
  pendingTasks.push({ id: Date.now(), text, addedAt: new Date(), completedAt: null });
  input.value = "";
  renderTasks();
}

document.getElementById("taskInput").addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    addTask();
  }
});

function showTrashAnimation() {
  const trashAnim = document.getElementById("trashAnim");
  trashAnim.style.display = "block";
  trashAnim.style.opacity = "1";
  // Fade out after animation duration
  setTimeout(() => {
    trashAnim.style.opacity = "0";
  }, 900);
  setTimeout(() => { trashAnim.style.display = "none"; }, 1100);
}

function showCongratsAnimation() {
  const congratsAnim = document.getElementById("congratsAnim");
  congratsAnim.style.display = "block";
  setTimeout(() => { congratsAnim.style.display = "none"; }, 1300);
}

function toggleTask(id, fromList) {
  if (fromList === "pending") {
    const idx = pendingTasks.findIndex(t => t.id === id);
    if (idx > -1) {
      pendingTasks[idx].completedAt = new Date();
      completedTasks.push(pendingTasks[idx]);
      pendingTasks.splice(idx, 1);
      showCongratsAnimation();
      setTimeout(renderTasks, 1300);
      return;
    }
  } else {
    const idx = completedTasks.findIndex(t => t.id === id);
    if (idx > -1) {
      completedTasks[idx].completedAt = null;
      pendingTasks.push(completedTasks[idx]);
      completedTasks.splice(idx, 1);
      renderTasks();
    }
  }
}

function deleteTask(id, list) {
  showTrashAnimation();
  setTimeout(() => {
    if (list === "pending") {
      pendingTasks = pendingTasks.filter(t => t.id !== id);
    } else {
      completedTasks = completedTasks.filter(t => t.id !== id);
    }
    renderTasks();
  }, 600);
}

function editTask(id) {
  // Find task index
  const taskIdx = pendingTasks.findIndex(t => t.id === id);
  if (taskIdx === -1) return;

  const pList = document.getElementById("pendingList");
  const li = pList.children[taskIdx];
  const detailsDiv = li.querySelector('.task-details');
  const actionsDiv = li.querySelector('.task-actions');

  // If already editing, do nothing
  if (li.querySelector('.editable-input')) return;

  // Clear task details and actions
  detailsDiv.innerHTML = '';
  actionsDiv.innerHTML = '';

  // Create input container
  const editContainer = document.createElement('div');
  editContainer.className = 'edit-container';

  const input = document.createElement('input');
  input.type = 'text';
  input.value = pendingTasks[taskIdx].text;
  input.className = 'editable-input';

  const okBtn = document.createElement('button');
  okBtn.textContent = 'OK';
  okBtn.className = 'ok-btn';

  editContainer.appendChild(input);
  editContainer.appendChild(okBtn);
  detailsDiv.appendChild(editContainer);

  input.focus();

  // Save edit function
  function saveEdit() {
    const val = input.value.trim();
    if (val) {
      pendingTasks[taskIdx].text = val;
      renderTasks();
    } else {
      showPopup('Task cannot be empty');
      input.focus();
    }
  }

  // Cancel edit function (renders list back)
  function cancelEdit() {
    renderTasks();
  }

  okBtn.addEventListener('click', saveEdit);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  });

  // Clicking outside input cancels edit
  function outsideClickListener(event) {
    if (!li.contains(event.target)) {
      cancelEdit();
      document.removeEventListener('click', outsideClickListener);
    }
  }
  setTimeout(() => {
    document.addEventListener('click', outsideClickListener);
  }, 0);
}

function completeTaskAgain(id) {
  showPopup("Task is already completed!");
}

function formatDateTime(date) {
  return date ? date.toLocaleString() : "";
}

function renderTasks() {
  const pList = document.getElementById("pendingList");
  const cList = document.getElementById("completedList");
  pList.innerHTML = "";
  cList.innerHTML = "";

  pendingTasks.forEach((task, i) => {
    const li = document.createElement("li");
    const details = document.createElement("div");
    details.className = "task-details";

    details.innerHTML = `
      <input type="checkbox" class="task-checkbox" onchange="toggleTask(${task.id}, 'pending')">
      <strong data-id="${task.id}">${i + 1}. ${task.text}</strong>
      <span class="task-time">Added: ${formatDateTime(task.addedAt)}</span>
    `;

    const actions = document.createElement("div");
    actions.className = "task-actions";
    actions.innerHTML = `
      <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
      <button class="delete-btn" onclick="deleteTask(${task.id}, 'pending')">Delete</button>
    `;

    li.appendChild(details);
    li.appendChild(actions);
    pList.appendChild(li);
  });

  completedTasks.forEach((task, i) => {
    const li = document.createElement("li");
    li.className = "completed-task";
    const details = document.createElement("div");
    details.className = "task-details";
    details.innerHTML = `
      <input type="checkbox" class="task-checkbox" checked onchange="toggleTask(${task.id}, 'completed')">
      <strong>${i + 1}. ${task.text}</strong>
      <span class="task-time">Added: ${formatDateTime(task.addedAt)} | Completed: ${formatDateTime(task.completedAt)}</span>
    `;
    const actions = document.createElement("div");
    actions.className = "task-actions";
    actions.innerHTML = `
      <button class="complete-btn" onclick="completeTaskAgain(${task.id})">Completed</button>
      <button class="delete-btn" onclick="deleteTask(${task.id}, 'completed')">Delete</button>
    `;
    li.appendChild(details);
    li.appendChild(actions);
    cList.appendChild(li);
  });
}

renderTasks();