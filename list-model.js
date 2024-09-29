export class ListModel{
    #tasks;
    #localStorageIndex;

    constructor(localStorageIndex, uniqueID){
        this.uniqueID = uniqueID;
        this.#localStorageIndex = localStorageIndex;
        this.#tasks = this.#retrieveStoredTasks();
        this.taskListStyles = {
            color: ['#ff7eb9', '#7afcff', '#feff9c'],
            tilt: ['left', 'none', 'right']
        }

        window.addEventListener(`createTaskRequest${this.uniqueID}`, (e) => this.addTask(e.detail));
        window.addEventListener(`toggleTaskRequest${this.uniqueID}`, (e) => this.toggleTask(e.detail.index));
        window.addEventListener(`deleteTaskRequest${this.uniqueID}`, (e) => this.deleteTask(e.detail.index));
    }


    #retrieveStoredTasks(){
        const storedData = localStorage.getItem(this.#localStorageIndex);
        return storedData ? JSON.parse(storedData) : [];
    }   


    #storeTasks(){
        localStorage.setItem(this.#localStorageIndex, JSON.stringify(this.#tasks));
    }
    
    
    get tasks(){
        return this.#tasks;
    }
    
    //TODO: RANDOM COLOR AND TILT FOR EVERY LIST

    addTask(newTask){
        this.#tasks.push({
            name: newTask.name,
            createdAt: newTask.createdAt,
            completed: false
        });

        this.#storeTasks();

        this.dispatchTaskListChangeEvent();
    }
    
    
    deleteTask(taskIndex){
        this.checkTaskIndex(taskIndex) && this.#tasks.splice(taskIndex, 1);
        this.#storeTasks();

        this.dispatchTaskListChangeEvent();
    }
    

    clearTaskList(){
        this.#tasks = [];
        this.#storeTasks();
    }
    

    toggleTask(taskIndex){
        this.checkTaskIndex(taskIndex) && (this.#tasks[taskIndex].completed = !this.#tasks[taskIndex].completed);
        this.#storeTasks();
    }


    checkTaskIndex(taskIndex){
        !this.#tasks[taskIndex] && console.error(`Invalid tasklist index ${taskIndex}`);
        return Boolean(this.#tasks[taskIndex]);
    }

    dispatchTaskListChangeEvent(){
        const taskChangedEvent = new CustomEvent(`taskListChange${this.uniqueID}`, {
            detail: {
                tasks: this.#tasks
            }
        });

        window.dispatchEvent(taskChangedEvent);
    }
}