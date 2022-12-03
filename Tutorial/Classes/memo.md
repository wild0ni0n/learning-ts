# Class | クラス
TSのクラスの書き方は`class クラス名 {}`で記述する。
ES6以降JSでもclassが実装されているが、一部JSとTSで異なる部分がある。

```TypeScript
class Department {
    name: string;

    constructor(n: string) {
        this.name = n;
    }
}

const accounting = new Department("Accounting");

console.log(accounting);
```

上記のクラスの`name`はDepartmentクラスのフィールドであり、変数ではない。
なので、`let`や`const`は付けないで定義する。このフィールドの指定はJSにはなくTSの機能になる。（ややこし）

これをコンパイルするとJSでは以下のように出力される(ES2016)

```javascript
"use strict";
class Department {
    constructor(n) {
        this.name = n;
    }
}
const accounting = new Department("Accounting");
console.log(accounting);
```

見ての通り、型指定も無いし、フィールドの指定もない。コンストラクタの中で`name`クラス変数に値が代入されている。クラス直下で指定するのではなく、コンストラクタの中で定義するみたい。

# メソッド
クラスのメソッドを追加する書き方は、`メソッド名() {}` で記述できる。
呼び出す場合は、インスタンスを変数に入れて、`変数.メソッド名()`で呼び出すことができる。

```TypeScript
class Department {
    name: string;

    constructor(n: string) {
        this.name = n;
    }

    // describeメソッド
    describe() {
        console.log("Department: " + this.name);
    }
}

const accounting = new Department("Accounting");

accounting.describe();

// Department: Accounting
```

## this キーワード
混乱しやすいthisキーワードについても触れておく。
先ほどのdescribeメソッドをオブジェクトリテラルで呼び出してみる。

```TypeScript
class Department {
    name: string;

    constructor(n: string) {
        this.name = n;
    }

    // describeメソッド
    describe() {
        console.log("Department: " + this.name);
    }
}

const accounting = new Department("Accounting");
accounting.describe(); // Department: Accounting

const accountingCopy = { describe: accounting.describe };
accountingCopy.describe(); // Department: undefined
```

オブジェクトリテラルで呼び出そうとした結果、undefinedが返ってきており、インスタンスから呼び出した時と挙動が違うことが分かる。

ネットで調べてみると、thisキーワードの挙動でハマっている人が多いことがわかった。
この[wiki](https://github.com/Microsoft/TypeScript/wiki/'this'-in-TypeScript)によると、以下のような典型的なハマりポイントがあるらしい。

* `this.foo`が`undefined`になる
* `this`の値がクラスインスタンスではなく、グローバル`window`オブジェクトを指している(non-strictモード)
* `this`の値がクラスインスタンスではなく、`undefined`を指している(strictモード)
* クラスメソッド(`this.doBar()`)を呼び出すと、`TypeError: undefined is not a function", "Object doesn't support property or method 'doBar'`もしくは `this.doBar is not a function`というエラーで失敗する

これらのエラーが起きるケース

* イベントリスナー
    * `window.addEventListener('click', myClass.doThing);`
* Promiseの解決
    * `myPromise.then(myClass.theNextThing);`
* ライブラリーイベントコールバック
    * `$(document).ready(myClass.start);`
* 関数コールバック
    * `someArray.map(myClass.convert)`
* ViewModel型のライブラリに含まれるクラス
    * `<div data-bind="click: myClass.doSomething">`
* option bagsの関数
    * `$.ajax(url, { success: myClass.handleData })`

`this`キーワードは、どのように呼び出されたかJSが厳格モードかそうでないかによって、挙動による違いがあるため、そこがハマりポイントになってるみたい。

ここでは、`accountingCopy.describe()`がなぜundefinedになるのか調べ、それ以外は一旦学習外とする。

thisは基本的に、その関数を呼び出す責任があるオブジェクトを呼び出す。
ここでのthisを呼び出す責任があるのは、`(accountingCopy).describe()`を呼び出している`accountingCopy`となる。
変数`accountingCopy`には、nameプロパティが存在しないので`undefined`になった。

なので、`accountingCopy`にnameプロパティを用意してあげると`undefined`ではなくなる。

```TypeScript
class Department {
    name: string;

    constructor(n: string) {
        this.name = n;
    }

    // describeメソッド
    describe() {
        console.log("Department: " + this.name);
    }
}

const accounting = new Department("Accounting");
accounting.describe(); // Department: Accounting

const accountingCopy = { name: "hoge", describe: accounting.describe };
accountingCopy.describe(); // Department: hoge
```

この問題は、TSでもJSでも起きるのと、TSではコンパイルエラーにならないところがハマりやすいのだと思う。
この問題を回避するには、thisの型を指定する。

```TypeScript
class Department {
    name: string;

    constructor(n: string) {
        this.name = n;
    }

    describe(this: Department) {
        console.log("Department: " + this.name);
    }
}

const accounting = new Department("Accounting");

console.log(accounting);
accounting.describe();

const accountingCopy = { describe: accounting.describe};
accountingCopy.describe();　

// '{ describe: (this: Department) => void; }' の 'this' コンテキストを型 'Department' のメソッドの 'this' に割り当てることはできません。
//  プロパティ 'name' は型 '{ describe: (this: Department) => void; }' にありませんが、型 'Department' では必須です。ts(2684)
```

`describe`が呼び出されたときに、`describe`メソッド内のthisは`Department`クラスのインスタンス(`Department`型)である必要があることを意味する。
このように記述することで、TSはthisの型をチェックし、インスタンスを渡していない書き方だとコンパイルエラーになる
変数`accountingCopy`は、`Department`クラスのインスタンスを渡すか、`Department`と同じ構造のオブジェクトを用意する必要がある。
同じ構造であればよいので、`name`プロパティを持たせるとエラーにならない。


```TypeScript
class Department {
    name: string;

    constructor(n: string) {
        this.name = n;
    }

    describe(this: Department) {
        console.log("Department: " + this.name);
    }
}

const accounting = new Department("Accounting");

console.log(accounting);
accounting.describe();

const accountingCopy = { name: "hoge", describe: accounting.describe};
accountingCopy.describe();　// no error

```

## private,public,protected 修飾子
クラスのプロパティにアクセス修飾子を設定することがTSでは可能

```TypeScript
class User {
    name: string;
    private hobbies: string[] = [];
    public age: number;

    // ...
}
```
アクセス修飾子が無い場合、デフォルトでpublicが設定される。
privateのプロパティをクラス外から直接呼び出した場合、TSのコンパイルエラーが発生するが、JSでは問題なく動作される。

private修飾子はプロパティを定義したクラス内からアクセスが可能になるが、継承したサブクラスからはアクセスができない。
クラス内と継承したサブクラス内で利用したい場合は、protected修飾子を使う。

```TypeScript
class Department {
    protected employees: string[] = [];
    constructor(private readonly id: string, public name: string) {}
    // ...
}

class Accounting extends Department {
    // ...
    addEmployee(name: string) {
        this.employees.push(name);
    }
}
```

## readonly修飾子
一度初期化後に変更を掛けたくない場合は readonly修飾子を用いる。

```TypeScript
class User {
    // private readonly id: string;

    constructor(private readonly id:string) {
        // ...
    }
}
```

## プロパティ初期化のショートカット構文

以下のようなクラスのプロパティ初期化をTSではコンストラクタの引数に型指定を行うことで記述を省略することができる。

```TypeScript
class User {
    // private id: string
    // name: string

    constructor(private id: string, public name: string) {
        // this.id = ;
        //this. name = n;
    }
}

counst user1 = new User('U1', 'Dann');
```

# 継承
TSの継承は`extends`を使う。

```TypeScript
class User {
    constructor(private readonly id: string, public name: string) {}
}

class Admin extends User {

}

counst adm = new Admin('A1', 'Beck');
```

親となるクラスは一つのみ選択が可能。複数のクラスから継承することは出来ない。
