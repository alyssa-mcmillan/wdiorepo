const Page = require('.\\..\\pageobjects\\page.js')

    class Engagement extends Page {
        
        get eventnames() {return $('')}

        open() {

            super.open('*.lightning.force.com/lightning/o/gather__ah_Gather_Event_Statistic__c/');

        }


    }

module.exports = new Engagement();   

