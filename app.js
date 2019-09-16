var express     = require('express'),
    app         = express(),
    sql         = require('mssql'),
    bodyParser  = require('body-parser');
    getData     = require('./sqlip')

app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine','ejs');
app.use(express.static('views'));

app.get('/', (req, res) => {
    res.render('home');
})

app.post('/', async (req, res) => {
    let structure = await getData.get_data(req,res);
    // console.log(structure);
    // res.render('show', {data : strcutre})
})

app.listen(5000, () => {
    console.log('Server initiated!!');
})