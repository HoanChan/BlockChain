// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TheoDoiSanPham {
    string[] public danhSachMaSanPham;
    mapping(string => bool) public maSoSanPhamDaTonTai;
    
    struct TrangThai {
        string ten;
        string thoiGian;
        string diaDiem;
        string loaiTrangThai;
        string moTaChiTiet;
    }
    
    mapping(string => TrangThai[]) public lichSuTrangThaiSanPham;
    
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
    
    event TaoSanPham(string idSanPham, string tenSanPham);
    event CapNhatTrangThai(string idSanPham, string tenTrangThai, string thoiGian, string diaDiem, string loaiTrangThai, string moTaChiTiet);
    
    function taoSanPham(string memory id, string memory ten, string memory nhaSanXuat, string memory loaiSanPham, string memory kichThuoc, string memory trongLuong, string memory hanSuDung) public {
        require(!maSoSanPhamDaTonTai[id], "Ma so da ton tai");
        maSoSanPhamDaTonTai[id] = true;
        danhSachMaSanPham.push(id);
        
        danhSachSanPham[id] = SanPham(id, ten, nhaSanXuat, loaiSanPham, kichThuoc, trongLuong, hanSuDung);
        emit TaoSanPham(id, ten);
    }

    function capNhatTrangThai(string memory idSanPham, string memory tenTrangThai, string memory thoiGian, string memory diaDiem, string memory loaiTrangThai, string memory moTaChiTiet) public {
        require(maSoSanPhamDaTonTai[idSanPham], "Ma so khong ton tai");
        
        TrangThai memory trangThai = TrangThai(tenTrangThai, thoiGian, diaDiem, loaiTrangThai, moTaChiTiet);
        lichSuTrangThaiSanPham[idSanPham].push(trangThai);
        
        emit CapNhatTrangThai(idSanPham, tenTrangThai, thoiGian, diaDiem, loaiTrangThai, moTaChiTiet);
    }

    function xemLichSuTrangThaiSanPham(string memory idSanPham) public view returns (TrangThai[] memory) {
        return lichSuTrangThaiSanPham[idSanPham];
    }

    function layDanhSachSanPham() public view returns (SanPham[] memory) {
        SanPham[] memory danhSachSanPhamChiTiet = new SanPham[](danhSachMaSanPham.length);
        
        for (uint i = 0; i < danhSachMaSanPham.length; i++) {
            danhSachSanPhamChiTiet[i] = danhSachSanPham[danhSachMaSanPham[i]];
        }
        
        return danhSachSanPhamChiTiet;
    }

}
