const fs = require("fs");
const path = require("path");
const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");
let ejs = require("ejs");

class Email {

    async sendEmail(req,res) {
        // const html = fs.readFileSync(path.resolve("../views/emailTemplate.ejs"), "utf8");
        const templatePath = path.join(__dirname, '../views/emailTemplate.ejs');
        const html = await ejs.renderFile(templatePath);
        try {
            const browser = await puppeteer.launch({
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(),
                headless: chromium.headless,
                ignoreHTTPSErrors: true,
            });
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });
            const pdfBuffer = await page.pdf();
            await browser.close();
            res.send(pdfBuffer);

        } catch (error) {
            console.error(error);
            res.send(error);
        }
    }
}

module.exports = new Email();