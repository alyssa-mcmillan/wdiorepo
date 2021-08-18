const { parseExpectedArgs } = require('commander');
const Page = require('.\\..\\pageobjects\\page.js')

    class NamespaceLogin extends Page {

        get username() {return $('//input[@class="input r4 wide mb16 mt8 username"]');}
        get password() {return $('//input[@class="input r4 wide mb16 mt8 password"]');}
        get loginbutton() {return $('//input[@class="button r4 wide primary"]');}

        async login(){
            await (await this.username).isEnabled();
            await (await this.username).setValue(globusername);
            await (await this.password).isEnabled();
            await (await this.password).setValue(globpassword);
            await (await this.loginbutton).isClickable();
            await (await this.loginbutton).click();
        } 

    open () {
        return super.open('*.my.salesforce.com/*');
    }
}
module.exports = new NamespaceLogin();