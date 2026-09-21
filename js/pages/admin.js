import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService.js";

import {
  kiemTraRong,
  kiemTraSo,
  kiemTraUrl,
  kiemTraChon,
  xoaLoi,
} from "../validation.js";

// DOM
const tbodySanPham = document.querySelector("#tbodySanPham");
const loading = document.querySelector("#loading");
const btnThemSP = document.querySelector("#btnThemSP");
const btnLuu = document.querySelector("#btnLuu");
const btnXacNhanXoa = document.querySelector("#btnXacNhanXoa");
const txtTimKiem = document.querySelector("#txtTimKiem");
const selectSapXep = document.querySelector("#selectSapXep");
const modalTieuDe = document.querySelector("#modalTieuDe");
const formSanPham = document.querySelector("#formSanPham");
const noiDungXoa = document.querySelector("#noiDungXoa");

const modalSanPham = new bootstrap.Modal("#modalSanPham");
const modalXoa = new bootstrap.Modal("#modalXoa");

const CAC_O_NHAP = [
  "name",
  "price",
  "screen",
  "backCamera",
  "frontCamera",
  "img",
  "desc",
  "type",
];

const CAC_SPAN_LOI = [
  "tbName",
  "tbPrice",
  "tbScreen",
  "tbBackCamera",
  "tbFrontCamera",
  "tbImg",
  "tbDesc",
  "tbType",
];

let danhSachGoc = [];
let idDangSua = null;
let idChoXoa = null;

// GET ALL PRODUCT
async function layDanhSach() {
  try {
    loading.classList.remove("d-none");

    danhSachGoc = await getProducts();

    renderBang();
  } catch (err) {
    tbodySanPham.innerHTML = `
      <tr>
        <td colspan="9">
          <div class="alert alert-danger mb-0">
            Không thể tải dữ liệu sản phẩm
          </div>
        </td>
      </tr>
    `;
  } finally {
    loading.classList.add("d-none");
  }
}

function locVaSapXep() {
  const tuKhoa = txtTimKiem.value.toLowerCase().trim();
  const kieuSapXep = selectSapXep.value;

  let ketQua = danhSachGoc.filter(function (item) {
    return item.name.toLowerCase().includes(tuKhoa);
  });

  if (kieuSapXep === "asc") {
    ketQua = [...ketQua].sort(function (a, b) {
      return Number(a.price) - Number(b.price);
    });
  }

  if (kieuSapXep === "desc") {
    ketQua = [...ketQua].sort(function (a, b) {
      return Number(b.price) - Number(a.price);
    });
  }

  return ketQua;
}

function renderBang() {
  const danhSach = locVaSapXep();

  if (danhSach.length === 0) {
    tbodySanPham.innerHTML = `
      <tr>
        <td colspan="9" class="text-center text-muted py-4">
          Không tìm thấy sản phẩm nào
        </td>
      </tr>
    `;
    return;
  }

  const html = danhSach.map(function (item, index) {
    const { id, name, price, screen, backCamera, frontCamera, img, type } =
      item;

    return `
      <tr>
        <td>${index + 1}</td>

        <td>
          <img src="${img}" alt="${name}" class="admin__thumb">
        </td>

        <td>${name}</td>

        <td>$${price}</td>

        <td>${type}</td>

        <td>${screen}</td>

        <td>${backCamera}</td>

        <td>${frontCamera}</td>

        <td>
          <button
            class="btn btn-warning btn-sm"
            data-action="sua"
            data-id="${id}"
          >
            Sửa
          </button>

          <button
            class="btn btn-danger btn-sm"
            data-action="xoa"
            data-id="${id}"
          >
            Xóa
          </button>
        </td>
      </tr>
    `;
  });

  tbodySanPham.innerHTML = html.join("");
}

function layDuLieuForm() {
  const duLieu = {};

  CAC_O_NHAP.forEach(function (idONhap) {
    duLieu[idONhap] = document.querySelector(`#${idONhap}`).value;
  });

  return duLieu;
}

function doDuLieuVaoForm(product) {
  CAC_O_NHAP.forEach(function (idONhap) {
    const giaTri = product[idONhap];

    document.querySelector(`#${idONhap}`).value =
      giaTri === undefined || giaTri === null ? "" : giaTri;
  });
}

// VALIDATION
function kiemTraForm(duLieu) {
  const hopLe = [
    kiemTraRong(duLieu.name, "tbName", "Tên sản phẩm không được để trống"),
    kiemTraSo(duLieu.price, "tbPrice", "Giá phải là số lớn hơn 0"),
    kiemTraRong(duLieu.screen, "tbScreen", "Màn hình không được để trống"),
    kiemTraRong(
      duLieu.backCamera,
      "tbBackCamera",
      "Camera sau không được để trống",
    ),
    kiemTraRong(
      duLieu.frontCamera,
      "tbFrontCamera",
      "Camera trước không được để trống",
    ),
    kiemTraUrl(
      duLieu.img,
      "tbImg",
      "Link hình ảnh phải bắt đầu bằng http:// hoặc https://",
    ),
    kiemTraRong(duLieu.desc, "tbDesc", "Mô tả không được để trống"),
    kiemTraChon(duLieu.type, "tbType", "Vui lòng chọn loại sản phẩm"),
  ];

  return hopLe.every(function (ketQua) {
    return ketQua === true;
  });
}

// THÊM SẢN PHẨM
function moModalThem() {
  idDangSua = null;

  modalTieuDe.innerHTML = "Thêm sản phẩm";

  formSanPham.reset();
  xoaLoi(CAC_SPAN_LOI);

  modalSanPham.show();
}

// CẬP NHẬT SẢN PHẨM
async function moModalSua(id) {
  try {
    loading.classList.remove("d-none");

    const product = await getProductById(id);

    idDangSua = id;

    modalTieuDe.innerHTML = "Cập nhật sản phẩm";

    formSanPham.reset();
    xoaLoi(CAC_SPAN_LOI);
    doDuLieuVaoForm(product);

    modalSanPham.show();
  } catch (err) {
    alert("Không lấy được thông tin sản phẩm!");
  } finally {
    loading.classList.add("d-none");
  }
}

// LƯU
async function luuSanPham() {
  const duLieu = layDuLieuForm();

  if (!kiemTraForm(duLieu)) {
    return;
  }

  const payload = {
    name: duLieu.name.trim(),
    price: Number(duLieu.price),
    screen: duLieu.screen.trim(),
    backCamera: duLieu.backCamera.trim(),
    frontCamera: duLieu.frontCamera.trim(),
    img: duLieu.img.trim(),
    desc: duLieu.desc.trim(),
    type: duLieu.type,
  };

  try {
    btnLuu.disabled = true;

    if (idDangSua === null) {
      await createProduct(payload);
    } else {
      await updateProduct(idDangSua, payload);
    }

    modalSanPham.hide();

    await layDanhSach();
  } catch (err) {
    alert("Lưu sản phẩm thất bại!");
  } finally {
    btnLuu.disabled = false;
  }
}

// XÓA SẢN PHẨM
function moModalXoa(id) {
  const product = danhSachGoc.find(function (item) {
    return item.id === id;
  });

  idChoXoa = id;

  noiDungXoa.innerHTML = product
    ? `Bạn có chắc muốn xóa sản phẩm <strong>${product.name}</strong>?`
    : "Bạn có chắc muốn xóa sản phẩm này?";

  modalXoa.show();
}

async function thucHienXoa() {
  if (idChoXoa === null) {
    return;
  }

  try {
    btnXacNhanXoa.disabled = true;

    await deleteProduct(idChoXoa);

    modalXoa.hide();

    idChoXoa = null;

    await layDanhSach();
  } catch (err) {
    alert("Xóa sản phẩm thất bại!");
  } finally {
    btnXacNhanXoa.disabled = false;
  }
}

btnThemSP.addEventListener("click", moModalThem);
btnLuu.addEventListener("click", luuSanPham);
btnXacNhanXoa.addEventListener("click", thucHienXoa);

txtTimKiem.addEventListener("input", renderBang);
selectSapXep.addEventListener("change", renderBang);

tbodySanPham.addEventListener("click", function (event) {
  const btn = event.target.closest("[data-action]");

  if (!btn) {
    return;
  }

  const action = btn.dataset.action;
  const id = btn.dataset.id;

  if (action === "sua") {
    moModalSua(id);
  }

  if (action === "xoa") {
    moModalXoa(id);
  }
});

layDanhSach();
