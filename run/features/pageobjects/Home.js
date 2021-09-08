
/*
2
Create and export a module with class "LoginPage".
3
This class behaves as a Child class, which contains the selectors of Login page UI elements required for the test automation scenarios.
4
This module can be imported and called from Step Definitions to access the UI elements.
5
*/

const Page = require('./../pageobjects/page')

    class TileHome extends Page {

        /////FAVORITES///// 
            ////TILE////
            get tile_upcommunityevent() {return $('//tint-ah_-upcoming-events/c-ah-_-event-pagination/div/div/div/c-ah-_-event-tile/div/div[2][not(contains(text(), "Special Event"))]')}
            get tile_prevcommunityevent() {return $('//tint-ah_-previous-events/c-ah-_-event-pagination/div/div/div/c-ah-_-event-tile/div/div[2][not(contains(text(), "Special Event"))]');}
            ////ROW////
            get row_prevcommunityevent() {return $('//tint-ah_-previous-events/c-ah-_-event-pagination/div[2]/div[2]/c-ah-_-event-row/div/div[1]/a/div/div[1][not(contains(text(), "Special Event"))]');}
            get row_upcommunityevent() {return $('//tint-ah_-upcoming-events/c-ah-_-event-pagination/div[2]/div[2]/c-ah-_-event-row/div/div/a/div/div[1][not(contains(text(), "Special Event"))]');}
            get allfaves() {return $$('//tint-ah_-favourite-events/c-ah-_-event-pagination/div/div/div/c-ah-_-event-tile');}
            ///CALENDAR///
            get fav_calendar() {return $('//tint-ah_-favourite-events/c-ah-_-event-pagination/div/div/div/c-ah-_-event-tile/div/div/c-ah-_-event-action-menu/c-ah-_-calendar-button/lightning-button-menu/button');}
            get fav_cal_drop() {return $('//tint-ah_-favourite-events/c-ah-_-event-pagination/div/div/div/c-ah-_-event-tile/div/div/c-ah-_-event-action-menu/c-ah-_-calendar-button/lightning-button-menu/div');}
            get fav_cal_outlook_iOS() {return $('//tint-ah_-favourite-events/c-ah-_-event-pagination/div/div/div/c-ah-_-event-tile/div/div/c-ah-_-event-action-menu/c-ah-_-calendar-button/lightning-button-menu/div/div/slot/lightning-menu-item[1]/a');}
            get fav_cal_google() {return $('//tint-ah_-favourite-events/c-ah-_-event-pagination/div/div/div/c-ah-_-event-tile/div/div/c-ah-_-event-action-menu/c-ah-_-calendar-button/lightning-button-menu/div/div/slot/lightning-menu-item[2]/a');}

            /////CALENDAR/////
            ///ROW///
            get row_com_calendar() {return $('//tint-ah_-upcoming-events/c-ah-_-event-pagination/div/div/c-ah-_-event-row/div/div/a/div/div[not(contains(text(), "Special Event"))]/ancestor::c-ah-_-event-row/div/div/div/descendant::c-ah-_-calendar-button');}
            get row_par_calendar() {return $('//tint-ah_-upcoming-events/c-ah-_-event-pagination/div/div/c-ah-_-event-row/div/div/a/div/div[contains(text(), "Special Event")]/ancestor::c-ah-_-event-row/div/div/div/descendant::c-ah-_-calendar-button');}
            get row_calendardrop() {return $('//tint-ah_-upcoming-events/c-ah-_-event-pagination/div/div/c-ah-_-event-row/div/div/div/div/c-ah-_-event-action-menu/c-ah-_-calendar-button/lightning-button-menu/div');}
            get row_cal_outlook_iOS() {return $('//slot/lightning-menu-item[1]/a');}
            get row_cal_google() {return $('//slot/lightning-menu-item[2]/a');}
            ///TILE///
            get tile_com_calendar(){return $('//tint-ah_-upcoming-events/c-ah-_-event-pagination/div/div/div/c-ah-_-event-tile/div/div[not(contains(text(), "Special Event"))]/descendant::c-ah-_-calendar-button')}
            get tile_par_calendar(){return $('//tint-ah_-upcoming-events/c-ah-_-event-pagination/div/div/div/c-ah-_-event-tile/div/div[contains(text(), "Special Event")]/../descendant::c-ah-_-calendar-button')}
            get tile_calendardrop() {return $('//tint-ah_-upcoming-events/c-ah-_-event-pagination/div/div/div/c-ah-_-event-tile/div/div/c-ah-_-event-action-menu/c-ah-_-calendar-button/lightning-button-menu/button');}
            get tile_cal_outlook_iOS() {return $('//tint-ah_-upcoming-events/c-ah-_-event-pagination/div/div/div/c-ah-_-event-tile/div/div/c-ah-_-event-action-menu/c-ah-_-calendar-button/lightning-button-menu/div/div/slot/lightning-menu-item[1]/a');}
            get tile_cal_google() {return $('//tint-ah_-upcoming-events/c-ah-_-event-pagination/div/div/div/c-ah-_-event-tile/div/div/c-ah-_-event-action-menu/c-ah-_-calendar-button/lightning-button-menu/div/div/slot/lightning-menu-item[2]/a');}

        //////REGISTRATION/////
            get tile_upcommunityeventreg() {return $('//tint-ah_-upcoming-events/c-ah-_-event-pagination/div/div/div/c-ah-_-event-tile/div/div[2][not(contains(text(), "Special Event"))]/descendant::c-ah-_-register-button')}
            get tile_prevcommunityevenreg() {return $('//tint-ah_-previous-events/c-ah-_-event-pagination/div[2]/div[2]/div/c-ah-_-event-tile/div/div[2][not(contains(text(), "Special Event"))]/descendant::c-ah-_-register-button');}

        /////LOGIN//////
            get loginbutton() { return $('/html/body/div/div/div/div/div/div/div/div/div/div/div/div/community_user-user-profile-menu/button');}
            get usericon() {return  $('/html/body/div/div/div/div/div/div/div/div/div/div/div/div/community_user-user-profile-menu/div/button');}     
            
        /////PAGE/////
            get ondemandTab() {return $('//a[@title="On Demand"]');}
            get comingupTab() {return $('//a[@title="Coming Up"]');}
            ///ROW///
            get row_previousanchor() { return $('//tint-ah_-previous-events/c-ah-_-event-pagination/div/div/c-ah-_-event-tile/div/div[2]/a');}
            get row_upcominganchor() { return $('//tint-ah_-upcoming-events/c-ah-_-event-pagination/div/div/c-ah-_-event-tile/div/div[2]/a');}
            get row_upeventrow() {return $$('//tint-ah_-upcoming-events/c-ah-_-event-pagination/div[2]/div[2]/c-ah-_-event-row')}
            get row_preveventrow() {return $$('//tint-ah_-previous-events/c-ah-_-event-pagination/div[2]/div[2]/c-ah-_-event-row')}
            //TILE
            get tile_previousanchor() { return $('//tint-ah_-previous-events/c-ah-_-event-pagination/div/div/div/c-ah-_-event-tile/div/a');}
            get tile_upcominganchor() { return $('//tint-ah_-upcoming-events/c-ah-_-event-pagination/div/div/div/c-ah-_-event-tile/div/a');}
            get tile_upeventtile() {return $$('//tint-ah_-upcoming-events/c-ah-_-event-pagination/div[2]/div/div');}
            get tile_preveventtile() {return $$('//tint-ah_-previous-events/c-ah-_-event-pagination/div[2]/div/div');}

        /////PARENT BANNER/////
            get row_prevparentbanner() {return $('//tint-ah_-previous-events/c-ah-_-event-pagination/div/div/c-ah-_-event-row/div/div/a/div/div[1][contains(text(), "Special Event")]');}
            get row_upparentbanner() {return $('//tint-ah_-upcoming-events/c-ah-_-event-pagination/div/div/c-ah-_-event-row/div/div/a/div/div[contains(text(), "Special Event")]');}
            get tile_upparentbanner() {return $('//tint-ah_-upcoming-events/c-ah-_-event-pagination/div/div/div/c-ah-_-event-tile/div/div[contains(text(), "Special Event")]')}
            get tile_prevparentbanner() {return $('//tint-ah_-previous-events/c-ah-_-event-pagination/div/div/div/c-ah-_-event-tile/div/div[contains(text(), "Special Event")]');}
            get tile_upparentbanner_plural() {return $$('//tint-ah_-upcoming-events/c-ah-_-event-pagination/div/div/div/c-ah-_-event-tile/div/div[contains(text(), "Special Event")]')}
            get tile_prevparentbanner_plural() {return $$('//tint-ah_-previous-events/c-ah-_-event-pagination/div/div/div/c-ah-_-event-tile/div/div[contains(text(), "Special Event")]');}
            
            get row_upcommunityevents() {return $$('//tint-ah_-upcoming-events/c-ah-_-event-pagination/div[2]/div[2]/c-ah-_-event-row/div/div/a/div/div[1][not(contains(text(), "Special Event"))]/ancestor::c-ah-_-event-row/descendant::c-ah-_-register-button')}; 
        ////NEXT BUTTONS////
            get prevnext() {return $('//tint-ah_-previous-events/descendant::button[@name="next"]')}
            get upnext() {return $('//tint-ah_-upcoming-events/descendant::button[@name="next"]')}
        ////NOTIFICATION////
            get notification() {return $('//a[contains(@class, "ah-notification-link")]');}
        ////FILTERS/////    
            get up_hostFilter() {return $('//tint-ah_-upcoming-events/descendant::select[@name="eventHost"]')}
            get prev_hostFilter() {return $('//tint-ah_-previous-events/descendant::select[@name="eventHost"]')}
            get up_eventFilter() {return $('//tint-ah_-upcoming-events/descendant::select[@name="eventType"]')}
            get prev_eventFilter() {return $('//tint-ah_-previous-events/descendant::select[@name="eventType"]')}

            open() {

            super.open('*.force.com/');







        }

    }

module.exports = new TileHome();