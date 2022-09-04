// put category['else'] at the end of the array
const arrangeCategory = categories => categories.forEach((category, i) => {
  if (category.name === 'else') {
    categories.splice(i, 1)
    return categories.push(category)
  }
})

const translateDay = records => {
  records.forEach(record => {
    const dayArray = record._id.split(' ')
    switch (dayArray[1]) {
      case '1':
        dayArray[1] = ' 星期日'
        break
      case '2':
        dayArray[1] = ' 星期一'
        break
      case '3':
        dayArray[1] = ' 星期二'
        break
      case '4':
        dayArray[1] = ' 星期三'
        break
      case '5':
        dayArray[1] = ' 星期四'
        break
      case '6':
        dayArray[1] = ' 星期五'
        break
      case '7':
        dayArray[1] = ' 星期六'
        break
    }
    record._id = dayArray[0] + dayArray[1]
  })
}

module.exports = {
  arrangeCategory,
  translateDay
}
