function formatHash(input, maxLength = 32) {
    // Kiểm tra độ dài của chuỗi đầu vào
    inputString = `${input}`.trim();
    if (inputString.length === 0) {
        return "";
    }

    // Chia chuỗi thành các phần có độ dài maxLength ký tự
    let formattedString = "";
    for (let i = 0; i < inputString.length; i += maxLength) {
        formattedString += inputString.slice(i, i + maxLength) + "<br>";
    }

    // Xóa thẻ <br> cuối cùng
    return formattedString.slice(0, -4);
}


function jsonToHtml(json) {
    let html = '<table class="table table-responsive table-bordered table-striped">';
    html += '<thead class="thead-dark"><tr><th>Key</th><th>Value</th></tr></thead><tbody>';
    for (const key in json) {
        if (json.hasOwnProperty(key)) {
            html += `<tr><td>${key}</td><td>${formatHash(json[key])}</td></tr>`;
        }
    }
    html += '</tbody></table>';
    return html;
}

const diagLogModal = new bootstrap.Modal(document.getElementById('diagLog'));
const diagLogModalBody = document.getElementById('diagLogBody');

function showLog(logContent) {
    // Lấy thời gian hiện tại
    const currentTime = new Date().toLocaleString();
  
    // Tạo phần tử div để chứa log
    const logElement = document.createElement('div');
    logElement.classList.add('log-entry');
  
    // Tạo nội dung log
    logElement.innerHTML = `
      <hr>
      <div class="log-time">${currentTime}</div>
      <div class="log-content">${logContent}</div>
    `;
  
    // Lấy phần tử body của modal
  
    // Thêm log vào body của modal
    diagLogModalBody.appendChild(logElement);
  
    // Hiển thị modal
    const diagLogModal = new bootstrap.Modal(document.getElementById('diagLog'));
    diagLogModal.show();
  }

async function readABIFromURL(url) {
    try {
        const response = await fetch(url);
        const contractData = await response.json();
        return contractData.abi;
    } catch (error) {
        console.error('Error fetching file:', error);
        return null;
    }
}

const Conn2BC = async () => {
    if (typeof window.ethereum !== "undefined") {
        try {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            window.account = accounts[0];
            const ABI = await readABIFromURL("/contracts/TheoDoiSanPham.json");
            const Address = "0x0d196dF21510444C4b4834131Fe4F34F6d7875C9";
            window.web3 = new Web3(window.ethereum);
            window.contract = new window.web3.eth.Contract(ABI, Address);
            document.getElementById("conn").innerHTML = "Đã kết nối với mạng Blockchain.";
        } catch (error) {
            document.getElementById("conn").innerHTML = "Có lỗi xảy ra khi kết nối với MetaMask.";
            console.error(error);
        }
    } else {
        document.getElementById("conn").innerHTML = "MetaMask chưa được cài đặt. Cài đi nào!";
    }
};

const diagThemSPModal = new bootstrap.Modal(document.getElementById('diagThemSP'));
// Hàm tạo sản phẩm
async function taoSanPham() {
    const id = document.getElementById('idSanPham').value;
    const ten = document.getElementById('tenSanPham').value;
    const nhaSanXuat = document.getElementById('nhaSanXuat').value;
    const loaiSanPham = document.getElementById('loaiSanPham').value;
    const kichThuoc = document.getElementById('kichThuoc').value;
    const trongLuong = document.getElementById('trongLuong').value;
    const hanSuDung = document.getElementById('hanSuDung').value;

    window.contract.methods.taoSanPham(id, ten, nhaSanXuat, loaiSanPham, kichThuoc, trongLuong, hanSuDung)
        .send({ from: window.account })
        .on('receipt', function (receipt) {
            console.log('Sản phẩm đã được tạo:', receipt);
            showLog('<h4>Sản phẩm đã được tạo</h4><p>' + jsonToHtml(receipt)) + '</p>';
        })
        .on('error', function (error) {
            console.error('Đã xảy ra lỗi:', error);
            showLog('<h4>Đã xảy ra lỗi khi tạo sản phẩm</h4><p>' + jsonToHtml(error)) + '</p>';
        });
}

// Hàm cập nhật trạng thái sản phẩm
async function capNhatTrangThai() {
    const idSanPham = document.getElementById('idSanPhamTrangThai').value;
    const tenTrangThai = document.getElementById('tenTrangThai').value;
    const thoiGian = document.getElementById('thoiGian').value;
    const diaDiem = document.getElementById('diaDiem').value;
    const loaiTrangThai = document.getElementById('loaiTrangThai').value;
    const moTaChiTiet = document.getElementById('moTaChiTiet').value;

    window.contract.methods.capNhatTrangThai(idSanPham, tenTrangThai, thoiGian, diaDiem, loaiTrangThai, moTaChiTiet)
        .send({ from: window.account })
        .on('receipt', function (receipt) {
            console.log('Trạng thái đã được cập nhật:', receipt);
            showLog('<h4>Trạng thái đã được cập nhật</h4><p>' + jsonToHtml(receipt)) + '</p>';
        })
        .on('error', function (error) {
            console.error('Đã xảy ra lỗi:', error);
            showLog('<h4>Đã xảy ra lỗi khi cập nhật trạng thái</h4><p>' + jsonToHtml(error)) + '</p>';
        });
}

// Hàm xem lịch sử trạng thái sản phẩm
async function xemLichSuTrangThaiSanPham() {
    const idSanPham = document.getElementById('idSanPhamLichSu').value;

    window.contract.methods.xemLichSuTrangThaiSanPham(idSanPham)
        .call()
        .then(function (result) {
            console.log('Lịch sử trạng thái:', result);
            const lichSuTrangThaiDiv = document.getElementById('lichSuTrangThai');
            lichSuTrangThaiDiv.innerHTML = '';

            result.forEach(trangThai => {
                const trangThaiDiv = document.createElement('div');
                trangThaiDiv.innerHTML = `
                    <p>Tên: ${trangThai.ten}</p>
                    <p>Thời gian: ${trangThai.thoiGian}</p>
                    <p>Địa điểm: ${trangThai.diaDiem}</p>
                    <p>Loại trạng thái: ${trangThai.loaiTrangThai}</p>
                    <p>Mô tả chi tiết: ${trangThai.moTaChiTiet}</p>
                    <hr>
                `;
                lichSuTrangThaiDiv.appendChild(trangThaiDiv);
            });
        })
        .catch(function (error) {
            console.error('Đã xảy ra lỗi:', error);
            showLog('<h4>Đã xảy ra lỗi khi xem lịch sử trạng thái</h4><p>' + jsonToHtml(error)) + '</p>';
        });
}

// Hàm lấy danh sách sản phẩm
async function layDanhSachSanPham() {
    window.contract.methods.layDanhSachSanPham()
        .call()
        .then(function (result) {
            console.log('Danh sách sản phẩm:', result);
            const danhSachSanPhamDiv = document.getElementById('danhSachSanPham');
            danhSachSanPhamDiv.innerHTML = '';

            result.forEach(async (idSanPham) => {
                const sanPham = await window.contract.methods.danhSachSanPham(idSanPham).call();
                const sanPhamDiv = document.createElement('div');
                sanPhamDiv.innerHTML = `
                    <p>ID: ${sanPham.id}</p>
                    <p>Tên: ${sanPham.ten}</p>
                    <p>Nhà sản xuất: ${sanPham.nhaSanXuat}</p>
                    <p>Loại sản phẩm: ${sanPham.loaiSanPham}</p>
                    <p>Kích thước: ${sanPham.kichThuoc}</p>
                    <p>Trọng lượng: ${sanPham.trongLuong}</p>
                    <p>Hạn sử dụng: ${sanPham.hanSuDung}</p>
                    <hr>
                `;
                danhSachSanPhamDiv.appendChild(sanPhamDiv);
            });
        })
        .catch(function (error) {
            console.error('Đã xảy ra lỗi:', error);
            showLog('<h4>Đã xảy ra lỗi khi lấy danh sách sản phẩm</h4><p>' + jsonToHtml(error)) + '</p>';
        });
}