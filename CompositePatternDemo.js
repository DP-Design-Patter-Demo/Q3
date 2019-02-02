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
    };
    Employee.prototype.getBoss = function () {
        return this.boss;
    };
    Employee.prototype.getAllBosses = function () {
        if (this.boss) {
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
        var temp = [];
        this.lowerEmployees.map(function (x) {
            if (temp.indexOf(x) <= 0) {
                temp.push(x);
            }
        });
        this.lowerEmployees = temp;
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
var CompositePatternDemo = /** @class */ (function () {
    function CompositePatternDemo() {
        var _this = this;
        this.traversedNodes = [];
        this.finalResult = '';
        this.container = document.getElementById('org');
        this.control = document.getElementById('control');
        this.chart = document.getElementById('chart');
        this.showStatBtn = document.getElementById('showStatBtn');
        this.statResult = document.getElementById('statResult');
        // Input Fields
        this.employeeOptions = document.getElementById('employeeOptions');
        this.subordinateOptions = document.getElementById('subordinateOptions');
        this.employeeName = document.getElementById('employeeName');
        this.employeeSalary = document.getElementById('employeeSalary');
        this.employeeDept = document.getElementById('employeeDept');
        this.addEmployee = document.getElementById('addEmployee');
        var CEO = new Employee('Mikiyas Olika', 1000, "CEO");
        var marketing = new Employee("Kaleab Mokonen", 500, "Marketing");
        var marketing1 = new Employee("Kabila Haile", 510, "Marketing");
        var sales = new Employee("Alazar Alemayehu", 600, "sales");
        var clerk1 = new Employee("Clerk One", 100, "Clerk");
        var clerk2 = new Employee("Clerk Two", 100, "Clerk");
        var clerk3 = new Employee("Clerk 3", 100, "Clerk");
        this.topNode = CEO;
        CEO.add(marketing);
        CEO.add(marketing1);
        marketing.add(sales);
        marketing1.add(clerk1);
        sales.add(clerk2);
        sales.add(clerk3);
        this.tree = this.getTree();
        this.treeView = this.getTreeView(this.tree);
        this.container.innerHTML = this.treeView;
        this.createOptionsView(this.tree);
        this.showStatBtn.addEventListener('click', function (e) {
            var selectedEmployee = _this.employeeOptions.options[_this.employeeOptions.selectedIndex].value;
            _this.showStat(selectedEmployee);
        });
        this.addEmployee.addEventListener('click', function (e) {
            _this.nodeEventHandler();
        });
    }
    CompositePatternDemo.prototype.getTree = function () {
        return this.topNode.getLowerEmployees();
    };
    CompositePatternDemo.prototype.createOptionsView = function (tree) {
        var _this = this;
        var i;
        for (i = this.employeeOptions.options.length - 1; i >= 0; i--) {
            this.employeeOptions.remove(i);
            this.subordinateOptions.remove(i);
        }
        this.tree.forEach(function (element) {
            var el = document.createElement("option");
            el.textContent = element.getName();
            el.value = element.getName();
            _this.subordinateOptions.appendChild(el.cloneNode(true));
            _this.employeeOptions.appendChild(el);
        });
    };
    CompositePatternDemo.prototype.nodeEventHandler = function () {
        var bossName = this.subordinateOptions.value;
        if (this.employeeName.value && Number(this.employeeSalary.value) && this.employeeDept.value) {
            var newEmployee_1 = new Employee(this.employeeName.value, Number(this.employeeSalary.value), this.employeeDept.value);
            this.tree = this.getTree();
            this.tree.forEach(function (element) {
                if (element.getName() == bossName) {
                    element.add(newEmployee_1);
                }
            });
            this.chart.removeChild(this.chart.childNodes[0]);
            this.container.innerHTML = '';
            this.tree = this.getTree();
            this.treeView = this.getTreeView(this.tree);
            this.container.innerHTML = this.treeView;
            var newScript = document.createElement("script");
            var inlineScript = document.createTextNode(" $(\"#org\").jOrgChart({\n                chartElement: '#chart',\n                dragAndDrop: true\n            }); console.log('this');");
            newScript.appendChild(inlineScript);
            document.body.appendChild(newScript);
            this.employeeName.value = '';
            this.employeeSalary.value = '';
            this.employeeDept.value = '';
            this.createOptionsView(this.tree);
        }
    };
    CompositePatternDemo.prototype.showStat = function (employeeName) {
        var _this = this;
        console.log(employeeName);
        this.tree.forEach(function (element) {
            if (element.getName() == employeeName) {
                console.log(element.getAllEmployeeSalery());
                var result = '<ul>';
                result += "<li><span>Name : </span> <span>" + element.getName() + "</span></li>";
                result += "<li><span>Title : </span> <span>" + element.getDept() + "</span></li>";
                result += "<li><span>Employee Salary : </span> <span>" + element.getSalary() + "</span></li>";
                result += "<li><span>Subordinate Salary: </span> <span>" + element.getAllEmployeeSalery() + "</span></li>";
                result += "<li><span>Number of Subordinates : </span> <span>" + element.getSubordinates().length + "</span></li>";
                result += '</ul>';
                _this.statResult.innerHTML = result;
            }
        });
    };
    CompositePatternDemo.prototype.getTreeView = function (tree) {
        var _this = this;
        this.finalResult = '';
        this.traversedNodes = [];
        this.finalResult = "\n        <li class=\"tooltip\"> " + this.topNode.getName() + " <br>\n            <div class=\"top\">\n            <ul>\n                <li><span>Self S :</span> <span>" + this.topNode.getSalary() + "</span></li>\n                <li>Subordinate S: <span>" + this.topNode.getAllEmployeeSalery() + "</span></li>\n            </ul><i></i>\n            </div>\n        <ul>";
        this.tree.forEach(function (item, index) {
            // console.log(item)
            if (_this.traversedNodes.indexOf(item.getName()) < 0) {
                _this.traversedNodes.push(item.getName());
                if (_this.topNode.getName() != item.getName() && item.getBoss().getName() == _this.topNode.getName()) {
                    _this.finalResult += "<li>" + item.getName() + "<br> <span class=\"info\">" + item.getSalary() + "</span></li>";
                }
            }
        });
        var indexOfInsertion;
        this.tree.forEach(function (subItem, index) {
            indexOfInsertion = _this.finalResult.indexOf("<li>" + subItem.getName()) + ("<li>" + subItem.getName()).length;
            if (indexOfInsertion >= 0) {
                var appendedChild_1 = '<ul>';
                _this.tree.forEach(function (element) {
                    if (element.getBoss().getName() == subItem.getName()) {
                        appendedChild_1 = appendedChild_1 + ("<li>" + element.getName() + "<br> <span class=\"info\">" + element.getSalary() + "</span></li>");
                    }
                });
                appendedChild_1 = appendedChild_1 + "</ul>";
                _this.finalResult = _this.finalResult.slice(0, indexOfInsertion) + appendedChild_1 + _this.finalResult.slice(indexOfInsertion);
            }
        });
        this.finalResult += " </ul></li>";
        return this.finalResult;
    };
    return CompositePatternDemo;
}());
new CompositePatternDemo();
