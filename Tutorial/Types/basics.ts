function add1(n1: number, n2: number, showResult: boolean, phrase: string) {
    // if ( typeof n1 !== 'number' || typeof n2 !== 'number') {
    //     throw new Error('error');
    // }
    const result = n1 + n2;
    if ( showResult) {
        console.log(phrase + result);
        return;
    } else {
        return result;
    }
}

let number1 = 5;
// number1 = 'hoge';
const number2 = 2.8;
const printResult1 = true;
const resultPhrase = 'Result: ';

add1(number1, number2, printResult1, resultPhrase);
