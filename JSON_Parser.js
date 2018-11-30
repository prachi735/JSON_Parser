const fs = require('fs')
testParser()

function testParser () {
  fs.readFile('testJsonParser.txt', 'utf-8', function (err, data) {
    if (err) throw err
    console.log(parseValue(data))
  })
}

function parseValue (input) {
  return Parserfactory(input)
}

function Parserfactory (input) {
  let parsers = [parseObject, parseArray, parseString, parseNumber, parseNull, parseBoolean]
  let result = null
  parsers.forEach(function (f) {
    let res = f(input)
    if (res !== null) {
      result = res
    }
  })
  return result
}

function parseNull (input) {
  return input.startsWith('null') ? [null, input.slice(4)] : null
}

function parseBoolean (input) {
  return input.startsWith('true') ? ['true', input.slice(4)] : (input.startsWith('false') ? ['false', input.slice(5)] : null)
}

function parseNumber (input) {
  let re = /^-?[0-9]+[1-9]*\.[0-9]+[e]{1}-?[1-9]+|^-?\d[1-9]*\.\d?|^-?[1-9]+\d*|^0/
  let result = input.match(re)
  if (result) {
    let eIndex = result[0].indexOf('e') + result[0].indexOf('E') + 1
    let n = 0
    if (eIndex > 0) {
      n = (Number(result[0].substr(0, eIndex)) * 10 ** Number(result[0].substr(eIndex + 1)))
    } else {
      n = Number(result[0])
    }
    return [n, input.slice(result[0].length)]
  } else return null
}

function parseString (input) {
  let i = 1
  if (input.startsWith('"')) {
    let str = ''
    while (input[i] !== '"') {
      if (input[i] === '\\') {
        str += input.substr(i, 2)
        i += 2
      } else {
        str += input[i]
        i++
      }
    }
    return [str, input.slice(i + 1)]
  }
  return null
}

function parseArray (input) {
  let result
  let arr = []
  if (!input.startsWith('[')) return null
  input = input.slice(1)
  while (true) {
    input = input.trim()
    result = parseValue(input)
    if (result === null) break
    arr.push(result[0])
    input = result[1].trim()
    result = parseCharacter(input, ',')
    if (result === null) break
    input = result[1]
    if (input.startsWith(']')) break
  }
  input = input.trim()
  if (input.startsWith(']')) {
    return [arr, input.slice(1)]
  }
  return null
}

function parseObject (input) {
  let obj = {}
  let key = ''
  let result = null
  if (!input.startsWith('{')) return null
  input = input.slice(1)
  while (true) {
    input = input.trim()
    result = parseString(input)
    if (result === null) break
    else {
      key = result[0]
      input = result[1].trim()
      result = parseCharacter(input, ':')
      if (result === null) return null
      input = result[1].trim()
      result = parseValue(input)
      if (result === null) return null
      obj[key] = result[0]
      input = result[1].trim()
      result = parseCharacter(input, ',')
      if (result === null) break
      input = result[1]
      if (input.startsWith('}')) {
        break
      }
    }
  }
  input = input.trim()
  if (input.startsWith('}')) {
    return [obj, input.slice(1)]
  }
  return null
}

function parseCharacter (input, ch) {
  return input.startsWith(ch) ? [ch, input.slice(1)] : null
}
