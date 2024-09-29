// import { ListModel } from "./list-model.js";

// console.log('main.js loaded');

// const list1 = new ListModel(`taskListData1`);
// const list2 = new ListModel(`taskListData2`);

// list1.addTask('Mergi la magazin');
// list1.addTask('Ia paine');

// list2.addTask('Mananca');
// list2.addTask('Ia un premiu Nobel')

// console.log(list1.tasks);
// console.log(list2.tasks);

// // list.deleteTask(0);
// // list.deleteTask(1);
// // list.deleteTask(2);

// // list.toggleTask(5);

// // list.clearTaskList();


// //ADD A VIEW
import { ListController } from "./list-controller.js";

console.log('main.js working');

const parentElem = document.querySelector('.container');
const newListBtn = document.querySelector('.new-list-card');

function loadStoredLists(){
    const storedLists = JSON.parse(localStorage.getItem('storedLists')) || [];
    
    storedLists.forEach((uniqueID) => {
        new ListController(parentElem, uniqueID);
    });
};

newListBtn.addEventListener('click', () => {
    new ListController(parentElem);
});

window.addEventListener('load', loadStoredLists);

