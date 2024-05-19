const puppeteer = require('puppeteer');
require("dotenv").config();
const EMAIL = process.env.EMAIL;
const PASS = process.env.PASS;
console.log(EMAIL);
console.log(PASS);

// console.log(process.env.EMAIL,process.env.PASS)
const scrape = async(res) =>{
    const browser = await puppeteer.launch({
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            // "--single-process",
            "--no-zygote",
          ],
        headless: true,
        defaultViewport: null,  
        executablePath:
            process.env.NODE_ENV === "production"
            ? process.env.PUPPETEER_EXECUTABLE_PATH
            : puppeteer.executablePath(),
    });

    try{

    const page = await browser.newPage();
    await page.setViewport({width: 1366, height: 768});
    await page.setDefaultNavigationTimeout(60000);
    await page.goto('https://www.soliscloud.com/#/homepage',{ waitUntil: 'load' });

    await page.type("form.el-form.form > div.username > div > div > div.el-input > input",EMAIL);
    await page.type("form.el-form.form > div.el-form-item.el-form-item--small > div > div > input",PASS);
    await page.click(".el-checkbox__inner");
    await page.click(".login-btn > button",{ waitUntil: 'load' });
    await page.waitForNavigation({
      waitUntil: 'networkidle0',  
    }); 
    
    // Get page data
    const data = await page.evaluate(() => {
        // Fetch the first element with class "#station"
        const quote = document.querySelector("#station");
    
        // Fetch the sub-elements from the previously fetched quote element
        // Get the displayed text and return it (`.innerText`)
        const daily_yield = quote.querySelector("div:nth-child(1) > div.main.af > div.top-info > div > div:nth-child(2) > div > div >div.item1 > span:nth-child(1)").innerText;
        const current_power = quote.querySelector(" div:nth-child(1) > div.main.af > div.top-info > div > div:nth-child(1) > div > div > div.item1 > span:nth-child(1)").innerText;
        const monthly_yield = quote.querySelector(" div:nth-child(1) > div.main.af > div.top-info > div > div:nth-child(3) > div > div > div.item1 > span:nth-child(1)").innerText;
        const result = {current_power,daily_yield,monthly_yield}
    
        return result ;
      });

    res.send(data); 

    } catch(e) {
        console.error(e);
        res.send(`Something went wrong while running Puppeteer: ${e}`);
    
    } finally{
        await browser.close();
    }
}

module.exports = { scrape };
