export class ListView {
    constructor(parentElem, uniqueID) {
        this.parentElem = parentElem;
        this.cardTitle = null;
        this.list = null;
        this.newTaskBtn = null;
        this.editTitleBtn = null;
        this.background = null;
        this.uniqueID = uniqueID;

        this.init();
        window.addEventListener(`taskListChange${this.uniqueID}`, (e) => this.updateUI(e));
    }

    init(){
        this.initTaskList();
        // this.initNewPopup();
    }

    initTaskList(){
        const card = document.createElement('div');
        card.classList.add('test-card');
        this.parentElem.append(card);

        const header = document.createElement('div');
        header.classList.add('card-header');
        card.append(header);

        this.title = document.createElement('div');
        this.title.classList.add('card-title')
        header.append(this.title);
        this.title.textContent = 'New to-do list';

        this.editTitleBtn = document.createElement('span');
        this.editTitleBtn.classList.add('edit-title-btn');
        this.editTitleBtn.textContent = '✏️';
        this.editTitleBtn.addEventListener('click', () => this.initNewPopup('Edit Title', 16, `editTitleRequest${this.uniqueID}`));
        this.title.append(this.editTitleBtn);
        
        const body = document.createElement('card-body');
        body.classList.add(card-body);
        card.append(body);
        
        this.list = document.createElement('ol');
        body.append(this.list);
        
        this.newTaskBtn = document.createElement('div');
        this.newTaskBtn.classList.add('new-li-btn');
        body.append(this.newTaskBtn);
        this.newTaskBtn.textContent = '+';
        this.newTaskBtn.addEventListener('click', () => this.initNewPopup('Add a new task', 40, `createTaskRequest${this.uniqueID}`));
    }


    initNewPopup(popupText, inputMaxLength, eventName){
        console.log('test');

        this.background = document.createElement('div');
        this.background.classList.add('transparent-bg', 'hidden');
        this.parentElem.append(this.background);
        this.background.classList.remove('hidden');

        this.newPopupContainer = document.createElement('div');
        this.newPopupContainer.classList.add('new-input-container');
        this.background.append(this.newPopupContainer);
        this.newPopupContainer.textContent = popupText;
    
        this.newInput = document.createElement('textarea');
        this.newInput.classList.add('new-input');
        this.newPopupContainer.append(this.newInput);
        this.newInput.maxLength = inputMaxLength;
    
        this.confirmBtn = document.createElement('div');
        this.confirmBtn.classList.add('confirm-btn');
        this.newPopupContainer.append(this.confirmBtn);
        this.confirmBtn.textContent = 'CONFIRM';

        this.confirmBtn.addEventListener('click', () => {
            this.background.classList.add('hidden');
            const event = new CustomEvent(eventName, {
                detail: {
                    name: this.newInput.value,
                    createdAt: Date.now()
                }
            });  
            window.dispatchEvent(event);
        });
    }
    

    updateUI(event){
            this.list.innerHTML = '';
            event.detail.tasks.forEach((task, index) => {
    
                const li = document.createElement('li');
                this.list.append(li);
                
                const liTextContainer = document.createElement('span');
                liTextContainer.classList.add('li-text-container')
                liTextContainer.textContent = task.name;
                
                console.log(task.createdAt);
                
                
                if(task.done){
                    liTextContainer.classList.add('task-completed');
                }
    
                li.append(liTextContainer);
                
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = '🗑️';
                deleteBtn.classList.add('delete-btn');
                li.append(deleteBtn);
    
                liTextContainer.addEventListener('click', () => {
                    console.log(`Toggle task ${index}`);
                    const event = new CustomEvent(`toggleTaskRequest${this.uniqueID}`, {
                        detail: {
                            index
                        }
                    });
                    
                    window.dispatchEvent(event);
                });
    
                deleteBtn.addEventListener('click', () => {
                    const event = new CustomEvent(`deleteTaskRequest${this.uniqueID}`, {
                        detail: {
                            index
                        }
                    });
    
                    window.dispatchEvent(event);
                })
            });
        if(event.detail.tasks.length == 4){
            console.log(event.detail.tasks.length);
            this.newTaskBtn.classList.add('hidden');
        }
        else{
            console.log(event.detail.tasks.length);
            
            this.newTaskBtn.classList.remove('hidden');
        }
    
        
    }
}