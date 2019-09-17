const mongoose  = require('mongoose');
const model     = require('./model');
const functions = require('../functions');

let nosql = {};
// str = [{shcema_name : '', 
//     tables = [{
//         table_name : '',
//         metadata   : {},
//         data       : [{}]
//     }]
// }]
nosql.put_data = async (structure) => {

    mongoose.connect(`mongodb://localhost:27017/${req.body.database_op}`, {useNewUrlParser: true});

    let Models = {}

    //SCHEMA MODELING
    await functions.asyncForEach(structure, async (schema, i) => {
        await functions.asyncForEach(schema.tables, (table, j) => {
            Models[`${table.TABLE_NAME}`] = await model.model(table.TABLE_NAME, table.metadata)
        })
    })

    await functions.asyncForEach(structure, async (schema, i) => {
        await functions.asyncForEach(schema.tables, async (table, j) => {
            Models.table.TABLE_NAME.insertMany(table.data, (err) => {
                if(err) {
                    console.log(err);
                }
            })
        })
    })
    // let metadata = {"categoryid":{"index":0,"name":"categoryid","nullable":false,"caseSensitive":false,"identity":true,"readOnly":true},"categoryname":{"index":1,"name":"categoryname","length":30,"nullable":false,"caseSensitive":false,"identity":false,"readOnly":false},"description":{"index":2,"name":"description","length":400,"nullable":false,"caseSensitive":false,"identity":false,"readOnly":false}}

    // let retVal = await model.model('Products',metadata);
}

module.exports = nosql;
