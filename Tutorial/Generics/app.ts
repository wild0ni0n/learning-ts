// const names: Array<stirng> = []; //string[]

// // name[0].split(' ');

// const promise:Promise<any> = new Promise<string>((resolve, reject) => {
//     setTimeout(() => {
//         resolve('終わりました');
//     }, 2000 );
// })

// promise.then(data => {
//     // data.split(' ');
// })

function merge<T extends object, U extends object>(objA: T, objB: U) {
    return Object.assign(objA, objB);
}

const mergedObj = merge({name: "max"}, {age: 30});
console.log(mergedObj);


interface Lengthy {
    length: number;
}

function countAndDescribe<T extends Lengthy>(element: T): [T, string] {
    let descriptionText = '値がありません'
    if ( element.length > 0 ) {
        descriptionText = '値は' + element.length + '個です。';
    } 
    return [element, descriptionText];
}

console.log(countAndDescribe(['Sports', 'cokking']));

function extractAndConvert<T extends object, U extends keyof T>(obj: T, key: U) {
    return 'value: ' + obj[key];
}

extractAndConvert({ name: 'Max' }, 'name');

class DataStorage<T extends string | number | boolean> {
    private data: T[] = [];

    addItem(item: T) {
        this.data.push(item);
    }

    removeItem(item: T) {
        if (this.data.indexOf(item) === -1) {
            return;
        }
        this.data.splice(this.data.indexOf(item), 1);
    }

    getItem() {
        return [...this.data];
    }
}

const textStorage = new DataStorage<string>();
textStorage.addItem("Data1");
textStorage.addItem("Data2");
textStorage.removeItem("Data1");
console.log(textStorage.getItem());


// const numberStorage = new DataStorage<number>();

// const objStotrage = new DataStorage<object>();
// const obj = {name: 'Max'};
// objStotrage.addItem(obj);
// objStotrage.removeItem({name: 'Max'});
// console.log(objStotrage.getItem());

interface CourseGoal {
    title: string;
    description: string;
    completeUntill: Date;
}

function createCourseGoal(title: string, description:string, date:Date): CourseGoal {
    
    let courseGoal: Partial<CourseGoal> = {};
    courseGoal.title = title;
    courseGoal.description = description;
    courseGoal.completeUntill = date;
    return courseGoal as CourseGoal;
}

const names: Readonly<string[]> = ['Max', 'Anna'];
// names.push('Manu');
// names.pop();

