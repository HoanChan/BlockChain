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
- Gõ lệnh: `npx ganache-cli` trên terminal để khởi động Ganache và xem các thông tin về network và accounts. Tuy nhiên vì hoạt động trên CodeSpace và mỗi lần khởi động ganache lại tạo các tài khoản ngẫu nhiên làm chúng ta phải cấu hình lại nên sẽ cố định địa chỉ ví, nơi lưu dữ liệu của các block như sau:
```bash
npx ganache-cli --account "0xa27d7934c86a4fa7d338d633cb33f100a871aa1e985177ac1434a76ab37a7a7c,1000000000000000000000" --account "0xff94674bde28731b78d6ba622b35ba7282d62b9eb5c653ccef04adc5160a52da,1000000000000000000000" --db "/workspaces/BlockChain/database"
```
Lệnh này đã được cấu hình sẵn ở `.vscode/tasks.json` nên chỉ cần nhấn `Ctrl + Shift + B` và chọn `Ganache` để chạy.

4. Copy các thông tin về network của Ganache vào file cấu hình [truffle-config.js](truffle-config.js)
5. Tạo file [migrations/1_deploy.js](migrations/1_deploy.js) để deploy các contracts lên máy chủ `Ganache`. Trong file này chúng ta viết code để thêm dữ liệu ban đầu cho `Smart Contract` luôn.
6. Gõ lệnh `npx truffle migrate --network development` trên terminal để biên dịch `Smart Contract`, kết quả sẽ là file tương ứng với tên contracts và được lưu trong thư mục `build\contracts` đồng thời triển khai các contracts lên máy chủ `Ganache`.
7. Tạo file [TheoDoiSanPham.test.js](test/TheoDoiSanPham.test.js) trong thư mục test để kiểm tra các hàm trong `Smart Contract`.
8. Gõ lệnh `npx truffle test` trên terminal để chạy việc kiểm tra các hàm trong `Smart Contract`, đảm bảo các hàm hoạt động đúng như mong muốn trước khi phát triển tiếp.
9. Tạo file [index.js](index.js) chứa thông tin máy chủ node.js
10. Tạo file các file khác để dựng giao diện ứng dụng:
    - [main.html](src/main.html) chứa giao diện ứng dụng.
    - [base.js](src/static/js/base.js) chứa các hàm để kết nối và gọi các hàm trong `Smart Contract`.  
11. Để `web3` hoạt động được cần:
    - Cài đặt `MetaMask`, mở lên và đăng nhập.
    - Vào phần cài đặt để thiết lập máy chủ.
    - Thêm máy chủ `Ganache` ở mục `Networks` 
        - Địa chỉ máy chủ copy ở mục `PORTS` của VSCode - do đang chạy trên CodeSpace, nếu chạy trên Local thì copy từ `truffle-config.js`
        - ID mặc định là `1337` (xem ở terminal chạy `Ganache`)
    - Thêm tài khoản ví (1 trong các tài khoản - Private key được `Ganache` tạo sẵn khi khởi động máy chủ)
    - Viết các lệnh để kết nối tới `MetaMask`, gọi các hàm trong `Smart Contract` trong file `base.js`
12. Chạy ứng dụng:
    - Đảm bảo máy chủ `Ganache` đã hoạt động.
    - Đảm bảo contract đã được compile và deploy lên máy chủ `Ganache`.
    - Gõ lệnh: `npm run start` trên terminal.
    - Cả 3 lệnh trên đều được cấu hình ở `.vscode/tasks.json` nên có thể nhấn `Ctrl + Shift + B` và chọn lệnh để thực hiện.