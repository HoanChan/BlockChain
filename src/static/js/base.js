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
            const ABI = await readABIFromURL("/contracts/TheoDoiSanPham.json"); // Đường dẫn tới file .json của smart contract đã compile
            const Address = "0xd3cb290940d06fc3e4d8e1ae41b3ddae5dc48d04"; // Địa chỉ của smart contract
            window.web3 = new Web3(window.ethereum);
            window.contract = new window.web3.eth.Contract(ABI, Address);
            document.getElementById("conn").innerHTML = "Đã kết nối với mạng Blockchain.";
            layDanhSachSanPham();
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
    const trongLuong = document.getElementById('trongLuong').value.toString();
    const hanSuDung = document.getElementById('hanSuDung').value;

    window.contract.methods.taoSanPham(id, ten, nhaSanXuat, loaiSanPham, kichThuoc, trongLuong, hanSuDung)
        .send({ from: window.account })
        .on('receipt', function (receipt) {
            console.log('Sản phẩm đã được tạo:', receipt);
            showLog(`<h4>Sản phẩm đã được tạo</h4><p>${jsonToHtml(receipt)}</p>`);
        })
        .on('error', function (error) {
            console.error('Đã xảy ra lỗi:', error);
            showLog(`<h4>Đã xảy ra lỗi khi tạo sản phẩm</h4><p>${error}</p>`);
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
            showLog(`<h4>Trạng thái đã được cập nhật</h4><p>${jsonToHtml(receipt)}</p>`);
        })
        .on('error', function (error) {
            console.error('Đã xảy ra lỗi:', error);
            showLog(`<h4>Đã xảy ra lỗi khi cập nhật trạng thái</h4><p>${error}</p>`);
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
            showLog(`<h4>Đã xảy ra lỗi khi xem lịch sử trạng thái</h4><p>${error}</p>`);
        });
}
const productList = document.getElementById("product-list");
function createProductItem(product){
    return `
        <tr>
          <td>${product.id}</td>
          <td>${product.ten}</td>
          <td>${product.nhaSanXuat}</td>
          <td>${product.loaiSanPham}</td>
          <td>${product.kichThuoc}</td>
          <td>${product.trongLuong}</td>
          <td>${product.hanSuDung}</td>
          <td>
            <a href="#" class="btn btn-info">Xem</a>
            <a href="#" class="btn btn-warning">Cập nhật trạng thái</a>
          </td>
        </tr>
      `;
}
// Hàm lấy danh sách sản phẩm
async function layDanhSachSanPham() {
    try {
        const result = await window.contract.methods.layDanhSachSanPham().call({ from: window.account });
        console.log('Danh sách sản phẩm:', result);
        // productList.innerHTML = '';

        // for (const id of result) {
        //     const sanPham = await window.contract.methods.danhSachSanPham(id).call();
        //     productList.innerHTML += createProductItem(sanPham);
        // }

        // showLog(`<h4>Danh sách sản phẩm</h4><p>${jsonToHtml(result)}</p>`);
    } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
        showLog(`<h4>Đã xảy ra lỗi khi lấy danh sách sản phẩm</h4><p>${error}</p>`);
    }
}


// Danh sách sản phẩm mẫu
const sampleProducts = [
    {
        idSanPham: "NS-20230001",
        tenSanPham: "Nông sản tươi",
        nhaSanXuat: "Công ty nông sản ABC",
        loaiSanPham: "Nông sản",
        trangThai: "Đang sản xuất",
    },
    {
        idSanPham: "MM-20230002",
        tenSanPham: "Máy móc xây dựng",
        nhaSanXuat: "Công ty máy móc XYZ",
        loaiSanPham: "Máy móc",
        trangThai: "Đang vận chuyển",
    },
    {
        idSanPham: "HH-20230003",
        tenSanPham: "Hàng hoá tiêu dùng",
        nhaSanXuat: "Công ty hàng tiêu dùng",
        loaiSanPham: "Tiêu dùng",
        trangThai: "Đang bày bán",
    },
    {
        idSanPham: "NS-20230004",
        tenSanPham: "Nông sản khô",
        nhaSanXuat: "Công ty nông sản ABC",
        loaiSanPham: "Nông sản",
        trangThai: "Đã bán",
    },
    {
        idSanPham: "MM-20230005",
        tenSanPham: "Máy móc nông nghiệp",
        nhaSanXuat: "Công ty máy móc XYZ",
        loaiSanPham: "Máy móc",
        trangThai: "Đang sản xuất",
    },
];

// Hiển thị sản phẩm mẫu
sampleProducts.forEach((product) => {
    productList.innerHTML += `
      <tr>
        <td>${product.idSanPham}</td>
        <td>${product.tenSanPham}</td>
        <td>${product.nhaSanXuat}</td>
        <td>${product.loaiSanPham}</td>
        <td>${product.trangThai}</td>
        <td>
          <a href="#" class="btn btn-info">Xem</a>
          <a href="#" class="btn btn-warning">Cập nhật trạng thái</a>
        </td>
      </tr>
    `;
});

// Hàm tìm kiếm sản phẩm
function searchProducts() {
    const filteredProducts = sampleProducts.filter((product) => {
        return (
            product.idSanPham.toLowerCase().includes(document.getElementById("search-id").value.toLowerCase()) &&
            product.tenSanPham.toLowerCase().includes(document.getElementById("search-name").value.toLowerCase()) &&
            product.nhaSanXuat.toLowerCase().includes(document.getElementById("search-manufacturer").value.toLowerCase()) &&
            product.loaiSanPham.toLowerCase().includes(document.getElementById("search-type").value.toLowerCase()) &&
            product.trangThai.toLowerCase().includes(document.getElementById("search-status").value.toLowerCase())
        );
    });

    // Hiển thị kết quả tìm kiếm
    productList.innerHTML = "";
    filteredProducts.forEach((product) => {
        productList.innerHTML += `
        <tr>
          <td>${product.idSanPham}</td>
          <td>${product.tenSanPham}</td>
          <td>${product.nhaSanXuat}</td>
          <td>${product.loaiSanPham}</td>
          <td>${product.trangThai}</td>
          <td>
            <a href="#" class="btn btn-info">Xem</a>
            <a href="#" class="btn btn-warning">Cập nhật trạng thái</a>
          </td>
        </tr>
      `;
    });
}