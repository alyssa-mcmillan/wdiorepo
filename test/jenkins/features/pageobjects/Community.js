const Page = require('.\\..\\pageobjects\\page.js')

    class Community extends Page {
        
        ///////////
        //RELATED//
        
        //////////
        get related_cal() {return $('//gather-ah_-related-events/c-ah-_-event-tile/div/div/c-ah-_-event-action-menu/c-ah-_-calendar-button/lightning-button-menu/button');}
        get related_cal_drop() {return $('//gather-ah_-related-events/c-ah-_-event-tile/div/div/c-ah-_-event-action-menu/c-ah-_-calendar-button/lightning-button-menu/div');}
        get related_cal_outlook_iOS() {return $('//slot/lightning-menu-item[1]/a');}
        get related_cal_google() {return $('//slot/lightning-menu-item[2]/a');}
        get related_fav() {return $('//gather-ah_-related-events/c-ah-_-event-tile/div/div/c-ah-_-event-action-menu/c-ah-_-favourite-button');}
        
        ///////////////
        //DESCRIPTION//
        //////////////

        get desc_fav() {return $('//gather-ah_-event-description/div[2]/div[2]/c-ah-_-favourite-button');}
        get desc_cal() {return $('//gather-ah_-event-description/div/div/c-ah-_-calendar-button/lightning-button-menu/button');}
        get desc_cal_drop() {return $('//gather-ah_-event-description/div/div/c-ah-_-calendar-button/lightning-button-menu/div');}
        get desc_cal_outlook_iOS() {return $('//gather-ah_-event-description/div/div/c-ah-_-calendar-button/lightning-button-menu/div/div/slot/lightning-menu-item[1]/a');}
        get desc_cal_google() {return $('//gather-ah_-event-description/div/div/c-ah-_-calendar-button/lightning-button-menu/div/div/slot/lightning-menu-item[2]/a');}

        ////////////////
        //REGISTRATION//
        ///////////////

        get playerwrapper_regbutton() {return $('//gather-ah_-player-placeholders/div/div/div/c-ah-_-register-button')}; 
        get related_regbutton() {return $('//gather-ah_-related-events/c-ah-_-event-tile/div/div/div/div/c-ah-_-register-button');}
        get related_regbutton_plural() {return $$('//gather-ah_-related-events/c-ah-_-event-tile/div/div/div/div/c-ah-_-register-button')}
        
        /////////////////
        //PLAYERWRAPPER//
        /////////////////
        
        get gatherproxy() {return $('//gather-ah_-proxy-player/div/iframe')}
        get ytiframe() {return $('//iframe[@class="player"]');}
        get viframe() {return $('//iframe[contains(@src, "player.vimeo")]');}
        get audioplay() {return $('//button[@class="slds-button ah-audio-action-button"]')}
        get audioscreen() {return $('//div[@class="ah-audio-container"]/div[1]')}
        get audioplayer() {return $('//audio')}
        get videoiframe() {return $('//gather-ah_-video-viewer/descendant::iframe');}

        ///NOTIFICATION///
        //////////////////

        get notification() {return $('//a[contains(@class, "ah-notification-link")]')}

        open() {

            super.open('*.force.com/ato/s/ah-community-event/*');

        }


    }

module.exports = new Community();   

