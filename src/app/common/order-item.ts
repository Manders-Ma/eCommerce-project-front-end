import { CartItem } from "./cart-item";

export class OrderItem {
    imageUrl: String;
    unitPrice: number;
    quantity: number;
    productId: String;

    constructor(cartItem: CartItem){
        this.imageUrl = cartItem.imageUrl;
        this.unitPrice = cartItem.unitPrice;
        this.quantity = cartItem.quantity;
        this.productId = cartItem.id.toString();
    }
}
