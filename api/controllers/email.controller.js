const fs = require("fs");
const path = require("path");
const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");
let ejs = require("ejs");

class Email {
    // async sendEmail(req,res) {
    //     const templatePath = path.join(__dirname, '../views/emailTemplate.ejs');
    //     const html = await ejs.renderFile(templatePath);
    //     try {
    //         const browser = await puppeteer.launch({
    //             args: chromium.args,
    //             defaultViewport: chromium.defaultViewport,
    //             executablePath: await chromium.executablePath(),
    //             headless: chromium.headless,
    //             ignoreHTTPSErrors: true,
    //         });
    //         const page = await browser.newPage();
    //         await page.setContent(html, { waitUntil: 'networkidle0' });
    //         const pdfBuffer = await page.pdf();
    //         await browser.close();
    //         res.send(pdfBuffer);

    //     } catch (error) {
    //         console.error(error);
    //         res.send(error);
    //     }
    // }

    async sendEmail(req, res) {
        const templatePath = path.join(__dirname, '../views/emailTemplate.ejs');

        try {
            // Render the EJS template
            const html = await ejs.renderFile(templatePath);

            // Launch Puppeteer with Chromium
            const browser = await puppeteer.launch({
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(),
                headless: chromium.headless,
                ignoreHTTPSErrors: true,
            });

            // Create a new page in the browser
            const page = await browser.newPage();

            // Set the page content to the rendered HTML
            await page.setContent(html, { waitUntil: 'networkidle0' });

            // Generate a PDF from the page
            const pdfBuffer = await page.pdf();

            // Close the browser
            await browser.close();

            // Send the PDF buffer as a response
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=email.pdf',
            });
            res.send(pdfBuffer);

        } catch (error) {
            console.error('Error generating PDF:', error);
            res.status(500).send('An error occurred while generating the PDF.');
        }
    }

}

module.exports = new Email();