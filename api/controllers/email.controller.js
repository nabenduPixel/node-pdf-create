// const fs = require("fs").promises;
// const path = require("path");
// const chromium = require("@sparticuz/chromium");
// const puppeteer = require("puppeteer-core");
// let ejs = require("ejs");
// const fsSync = require("fs");
const chromium = require('chrome-aws-lambda'); // chrome-aws-lambda@10.1.0
const puppeteer = require('puppeteer-core');   // puppeteer-core@^10.1.0
const ejs = require('ejs');
const path = require('path');
const fs = require('fs/promises'); // For async file operations
const fsSync = require('fs');      // For synchronous file operations

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





    async sendEmailold(req, res) {
        const templatePath = path.resolve(__dirname, '../views/emailTemplate.ejs');
        const filename = `email_${Date.now()}.pdf`;
        const storageDir = path.resolve(__dirname, '../storage'); 
        const outputPath = path.join(storageDir, filename); 
        try {
            if (!fsSync.existsSync(storageDir)) {
                fsSync.mkdirSync(storageDir, { recursive: true });
            }
            const html = await ejs.renderFile(templatePath);
            const browser = await puppeteer.launch({
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(),
                headless: chromium.headless,
                ignoreHTTPSErrors: true,
            });
<<<<<<< HEAD
=======

            // Create a new page in the browser
>>>>>>> b0899d80e23249adfcb0a3c4292aad54d025bf42
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });
            const pdfBuffer = await page.pdf();

            await fs.writeFile(outputPath, pdfBuffer);
            await browser.close();
            res.json({ message: 'PDF generated successfully', path: `/storage/${filename}` });


        } catch (error) {
            console.error('Error generating PDF:', error);
            res.status(500).send('An error occurred while generating the PDF.');
        }
    }

    async sendEmail(req, res) {
        const templatePath = path.resolve(__dirname, '../views/emailTemplate.ejs');
        const filename = `email_${Date.now()}.pdf`;
        const storageDir = path.resolve(__dirname, '../storage');
        const outputPath = path.join(storageDir, filename);

        try {
            // Check if the storage directory exists, and create it if not
            if (!fsSync.existsSync(storageDir)) {
                fsSync.mkdirSync(storageDir, { recursive: true });
            }

            // Render the EJS template into HTML
            const html = await ejs.renderFile(templatePath);

            // Launch Puppeteer with chrome-aws-lambda configuration
            const browser = await puppeteer.launch({
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(), // Ensure to use the correct executable path
                headless: chromium.headless,
                ignoreHTTPSErrors: true,
            });

            // Create a new page in Puppeteer
            const page = await browser.newPage();
            // Set the content of the page with the rendered HTML
            await page.setContent(html, { waitUntil: 'networkidle0' });

            // Generate the PDF from the page
            const pdfBuffer = await page.pdf({
                format: 'A4', // Set paper format to A4 or as per requirement
            });

            // Save the PDF buffer to the output file
            await fs.writeFile(outputPath, pdfBuffer);

            // Close the Puppeteer browser
            await browser.close();

            // Respond with the file path of the generated PDF
            res.json({ message: 'PDF generated successfully', path: `/storage/${filename}` });

        } catch (error) {
            console.error('Error generating PDF:', error);
            res.status(500).send('An error occurred while generating the PDF.');
        }
    }


}

module.exports = new Email();