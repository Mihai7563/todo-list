export class ListModel{
    #tasks;
    #title;
    #localStorageIndex;

    constructor(localStorageIndex, uniqueID){
        this.uniqueID = uniqueID;
        this.#localStorageIndex = localStorageIndex;
        this.storedData = this.#retrieveStoredData();
        this.#tasks = this.storedData.tasks;
        this.#title = this.storedData.title || 'Untitled List';
        this.colors = ['#ff7eb9', '#7afcff', '#feff9c'];
        this.tilts = ['left', 'none', 'right'];
        this.taskListStyles = {
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            tilt: this.tilts[Math.floor(Math.random() * this.tilts.length)]
        }

        this.addRandomStyles();
        
        window.addEventListener('load', () => {
            this.dispatchTitleChangeEvent();
            this.dispatchTaskListChangeEvent();
        })
        
        window.addEventListener(`createTaskRequest${this.uniqueID}`, (e) => this.addTask(e.detail));
        window.addEventListener(`toggleTaskRequest${this.uniqueID}`, (e) => this.toggleTask(e.detail.index));
        window.addEventListener(`deleteTaskRequest${this.uniqueID}`, (e) => this.deleteTask(e.detail.index));
        window.addEventListener(`editTitleRequest${this.uniqueID}`, (e) => this.editTitle(e.detail))
    }
    
    
    #retrieveStoredData(){
        const storedData = localStorage.getItem(this.#localStorageIndex);
        return storedData ? JSON.parse(storedData) : {tasks: [], title: ''};
    }   

    
    #storeData(){
        const dataToStore = {
            title: this.#title,
            tasks: this.#tasks
        }
        localStorage.setItem(this.#localStorageIndex, JSON.stringify(dataToStore));
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
        
        console.log(`Dispatching addRandomStyles event with data:`, this.taskListStyles);
        
        setTimeout(() => {
            window.dispatchEvent(event);
        }, 250);
    }
    
    addTask(newTask){
        this.#tasks.push({
            name: newTask.name,
            createdAt: newTask.createdAt,
            completed: false
        });

        this.#storeData();

        this.dispatchTaskListChangeEvent();
    }
    
    
    deleteTask(taskIndex){
        this.checkTaskIndex(taskIndex) && this.#tasks.splice(taskIndex, 1);
        this.#storeData();

        this.dispatchTaskListChangeEvent();
    }
    

    clearTaskList(){
        this.#tasks = [];
        this.#storeData();
    }
    

    toggleTask(taskIndex){
        this.checkTaskIndex(taskIndex) && (this.#tasks[taskIndex].completed = !this.#tasks[taskIndex].completed);
        this.#storeData();

        this.dispatchTaskListChangeEvent();
    }


    checkTaskIndex(taskIndex){
        !this.#tasks[taskIndex] && console.error(`Invalid tasklist index ${taskIndex}`);
        return Boolean(this.#tasks[taskIndex]);
    }

    editTitle(title){
        this.#title = title.name;

        this.#storeData();

        this.dispatchTitleChangeEvent();

        console.log(this.#title);
        
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

    dispatchTitleChangeEvent(){
        console.log(this.#title);
        
        const titleChangedEvent = new CustomEvent(`titleChange${this.uniqueID}`, {
            detail: {
                title: this.#title,
                type: 'titleEvent'
            }
        });

        window.dispatchEvent(titleChangedEvent);
    }
}