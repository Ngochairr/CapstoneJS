import { Cart } from "./Cart.js";
// Lấy API
const API_URL =
  "https://6a79df16674f43f4db11e28f.mockapi.io/api/v1/Products";
// Define các object
let productList = [];
let cart = [];

//Lấy hàng bằng axios
function getProducts() {
  axios({
    method: "GET",
    url: API_URL,
  })
    .then(function (response) {

      productList = response.data;

      renderProducts(productList);
    })
    .catch(function (error) {
      console.log("Error getting products:", error);
    });
}

// Hiện các hàng
function renderProducts(products) {
  // tạo html cho danh sách các hàng
  let html = "";

  products.forEach(function (product) {
    // thêm mỗi hàng trong API vào danh sách
    html += `
      <div class="card">

        <img
          src="${product.img}"
          class="card-img-top product-img"
          alt="${product.name}"
        >

        <div class="card-body">

          <h3 class="card-title">
            ${product.name}
          </h3>

          <p class="product__price">
            $${product.price}
          </p>

          <p>
            <strong>Màn Hình:</strong>
            ${product.screen}
          </p>

          <p>
            <strong>Camera Sau:</strong>
            ${product.blackCamera}
          </p>

          <p>
            <strong>Camera Trước:</strong>
            ${product.frontCamera}
          </p>

          <p>
            ${product.desc}
          </p>

          <button
            class="btn btn-dark"
            onclick="addToCart('${product.id}')"
          >
            Thêm Hàng
          </button>

        </div>
      </div>
    `;
  });

  document.getElementById("productList").innerHTML = html;
}
//Tạo giỏ hàng
function renderTable(ds) {
  //Tạo tổng giá và số lượng
  let totalPrice = 0;
  let totalQuantity = 0;

  let html = ds.map((item) => {
    let { id, name, price, img, quantity } = item;
    //Tổng số lượng hàng này
    let itemTotal = price * quantity;
    //thêm tổng hàng và lượng
    totalPrice += itemTotal;
    totalQuantity += quantity;

    //render html
    return `
      <tr>
        <td>
          <img src="${img}" alt="${name}" width="80">
        </td>

        <td>${name}</td>

        <td>$${price}</td>

        <td>
          <button
            class="btn btn-sm btn-secondary"
            onclick="decreaseQuantity('${id}')"
          >
            -
          </button>

          <span class="mx-2">${quantity}</span>

          <button
            class="btn btn-sm btn-secondary"
            onclick="increaseQuantity('${id}')"
          >
            +
          </button>
        </td>

        <td>$${itemTotal}</td>

        <td>
          <button
            class="btn btn-danger btn-sm"
            onclick="removeFromCart('${id}')"
          >
            Xóa
          </button>
        </td>
      </tr>
    `;
  });
  //gắn html
  document.querySelector("#cartList").innerHTML = html.join("");
  //thay đổi giá tổng
  document.querySelector("#totalPrice").innerHTML =
    `$${totalPrice}`;
  //thay đổi lượng hàng trong giỏ
  document.querySelector("#cartCount").innerHTML =
    totalQuantity;
}

//cho drop down câu 4, lọc dựa vào giá trị value trong các lựa chọn của dropdown, all cho thấy mọi thứ
function filterProducts() {
  const type = document.getElementById("filterType").value;

  if (type === "all") {
    renderProducts(productList);
    return;
  }

  const filteredProducts = productList.filter(function (product) {
    return product.type === type;
  });

  renderProducts(filteredProducts);
}

//thêm hàng vào giỏ, khởi động bởi nút "Thêm Hàng"
function addToCart(id) {
  //tìm hàng trong danh sách nhận từ API dựa vào id
  const product = productList.find(function (item) {
    return item.id === id;
  });
  //dừng nếu không có hàng
  if (!product) {
    return;
  }
  //tìm hàng trong giỏ, xem sửa có chưa 
  const cartItem = cart.find(function (item) {
    return item.id === id;
  });
//có thì thêm lượng, không thì thêm hàng mới vào giỏ
  if (cartItem) {
    cartItem.quantity++;
  } else {
    const newCart = new Cart(product, 1);
    cart.push(newCart);
  }

  renderTable(cart);
  saveCart();
}
//thêm lượng
function increaseQuantity(id) {
  const index = cart.findIndex(function (item) {
    return item.id === id;
  });

  if (index !== -1) {
    cart[index].quantity++;
  }

  renderTable(cart);
  saveCart();
}

//giảm lượng, giảm xuống không thì xóa
function decreaseQuantity(id) {
  const index = cart.findIndex(function (item) {
    return item.id === id;
  });

  if (index !== -1) {
    cart[index].quantity--;

    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
  }

  renderTable(cart);
  saveCart();
}

//Cho nút xóa để xóa hàng ngay lập tức
function removeFromCart(id) {
  const index = cart.findIndex(function (item) {
    return item.id === id;
  });

  if (index !== -1) {
    cart.splice(index, 1);
  }

  renderTable(cart);
  saveCart();
}

//lưu và load trạng thái giỏ hàng từ lần trước đã lên trang
function saveCart() {
  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );
}


function loadCart() {
  const data = localStorage.getItem("cart");

  if (data) {
    cart = JSON.parse(data);
  }

  renderTable(cart);
}

//bây giờ chỉ reset trang khi bấm
function checkout() {
  if (cart.length === 0) {
    alert("Giỏ thiếu hàng!");
    return;
  }

  alert("Thanh toán thành công!");

  // Clear cart
  cart = [];

  // Clear localStorage
  localStorage.removeItem("cart");

  // Update UI
  getProducts();
  renderTable(cart);  
}



//cho phép html sử dụng mấy function vì đang sử dụng "module"
window.filterProducts = filterProducts;
window.addToCart = addToCart;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.removeFromCart = removeFromCart;
window.checkout = checkout;

//initialize
getProducts();
loadCart();