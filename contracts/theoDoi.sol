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
        string status;
    }
    
    mapping(string => SanPham) public dsSanPham;
    
    event Tao(string id);
    event CapNhat(string id, string data);
    
    function taoSP(string memory id, string memory data) public {
        require(!idDaTonTai[id], unicode"ID đã tồn tại");
        idDaTonTai[id] = true;
        ids.push(id);
        
        dsSanPham[id] = SanPham(id, data, unicode"Chưa có trạng thái");
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
        require(idDaTonTai[id], unicode"ID không tồn tại");
        return dsSanPham[id];
    }
    
    function capNhat(string memory id, string memory data) public {
        require(idDaTonTai[id], unicode"ID không tồn tại");
        
        TrangThai memory trangThai = TrangThai(data);
        lichSu[id].push(trangThai);
        dsSanPham[id].status = data;
        
        emit CapNhat(id, data);
    }

    function xemLS(string memory id) public view returns (TrangThai[] memory) {
        require(idDaTonTai[id], unicode"ID không tồn tại");
        return lichSu[id];
    }
}
