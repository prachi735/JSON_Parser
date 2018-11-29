function ParseNull (input) {
  if (input.substr(0, 4) === 'null') {
    return [null, input.substr(5, input.length)]
  } else return null
}

function ParseBoolean (input) {
  if (input.substr(0, 4) === 'true') {
    return 'true' + ' ' + input.substr(5, input.length)
  } else if (input.substr(0, 5) === 'false') {
    return [false, input.substr(6, input.length)]
  } else return null
}

function ParseNumber (input) {
  let re = /^-?[1-9]+[0-9]*|^0|^-?[0-9][1-9]*.[0-9]|^-?[0-9][1-9]*.[0-9]+e-?[1-9]+/
  let result = input.match(re)
  if (result) {
    let eIndex = result[0].indexOf('e') + result[0].indexOf('E') + 1
    let n = 0
    if (eIndex > 0) {
      let base = Number(result[0].substr(0, eIndex))
      let power = Number(result[0].substr(eIndex + 1))
      n = (base * 10 ** power)
    } else {
      // n = Number(result[0])
      n = Number(result[0])
    }
    console.log(n, input)
    return [n, input.slice(result[0].length)]
  } else return null

//   let regexp = String(input).match(/^[-+]?(\d+(\.\d*)?|\.\d+)([e][+-]?\d+)?/)
//   if (!String(input).match(/^[-+]?(\d+(\.\d*)?|\.\d+)([e][+-]?\d+)?/)) return null
// return [parseInt(regexp[0]), input.slice(regexp[0].length)]
}

function ParseString (input) {
  // console.log(input)
  // let re = /"([^"\\]*(\\"|\\|\/|b|f|n|r|n|r|t|(u[0-9a-zA-Z]{4}))*)+"/
  // let result = re.test(input)
  // if (result) {
  //   return input // .substr(1, input.length - 2)
  // } else return null

  let i = 1
  // if (input.startsWith('"')) {
  if (input.charAt(0) === '"') {
    let s = ''
    while (input[i] !== '"') {
      if (input[i] === '\\') {
        s = s + input.substr(i, 2)
        i += 2
      } else {
        s = s + input[i]
        i++
      }
    }
    return [s, input.slice(i + 1)]
  } else return null
}

function ParseArray (input) {
  let result = null
  let arr = []
  if (input.charAt(0) === '[') {
    input = input.slice(1)
    while (true) {
      result = ParseSpace(input)
      if (result !== null) {
        input = result[1]
      }
      result = ParseValue(input)
      if (result) {
        arr.push(result[0])
        input = result[1]
      } else break
      result = ParseSpace(input)
      if (result !== null) {
        input = result[1]
      }
      result = ParseComma(input)
      if (result !== null) {
        input = result[1]
      }
      if (input.charAt('0') === ']') {
        input = input.slice(']')
        break
      }
    }
    return [arr, input]
  }
  return null
}

function ParseObject (input) {
  let obj = {}
  let key = ''
  let result = null

  if (input.charAt(0) === '{') {
    input = input.slice(1)
    while (true) {
      console.log('0', input)
      result = ParseSpace(input)
      if (result !== null) {
        input = result[1]
      }
      result = ParseString(input)
      if (result === null) {
        break
      }
      key = result[0]
      input = result[1]
      result = ParseSpace(input)
      if (result !== null) {
        input = result[1]
      }
      result = ParseColon(input)
      if (result !== null) {
        input = result[1]
      }
      result = ParseSpace(input)
      if (result !== null) {
        input = result[1]
      }
      result = ParseValue(input)
      console.log('i0', input, result)
      if (result !== null) {
        obj[key] = result[0]
        input = result[1]
        console.log(input)
      } else {
        console.log('i1', input)
        break
      }
      result = ParseSpace(input)
      console.log('1', input)
      if (result !== null) {
        input = result[1]
      }
      console.log('2', input)
      result = ParseComma(input)
      if (result !== null) {
        input = result[1]
      }
      console.log('3', input)
      if (input.charAt('0') === '}') {
        console.log('i2', input)
        break
      }
      console.log('4', input)
    }
    return [obj, input]
  }
  return null
}

function Parse () {
  let obj = `{"key1" : 1 , "Key2": 2, "Key3": 3 }`
  // console.log(ParseObject(obj)[0])

  obj = `{"key" : "ab c", "k1":"12", "k2":123, "k3":12, "k4":2,"Obj": {"k6":5} }`
  console.log(ParseObject(obj)[0])

  // obj = `{"card":"2","numbers":{"Conway":[1,11,21,1211,111221,312211],"Fibonacci":[0,1,1,2,3,5,8,13,21,34]}}`
  // console.log(ParseObject(obj))

  // obj = `{"ID":null,"name":"Doe","first-name":"John","age":25,"hobbies":["reading","cinema",{"sports":["volley-ball","snowboard"]}],"address":{}}`
  // console.log(ParseObject(obj))

  // obj = `{noquotes:noquotes,"\\u must be followed by 4 digits":"\\u01A",unquoted property:unknown_value,"unescaped backslash \ ":"\ ","malformed object":{"1"}}`
  // console.log(ParseObject(obj))
}

Parse()

// Helper functions
// function ParseCharacter (input, ch) {
//   console.log('Prase Char',input, ch, ch === ' ')
//   if (ch === ' ') {
//     console.log(input.match(/\S/))
//     if (input.match(/\S/)) {
//       return [null, input.slice(input.match(/\S/))]
//     } else return null
//   }
//   if (input.startsWith(ch)) {
//     return [ch, input.slice(1)]
//   } else return null
// }

function ParseComma (input) {
  return input.startsWith(',') ? [',', input.slice(1)] : null
}
function ParseColon (input) {
  return input.startsWith(':') ? [':', input.slice(1)] : null
}
function ParseSpace (input) {
  return input.match(/^[\s\n]/) ? [null, input.slice(input.match(/\S/).index)] : null
}

function ParseValue (input) {
  return ParseObject(input) || ParseArray(input) || ParseString(input) || ParseNumber(input) || ParseNull(input) || ParseBoolean(input)
}
