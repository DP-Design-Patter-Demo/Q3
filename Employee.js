"use strict";
exports.__esModule = true;
var Employee = /** @class */ (function () {
    function Employee(name, salary, dept) {
        this.lowerEmployeesName = [];
        this.name = name;
        this.salary = salary;
        this.dept = dept;
        this.subordinates = [];
        this.lowerEmployees = [];
    }
    Employee.prototype.getName = function () {
        return this.name;
    };
    Employee.prototype.getSalary = function () {
        return this.salary;
    };
    Employee.prototype.getDept = function () {
        return this.dept;
    };
    Employee.prototype.setBoss = function (boss) {
        this.boss = boss;
        // console.log("=== === === === === === === === === === === ")
        // console.log(this.name + "'s boss is set as : ", boss.name);
    };
    Employee.prototype.getBoss = function () {
        return this.boss;
    };
    Employee.prototype.getAllBosses = function () {
        if (this.boss) {
            // console.log("=== === === === === === === === === === === ")
            // console.log(this.boss.name);
            this.boss.getAllBosses();
        }
    };
    Employee.prototype.getAllEmployeeSalery = function () {
        var totalSalary = this.salary;
        this.subordinates.length ? this.subordinates.forEach(function (item) { return totalSalary += item.getAllEmployeeSalery(); }) : null;
        return totalSalary;
    };
    Employee.prototype.add = function (subordinate) {
        this.subordinates.push(subordinate);
        this.setEmployeeBoss(subordinate);
    };
    Employee.prototype.remove = function (subordinate) {
        this.subordinates.splice(this.subordinates.indexOf(subordinate), 1);
    };
    Employee.prototype.getSubordinates = function () {
        return this.subordinates;
    };
    Employee.prototype.getLowerEmployees = function () {
        var _this = this;
        if (this.subordinates.length > 0) {
            this.lowerEmployees = this.getSubordinates().slice();
            this.subordinates.forEach(function (element) {
                var i = element.getLowerEmployees();
                i.forEach(function (x) {
                    // if (!this.lowerEmployees.includes(x)) {
                    _this.lowerEmployees.push(x);
                    // }
                });
            });
        }
        else {
            this.lowerEmployees = [this];
        }
        return this.lowerEmployees;
    };
    Employee.prototype.toString = function () {
        return "Employee : [ Name : " + this.name + ", Dept : " + this.dept + ", Salary " + this.salary;
    };
    Employee.prototype.setEmployeeBoss = function (employee) {
        employee.setBoss(this);
    };
    return Employee;
}());
exports.Employee = Employee;
// Miki
//     - Kal
//         -Alazar
//             -Clerk 2
//     -Kab
//         -Clerk 1
