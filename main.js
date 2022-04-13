const express = require('express'),
    app = express(),
    port = 3000,
    ImgUrl = require("./js/download_images"),
    match_images = require("./js/match_images"),
    stringSimilarity = require("string-similarity"),
    fs = require('fs');


app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    let rawdata = fs.readFileSync('./matching.json');
    let matching_data = JSON.parse(rawdata);
    // console.log(matching_data)
    res.render('index', { data: matching_data });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    main()
})

async function main() {
    let imageURl = new ImgUrl()
    await imageURl.getUrlImage()
    let iterateOffers = imageURl.getIterateOffers()
    let matching_array = []
        // console.log(iterateOffers, "iterateOffers")
    let matchImages = new match_images()
        // let match = matchImages.imgMatchDebug()
        // match = matchImages.imgMatchDebug2()
    for (let index = 10 - 1; index > 0; index--) {
        // console.log(index, "index")
        console.time("main");
        matching_array.push(iterateOffers[index])
        for (let index2 = 0; index2 < iterateOffers.length - 1; index2++) {
            // console.log(index2, "index2")
            // let match2 = await matchImages.imgMatch2(iterateOffers[index].offer_id, iterateOffers[index2].offer_id)
            let match = matchImages.imgMatch(iterateOffers[index].offer_id, iterateOffers[index2].offer_id)
                // console.log("matchOdiff", matchOdiff)
            if (match >= 0 && match <= 20 && iterateOffers[index].offer_id != iterateOffers[index2].offer_id) {
                var similarity = stringSimilarity.compareTwoStrings(iterateOffers[index].title, iterateOffers[index2].title);
                similarity = similarity.toFixed(2) * 100
                iterateOffers[index].matches.push({
                    offer_id: iterateOffers[index2].offer_id,
                    stringSimilarity: similarity,
                    score: match,
                    title: iterateOffers[index2].title,
                    price: iterateOffers[index2].price

                })
            }
        }
        iterateOffers.pop()
        console.log("Wait:", iterateOffers.length)
        console.timeEnd("main");

    }
    console.log("END")
    let data = JSON.stringify(matching_array);
    fs.writeFileSync('./matching.json', data);
}