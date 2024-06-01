

let KTUser = localStorage.getItem("UserChinh")
// console.log(KTUser)

let kiemTraUser = localStorage.getItem("UserChinh") ? true : false




function kiemTraLogin() {
    if (kiemTraUser) {
        window.location.href = "../../../index.html"
    } else {
        alert("Đăng nhập ngay để học các khóa lái xe")
        window.location.href = "Dangnhap.html"
    }
}

function tenTaiKhoanHeader() {
    let btnUser = ``
    const btn1 = document.querySelector('.btn_user1');
    const btn2 = document.querySelector('.btn_user2');

    if (kiemTraUser) {
        btn1.style.display = 'none';
        btn2.style.display = 'block';
        btnUser = KTUser.slice(0, 6) + "..."
        document.querySelector(".btn_user2_text").innerHTML = btnUser
    } else {
        btn1.style.display = 'block';
        btn2.style.display = 'none';
    }
}
tenTaiKhoanHeader()



const button = document.querySelector('[data-target="#anUser"]');
const targetElement = document.querySelector('#anUser');

// button.addEventListener('click', function () {
//     targetElement.classList.toggle('show');
// });
document.querySelector(".btn_user_tenND").innerHTML = KTUser
// document.querySelector(".btn_user_Email").innerHTML = "Email " + KTUser


function dangNhapKoTK() {
    window.location.href = "./html/DangKy/DangNhapDangKy/DangNhap.html"
}

function logOutUser() {
    if (kiemTraUser) {
        localStorage.removeItem("UserChinh");
        window.location.href = "./index.html"
    }
}


