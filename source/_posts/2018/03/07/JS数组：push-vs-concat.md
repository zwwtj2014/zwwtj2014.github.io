---
title: JS数组：push vs concat
date: 2018-03-06 22:07:12
tags: javascript
categories: JS基础
keywords: js, array
description: 了解JS数组push和concat的区别
---

使用JS这么久, 对于JS数组的相关方法一直都是拿来就用,对于`push`方法更是常用。但是在一次用到`contact`方法的时候自问了一句: `push`和`contact`到底有哪些区别?

**先看下MDN的定义:**
>[【`push`】](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push):adds one or more elements to the end of an array and **returns the new length** of the array.
```js
var animals = ['pigs', 'goats', 'sheep'];
console.log(animals.push('cows')); // expected output: 4
console.log(animals); // expected output: Array ["pigs", "goats", "sheep", "cows"]


animals.push(['new arr']); // expected output: 5
console.log(animals); // expected output: Array ["pigs", "goats", "sheep", "cows", Array(1)]

```


>[【`contact`】](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat):The `concat()` method is used to merge two or more arrays. This method **does not change the existing arrays**, but instead returns a new array.
```js
var array1 = ['a', 'b', 'c'];
var array2 = ['d', 'e', 'f'];

console.log(array1.concat(array2)); // expected output: Array ["a", "b", "c", "d", "e", "f"]
console.log(array1); // expected output: Array ["a", "b", "c"]
console.log(array2); // expected output: Array ["d", "e", "f"]

```

**摘取重点：**
1. `push`方法添加元素到数组末尾，改变的是同一个数组, 返回值是添加之后数组的长度
2. `contact`方法是合并两个或者多个数组，不会改变存在的数组，返回的是合并的数组

----------

**那性能会不会有区别?**

环境：win8.1 chrome 63.0.3239.132

```js
// push demo
var arr3 = [1, 2, 3];
var arr4 = [4, 5, 6];
console.time('push');
for (let index = 10000; index > 0; index--) {
  arr3.push(...arr4);
}
console.timeEnd('push'); // push: 2.39892578125ms
```

```js
// contact demo
var arr1 = [1, 2, 3];
var arr2 = [4, 5, 6];
console.time('contact');
for (let index = 10000; index > 0; index--) {
  arr1 = arr1.concat(arr2);
}
console.timeEnd('contact'); // contact: 312.762939453125ms
```

**在我这个环境上push+解构的性能是要好于contact的。不过对于多个数组合并的时候, contact因为返回的是新数组，可以链式下去。**