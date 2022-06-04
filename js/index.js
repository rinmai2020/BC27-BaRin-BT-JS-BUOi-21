function $(x) {
  return document.getElementById(x);
}

var staffList = [];
//Hàm này sẽ tự động được gọi đầu tiên khi chương trình được chay
init();
function init() {
  //B1 lấy data tư local storage
  //Khi lấy data từ localStorage lên, nếu data là array/object (đã bị stringify) dùng JSON.parse để chuyển dat về lại object
  staffList = JSON.parse(localStorage.getItem("staffList")) || [];

  for (var i = 0; i < staffList.length; i++) {
    var staff = staffList[i];
    staffList[i] = new StaffList(
      staff.account,
      staff.fullName,
      staff.email,
      staff.password,
      staff.workingDay,
      staff.salaryBasic,
      staff.position,
      staff.timeWork
    );
  }

  display(staffList);
}
function addUser() {
  //B1 DOM value
  let account = $("tknv").value;
  let fullName = $("name").value;
  let email = $("email").value;
  let password = $("password").value;
  let workingDay = $("datepicker").value;
  let salaryBasic = +$("luongCB").value;
  let position = $("chucvu").value;
  let timeWork = +$("gioLam").value;
  var valid = validation();
  if (!valid) {
    return;
  }
  //B2 Khởi tạo đối tưởng user
  var staff = new StaffList(
    account,
    fullName,
    email,
    password,
    workingDay,
    salaryBasic,
    position,
    timeWork
  );

  //B3 Hiển thị staff vừa thêm lên trên giao diện table
  //thêm staff vừa tạo mảng staffList;
  staffList.push(staff);
  resetFormt();
  //B4 Lưu biến staff xuống local storage
  localStorage.setItem("staffList", JSON.stringify(staffList));
  display(staffList);
}

function display(staffList) {
  var tbodyListEl = $("tableDanhSach");
  //Chứa nội dung HTML se được thêm vào trong thẻ tbodyListEl
  var html = "";
  //Duyệt mảng
  for (var i = 0; i < staffList.length; i++) {
    var staff = staffList[i];
    html += `
    <tr>
      <td>${staff.account}</td>
      <td>${staff.fullName}</td>
      <td>${staff.email}</td>
      <td>${staff.workingDay}</td>
      <td>${staff.position}</td>
      <td>${staff.totalSalary()}</td>
      <td >${staff.classification()}</td>
      <td>
      <button class = "btn btn-success" onclick = "selectStaff('${
        staff.account
      }')" data-toggle="modal"
      data-target="#myModal">Cập nhật</button>
      <button class = "btn btn-danger" onclick = "deleteStaff('${
        staff.account
      }')" >Xoá</button>
      </td>

    </tr>
  `;
  }

  //Đưa nội dung được tao  từ staff vào thẻ html
  tbodyListEl.innerHTML = html;
}
function resetFormt() {
  // reset input
  document.getElementById("tknv").value = "";
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("datepicker").value = "";
  document.getElementById("luongCB").value = "";
  document.getElementById("chucvu").value = "";
  document.getElementById("gioLam").value = "";

  document.getElementById("btnThemNV").disabled = false;
  document.getElementById("tknv").disabled = false;

  // reset thông báo lỗi
  document.getElementById("tbTKNV").innerHTML = "";
  document.getElementById("tbTen").innerHTML = "";
  document.getElementById("tbEmail").innerHTML = "";
  document.getElementById("tbMatKhau").innerHTML = "";
  document.getElementById("tbNgay").innerHTML = "";
  document.getElementById("tbLuongCB").innerHTML = "";
  document.getElementById("tbChucVu").innerHTML = "";
  document.getElementById("tbGiolam").innerHTML = "";
}

function deleteStaff(staffAccount) {
  //Dùng account của staff tìm ra và xoá staff đó
  //ban đầu mặc định ko có
  var index = findStaff(staffAccount);
  if (index !== -1) {
    //Xoá 1 phần tử ở vị trí bất khi trong mảng
    staffList.splice(index, 1);
    //Gọi hàm display lần nửa nó dùng mảng đó duyệt mảng render để tạo ra thẻ tr
  }
  localStorage.setItem("staffList", JSON.stringify(staffList));
  display(staffList);
}
function searchStaff() {
  //B1 DOM láy giá trị
  var searchValue = $("searchName").value;
  searchValue = searchValue.toLowerCase();
  //B2 lọc ra mảng mới thoã mãn điều kiện giá trị searchValue khớp với tên nhân viên
  var newStaff = [];
  for (var i = 0; i < staffList.length; i++) {
    var staff = staffList[i];
    //chỉ search vào 1 tên thay vì cả họ tên thì dùng indexOf thay thế cho 3 dấu bằng
    var searchRank = staff.classification().toLowerCase();
    if (searchRank.indexOf(searchValue) !== -1) {
      newStaff.push(staff);
    }
  }
  //B3: Hiển thị ra giao diện danh sach nhân viên đã lọc
  display(newStaff);
}

function selectStaff(staffAccount) {
  //Dùng staffAccount
  var index = findStaff(staffAccount);
  //Lấy ra staff muốn cập nhật từ mảng staffList
  var staff = staffList[index];
  //Đưa thông tin của staff này lên giao diện
  $("tknv").value = staff.account;
  $("name").value = staff.fullName;
  $("email").value = staff.email;
  $("password").value = staff.password;
  $("datepicker").value = staff.workingDay;
  $("luongCB").value = staff.salaryBasic;
  $("chucvu").value = staff.position;
  $("gioLam").value = staff.timeWork;
  //JSON.stringify(value) là chuyển 1 aray/object thành 1 chuỗi dang JSON
}
//nhận vào staff trả ra index staff bên trong mảng
function findStaff(staffAccount) {
  //Tìm chỉ mục của phân tử muốn xoá trong mảng staffList
  var index = -1;
  for (var i = 0; i < staffList.length; i++) {
    //kiẻm phần tử  staff trong mảng nào account khớp với stffshowaccount
    if (staffList[i].account === staffAccount) {
      //i gan cho index xong break
      index = i;
      break;
    }
  }
  return index;
}
function updateStaff() {
  //B1 DOM
  let account = $("tknv").value;
  let fullName = $("name").value;
  let email = $("email").value;
  let password = $("password").value;
  let workingDay = $("datepicker").value;
  let salaryBasic = $("luongCB").value;
  let position = $("chucvu").value;
  let timeWork = $("gioLam").value;
  //B2 Khởi tạo đối tượng Student từ các giá trị Input
  var staff = new StaffList(
    account,
    fullName,
    email,
    password,
    workingDay,
    salaryBasic,
    position,
    timeWork
  );
  //B3 Cập nhật
  //Tim index của nhân viên muốn cấp nhật
  // var index = findStaff(staff.account);
  // var index = findStaff(staff.fullName);
  var index = findStaff(staff.account);
  staffList[index] = staff;
  localStorage.setItem("staffList", JSON.stringify(staffList));
  //B4 Gọi hàm display hiển thị
  display(staffList);
}
//validator
function validation() {
  // B1 : DOM lấy value từ inout
  let account = $("tknv").value;
  let fullName = $("name").value;
  let email = $("email").value;
  let password = $("password").value;
  let workingDay = $("datepicker").value;
  let salaryBasic = +$("luongCB").value;
  let position = $("chucvu").value;
  let timeWork = +$("gioLam").value;
  //Tài khoản nhân viên
  var valid = true;
  var checkAccount = new RegExp("^-?[0-9][0-9,.]+$");
  var tbTKNV = $("tbTKNV");
  // Kiểm tra tên tài khoản nhân viên
  if (!isRequired(account)) {
    valid = false;
    tbTKNV.innerHTML = "Tài khoản là các ký số";
  } else if (!length(account, 6, 4)) {
    tbTKNV.innerHTML = "Tài khoản có tối thiểu 4-6 kí tự";
  } else if (!checkAccount.test(account)) {
    valid = false;
    tbTKNV.innerHTML = "Tài khoản là các ký số";
  } else {
    tbTKNV.innerHTML = "";
  }
  // kiểm tra tên nhân viên
  var checkName =
    /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/;
  var tbTen = $("tbTen");
  if (!isRequired(fullName)) {
    valid = false;
    tbTen.innerHTML = "Tên không được để trống";
  } else if (!checkName.test(fullName)) {
    valid = false;
    tbTen.innerHTML = "Tên người dùng nhập không đúng kí tự";
  } else {
    tbTen.innerHTML = "";
  }

  // kiểm tra email
  var emailPattern = new RegExp(
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$"
  );
  var tbEmail = $("tbEmail");

  if (!isRequired(email)) {
    valid = false;
    tbEmail.innerHTML = "Điền Email không được để trống";
  } else if (!emailPattern.test(email)) {
    valid = false;
    tbEmail.innerHTML = "Email không đúng định dạng";
  } else {
    tbEmail.innerHTML = "";
  }

  // kiểm tra password
  var pwPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,10}$/;

  var tbMatKhau = $("tbMatKhau");

  if (!isRequired(password)) {
    valid = false;
    tbMatKhau.innerHTML = "Nhập mật khẩu";
  } else if (!length(password, 10)) {
    valid = false;
    tbMatKhau.innerHTML = "Mật khẩu phải từ 6 - 10 kí tự";
  } else if (!pwPattern.test(password)) {
    valid = false;
    tbMatKhau.innerHTML = "mật khẩu phải có số, chữ thường và chữ in hoa";
  } else {
    tbMatKhau.innerHTML = "";
  }

  // kiểm tra ngày làm
  var dayPattern =
    /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/;
  var tbNgay = $("tbNgay");

  if (!isRequired(workingDay)) {
    valid = false;
    tbNgay.innerHTML = "Ngày làm không được để trống";
  } else if (!dayPattern.test(workingDay)) {
    valid = false;
    tbNgay.innerHTML = "Nhập tháng ngày năm";
  } else {
    tbNgay.innerHTML = "";
  }

  // kiểm tra lương cơ bản
  var tbLuongCB = $("tbLuongCB");

  if (!isRequired(salaryBasic)) {
    valid = false;
    tbLuongCB.innerHTML = "Nhập lương cơ bản";
  } else if (salaryBasic > 20e6 || 1e6 > salaryBasic) {
    valid = false;
    tbLuongCB.innerHTML = "Nhập đúng mức lương 1.000.000-20.000.000";
  } else {
    tbLuongCB.innerHTML = "";
  }

  // kiểm tra chức vụ
  var tbChucVu = $("tbChucVu");
  if (!isRequired(position)) {
    valid = false;
    tbChucVu.innerHTML = "Chọn chức vụ";
  } else if (position === "Chọn chức vụ") {
    valid = false;
    tbChucVu.innerHTML = "Chọn chức vụ";
  } else {
    tbChucVu.innerHTML = "";
  }

  // kiểm tra giờ làm
  var tbGiolam = $("tbGiolam");
  if (!isRequired(timeWork)) {
    valid = false;
    tbGiolam.innerHTML = "Nhập giờ làm";
  } else if (timeWork > 200 || timeWork < 80) {
    valid = false;
    tbGiolam.innerHTML = "Số giờ làm từ 80 - 200";
  } else {
    tbGiolam.innerHTML = "";
  }

  return valid;
}

// hàm kiểm tra input có trống hay không
function isRequired(value) {
  if (!value) {
    return false;
  }
  return true;
}

// hàm kiểm tra độ dài
function length(value, max, min) {
  if (value.length > max) {
    return false;
  }
  if (value.length < min) {
    return false;
  }
  return true;
}
//Tính lương
function calcSalary(salaryBasic, position) {
  var total = 0;
  if (position === "Sếp") {
    total = (salaryBasic * 3).toLocaleString();
  } else if (position === "Trưởng phòng") {
    total = (salaryBasic * 2).toLocaleString();
  } else if (position === "Nhân viên") {
    total = (salaryBasic * 1).toLocaleString();
  } else {
    total = "";
  }
  return total;
}
//Xếp loại nhân viên
function getRank(timeWork) {
  var typeRank = "";
  if (timeWork >= 192) {
    typeRank = "Excellent";
  } else if (timeWork >= 176) {
    typeRank = "Very Good";
  } else if (timeWork >= 160) {
    typeRank = "Good";
  } else {
    typeRank = "  Average";
  }
  return typeRank;
}
