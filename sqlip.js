const sql       = require('mssql');
const funs      = require('./functions');
const express   = require('express');
const app       = express(); 

let get_data = {};

get_data.get_data = async (req,res) => {
    let config = {
        user        : req.body.user, //testuser
        password    : req.body.password, //password123,
        server      : 'localhost',
        database    : req.body.database, //TSQLV3,
        port        : 1433,
        dialect     : 'mssql',
        dialectOptions  : {
            'instanceName'  : 'SQLEXPRESS'
        }
    };

    let structure = [];

    sql.connect(config, async (err) => {
        if (err) {
            console.log(err);
        } else {

            //SCHEMAS
            let request_schema = new sql.Request();
            
            let result = await request_schema.query(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA`);
            structure = result.recordset;
            
            let schemas = structure;
            
            //TABLES
            await funs.asyncForEach(schemas, async (schema, i) => {

                let request_table = new sql.Request();
                let tables = await request_table.query(`SELECT TABLE_NAME FROM information_schema.tables WHERE TABLE_TYPE='BASE TABLE' AND TABLE_SCHEMA = '${schema.SCHEMA_NAME}'`);
                
                structure[i].tables = tables.recordset;

                //COLUMNS
                await funs.asyncForEach(tables.recordset, async (table, j) => {

                    let request_column = new sql.Request();
                    let rows = await request_column.query(`SELECT * FROM ${schema.SCHEMA_NAME}.${table.TABLE_NAME}`);

                    structure[i].tables[j].metadata = rows.recordset.columns;
                    structure[i].tables[j].data     = rows.recordset;
                })
            })

            // console.log(structure);
            res.send(structure);
            // return structure;
            
        }
    })
}

module.exports = get_data;