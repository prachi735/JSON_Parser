<<<<<<< HEAD
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
  let str = input.split('')
  let sIndex = 0
  let number = ''
  for (let s of str) {
    if (!isNaN(s) || s === '.' || s === '-') {
      number += s
      sIndex++
    } else if (s === 'e' || s === 'E') {
      number += s
      sIndex++
    }
  }
  if (number.charAt(sIndex - 1) === 'e' || number.charAt(sIndex - 1) === 'E') {
    number = number.substr(0, number.length - 1).trim()
    sIndex--
  }

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
    return n + ' ' + input.substr(sIndex, input.length)
  } else return null
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
  for (let s of ['0 test', '00 test', '1 test', '12245 test', '-1 test', '-3245 test', '0.0 test', '1. test', '0.1 test', '00.1 test', '.0 test', '.12 test', '1.2 test', '-1.0 test', '-1.2 test', '102 test', 'abc test', '1e2 test', '-1e2 test', '1.2e-2 test', '-1.2e-2 test']) {
    console.log(s + ': ' + ParseNumber(s))
  }
}

Parse()
=======
'use strict'

function Parse_Null(input){
    if(input.substr(0,4) == 'null'){
        return ('null' +' '+ input.substr(5,input.length));
    }
    else return null;
}

function Parse_Boolean(input){
    if(input.substr(0,4) == 'true'){
        return ('true' +' ' + input.substr(5,input.length));
    }
    else if(input.substr(0,5) == 'false'){
        return ('false'+ ' ' + input.substr(6,input.length));
    }
    return null;
}

function Parse(){
    console.log(Parse_Null('null test'));
    console.log(Parse_Null('Null test'));
    console.log(Parse_Boolean('true test'));
    console.log(Parse_Boolean('false test'));
    console.log(Parse_Boolean('False test'));
    console.log(Parse_Boolean('True test'));
    console.log(Parse_Boolean('123 test'));
    console.log(Parse_Boolean('Null test'));

}

Parse();

>>>>>>> 2cc7f558b842c2c06f454d6ebcb100196fb87682
