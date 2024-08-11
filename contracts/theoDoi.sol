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
    
    mapping(string => SanPham) public sanPhams;
    
    event Tao(string id);
    event CapNhat(string id, string data);
    
    function taoSP(string memory id, string memory data) public {
        require(!idDaTonTai[id], "Id da ton tai");
        idDaTonTai[id] = true;
        ids.push(id);
        
        sanPhams[id] = SanPham(id, data);
        emit Tao(id);
    }

    function capNhat(string memory id, string memory data) public {
        require(idDaTonTai[id], "Id khong ton tai");
        
        TrangThai memory trangThai = TrangThai(data);
        lichSu[id].push(trangThai);
        
        emit CapNhat(id, data);
    }

    function xemLichSu(string memory id) public view returns (TrangThai[] memory) {
        return lichSu[id];
    }

    function laySP() public view returns (SanPham[] memory) {
        SanPham[] memory spChiTiet = new SanPham[](ids.length);
        
        for (uint i = 0; i < ids.length; i++) {
            spChiTiet[i] = sanPhams[ids[i]];
        }
        
        return spChiTiet;
    }
}
