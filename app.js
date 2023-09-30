
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js"
import { getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"

const appSettings = {
    databaseURL: "https://meal-components-default-rtdb.europe-west1.firebasedatabase.app/"
}


if("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js")
        .then((reg) => console.log("service worker registered", reg))
        .catch((err) => console.error("service worker not registered"), err); 
} else {
    ;
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const itemsInDB =  ref(database, "items");

console.log(app);
console.log(database);

const itemInputEl = document.getElementById("itemInput");
const addToCartBtnEl = document.getElementById("addItemButton");
const shoppingListEl = document.getElementById("shopping-list");

//append item to shopping list
function addToShoppinglist(item, IDitem) {
    let ItemEl = document.createElement("li");

    ItemEl.append(item)
    shoppingListEl.append(ItemEl)
    console.log("item added")

    let itemID = IDitem

    ItemEl.addEventListener("click", function() {

        let exactLocationItem = ref(database, `items/${itemID}`);
        
        console.log(exactLocationItem);
        
        remove(exactLocationItem)
 
    });

}



//clear input
function clearInput() {
    itemInputEl.value = "";
}




//clear items on shopping list
function clearItems() {
    shoppingListEl.innerHTML = "";
}

//when DB is updated append items to ul
onValue(itemsInDB, function(snapshot){

    if(snapshot.exists()) {
        let itemsInArray = Object.entries(snapshot.val())
        clearItems()
    
        const itemsAmount = itemsInArray.length
    
        for(let i = 0; i  < itemsAmount; i++) {
    
            let currentItem = itemsInArray[i];
    
            let currentItemID = currentItem[0];
            let currentItemValue = currentItem[1];
            
            console.log(currentItem)
    
            addToShoppinglist(currentItemValue, currentItemID)
            
        }
    
    }else {
        console.log("empty snapshot")
        clearItems()
    }

})

//after click add items to DB
addToCartBtnEl.addEventListener("click", function() {

    let inputValue = itemInputEl.value;

    if(inputValue == "") {
        ;
    } else {
        clearItems();
        push(itemsInDB, inputValue);
        clearInput();
        console.log("you have added the item to your database");
    }

    
})



//catagorize ingredients. and save specific things.