## ジェネリクスとは何か
ジェネリック型とは、他の特定の方と結合された型のこと。
例
    - Array<string> (他の型はstring)
    - Array<number> (他の型はnumber)

ジェネリック型の利用目的
* TypScriptにおける型安全性を高めることができる
* 自動補完の開発サポートを向上することができる
## ジェネリクス関数及びクラス
## ジェネリクスの制限
extendsキーワードをつけてジェネリクスに制限をつけることができる
```Typescript
// T extends object
function merge<T extends object, U extends object>(objA: T, objB: U) {...}
```

## 特別なTypeScirptの型