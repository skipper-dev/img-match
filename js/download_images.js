const axios = require('axios');
const fs = require('fs')
const sharp = require('sharp');
module.exports = class ImgUrl {
    constructor() {
        this.authtoken = ""
        this.IterateOffers = []

    }
    async login() {
        const data = await axios.post('https://dev.api.skpr.it/login', {
            email: 'skpr_admin@skpr.com',
            password: 'QR6uyAuwZGDtuf3a'
        })
        this.authtoken = data.data.token
    }

    async getUrlImage(skippercategoryid = '602aea4fb428454d66160df8', brandid = "602aea4eb428454d6615ff6a") {
        await this.login()
        const options = {
            method: 'GET',
            params: { 'skipper-category-id': skippercategoryid, "brand-id": brandid, "limit": "-1" },
            url: 'https://dev.api.skpr.it/electronics/it/views/offers',
            headers: {
                Authorization: this.authtoken
            }
        };

        const response = await axios.request(options)
        response.data.data.forEach(element => {
            let offers = {
                img: `skipper-category-id/brand-id/${element._id}.png`,
                offer_id: element._id,
                matches: [],
                title: element.title,
                price: element.list_price
            }
            this.IterateOffers.push(offers)
                // the images are not downloaded automatically activate them manually the first time
                // this.downloader("skipper-category-id/brand-id/" + element._id + ".webp", element.image_url_local)
        });
    }
    getIterateOffers() {
        return this.IterateOffers
    }
    async downloader(path, urlImage) {
        const urlImageComplete = 'http://pro.skpr.it/offers' + urlImage
        const res = await axios.get(urlImageComplete, { responseType: "arraybuffer" })
        await fs.promises.writeFile(path, res.data)
        const pathConv = path.replace('webp', 'png')
        sharp.cache(false);
        await sharp(path)
            .resize({
                width: 250,
                height: 250,
                fit: sharp.fit.cover,
                position: sharp.strategy.entropy
            })
            // .greyscale()
            .toColourspace('b-w')
            .png()
            .toFile(pathConv)
        fs.unlinkSync(path)
        return pathConv
    }
}