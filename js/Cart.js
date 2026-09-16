export class Cart {
  constructor(product, quantity) {
    this.id = product.id;
    this.name = product.name;
    this.price = product.price;
    this.img = product.img;
    this.quantity = quantity;
  }
}