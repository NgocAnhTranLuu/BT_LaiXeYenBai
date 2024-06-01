function dangKy() {
    let username = document.querySelector("#User").value
    let email = document.querySelector("#email").value
    let password = document.querySelector("#password").value

    class ngDung {
        constructor(username, email, password) {
            this.username = username
            this.email = email
            this.password = password
        }
    }

    class DanhSachND {
        constructor() {
            this.mangND = []
        }
        // (2) các phương thức xử lý mảng
        themND = function (ndObj) {
            //thêm phần tử vào mảng
            this.mangND.push(ndObj)
        }

    }

    const taiKhoanND = new DanhSachND()





    //kiểm tra giữ liệu:
    const KTvalidation = new validation()


    let isValid = true
    //kiểm tra tên:
    isValid &= KTvalidation.kiemTraRong(username, "#spanUserDK", "Tên đăng nhập không được để trống")

    //kiểm tra email: rỗng và trùng và có @mail ko?
    isValid &= KTvalidation.kiemTraRong(email, "#spanEmailDK", "Email không được để trống") && KTvalidation.kiemEmailTrung(email, "#spanEmailDK", "Email không đã đăng ký, vui lòng nhập Email khác") && KTvalidation.kiemEmailDung(email, "#spanEmailDK", "Email chưa đúng định dạng")

    //kiểm tra mật khẩu:
    isValid &= KTvalidation.kiemTraRong(password, "#spanPassWordDK", "Pass không được để trống")

    // kiểm tra isValidnếu đúng hết mới lưu dữ liệu
    if (isValid) {

        function setLocalStorage(mangND) {
            // lưu mảng sinh viên xuống localstorage, để khi cập nhật, thay đổi vẫn giữ giá trị ban đầu
            // localstorage là object có sẵn của JS, setItem ("tên localstorage", chỗi JSON): phương thức lưu xuống local. Ở đây là chuyển từ array object => JSON => stringify (chuyển từ mảng xuống JSON)
            localStorage.setItem("TaiKhoanND", JSON.stringify(mangND))
        }

        function getLocalStorage() {
            // vì lưu ở localstorage trình duyệt này, sang trình duyệt khác ko có, nó sẽ trả về kiểu null. Chính vì thế phải có hàm if. nếu nó khác null thì mới chạy, nếu là null, yêu cầu nhập lại

            if (localStorage.getItem("TaiKhoanND") != null) {
                // chuyển từ JSON ngược lại mảng
                // getItem: kết quả là kiểu JSON nên sẽ ko lưu phương thức, chỉ lưu duy nhất thuộc tính. Chú ý cả tên "TaiKhoanND" phải cùng để lấy vị trí đã lưu
                let resultJSON = localStorage.getItem("TaiKhoanND");
                taiKhoanND.mangND = JSON.parse(resultJSON)
            }

        }
        getLocalStorage() // gọi ra để load lại web ko bị mất ở phần hiển thị


        let user = new ngDung(username, email, password)
        taiKhoanND.themND(user)
        setLocalStorage(taiKhoanND.mangND)

        alert("Đăng ký thành công")
        window.location.href = "Dangnhap.html"
    } else {
        alert("Đăng ký thất bại")
    }


}