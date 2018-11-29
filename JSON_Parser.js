const fs = require('fs')
testParser()

function testParser () {
  let result = null

  // let testObjects = [ `{"key1" : 1, "K2": 12.3 ,   "K3": -1.0 , "k6":1.3e2, "K8":0.0}`,
  //   `{"key" : "ab c", "k1":"12", "k2":123,    "k3":   12, "k4":2, "k5":[1,2, [3,4], {"J":1}] , "Obj": {"k6":5} }`,
  //   `{"card":"2","numbers":{"Conway":[1,11,21,1211,111221,312211],"Fibonacci":[0,1,1,2,3,5,8,13,21,34]}}`,
  //   `{"ID":null,"name":"Doe","first-name":"John","age":25,"hobbies":["reading","cinema",{"sports":["volley-ball","snowboard"]}],"address":{}}`,
  //   `{noquotes:noquotes,"\\u must be followed by 4 digits":"\\u01A",unquoted property:unknown_value,"unescaped backslash \ ":"\ ","malformed object":{"1"}}`
  // ]
  // let parser = new Parser()
  // for (let obj of testObjects) {
  //   result = parseValue(obj)
  //   if (result !== null) {
  //     console.log(result[0])
  //   } else console.log(`Invalid JSON`)
  // }

  fs.readFile('./testJsonParser.txt', 'utf-8', function (err, data) {
    if (err) throw err
    console.log(parseValue(data))
  })
}

// function Parser () {

function parseValue (input) {
  let result
  result = parseObject(input) || parseArray(input) || parseString(input) || parseNumber(input) || parseNull(input) || parseBoolean(input)
  return result
}

function parseNull (input) {
  return input.startsWith('null') ? [null, input.slice(4)] : null
}

function parseBoolean (input) {
  return input.startsWith('true') ? ['true', input.slice(4)] : (input.startsWith('false') ? ['false', input.slice(5)] : null)
}

function parseNumber (input) {
  let re = /^-?[0-9]+[1-9]*\.[0-9]+[e]{1}-?[1-9]+|^-?\d[1-9]*\.\d?|^-?[1-9]+\d*|^0/ // |^0|^-?\d[1-9]*.\d?|^-?[0-9][1-9]*.[0-9]+e-?[1-9]+/
  let result = input.match(re)
  if (result) {
    let eIndex = result[0].indexOf('e') + result[0].indexOf('E') + 1
    let n = 0
    if (eIndex > 0) {
      let base = Number(result[0].substr(0, eIndex))
      let power = Number(result[0].substr(eIndex + 1))
      n = (base * 10 ** power)
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
  if (!input.startsWith('[')) {
    return null
  }
  input = input.slice(1)
  while (true) {
    input = input.trim()
    result = parseValue(input)
    if (result === null) break
    arr.push(result[0])
    input = result[1]
    input = input.trim()
    result = commaParser(input)
    if (result === null) break
    input = result[1]
    if (input.startsWith(']')) {
      return null
    }
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
  let value
  let result
  if (!input.startsWith('{')) return null
  input = input.slice(1)
  while (true) {
    input = input.trim()
    result = parseString(input)
    if (result === null) break
    else {
      key = result[0]
      input = result[1]
      input = input.trim()
      result = colonParser(input)
      if (result === null) return null
      input = result[1]
      input = input.trim()
      result = parseValue(input)
      if (result === null) return null
      value = result[0]
      obj[key] = value
      input = result[1]
      input = input.trim()
      result = commaParser(input)
      if (result === null) break
      input = result[1]
      if (input.startsWith('}')) {
        return null
      }
    }
  }
  input = input.trim()
  if (!input.startsWith('}')) return null
  return [obj, input.slice(1)]
}

function commaParser (input) {
  return input.startsWith(',') ? [',', input.slice(1)] : null
}

function colonParser (input) {
  return input.startsWith(':') ? [':', input.slice(1)] : null
}
// }
