export class Product {
  constructor(data = {}) {
    this.id = data.id;
    this.name = data.name;
    this.price = data.price;
    this.screen = data.screen;
    this.backCamera = data.backCamera;
    this.frontCamera = data.frontCamera;
    this.img = data.img;
    this.desc = data.desc;
    this.type = data.type;
  }
}
