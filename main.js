export function createTaskTable(tasks) {
    const viewOptions = document.querySelector('.viewOptions');
    const tableContainer = document.querySelector('#taskTable');
    const gridContainer = document.createElement('div');

    gridContainer.classList.add('grid-container');
    tableContainer.parentElement.append(gridContainer);

    const tableLink = viewOptions.querySelector('a[data-view="table"]');
    const gridLink = viewOptions.querySelector('a[data-view="grid"]');

    tableContainer.style.display = 'table';
    gridContainer.style.display = 'none';

    tableLink.onclick = (event) => {
        event.preventDefault();
        tableContainer.style.display = 'table';
        gridContainer.style.display = 'none';
        tableLink.classList.add('active');
        gridLink.classList.remove('active');
    };

    gridLink.onclick = (event) => {
        event.preventDefault();
        tableContainer.style.display = 'none';
        gridContainer.style.display = 'grid';
        gridLink.classList.add('active');
        tableLink.classList.remove('active');

        gridContainer.innerHTML = '';

        tasks.forEach(task => {
            const gridItem = document.createElement('div');
            gridItem.classList.add('grid-item');

            const title = document.createElement('div');
            const description = document.createElement('div');
            const date = document.createElement('div');
            const time = document.createElement('div');
            const status = document.createElement('div');

            title.classList.add('title');
            description.classList.add('description');
            date.classList.add('date');
            time.classList.add('time');
            status.classList.add('status', task.status.replace(' ', '-').toLowerCase());

            title.textContent = task.title;
            description.textContent = task.description;
            date.textContent = `Дата: ${task.date}`;
            time.textContent = `Время: ${task.time}`;
            status.textContent = task.status;

            gridItem.append(title, description, date, time, status);
            gridContainer.append(gridItem);

            gridItem.ondblclick = () => openModal(task);
        });
    };

    tableContainer.querySelector('tbody').innerHTML = '';

    tasks.forEach(task => {
        const row = document.createElement('tr');
        const titleCell = document.createElement('td');
        const descriptionCell = document.createElement('td');
        const dateCell = document.createElement('td');
        const timeCell = document.createElement('td');
        const statusCell = document.createElement('td');

        titleCell.textContent = task.title;
        descriptionCell.textContent = task.description;
        dateCell.textContent = task.date;
        timeCell.textContent = task.time;
        statusCell.textContent = task.status;

        statusCell.classList.add('status');

        if (task.status === "Не выполнено") {
            statusCell.classList.add('not-completed');
        } else if (task.status === "Готово") {
            statusCell.classList.add('completed');
        } else if (task.status === "В прогрессе") {
            statusCell.classList.add('in-progress');
        }

        row.append(titleCell, descriptionCell, dateCell, timeCell, statusCell);
        tableContainer.querySelector('tbody').append(row);

        row.ondblclick = () => openModal(task);
    });
}

function openModal(task) {
    const modal = document.getElementById('modal');
    const form = document.getElementById('taskForm');

    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description;
    document.getElementById('taskDate').value = task.date;
    document.getElementById('taskTime').value = task.time;
    document.getElementById('taskStatus').value = task.status;

    modal.style.display = 'block';

    form.onsubmit = (event) => {
        event.preventDefault();

        task.title = document.getElementById('taskTitle').value;
        task.description = document.getElementById('taskDescription').value;
        task.date = document.getElementById('taskDate').value;
        task.time = document.getElementById('taskTime').value;
        task.status = document.getElementById('taskStatus').value;

        updateTaskOnServer(task);

        updateTaskDisplay();
        modal.style.display = 'none';
    };
}

function updateTaskOnServer(task) {
    fetch(`http://localhost:3001/tasks/${task.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Task updated:', data);
        })
        .catch(error => {
            console.error('Error updating task:', error);
        });
}

function updateTaskDisplay() {
    const tableContainer = document.querySelector('#taskTable');
    const gridContainer = document.querySelector('.grid-container');

    tableContainer.querySelector('tbody').innerHTML = '';
    gridContainer.innerHTML = '';

    fetch("http://localhost:3001/tasks")
        .then(res => res.json())
        .then(data => {
            createTaskTable(data);
        });
}

document.querySelector('.close').onclick = () => {
    document.getElementById('modal').style.display = 'none';
};

fetch("http://localhost:3001/tasks")
    .then(res => res.json())
    .then(data => createTaskTable(data));

document.getElementById('openCreateModalButton').onclick = () => {
    document.getElementById('create-modal').style.display = 'block';
};

document.querySelector('.close-create-modal').onclick = () => {
    document.getElementById('create-modal').style.display = 'none';
};

document.getElementById('createTaskForm').onsubmit = (event) => {
    event.preventDefault();

    const newTask = {
        title: document.getElementById('createTaskTitle').value,
        description: document.getElementById('createTaskDescription').value,
        date: document.getElementById('createTaskDate').value,
        time: document.getElementById('createTaskTime').value,
        status: document.getElementById('createTaskStatus').value
    };

    createTaskOnServer(newTask);
    document.getElementById('create-modal').style.display = 'none';
    updateTaskDisplay();
};

function createTaskOnServer(task) {
    fetch("http://localhost:3001/tasks", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Task created:', data);
        })
        .catch(error => {
            console.error('Error creating task:', error);
        });
}
