import { PRODUCT_URL } from "../config.js";
import { Product } from "../models/Product.js";

// GET ALL PRODUCT
export async function getProducts() {
  try {
    const response = await axios.get(PRODUCT_URL);
    return response.data.map((item) => new Product(item));
  } catch (err) {
    console.error("[Lỗi] getProducts:", err);
    throw err;
  }
}

// GET PRODUCT BY ID
export async function getProductById(id) {
  try {
    const response = await axios.get(`${PRODUCT_URL}/${id}`);
    return new Product(response.data);
  } catch (err) {
    console.error("[Lỗi] getProductById:", err);
    throw err;
  }
}

// CREATE PRODUCT
export async function createProduct(payload) {
  try {
    const response = await axios.post(PRODUCT_URL, payload);
    return new Product(response.data);
  } catch (err) {
    console.error("[Lỗi] createProduct:", err);
    throw err;
  }
}

// UPDATE PRODUCT
export async function updateProduct(id, payload) {
  try {
    const response = await axios.put(`${PRODUCT_URL}/${id}`, payload);
    return new Product(response.data);
  } catch (err) {
    console.error("[Lỗi] updateProduct:", err);
    throw err;
  }
}

// DELETE PRODUCT
export async function deleteProduct(id) {
  try {
    const response = await axios.delete(`${PRODUCT_URL}/${id}`);
    return response.data;
  } catch (err) {
    console.error("[Lỗi] deleteProduct:", err);
    throw err;
  }
}
