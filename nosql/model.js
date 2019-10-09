const mongoose  = require('mongoose');
const functions = require('../functions');

// {"productid":{"index":0,"name":"productid","nullable":false,"caseSensitive":false,"identity":true,"readOnly":true},"productname":{"index":1,"name":"productname","length":80,"nullable":false,"caseSensitive":false,"identity":false,"readOnly":false},"supplierid":{"index":2,"name":"supplierid","nullable":false,"caseSensitive":false,"identity":false,"readOnly":false},"categoryid":{"index":3,"name":"categoryid","nullable":false,"caseSensitive":false,"identity":false,"readOnly":false},"unitprice":{"index":4,"name":"unitprice","nullable":false,"caseSensitive":false,"identity":false,"readOnly":false},"discontinued":{"index":5,"name":"discontinued","nullable":false,"caseSensitive":false,"identity":false,"readOnly":false}}
// "metadata":{"categoryid":{"index":0,"name":"categoryid","nullable":false,"caseSensitive":false,"identity":true,"readOnly":true},"categoryname":{"index":1,"name":"categoryname","length":30,"nullable":false,"caseSensitive":false,"identity":false,"readOnly":false},"description":{"index":2,"name":"description","length":400,"nullable":false,"caseSensitive":false,"identity":false,"readOnly":false}}

let model = {}


datatype =  (sqldt) => {
    if(sqldt === undefined ){
        return 'String'
    }
    if(sqldt[0] == 'sql.Int') {
        return 'Number'
    }
    else if (sqldt[0] == 'sql.Bit') {
        return 'Boolean'
    }
    else if (sqldt[0] == 'sql.DateTime') {
        return 'Date'
    } else if (sqldt[0] == 'sql.VarBinary'){
        return 'Buffer'
    }
    else {
        return 'String'
    }
}


model.model = async (name, metadata, foreignKeys) => {
    let schema = {}
    await functions.asyncForEach(Object.values(metadata), (docs, i) => {
        let indx = foreignKeys.map( o => (o.TableName === name) && (o.ColumnName === docs)).indexOf(true);
        
        if(indx !=-1){
            let fk  = foreignKeys[indx];
            schema[`${docs.name}_fk`] = [{
                type    : mongoose.Schema.Types.ObjectId,
                ref     : fk.ReferenceTableName
            }]
        }

        schema[`${docs.name}`] = {
            type    : datatype(docs.type),
            unique  : docs.identity,
        }
        // console.log(2,doc);
    })
    return mongoose.model(`${name}`, schema);
}


module.exports = model;