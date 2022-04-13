const pixelmatch = require('pixelmatch');
const PNG = require('pngjs').PNG;
const resemble = require('resemblejs')
const fs = require("fs");

module.exports = class match_images {
    constructor() {


    }
    imgMatch(img1Name = "6244bbe2afcac1b795de0f8f", img2Name = "6244bbe2afcac1b795de0f8e") {
        // console.time("pixelmatch");

        const img1 = PNG.sync.read(fs.readFileSync(`skipper-category-id/brand-id/${img1Name}.png`))
        const img2 = PNG.sync.read(fs.readFileSync(`skipper-category-id/brand-id/${img2Name}.png`))
        const { width, height } = img1;

        let data = pixelmatch(img1.data, img2.data, null, width, height, { threshold: 0.1 });
        // console.log(data, "match")
        // console.timeEnd("pixelmatch");

        return data
    }
    imgMatchDebug(img1Name = "6244bbe4afcac1b795de1f3d", img2Name = "6244bbe4afcac1b795de1f3e") {
        const img1 = PNG.sync.read(fs.readFileSync(`skipper-category-id/brand-id/${img1Name}.png`))
        const img2 = PNG.sync.read(fs.readFileSync(`skipper-category-id/brand-id/${img2Name}.png`))
        const { width, height } = img1;
        const diff = new PNG({ width, height });
        let data = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });
        console.log(data, "debug value")
        fs.writeFileSync('./diff.png', PNG.sync.write(diff));
        return data
    }
    async imgMatch2(img1Name = "6244bbe4afcac1b795de1f3d", img2Name = "6244bbe4afcac1b795de1f3e") {
        // console.time("resemble");
        const img1 = fs.readFileSync(`skipper-category-id/brand-id/${img1Name}.png`)
        const img2 = fs.readFileSync(`skipper-category-id/brand-id/${img2Name}.png`)
        const data = await new Promise((resolve, reject) => {
                resemble(img1)
                    .compareTo(img2)
                    .ignoreColors()
                    .ignoreAntialiasing()
                    .onComplete(function(data) {
                        resolve(data)
                            // console.log(data);
                    })
            })
            // fs.writeFileSync('./diff3.png', PNG.sync.write(data.getBuffer()));
            // console.timeEnd("resemble");
            // console.log(data);
        return data
            // console.log(JSON.stringify(data))

    }
}