const { Given, When, Then, After, AfterStep, BeforeAll} = require('@cucumber/cucumber');
const assert = require('assert');
const Home = require('./../pageobjects/Home');
const Login = require('./../pageobjects/sfloginpage.js');
const NamespaceLogin = require('./../pageobjects/customlogin.js');
const Parent = require('./../pageobjects/Parent');
const Community = require('./../pageobjects/Community');
let count = 0; 
// BACKGROUND

BeforeAll(async ()=>{
    await browser.maximizeWindow()
    await browser.url('https://calendar.google.com/');
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
        await browser.pause(2000)
    }
    await browser.url(tileurl)
    // const loginButton = await Home.loginbutton;   
    // await loginButton.isClickable(); 
    // await loginButton.click();
    assert(expect(browser).toHaveUrlContaining('s/login/'))
    await Login.changepage(); 
    assert(expect(browser).toHaveUrlContaining('my.salesforce.com'));
    await NamespaceLogin.login(); 
    await browser.pause(5000)
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
    else if(event_type==='Agenda'||event_type==='Child'){
        if(component==='Upcoming'){
            if(Page==='Row'){
                let banner = await Home.row_upparentbanner; 
                let isthere = await banner.isDisplayed(); 
                while(isthere === false){
                    let next = await Home.upnext; 
                    await next.isClickable(); 
                    await next.click(); 
                    await browser.pause(1000);
                    isthere = await banner.isDisplayed(); 
                }
                const temp = await banner.$('..');
                const anchor = await temp.$('./ancestor::a')
                await anchor.isClickable(); 
                await anchor.click();
                await browser.pause(4000)
            }
            else if(Page==='Tile'){
                let banner = await Home.tile_upparentbanner; 
                let isthere = await banner.isDisplayed(); 
            while(isthere ===false){
                    let next = await Home.upnext; 
                    await next.isClickable(); 
                    await next.click(); 
                    await browser.pause(1000);
                    isthere = await banner.isDisplayed(); 
                }
                let temp = await banner.$('..');
                temp = await temp.$('..');
                const anchor = await temp.$('./descendant::a')
                await anchor.isClickable(); 
                await anchor.click();
                await browser.pause(4000)
            }
            assert(expect(browser).toHaveUrlContaining('ah-parent-event'));
        }
        else if(component==='Previous'){
            let ondemandtab = await Home.ondemandTab; 
            await browser.pause(1500);
            await ondemandtab.isClickable();
            await ondemandtab.click(); 
            await browser.pause(3000);
            if(Page==='Row'){
                let banner = await Home.row_prevparentbanner; 
                let isthere = await banner.isDisplayed(); 
                while(isthere === false){
                    let next = await Home.prevnext; 
                    await next.isClickable(); 
                    await next.click(); 
                    await browser.pause(1000);
                    isthere = await banner.isDisplayed(); 
                }
                const temp = await banner.$('..');
                const anchor = await temp.$('./ancestor::a')
                await anchor.isClickable(); 
                await anchor.click();
                await browser.pause(4000)
            }
            else if(Page==='Tile'){
                let banner = await Home.tile_prevparentbanner; 
                let isthere = await banner.isDisplayed(); 
            while(isthere ===false){
                    let next = await Home.prevnext; 
                    await next.isClickable(); 
                    await next.click(); 
                    await browser.pause(1000);
                    isthere = await banner.isDisplayed(); 
                }
                let temp = await banner.$('..');
                temp = await temp.$('..');
                const anchor = await temp.$('./descendant::a')
                await anchor.isClickable(); 
                await anchor.click();
                await browser.pause(4000)
            }
            assert(expect(browser).toHaveUrlContaining('ah-parent-event'));
        }

        if(component==='Previous'){
            const onDemandTab = await Parent.ondemandTab; 
            await onDemandTab.isClickable(); 
            await onDemandTab.click(); 
            await browser.pause(3000);
        }
    }  
    else if(event_type ==='Related' || event_type === 'eventDescription'){
        const event = await Home.tile_upcommunityevent; 
        const anchor = await event.$('./../a');
        await anchor.isClickable(); 
        await anchor.click(); 
        await browser.pause(4000)
    }

})
When('{} {} {} ::: user {}', async function recurs (component, Page, event_type, type){

    let fav; 

    if(event_type==='Agenda'){
        fav = await Parent.agenda_fav;
    }
    else if(event_type==='Related'){
        fav = await Community.related_fav;
    }
    else if(event_type==='eventDescription'){
        fav = await Community.desc_fav; 
    }
    else if(event_type==='Child'){
        if(Page==='Tile'){
            if(component === 'Upcoming'){
                fav = await Parent.tile_upfavbutton;
            }
            else if(component === 'Previous'){
                fav = await Parent.tile_prevfavbutton;
            }
        }
        else if(Page==='Row'){
            if(component==='Upcoming'){
                fav = await Parent.row_upfavbutton;
            }
            else if(component==='Previous'){
                fav = await Parent.row_prevfavbutton; 
            }
        }
    }
    else if(component==='Upcoming'){
        if(Page==='Tile'){
            if(event_type==='Community'){
                while(fav===undefined){
                    let tile = await Home.tile_upcommunityevent
                    let found = await tile.isDisplayed(); 
                    if(found===false){
                        const nextbutton = await Home.upnext; 
                        await nextbutton.isClickable(); 
                        await nextbutton.click(); 
                        await browser.pause(1000)

                    }
                    let temp = await tile.$('./ancestor::c-ah-_-event-tile'); 
                    fav = await temp.$('./descendant::c-ah-_-favourite-button')
                }
            }
            else if(event_type==='Parent'){
                while(fav===undefined){
                    let tile = await Home.tile_upparentbanner;
                    let found = await tile.isDisplayed(); 
                    if(found===false){
                        const nextbutton = await Home.upnext; 
                        await nextbutton.isClickable(); 
                        await nextbutton.click(); 
                        await browser.pause(1000)

                    }
                    let temp = await tile.$('./ancestor::c-ah-_-event-tile'); 
                    fav = await temp.$('./descendant::c-ah-_-favourite-button')
                }
            }
        }
        else if(Page==='Row'){
            if(event_type==='Community'){
                while(fav===undefined){
                    let tile = await Home.row_upcommunityevent
                    let found = await tile.isDisplayed(); 
                    if(found===false){
                        const nextbutton = await Home.upnext; 
                        await nextbutton.isClickable(); 
                        await nextbutton.click(); 
                        await browser.pause(1000)

                    }
                    let temp = await tile.$('./ancestor::c-ah-_-event-row'); 
                    fav = await temp.$('./descendant::c-ah-_-favourite-button')
                }
               
            }
            
            else if(event_type==='Parent'){
                while(fav===undefined){
                    let tile = await Home.row_upparentbanner
                    let found = await tile.isDisplayed(); 
                    if(found===false){
                        const nextbutton = await Home.upnext; 
                        await nextbutton.isClickable(); 
                        await nextbutton.click(); 
                        await browser.pause(1000)

                    }
                    let temp = await tile.$('./ancestor::c-ah-_-event-row'); 
                    fav = await temp.$('./descendant::c-ah-_-favourite-button')
                }
          
            }   
        }

    }

    else if(component==='Previous'){
        
        if(Page==='Tile'){
            if(event_type==='Community'){
                while(fav===undefined){
                    let tile = await Home.tile_prevcommunityevent;  
                    let found = await tile.isDisplayed(); 
                    if(found===false){
                        const nextbutton = await Home.prevnext; 
                        await nextbutton.isClickable(); 
                        await nextbutton.click(); 
                        await browser.pause(1000)

                    }
                    let temp = await tile.$('./ancestor::c-ah-_-event-tile'); 
                    fav = await temp.$('./descendant::c-ah-_-favourite-button')
                }
            }
            if(event_type==='Parent'){
                while(fav===undefined){
                    let tile = await Home.tile_prevparentbanner; 
                    let found = await tile.isDisplayed(); 
                    if(found===false){
                        const nextbutton = await Home.prevnext; 
                        await nextbutton.isClickable(); 
                        await nextbutton.click(); 
                        await browser.pause(1000)

                    }
                    let temp = await tile.$('./ancestor::c-ah-_-event-tile'); 
                    fav = await temp.$('./descendant::c-ah-_-favourite-button')
                }

            }
        }
        else if(Page==='Row'){
            if(event_type==='Community'){
                while(fav===undefined){
                    let tile = await Home.row_prevcommunityevent
                    let found = await tile.isDisplayed(); 
                    if(found===false){
                        const nextbutton = await Home.prevnext; 
                        await nextbutton.isClickable(); 
                        await nextbutton.click(); 
                        await browser.pause(1000)

                    }
                    let temp = await tile.$('./ancestor::c-ah-_-event-row'); 
                    fav = await temp.$('./descendant::c-ah-_-favourite-button')
                }
                
            }
        
            else if(event_type==='Parent'){
                while(fav===undefined){
                    let tile = await Home.row_prevparentbanner; 
                    let found = await tile.isDisplayed(); 
                    if(found===false){
                        const nextbutton = await Home.prevnext; 
                        await nextbutton.isClickable(); 
                        await nextbutton.click(); 
                        await browser.pause(1000)

                    }
                    let temp = await tile.$('./ancestor::c-ah-_-event-row'); 
                    fav = await temp.$('./descendant::c-ah-_-favourite-button')
                }
            }
        }
     }
    
    ///clicks favorite button
    if(type==='favorites'){
        let button; 
        if(event_type==="eventDescription"){
            button = await fav.$('./descendant::button[@data-id="ah-watchlist-button"]');
        }
        else{
            button = await fav.$('./descendant::button[@data-gather="favorite-icon-btn"]');
        }
        let datasaved = await button.isClickable(); 
        datasaved = await button.getAttribute('data-is-saved');
        console.log('>>>', datasaved)
        if(datasaved==='true'){
            await fav.isClickable(); 
            await fav.click();
            await browser.pause(1500);
        }
        await fav.click();
        await browser.pause(2000)
        datasaved = await button.getAttribute('data-is-saved');
        console.log('>>>', datasaved)
        assert(datasaved==='true');
    }
    else if(type==='unfavorites'){
        let button; 
        if(event_type==="eventDescription"){
            button = await fav.$('./descendant::button[@data-id="ah-watchlist-button"]');
        }
        else{
            button = await fav.$('./descendant::button[@data-gather="favorite-icon-btn"]');
        }
        let datasaved = await button.isClickable(); 
        datasaved = await button.getAttribute('data-is-saved');
        console.log('>>>', datasaved)
        if(datasaved==='false'){
            await fav.isClickable(); 
            await fav.click();
            await browser.pause(1500);
        }
        await fav.click();
        await browser.pause(1500)
        datasaved = await button.getAttribute('data-is-saved');
        console.log('>>>', datasaved)
        assert(datasaved==='false'); 
    }
    
})

After(async(scenario)=>{
    if(scenario.result.status===6){
        let title = count + " - ss.png"
        await browser.saveScreenshot('./allure-results/'+title);
        count = count + 1;
    }
});