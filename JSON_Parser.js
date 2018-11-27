function ParseNull (input) {
  if (input.substr(0, 4) === 'null') {
    return 'null' + ' ' + input.substr(5, input.length)
  } else return null
}

function ParseBoolean (input) {
  if (input.substr(0, 4) === 'true') {
    return 'true' + ' ' + input.substr(5, input.length)
  } else if (input.substr(0, 5) === 'false') {
    return 'false' + ' ' + input.substr(6, input.length)
  } else return null
}

function ParseNumber (input) {
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
    return n
  } else return null
}

function ParseString (input) {
  let re = /"([^"\\]*(\\"|\\|\/|b|f|n|r|n|r|t|(u[0-9a-zA-Z]{4}))*)+"/
  let result = re.test(input)
  if (result) {
    return input
  } else return null
}

function ParseArray (input) {
  if (input.charAt(0) === '[' && input.charAt(input.length - 1) === ']') {
    let parsedArray = []
    let str = input.substr(1, input.indexOf('}') - 1).split(`,`)
    for (let a of str) {
      a = a.trim()
      let val = ParseNull(a) || ParseBoolean(a) || ParseNumber(a) || ParseString(a) || ParseObject(a)
      if (val) {
        parsedArray.push(val)
      } else return null
    }
    return parsedArray
  } else return null
}

function ParseObject (input) {
  return null
}

function Parse () {
  let obj = `{"key" : "ab c", "k":"12", "k":123, "k":[1,2,3,4], "k":1e2, "":2 }`
  ParseObject(obj)
}

Parse()
