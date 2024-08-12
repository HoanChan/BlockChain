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
// Hàm tạo sản phẩm
async function taoSP() {
    const id = document.getElementById('idSanPham').value;
    const ten = document.getElementById('tenSanPham').value;
    const nhaSanXuat = document.getElementById('nhaSanXuat').value;
    const loaiSanPham = document.getElementById('loaiSanPham').value;
    const kichThuoc = document.getElementById('kichThuoc').value;
    const trongLuong = document.getElementById('trongLuong').value.toString();
    const hanSuDung = document.getElementById('hanSuDung').value;
    const data = `${ten}|${nhaSanXuat}|${loaiSanPham}|${kichThuoc}|${trongLuong}|${hanSuDung}`;
    window.contract.methods.taoSP(id, data)
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

// Hàm lấy danh sách sản phẩm
async function laySP() {
    try {
        const result = await window.contract.methods.dsSP().call();
        console.log('Danh sách sản phẩm:', result);
        productList.innerHTML = '';

        for (const sanPham of result) {
            productList.innerHTML += createProductItem(sanPham);
        }

        showLog(`<h4>Danh sách sản phẩm</h4><p>${jsonToHtml(result)}</p>`);
    } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
        showLog(`<h4>Đã xảy ra lỗi khi lấy danh sách sản phẩm</h4><p>${error}</p>`);
    }
}

const productList = document.getElementById("product-list");
function createProductItem(product){
    const [id, data] = [product[`id`], product[`data`]];
    const [ten, nhaSanXuat, loaiSanPham, kichThuoc, trongLuong, hanSuDung] = data.split('|');
    return `
        <tr>
          <td>${id}</td>
          <td>${ten}</td>
          <td>${nhaSanXuat}</td>
          <td>${loaiSanPham}</td>
          <td>${kichThuoc}</td>
          <td>${trongLuong}</td>
          <td>${hanSuDung}</td>
          <td>
            <a href="#" class="btn btn-info">Xem</a>
            <a href="#" class="btn btn-warning">Cập nhật trạng thái</a>
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