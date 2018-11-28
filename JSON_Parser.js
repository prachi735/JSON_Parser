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
  // console.log(input)
  let re = /^-?[1-9]+[0-9]*$|^0$|^-?[0-9][1-9]*.[0-9]$|^-?[0-9][1-9]*.[0-9]+e-?[1-9]+/
  let result = re.test(input)
  if (result) {
    input = input.toString()
    let eIndex = input.indexOf('e') + input.indexOf('E') + 1
    let n = 0
    if (eIndex > 0) {
      let base = Number(input.substr(0, eIndex))
      let power = Number(input.substr(eIndex + 1))
      n = (base * 10 ** power)
    } else {
      n = Number(input)
    }
    let num = input.match(re)
    return [n, input.slice(num.length)]
  } else return null
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
        return null
      }
      input = result[1]
      result = ParseToken(input)
      if (result) {
        arr.push(result[0])
        input = result[1]
      } else break
      result = ParseSpace(input)
      if (result == null) {
      }
      input = result[1]
      result = ParseComma(input)
      if (result == null) {
        return null
      }
      input = result[1]
      if (input.charAt('0') === ']') {
        return null
      }
    }
    return arr
  } else return null
}

function ParseObject (input) {
  let obj = {}
  let key = ''
  // let value = null
  let result = null

  if (input.charAt(0) === '{') {
    while (true) {
      result = ParseSpace(input)
      if (result == null) {
        return null
      }
      result = ParseString(input)
      if (result === null) {
        return null
      }
      key = result[0]
      input = result[1]
      input = ParseSpace(input)
      if (result == null) {
        return null
      }
      input = ParseColon(input)
      if (result == null) {
        return null
      }
      input = result[1]
      input = ParseSpace(input)
      if (result == null) {
        return null
      }
      input = result[1]
      input = ParseToken(input)
      if (result == null) {
        return null
      }
      input = result[0]
      obj[key] = result[0]

      result = ParseToken(input)
      if (result === null) {
        return null
      }
      result = ParseSpace(input)
      if (result == null) {
        return null
      }
      input = result[1]
      result = ParseComma(input)
      if (result == null) {
        return null
      }
      input = result[1]
      if (input.charAt('0') === '}') {
        return null
      }
      return obj
    }
  } else return null
}

function Parse () {
  let obj = `{"key" : "ab c", "k":"12", "k":123, "k":[1,2,3,4], "k":1e2, "":2 }`
  console.log(ParseObject(obj))

  obj = `{"card":"2","numbers":{"Conway":[1,11,21,1211,111221,312211],"Fibonacci":[0,1,1,2,3,5,8,13,21,34]}}`
  console.log(ParseObject(obj))

  obj = `{"ID":null,"name":"Doe","first-name":"John","age":25,"hobbies":["reading","cinema",{"sports":["volley-ball","snowboard"]}],"address":{}}`
  console.log(ParseObject(obj))

  obj = `{noquotes:noquotes,"\\u must be followed by 4 digits":"\\u01A",unquoted property:unknown_value,"unescaped backslash \ ":"\ ","malformed object":{"1"}}`
  console.log(ParseObject(obj))
}

Parse()

// Helper functions
function ParseComma (input) {
  if (input.startsWith(',')) {
    return [',', input.slice(1)]
  } else return null
}

function ParseColon (input) {
  if (input.startsWith(':')) {
    return [':', input.slice(1)]
  } else return null
}

function ParseSpace (input) {
  if (input.match(' ')) {
    return [null, input.slice(input.match(' ').index)]
  } else return null
}

function ParseToken (input) {
  return ParseObject(input) || ParseArray(input) || ParseString(input) || ParseNumber(input) || ParseNull(input) || ParseBoolean(input)
}
