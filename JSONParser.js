const fs = require("fs");
testParser();
let errorIndex = -1;

function testParser() {
  testData("testCases/testJsonParser.txt");
  // testData("testCases/testJsonParserInvalid.txt");
  // testData("testCases/testRedditJson.txt");
  // testData("testCases/testTwitterJson.txt");

  function testData(path) {
    fs.readFile(path, "utf-8", function(err, data) {
      if (err) throw err;
      errorIndex = data.length;
      let result = parseValue(data);
      if (result == null) {
        console.log("Error near position", data.length - errorIndex);
      } else {
        console.log(JSON.stringify(result));
        // console.log(result);
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
  errorIndex = Math.min(errorIndex, input.trim().length)
    let result = null
    for (let i = 0; i < parsers.length; i++)
    {
      let res = parsers[i](input)
      if (res !== null) {
        return res 
      }
    }
    return null
  }
}

function parseNull(input) {
  return input.startsWith("null") ? [null, input.slice(4)] : null;
}

function parseBoolean(input) {
  return input.startsWith("true")
    ? ["true", input.slice(4)]
    : input.startsWith("false")
    ? ["false", input.slice(5)]
    : null;
}

function parseNumber(input) {
  let re = /^-?[0-9]+[1-9]*\.[0-9]+[e]{1}-?[1-9]+|^-?\d[1-9]*\.\d?|^-?[1-9]+\d*|^0/;
  let result = input.match(re);
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
    return [n, input.slice(result[0].length)];
  } else return null;
}

function parseString(input) {
  // TODO: implement for \u[hexa]4chars 
  //restrict the escape characters
  let i = 1;
  let n = input.length;
  if (input.startsWith('"')) {
    let str = "";
    while (input[i] !== '"' && i < n) {
      if (input[i] === "\\") {
        str += input.substr(i, 2);
        i += 2;
      } else {
        str += input[i];
        i++;
      }
    }
    return [str, input.slice(i + 1)];
  }
  return null;
}

function parseArray(input) {
  if (!input.startsWith("[")) return null;
  let arr = [];
  let result;
  input = input.slice(1);
  while (!input.startsWith("]")) {
    input = input.trim();
    result = parseValue(input);
    if (result === null) break;
    arr.push(result[0]);
    input = result[1].trim();
    result = parseCharacter(input, ",");
    if (result !== null) input = result[1];
  }
    return [arr, input.slice(1)];
}

function parseObject(input) {
  if (!input.startsWith("{")) return null;
  let obj = {};
  let key = "";
  let result = null;
  input = input.slice(1);
  while (!input.startsWith("}")) {
    input = input.trim();
    result = parseString(input);
    if (result === null) break;
    key = result[0];
    input = result[1].trim();
    result = parseCharacter(input, ":");
    if (result === null) return null;
    input = result[1].trim();
    result = parseValue(input);
    if (result === null) return null;
    obj[key] = result[0];
    input = result[1].trim();
    result = parseCharacter(input, ",");
    if (result !== null) input = result[1];
  }
    return [obj, input.slice(1)];
}

function parseCharacter(input, ch) {
  return input.startsWith(ch) ? [ch, input.slice(1)] : null;
}
