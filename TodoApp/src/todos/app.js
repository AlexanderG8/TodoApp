import html from './app.html?raw';
import todoStore, { Filters } from '../store/todo.store';
import { renderTodos, renderPending } from './use-cases';

const ElementIds = {
    TodoList: '.todo-list',
    NewTodoInput: '#new-todo-input',
    ClearComplete: '.clear-completed',
    ClassFiltro: '.filtro',
    PendingCountLabel : '#pending-count',
}

/**
 *
 * @param {String} elementId
 */
export const App = (elementId) =>{

    /**
     * Función para mostrar en el html los Todos
     */
    const displayTodos = () =>{
        const todos = todoStore.getTodos( todoStore.getCurrentFilter());
        renderTodos(ElementIds.TodoList, todos);
        updatePendingCount();
    }

    const updatePendingCount = () =>{
        renderPending(ElementIds.PendingCountLabel);
    }


    //Cuando la función App() se llama
    (() =>{
        const app = document.createElement('div');
        app.innerHTML = html;
        document.querySelector(elementId).append(app);
        displayTodos();
    })();

    //Referencias HTML
    const newDescriptionInput = document.querySelector(ElementIds.NewTodoInput);
    const todoListUL = document.querySelector(ElementIds.TodoList);
    const clearCompleteBotton = document.querySelector(ElementIds.ClearComplete);
    const claseFiltro = document.querySelectorAll(ElementIds.ClassFiltro);

    //Evento agregar
    newDescriptionInput.addEventListener('keyup', (event) => {
        if(event.keyCode !== 13) return;
        if(event.target.value.trim().length === 0) return;

        todoStore.addTodo(event.target.value);
        displayTodos();
        event.target.value = '';
    });

    todoListUL.addEventListener('click', (event) => {
        //La función closest buscará de mi elemento padre la propiedad 'data-id'
        const element = event.target.closest('[data-id]');
        //Luego indicamos que terminamos esta tarea con la función desarrollada toggleTodo
        todoStore.toggleTodo(element.getAttribute('data-id'));
        //Mandamos a realizar la nueva lista
        displayTodos();
    });

    todoListUL.addEventListener('click', (event) =>{
        //Obtenemos la clase
        const idDestroyElement = event.target.className === 'destroy';
        //La función closest buscará de mi elemento padre la propiedad 'data-id'
        const element = event.target.closest('[data-id]');
        //Validamos que si el valor element o idDestroyElement no son true que no haga nada
        if( !element || !idDestroyElement) return;
        //Sino eliminamos el todo
        todoStore.deleteTodo(element.getAttribute('data-id'));
        //Volvemos a listar
        displayTodos();
    });

    clearCompleteBotton.addEventListener('click', (event) =>{
        todoStore.deleteComplete();
        displayTodos();
    });

    claseFiltro.forEach(element => {
        element.addEventListener('click', (element) => {
            //Remuevo la clase selected de toda la lista
            claseFiltro.forEach(el => el.classList.remove('selected'));
            //Y le agrego al que ha sido seleccionado
            element.target.classList.add('selected');

            switch(element.target.text){
                case 'Todos':
                    todoStore.setFilter( Filters.All );
                    break;
                case 'Pendientes':
                    todoStore.setFilter( Filters.Pending );
                    break;
                case 'Completados':
                    todoStore.setFilter( Filters.Completed );
                    break;
            }

            displayTodos();
        });
    });
}


