const { Given, When, Then, After, AfterAll, BeforeAll } = require('@cucumber/cucumber');
const { find } = require('lodash');
const assert = require('assert');
const Home = require('./../pageobjects/Home');
const Login = require('./../pageobjects/sfloginpage.js');
const NamespaceLogin = require('./../pageobjects/customlogin.js');
const Parent = require('./../pageobjects/Parent');
const Community = require('./../pageobjects/Community');
const ParentEvent = require('./../pageobjects/ParentEvent');
const CommunityEvent = require('./../pageobjects/CommunityEvent');
const AdminHome = require('./../pageobjects/AdminHome');
const { pathToFileURL } = require('url');

const jsforce = require('jsforce');
const fs = require('fs');
const path = require('path');

let filtervalue; 

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
    const loginButton = await Home.loginbutton;   
    await loginButton.isClickable(); 
    await loginButton.click();
    assert(expect(browser).toHaveUrlContaining('s/login/'))
    await Login.changepage(); 
    assert(expect(browser).toHaveUrlContaining('my.salesforce.com'));
    await NamespaceLogin.login(); 
    await browser.pause(5000)
    assert(expect(browser).toHaveUrlContaining('.force.com'));
})

Given("user is logged in", async () => {
    await browser.url(tileurl)
    const usericon = await Home.usericon;
    var there = await usericon.isDisplayed()
    assert(there===true)
});

Given('{} {} {} :: user is on page', async(event_type, component, filter_type)=>{

    
    if(event_type==='Community'){
        if(component==='Previous'){
            await browser.pause(1000)
            const ondemandtab = await Home.ondemandTab; 
            await ondemandtab.isClickable(); 
            await ondemandtab.click();
            await browser.pause(2000)
        }
        assert(expect(browser).toHaveTitle('Home')); 
    }
    else if(event_type==='Child'){

        let event 
        if(component==='Previous'){
            const ondemandtab = await Home.ondemandTab; 
            await ondemandtab.isClickable(); 
            await ondemandtab.click();
            await browser.pause(2000)
            event = await Home.tile_prevparentbanner;
        }
        else if(component==='Upcoming'){
            event = await Home.tile_upparentbanner; 
        }

        
        let isthere = await event.isDisplayed(); 
        while(isthere === false){
            let next; 
            if(component==='Previous'){
                next = await Home.prevnext; 
            }
            else if(component==='Upcoming'){
                next = await Home.upnext; 
            }
            await next.isClickable();
            await next.click();
            isthere = await event.isDisplayed();  
        }

        event = await event.$('../a');
        await event.isClickable(); 
        await event.click(); 
        await browser.pause(2000);
        assert(expect(browser).toHaveUrlContaining('ah-parent-event'));
        if(component==='Previous'){
            const ondemandtab = await Parent.ondemandTab; 
            await ondemandtab.isClickable(); 
            await ondemandtab.click();
            await browser.pause(2000)
        }
    }
});
When('{} {} {} :: user selects filter', async(event_type, component, filter_type)=>{
    if(event_type==='Community'){
        if(component==='Upcoming'){
                let filter;
                if(filter_type==='host'){
                    filter = await Home.up_hostFilter; 
                }
                else if(filter_type==='eventtype'){
                    filter = await Home.up_eventFilter; 
                }

                await filter.isClickable(); 
                await filter.click(); 

                let selection = await filter.$('./option[4]')
                filtervalue = await selection.getText(); 
                await selection.isClickable(); 
                await selection.click(); 
                await browser.pause(2000)
        }
        else if(component==='Previous'){
            let filter;
            if(filter_type==='host'){
                filter = await Home.prev_hostFilter; 
            }
            else if(filter_type==='eventtype'){
                filter = await Home.prev_eventFilter; 
            }
            await filter.isClickable(); 
            await filter.click(); 

            let selection = await filter.$('./option[4]')
            filtervalue = await selection.getText(); 
            await selection.isClickable(); 
            await selection.click(); 
        }
    }
    else if(event_type==='Child'){

            let filter;

            let types = await getTypes(); 
            let parenturl = await browser.getUrl(); 
            let slash = parenturl.indexOf('a0');
            let eventID = parenturl.substring(slash, slash+18);
            
            let parenttype; 
            for(var i = 0; i < types.length; i++){
                if(types[i][0]==eventID){
                    parenttype = types[i][1];
                    break;
                }
            }

            let selection; 
            if(filter_type==='host'){
                if(component==='Upcoming'){
                    filter = await Parent.up_hostFilter;
                }
                else if(component==='Previous'){
                    filter = await Parent.prev_hostFilter;

                }
                await filter.isClickable(); 
                await filter.click();
                selection = filter.$('./option[2]')
                filtervalue = await selection.getText(); 
            }
            else if(filter_type==='eventtype'){
                if(component==='Upcoming'){
                    filter = await Parent.up_eventFilter; 
                }
                else if(component==='Previous'){
                    filter = await Parent.prev_eventFilter; 
                }
                await filter.isClickable(); 
                await filter.click();

                selection = await filter.$$('./option')
                for(var i = 0; i < selection.length; i++){
                    let optiontitle = await selection[i].getText();
                    if(optiontitle==parenttype){
                        filtervalue = parenttype; 
                        selection = selection[i];  
                        break; 
                    }
                }
            }

            await selection.isClickable(); 
            await selection.click(); 
            await browser.pause(4000)
            
    }
    
});
Then('{} {} {} :: component only displays correct results', async(event_type, component, filter_type)=>{
    let eventsWithFilter = await checkfilters(filtervalue, filter_type, event_type);
    let events;
    if(component==='Upcoming'){

        if(event_type==='Community'){
            events = await Home.tile_upeventtile; 
        }
        else if(event_type==='Child'){
            events = await Parent.tile_upeventtile; 
        }
    }
    else if(component==='Previous'){

        if(event_type==='Community'){
            events = await Home.tile_preveventtile
        }
        else if(event_type==='Child'){
            events = await Parent.tile_preveventtile; 
        }

    }

    let count = 0; 
    for(var h = 0; h < eventsWithFilter.records.length; h++){
        for(var e = 0; e < events.length; e++){
            let eventtitle = await events[e].$('./descendant::h2'); 
            eventtitle = await eventtitle.getText(); 
            if(eventtitle==eventsWithFilter.records[h].Name){
                count = count + 1;
            }
        }
    }

    
    console.log('>>>',events.length, count)
    assert(events.length===count);

});


async function checkfilters(filtervalue, filter_type, event_type){
    let creds = JSON.parse(fs.readFileSync(path.resolve('sfcred.json')).toString());
    let conn = await new jsforce.Connection({
        instanceUrl: 'https://trialectic-power.my.salesforce.com',
        loginUrl: creds.url
    });
    try {
        await conn.login(creds.username, creds.password);
        console.log('Connected to Salesforce!');
        let soql;
        let soql2
        if(filter_type==='host'){
            if(event_type==='Community' || event_type==='Child'){
                soql = "select id from gather__ah_Host__c where Name = '" + filtervalue +"'"; 
                let results = await conn.query(soql);
                soql = "select id, name, gather__ah_Host__c from gather__ah_Community_Event__c where gather__ah_Host__c = '" + results.records[0].Id + "'";
                soql2 = "select id, name, gather__ah_Host__c from gather__ah_Parent_Event__c where gather__ah_Host__c = '" + results.records[0].Id + "'";
            }
        }
        else if(filter_type==='eventtype'){
            if(event_type==='Community' || event_type==='Child'){
                soql = "select id, name, gather__ah_Event_Type__c from gather__ah_Community_Event__c where gather__ah_Event_Type__c includes ('" + filtervalue + "')";
                soql2 = "select id, name, gather__ah_Event_Type__c from gather__ah_Parent_Event__c where gather__ah_Event_Type__c includes ('"+ filtervalue + "')";
            }
            else if(event_type==='Parent'){
                soql = "select name, gather__ah_Event_Type__c from gather__ah_Parent_Event__c where gather__ah_Event_Type__c includes ('" + filtervalue + "')";
            }
        }
        let communityevents =  await conn.query(soql);
        let parentevents = await conn.query(soql2);
        for(var i = 0; i < parentevents.records.length; i++){
            communityevents.records.push(parentevents.records[i])
        }
        return communityevents; 
    }
    catch (err) {
        console.error(err);
    }
 
}

async function getTypes(){
    let creds = JSON.parse(fs.readFileSync(path.resolve('sfcred.json')).toString());
    let conn = await new jsforce.Connection({
        instanceUrl: 'https://trialectic-power.my.salesforce.com',
        loginUrl: creds.url
    });
    try {
        await conn.login(creds.username, creds.password);
        console.log('Connected to Salesforce!');
        let soql = "select Name, gather__ah_Event_Type__c, gather__ah_Parent_Event__c, gather__ah_Parent_Event__r.Name from gather__ah_Community_Event__c"
        let results = await conn.query(soql); 
        let parentevents = []; 
        for(var i = 0; i < results.records.length; i++){
            if(results.records[i].gather__ah_Parent_Event__c != null){
                parentevents.push([results.records[i].gather__ah_Parent_Event__c, results.records[i].gather__ah_Event_Type__c]);
            }
        }
        return parentevents; 
    }
    catch (err) {
        console.error(err);
    }
 
}