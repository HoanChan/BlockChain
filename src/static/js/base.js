const Conn2BC = async () => {
    if (typeof window.ethereum !== "undefined") {
        try {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            window.account = accounts[0];
            const ABI = await readABIFromURL("/contracts/TheoDoi.json"); // Đường dẫn tới file .json của smart contract đã compile
            const Address = "0xdCcBaB1f967937A4d4E1701EF6F2A48337f29168"; // Địa chỉ của smart contract
            window.web3 = new Web3(window.ethereum);
            window.contract = new window.web3.eth.Contract(ABI, Address);
            document.getElementById("conn").innerHTML = "Đã kết nối với mạng Blockchain.";
            laySP();
        } catch (error) {
            document.getElementById("conn").innerHTML = "Có lỗi xảy ra khi kết nối với MetaMask.";
            console.error(error);
        }
    } else {
        document.getElementById("conn").innerHTML = "MetaMask chưa được cài đặt. Cài đi nào!";
    }
};

const diagThemSPModal = new bootstrap.Modal(document.getElementById('diagThemSP'));
const procedureProperties = { id: 'Mã số', ten: 'Tên', nhaSanXuat: 'Nhà sản xuất', loaiSanPham: 'Loại', kichThuoc: 'Kích thước', trongLuong: 'Trọng lượng', hanSuDung: 'Hạn sử dụng' };
const procedureView = { id: 'Mã số', ten: 'Tên', nhaSanXuat: 'Nhà sản xuất', loaiSanPham: 'Loại', trangThai: 'Trạng thái' };
// Hàm tạo sản phẩm
async function taoSP() {
    let data = [];
    for (const key in procedureProperties) {
        const value = document.getElementById(key).value;
        data.push(value);
    }
    const id = data[0];
    data.shift();
    const dataString = data.join('|');
    console.log('Tạo sản phẩm với dữ liệu:', id, dataString);
    window.contract.methods.taoSP(id, dataString)
        .send({ from: window.account })
        .on('receipt', function (receipt) {
            console.log('Sản phẩm đã được tạo:', receipt);
            addRawDataToProductList({ id, data: dataString });
            showLog(`<h4>Sản phẩm đã được tạo</h4><p>${jsonToHtml(receipt)}</p>`);
        })
        .on('error', function (error) {
            console.error('Đã xảy ra lỗi:', error);
            showLog(`<h4>Đã xảy ra lỗi khi tạo sản phẩm</h4><p>${error}</p>`);
        });
}

const lstProduct = document.getElementById("product-list");
let productList = [];

async function laySP() {
    try {
        const result = await window.contract.methods.dsSP().call();
        console.log('Danh sách sản phẩm:', result);
        lstProduct.innerHTML = '';
        productList = [];
        for (const rawData of result) {
            addRawDataToProductList(rawData);
        }
    } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
        showLog(`<h4>Đã xảy ra lỗi khi lấy danh sách sản phẩm</h4><p>${error}</p>`);
    }
}

function addRawDataToProductList(rawData) {
    const product = createProductData(rawData);
    productList.push(product);
    lstProduct.innerHTML += createProductItem(product);
}

function createProductData(rawData) {
    const [id, data, trangThai] = [rawData[`id`], rawData[`data`], rawData[`status`].split('|')[0]];
    const [ten, nhaSanXuat, loaiSanPham, kichThuoc, trongLuong, hanSuDung] = data.split('|');
    return { id, ten, nhaSanXuat, loaiSanPham, kichThuoc, trongLuong, hanSuDung, trangThai };
}

function createProductItem(product) {
    let properties = '';
    for (const key in procedureView) {
        properties += `<td>${product[key]}</td>`;
    }
    return `
        <tr>
          ${properties}
          <td>
            <a href="#" class="btn btn-info" onclick="showProcedure('${product.id}')">Xem</a>
            <a href="#" class="btn btn-warning" onclick="updateProcedure('${product.id}')">Cập nhật trạng thái</a>
          </td>
        </tr>
      `;
}

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
    const currentTime = new Date().toLocaleString();
    const logElement = document.createElement('div');
    logElement.classList.add('log-entry');
    logElement.innerHTML = `
      <hr>
      <div class="log-time">${currentTime}</div>
      <div class="log-content">${logContent}</div>
    `;
    diagLogModalBody.appendChild(logElement);
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

function searchProducts() {
    const filteredProducts = productList.filter((product) => {
        return (
            product.id.toLowerCase().includes(document.getElementById("search-id").value.toLowerCase()) &&
            product.ten.toLowerCase().includes(document.getElementById("search-name").value.toLowerCase()) &&
            product.nhaSanXuat.toLowerCase().includes(document.getElementById("search-manufacturer").value.toLowerCase()) &&
            product.loaiSanPham.toLowerCase().includes(document.getElementById("search-type").value.toLowerCase()) &&
            product.trangThai.toLowerCase().includes(document.getElementById("search-status").value.toLowerCase())
        );
    });
    lstProduct.innerHTML = "";
    filteredProducts.forEach((product) => { lstProduct.innerHTML += createProductItem(product); });
}

const diagXemSPModal = new bootstrap.Modal(document.getElementById('diagXemSP'));
const diagXemSPModalLog = document.getElementById('diagXemSPLog');
const logProperties = { tenTrangThai: 'Trạng thái', thoiGian: 'Thời gian', diaDiem: 'Địa điểm', loaiTrangThai: 'Loại', moTaChiTiet: 'Mô tả' };

async function showProcedure(id) {
    const product = productList.find((product) => product.id === id);
    for (const key in procedureProperties) {
        document.getElementById(`pro-${key}`).innerHTML = product[key];
    }
    try {
        const result = await window.contract.methods.xemLS(id).call();
        console.log('Lịch sử của sản phẩm:', id, ' là \n', result);
        diagXemSPModalLog.innerHTML = '';
        for (const rawData of result) {
            diagXemSPModalLog.innerHTML += createLogItem(createLogData(rawData));
        }
        document.getElementById('btnThemTT').setAttribute('onclick', `showCapNhat('${id}')`);
        diagXemSPModal.show();
    } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
        showLog(`<h4>Đã xảy ra lỗi khi lấy danh sách sản phẩm</h4><p>${error}</p>`);
    }
}

function createLogData(rawData) {
    const data = rawData[`data`];
    const [tenTrangThai, thoiGian, diaDiem, loaiTrangThai, moTaChiTiet] = data.split('|');
    return { tenTrangThai, thoiGian, diaDiem, loaiTrangThai, moTaChiTiet };
}

function createLogItem(log) {
    let properties = '';
    for (const key in logProperties) {
        properties += `<td>${log[key]}</td>`;
    }
    return `<tr>${properties}</tr>`;
}

const diagThemTTModal = new bootstrap.Modal(document.getElementById('diagThemTT'));
const diagThemTT_ID = document.getElementById('diagThemTT-Id');

function showCapNhat(id) {
    diagThemTT_ID.innerHTML = id;
    for (const key in logProperties) {
        document.getElementById(`log-${key}`).value = '';
    }
    // gán ngày giờ hiện tại vào ô thời gian
    document.getElementById('log-thoiGian').value = new Date().toLocaleString('sv-SE');
    document.getElementById('log-btnThemTT').setAttribute('onclick', `capNhat('${id}')`);
    diagThemTTModal.show();
}

async function capNhat(id) {
    data = [];
    for (const key in logProperties) {
        const value = document.getElementById(`log-${key}`).value;
        data.push(value);
    }
    const dataString = data.join('|');
    console.log('Cập nhật trạng thái sản phẩm:', id, dataString);
    window.contract.methods.capNhat(id, dataString)
        .send({ from: window.account })
        .on('receipt', function (receipt) {
            console.log('Trạng thái sản phẩm đã được cập nhật:', receipt);
            showLog(`<h4>Trạng thái sản phẩm đã được cập nhật</h4><p>${jsonToHtml(receipt)}</p>`);
        })
        .on('error', function (error) {
            console.error('Đã xảy ra lỗi:', error);
            showLog(`<h4>Đã xảy ra lỗi khi cập nhật trạng thái sản phẩm</h4><p>${error}</p>`);
        });
}