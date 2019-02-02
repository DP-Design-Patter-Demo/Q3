class Employee {
    private name: string;
    private salary: number;
    private dept: string;
    private subordinates: Array<Employee>;
    private lowerEmployees: Array<Employee>;
    private lowerEmployeesName = [];
    private boss: Employee;

    constructor(name: string, salary: number, dept: string) {
        this.name = name;
        this.salary = salary;
        this.dept = dept;
        this.subordinates = [];
        this.lowerEmployees = []
    }


    getName(): string {
        return this.name;
    }
    getSalary(): number {
        return this.salary;
    }
    getDept(): string {
        return this.dept;
    }
    setBoss(boss: Employee) {
        this.boss = boss;
    }
    getBoss(): Employee {
        return this.boss;
    }
    getAllBosses(): void {
        if (this.boss) {
            this.boss.getAllBosses();
        }
    }
    getAllEmployeeSalery(): number {
        let totalSalary = this.salary;
        this.subordinates.length ? this.subordinates.forEach(item => totalSalary += item.getAllEmployeeSalery()) : null;
        return totalSalary;
    }
    add(subordinate: Employee): void {
        this.subordinates.push(subordinate);
        this.setEmployeeBoss(subordinate);
    }
    remove(subordinate: Employee) {
        this.subordinates.splice(this.subordinates.indexOf(subordinate), 1)
    }
    getSubordinates(): Array<Employee> {
        return this.subordinates;
    }
    getLowerEmployees(): Array<Employee> {
        if (this.subordinates.length > 0) {
            this.lowerEmployees = [...this.getSubordinates()];
            this.subordinates.forEach(element => {
                let i = element.getLowerEmployees();
                i.forEach(x => {
                    // if (!this.lowerEmployees.includes(x)) {
                    this.lowerEmployees.push(x);
                    // }
                })

            })
        } else {
            this.lowerEmployees = [this]
        }
        let temp = [];
        this.lowerEmployees.map(x => {
            if (temp.indexOf(x) <= 0) {
                temp.push(x);
            }
        })
        this.lowerEmployees = temp;
        return this.lowerEmployees;
    }
    toString(): string {
        return "Employee : [ Name : " + this.name + ", Dept : " + this.dept + ", Salary " + this.salary
    }
    setEmployeeBoss(employee: Employee) {
        employee.setBoss(this);
    }

}

class CompositePatternDemo {
    topNode: Employee;
    traversedNodes = [];
    finalResult = '';
    tree;
    treeView;

    container = document.getElementById('org');
    control = document.getElementById('control');
    chart = document.getElementById('chart');

    showStatBtn = document.getElementById('showStatBtn');
    statResult = document.getElementById('statResult');

    // Input Fields
    employeeOptions = document.getElementById('employeeOptions') as HTMLSelectElement;
    subordinateOptions = document.getElementById('subordinateOptions') as HTMLSelectElement;

    employeeName = document.getElementById('employeeName') as HTMLInputElement;
    employeeSalary = document.getElementById('employeeSalary') as HTMLInputElement;
    employeeDept = document.getElementById('employeeDept') as HTMLInputElement;

    addEmployee = document.getElementById('addEmployee');

    constructor() {
        let CEO = new Employee('Mikiyas Olika', 1000, "CEO");
        let marketing = new Employee("Kaleab Mokonen", 500, "Marketing");
        let marketing1 = new Employee("Kabila Haile", 510, "Marketing");
        let sales = new Employee("Alazar Alemayehu", 600, "sales");
        let clerk1 = new Employee("Clerk One", 100, "Clerk");
        let clerk2 = new Employee("Clerk Two", 100, "Clerk");
        let clerk3 = new Employee("Clerk 3", 100, "Clerk");

        this.topNode = CEO;

        CEO.add(marketing);
        CEO.add(marketing1);
        marketing.add(sales);
        marketing1.add(clerk1);
        sales.add(clerk2);
        sales.add(clerk3)

        this.tree = this.getTree();
        this.treeView = this.getTreeView(this.tree);
        this.container.innerHTML = this.treeView;

        this.createOptionsView(this.tree);

        this.showStatBtn.addEventListener('click', e => {
            let selectedEmployee = this.employeeOptions.options[this.employeeOptions.selectedIndex].value
            this.showStat(selectedEmployee);
        });

        this.addEmployee.addEventListener('click', e => {
            this.nodeEventHandler();
        })


    }

    getTree() {
        return this.topNode.getLowerEmployees();
    }

    createOptionsView(tree) {
        var i;
        for (i = this.employeeOptions.options.length - 1; i >= 0; i--) {
            this.employeeOptions.remove(i);
            this.subordinateOptions.remove(i)
        }

        this.tree.forEach(element => {
            var el = document.createElement("option");
            el.textContent = element.getName();
            el.value = element.getName();
            this.subordinateOptions.appendChild(el.cloneNode(true));
            this.employeeOptions.appendChild(el);
        });

    }
    nodeEventHandler() {
        let bossName = this.subordinateOptions.value;
        if (this.employeeName.value && Number(this.employeeSalary.value) && this.employeeDept.value) {
            let newEmployee = new Employee(this.employeeName.value, Number(this.employeeSalary.value), this.employeeDept.value);
            this.tree = this.getTree();
            this.tree.forEach(element => {
                if (element.getName() == bossName) {
                    element.add(newEmployee);
                }
            });

            this.chart.removeChild(this.chart.childNodes[0]);
            this.container.innerHTML = '';
            this.tree = this.getTree();
            this.treeView = this.getTreeView(this.tree);
            this.container.innerHTML = this.treeView;
            var newScript = document.createElement("script");
            var inlineScript = document.createTextNode(` $("#org").jOrgChart({
                chartElement: '#chart',
                dragAndDrop: true
            }); console.log('this');`);
            newScript.appendChild(inlineScript);
            document.body.appendChild(newScript);
            this.employeeName.value = '';
            this.employeeSalary.value = '';
            this.employeeDept.value = '';

            this.createOptionsView(this.tree);

        }
    }
    showStat(employeeName) {
        console.log(employeeName);
        this.tree.forEach(element => {
            if (element.getName() == employeeName) {
                console.log(element.getAllEmployeeSalery());
                let result = '<ul>';
                result += `<li><span>Name : </span> <span>${element.getName()}</span></li>`
                result += `<li><span>Title : </span> <span>${element.getDept()}</span></li>`
                result += `<li><span>Employee Salary : </span> <span>${element.getSalary()}</span></li>`
                result += `<li><span>Subordinate Salary: </span> <span>${element.getAllEmployeeSalery()}</span></li>`
                result += `<li><span>Number of Subordinates : </span> <span>${element.getSubordinates().length}</span></li>`
                result += '</ul>'
                this.statResult.innerHTML = result;

            }
        });
    }
    getTreeView(tree) {
        this.finalResult = '';
        this.traversedNodes = [];
        this.finalResult = `
        <li class="tooltip"> ${this.topNode.getName()} <br>
            <div class="top">
            <ul>
                <li><span>Self S :</span> <span>${this.topNode.getSalary()}</span></li>
                <li>Subordinate S: <span>${this.topNode.getAllEmployeeSalery()}</span></li>
            </ul><i></i>
            </div>
        <ul>`;
        this.tree.forEach((item, index) => {
            // console.log(item)
            if (this.traversedNodes.indexOf(item.getName()) < 0) {
                this.traversedNodes.push(item.getName());
                if (this.topNode.getName() != item.getName() && item.getBoss().getName() == this.topNode.getName()) {
                    this.finalResult += `<li>${item.getName()}<br> <span class="info">${item.getSalary()}</span></li>`;

                }
            }

        });

        let indexOfInsertion
        this.tree.forEach((subItem, index) => {
            indexOfInsertion = this.finalResult.indexOf(`<li>${subItem.getName()}`) + `<li>${subItem.getName()}`.length;
            if (indexOfInsertion >= 0) {
                let appendedChild = '<ul>';
                this.tree.forEach(element => {
                    if (element.getBoss().getName() == subItem.getName()) {
                        appendedChild = appendedChild + `<li>${element.getName()}<br> <span class="info">${element.getSalary()}</span></li>`;
                    }
                });
                appendedChild = appendedChild + `</ul>`;
                this.finalResult = this.finalResult.slice(0, indexOfInsertion) + appendedChild + this.finalResult.slice(indexOfInsertion);
            }

        })

        this.finalResult += ` </ul></li>`;
        return this.finalResult;
    }
}


new CompositePatternDemo();