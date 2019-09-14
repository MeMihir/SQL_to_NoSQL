var express     = require('express'),
    app         = express(),
    sql         = require('mssql'),
    bodyParser  = require('body-parser');

app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine','ejs');
app.use(express.static('views'));

app.get('/', (req, res) => {
    res.render('home');
})

app.post('/', (req, res) => {
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

    sql.connect(config, (err) => {
        if(err) {
            console.log(err);
            res.redirect('/')
        }
        else {

            // SCHEMAS
            let request_schema = new sql.Request();
            request_schema.query(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA`, (err,result) => {
                if(err){
                    console.log(err);
                    res.redirect('/')
                }
                else {
                    
                    let structure = result.recordset;

                    // TABLES
                    structure.forEach((schema,i) => {
                        let request_table = new sql.Request();
                        request_table.query(`SELECT TABLE_NAME FROM information_schema.tables WHERE TABLE_TYPE='BASE TABLE' AND TABLE_SCHEMA = '${schema.SCHEMA_NAME}'`, (err, result) => {
                            if(err) {
                                console.log(err);
                                res.redirect('/');
                            }
                            else {
                                structure[i].tables = result.recordset;
                                console.log(1,structure[i]);
                                
                                // //COLUMS
                                // structure[i].tables.forEach((table, j) => {
                                //     let request_column = new sql.Request();
                                //     request_column.query(`SELECT * FROM ${schema.SCHEMA_NAME}.${table.TABLE_NAME}`, (err, result) => {
                                //         if(err) {
                                //             console.log(err);
                                //             res.redirect('/');
                                //         }
                                //         else {
                                //             console.log(table)
                                //             structure[i].tables[j].metadata = result.recordset.columns;
                                //             structure[i].table[j].data = result.recordset;
                                //         }
                                //     })
                                // })
                            }
                        })
                    })
                    
                    // setTimeout(() => {
                    //     console.log(structure);
                    // }, 1000);

                }
            })
        }
    })
})

app.listen(5000, () => {
    console.log('Server initiated!!');
})