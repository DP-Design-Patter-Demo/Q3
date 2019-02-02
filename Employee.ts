export  class Employee {
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
        // console.log("=== === === === === === === === === === === ")
        // console.log(this.name + "'s boss is set as : ", boss.name);
    }
    getBoss(): Employee {
        return this.boss;
    }
    getAllBosses(): void {
        if (this.boss) {
            // console.log("=== === === === === === === === === === === ")
            // console.log(this.boss.name);
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
        return this.lowerEmployees;
    }
    toString(): string {
        return "Employee : [ Name : " + this.name + ", Dept : " + this.dept + ", Salary " + this.salary
    }
    setEmployeeBoss(employee: Employee) {
        employee.setBoss(this);
    }

}

// Miki
//     - Kal
//         -Alazar
//             -Clerk 2
//     -Kab
//         -Clerk 1