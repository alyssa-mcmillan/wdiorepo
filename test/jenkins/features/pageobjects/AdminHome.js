const Page = require('.\\..\\pageobjects\\page.js')

    class AdminHome extends Page {

        get usericon() {return $('//span[@class="uiImage"]')}




            open() {

            super.open('https://trialectic-power.lightning.force.com/lightning/page/home');







        }

    }

module.exports = new AdminHome();

