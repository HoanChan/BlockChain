// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TheoDoi {
    string[] public ids;
    mapping(string => bool) public idDaTonTai;
    
    struct TrangThai {
        string data;
    }
    
    mapping(string => TrangThai[]) public lichSu;
    
    struct SanPham {
        string id;
        string data;
    }
    
    mapping(string => SanPham) public dsSanPham;
    
    event Tao(string id);
    event CapNhat(string id, string data);
    
    function taoSP(string memory id, string memory data) public {
        require(!idDaTonTai[id], "Id da ton tai");
        idDaTonTai[id] = true;
        ids.push(id);
        
        dsSanPham[id] = SanPham(id, data);
        emit Tao(id);
    }

    function dsSP() public view returns (SanPham[] memory) {
        SanPham[] memory spChiTiet = new SanPham[](ids.length);
        
        for (uint i = 0; i < ids.length; i++) {
            spChiTiet[i] = dsSanPham[ids[i]];
        }
        
        return spChiTiet;
    }

    function xemSP(string memory id) public view returns (SanPham memory) {
        return dsSanPham[id];
    }
    
    function capNhat(string memory id, string memory data) public {
        require(idDaTonTai[id], "Id khong ton tai");
        
        TrangThai memory trangThai = TrangThai(data);
        lichSu[id].push(trangThai);
        
        emit CapNhat(id, data);
    }

    function xemLS(string memory id) public view returns (TrangThai[] memory) {
        return lichSu[id];
    }

    struct chiTietSP {
        string id;
        string data;
        string status;
    }

    function dsSP2() public view returns (chiTietSP[] memory) {
        chiTietSP[] memory spChiTiet = new chiTietSP[](ids.length);        
        for (uint i = 0; i < ids.length; i++) {        
            TrangThai[] memory ls = lichSu[ids[i]];
            string memory status = unicode"Chưa có trạng thái";
            if (ls.length > 0) {
                status = ls[ls.length - 1].data;
            }
            spChiTiet[i] = chiTietSP(ids[i], dsSanPham[ids[i]].data, status);
        }
        
        return spChiTiet;
    }

}
