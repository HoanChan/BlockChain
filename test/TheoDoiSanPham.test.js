const TheoDoiSanPham = artifacts.require("TheoDoiSanPham");

contract("TheoDoiSanPham", (accounts) => {
  let contractInstance;

  before(async () => {
    contractInstance = await TheoDoiSanPham.deployed();
  });

  it("should create a new product", async () => {
    const id = "SP001";
    const ten = "San Pham 1";
    const nhaSanXuat = "Nha San Xuat A";
    const loaiSanPham = "Loai A";
    const kichThuoc = "10x10";
    const trongLuong = "1kg";
    const hanSuDung = "2025-01-01";

    await contractInstance.taoSanPham(
      id,
      ten,
      nhaSanXuat,
      loaiSanPham,
      kichThuoc,
      trongLuong,
      hanSuDung,
      { from: accounts[0] }
    );

    const sanPham = await contractInstance.danhSachSanPham(id);
    assert.equal(sanPham.ten, ten, "Ten san pham khong dung");
  });

  it("should update product status", async () => {
    const idSanPham = "SP001";
    const tenTrangThai = "Dang van chuyen";
    const thoiGian = "2024-08-11T10:00:00";
    const diaDiem = "Ha Noi";
    const loaiTrangThai = "Van chuyen";
    const moTaChiTiet = "Giao hang";

    await contractInstance.capNhatTrangThai(
      idSanPham,
      tenTrangThai,
      thoiGian,
      diaDiem,
      loaiTrangThai,
      moTaChiTiet,
      { from: accounts[0] }
    );

    const lichSu = await contractInstance.xemLichSuTrangThaiSanPham(idSanPham);
    assert.equal(lichSu.length, 1, "Lich su khong dung");
    assert.equal(lichSu[0].ten, tenTrangThai, "Ten trang thai khong dung");
  });

  it("should return the list of products", async () => {
    const danhSachSanPham = await contractInstance.layDanhSachSanPham();
    assert.equal(danhSachSanPham.length, 1, "So luong san pham khong dung");
    assert.equal(danhSachSanPham[0].id, "SP001", "ID san pham khong dung");
  });
});