
/*
2
Create and export a module with class "LoginPage".
3
This class behaves as a Child class, which contains the selectors of Login page UI elements required for the test automation scenarios.
4
This module can be imported and called from Step Definitions to access the UI elements.
5
*/

const Page = require('C:\\Users\\AlyssaMcMillan\\work\\traction-rec-integrations\\gtest\\node_modules\\.bin\\features\\pageobjects\\page.js')

    class Parent extends Page {

        get ondemandTab() {return $('//a[@title="On Demand"]');}
        get myeventsTab() {return $('//a[@title="My Events"]');}
        get tile_upcominganchor() {return $('//gather-ah_-upcoming-events/c-ah-_-event-pagination/div/div/div/c-ah-_-event-tile/div/a');}
        get row_upcominganchor() {return $('//gather-ah_-upcoming-events/c-ah-_-event-pagination/div/div/c-ah-_-event-row/div/div/a');}
      
        ///AGENDA///
        get agenda_cal() {return $('//c-ah-_-agenda-day-event/div/div/div/c-ah-_-event-action-menu/c-ah-_-calendar-button/lightning-button-menu/button');}
        get agenda_drop() {return $('//c-ah-_-agenda-day-event/div/div/div[2]/c-ah-_-event-action-menu/c-ah-_-calendar-button/lightning-button-menu/div');}
        get agenda_cal_outlook_iOS() {return $('//c-ah-_-agenda-day-event/div/div/div/c-ah-_-event-action-menu/c-ah-_-calendar-button/lightning-button-menu/div/div/slot/lightning-menu-item[1]/a');}
        get agenda_cal_google() {return $('//c-ah-_-agenda-day-event/div/div/div/c-ah-_-event-action-menu/c-ah-_-calendar-button/lightning-button-menu/div/div/slot/lightning-menu-item[2]/a');}
        get agenda_fav() {return $('//c-ah-_-agenda-day-event/div/div/div/c-ah-_-event-action-menu/c-ah-_-favourite-button');}
        ///FAVORITES///
        get tile_prevfavbutton() {return $('//gather-ah_-previous-events/c-ah-_-event-pagination/div[2]/div[2]/div/c-ah-_-event-tile/div/div[1]/c-ah-_-event-action-menu/c-ah-_-favourite-button')}
        get tile_upfavbutton() {return $('//gather-ah_-upcoming-events/c-ah-_-event-pagination/div/div/div/c-ah-_-event-tile/div/div/c-ah-_-event-action-menu/c-ah-_-favourite-button');}
        get row_prevfavbutton() {return $('//gather-ah_-previous-events/c-ah-_-event-pagination/div/div/c-ah-_-event-row/div/div/div/div/c-ah-_-event-action-menu/c-ah-_-favourite-button');}
        get row_upfavbutton() {return $('/html/body/div[3]/div[3]/div/div/div[3]/div/div[3]/div/div/div/gather-ah_-upcoming-events/c-ah-_-event-pagination/div[2]/div[2]/c-ah-_-event-row[2]/div/div[2]/div/div[2]/c-ah-_-event-action-menu/c-ah-_-favourite-button');}
        ///CALENDAR///
        get tile_calendar() {return $('//gather-ah_-upcoming-events/c-ah-_-event-pagination/div/div/div/c-ah-_-event-tile/div/div/c-ah-_-event-action-menu/c-ah-_-calendar-button/lightning-button-menu');}
        get tile_calendardrop() {return $('//gather-ah_-upcoming-events/c-ah-_-event-pagination/div/div/div/c-ah-_-event-tile/div/div/c-ah-_-event-action-menu/c-ah-_-calendar-button/lightning-button-menu/div/div');}
        get tile_cal_google() {return $('//gather-ah_-upcoming-events/c-ah-_-event-pagination/div/div/div/c-ah-_-event-tile/div/div/c-ah-_-event-action-menu/c-ah-_-calendar-button/lightning-button-menu/div/div/slot/lightning-menu-item[2]/a')}
        get tile_cal_outlook_iOS () {return $('//gather-ah_-upcoming-events/c-ah-_-event-pagination/div/div/div/c-ah-_-event-tile/div/div/c-ah-_-event-action-menu/c-ah-_-calendar-button/lightning-button-menu/div/div/slot/lightning-menu-item[1]/a')}
        get row_calendar() {return $('//gather-ah_-upcoming-events/c-ah-_-event-pagination/div/div/c-ah-_-event-row/div/div/div/div/c-ah-_-event-action-menu/c-ah-_-calendar-button/lightning-button-menu/button');}
        get row_calendardrop() {return $('//gather-ah_-upcoming-events/c-ah-_-event-pagination/div/div/c-ah-_-event-row/div/div/div/div/c-ah-_-event-action-menu/c-ah-_-calendar-button/lightning-button-menu/div/div');}
        get row_cal_google() { return $('//gather-ah_-upcoming-events/c-ah-_-event-pagination/div/div/c-ah-_-event-row/div/div/div/div/c-ah-_-event-action-menu/c-ah-_-calendar-button/lightning-button-menu/div/div/slot/lightning-menu-item[2]/a');}
        get row_cal_outlook_iOS() {return $('//gather-ah_-upcoming-events/c-ah-_-event-pagination/div/div/c-ah-_-event-row/div/div/div/div/c-ah-_-event-action-menu/c-ah-_-calendar-button/lightning-button-menu/div/div/slot/lightning-menu-item[1]/a');}     
         ///REGISTRATION///
         get tile_upreg(){return $('//gather-ah_-upcoming-events/c-ah-_-event-pagination/div[2]/div[2]/div/c-ah-_-event-tile/div/div[2]/div/div[2]/c-ah-_-register-button')}
         get tile_prevreg() {return $('//gather-ah_-previous-events/c-ah-_-event-pagination/div[2]/div[2]/div/c-ah-_-event-tile/div/div[2]/div/div[2]/c-ah-_-register-button')}
         get row_prevreg() {return $('//gather-ah_-previous-events/c-ah-_-event-pagination/div[2]/div[2]/c-ah-_-event-row/div/div[2]/div/div[1]/c-ah-_-register-button')}
         get row_upreg(){return $('//gather-ah_-upcoming-events/c-ah-_-event-pagination/div/div/c-ah-_-event-row/div/div/div/div/c-ah-_-register-button')}
         get row_prevreg_plural() {return $$('//gather-ah_-previous-events/c-ah-_-event-pagination/div[2]/div[2]/c-ah-_-event-row/div/div[2]/div/div[1]/c-ah-_-register-button')}
         get row_upreg_plural(){return $$('//gather-ah_-upcoming-events/c-ah-_-event-pagination/div/div/c-ah-_-event-row/div/div/div/div/c-ah-_-register-button')}

         get carousel_parent_regbutton() {return $('//gather-ah_-events-carousel/div/c-ah-_-events-carousel-slide/div/div/div/div/c-ah-_-register-button')}
         get descritpion_parent_regbutton() {return $('//gather-ah_-parent-event-description/div/div/div/c-ah-_-register-button');}

         get notification() {return $('//a[contains(@class, "ah-notification-link")]')}
        open() {

            super.open('*/s/ah-parent-event/*');

        }

    }

module.exports = new Parent();

