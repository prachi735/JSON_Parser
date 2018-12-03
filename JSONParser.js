const fs = require('fs')
testParser()
let errorIndex = -1

function testParser () {
  // testData('testCases/singleTest.txt')
  testData('testCases/testJsonParser.txt')
  testData('testCases/testJsonParserInvalid.txt')
  // testData("testCases/testRedditJson.txt")
  // testData("testCases/testTwitterJson.txt")

  function testData (path) {
    fs.readFile(path, 'utf-8', function (err, fileData) {
      if (err) throw err
      // console.log(file_data)
      errorIndex = fileData.length
      let arg = { data: fileData.trim(),
        row: 1,
        column: 1,
        update: function (d, r, c) {
          this.row = r
          this.column = c
        }
      }
      let result = parseValue(arg)
      if (result[1].data.length === 0) { console.log(result) } else {
        console.log('Error at Row', result[1].row, 'Column', result[1].column)
      }
    })
  }
}

const parseValue = Parserfactory(parseObject, parseArray, parseString, parseNumber, parseNull, parseBoolean)

function Parserfactory (...parsers) {
  return function (input) {
    if (input.data !== undefined) {
      errorIndex = Math.min(errorIndex, input.data.trim().length)
    }
    for (let i = 0; i < parsers.length; i++) {
      // if(input.data)
      let res = parsers[i](input)
      if (res !== null) {
        return res
      }
    }
    return null
  }
}

function parseNull (input) {
  if (input.data.startsWith('null')) {
    input.data = input.data.slice(4)
    input.column += 4
    return [null, input]
  } else return null
}

function parseBoolean (input) {
  if (input.data.startsWith('true')) {
    input.data = input.data.slice(4)
    input.column += 4
    return ['true', input]
  } else if (input.data.startsWith('false')) {
    input.data = input.data.slice(5)
    input.column += 5
    return ['false', input]
  }
  return null
}

function parseNumber (input) {
  let re = /^-?[0-9]+[1-9]*\.[0-9]+[e]{1}-?[1-9]+|^-?\d[1-9]*\.\d?|^-?[1-9]+\d*|^0/
  let result = input.data.match(re)
  if (result) {
    let eIndex = result[0].indexOf('e') + result[0].indexOf('E') + 1
    let n = 0
    if (eIndex > 0) {
      n =
        Number(result[0].substr(0, eIndex)) *
        10 ** Number(result[0].substr(eIndex + 1))
    } else {
      n = Number(result[0])
    }
    input.data = input.data.slice(result[0].length)
    input.column += n.toString().length
    return [n, input]
  } else return null
}

function parseString (input) {
  // TODO: implement for \u[hexa]4chars
  // restrict the escape characters
  let i = 1
  let n = input.data.length
  if (input.data.startsWith('"')) {
    let str = ''
    while (input.data[i] !== '"' && i < n) {
      if (input.data[i] === '\\') {
        str += input.data.substr(i, 2)
        i += 2
      } else {
        str += input.data[i]
        i++
      }
    }
    input.data = input.data.slice(i + 1)
    input.column += (str.length + 2)
    return [str, input]
  }
  return null
}

function parseArray (input) {
  if (!input.data.startsWith('[')) return null
  let arr = []
  let result
  input.column += 1
  input.data = input.data.slice(1)
  while (!input.data.startsWith(']')) {
    result = parseValue(updateNewLine(input))
    if (result === null) break
    arr.push(result[0])
    input = result[1]
    result = parseCharacter(updateNewLine(input), ',')
    if (result !== null) input = result[1]
  }
  input.column += 1
  input.data = input.data.slice(1)
  return [arr, input]
}

function parseObject (input) {
  if (!input.data.startsWith('{')) return null
  let obj = {}
  let key = ''
  let result = null
  input.column += 1
  input = updateNewLine(input)
  input.data = input.data.slice(1)
  while (!input.data.startsWith('}')) {
    result = parseString(updateNewLine(input))
    if (result === null) break
    key = result[0]
    input = result[1]
    result = parseCharacter(updateNewLine(input), ':')
    if (result === null) return null
    result = parseValue(updateNewLine(input))
    if (result === null) return null
    obj[key] = result[0]
    input = result[1]
    result = parseCharacter(updateNewLine(input), ',')
    if (result !== null) input = result[1]
  }
  input.data = input.data.slice(1)
  input.column += 1
  return [obj, input]
}

function parseCharacter (input, ch) {
  if (input.data.startsWith(ch)) {
    input.data = input.data.slice(ch.length)
    input.column += ch.length
    return [ch, input]
  } else return null
}

function parseSpace (input) {
  let n = input.data.indexOf(input.data.trim())
  input.data = input.data.slice(n)
  input.column += n
  return input
}

function updateNewLine (input) {
  if (input.data.startsWith('\n')) {
    input.row = input.row + 1
    input.column = 0
  }
  input = parseSpace(input)
  return input
}
