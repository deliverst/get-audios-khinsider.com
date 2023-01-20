// details: 
// date: //
// by: deliverst
// todo: 
const fs = require('fs');
const execSync = require('child_process').execSync;
const puppeteer = require('puppeteer');
let link = "https://downloads.khinsider.com/game-soundtracks/album/need-for-speed-underground-2";

(async () => {
    //config puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 })

    await page.goto(link);
    
    const linksSecondToPage = await page.evaluate(function() {
        let listLinksRemplaced = []
        let listLinks = document.querySelectorAll(".playlistDownloadSong a")

        for (let i = 0; i <= listLinks.length - 1; i++) {
            listLinksRemplaced.push(`${listLinks[i]}.href`)
        }

        let regex = '.href'
        return listLinksRemplaced.map(link => link.replace(regex, ''))
    })


    let linksReady = []
    const titleFolder = await page.evaluate(function() {
        return document.getElementsByTagName("h2")[0].innerText
    });


    for (let p = 0; p <= linksSecondToPage.length - 1; p++) {
        await page.goto(`${linksSecondToPage[p]}`);
        const urlMovie = await page.evaluate(function() {
            return document.getElementById("audio").src
        });

        linksReady.push(urlMovie)
        execSync(`wget -qq -P "./media/${titleFolder}" ${urlMovie} `, { encoding: 'utf-8' });
    }

    fs.writeFileSync(`./media/${titleFolder}/links.txt`, `${linksReady.toString().replace(/,/g, '\n')}`)

    browser.close()
})()