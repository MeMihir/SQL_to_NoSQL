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