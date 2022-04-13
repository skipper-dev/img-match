const ImgUrl = require("./download_images");
const match_images = require("./match_images");
const stringSimilarity = require("string-similarity");

module.exports = class Matching {
    async start() {
        // the images are not downloaded automatically activate them manually the first time
        await this.getImage()
        let iterateOffers = this.iterateOffers
        let matching_array = []
        let matchImages = new match_images()
            //modify the value of index to decide how many values to compare
        for (let index = iterateOffers.length - 1; index > 0; index--) {
            console.time("Timer"); // for debug only
            matching_array.push(iterateOffers[index])
            for (let index2 = 0; index2 < iterateOffers.length - 1; index2++) {
                let match = matchImages.imgMatch(iterateOffers[index].offer_id, iterateOffers[index2].offer_id)
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
            console.log("To Complete:", iterateOffers.length)
            console.timeEnd("Timer");

        }
        let data = JSON.stringify(matching_array);
        fs.writeFileSync('./matching.json', data);
    }

    async getImage() {
        let imageURl = new ImgUrl()
        await imageURl.getUrlImage()
        this.iterateOffers = imageURl.getIterateOffers()
    }
}