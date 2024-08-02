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
- Khởi động `CodeSpace` (Đã cấu hình sẵn việc cài đặt `Node.js`)
- Các gói thư viện cần thiết cho dự án được cấu hình tại file `package.json` cũng được tự động cài đặt cùng với việc khởi tạo `codespace` nhờ lệnh `npm install` trong file `.devcontainer/devcontainer.json`. Nếu cần cập nhật các goi thư viện mới thì nhớ chạy lệnh `npm install` trên terminal
- Gõ lệnh: `npx truffle -v` trên terminal để xem các thông tin về phiên bản của `Truffle`, `Ganache`, `Solidity`, `Node` và `Web3.js`
- Gõ lệnh `npx truffle init` trên terminal để bắt đầu thiết lập các file, thư mục cơ bản cho dự án
- Gõ lệnh: `npx ganache-cli` trên terminal để khởi động Ganache và xem các thông tin về network và accounts
- Copy các thông tin về network của Ganache vào file cấu hình `truffle-config.js`

```json
module.exports = {
  networks: {
     development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 8545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    }
  }
}
```

- Gõ lệnh `npx truffle compile` trên terminal để biên dịch các file `.sol` trong thư mục `contracts`, kết quả sẽ là các file tương ứng với tên contracts và được lưu trong thư mục `build\contracts`
- Tạo file `index.js` chứa thông tin máy chủ node.js

```javascript
const express = require("express");
const path = require("path");
const app = express();

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/src/main.html"));
})

const server = app.listen(5000);
const portNumber = server.address().port;
console.log(`port is open on ${portNumber}`);
```

- Tạo file `main.html` trong thư mục `src` và các file khác để dựng giao diện ứng dụng. 
- Nếu cần sử dụng web3 thì thêm thư viện vào:

```html
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/web3/1.2.7-rc.0/web3.min.js"></script>
```
- Thêm nút vào HTML:

```html
<button id="conn" onclick="Conn2BC()">Kết nối đến mạng blockchain</button>
```

- Viết mã js để kết nối tới mạng BlockChain:

```javascript
const Conn2BC = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                account = accounts[0];
                const ABI = [ ... ];
                const Address = "...";
                window.web3 = new Web3(window.ethereum);
                window.contract = new window.web3.eth.Contract(ABI, Address);
                document.getElementById("conn").innerHTML = "Kết nối đến mạng blockchain: thành công";
            } catch (error) {
                document.getElementById("conn").innerHTML = "Lỗi khi kết nối đến MetaMask.";
                console.error(error);
            }
        } else {
            document.getElementById("conn").innerHTML = "Vui lòng cài đặt MetaMask.";
        }
    }
```

`ABI` được copy từ file `.json` khi compile bằng Truffle và `Address` là địa chỉ của tài khoản ví (Public key)
- Để `web3` hoạt động được cần cài đặt `Meta Mask`, khai báo máy chủ `Ganache` ở phần `Networks` trong mục cấu hình đồng thời thêm tài khoản ví vào (1 tài khoản được Ganache tạo sẵn khi khởi động máy chủ)
- Gõ lệnh: `npm run start` trên terminal hoặc nhấn `Ctrl + Shift + B` để chạy ứng dụng.