abstract class Department {
    static fiscalYear = 2020;
    // private readonly id: string;
    //public name: string;
    protected employees: string[] = [];

    static createEmployee(name: string) {
        return { name: name };
    }
    
    constructor(protected readonly id: string, public name: string) {
        // this.id = id;
        // this.name = name;
    }

    abstract describe(this: Department): void;

    addEmployee(employee: string) {
        this.employees.push(employee);
    }

    printEmployeeInformation() {
        console.log(this.employees.length);
        console.log(this.employees);
    }
}

class ITDepartment extends Department {
    admins: string[];
    constructor(id: string, admins: string[]) {
        super(id, 'IT');
        this.admins = admins;
    }
    
    describe(): void {
        console.log("IT - ID: " + this.id);
    }
}

class AccountingDepartment extends Department {
    private lastReport: string;
    private static instance: AccountingDepartment;

    get mostRecentReport() {
        if (this.lastReport) {
            return this.lastReport;
        }
        throw new Error('report not found');
    }
    set mostRecentReport(value: string) {
        if (!value) {
            throw new Error('正しい値を設定してください');
        }
        this.addReport(value);
    }
    private constructor(id: string, private reports: string[]) {
        super(id, 'Accounting');
        this.lastReport = reports[0];
    }

    addReport(text: string) {
        this.reports.push(text);
        this.lastReport = text;
    }

    printReports() {
        console.log(this.reports);
    }

    addEmployee(name: string): void {
        if (name == 'Max') {
            return;
        }
        this.employees.push(name);
    }

    static getInstance() {
        if (AccountingDepartment.instance) {
            return this.instance;
        }
        this.instance = new AccountingDepartment('D2', []);
        return this.instance;
    }
    
    describe(): void {
        console.log("会計 - ID: " + this.id);
    }
}
const employee1 = Department.createEmployee('Max');
console.log(employee1, Department.fiscalYear);

const it = new ITDepartment('d1', ['Max']);

// it.addEmployeer('Max');
// it.addEmployeer('Manu');

it.describe();
it.printEmployeeInformation();


// const accounting = new AccountingDepartment('d2', []);
const accounting = AccountingDepartment.getInstance();
const accounting2 = AccountingDepartment.getInstance();

console.log(accounting, accounting2);

accounting.describe();
accounting.mostRecentReport = 'test'
accounting.addReport("Somthing");
console.log(accounting.mostRecentReport);

accounting.printReports();

accounting.addEmployee('Max');
accounting.addEmployee('Manu');

accounting.printEmployeeInformation();

// const accountingCopy = { describe: accounting.describe};
// accountingCopy.describe();