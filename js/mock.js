import Mock from 'mock'

Mock.mock('/api/auth/queryUserList', {
  'name|3': 'zs',
  'name1|2-5': 'ls',
  'age|20-25': 25,
  'queryTime|+1': 0,
  'weight|100-130.00-99': 123.23,
  'likeMovie|1': true,
  'life|2': {},
  'life1|4-6': {},
  'friend|1': ['we', 'hd', 'sl'],   // 随机选择一个
  'friend1|+1': ['we', 'hd', 'sl'],   // 递增选择一个
  'friend2|3': ['we', 'hd', 'sl'],   // 重复3次原数组，返回新的数组
  'friend3|3-7': ['we', 'hd', 'sl'],   // 随机重复3到7次，返回新的数组
})

// mock 模板语法  'key|rule': initValue
// key 键名     rule规则：重复次数，随机范围，递增值，概率占比   initValue：初始值 初始对象 （限定字段类型）

// 模拟删除数据
const arr = [
  { name: 'ming', age: 20, id: 4 },
  { name: 'fei', age: 30, id: 5 },
  { name: 'jun', age: 40, id: 6 },
  { name: 'liu', age: 50, id: 7 },
]
Mock.mock('/a/b/c', 'get', function(options) {
  const id = options.body.split('=')[1]
  const result = arr.filter(item => item.id !== id)
  return result
})