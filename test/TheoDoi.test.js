
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
    },
  
    {
      id: "Xe-20240006",
      ten: "Xe Máy",
      nhaSanXuat: "Công ty Xe Máy JKL",
      loaiSanPham: "Phương tiện",
      kichThuoc: "180x70",
      trongLuong: "110",
      hanSuDung: "2031-12-15"
    },
  
    {
      id: "TV-20240007",
      ten: "Tivi XYZ",
      nhaSanXuat: "Công ty Điện Tử MNO",
      loaiSanPham: "Điện tử",
      kichThuoc: "55x30",
      trongLuong: "15",
      hanSuDung: "2032-10-10"
    },
  
    {
      id: "TL-20240008",
      ten: "Tủ Lạnh",
      nhaSanXuat: "Công ty Điện Lạnh PQR",
      loaiSanPham: "Điện tử",
      kichThuoc: "70x60",
      trongLuong: "30",
      hanSuDung: "2033-08-05"
    },
  
    {
      id: "QT-20240009",
      ten: "Quần Áo Thể Thao",
      nhaSanXuat: "Công ty May Mặc STU",
      loaiSanPham: "Thời trang",
      kichThuoc: "M",
      trongLuong: "0.3",
      hanSuDung: "2034-04-25"
    },
  
    {
      id: "DT-20240010",
      ten: "Dụng Cụ Thể Dục",
      nhaSanXuat: "Công ty Thể Dục VWX",
      loaiSanPham: "Thể dục",
      kichThuoc: "S",
      trongLuong: "0.5",
      hanSuDung: "2035-02-28"
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
  

const TheoDoi = artifacts.require("TheoDoi");

contract("TheoDoi", (accounts) => {
    let contractInstance;

    before(async () => {
        contractInstance = await TheoDoi.deployed(); // address cố định sau khi deploy
        // contractInstance = await TheoDoi.new(); // address mới mỗi lần deploy
    });

    after(() => {
        console.log(`\nĐịa chỉ của hợp đồng thông minh: ${contractInstance.address}`);
    });

    it(`Kiểm tra việc tạo và xem ${sampleProducts.length} sản phẩm`, async () => {
        for (const product of sampleProducts) {
            const data = `${product.ten}|${product.nhaSanXuat}|${product.loaiSanPham}|${product.kichThuoc}|${product.trongLuong}|${product.hanSuDung}`;
            await contractInstance.taoSP(product.id, data);
            const sanPham = await contractInstance.xemSP(product.id);
            // console.log('Sản phẩm:', sanPham);
            assert.equal(sanPham.id, product.id, `ID của sản phẩm ${product.id} không khớp với dữ liệu xem được ${sanPham.id}`);
            assert.equal(sanPham.data, data, `Dữ liệu của sản phẩm ${product.id} - ${data} không khớp với dữ liệu xem được ${sanPham.id} - ${sanPham.data}`);
        }
    });

    it(`Kiểm tra việc tạo trạng thái cho ${sampleProducts.length} sản phẩm`, async () => {
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
            // console.log('Lịch sử trạng thái sản phẩm:', lichSu);            
            assert.equal(lichSu.length, randomIndex, `Lịch sử trạng thái sản phẩm ${product.id} không đúng`);
        }
    });

    it("Kiểm tra việc lấy danh sách sản phẩm", async () => {
        const dsSP = await contractInstance.dsSP();
        const dsID = dsSP.map(sp => sp.id);
        assert.equal(dsSP.length, sampleProducts.length, `Số lượng sản phẩm không khớp, mong đợi ${sampleProducts.length} sản phẩm, nhận được ${dsSP.length} sản phẩm`);
        for (let i = 0; i < sampleProducts.length; i++) {
            assert.include(dsID, sampleProducts[i].id, `ID của sản phẩm ${sampleProducts[i].id} không nằm trong danh sách sản phẩm`);
        }
    });

    it("Kiểm tra việc tạo sản phẩm với ID đã tồn tại", async () => {
        for (const product of sampleProducts) {
            const data = `${product.ten}|${product.nhaSanXuat}|${product.loaiSanPham}|${product.kichThuoc}|${product.trongLuong}|${product.hanSuDung}`;
            try {
                await contractInstance.taoSP(product.id, data);
                assert.fail("Không nhận được thông báo lỗi như mong đợi");
            } catch (error) {
                assert.include(error.message, "revert", `Thông báo lỗi mong đợi không khớp, nhận được thông báo lỗi khác: ${error}`);
            }
        }
    });

    it("Kiểm tra việc cập nhật trạng thái sản phẩm với ID không tồn tại", async () => {
        for (const product of sampleProducts) {
            const data = `${product.ten}|${product.nhaSanXuat}|${product.loaiSanPham}|${product.kichThuoc}|${product.trongLuong}|${product.hanSuDung}`;
            try {
                await contractInstance.capNhat(product.id + "-INVALID", data);
                assert.fail("Không nhận được thông báo lỗi như mong đợi");
            } catch (error) {
                assert.include(error.message, "revert", `Thông báo lỗi mong đợi không khớp, nhận được thông báo lỗi khác: ${error}`);
            }
        }
    });

    it("Kiểm tra việc xem sản phẩm với ID không tồn tại", async () => {
        for (const product of sampleProducts) {
            const id = product.id + "-INVALID";
            try {
                await contractInstance.xemSP(id);
                assert.fail("Không nhận được thông báo lỗi như mong đợi");
            } catch (error) {
                assert.include(error.message, "revert", `Thông báo lỗi mong đợi không khớp, nhận được thông báo lỗi khác: ${error}`);
            }
        }
    });

    it("Kiểm tra việc xem lịch sử trạng thái sản phẩm với ID không tồn tại", async () => {
        for (const product of sampleProducts) {
            const id = product.id + "-INVALID";
            try {
                await contractInstance.xemLS(id);
                assert.fail("Không nhận được thông báo lỗi như mong đợi");
            } catch (error) {
                assert.include(error.message, "revert", `Thông báo lỗi mong đợi không khớp, nhận được thông báo lỗi khác: ${error}`);
            }
        }
    });
});
