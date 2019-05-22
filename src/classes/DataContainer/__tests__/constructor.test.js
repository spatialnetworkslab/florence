import DataContainer from '../index.js'

// Column-oriented data
// test('valid column-oriented data throws no error', () => {

// })

// test('column-oriented data with unequal column lengths throws an error', () => {
  
// })

test('valid column-oriented data loads unchanged', () => {
  const columnOrientedData = {
    fruit: ['apple', 'banana', 'coconut'],
    quantity: [1, 2, 3]
  }

  let dataContainer = new DataContainer(columnOrientedData)

  expect(dataContainer.data()).toEqual(columnOrientedData)
})

// test('loaded column-oriented data not a reference to original data', () => {

// })