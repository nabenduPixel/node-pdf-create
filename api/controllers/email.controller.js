const fs = require("fs").promises;
const path = require("path");
const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");
let ejs = require("ejs");
const fsSync = require("fs");
const nodemailer = require('nodemailer');
// const chromium = require('chrome-aws-lambda'); // chrome-aws-lambda@10.1.0
// const puppeteer = require('puppeteer-core');   // puppeteer-core@^10.1.0
// const ejs = require('ejs');
// const path = require('path');
// const fs = require('fs/promises'); // For async file operations
// const fsSync = require('fs');      // For synchronous file operations

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
        const html = await ejs.renderFile(templatePath);

        try {
            const transporter = nodemailer.createTransport({
                service: process.env.MAIL_HOST,
                host: process.env.MAIL_HOST,
                port: process.env.EMAIL_PORT,
                auth: {
                    user: process.env.MAIL_USERNAME,
                    pass: process.env.MAIL_PASSWORD
                }
            });

            const browser = await puppeteer.launch({
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(),
                headless: chromium.headless,
                ignoreHTTPSErrors: true,
            });

            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });

            // Generate PDF
            const pdfBuffer = await page.pdf();
            await browser.close();

            const mailOptions = {
                from: process.env.MAIL_USERNAME,
                to: "nabendu.bose@pixelconsultancy.in",
                subject: "Booking Confirmation",
                html: `<p>Here is your booking confirmation.</p>`,
                attachments: [
                    {
                        filename: 'bookingconfirmation.pdf',
                        content: pdfBuffer,
                        contentType: 'application/pdf'
                    }
                ]
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    res.status(500).send('Error sending email');
                } else {
                    console.log('Email sent:', info.response);
                    res.status(200).send('Email sent successfully');
                }
            });

        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while generating the PDF');
        }
    }

    async sendEmailOld(req, res) {
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

    // async sendEmail(req, res) {
    //     const templatePath = path.resolve(__dirname, '../views/emailTemplate.ejs');
    //     const filename = `email_${Date.now()}.pdf`;
    //     const storageDir = path.resolve(__dirname, '../storage');
    //     const outputPath = path.join(storageDir, filename);
    //     try {
    //         if (!fsSync.existsSync(storageDir)) {
    //             fsSync.mkdirSync(storageDir, { recursive: true });
    //         }
    //         const html = await ejs.renderFile(templatePath);
    //         const browser = await puppeteer.launch({
    //             args: chromium.args,
    //             defaultViewport: chromium.defaultViewport,
    //             executablePath: await chromium.executablePath(),
    //             headless: chromium.headless,
    //             ignoreHTTPSErrors: true,
    //         });
    //         const page = await browser.newPage();
    //         await page.setContent(html, { waitUntil: 'networkidle0' });
    //         const pdfBuffer = await page.pdf({
    //             format: 'A4',
    //         });
    //         await fs.writeFile(outputPath, pdfBuffer);
    //         await browser.close();
    //         res.json({ message: 'PDF generated successfully', path: `/storage/${filename}` });
    //     } catch (error) {
    //         console.error('Error generating PDF:', error);
    //         res.status(500).send('An error occurred while generating the PDF.');
    //     }
    // }


}

module.exports = new Email();