// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TheoDoiSanPham {
    address public chuSoHuu;
    address[] public danhSachNguoiUyQuyen;
    mapping(string => bool) public maSoSanPhamDaTonTai;
    
    struct TrangThai {
        string ten;
        string thoiGian;
        string diaDiem;
        string loaiTrangThai;
        string moTaChiTiet;
    }
    
    mapping(string => TrangThai[]) public lichSuTrangThaiSanPham;  // Sử dụng mapping
    
    struct SanPham {
        string id;
        string ten;
        string nhaSanXuat;
        string loaiSanPham;
        string kichThuoc;
        string trongLuong;
        string hanSuDung;
    }
    
    mapping(string => SanPham) public danhSachSanPham;
    
    event SanPhamDaTao(string idSanPham, string tenSanPham);
    
    event CapNhatTrangThai(string idSanPham, string tenTrangThai, string thoiGian, string diaDiem, string loaiTrangThai, string moTaChiTiet);
    
    event UyQuyen(address nguoiDuocUyQuyen);
    
    event ThuHoiUyQuyen(address nguoiBiThuHoi);
    
    constructor() {
        chuSoHuu = msg.sender;
    }
    
    modifier chiChuSoHuu() {
        require(msg.sender == chuSoHuu, "Chi chu so huu hop dong moi duoc phep goi ham nay");
        _;
    }
    
    modifier chiUyQuyen() {
        require(laNguoiUyQuyen(msg.sender), "Chi nguoi uy quyen moi duoc phep goi ham nay");
        _;
    }
    
    function taoSanPham(string memory id, string memory ten, string memory nhaSanXuat, string memory loaiSanPham, string memory kichThuoc, string memory trongLuong, string memory hanSuDung) public chiChuSoHuu {
        require(!maSoSanPhamDaTonTai[id], "Ma so da ton tai");
        maSoSanPhamDaTonTai[id] = true;
        
        danhSachSanPham[id] = SanPham(id, ten, nhaSanXuat, loaiSanPham, kichThuoc, trongLuong, hanSuDung);
        emit SanPhamDaTao(id, ten);
    }

    function capNhatTrangThai(string memory idSanPham, string memory tenTrangThai, string memory thoiGian, string memory diaDiem, string memory loaiTrangThai, string memory moTaChiTiet) public chiUyQuyen {
        require(maSoSanPhamDaTonTai[idSanPham], "Ma so khong ton tai");
        
        TrangThai memory trangThai = TrangThai(tenTrangThai, thoiGian, diaDiem, loaiTrangThai, moTaChiTiet);
        lichSuTrangThaiSanPham[idSanPham].push(trangThai);
        
        emit CapNhatTrangThai(idSanPham, tenTrangThai, thoiGian, diaDiem, loaiTrangThai, moTaChiTiet);
    }

    function xemLichSuTrangThaiSanPham(string memory idSanPham) public view returns (TrangThai[] memory) {
        return lichSuTrangThaiSanPham[idSanPham];
    }
    
    function uyQuyen(address _nguoiUyQuyen) public chiChuSoHuu {
        danhSachNguoiUyQuyen.push(_nguoiUyQuyen);
        emit UyQuyen(_nguoiUyQuyen);
    }
    
    function thuHoiUyQuyen(address _nguoiBiThuHoi) public chiChuSoHuu {
        for (uint i = 0; i < danhSachNguoiUyQuyen.length; i++) {
            if (danhSachNguoiUyQuyen[i] == _nguoiBiThuHoi) {
                delete danhSachNguoiUyQuyen[i];
                emit ThuHoiUyQuyen(_nguoiBiThuHoi);
            }
        }
    }
    
    function XemDanhSachNguoiUyQuyen() public view returns (address[] memory) {
        return danhSachNguoiUyQuyen;
    }
    
    function laNguoiUyQuyen(address _address) public view returns (bool) {
        for (uint i = 0; i < danhSachNguoiUyQuyen.length; i++) {
            if (danhSachNguoiUyQuyen[i] == _address) {
                return true;
            }
        }
        return false;
    }
}
