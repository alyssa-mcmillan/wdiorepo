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
const Vimeo = require('vimeo/player')
const Vidyard = require('@vidyard/embed-code');

let progressTime; 
let percentComplete; 
let eventID; 
let initialEventStat; 
let videoID; 
let playerurl; 

////////////////////
//BEFORE ALL TESTS//
////////////////////
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

Given('{} :: user is on event page', async(playertype)=>{
    await browser.url(tileurl);
    await browser.pause(1000)

    const onDemandTab = await Home.ondemandTab; 
    await onDemandTab.isClickable(); 
    await onDemandTab.click(); 
    await browser.pause(7000)

    const events = await Home.tile_preveventtile; 

    let playtype; 
    for(let i = 0; i < events.length; i++){

        let id = await events[i].$('./descendant::a[@class="ah-event-row-anchor"]');
        let play = await id.getAttribute('href');
        play = play.substring(play.length-18, play.length)

        playerurl = await getPlayerType(play);
        console.log('>>>', playertype)
        
        playtype = playerurl.substring(playerurl.indexOf('//')+2, playerurl.indexOf('.com'))
        console.log('>>>', playtype)

        if(playertype==='YouTube'){
            playtype = playtype.replace('www.', '');
            if(playtype=='youtube'){
                await id.isClickable(); 
                await id.click(); 
                await browser.pause(4000)
                return; 
            }
        }
        else if(playertype=='Vimeo'){
            if(playtype=='vimeo'){
                await id.isClickable(); 
                await id.click(); 
                await browser.pause(4000)
                return; 
            }
        }
        else if(playertype==='mp3'){
            let audioplay = playerurl.substring(playerurl.length-4, playerurl.length)
            console.log(audioplay)
            if(audioplay==='.mp3'){
                await id.isClickable(); 
                await id.click(); 
                await browser.pause(4000)
                return;             
            }
        }
    }

});
When('{} :: user presses play', async(playertype)=>{
    const playerReg = await Community.playerwrapper_regbutton; 
    let isthere = await playerReg.isDisplayed(); 
    if(isthere===true){
        await playerReg.isClickable(); 
        await playerReg.click(); 
        await browser.pause(5000)
    }
    if(playertype==='YouTube' || playertype === 'Vimeo'){
        const gp = await Community.gatherproxy; 
        await browser.switchToFrame(gp); 
    }

    if(playertype==='YouTube'){

        const iframe = await Community.ytiframe;
        videoID = await iframe.getAttribute('src')
        
        await browser.switchToFrame(iframe)
    
        const playButton = await $('#movie_player')
        await playButton.isClickable(); 
        await playButton.click(); 
        await browser.pause(1000)
        let isPlaying = await playButton.getAttribute('class')
        let lastSpace = isPlaying.lastIndexOf(' ')
        let playerStatus = isPlaying.substring(lastSpace+1, isPlaying.length)
        await browser.pause(5000)
        assert(playerStatus=='playing-mode')
    }
    else if(playertype==='Vimeo'){

        let iframe = await Community.viframe; 
        videoID = await iframe.getAttribute('src')

        await browser.switchToFrame(iframe);

        let playButton = await $('#player')
        await playButton.isClickable(); 
        await playButton.click(); 
        await browser.pause(7000)

        let buttStatus = await $('//button[@type="button"]');
        let isPlaying = await buttStatus.getAttribute('class')
        assert(isPlaying=="play rounded-box state-playing");
    }
    else if(playertype==='mp3'){
        let playButton = await Community.audioplay; 
        await playButton.isClickable(); 
        await playButton.click(); 
        await browser.pause(5000)
        let screenStatus = await playButton.getAttribute('title');
        assert(screenStatus === 'Pause')
    }


});
When('{} :: user presses pause', async(playertype) =>{
    if(playertype==='YouTube'){
        const player = await $('#player')
        const playButton = await $('#movie_player')
        await playButton.isClickable(); 
        await playButton.click(); 
        await browser.pause(1000);
        let isPlaying = await playButton.getAttribute('class')
        let lastSpace = isPlaying.lastIndexOf(' ')
        let playerStatus = isPlaying.substring(lastSpace+1, isPlaying.length)
        await browser.pause(5000)
        assert(playerStatus=='ytp-expand-pause-overlay')
    }
    else if(playertype==='Vimeo'){

        let buttStatus = await $('//button[@type="button"]');
        await buttStatus.isClickable(); 
        await buttStatus.click(); 
        await browser.pause(3000)
        let isPlaying = await buttStatus.getAttribute('class')
        assert(isPlaying=="play rounded-box state-paused");

    }
    else if(playertype==='mp3'){
        let playButton = await Community.audioplay
        await playButton.isClickable(); 
        await playButton.click(); 
        await browser.pause(5000)
        let screenStatus = await playButton.getAttribute('title');
        assert(screenStatus === 'Play')
    }
});
Then('{} :: checks initial event statistic', async(playertype)=>{
    const url = await browser.getUrl()
    let slash = url.indexOf('a00');
    eventID = url.substring(slash, slash+18);
    initialEventStat = await getEngagementStat(eventID, globusername);
    progressTime = initialEventStat.gather__ah_Progress_Time__c;
    percentComplete = initialEventStat.gather__ah_Percent_Completed__c;
    assert(initialEventStat.gather__ah_Has_Started__c===true)
    assert(initialEventStat.gather__ah_Has_Completed__c===false)
    assert(initialEventStat.gather__ah_Progress_Time__c!=null)
    assert(initialEventStat.gather__ah_Percent_Completed__c!=null)
});
When('{} :: user plays video again', async(playertype)=>{
    
    if(playertype=='YouTube'){

        const playButton = await $('#movie_player')
        await playButton.isClickable(); 
        await playButton.click(); 
        await browser.pause(2000)
        let isPlaying = await playButton.getAttribute('class')
        let lastSpace = isPlaying.lastIndexOf(' ')
        let playerStatus = isPlaying.substring(lastSpace+1, isPlaying.length)
        await browser.pause(5000)
        assert(playerStatus=='playing-mode')

        await playButton.isClickable(); 
        await playButton.click(); 
        await browser.pause(1000);
        isPlaying = await playButton.getAttribute('class')
        lastSpace = isPlaying.lastIndexOf(' ')
        playerStatus = isPlaying.substring(lastSpace+1, isPlaying.length)
        await browser.pause(2000)
        assert(playerStatus=='ytp-expand-pause-overlay')
    }
    else if(playertype==='Vimeo'){

        let buttStatus = await $('//button[@type="button"]');
        await buttStatus.isClickable(); 
        await buttStatus.click(); 
        await browser.pause(3000)

        let isPlaying = await buttStatus.getAttribute('class')
        assert(isPlaying=="play rounded-box state-playing");

        await browser.pause(5000)

        await buttStatus.isClickable(); 
        await buttStatus.click(); 
        await browser.pause(3000)
        isPlaying = await buttStatus.getAttribute('class')
        assert(isPlaying=="play rounded-box state-paused");

    }
    else if(playertype==='mp3'){
        let playButton = await Community.audioplay; 
        await playButton.isClickable(); 
        await playButton.click(); 
        await browser.pause(5000)
        let screenStatus = await playButton.getAttribute('title');
        assert(screenStatus === 'Pause')

        await playButton.isClickable(); 
        await playButton.click(); 
        await browser.pause(3000);
        screenStatus = await playButton.getAttribute('title');
        assert(screenStatus === 'Play')
    }
}); 
Then('{} :: checks updated event statistic', async(playertype)=>{
    let updatedStat = await getEngagementStat(eventID, globusername);
    // assert(percentComplete<updatedStat.gather__ah_Percent_Completed__c)
    // assert(progressTime<updatedStat.gather__ah_Progress_Time__c)

});
When('{} :: user completes video', async(playertype)=>{

    if(playertype==='YouTube'){
        const result = await browser.execute(()=>{
            let ytplayer = document.getElementById('movie_player'); 
            let durr = ytplayer.getDuration(); 
            ytplayer.seekTo(durr-5, true) 
        });

        const playButton = await $('#movie_player');
        await playButton.isClickable(); 
        await playButton.click(); 

        await browser.pause(7000);

        let isDone = await playButton.getAttribute('class')
        let lastSpace = isDone.lastIndexOf(' ')
        let playerStatus = isDone.substring(lastSpace+1, isDone.length)
        await browser.pause(5000)
        assert(playerStatus=='ended-mode')
    }
    else if(playertype==='Vimeo'){

        let lastslash = playerurl.lastIndexOf('/')
        let vimeid = playerurl.substring(lastslash+1, playerurl.length)
        console.log(vimeid);

        await browser.switchToParentFrame()

        const resp = await browser.execute(async()=>{
            var iframe = await document.querySelector('iframe');
            var player = new Vimeo.Player(iframe);
            let durr = await player.getDuration()
            durr = durr-5
            await player.setCurrentTime(durr);
            return durr; 
        });


        console.log('>>>', resp)

        console.log('>>>', typeof resp)
        let vidframe = await Community.viframe;
        await browser.switchToFrame(vidframe)
        let buttStatus = await $('//button[@type="button"]');
        await buttStatus.isClickable(); 
        await buttStatus.click(); 
        await browser.pause(7000); 

        let replay = await $('//div[@class="replay-icon"]')
        let isdone = await replay.isDisplayed(); 
        assert(isdone===true);
    }
    else if(playertype==='mp3'){
        
        let resp = await browser.execute(async()=>{
            let audioplayer = document.getElementsByTagName('gather-ah_-audio-player')
            audioplayer = audioplayer[0].getElementsByTagName('audio')[0]
            let curtime = await audioplayer.duration
            curtime = curtime-5
            audioplayer.currentTime = curtime
            audioplayer.play(); 
            return audioplayer
        });
        console.log('>>>', resp)
        await browser.pause(7000)

        const playButton = await Community.audioplay; 
        let playerStatus = await playButton.getAttribute('title');
        assert(playerStatus==='Play')

    }
});
Then('{} :: checks completed event statistic', async(playertype)=>{
    let updatedStat = await getEngagementStat(eventID, globusername);
    console.log('>>>', updatedStat.gather__ah_Percent_Completed__c)
    console.log('>>>', updatedStat.gather__ah_Has_Completed__c)
    assert(updatedStat.gather__ah_Percent_Completed__c===100);
    assert(updatedStat.gather__ah_Has_Completed__c===true);
}); 
When('{} :: user restarts video', async(playertype)=>{

    if(playertype==='YouTube'){
        const playButton = await $('//button[@title="Replay"]')
        await playButton.isClickable(); 
        await playButton.click(); 
        await browser.pause(2000);

        let isPlaying = await playButton.getAttribute('class');
        let lastSpace = isPlaying.lastIndexOf(' ')
        let playerStatus = isPlaying.substring(lastSpace+1, isPlaying.length)
        await browser.pause(5000)
        assert(playerStatus=='ytp-button')
    }
    else if(playertype==='Vimeo'){
        let replay = await $('//div[@class="replay-icon"]')
        await replay.isClickable(); 
        await replay.click(); 
        await browser.pause(5000); 

        let buttStatus = await $('//button[@type="button"]');
        let isPlaying = await buttStatus.getAttribute('class')
        assert(isPlaying=="play rounded-box state-playing");
    }
    else if(playertype==='mp3'){
        let playButton = await Community.audioplay; 
        await playButton.isClickable(); 
        await playButton.click(); 
        await browser.pause(5000)
        let screenStatus = await playButton.getAttribute('title');
        assert(screenStatus === 'Pause')
    }
});
Then('{} :: number of plays increases', async(playertype)=>{
    let updatedStat = await getEngagementStat(eventID, globusername);
    assert(updatedStat.gather__ah_Started_Event__c===2)
}); 

///

var jsforce = require('jsforce');
var fs = require('fs');
var path = require('path');
const { compareDocumentPosition } = require('domutils');
const { formatUndefinedParameterType } = require('@cucumber/cucumber/lib/formatter/helpers/issue_helpers');

async function getEngagementStat(comm, username) {
    
    let creds = JSON.parse(fs.readFileSync(path.resolve('C:\\Users\\AlyssaMcMillan\\work\\traction-rec-integrations\\gtest\\node_modules\\.bin\\sfcred.json')).toString());
    let conn = new jsforce.Connection({
        loginUrl: creds.url
    });
    try {
        await conn.login(creds.username, creds.password);
        console.log('Connected to Salesforce!');
        
    } catch (err) {
        console.error(err);
    }
   
    let soql = `select id, gather__ah_Community_Event__c, gather__ah_User__c, gather__ah_Has_Started__c, gather__ah_Has_Completed__c, gather__ah_Progress_Time__c, gather__ah_Percent_Completed__c, gather__ah_Started_Event__c from gather__ah_Gather_Event_Statistic__c`
    let accounts = await conn.query(soql);
    let usersoql = "select id from User where Username like '" + globusername +"'"; 
    let user = await conn.query(usersoql)

    
    for(var i = 0; i < accounts.records.length;i++){
       if(accounts.records[i].gather__ah_Community_Event__c==comm){
           if(user.records[0].Id == accounts.records[i].gather__ah_User__c ){
                initialEventStat = accounts.records[i]
          }
       }
    }
    conn.logout();
    return initialEventStat; 
}

async function getPlayerType(eventid){

    let creds = JSON.parse(fs.readFileSync(path.resolve('C:\\Users\\AlyssaMcMillan\\work\\traction-rec-integrations\\gtest\\node_modules\\.bin\\sfcred.json')).toString());
    let conn = new jsforce.Connection({
        loginUrl: creds.url
    });
    try {
        await conn.login(creds.username, creds.password);
        console.log('Connected to Salesforce!');
        
    } catch (err) {
        console.error(err);
    }
   
    let soql = "select gather__ah_Recording_Link__c, gather__ah_Audio_Link__c, gather__ah_External_Link__c, gather__ah_Live_Link__c from gather__ah_Community_Event__c where id = '" + eventid +"'"
    let recordinglink = await conn.query(soql); 
    let link;
    recordinglink = Object.entries(recordinglink.records[0])
    for(var i = 0; i < recordinglink.length; i++){
        if(recordinglink[i][1]!=null){
            link = recordinglink[i][1]
        }
    }

    console.log('>>>', link)
    return link;   
}
