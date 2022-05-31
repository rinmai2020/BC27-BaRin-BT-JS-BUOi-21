function StaffList(
  account,
  fullName,
  email,
  password,
  workingDay,
  salaryBasic,
  position,
  timeWork
) {
  this.account = account;
  this.fullName = fullName;
  this.email = email;
  this.password = password;
  this.workingDay = workingDay;
  this.salaryBasic = salaryBasic;
  this.position = position;
  this.timeWork = timeWork;
}
//Phương thức tính lương
StaffList.prototype.totalSalary = function () {
  var salary = calcSalary(this.salaryBasic, this.position);
  return salary;
};
//Phương thức tính xấp loại

StaffList.prototype.classification = function () {
  var rank = getRank(this.timeWork);
  return rank;
};
