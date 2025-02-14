// função para adicionar tarefas
function addTask() {
    const input = document.getElementById("taskInput");
    const taskText = input.value.trim();
    if (!taskText) return;

    const prioritySelect = document.getElementById("taskPriority");
    const priority = prioritySelect.value;

    const dateInput = document.getElementById("taskDueDate");
    const dueDate = dateInput.value;

    const li = document.createElement("li");
    li.classList.add("todo-item");
    li.setAttribute("draggable", "true");

    // Criando botão de concluir
    const doneButton = document.createElement("button");
    doneButton.textContent = "✅";
    doneButton.onclick = () => {
        li.classList.toggle("done");
        saveTasks();
    };

    // Criando botão de remover
    const removeButton = document.createElement("button");
    removeButton.textContent = "❌";
    removeButton.onclick = () => {
        li.remove();
        saveTasks();
    };

    // Adicionando o texto da tarefa
    const taskSpan = document.createElement("span");
    taskSpan.classList.add("task-text");
    taskSpan.textContent = taskText;

    // Adicionando Div de prioridade
    const priorityDiv = document.createElement("div");
    priorityDiv.classList.add("priority-emoji");

    switch (priority) {
        case "low":
            priorityDiv.textContent = '🟡'; 
            break;
        case "normal":
            priorityDiv.textContent = '🟠'; 
            break;
        case "high":
            priorityDiv.textContent = '🔴'; 
            break;
        default:
            priorityDiv.textContent = "";
    }

    // Adicionando a data da tarefa
    const dateSpan = document.createElement("span");
    dateSpan.classList.add("task-date");

    if (dueDate) {
        const [year, month, day] = dueDate.split("-").map(Number);
        const formattedDate = new Date(year, month - 1, day);

        if (!isNaN(formattedDate)) {
            dateSpan.textContent = ` 📅 ${formattedDate.toLocaleDateString("pt-BR")}`;
        } else {
            dateSpan.textContent = ""; // Caso a data não seja válida
        }
    } else {
        dateSpan.textContent = ""; // Se não houver data, não exibe nada
    }

    // Container para os botões
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");
    buttonContainer.appendChild(doneButton);
    buttonContainer.appendChild(removeButton);

    // Adicionando os elementos ao <li> Lembre de que se você mudar a ordem, a ordem de exibição também mudará	
    li.appendChild(priorityDiv); // Div de prioridade
    li.appendChild(taskSpan); // Texto da tarefa
    li.appendChild(dateSpan); // Data da tarefa
    li.appendChild(buttonContainer); // Botões

    // Adicionando a tarefa à lista de tarefas
    const taskList = document.getElementById("taskList");
    taskList.appendChild(li);

    // Chama saveTasks para armazenar a tarefa no localStorage
    saveTasks();
    input.value = "";
    dateInput.value = ""; // Limpa o campo de data após adicionar a tarefa

    // Adicionando eventos de arrasto com drag and drop
    li.addEventListener('dragstart', dragStart);
    li.addEventListener('dragend', dragEnd);

    // Adiciona eventos de toque (dispositivos móveis)
    li.addEventListener('touchstart', touchStart);
    li.addEventListener('touchmove', touchMove);
    li.addEventListener('touchend', touchEnd);
}

// Função para alternar play/pause na música
document.getElementById("playPauseBtn").addEventListener("click", function() {
    const audio = document.getElementById("lofi");
    if (audio.paused) {
        audio.play(); // Toca a música
        this.innerHTML = "🔇"; // Troca para o ícone de pausa
    } else {
        audio.pause(); // Pausa a música
        this.innerHTML = "🎶"; // Troca para o ícone de play
    }
});

// Atribui um volume padrão logo que a música for carregada
const audio = document.getElementById("lofi");
audio.volume = 0.1;  // Define o volume para 10% do volume máximo (valor entre 0 e 1)

// Função de filtro de tarefas
function filterTasks() {
    const filterValue = document.getElementById("filter").value;
    const taskList = document.getElementById("taskList");
    const tasks = taskList.getElementsByTagName("li");

    // Percorre todas as tarefas e aplica o filtro
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const isDone = task.classList.contains("done");

        if (filterValue === "all") {
            task.classList.remove("hidden"); // Mostra todas as tarefas
        } else if (filterValue === "pending" && !isDone) {
            task.classList.remove("hidden"); // Mostra tarefas pendentes
        } else if (filterValue === "completed" && isDone) {
            task.classList.remove("hidden"); // Mostra tarefas concluídas
        } else {
            task.classList.add("hidden"); // Esconde as que não se encaixam
        }
    }
}

// Função para salvar as tarefas no localStorage
function saveTasks() {
    const tasks = [];
    const taskItems = document.querySelectorAll("#taskList li");

    taskItems.forEach((item) => {
        const taskText = item.querySelector(".task-text")?.textContent.trim() || "";
        const isDone = item.classList.contains("done");
        const dueDate = item.querySelector(".task-date")?.textContent.trim() || "";
        const priorityDiv = item.querySelector(".priority-emoji")?.textContent.trim() || "";
        let priority = "";

        switch (priorityDiv) {
            case "🟡":
                priority = "low";
                break;
            case "🟠":
                priority = "normal";
                break;
            case "🔴":
                priority = "high";
                break;
        }

        tasks.push({ 
            text: taskText, 
            done: isDone, 
            dueDate: dueDate,
            priority: priority 
        });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// Função para carregar as tarefas salvas ao carregar a página
function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; // Limpa a lista antes de carregar as tarefas

    savedTasks.forEach(task => {
        const li = document.createElement("li");
        li.classList.add("todo-item");
        if (task.done) li.classList.add("done"); // Adiciona a classe "done" se a tarefa estiver concluída
        li.setAttribute("draggable", "true");

        // Botão de concluir
        const doneButton = document.createElement("button");
        doneButton.textContent = "✅";
        doneButton.onclick = () => {
            li.classList.toggle("done");
            saveTasks();
        };

        // Botão de remover
        const removeButton = document.createElement("button");
        removeButton.textContent = "❌";
        removeButton.onclick = () => {
            li.remove();
            saveTasks();
        };

        // Texto da tarefa
        const taskSpan = document.createElement("span");
        taskSpan.classList.add("task-text");
        taskSpan.textContent = task.text;

        // Data da tarefa
        const dateSpan = document.createElement("span");
        dateSpan.classList.add("task-date");
        dateSpan.textContent = task.dueDate;

        // Prioridade da tarefa
        const priorityDiv = document.createElement("div");
        priorityDiv.classList.add("priority-emoji");

        switch (task.priority) {
            case "low":
                priorityDiv.textContent = "🟡";
                break;
            case "normal":
                priorityDiv.textContent = "🟠";
                break;
            case "high":
                priorityDiv.textContent = "🔴";
                break;
            default:
                priorityDiv.textContent = "";
        }

        // Container para os botões
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");
        buttonContainer.appendChild(doneButton);
        buttonContainer.appendChild(removeButton);

        // Adiciona os elementos ao <li>
        li.appendChild(priorityDiv);
        li.appendChild(taskSpan);
        li.appendChild(dateSpan);
        li.appendChild(buttonContainer);

        // Adiciona a tarefa à lista
        taskList.appendChild(li);

        // Adiciona eventos de arrasto
        li.addEventListener('dragstart', dragStart);
        li.addEventListener('dragend', dragEnd);

        // Adiciona eventos de toque (dispositivos móveis)
        li.addEventListener('touchstart', touchStart);
        li.addEventListener('touchmove', touchMove);
        li.addEventListener('touchend', touchEnd);


    });
}
// Funções de arrastar e soltar
let draggedItem = null;
let touchStartY = 0;
let touchCurrentY = 0;

function dragStart(e) {
    draggedItem = e.target;
    e.target.classList.add('dragging');
    setTimeout(() => {
        e.target.style.opacity = '0.4';
    }, 0);
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
    setTimeout(() => {
        e.target.style.opacity = '1';
        draggedItem = null;
        saveTasks(); // Salva a nova ordem das tarefas
    }, 0);
}

function dragOver(e) {
    e.preventDefault();
    const afterElement = getDragAfterElement(e.clientY);
    const taskList = document.getElementById("taskList");

    if (afterElement == null) {
        taskList.appendChild(draggedItem);
    } else {
        taskList.insertBefore(draggedItem, afterElement);
    }
}

function getDragAfterElement(y) {
    const draggableElements = [...document.querySelectorAll('.todo-item:not(.dragging)')];

    return draggableElements.reduce(
        (closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset, element: child };
            } else {
                return closest;
            }
        },
        { offset: Number.NEGATIVE_INFINITY }
    ).element;
}

// Funções para o arrasto com toque
function touchStart(e) {
    draggedItem = e.target.closest('.todo-item'); // Certifique-se de que o item arrastado é um .todo-item
    if (!draggedItem) return; // Se não houver item arrastado, saia da função
    touchStartY = e.touches[0].clientY; // Posição inicial do toque
    draggedItem.classList.add('dragging');
    setTimeout(() => {
        draggedItem.style.opacity = '0.4';
    }, 0);
}

function touchMove(e) {
    if (!draggedItem) return;
    e.preventDefault(); // Impede o comportamento padrão (como rolar a página)
    touchCurrentY = e.touches[0].clientY;
    const offsetY = touchCurrentY - touchStartY;
   // Move o item arrastado
    draggedItem.style.transform = `translateY(${offsetY}px)`;

   // Calcula a nova posição na lista
    const afterElement = getDragAfterElement(touchCurrentY);
    const taskList = document.getElementById("taskList");

    if (afterElement == null) {
        taskList.appendChild(draggedItem);
    } else {
        taskList.insertBefore(draggedItem, afterElement);
    }

    // Atualiza a posição inicial para o próximo movimento
    touchStartY = touchCurrentY;
}

function touchEnd(e) {
    if (!draggedItem) return;

    // Armazena a referência ao elemento em uma variável local
    const item = draggedItem;

    draggedItem.classList.remove('dragging');
    item.style.transition = 'transform 0.2s ease, opacity 0.2s ease'; // Adiciona transição suave
    item.style.transform = 'none';

    setTimeout(() => {
        if (item) { // Verifica se o item ainda existe
            item.style.opacity = '1';
            item.style.transition = ''; // Remove a transição após o término
        }
        draggedItem = null; // Limpa a referência global
        saveTasks(); // Salva a nova ordem das tarefas
    }, 200);
}

// Adicionando os eventos de arrasto e toque
function addDragAndTouchEvents() {
    const taskList = document.getElementById("taskList");
    taskList.addEventListener('dragover', dragOver);

    // Eventos de toque para dispositivos móveis
    taskList.addEventListener('touchstart', touchStart, { passive: false });
    taskList.addEventListener('touchmove', touchMove, { passive: false });
    taskList.addEventListener('touchend', touchEnd);
}

// Função para alternar o modo escuro/claro
function toggleDarkMode() {
    const body = document.body;
    const button = document.getElementById('toggleDarkMode');
    body.classList.toggle('dark-mode');
    button.classList.toggle('dark-mode');

    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);

    button.innerHTML = isDarkMode ? '🌞' : '🌙';
}

// Carrega o modo escuro/claro salvo no localStorage
function loadDarkModePreference() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    const toggleDarkModeBtn = document.getElementById('toggleDarkMode');
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        toggleDarkModeBtn.classList.add('dark-mode');
        toggleDarkModeBtn.innerHTML = '🌞';
    } else {
        toggleDarkModeBtn.innerHTML = '🌙';
    }
}

// Adiciona evento de tecla "Enter" para adicionar tarefas, dentro do campo de texto
document.getElementById("taskInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addTask();
    }
});

// Função para deletar todas as tarefas
document.getElementById("deleteAllBtn").addEventListener("click", function() {
    const taskList = document.getElementById("taskList");
    
    // Remove todos os itens da lista
    while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
    }

    // Limpa o localStorage
    localStorage.removeItem("tasks");

    alert("Todas as tarefas foram deletadas!");
});

// Inicializa a aplicação pelo evento de carregamento da página
window.onload = function() {
    loadTasks();
    loadDarkModePreference();
    document.getElementById('toggleDarkMode').addEventListener('click', toggleDarkMode);

    // Adiciona eventos de arrastar e soltar à lista de tarefas
    const taskList = document.getElementById("taskList");
    taskList.addEventListener('dragover', dragOver);
    addDragAndTouchEvents(); // Adiciona os eventos de toque também
};