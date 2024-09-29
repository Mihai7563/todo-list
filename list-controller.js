import { ListModel } from "./list-model.js";
import { ListView } from "./list-view.js";

export class ListController{
    constructor(parentElem, uniqueID = null){
        this.uniqueID = uniqueID || Date.now();

        this.model = new ListModel(`taskListData${this.uniqueID}`, this.uniqueID);
        this.view = new ListView(parentElem, this.uniqueID);

        if(!uniqueID){
            this.saveListData();
        }
    }

    saveListData() {
        const storedLists = JSON.parse(localStorage.getItem('storedLists')) || [];
        storedLists.push(this.uniqueID);
        localStorage.setItem('storedLists', JSON.stringify(storedLists));
    }
}