// Intersection Type | 交差型
type Admin = {
    name: string;
    privileges: string[];
}

type Employee = {
    name: string;
    startDate: Date;

}
// interface ElevatedEmployee extends Employee, Admin {}

type ElevatedEmployee = Admin & Employee;

const el: ElevatedEmployee = {
    name: 'Max',
    privileges: ['create-server'],
    startDate: new Date(),
}

type Combinable = string | number;
type Numeric = number | boolean;
type Universal = Combinable & Numeric;


function add2(a: Combinable, b: Combinable) {
    if ( typeof a === 'string' || typeof b === 'string' ) {
        return a.toString() + b.toString();
    }
    return a + b;
}

type UnknowEmployee = Employee | Admin;

function printEmployeeInformation(enp: UnknowEmployee) {
    console.log(enp.name);
    if ('privileges' in enp) {
        console.log('Privileges: '+ enp.privileges);

    }
    if ('startDate' in enp) {
        console.log('Start date:: '+ enp.startDate);
    }

}

printEmployeeInformation(el);
printEmployeeInformation({ name: 'Menu', startDate: new Date()});

// Type Guard
class Car {
    drive() {
        console.log('運転中...');
    }
}

class Truck {
    drive() {
        console.log('トラックを運転中...');
    }

    loadCargo(amount: number) {
        console.log('荷物を載せています...' + amount)
    }
}

type Vehicle = Car | Truck;

const v1 = new Car();
const v2 = new Truck();

function useVehicle(vehicle: Vehicle) {
    vehicle.drive();

    if (vehicle instanceof Truck) {
        vehicle.loadCargo(1000);
    }
}


useVehicle(v1);
useVehicle(v2);


// Discriminated Unions
interface Bird {
    type: 'bird',
    flyingSpeed: number;
}

interface Horse {
    type: 'Horse',
    runningSpeed: number;
}

type Animal = Bird | Horse;

function moveAnimal(animal: Animal) {
    let speed;
    switch(animal.type) {
        case "bird":
            speed = animal.flyingSpeed;
            break;
        case "Horse":
            speed = animal.runningSpeed;
            break;
    }
    console.log('移動速度:' + speed);
}

moveAnimal({type: 'bird', flyingSpeed: 10});

// Type Casting

// const userInputElement = <HTMLInputElement>document.getElementById('user-input')!;
//const userInputElement = document.getElementById('user-input');
//const userInputElement = document.getElementById('user-input')! as HTMLInputElement;
const userInputElement = document.getElementById('user-input');


if (userInputElement) {
   (userInputElement as HTMLInputElement).value = 'こんにちは';
}

// Index Types | Index Signatures
interface ErrorContainer {
    [prop: string]: string;
}

const errorBag: ErrorContainer = {
    email: '正しいメールアドレスではありません',
    username: 'ユーザ名に記号をふくめることはできません',
};


// function overload

function add_func(a: string, b:string): string;
function add_func(a: string, b:string): string;
function add_func(a: number, b:string): string;
function add_func(a: number, b:number): number;
function add_func(a: Combinable, b: Combinable) {
    if ( typeof a === 'string' || typeof b === 'string' ) {
        return a.toString() + b.toString();
    }
    return a + b;
}

const result2 = add_func('Hello', 'TypeScript');
result2.split(' ');

// Optional Chaining
const fetchedUserData = {
    id: 'ui',
    name: 'user1',
    job: {
        title: 'Developer',
        description: 'TypeScript',
    },
};

// JS の場合のキー確認とキー存在時に実行する書き方
// console.log(fetchedUserData.job && fetchedUserData.job.title);

//TSの場合
console.log(fetchedUserData?.job?.title);


// Nullish Coalescing Operator | NULL合体演算子
let userInput2 = null;
let storedData = userInput2 || 'DEFAULT';
console.log(storedData);

userInput2 = '';
storedData = userInput2 || 'DEFAULT';
console.log(storedData);

userInput2 = '';
storedData = userInput2 ?? 'DEFAULT';
console.log(storedData);

userInput2 = undefined;
storedData = userInput2 ?? 'DEFAULT';
console.log(storedData);

userInput2 = null;
storedData = userInput2 ?? 'DEFAULT';
console.log(storedData);