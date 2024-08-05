# Blockmemo - Nhật ký sản phẩm (Truy xuất nguồn gốc)

## Giới thiệu
Dự án này là một bài tập lớn kết thúc học phần "Blockchain và Ứng dụng" tại Đại học Nha Trang. Chủ đề của dự án là "Blockmemo - Nhật ký sản phẩm", nhằm tìm hiểu và ứng dụng công nghệ blockchain để truy xuất nguồn gốc sản phẩm.

## Thông tin chung
- **Học viên**: Lê Hoàn Chân
- **Mã số học viên**: 64CH032
- **Lớp**: CNTT2022
- **Học phần**: Blockchain và ứng dụng
- **Giảng viên**: TS. Phạm Văn Nam
- **Thời gian**: Tháng 8/2024

## Đặt vấn đề
Công nghệ Blockchain đang trở thành một công nghệ tiên tiến trong cuộc Cách mạng công nghiệp 4.0 và được ứng dụng vào nhiều lĩnh vực. Tuy nhiên, trong ngành nông nghiệp ở Việt Nam, việc truy xuất nguồn gốc hàng hóa vẫn là một vấn đề khó khăn. Dự án "Blockmemo - Nhật ký sản phẩm" nhằm nghiên cứu và phát triển ứng dụng blockchain để giải quyết vấn đề này.

## Bài toán kiểm soát nguồn gốc sản phẩm
### Định nghĩa và ý nghĩa
Truy xuất nguồn gốc sản phẩm là quá trình theo dõi và ghi lại lịch sử của sản phẩm từ nguồn gốc đến người tiêu dùng cuối cùng.

### Các vấn đề cần giải quyết
- Đảm bảo tính minh bạch
- Chống gian lận
- Nâng cao niềm tin của người tiêu dùng

### Công nghệ blockchain trong kiểm soát nguồn gốc sản phẩm
Blockchain có thể được sử dụng để lưu trữ và xác minh thông tin về nguồn gốc sản phẩm, đảm bảo rằng thông tin này không thể bị thay đổi.

### Lợi ích của kiểm soát nguồn gốc sản phẩm
- Nâng cao chất lượng sản phẩm
- Tăng cường niềm tin của người tiêu dùng
- Giảm thiểu rủi ro gian lận

## Ứng dụng Blockchain trong truy xuất nguồn gốc
Blockchain có thể được sử dụng để tạo ra một hệ thống truy xuất nguồn gốc sản phẩm hiệu quả và minh bạch, giúp nâng cao niềm tin của người tiêu dùng và cải thiện chất lượng sản phẩm.


## Các bước thực hiện cụ thể:
1. Khởi động `CodeSpace` (Đã cấu hình sẵn việc cài đặt `Node.js`).
2. Các gói thư viện cần thiết cho dự án được cấu hình tại file `package.json` cũng được tự động cài đặt cùng với việc khởi tạo `codespace` nhờ lệnh `npm install` trong file `.devcontainer/devcontainer.json`. Nếu cần cập nhật các gói thư viện mới hoặc sửa đổi nội dung `package.json` thì nhớ chạy lệnh `npm install` trên terminal.
3. Gõ các lệnh trên terminal để kiểm tra và thiết lập dự án.
- Gõ lệnh: `npx truffle -v` trên terminal để xem các thông tin về phiên bản của `Truffle`, `Ganache`, `Solidity`, `Node` và `Web3.js`.
- Gõ lệnh `npx truffle init` trên terminal để bắt đầu thiết lập các file, thư mục cơ bản cho dự án.
- Gõ lệnh: `npx ganache-cli` trên terminal để khởi động Ganache và xem các thông tin về network và accounts.
4. Copy các thông tin về network của Ganache vào file cấu hình `truffle-config.js`.

```javascript
module.exports = {
  networks: {
    development: {
      host: "0.0.0.0",     // Sử dụng "0.0.0.0" thay vì "127.0.0.1" trên CodeSpace
      port: 8545,          // Cổng mặc định của Ganache
      network_id: "*",     // Khớp với bất kỳ network ID nào
    },
  }
}
```
5. Gõ lệnh `npx truffle compile` trên terminal để biên dịch các file `.sol` trong thư mục `contracts`, kết quả sẽ là các file tương ứng với tên contracts và được lưu trong thư mục `build\contracts`
6. Tạo file `index.js` chứa thông tin máy chủ node.js
```javascript
const express = require("express");
const path = require("path");
const app = express();

// Khai báo thư mục public
app.use(express.static(path.join(__dirname, '/src/static/')));
app.use(express.static(path.join(__dirname, '/build/')));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/src/main.html"));
})

const server = app.listen(5000);
const portNumber = server.address().port;
console.log(`port is open on ${portNumber}`);
```
7. Tạo file `main.html` trong thư mục `src` và các file khác để dựng giao diện ứng dụng.
    - Nếu cần sử dụng web3 thì thêm thư viện vào:
    ```html
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/web3/1.2.7-rc.0/web3.min.js"></script>
    ```
    - Thêm nút vào HTML:
    ```html
    <button id="conn" onclick="Conn2BC()">Kết nối đến mạng blockchain</button>
    ```
    - Viết mã javascript để kết nối tới mạng BlockChain trong file `static\src\base.js`:
    ```javascript
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
                const account = accounts[0];
                const ABI = await readABIFromURL("/contracts/TheoDoiSanPham.json");
                const Address = "0x6E888cc48eE971698a218e2E0CD7C7e4de29dd53";
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
    ```
    `ABI` được tự động đọc vào từ file `.json` được tạo lúc compile bằng `Truffle` và `Address` là địa chỉ của tài khoản ví (Public key được `Ganache` tạo sẵn khi khởi động máy chủ)
    - Thêm `base.js` vào `main.html`:
    ```html
    <script src="/js/base.js"></script>
    ```
8. Để `web3` hoạt động được cần:
    - Cài đặt `MetaMask`, mở lên và đăng nhập.
    - Vào phần cài đặt để thiết lập máy chủ.
    - Thêm máy chủ `Ganache` ở mục `Networks` 
        - Địa chỉ máy chủ copy ở mục `PORTS` của VSCode - do đang chạy trên CodeSpace, nếu chạy trên Local thì copy từ `truffle-config.js`
        - ID mặc định là `1337` (xem ở terminal chạy `Ganache`)
    - Thêm tài khoản ví (1 trong các tài khoản - Private key được `Ganache` tạo sẵn khi khởi động máy chủ)
9. Chạy ứng dụng:
    - Đảm bảo máy chủ `Ganache` đã hoạt động (Gõ lệnh `npx ganache-cli` nếu cần chạy lại)
    - Gõ lệnh: `npm run start` trên terminal.
    - Hai lệnh này đều được cấu hình ở `.vscode/tasks.json` nên có thể nhấn `Ctrl + Shift + B` và chọn lệnh để thực hiện.