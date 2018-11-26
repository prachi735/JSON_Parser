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

