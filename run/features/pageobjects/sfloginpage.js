const { parseExpectedArgs } = require('commander');
const Page = require('./../pageobjects/page.js')

    class Login extends Page {

        get employeelogin() {return $('//div[@class="employeeLoginLink salesforceIdentityEmployeeLoginLink2"]/a');}

        async changepage(){
            await expect(browser).toHaveUrlContaining('s/login/');
            await browser.pause(1000);
            await(await this.employeelogin).isClickable(); 
            await(await this.employeelogin).click(); 
        }

        open() {
            return super.open('*.force.com/ato/s/login/*');
        }

    }

module.exports = new Login();