const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

async function fetchTasks(){
  try {
    const res = await fetch('/api/GetTasks');
    if(!res.ok) return [];
    return await res.json();
  } catch(e) {
    console.error('fetchTasks error', e);
    return [];
  }
}

async function render(){
  const tasks = await fetchTasks();
  taskList.innerHTML = '';
  tasks.forEach(t => {
    const li = document.createElement('li');
    li.textContent = t.text;
    if (t.done) li.classList.add('completed');

    const del = document.createElement('button');
    del.textContent = '✖';
    del.className = 'delete';
    del.onclick = async (ev) => {
      ev.stopPropagation();
      await fetch('/api/DeleteTask', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ id: t.id })
      });
      render();
    };

    li.onclick = async () => {
      // Toggle done via simple patch (backend not implemented toggling, could extend)
      // For now frontend updates by re-fetch after delete/add
    };

    li.appendChild(del);
    taskList.appendChild(li);
  });
}

addBtn.onclick = async () => {
  const text = taskInput.value.trim();
  if(!text) return;
  await fetch('/api/AddTask', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ text })
  });
  taskInput.value = '';
  render();
};

render();
