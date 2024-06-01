class validation {
    // kiểm tra rỗng: nhập vào: lấy giá trị ô nhập, kiểm tra vị trí id ô nhập, nội dung lên ô nhập
    kiemTraRong = function (value, idSpan, message) {
        if (value !== "") {
            document.querySelector(idSpan).innerHTML = ""
            document.querySelector(idSpan).style.display = "none"
            return true
        } else {
            document.querySelector(idSpan).innerHTML = message
            document.querySelector(idSpan).style.display = "block"
            return false
        }

    }


    //kiểm tra trùng
    kiemEmailTrung = function (value, idSpan, message) {
        if (localStorage.getItem("TaiKhoanND")) {
            let emailLocal = JSON.parse(localStorage.getItem("TaiKhoanND"))

            let result = emailLocal.some(user => user.email === value)
            // console.log(result)
            if (result) {
                document.querySelector(idSpan).innerHTML = message
                document.querySelector(idSpan).style.display = "block"
                return false
            } else {
                document.querySelector(idSpan).innerHTML = ""
                document.querySelector(idSpan).style.display = "none"
                return true
            }
        } else{
            document.querySelector(idSpan).innerHTML = ""
            document.querySelector(idSpan).style.display = "none"
            return true
        }

    }

    //kiểm tra email đúng ko
    kiemEmailDung = function (value, idSpan, message) {
        let Emailresult = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (value.match(Emailresult)) {
            document.querySelector(idSpan).innerHTML = ""
            document.querySelector(idSpan).style.display = "none"
            return true
        } else {
            document.querySelector(idSpan).innerHTML = message
            document.querySelector(idSpan).style.display = "block"
            return false
        }
    }

}

