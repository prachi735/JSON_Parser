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
  let sIndex = input.indexOf(` `)
  let number = input.split(` `)[0]

  let re = /^-?[1-9]+[0-9]*$|^0$|^-?[0-9][1-9]*.[0-9]$|^-?[0-9][1-9]*.[0-9]+e-?[1-9]+/
  let result = re.test(number)
  if (result) {
    let eIndex = number.indexOf('e') + number.indexOf('E') + 1
    let n = 0
    if (eIndex > 0) {
      let base = Number(number.substr(0, eIndex))
      let power = Number(number.substr(eIndex + 1))
      n = (base * 10 ** power)
    } else {
      n = Number(number)
    }
    return n + input.substr(sIndex)
  } else return null
}

function ParseString (input) {
  let str = input.split(` `)[0]
  let re = /"([^"\\]*(\\"|\\|\/|b|f|n|r|n|r|t|(u[0-9a-zA-Z]{4}))*)+"/
  let result = re.test(input)
  if (result) {
    return str.join('') + input.substr(input.indexOf(` `))
  } else return null
}

function ParseArray (input) {
  return input
}

function ParseObject (input) {
  return input
}

function Parse () {
  console.log('null Parser')
  for (let s of ['null test', 'NULL test', 'abc test']) {
    console.log(s + ': ' + ParseNull(s))
  }

  console.log('bool Parser')
  for (let s of ['true', 'false', 'true test', 'false test', 'False test', 'True test', '123 test', 'Null test']) {
    console.log(s + ': ' + ParseBoolean(s))
  }

  console.log('number Parser')
  for (let s of ['0 test', '00 test', '1 test', '12245 test', '-1 test', '-3245 test', '0.0 test', '1. test', '0.1 test', '00.1 test', '.0 test', '.12 test', '1.2 test', '-1.0 test', '-1.2 test', '102 test', 'abc test', '1e2 test', '-1e2 test', '1.2e-2 test', '-1.2e-2 test', '-1.2e- test', '-1.2e- test', 'test 123']) {
    console.log(s + ': ' + ParseNumber(s))
  }

  console.log('string Parser')
  for (let s of ['"a12zr" test', 'aBc test', '"a\nd" test', '"1245" test', '1245 test', '"-1245" test', '"-ab" test']) {
    console.log(s + ': ' + ParseString(s))
  }

  console.log('Array Parser')
  for (let s of []) {
    console.log(s + ': ' + ParseArray(s))
  }

  console.log('Object Parser')
  for (let s of []) {
    console.log(s + ': ' + ParseObject(s))
  }
}

Parse()
