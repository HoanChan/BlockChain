const TheoDoi = artifacts.require("TheoDoi");

module.exports = async function (deployer) {
  await deployer.deploy(TheoDoi);
  const contractInstance = await TheoDoi.deployed();
  for (const product of sampleProducts) {
    const data = `${product.ten}|${product.nhaSanXuat}|${product.loaiSanPham}|${product.kichThuoc}|${product.trongLuong}|${product.hanSuDung}`;
    await contractInstance.taoSP(product.id, data);
    const sanPham = await contractInstance.xemSP(product.id);
    console.log('Sản phẩm:', sanPham);
  }
  for (const product of sampleProducts) {
    let startTime = randomStartTime();
    const randomIndex = Math.floor(Math.random() * sampleTransports.length);
    for (let j = 0; j < randomIndex; j++) {
      const thoiGian = new Date(startTime += 3600000).toISOString();
      const diaDiem = randomLocation();
      const { tenTrangThai, loaiTrangThai, moTaChiTiet } = sampleTransports[j];
      const data = `${tenTrangThai}|${thoiGian}|${diaDiem}|${loaiTrangThai}|${moTaChiTiet}`;
      await contractInstance.capNhat(product.id, data);
    }
    const lichSu = await contractInstance.xemLS(product.id);
    console.log('Lịch sử trạng thái sản phẩm:', lichSu);
  }
  console.log("Contract Address:", contractInstance.address);
};


const sampleProducts = [
  {
    id: "SP-20240001",
    ten: "Nước Giải Khát",
    nhaSanXuat: "Công ty Đồ Uống 123",
    loaiSanPham: "Đồ uống",
    kichThuoc: "8x15",
    trongLuong: "0.6",
    hanSuDung: "2026-11-20"
  },

  {
    id: "TP-20240002",
    ten: "Thực Phẩm Đóng Hộp",
    nhaSanXuat: "Công ty Thực Phẩm XYZ",
    loaiSanPham: "Thực phẩm",
    kichThuoc: "12x12",
    trongLuong: "1.2",
    hanSuDung: "2027-09-18"
  },

  {
    id: "DD-20240003",
    ten: "Đồ Dùng Gia Đình",
    nhaSanXuat: "Công ty Gia Dụng ABC",
    loaiSanPham: "Gia dụng",
    kichThuoc: "20x10",
    trongLuong: "2.5",
    hanSuDung: "2028-06-30"
  },

  {
    id: "DT-20240004",
    ten: "Điện Thoại Thông Minh",
    nhaSanXuat: "Công ty Công Nghệ DEF",
    loaiSanPham: "Điện tử",
    kichThuoc: "6x3",
    trongLuong: "0.15",
    hanSuDung: "2029-01-01"
  },

  {
    id: "MT-20240005",
    ten: "Máy Tính Xách Tay",
    nhaSanXuat: "Công ty Máy Tính GHI",
    loaiSanPham: "Điện tử",
    kichThuoc: "35x25",
    trongLuong: "1.8",
    hanSuDung: "2030-05-22"
  }
];

const sampleTransports = [
  {
    tenTrangThai: "Đang sản xuất",
    loaiTrangThai: "Sản xuất",
    moTaChiTiet: "Hoàn thiện sản phẩm và đóng gói"
  },

  {
    tenTrangThai: "Đang vận chuyển",
    loaiTrangThai: "Vận chuyển",
    moTaChiTiet: "Vận chuyển tới kho hàng"
  },

  {
    tenTrangThai: "Nhập kho",
    loaiTrangThai: "Nhập kho",
    moTaChiTiet: "Nhập kho hàng"
  },

  {
    tenTrangThai: "Đang trưng bày",
    loaiTrangThai: "Trưng bày",
    moTaChiTiet: "Trưng bày tại trung tâm thương mại"
  },

  {
    tenTrangThai: "Xuất kho",
    loaiTrangThai: "Vận chuyển",
    moTaChiTiet: "Giao hàng cho khách"
  },

  {
    tenTrangThai: "Đã giao hàng",
    loaiTrangThai: "Vận chuyển",
    moTaChiTiet: "Giao hàng"
  },

  {
    tenTrangThai: "Đã nhận hàng",
    loaiTrangThai: "Vận chuyển",
    moTaChiTiet: "Khách hàng đã nhận hàng"
  }
];

function randomLocation() {
  const locations = ["Hà Nội", "Nha Trang", "Sài Gòn", "Đà Nẵng", "Hải Phòng"];
  return locations[Math.floor(Math.random() * locations.length)];
}

function randomStartTime() {
  return Date.now() + Math.floor(Math.random() * 1e7);
}
