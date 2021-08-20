const { Given, When, Then, After, AfterAll, BeforeAll } = require('@cucumber/cucumber');
const { find } = require('lodash');
const assert = require('assert');
const BasePage = require('features/pageobjects/page.js');
const Home = require('features/pageobjects/Home');
const Login = require('features/pageobjects/sfloginpage.js');
const NamespaceLogin = require('features/pageobjects/customlogin.js');
const Parent = require('features/pageobjects/Parent');
const Community = require('features/pageobjects/Community');
const ParentEvent = require('features/pageobjects/ParentEvent');
const CommunityEvent = require('features/pageobjects/CommunityEvent');
const AdminHome = require('features/pageobjects/AdminHome');
const { pathToFileURL } = require('url');

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

    await browser.url('https://trialectic-power.lightning.force.com/lightning/page/home'); 
    assert(expect(browser).toHaveUrlContaining('my.salesforce.com'));
    await NamespaceLogin.login(); 
    await browser.pause(4000)
    assert(expect(browser).toHaveUrlContaining('.force.com'));
    
})

//////////////
//BACKGROUND//
/////////////

Given("user is logged in", async () => {
    await browser.url('https://trialectic-power.lightning.force.com/lightning/page/home')
    await browser.pause(2000)
    const usericon = await AdminHome.usericon;
    var there = await usericon.isDisplayed()
    assert(there===true)
});

/////////
//STEPS//
/////////
Given ('{} {} ::: user is on record page', async(event_type, component)=>{
    if(event_type==='Parent'){
        browser.url('https://trialectic-power.lightning.force.com/lightning/o/gather__ah_Parent_Event__c/list?filterName=00B5e00000Erdk9EAB')
        await browser.pause(1500)
        assert(expect(browser).toHaveUrlContaining('lightning.force.com'));
    }
    else if(event_type==='Community'){
        browser.url('https://trialectic-power.lightning.force.com/lightning/o/gather__ah_Community_Event__c/list?filterName=00B5e00000Erdk3EAB'); 
        await browser.pause(1500)
        assert(expect(browser).toHaveUrlContaining('lightning.force.com'));
    }
});
When('{} {} ::: user clicks new', async(event_type, component)=>{
    let newevent; 
    if(event_type==='Community'){
        newevent = await CommunityEvent.newevent; 
    }
    else if(event_type==='Parent'){
        newevent = await ParentEvent.newevent; 
    }
    await newevent.isClickable(); 
    await newevent.click(); 
    await browser.pause(1500)
});
Then('{} {} ::: new record window appears', async(event_type, component)=>{
    let newmessage; 
    if(event_type==='Community'){
        newmessage = await CommunityEvent.newtitle; 
    }
    else if(event_type==='Parent'){
        newmessage = await ParentEvent.newtitle; 
    }
    const isthere = await newmessage.isDisplayed(); 
    assert(isthere===true);
});
When('{} {} ::: {} {} > info is entered', async(event_type, component, visbility, num)=>{
    num = parseInt(num)
    if(event_type==='Community'){
        const name = await CommunityEvent.eventname; 
        await name.isClickable(); 
        await name.setValue(event[num].eventdata.eventname);
        const startdate = await CommunityEvent.startdate; 
        await startdate.isClickable(); 
        await startdate.setValue(event[num].eventdata.startdate)
        const enddate = await CommunityEvent.enddate;
        await enddate.isClickable; 
        await enddate.setValue(event[num].eventdata.enddate)
        const starttime = await CommunityEvent.eventstarttime;
        await starttime.isClickable(); 
        await starttime.setValue(event[num].eventdata.starttime)
        const endtime = await CommunityEvent.eventendtime; 
        await endtime.isClickable();
        await endtime.setValue(event[num].eventdata.endtime);
        const description = await CommunityEvent.eventdescription;
        await description.isClickable(); 
        await description.setValue(event[num].eventdata.description)

        if(visbility==='visible'){
            const visiblitybutton = await CommunityEvent.isvisible;
            await visiblitybutton.isClickable(); 
            await visiblitybutton.click(); 
        }


        const recordinglink = await CommunityEvent.recordinglink; 
        await recordinglink.isClickable(); 
        await recordinglink.setValue(event[num].eventdata.recordinglink)
        const savebutton = await CommunityEvent.savebutton; 
        await savebutton.isClickable(); 
        await savebutton.click(); 
        await browser.pause(2000);
}
   else if(event_type==='Parent'){
        const name = await ParentEvent.eventname; 
        await name.isClickable(); 
        await name.setValue(event[num].eventdata.eventname);
        const startdate = await ParentEvent.startdate; 
        await startdate.isClickable(); 
        await startdate.setValue(event[num].eventdata.startdate)
        const enddate = await ParentEvent.enddate;
        await enddate.isClickable; 
        await enddate.setValue(event[num].eventdata.enddate)
        const starttime = await ParentEvent.eventstarttime;
        await starttime.isClickable(); 
        await starttime.setValue(event[num].eventdata.starttime)
        const endtime = await ParentEvent.eventendtime; 
        await endtime.isClickable();
        await endtime.setValue(event[num].eventdata.endtime);
        const description = await ParentEvent.eventdescription;
        await description.isClickable(); 
        await description.setValue(event[num].eventdata.description)

        if(visbility==='visible'){
            const visiblitybutton = await ParentEvent.isvisible;
            await visiblitybutton.isClickable(); 
            await visiblitybutton.click(); 
        }

        const savebutton = await ParentEvent.savebutton; 
        await savebutton.isClickable(); 
        await savebutton.click(); 
        await browser.pause(2000);
   }
}) ;
Then('{} {} ::: event is saved', async(event_type, component)=>{
    if(event_type==='Community'){
    const recordpage = await CommunityEvent.recordtitle;
    let isthere = await recordpage.isDisplayed();
    assert(isthere=true);
    }
    else if(event_type==='Parent'){
        const recordpage = await ParentEvent.recordtitle;
        let isthere = await recordpage.isDisplayed();
        assert(isthere=true);
    }
});
When('{} {} ::: photo is uploaded', async(event_type, component)=>{

    const fileUpload = await $('//flexipage-component2[@data-component-id="ah_TileImageUploader"]/descendant::input[@type="file"]');
        await browser.execute(
        // assign style to elem in the browser
        (el) => el.style.display = 'block',
        // pass in element so we don't need to query it again in the browser
        fileUpload
        );
    await fileUpload.waitForDisplayed();
    let filePath = "C:\\Users\\AlyssaMcMillan\\Pictures\\814+tKZ5m4L._AC_SX522_.jpg"
    const remoteFilePath = await browser.uploadFile(filePath)

    const setval = await $('//flexipage-component2[@data-component-id="ah_TileImageUploader"]/descendant::input[@type="file"]')
    await setval.setValue(remoteFilePath)
    const uploadbtn = await CommunityEvent.uploadbtn; 
    await uploadbtn.isClickable(); 
    await uploadbtn.click(); 
    await browser.pause(2000)
});
Then('{} {} ::: {} event is validated to be {}', async(event_type, component, num, visbility,)=>{
    await browser.url(rowurl);
    await browser.pause(2000)

    if(component==='Previous'){
        const ondemand = await Home.ondemandTab; 
        await ondemand.isClickable(); 
        await ondemand.click()
        await browser.pause(2000)
    }

   const eventtitle = '//h2[@title="'+ event[num].eventdata.eventname + '"]'
   console.log('>>>',eventtitle)
    let eventanchor;
    let isvis; 

    while(eventanchor===undefined){
        eventanchor = await $(eventtitle);
        let found = await eventanchor.isDisplayed()
        console.log('>>>', found)
        if(found===false){
            let nextbutton; 
            if(component==='Upcoming'){
                nextbutton = await Home.upnext; 
            }
            else if(component==='Previous'){
                nextbutton = await Home.prevnext; 
            }
            await nextbutton.isClickable(); 
            await nextbutton.click(); 
            await browser.pause(1000);
        }

        eventanchor = await $(eventtitle);
        isvis = await eventanchor.isDisplayed(); 
    }

    
    if(visbility==='visible'){
        assert(isvis===true)
    }
    else if(visbility==='invisible'){
        assert(isvis===false)
    }
       

});

let comm_today = new Date();
comm_today.setDate(comm_today.getDate()+7);
let comm_yesterday = new Date(); 
comm_yesterday.setDate(comm_yesterday.getDate()-7);
ds = comm_today.getDate(); 
de = comm_yesterday.getDate(); 
let cm = comm_today.getMonth()+1; 
let cmt = comm_yesterday.getMonth()+1
let cy = comm_today.getFullYear(); 
let com_now = cm + '/' + ds + '/' + cy; 
let com_then = cmt + '/' + de + '/' + cy; 

let par_today = new Date();
par_today.setDate(par_today.getDate()+1);
let par_tomorrow = new Date()
par_tomorrow.setDate(par_tomorrow.getDate()+7)
let par_yesterday = new Date(); 
par_yesterday.setDate(par_yesterday.getDate()-7);
let par_past = new Date(); 
par_past.setDate(par_past.getDate()-2)
upsd = par_today.getDate(); 
uped = par_tomorrow.getDate()
prsd = par_yesterday.getDate(); 
pred = par_past.getDate(); 
de = par_yesterday.getDate(); 
let ptm = par_today.getMonth()+1; 
let pym = par_yesterday.getMonth()+1
let ppm = par_past.getMonth()+1;
let py = par_today.getFullYear(); 
let par_now = ptm + '/' + upsd + '/' + py;
let par_now_end = ptm + '/' + uped + '/' + py;
let par_then = pym + '/' + prsd + '/' + py;
let par_then_end = ppm + '/' + pred + '/' + py;


let event = [
    {eventdata: {
        eventname: "Upcoming Commmuity Event - Visible",
        time: "Upcoming",
        startdate: com_now,
        starttime: "6:00 AM",
        enddate: com_now,
        endtime: "11:00 PM",
        description: "This event should be visible",
        recordinglink: 'https://www.youtube.com/watch?v=_g17eSWd1aQ',
        visibility: true
        }
    },
    {eventdata: {
        eventname: "Upcoming Commmuity Event - INVisible",
        time: "Upcoming",
        startdate: com_now,
        starttime: "6:00 AM",
        enddate: com_now,
        endtime: "11:00 PM",
        description: "This event should be invisible",
        recordinglink: 'https://www.youtube.com/watch?v=_g17eSWd1aQ',
        visibility: false
        }
    },
    {eventdata: {
        eventname: "Upcoming Parent Event - Visible",
        time: "Upcoming",
        startdate: par_now,
        starttime: "6:00 AM",
        enddate: par_now_end,
        endtime: "11:00 PM",
        description: "This event should be visible",
        recordinglink: 'https://www.youtube.com/watch?v=_g17eSWd1aQ',
        visibility: true
        }
    },
    {eventdata: {
        eventname: "Upcoming Parent Event - INVisible",
        time: "Upcoming",
        startdate: par_now,
        starttime: "6:00 AM",
        enddate: par_now_end,
        endtime: "11:00 PM",
        description: "This event should be invisible",
        recordinglink: 'https://www.youtube.com/watch?v=_g17eSWd1aQ',
        visibility: false
        }
    },
    {eventdata: {
        eventname: "Previous Commmuity Event - Visible",
        time: "Previous",
        startdate: com_then,
        starttime: "6:00 AM",
        enddate: com_then,
        endtime: "11:00 PM",
        description: "This event should be visible",
        recordinglink: 'https://www.youtube.com/watch?v=_g17eSWd1aQ',
        visibility: true
        }
    },
    {eventdata: {
        eventname: "Previous Commmuity Event - INVisible",
        time: "Previous",
        startdate: com_then,
        starttime: "6:00 AM",
        enddate: com_then,
        endtime: "11:00 PM",
        description: "This event should be invisible",
        recordinglink: 'https://www.youtube.com/watch?v=_g17eSWd1aQ',
        visibility: false
        }
    },
    {eventdata: {
        eventname: "Previous Parent Event - Visible",
        time: "Previous",
        startdate: par_then,
        starttime: "6:00 AM",
        enddate: par_then_end,
        endtime: "11:00 PM",
        description: "This event should be visible",
        recordinglink: 'https://www.youtube.com/watch?v=_g17eSWd1aQ',
        visibility: true
        }
    },
    {eventdata: {
        eventname: "Previous Parent Event - INVisible",
        time: "Upcoming",
        startdate: par_then,
        starttime: "6:00 AM",
        enddate: par_then_end,
        endtime: "11:00 PM",
        description: "This event should be invisible",
        recordinglink: 'https://www.youtube.com/watch?v=_g17eSWd1aQ',
        visibility: false
        }
    }
]