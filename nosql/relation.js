const mongoose  = require('mongoose');
const functions = require('../functions');
const relation  = {};

relation.realtion = async (Table, RTable, Col, RCol) => {
    Table.find({}, (err, docs) => {
        if (err) {
            console.log(err);
        } else {
            functions.asyncForEach(docs, doc => {
                let obj = {};
                obj[`${RCol}`] = doc.Col;
                RTable.find(obj, (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        let obj = doc;
                        obj[`${Col}_fk`] = data._id;
                        Table.findByIdAndUpdate(doc._id, obj ,(err, res) => {
                            if(err) {
                                console.log(err);
                            }
                        })
                    }
                })
            })
        }
    })
}

module.exports = relation;

// [ { ForeignKey: 'FK_Employees_Employees',
//     TableName: 'Employees',
//     ColumnName: 'mgrid',
//     ReferenceTableName: 'Employees',
//     ReferenceColumnName: 'empid' },
//   { ForeignKey: 'FK_Orders_Employees',
//     TableName: 'Orders',
//     ColumnName: 'empid',
//     ReferenceTableName: 'Employees',
//     ReferenceColumnName: 'empid' },
//   { ForeignKey: 'FK_Products_Suppliers',
//     TableName: 'Products',
//     ColumnName: 'supplierid',
//     ReferenceTableName: 'Suppliers',
//     ReferenceColumnName: 'supplierid' },
//   { ForeignKey: 'FK_Products_Categories',
//     TableName: 'Products',
//     ColumnName: 'categoryid',
//     ReferenceTableName: 'Categories',
//     ReferenceColumnName: 'categoryid' },
//   { ForeignKey: 'FK_OrderDetails_Products',
//     TableName: 'OrderDetails',
//     ColumnName: 'productid',
//     ReferenceTableName: 'Products',
//     ReferenceColumnName: 'productid' },
//   { ForeignKey: 'FK_Orders_Customers',
//     TableName: 'Orders',
//     ColumnName: 'custid',
//     ReferenceTableName: 'Customers',
//     ReferenceColumnName: 'custid' },
//   { ForeignKey: 'FK_Orders_Shippers',
//     TableName: 'Orders',
//     ColumnName: 'shipperid',
//     ReferenceTableName: 'Shippers',
//     ReferenceColumnName: 'shipperid' },
//   { ForeignKey: 'FK_OrderDetails_Orders',
//     TableName: 'OrderDetails',
//     ColumnName: 'orderid',
//     ReferenceTableName: 'Orders',
//     ReferenceColumnName: 'orderid' },
//   { ForeignKey: 'FK_Scores_Tests',
//     TableName: 'Scores',
//     ColumnName: 'testid',
//     ReferenceTableName: 'Tests',
//     ReferenceColumnName: 'testid' } ]