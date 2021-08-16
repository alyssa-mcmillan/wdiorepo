const Page = require('C:\\Users\\AlyssaMcMillan\\work\\traction-rec-integrations\\gtest\\node_modules\\.bin\\features\\pageobjects\\page.js')

    class Engagement extends Page {
        
        get eventnames() {return $('')}

        open() {

            super.open('*.lightning.force.com/lightning/o/gather__ah_Gather_Event_Statistic__c/');

        }


    }

module.exports = new Engagement();   

