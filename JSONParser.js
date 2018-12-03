const fs = require("fs");
testParser();
let errorIndex = -1;

function testParser() {
  testData("testCases/singleTest.txt");
  // testData("testCases/testJsonParser.txt");
  // testData("testCases/testJsonParserInvalid.txt");
  // testData("testCases/testRedditJson.txt");
  // testData("testCases/testTwitterJson.txt");

  function testData(path) {
    fs.readFile(path, "utf-8", function(err, file_data) {
      if (err) throw err;
      // console.log(file_data)
      errorIndex = file_data.length;
      let arg = {data:file_data.trim(), row: 0, column:0}
      let result = parseValue(arg);
      if(result[1].data.length == 0)
        console.log(result)
      else{
        console.log("Error at Row",result[1].row, "Column", result[1].column)
      } 

    });
  }
}

const parseValue = Parserfactory(parseObject,
      parseArray,
      parseString,
      parseNumber,
      parseNull,
      parseBoolean) 

function Parserfactory(...parsers) {
  return function(input) {
    if(input.data !== undefined){
      errorIndex = Math.min(errorIndex, input.data.trim().length)
    }
    let result = null
    for (let i = 0; i < parsers.length; i++)
    {
      // if(input.data)
      let res = parsers[i](input)
      if (res !== null) {
        return res 
      }
    }
    return null
  }
}

function parseNull(input) {
  if(input.data.startsWith("null")){
    input.data = input.data.slice(4)
    return [null, input]
   } else return null
}

function parseBoolean(input) {
  if(input.data.startsWith("true"))
  {
    input.data = input.data.slice(4)
    return ["true", input]
  } else if(input.data.startsWith("false")){
    input.data = input.data.slice(5)
    return ["false", input]
  }
    return null
}

function parseNumber(input) {
  let re = /^-?[0-9]+[1-9]*\.[0-9]+[e]{1}-?[1-9]+|^-?\d[1-9]*\.\d?|^-?[1-9]+\d*|^0/;
  let result = input.data.match(re);
  if (result) {
    let eIndex = result[0].indexOf("e") + result[0].indexOf("E") + 1;
    let n = 0;
    if (eIndex > 0) {
      n =
        Number(result[0].substr(0, eIndex)) *
        10 ** Number(result[0].substr(eIndex + 1));
    } else {
      n = Number(result[0]);
    }
    input.data = input.data.slice(result[0].length) 
    return [n, input];
  } else return null;
}

function parseString(input) {
  // TODO: implement for \u[hexa]4chars 
  //restrict the escape characters
  let i = 1;
  let n = input.data.length;
  if (input.data.startsWith('"')) {
    let str = "";
    while (input.data[i] !== '"' && i < n) {
      if (input.data[i] === "\\") {
        str += input.data.substr(i, 2);
        i += 2;
      } else {
        str += input.data[i];
        i++;
      }
    }
    input.data = input.data.slice(i+1)
    return [str, input];
  }
  return null;
}

function parseArray(input) {
  if (!input.data.startsWith("[")) return null;
  let arr = [];
  let result;
  input.data = input.data.slice(1);
  while (!input.data.startsWith("]")) {
    input.data = input.data.trim();
    result = parseValue(input);
    if (result === null) break;
    arr.push(result[0]);
    input = result[1];
    input.data = input.data.trim();
    result = parseCharacter(input.data, ",");
    if (result !== null) input.data = result[1];
  }
  input.data = input.data.slice(1)
    return [arr, input];
}

function parseObject(input) {
  if (!input.data.startsWith("{")) return null;
  let obj = {};
  let key = "";
  let result = null;
  input.data = input.data.slice(1);
  while (!input.data.startsWith("}")) {
    // if(input.data.startsWith("\n")) {
    //   input.row += 1
    //   input.column += 1
    // }
    input.data = input.data.trim();
    result = parseString(input);
    if (result === null) break;
    key = result[0];
    input= result[1];
    input.data = input.data.trim();
    result = parseCharacter(input.data, ":");
    if (result === null) return null;
    input.data = result[1].trim();
    result = parseValue(input);
    if (result === null) return null;
    obj[key] = result[0];
    input = result[1];
    input.data = input.data.trim();
    result = parseCharacter(input.data, ",");
    if (result !== null) input.data = result[1];
  }
  input.data = input.data.slice(1)
    return [obj, input];
}

function parseCharacter(input, ch) {
  return input.startsWith(ch) ? [ch, input.slice(1)] : null;
}

function updateInputObj (obj, data, r, c) {
  obj.data = data
  obj.Row = r
  obj.Column = c
  return obj
}
