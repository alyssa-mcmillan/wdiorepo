const { Given, When, Then, After, AfterAll, BeforeAll } = require('@cucumber/cucumber');
const { find } = require('lodash');
const assert = require('assert');
const Home = require('./../pageobjects/Home');
const Login = require('./../pageobjects/sfloginpage.js');
const NamespaceLogin = require('./../pageobjects/customlogin.js');
const Parent = require('./../pageobjects/Parent');
const Community = require('./../pageobjects/Community');
const fs = require('fs');
const glob = require('glob');
const { exec } = require("child_process");
const output = exec('ls', {encoding: 'utf-8'});

let count = 0; 

exec("ls -la", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});
////////////////////
//BEFORE ALL TESTS//
////////////////////

BeforeAll(async ()=>{

    browser.url('https://calendar.google.com/');
    const userinput = await $('//*[@id="identifierId"]')
    var inputdisplayed = await userinput.isDisplayed(); 
    if(inputdisplayed === true){
        await userinput.setValue('tractiongatherqa@gmail.com');
        const usernextbutton = await $('//*[@id="identifierNext"]/div/button');
        await usernextbutton.click(); 
        await browser.pause(2000);
        const passinput = await $('//*[@id="password"]/div[1]/div/div[1]/input');
        await passinput.setValue('ConnectionCollection')
        const passnextbutton = await $('//*[@id="passwordNext"]/div/button');
        await passnextbutton.click(); 
    }

    await Home.open(); 
    const loginButton = await Home.loginbutton;   
    await loginButton.isClickable(); 
    await loginButton.click();
    assert(expect(browser).toHaveUrlContaining('s/login/'))
    await Login.changepage(); 
    assert(expect(browser).toHaveUrlContaining('my.salesforce.com'));
    await NamespaceLogin.login(); 
    assert(expect(browser).toHaveUrlContaining('.force.com'));
})

//////////////
//BACKGROUND//
/////////////

Given("user is logged in", async () => {
    await browser.url(tileurl);
    const usericon = await Home.usericon
    var there = await usericon.isDisplayed()
    assert(there===true)
});

/////////
//STEPS//
/////////

Given('{} {} ::: url is opened', async(event_type, Page)=>{
    if(Page==='Row'){
        await browser.url(rowurl)
        await browser.pause(2000);
    }
    else if(Page==='Tile'){
        await browser.url(tileurl)
        await browser.pause(2000);
    }
    if(event_type==='Community'||event_type==='Parent'){
        assert(expect(browser).toHaveTitle('Home'));
    }
    else if(event_type==='Agenda'||event_type==='Child'||event_type==='Description' || event_type==='Carousel'){
        if(Page==='Row'){
            let banner; 
            while(banner===undefined){
                banner = await Home.row_upparentbanner;
                let found = await banner.isDisplayed(); 
                if(found===false){
                    const nextbutton = await Home.upnext; 
                    await nextbutton.isClickable(); 
                    await nextbutton.click(); 
                    await browser.pause(1000)
                }
                const temp = await banner.$('..');
                const anchor = await temp.$('./ancestor::a')
                await anchor.isClickable(); 
                await anchor.click();
                await browser.pause(4000)
            }
         }
        else if(Page==='Tile'){
            let banner;
            while(banner===undefined){
                banner = await Home.tile_upparentbanner;
                let found = await banner.isDisplayed(); 
                if(found===false){
                    const nextbutton = await Home.upnext; 
                    await nextbutton.isClickable(); 
                    await nextbutton.click(); 
                    await browser.pause(1000)
                }
                const temp = await banner.$('..')
                const anchor = await temp.$('./descendant::a')
                await anchor.isClickable(); 
                await anchor.click();
                await browser.pause(4000)
            }
        }
        assert(expect(browser).toHaveUrlContaining('ah-parent-event'));
    }  
    else if(event_type ==='Related' || event_type === 'eventDescription'){

            let anchor = await Home.tile_upcommunityevent; 
            anchor = await anchor.$('./../a')
            await anchor.isClickable(); 
            await anchor.click();
            await browser.pause(3000)
        
        assert(expect(browser).toHaveUrlContaining('ah-community-event'));
    }
})
Then('{} {} ::: calendar is displayed', async(event_type, Page)=>{
    let calendar; 

    if(event_type==='Agenda'){
        calendar = await Parent.agenda_cal;
    }
    else if(event_type==='Related'){
        calendar = await Community.related_cal;
    }
    else if(event_type==='eventDescription'){
        calendar = await Community.desc_cal;
    }
    else if(event_type==='Child'){
        if(Page==='Tile'){
                calendar = await Parent.tile_calendar;
        }
        else if(Page==='Row'){
            calendar = await Parent.row_calendar;
        }
    }
    else if(event_type==='Community'){
        if(Page==='Row'){
            calendar = await Home.row_com_calendar
        }
        else if(Page==='Tile'){
            calendar = await Home.tile_com_calendar;
        }

    }
    else if(event_type==='Parent'){
        if(Page==='Row'){
            while(calendar===undefined){
                calendar = await Home.row_par_calendar
                let found = await calendar.isDisplayed(); 
                if(found===false){
                    const nextbutton = await Home.upnext; 
                    await nextbutton.isClickable()
                    await nextbutton.click(); 
                    await browser.pause(1000)
                }
            }
            
        }
        else if(Page==='Tile'){
            while(calendar===undefined){
                calendar = await Home.tile_par_calendar; 
                let found = await calendar.isDisplayed(); 
                if(found===false){
                    const nextbutton = await Home.upnext; 
                    await nextbutton.isClickable(); 
                    await nextbutton.click(); 
                    await browser.pause(1000)
                }
            }
        }
    }
    else if(event_type==='Favorites'){
        const faves = await Home.allfaves; 
        const arefaves = faves.length; 
        if(arefaves<0){
            let temp = await Home.tile_upcommunityevent; 
            temp = await temp.$('./descendant::c-ah-_-favourite-button')
            temp = await temp.$('./descendant::button');
            await temp.isClickable(); 
            await temp.click(); 
            await browser.pause(1500);
        }


        calendar = await Home.fav_calendar; 
    }
   
    
    
    await calendar.isClickable(); 
    await calendar.click(); 
    await browser.pause(2000)


}); 
Then('{} {} ::: drop down shows', async (event_type, Page) => {
    let calendar; 
    if(event_type==='Child'){
        if(Page==='Tile'){
            calendar = await Parent.tile_calendardrop;

        }
        else if(Page==='Row'){
            calendar = await Parent.row_calendardrop;
        }
    }

    else if(event_type==='Community' || event_type==='Parent'){

        if(Page==='Tile'){
            calendar = await Home.tile_calendardrop;
        }
        else if(Page==='Row'){
            calendar = await Home.row_calendardrop;
        }
    }
    else if(event_type === 'Agenda'){
        calendar = await Parent.agenda_drop; 
    }
    else if(event_type === 'Favorites'){
        calendar = await Home.fav_cal_drop;
    }
    else if(event_type === 'Related'){
        calendar = await Community.related_cal_drop; 
    }
    else if(event_type==='eventDescription'){
        calendar = await Community.desc_cal_drop;
    }
    else if(event_type==='Favorites'){
        calendar = await Home.fav_cal_drop;
    }

    const downdisplay = await calendar.isDisplayed(); 
    assert(downdisplay===true);

});
When('{} {} ::: user selects {}', async (event_type, Page, calendar_type) =>{
    let calendar; 
    if(event_type==='Child'){
        if(Page==='Tile'){
            if(calendar_type==='iOS/Outlook'){
                calendar = await Parent.tile_cal_outlook_iOS
            }
            else if(calendar_type==='Google Calendar'){
                calendar = await Parent.tile_cal_google; 
            }
        }
        else if(Page==='Row'){
            if(calendar_type==='iOS/Outlook'){
                calendar = await Parent.row_cal_outlook_iOS
            }
            else if(calendar_type==='Google Calendar'){
                calendar = await Parent.row_cal_google; 
            }
        }
    }
    else if(event_type==='Community'||event_type==='Parent'){
        if(Page==='Tile'){
            if(calendar_type==='iOS/Outlook'){
                calendar = await Home.tile_cal_outlook_iOS
            }
            else if(calendar_type==='Google Calendar'){
                calendar = await Home.tile_cal_google;
            }
        }
        else if(Page==='Row'){
            if(calendar_type==='iOS/Outlook'){
                calendar = await Home.row_cal_outlook_iOS
            }
            else if(calendar_type==='Google Calendar'){
                calendar = await Home.row_cal_google; 
            }
        }
    }
    else if(event_type==='Agenda'){
        if(calendar_type === 'iOS/Outlook'){
            calendar = await Parent.agenda_cal_outlook_iOS
        }
        else if(calendar_type === 'Google Calendar'){
            calendar = await Parent.agenda_cal_google; 
        }
    }
    else if(event_type==='Favorites'){
        if(calendar_type==='iOS/Outlook'){
            calendar = await Home.fav_cal_outlook_iOS
        }
        else if(calendar_type==='Google Calendar'){
            calendar = await Home.fav_cal_google; 
        }        
    }
    else if(event_type==='Related'){
        if(calendar_type==='iOS/Outlook'){
            calendar = await Community.related_cal_outlook_iOS
        }
        else if(calendar_type==='Google Calendar'){
            calendar = await Community.related_cal_google; 
        }
    }
    else if(event_type==='eventDescription'){
        if(calendar_type==='Google Calendar'){
            calendar = await Community.desc_cal_google
        }
        else if(calendar_type==='iOS/Outlook'){
            calendar = await Community.desc_cal_outlook_iOS
        }
    }
    else if(event_type==='Favorites'){
        if(calendar_type==='iOS/Outlook'){
            calendar = await Home.fav_cal_outlook_iOS;
        }
        else if(calendar_type==='Google Calendar'){
            calendar = await Home.fav_cal_google;
        }
    }

    await calendar.isClickable(); 
    await calendar.click(); 
    await browser.pause(2000)

});
Then('{} {} ::: {} is downloaded', async (event_type, Page, calendar_type) => {
    if(calendar_type==='iOS/Outlook'){
        var fileexists = fs.access('temp/*', fs.constants.F_OK, (exists) => {
           assert((exists ? 'Found' : 'Not Found')==='Found');     
        })

        
    }
    else if(calendar_type==='Google Calendar'){
        await browser.pause(1000)
        const handles = await browser.getWindowHandles();
        console.log('>>>' + handles.length)
        await browser.switchToWindow(handles[1]);
        const savebutton = await $('/html/body/div/div/div/div/div/div/div/div/div/div[@id="xSaveBu"]');
        assert(expect(browser).toHaveUrlContaining('google.com'));
        await savebutton.isClickable(); 
        await savebutton.click();
        await browser.pause(2000);
        const savenotif = await $('/html/body/div/div/div[@class="VYTiVb"]');
        var notifdisplayed = await savenotif.isDisplayed(); 
        assert(notifdisplayed===true)
        await browser.closeWindow(); 
        await browser.switchToWindow(handles[0]);
    }
});
Then('{} {} ::: delete {} download', (event_type, Page, calendar_type)=>{
    if(calendar_type==='iOS/Outlook'){

        const { exec } = require("child_process");

        exec("cd C:/Users/AlyssaMcMillan/Downloads && del /f download*", (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
    }
});

After(async(scenario)=>{
    if(scenario.result.status===6){
        let title = count + " - ss.png"
        await browser.saveScreenshot('./allure-results/'+title);
        count = count + 1;
    }
});


///////////////////
//AFTER ALL TESTS//
///////////////////
