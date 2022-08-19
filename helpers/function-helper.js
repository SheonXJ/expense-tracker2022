// put category['else'] at the end of the array
const arrangeCategory = categories => categories.forEach((category, i) => {
  if (category.name === 'else') {
    categories.splice(i, 1)
    return categories.push(category)
  }
})

module.exports = {
  arrangeCategory
}
