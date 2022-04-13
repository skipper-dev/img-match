const express = require('express'),
    app = express(),
    port = 4000,
    Matching = require("./js/matching.js"),
    fs = require('fs');


app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    let rawdata = fs.readFileSync('./matching.json');
    let matching_data = JSON.parse(rawdata);
    res.render('index', { data: matching_data });
})
app.get('/start', (req, res) => {
    let match = new Matching()
    match.start()
    res.render('matching');

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})