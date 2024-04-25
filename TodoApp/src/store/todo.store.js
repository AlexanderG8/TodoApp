import { Todo } from "../todos/models/todo.model";

export const Filters = {
    All :'all',
    Completed : 'Completed',
    Pending : 'Pending'
}

const state = {
    todos :[
        new Todo('Piedra del alma'),
        new Todo('Piedra del infinito'),
        new Todo('Piedra del tiempo'),
        new Todo('Piedra del poder'),
        new Todo('Piedra del realidad'),
    ],
    filter: Filters.All
}

const initStore = () =>{
    loadStore();
    console.log('InitStore');
}

const loadStore = () => {
    if(!localStorage.getItem('state')) return;
    const {todos = [], filter = Filters.All} = JSON.parse(localStorage.getItem('state'));
    state.todos = todos;
    state.filter = filter;
}

const saveStateLocalStorage = () => {
    localStorage.setItem('state',JSON.stringify(state));
}

/**
 * Functión que servirá para el filtro de la lista de tareas.
 * @param {String} filter
 * @returns
 */
const getTodos = ( filter = Filters.All ) =>{
    switch (filter) {
        case Filters.All:
            return [...state.todos];
        case Filters.Completed:
            return state.todos.filter( todo => todo.done );
        case Filters.Pending:
            return state.todos.filter ( todo => !todo.done );
        default:
            throw new Error(`Option ${filter} is not valid.`);
    }
}

/**
 * Función para agregar una tarea
 * @param {String} description
 */
const addTodo = (description ) =>{
    if( !description ) throw new Error('Description is required');
    state.todos.push( new Todo(description));

    saveStateLocalStorage();
}
/**
 * Función para cambiar estado
 * @param {String} todoId
 */
const toggleTodo = ( todoId ) =>{
    state.todos = state.todos.map(todo => {
        if(todo.id === todoId) todo.done = !todo.done;
        return todo;
    });

    saveStateLocalStorage();
}

/**
 * Función para eliminar una tarea en específico
 * @param {String} todoId
 */
const deleteTodo = ( todoId ) =>{
    state.todos = state.todos.filter( todo => todo.id !== todoId );
    saveStateLocalStorage();
}

/**
 * Función para eliminar todas las tareas terminadas.
 */
const deleteComplete = () =>{
    state.todos = state.todos.filter( todo => !todo.done );
    saveStateLocalStorage();
}

/**
 * Función para saber que filtro quiere seleccionar
 * @param {Filters} newFilter
 */
const setFilter = ( newFilter = Filters.All ) =>{
    state.filter = newFilter;
    saveStateLocalStorage();
}

/**
 * Función para tener control de acceso a funciones.
 */
const getCurrentFilter = () =>{
    return state.filter;
}

export default{
    addTodo,
    deleteComplete,
    deleteTodo,
    getCurrentFilter,
    getTodos,
    initStore,
    loadStore,
    setFilter,
    toggleTodo,
}