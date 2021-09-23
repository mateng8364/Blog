const array = [
  { name: 'first'},
  { name: 'second'},
  { name: 'third'},
  { name: 'four'},
  { name: 'five'}
];

// 遍历循环中直接赋值一律为浅拷贝 for while map filter reduce
const sliceArray = array.slice()
const concatArray = array.concat(sliceArray, [])
const assignArray = Object.assign([], sliceArray)
const es6Array = [...array]
const jsonArray = JSON.parse(JSON.stringify(array))
const fromArray = Array.from(array)

console.log(sliceArray[0] === array[0])
console.log(concatArray[0] === array[0])
console.log(assignArray[0] === array[0])
console.log(es6Array[0] === array[0])
console.log(jsonArray[0] === array[0])
// 时间对象转为了字符串 undefined丢失 正则，Error对象丢失
// 如果obj里有NaN、Infinity和-Infinity，则序列化的结果会变成null
// JSON.stringify()只能序列化对象的可枚举的自有属性，例如 如果obj中的对象是有构造函数生成的， 则使用JSON.parse(JSON.stringify(obj))深拷贝后，会丢弃对象的constructor；
console.log(fromArray[0] === array[0])

// 结论：除json字符化转换方法外，以上所有复制都是浅拷贝

// 递归拷贝
const deepCopy = function (array) {
  if (typeof array !== 'object' || array === null) {
    return array
  }
  if (array instanceof Error || array instanceof Date || array instanceof RegExp) {
    return array
  }
  const copyObject = Array.isArray(array) ? [] : {}
  for (const key in array) {
    if (typeof array[key] !== 'object' || array[key] === null) {
      copyObject[key] = array[key]
    } else {
      copyObject[key] = deepCopy(array[key])
    }
  }
  return copyObject
}

const obj = deepCopy({ a: new Date(), b: /123/, c: new Error('error') })
console.log(obj)
const newArray = deepCopy(array)
console.log(newArray[0] === array[0])