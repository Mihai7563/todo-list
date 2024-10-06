export class ListModel{
    #tasks;
    #localStorageIndex;

    constructor(localStorageIndex, uniqueID){
        this.uniqueID = uniqueID;
        this.#localStorageIndex = localStorageIndex;
        this.#tasks = this.#retrieveStoredTasks();
        this.colors = ['#ff7eb9', '#7afcff', '#feff9c'];
        this.tilts = ['left', 'none', 'right'];
        this.taskListStyles = {
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            tilt: this.tilts[Math.floor(Math.random() * this.tilts.length)]
        }

        this.addRandomStyles();
        this.dispatchTaskListChangeEvent();
        
        window.addEventListener(`createTaskRequest${this.uniqueID}`, (e) => this.addTask(e.detail));
        window.addEventListener(`toggleTaskRequest${this.uniqueID}`, (e) => this.toggleTask(e.detail.index));
        window.addEventListener(`deleteTaskRequest${this.uniqueID}`, (e) => this.deleteTask(e.detail.index));
        window.addEventListener(`editTitleRequest${this.uniqueID}`, (e) => this.editTitle(e.detail))
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
    addRandomStyles(){
        const event = new CustomEvent(`addRandomStyles${this.uniqueID}`, {
            detail: {
                color: this.taskListStyles.color,
                tilt: this.taskListStyles.tilt
            }
        });
        
        console.log(`Dispatching addRandomStyles event with data: ${this.taskListStyles}`);
        console.log(this.taskListStyles);
        

        window.dispatchEvent(event);
    }
    
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

    editTitle(title){
        const titleChangedEvent = new CustomEvent(`titleChange${this.uniqueID}`, {
            detail: {
                name: title.name,
                type: 'titleEvent'
            }
        });

        window.dispatchEvent(titleChangedEvent);
    }

    dispatchTaskListChangeEvent(){
        const taskChangedEvent = new CustomEvent(`taskListChange${this.uniqueID}`, {
            detail: {
                tasks: this.#tasks,
                type: 'taskListEvent' 
            }
        });

        window.dispatchEvent(taskChangedEvent);
    }
}