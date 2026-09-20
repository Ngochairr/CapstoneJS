function hienLoi(spanId, message) {
  const span = document.getElementById(spanId);

  if (span) {
    span.innerHTML = message;
  }
}

export function kiemTraRong(value, spanId, message) {
  if (value.trim() === "") {
    hienLoi(spanId, message);
    return false;
  }

  hienLoi(spanId, "");
  return true;
}

export function kiemTraSo(value, spanId, message) {
  const so = Number(value);

  if (value.trim() === "" || isNaN(so) || so <= 0) {
    hienLoi(spanId, message);
    return false;
  }

  hienLoi(spanId, "");
  return true;
}

export function kiemTraUrl(value, spanId, message) {
  const regexUrl = /^https?:\/\/.+/;

  if (!regexUrl.test(value.trim())) {
    hienLoi(spanId, message);
    return false;
  }

  hienLoi(spanId, "");
  return true;
}

export function kiemTraChon(value, spanId, message) {
  if (value === "") {
    hienLoi(spanId, message);
    return false;
  }

  hienLoi(spanId, "");
  return true;
}

export function xoaLoi(spanIds) {
  spanIds.forEach(function (spanId) {
    hienLoi(spanId, "");
  });
}
