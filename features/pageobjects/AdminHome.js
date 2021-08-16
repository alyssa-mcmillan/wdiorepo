const Page = require('C:\\Users\\AlyssaMcMillan\\work\\traction-rec-integrations\\gtest\\node_modules\\.bin\\features\\pageobjects\\page.js')

    class AdminHome extends Page {

        get usericon() {return $('//span[@class="uiImage"]')}




            open() {

            super.open('https://trialectic-power.lightning.force.com/lightning/page/home');







        }

    }

module.exports = new AdminHome();

