import { v4 as uuidv4 } from "uuid";

class Item {
    constructor(
        private _name: string,
        private _description: string,
        private _price: number,
        private _id: string = uuidv4()
    ) {}
    public get name(): string {
        return this._name;
    }
    
    public set name(value: string) {
        this._name = value;
    }
    public get price(): number {
        return this._price;
    }
    public set price(value: number) {
        this._price = value;
    }
    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }
    public get description(): string {
        return this._description;
    }
    public set description(value: string) {
        this._description = value;
    }   

   public itemElement(): HTMLDivElement {  
    const itemDiv = document.createElement("div");
    itemDiv.innerHTML = `<div class="card item-card" style="width: 18rem;height: 18rem">
    <div class="card-body">
    <h5 class="card-title">${this._name}</h5>
    <p class="card-text">${this._description}</p>
    <p class="card-text">${this._price}</p>
    <button class="btn btn-primary" id="addToCart">Add to Cart</button>
    </div>
    </div>
    `;
    const addToCartButton = itemDiv.querySelector("#addToCart") as HTMLButtonElement;
    addToCartButton.onclick = () => {
        Shop.myUser!.addToCart(this);
    }
    return itemDiv;
   }

}   

class User {
    constructor(
        private _username: string,
        private _age: number,
        private _id: string = uuidv4(),
        private _cart: Item[] = []
    ) {}
    public get username(): string { 
        return this._username;
    }
    public set username(value: string) {
        this._username = value;
    }
    public get age(): number {
        return this._age;
    }
    public set age(value: number) {
        this._age = value;
    }
    public get id(): string {
        return this._id;
    }   
    public set id(value: string) {
        this._id = value;
    }
    public get cart(): Item[] {
        return this._cart;
    }
    public set cart(value: Item[]) {
        this._cart = value;
    }
    public addToCart(item: Item): void {
        this._cart.push(item);
        Shop.updateCart();
    }   
    public cartTotal() { 
        let total = 0;
        for(let item of this._cart) {
            total += item.price;
        }
        return total;
    }
    public printCart() {
        for(let item of this._cart) {
            console.log(item.name);
        }   
    }
    public removeFromCart(item: Item): void {
        this._cart = this._cart.filter((cartItem) => cartItem.id !== item.id);
        Shop.updateCart();
    }   
    public removeQuantityFromCart(item: Item): void {
        const index = this._cart.findIndex((cartItem) => cartItem.id === item.id);
        if (index >= 0) {
            this._cart.splice(index, 1);
        }
        Shop.updateCart();
    }
    public cartElement(): HTMLDivElement {
        const cartEle = document.createElement("table");
        for(const item of new Set(this._cart)) {
         const rmButton = document.createElement("button");
         rmButton.id = `${item.id}-rm1`;
         rmButton.innerText = "X";
         rmButton.classList.add("btn", "btn-danger");
         rmButton.onclick = () => {
            Shop.myUser!.removeFromCart(item);
         }
         cartEle.innerHTML += `<tr>
         <td>${item.name}</td>
         <td>${item.price}</td>
         <td>${this.cart.filter((i)=>i.id === item.id).length}</td>
         <td>${rmButton.outerHTML}</td>
         </tr>`;
        }
        cartEle.innerHTML += `<tr id="totalbar"><td>Total</td><td>${this.cartTotal().toFixed(2)}</td></tr>`;
        return cartEle;
    }
    addRemoveButton() {
        for(const item of new Set(this._cart)) {
            const rmButton = document.getElementById(`${item.id}-rm1`);
            if(rmButton) {
                rmButton.onclick = () => {
                    Shop.myUser!.removeFromCart(item);
                }
            }
        }
    }
    static createUser(): User | undefined {
        const age = parseInt((<HTMLInputElement>document.getElementById("age")).value);
        const username = (<HTMLInputElement>document.getElementById("username")).value;
        if(username.length > 0 && age > 0) {
            document.getElementById("landing")!.style.visibility = "visible";
            document.getElementById("shopDiv")!.style.visibility = "visible";
            document.getElementById("cartDiv")!.style.visibility = "visible";
        return new User(username, age);
    }
    return
}
}

class Shop {
    static myUser: User | undefined;
    constructor(
        private _items: Item[] = []
    ) {
        this._items.push(new Item("Apple","this is an apple", 0.99));
        this._items.push(new Item("Banana","this is a bannana", 0.49));
        this._items.push(new Item("Orange","this is an orange", 0.89));
        this.showItems();
        Shop.myUser!.cart = [];
        Shop.updateCart();
    }
    public get items(): Item [] {
        return this._items;
    }
    public set items(value: Item[]) {
        this._items = value;
    }
    public showItems() {
     const shopDiv = document.getElementById("shopDiv")!;
        for(const item of this._items) {
            shopDiv.appendChild(item.itemElement());
        }
    }
    static updateCart() {
        const cartDiv = document.getElementById("cartDiv")!;
        if(Shop.myUser!.cart.length <= 0) {
            cartDiv.innerHTML = "<p>Cart is empty</p>";
        }else{
            cartDiv.replaceChildren(Shop!.myUser!.cartElement());
            cartDiv.innerHTML = `<h3>Cart</h3>` + cartDiv.innerHTML;
            Shop.myUser!.addRemoveButton();
        }
    }
    static loginUser(e: Event): void {
        e.preventDefault();
        Shop.myUser = User.createUser();
        if(Shop.myUser) {
            document.getElementById("loginDiv")!.remove();
            new Shop();
        }
    }
}
/*
function hideLoginDiv() {
  const loginDiv = document.getElementById("loginDiv");
  if (loginDiv) {
    loginDiv.style.display = "none";
    document.getElementById("landing")!.style.visibility = "visible";
    document.getElementById("shopDiv")!.style.visibility = "visible";
    document.getElementById("cartDiv")!.style.visibility = "visible";
  }
}
let user: User | null = null;
const loginForm = document.getElementById("loginForm")!;
loginForm.addEventListener("submit", (e: any) => {
  e.preventDefault();
  const usernameInput = <HTMLInputElement>document.getElementById("username");
  const ageInput = <HTMLInputElement>document.getElementById("age");
  alert(`Hello ${usernameInput.value}, you are ${ageInput.value} years old`);
  if (usernameInput.value && ageInput.value) {
   //  user = User.createUser(usernameInput.value, parseInt(ageInput.value));
    hideLoginDiv();
   
  }
});
*/
document.getElementById("loginForm")!.addEventListener("submit", (e:Event) => {e.preventDefault();
    Shop.loginUser(e)});

