const { Given, When, Then, After, AfterAll, BeforeAll } = require('@cucumber/cucumber');
const { find } = require('lodash');
const assert = require('assert');
const BasePage = require('features/pageobjects/page.js');
const Home = require('features/pageobjects/Home');
const Login = require('features/pageobjects/sfloginpage.js');
const NamespaceLogin = require('features/pageobjects/customlogin.js');
const Parent = require('features/pageobjects/Parent');
const Community = require('features/pageobjects/Community');
const { homedir } = require('os');

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
        await passinput.setValue('Borderline@2020')
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
    const usericon = await Home.usericon
    var there = await usericon.isDisplayed()
    assert(there===true)
});

/////////
//STEPS//
/////////

Given('{} {} {} ::: url is opened', async(component, Page, event_type)=>{
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
        if(component==='Previous'){
            let ondemandtab = await Home.ondemandTab; 
            await browser.pause(1500);
            await ondemandtab.isClickable();
            await ondemandtab.click(); 
            await browser.pause(3000);
        }
    }
    else if(event_type==='Agenda'||event_type==='Child'||event_type==='Description' || event_type==='Carousel'){
        if(Page==='Row'){
            let banner; 
            while(banner===undefined){
                banner = await Home.row_upparentbanner; 
                let found = await banner.isDisplayed(); 
                if(found===false){
                    const nextbutton = await Home.upnext
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
            banner = await Home.tile_upparentbanner; 
            let temp = await banner.$('..');
            temp = await temp.$('..');
            const anchor = await temp.$('./descendant::a')
            await anchor.isClickable(); 
            await anchor.click();
            await browser.pause(4000)
            }
        }
        assert(expect(browser).toHaveUrlContaining('ah-parent-event'));
        

        if(component==='Previous'){
            const onDemandTab = await Parent.ondemandTab; 
            await onDemandTab.isClickable(); 
            await onDemandTab.click(); 
            await browser.pause(3000);
        }
    }  
    else if(event_type ==='Related' || event_type === 'PlayerWrapper'){
        console.log('<<<')
        if(Page==='Row'){
            const row = await Home.row_communityevents; 
            console.log('>>>',row.length)
            for(var i = 0; i < row.length; i++){
                const isDisplay = await row[i].isDisplayed(); 
                if(isDisplay===true){
                    console.log('<<<')
                    const eventrow = await row[i].$('./ancestor::c-ah-_-event-row');
                    const anchor = await eventrow.$('./descendant::a')
                    await anchor.isClickable(); 
                    await anchor.click(); 
                    await browser.pause(3000);
                    break; 
                }
            }
        }
        else if(Page==='Tile'){
            const anchor = await Home.tile_communityevent; 
            await anchor.isClickable(); 
            await anchor.click();
            await browser.pause(3000)
        }
        assert(expect(browser).toHaveUrlContaining('ah-community-event'));
    }
    

})
When('{} {} {} ::: user {} for event', async(component, Page, event_type, type)=>{

    let reg; 

    if(event_type==='Agenda'){
        reg = await Parent.agenda_fav;
    }
    else if(event_type==='Related'){
        const row = await Community.related_regbutton_plural; 
        for(var i = 0; i < row.length; i++){
            const isDisplay = await row[i].isDisplayed(); 
            if(isDisplay===true){
                reg = await row[i]; 
                break;
            }
        } 
    }
    else if(event_type==='Description'){
        reg = await Parent.descritpion_parent_regbutton;
    }
    else if(event_type==='Child'){
        if(Page==='Tile'){
            if(component === 'Upcoming'){
                reg = await Parent.tile_upreg;
            }
            else if(component === 'Previous'){
                reg = await Parent.tile_prevreg;
            }
        }
        else if(Page==='Row'){
            if(component==='Upcoming'){
                const row = await Parent.row_upreg_plural;
                for(var i = 0; i < row.length; i++){
                    const isDisplay = await row[i].isDisplayed(); 
                    if(isDisplay===true){
                        reg = await row[i]; 
                        break;
                    }
                }    
            }        
            else if(component==='Previous'){
                const row = await Parent.row_prevreg_plural; 
                for(var i = 0; i < row.length; i++){
                    const isDisplay = await row[i].isDisplayed(); 
                    if(isDisplay===true){
                        reg = await row[i]; 
                        break;
                    }
                }
            }
        }
    }
    else if(event_type==='Carousel'){
        reg = await Parent.carousel_parent_regbutton;
    }
    else if(event_type==='PlayerWrapper'){
        reg = await Community.playerwrapper_regbutton; 
    }
    
    ///Child/Parent
    else if(component==='Upcoming'){
        if(Page==='Tile'){
            if(event_type==='Community'){
                reg =  await Home.tile_upcommunityeventreg; 
            }
            if(event_type==='Parent'){
                let tile; 
                if(tile===undefined){
                    tile = await Home.tile_upparentbanner; 
                    const found = await tile.isDisplayed(); 
                    if(found===false){
                        const nextbutton = await Home.upnext;
                        await nextbutton.isClickable(); 
                        await nextbutton.click(); 
                        await browser.pause(1000)
                }
                const temp = await tile.$('./ancestor::c-ah-_-event-tile'); 
                reg = await temp.$('./div/div/div/div/c-ah-_-register-button')
                }
            }
        }
        else if(Page==='Row'){
            if(event_type==='Community'){
                const tile = await $$('//gather-ah_-upcoming-events/c-ah-_-event-pagination/div[2]/div[2]/c-ah-_-event-row/div/div/a/div/div[1][not(contains(text(), "Special Event"))]/ancestor::c-ah-_-event-row/div/div/div[1]/div/c-ah-_-register-button'); 
                for(var i = 0; i < tile.length; i++){
                    const isDisplay = await tile[i].isDisplayed(); 
                    if(isDisplay===true){
                        reg = await tile[i]; 
                        break;
                    }

                     
                }
            }
            else if(event_type==='Parent'){
                let tile; 
                while(tile===undefined){
                    tile = await Home.row_upparentbanner;  
                    let found = await tile.isDisplayed(); 
                    if(found===false){
                        const nextbutton = await Home.upnext; 
                        await nextbutton.isClickable(); 
                        await nextbutton.click(); 
                        await browser.pause(1000);
                    }
                }
                
                const temp = await tile.$('./ancestor::c-ah-_-event-row'); 
                reg = await temp.$('./div/div/div/div/c-ah-_-register-button')
            }
        }

    }
    else if(component==='Previous'){
        
        if(Page==='Tile'){
            if(event_type==='Community'){
                reg = await Home.tile_prevcommunityevenreg; 

            }
            if(event_type==='Parent'){
                let tile; 
                while(tile===undefined){
                    tile = await Home.tile_prevparentbanner
                    let found = await tile.isDisplayed(); 
                    if(found===false){
                        const nextbutton = await Home.prevnext
                        await nextbutton.isClickable(); 
                        await nextbutton.click(); 
                        await browser.pause(1000)
                    } 
                
                const temp = await tile.$('./ancestor::c-ah-_-event-tile'); 
                reg = await temp.$('./descendant::c-ah-_-register-button')
            }
        }
    }



        else if(Page==='Row'){
            if(event_type==='Community'){
                const tile = await $$('//gather-ah_-previous-events/c-ah-_-event-pagination/div[2]/div[2]/c-ah-_-event-row/div/div/a/div/div[1][not(contains(text(), "Special Event"))]/ancestor::c-ah-_-event-row/div/div/div[1]/div/c-ah-_-register-button'); 
                console.log('>>>', tile.length)
                for(var i = 0; i < tile.length; i++){
                    const isDisplay = await tile[i].isDisplayed(); 
                    console.log('>>>',isDisplay)
                    if(isDisplay===true){
                        console.log('... hello')
                        reg = await tile[i]; 
                        break;
                    }

                     
                }
            }
            else if(event_type==='Parent'){
                let tile;
                if(tile===undefined){
                    tile = await Home.row_prevparentbanner;  
                    let found = await tile.isDisplayed(); 
                    if(found===false){
                        const nextbutton = await Home.prevnext; 
                        await nextbutton.isClickable(); 
                        await nextbutton.click(); 
                        await browser.pause(1000)
                    }
                    const temp = await tile.$('./ancestor::c-ah-_-event-row'); 
                    reg = await temp.$('./descendant::c-ah-_-register-button')
                }
            }
        }
    
    }

    if(type==='registers'){
        let button = await reg.$('./descendant::button');
        let buttontext = await button.getText(); 
        if(buttontext.includes('Attending')){
            await reg.isClickable();
            await reg.click();
            await browser.pause(2000)
            const cancel = await reg.$('./descendant::lightning-menu-item[2]')
            await cancel.isClickable(); 
            await cancel.click(); 
            await browser.pause(2000)
        }
        await reg.isClickable();
        await reg.click();
        await browser.pause(3000)
        button = await reg.$('./descendant::button');
        buttontext = await button.getText(); 
        assert(buttontext.includes("Attending")); 
    }
    else if(type==='unregisters'){
        let button = await reg.$('./descendant::button');
        let buttontext = await button.getText(); 
        if(buttontext==='Register'){
            await reg.isClickable();
            await reg.click();
            await browser.pause(3000)
        }
        await reg.isClickable();
        await reg.click(); 
        await browser.pause(2000)
        const cancel = await reg.$('./descendant::lightning-menu-item[2]')
        await cancel.isClickable(); 
        await cancel.click(); 
        await browser.pause(2000)
        button = await reg.$('./descendant::button');
        buttontext = await button.getText(); 
        assert(buttontext==='Register')
    }


})

