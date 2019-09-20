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

            let foreigenKeys = await request.query('SELECT f.name AS ForeignKey, OBJECT_NAME(f.parent_object_id) AS TableName, COL_NAME(fc.parent_object_id, fc.parent_column_id) AS ColumnName, OBJECT_NAME (f.referenced_object_id) AS ReferenceTableName, COL_NAME(fc.referenced_object_id, fc.referenced_column_id) AS ReferenceColumnName FROM sys.foreign_keys AS f INNER JOIN sys.foreign_key_columns AS fc ON f.OBJECT_ID = fc.constraint_object_id');

            structure.foreigenKeys = foreigenKeys.recordset;
            
            // console.log(structure);
            res.send(structure);
            // return structure;
            
        }
    })
}

module.exports = get_data;

// [ { ForeignKey: 'FK_Employees_Employees',
// TableName: 'Employees',
// ColumnName: 'mgrid',
// ReferenceTableName: 'Employees',
// ReferenceColumnName: 'empid' },
// { ForeignKey: 'FK_Orders_Employees',
// TableName: 'Orders',
// ColumnName: 'empid',
// ReferenceTableName: 'Employees',
// ReferenceColumnName: 'empid' },
// { ForeignKey: 'FK_Products_Suppliers',
// TableName: 'Products',
// ColumnName: 'supplierid',
// ReferenceTableName: 'Suppliers',
// ReferenceColumnName: 'supplierid' },
// { ForeignKey: 'FK_Products_Categories',
// TableName: 'Products',
// ColumnName: 'categoryid',
// ReferenceTableName: 'Categories',
// ReferenceColumnName: 'categoryid' },
// { ForeignKey: 'FK_OrderDetails_Products',
// TableName: 'OrderDetails',
// ColumnName: 'productid',
// ReferenceTableName: 'Products',
// ReferenceColumnName: 'productid' },
// { ForeignKey: 'FK_Orders_Customers',
// TableName: 'Orders',
// ColumnName: 'custid',
// ReferenceTableName: 'Customers',
// ReferenceColumnName: 'custid' },
// { ForeignKey: 'FK_Orders_Shippers',
// TableName: 'Orders',
// ColumnName: 'shipperid',
// ReferenceTableName: 'Shippers',
// ReferenceColumnName: 'shipperid' },
// { ForeignKey: 'FK_OrderDetails_Orders',
// TableName: 'OrderDetails',
// ColumnName: 'orderid',
// ReferenceTableName: 'Orders',
// ReferenceColumnName: 'orderid' },
// { ForeignKey: 'FK_Scores_Tests',
// TableName: 'Scores',
// ColumnName: 'testid',
// ReferenceTableName: 'Tests',
// ReferenceColumnName: 'testid' } ]