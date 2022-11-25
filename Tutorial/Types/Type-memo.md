## 基本の型
* number
    - 整数や浮動小数点を含む全ての数値
    - 例 1, 5.3, -10
* String
    - 全ての文字列
    - 例 'Hi', "Hi", `Hi`
* boolean
    - trueまたはfalse
    - 例 true, false
    - truthy/falsy
        - boolenの文脈使われたときにtrue/falseと評価される値
        - truthy: true, 1, {}, [], "0" など
        - falsy: false, 0, null, undefined, "", '', NaN など
* Object
    - JStの全てのobject
    - 例 {age: 30}
* Array
    - JSの全てのArray
    - 列 [1, 2, 3]
* Tuple
    - JSにはない、TS独自の型
    - 長さが固定された配列
    - 例 [1, 2]
* Enum
    - JSにはない、TS独自の型
    - 列挙型
    - 例 enum { NEW, OLD }
* Any
    - どんな値でもよい。型を指定しない。
* Union
    - 二つ以上のいずれかの型を表現する
* Literal
    - 特定の値だけを代入可能にする型を表現する
* 型エイリアス
    - 名前の付いた型を表現する。
* void, undefined
    - 関数が何も返さないことを示す型
* Function型
    - 関数であることを示す型
* unknown
## TypeScriptの型推論
TSは、値から型の推論ができるため変数代入時に型を指定する必要がない。

5が入ったのでnumberはnumber型を受け取る変数だと解釈される。

```TypeScript
let number = 5;
```

number型で型推論されているため、別の型の値を入れると、以下のようにコンパイルエラーが発生する。

```TypeScript
let number = 5;
number = '5';
// 型 'string' を型 'number' に割り当てることはできません。
```

letは変数宣言後に値を代入できるので、例えば値を代入しない場合は、any型と解釈される。

```TypeScript
let number;
// let number: any
```

any型は、どのような型も受け取るので、宣言の後で別の型を入れてもエラーが起きない。

``` TypeScript
let number;
number = 5; // ok
```

## 型指定や書き方
### 基本の型指定
変数Tに型Typeを明示的に指定させたい場合は、`T: Type` という書き方で指定することができる。

```TypeScript
let number: number = 5;
let name: string = '名無し';
```

Object型の値やネストした値の型指定も行うことができる。

例えば以下のようなnameとageのキーを持つobjectがあり、
nameはstring型, ageはnumber型であることを指定させたい場合の記述は以下となる。

```TypeScript
const person: {
    name: string;
    age: number;
} = {
    name: 'yota',
    age: 30
}
```
書き方の注意点で、型を指定するときは `key: type;` のようにセミコロン区切りになる。
これは、型に指定している箇所はObjectリテラルとしてではなくObject型であることを示しているため。

### Object
Objectリテラルでは`key=>value`の書き方だが、Object型であることを示す場合は`key: type(型)`という形で指定する。

ネストしたObjectでも明示的に型を指定することも可能。

```TypeScript
const product = {
  id: 'abc1',
  price: 12.99,
  tags: ['great-offer', 'hot-and-new'],
  details: {
    title: 'Red Carpet',
    description: 'A great carpet - almost brand-new!'
  }
}
```

```TypeScript
{
  id: string;
  price: number;
  tags: string[],
  details: {
    title: string;
    description: string;
  }
}
```

ただし、型推論がうまく動作するのであれば、明示的な型指定は冗長なため、型推論に任せるのがよい…らしい。

### Array
配列A に対して型Typeを指定する場合は、 `T: Type[]`で型指定が行える。

```TypeScript
const names: string[];
```

配列だけ宣言され、値が入ってない場合はany型となる。
型推論や型指定を行ってany以外の型が指定されている場合、その型がもつプロパティにアクセスすることが可能。(IDE側の機能だと思う)

### Tuple

Array型に異なる型の値を入れると、TSは以下のようにstring型またはnumber型が入る配列というように型推論を行う。

```TypeScript
let role = [2, 'author'];
// role: (string | number)[]
```

しかしこの場合、二番目にnumber型を入れたり、三番目にnumber型やstring型が入ったり、新しい要素を追加してもエラーにはならない

```TypeScript
let role = [2, 'author'];
role[1] = 10;               // no error
role = [0, 'hoge', 'fuga']; // no error
role.push('hoge')           // no error
```

順番に沿った型指定や配列の長さを指定したい場合には、型推論ではなく明示的な型指定が必要になる。

```TypeScript
let role: [number, string] = [2, 'author'];
role[1] = 10;                               // 型 'number' を型 'string' に割り当てることはできません。
role = [0, 'hoge', 'fuga'];                 //  '[number, string, string]' を型 '[number, string]' に割り当てることはできません。ソースには 3 個の要素がありますが、ターゲットで使用できるのは 2 個のみです。
role.push('hoge')                           // no error
```

ただし型指定であってもpushのような要素追加ではエラーが起きないことに注意。


### Enum
JSにはないTS独自の型。

Enumは、複数の定数を利用する時などに用いられる。

```TypeScript
enum Role {
  ADMIN,
  READ_ONLY,
  AUTHOR,
}

const person = {
  name: "yota",
  age: 30,
  role: Role.ADMIN,
};

if (person.role === Role.ADMIN) {
    console.log("administrator");
}
```

Enumで定義された定数は、デフォルトで0,1,2...のように0から始まるインデックスがオートインクリメントされる。
そのため、以下のようなif文の使い方でも通る。

```TypeScript
if (person.role === 0) {
    console.log("administrator");
}
// administrator
```

ちなみにJSでは以下のような書き方でenumを表現している

```Javascript
var Role;
(function (Role) {
    Role[Role["ADMIN"] = 0] = "ADMIN";
    Role[Role["READ_ONLY"] = 1] = "READ_ONLY";
    Role[Role["AUTHOR"] = 2] = "AUTHOR";
})(Role || (Role = {}));
```

### Any
anyはどんな値、どんな型も許容する型。
型の仕組みの恩恵を受けることができないので、極力anyは使わずに型を固定していくのが良い。

```TypeScript
let hoge: any;
hoge = 1;       // no error
hoge = "aaa";   // noerror

let arr: any[];
arr = "aaa";    // 型 'string' を型 'any[]' に割り当てることはできません。
arr = ["aaa"];  // no error
```
`any[]`とすることで一応Any型を持つ配列というような指定は可能。
この場合、配列以外が入るとエラーになる。

## Union
Union型は、2つ以上のいずれかの型を指定する型。
型Tと型T2を指定したい場合 `T | T2` のようにパイプ記号でつなげる。

```TypeScript
let input: number | string
```

## Literal
リテラル型は、特定の値だけを代入可能にする表現。

たとえば、引数ConversionStringに渡された値が、"as-number"と"as-text"で処理を変えたいケースで考える。
以下のようにstring型で実装してもエラーは起きない。

```TypeScript
function combine(
  input1: number | string,
  input2: number | string,
  resultConversion: string,
) {
  let result;
  if (
    (typeof input1 === "number" && typeof input2 === "number") ||
    resultConversion === "as-number"
  ) {
    result = +input1 + +input2;
  } else {
    result = input1.toString() + input2.toString();
  }
  return result;
```

しかし、string型で型指定を行うと、combine関数を実行するときに"as-number"や"as-text"以外を渡した場合に、コンパイル時にエラーが発生しない。

```TypeScript
const combinedStringAges = combine("30", "26", "as-number1");
console.log(combinedStringAges);
// compile ok
```

これを防ぐために、特定の値だけを受け付けるようにliteral型を使う。

```TypeScript
function combine(
  input1: number | string,
  input2: number | string,
  resultConversion: 'as-number' | 'as-text',
) {
  let result;
  if (
    (typeof input1 === "number" && typeof input2 === "number") ||
    resultConversion === "as-number"
  ) {
    result = +input1 + +input2;
  } else {
    result = input1.toString() + input2.toString();
  }
  return result;
```

こうすることで、呼び出し時に"as-number"または、"as-text"以外を指定するとエラーが発生する。

```TypeScript
const combinedAges = combine(30, 26, "as-boolean");
console.log(combinedAges);

// 型 '"as-boolean"' の引数を型 '"as-number" | "as-text"' のパラメーターに割り当てることはできません。
```

ちなみにIDEの候補変換にも出てくるため、打ち間違いによるミスも軽減できる。

### 型エイリアス
TSは自分で作成した型に名前を付けることができる。名前のついた型を型エイリアスと呼ぶ。

```TypeScript
type Combinable = number | string;
type ConversionDescriptor = 'as-number' | 'as-text';

function combine(
  input1: Combinable,
  input2: number | string,
  resultConversion: ConversionDescriptor,
) {
    ...
}
```
Union型やリテラル型、Object型などにの型に名前を付けて、説明的にすることと再利用性を上げるために使われることが多い。

### 関数の戻り型指定 | voidとundefined
関数Tの戻り値の型Typeを指定するときは、`function T(): Type {...}` のように表現する。

```TypeScript
function add(n1: number, n2: number): number {
    return n1 + n2;
}
```
上記のような単純な関数であれば、型推論によって戻り値の型が指定されていなくても決まる。

戻り値を持たない関数は、voidという型で表現される。型指定によってvoidを指定することもできる。

```TypeScript
function printResult(num: number): void {
    console.log('Result: '+ num);
}

console.log(printResult(add(5, 12)));
// Result: 17
// undefined

```


上記のコードを実行するとブラウザのコンソール上では`Result: 17` のあとに`undefined`が表示される。
戻り値を持たない関数は、JSの仕様として`undefined`を返す。

TypeScriptの型上の意味では、`void`も`undefined`も同じ。
なので、以下のように型指定に使うこともできるが、値を返す必要があるというエラーが発生する。

```TypeScript
function printResult(num: number): undefined {
    console.log('Result: '+ num);
}
// 宣言された型が 'void' でも 'any' でもない関数は値を返す必要があります。ts(2355)
```

戻り値を返す必要があるというエラーなので、例えば未定義であることを表す戻り値を指定すれば、このエラーは発生しない。

```TypeScript
function printResult(num: number): undefined {
    console.log('Result: '+ num);
    return undefined;
    // or return;
}
```

とはいえ、戻り値がないことを表現したい場合は、void型を使うのが普通なので、上記のような`undefined`を指定するケースは殆どない。

### Function型
JSは関数を変数に代入することができる。

```TypeScript
function add() {...}

let combineValues;  // type: any
combineValues = add;
```

これ自体は問題ないが、`combineValues`がany型なので、関数以外の型も許容してまう。
そのため、関数型のみの型指定を行う。

```TypeScript
function add() {...}

let combineValues: Function;  // type: Function
combineValues = add;　// ok
combineValues = 5; // compile error
```

次の問題として、add関数以外の関数も許容してしまう。また引数がある場合、引数の型も指定されていないため、引数と特定の関数を指定するための型指定を行う。

```TypeScript
function add(n1: number, n2: number) {...}
function printResult() {...}

let combineValues: (a: number, b: number) => number;
combineValues = add;            // ok
combineValues = printResult;    // compile error
combineValues = 5;              // compile error
```

変数Vに関数型Tの型指定を行う場合は `(let) V: () => T`となる。
引数も指定したい場合は括弧内に記載する。
引数argの型をT2, 引数arg2の型をT3としたい場合は `(let) V: (arg: T2, arg2: T3) => T` のように指定する。

callback関数についても、殆ど同じような記述で、型指定を行うことができる。

```TypeScript

function addAndHandle(n1: number, n2: number, cb: (num: number) => void) {
    const result = n1 + n2;
    cb(result);
}

addAndHandle(10, 20, (result) => {
    console.log(result);
})
```

関数addAndHandleは、コールバック関数cbを引数として持つが、このコールバック関数cbは、型がnumberの引数numを持ち、戻り値はvoidであることが分かる。
`cb: (num: number) => void` この部分だけを見ると、関数型の型指定と変わらない。

関数定義側で型の指定がされているので、呼び出し側で型指定を行わなくても、型推論が行われている。
呼び出し側で`return`を書いてもエラーになることはない。
TypeScriptは引数について厳密にチェックするのに対して、return文があるかどうかについては厳密ではない。

### Unknown
unknown型は、どのような型が入るか分からないことを表現する。
そのためunknown型と指定された変数には、string型をいれてもnumber型を入れてもエラーが起きない。
この特徴は、any型と似ているがany型と比べると、unknown型は型指定がされた別の変数に代入する際にエラーが起きるといった違いがある。

```TypeScript
let userInputUnknown: unknown;
let userInputAny: any;
let userName: string;

userInputUnknown = 5;           // no error
userInputUnknown = 'Max';       // no error
userName = userInputUnknown;    // 型 'unknown' を型 'string' に割り当てることはできません。ts(2322)
userName = userInputAny;        // no error
```

unknown型をエラーなく、別の型指定された変数に代入する場合は、型チェックを行ってから代入するとエラーが発生しない。
```TypeScript
if ( typeof userInputUnknown === 'string') {
    userName = userInputUnknown;        // no error
}
```

代入時に、unknownは型チェックを行う必要がある分、any型よりも型が厳密だと言える。
基本的には複数の型が入る可能性がある場合は、Union型を使い、どうしても分からない場合はunknown型を用いる。any型は極力使わないほうがよい。（unknown型もだけど)

### never
never型は戻り値を絶対に返さないことを表現する。
void型と似ているが、戻り値を絶対に返さない状況の場合にはnever型を用いるほうが適切。

例えば、次のような例外処理を発生させる関数がある場合、catchブロックも存在しないので戻り値undefinedは返さない。

```TypeScript
function generateError(message: string, code: number): never {
    throw { message: message, errorCode: code };
}

const result = generateError('エラーが発生しました', 500);
console.log(result);
// Uncaught {message: 'エラーが発生しました', errorCode: 500}
```

これは、throw文によって関数の実行が停止されているためである。
戻り値void型の関数でもundefinedを返していたが、この場合はundefinedすらも返さないため、このような関数ではvoidよりもnever型のほうがより適切であると言える。

ただしvoid型も間違っているわけではないので、より厳密に定義したい場合に用いる。
