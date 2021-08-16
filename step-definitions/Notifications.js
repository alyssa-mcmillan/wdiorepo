const { Given, When, Then, After, AfterAll, BeforeAll } = require('@cucumber/cucumber');
const { find } = require('lodash');
const assert = require('assert');
const BasePage = require('.bin/features/pageobjects/page.js');
const Home = require('.bin/features/pageobjects/Home');
const Login = require('.bin/features/pageobjects/sfloginpage.js');
const NamespaceLogin = require('.bin/features/pageobjects/customlogin.js');
const Parent = require('.bin/features/pageobjects/Parent');
const Community = require('.bin/features/pageobjects/Community');
const ParentEvent = require('.bin/features/pageobjects/ParentEvent');
const CommunityEvent = require('.bin/features/pageobjects/CommunityEvent');
const AdminHome = require('.bin/features/pageobjects/AdminHome');
const { pathToFileURL } = require('url');

const jsforce = require('jsforce');
const fs = require('fs');
const path = require('path');
const { compareDocumentPosition } = require('domutils');
const { formatUndefinedParameterType } = require('@cucumber/cucumber/lib/formatter/helpers/issue_helpers');
let ids;
let eventtitle; 

BeforeAll(async ()=>{
    await browser.maximizeWindow()
    browser.url('https://calendar.google.com/');
    const userInput = await $('//*[@id="identifierId"]')
    var inputdisplayed = await userInput.isDisplayed(); 
    if(inputdisplayed === true){
        await userInput.setValue('tractiongatherqa@gmail.com');
        const userNextButton = await $('//*[@id="identifierNext"]/div/button');
        await userNextButton.click(); 
        await browser.pause(2000);
        const passInput = await $('//*[@id="password"]/div[1]/div/div[1]/input');
        await passInput.setValue('Borderline@2020')
        const passNextButton = await $('//*[@id="passwordNext"]/div/button');
        await passNextButton.click(); 
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
    await browser.url(tileurl)
    await browser.pause(2000)
    const usericon = await Home.usericon
    var there = await usericon.isDisplayed()
    assert(there===true)
});

/////////
//STEPS//
/////////

Given('{} :: events are created', async(notificationtype)=>{
    ids = await addevents(notificationtype);
    console.log('>>>', ids)
});
When('{} :: user opens homepage', async(notificationtype)=>{
    assert(expect(browser).toHaveTitle('Home'));
});
When('{} :: opens community event', async(notificationtype)=>{

    await browser.newWindow(tileurl); 
    await browser.pause(1000)

    const onDemandTab = await Home.ondemandTab; 
    await onDemandTab.isClickable(); 
    await onDemandTab.click(); 
    await browser.pause(6000)

    let event = await Home.tile_prevcommunityevent; 
    event = await event.$('../a')
    await event.isClickable(); 
    await event.click(); 
    await browser.pause(2000)
    assert(expect(browser).toHaveUrlContaining('ah-community-event'))

}); 
When('{} :: opens parent event', async(notificationtype)=>{

    browser.execute((url) => {
        window.open(url);
        }, tileurl);
    await browser.switchWindow(tileurl)
    const onDemandTab = await Home.ondemandTab; 
    await onDemandTab.isClickable(); 
    await onDemandTab.click(); 
    await browser.pause(7000);

    let event = await Home.tile_prevparentbanner;
    let isthere = await event.isDisplayed(); 
    while(isthere === false){
        const next = await Home.prevnext; 
        await next.isClickable();
        await next.click();
        isthere = await event.isDisplayed();  
    }
    event = await event.$('../a');
    await event.isClickable(); 
    await event.click(); 
    await browser.pause(2000);
    assert(expect(browser).toHaveUrlContaining('ah-parent-event'));

});
When('{} :: notification fires', async(notificationtype)=>{
    console.log(ids);
    let today = new Date(); 
    today = today.getTime(); 
    console.log(today);
    console.log(ids[0][1])
    while(today < ids[0][1]){
        await browser.pause(5000)
        today = new Date(); 
        today = today.getTime(); 
        let remaining = (ids[0][1]-today)/1000
        console.log('waiting.... ', remaining)
    }
}); 
Then('{} :: validate is displayed', async(notificationtype)=>{
    await browser.pause(5000);
    let handles = await browser.getWindowHandles();
    for(var i = 0; i < handles.length; i++){
        await browser.switchToWindow(handles[i]); 
        let title = await browser.getTitle(); 
        if(title.indexOf('Parent Event') != -1){
            let notification = await Parent.notification; 
            let isthere = await notification.isDisplayed(); 
            assert(isthere===true);
        }
        else if(title.indexOf('Community Event') != -1){
            let notification = await Community.notification; 
            let isthere = await notification.isDisplayed(); 
            assert(isthere===true);
        }
        else if(title.indexOf('Home') != -1){
            let notification = await Home.notification; 
            let isthere = await notification.isDisplayed(); 
            assert(isthere===true);
        }
    }

});
Then('{} :: user clicks on Notification', async(notificationtype)=>{
    let handles = await browser.getWindowHandles();
    for(var i = 0; i < handles.length; i++){
        await browser.switchToWindow(handles[i]); 
        await browser.pause(1000);
        let title = await browser.getTitle(); 
        if(title.indexOf('Parent Event') != -1){
            let notification = await Parent.notification; 
            eventtitle = await notification.$('./descendant::h2')
            eventtitle = await eventtitle.getText(); 
            await notification.isClickable(); 
            await notification.click(); 
            await browser.pause(2000);
        }
        else if(title.indexOf('Community Event') != -1){
            let notification = await Community.notification; 
            eventtitle = await notification.$('./descendant::h2')
            eventtitle = await eventtitle.getText(); 
            await notification.isClickable(); 
            await notification.click(); 
            await browser.pause(2000);
        }
        else if(title.indexOf('Home') != -1){
            let notification = await Home.notification;
            eventtitle = await notification.$('./descendant::h2')
            eventtitle = await eventtitle.getText(); 
            await notification.isClickable(); 
            await notification.click(); 
            await browser.pause(2000);
        }

    }
}); 
Then('{} :: they are taken to the event', async(notificationtype)=>{
    let handles = await browser.getWindowHandles();
    for(var i = 0; i < handles.length; i++){
        await browser.switchToWindow(handles[i]); 
        assert(expect(browser).toHaveTitleContaining(eventtitle));
    }
    for(var i = 0; i < handles.length-1; i++){
        await browser.switchToWindow(handles[i])
        await browser.closeWindow()
    }
}); 


let idary = []; 
async function addevents(notificationtype){
    let date = new Date();
    let comm_today = date.setTime(date.getTime()+40000)
    let comm_later = date.setTime(date.getTime()+1000000)
    let upcoming = { 
        title: 'Live Now! An Event!',
        startDate: comm_today,
        endDate: comm_later,
        isVisible: true, 
        description: 'I\'M LIVE!', 
        link: 'https://www.youtube.com/watch?v=wTJm3_n6kuw', 
        isLive: true 
    }
    let recorded = {
        title: 'Recorded Now! An Event!',
        startDate: comm_today,
        endDate: comm_later,
        isVisible: true, 
        description: 'I\'M DEAD!', 
        link: 'https://www.youtube.com/watch?v=wTJm3_n6kuw', 
    }
    let creds = JSON.parse(fs.readFileSync(path.resolve('C:\\Users\\AlyssaMcMillan\\work\\traction-rec-integrations\\gtest\\node_modules\\.bin\\sfcred.json')).toString());
    let conn = await new jsforce.Connection({
        instanceUrl: 'https://trialectic-power.my.salesforce.com',
        loginUrl: creds.url
    });
    try {
        await conn.login(creds.username, creds.password);
        console.log('Connected to Salesforce!');

        if(notificationtype==='live'){

            for(var i = 0; i < 4; i++){
                await conn.sobject("gather__ah_Community_Event__c").create(
                { Name: upcoming.title,
                gather__ah_Start_Datetime__c: upcoming.startDate,
                gather__ah_End_Datetime__c: upcoming.endDate,
                gather__ah_Description__c: upcoming.description,
                gather__ah_Live_Link__c: upcoming.link,
                gather__ah_Visible_in_Community__c: upcoming.isVisible,
                gather__ah_Live_Event__c: true
                }, function(err, ret) {
                if (err || !ret.success){ 
                    return console.error('>>>', err, ret); 
                }
                console.log("Created record id : " + ret.id);
                idary.push([ret.id, upcoming.startDate])
                });     

            }
        }
        else if(notificationtype==='recorded'){
            await conn.sobject("gather__ah_Community_Event__c").create(
                { Name: recorded.title,
                gather__ah_Start_Datetime__c: recorded.startDate,
                gather__ah_End_Datetime__c: recorded.endDate,
                gather__ah_Description__c: recorded.description,
                gather__ah_Live_Link__c: recorded.link,
                gather__ah_Visible_in_Community__c: recorded.isVisible
                }, function(err, ret) {
                if (err || !ret.success){ 
                    return console.error('>>>', err, ret); 
                }
                console.log("Created record id : " + ret.id);
                idary.push([ret.id, upcoming.startDate])
                });     
        }
    }
    catch (err) {
        console.error(err);
    }
    return idary; 
}


