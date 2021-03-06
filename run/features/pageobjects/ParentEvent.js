const Page = require('./../pageobjects/page.js')

    class ParentEvent extends Page {
        
        get newevent() {return $('//a[@title="New"]')}
        get newtitle() {return $('//h2[contains(text(), "New Parent Event")]')}
        get eventname() {return $('//input[@name="Name"]')}
        get startdate() {return $('//input[@name="gather__ah_Start_Datetime__c"]')}
        get enddate() {return $('//input[@name="gather__ah_End_Datetime__c"]')}
        get isvisible() {return $('//input[@name="gather__ah_Visible_in_Community__c"]')}
        get eventdescription() {return $('//textarea[contains(@class, "slds-textarea")]');}
        get eventrich() {return $('//input[@class="slds-rich-text-editor__textarea slds-grid.editor.ql-container"]/p')}
        get savebutton() {return $('//button[@name="SaveEdit"]')}
        get eventstarttime() {return $('//input[@class="slds-input slds-combobox__input" and @name="gather__ah_Start_Datetime__c"]')}
        get eventendtime() {return $('//input[@class="slds-input slds-combobox__input" and @name="gather__ah_End_Datetime__c"]')}
        get recordtitle() {return $('//div[@class="entityNameTitle.slds-line-height--reset"]')}
        get photoupload() {return $('//flexipage-component2[@data-component-id="ah_TileImageUploader"]/descendant::lightning-icon[contains(@class, "slds-icon-utility-upload")]')}
        get uploadbtn() {return $('//flexipage-component2[@data-component-id="ah_TileImageUploader"]/descendant::button[@title="Upload"]')}
   
        open() {

            super.open('*.lightning.force.com/lightning/o/gather__ah_Parent_Event__c');

        }


    }

module.exports = new ParentEvent();


