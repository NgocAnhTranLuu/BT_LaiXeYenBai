
// const TaiKhoan = [
//     { username: "aaa", email: "a@gmail.com", password: "123" },
//     { username: "bbb", email: "b@gmail.com", password: "123" },
//     { username: "ccc", email: "c@gmail.com", password: "123" },
// ]
// let jsonTK = JSON.stringify(TaiKhoan)
// localStorage.setItem("TaiKhoan", jsonTK)

//kiểm tra ở local có biến UserChinh chưa? để bắt đăng nhập hoặc chuyển trang (vì isLogin mặc định là false - do khi chưa đăng nhập thì chưa lưu file)
let isLogin = localStorage.getItem("UserChinh") ? true : false
// let isTaiKhoanND = localStorage.getItem("TaiKhoanND") ? true : false


// console.log(username)

function checkLogin() {
    if (isLogin) {
        window.location.href = "../../../html/DangKy/DangKyKhoaHoc/DangKyKhoaHoc.html"
        //nếu isLogin đúng thì chuyển trang html
    }
}


function dangNhap() {

    let username = document.querySelector("#UserDN").value
    let password = document.querySelector("#passwordDN").value;
    if (localStorage.getItem("TaiKhoanND")) {
        //lấy thông tin từ local
        let user = localStorage.getItem("TaiKhoanND")
        let data = JSON.parse(user)

        //hàm some để kiểm tra biến true hoặc flase
        let checkDN = data.some(value => value.username == username && value.password == password)

        if (checkDN) {
            localStorage.setItem("UserChinh", username)
            //nếu checkDN là true thì lưu vào local user
            isLogin = true
            checkLogin() //đổi isLogin về true (vì mặc định là false) và chạy hàm để chuyển trang
        } else {
            alert("Đăng nhập thất bại")
        }
    } else {
        alert("Đăng nhập thất bại")
    }



}