const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const http = require("http");
let iconv = require('iconv-lite');


http.get("http://www.27270.com/tag/1948.html", res => {
    res.pipe(iconv.decodeStream('gbk')).collect((err, html) => {
        let imgData = parseHTML(html);
        // console.log(imgData)
        downloadImage(imgData);
    });
});

// http.get("http://www.27270.com/tag/866.html", function(res) {
//     var chunks = [];
//     res.on('data', function(chunk) {
//         chunks.push(chunk);
//     });
//     res.on('end', function() {
//         var html = iconv.decode(Buffer.concat(chunks), 'gb2312');
//           let imgData = parseHTML(html);
//         // console.log(imgData)
//         downloadImage(imgData);
//     });
// });
function parseHTML(html) {
    let $ = cheerio.load(html);
    let arr = $("div.w1200>ul>li>a>img").toArray();
    let imgData = [];
    for (let i = 0; i < arr.length; i++) {
        let obj = arr[i];
        let src = $(obj).attr("src");
        let title = $(obj).attr("alt");
        // console.log(`src:${src}`)
        //console.log($title)
        imgData.push({
            src, title
        })
    }
    return imgData;
}

function downloadImage(imgData) {
    imgData.forEach(imgObj => {
// console.log(imgObj)
        http.get(imgObj.src, res => {
            let imgPath = path.join("album", imgObj.title + path.extname(imgObj.src));
            // console.log(imgObj.title)
            let writeStream = fs.createWriteStream(imgPath);
            res.pipe(writeStream)
        })
    })
}