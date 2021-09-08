const jsforce = require('jsforce');
const fs = require('fs');
const path = require('path');
let orgcreds = JSON.parse(fs.readFileSync(path.resolve('authFile.json')).toString());

let idary = []; 
addevents('live')
async function addevents(notificationtype){
    let date = new Date();
    let comm_today = date.setTime(date.getTime()+50000)
    let comm_later = date.setTime(date.getTime()+1000000)
    let upcoming = { 
        title: 'Live Now! An Event!',
        startDate: comm_today,
        endDate: comm_later,
        isVisible: true, 
        description: 'I\'M LIVE!', 
        link: 'https://www.youtube.com/watch?v=wTJm3_n6kuw', 
    }
    let recorded = {
        title: 'Recorded Now! An Event!',
        startDate: comm_today,
        endDate: comm_later,
        isVisible: true, 
        description: 'I\'M DEAD!', 
        link: 'https://www.youtube.com/watch?v=wTJm3_n6kuw', 
    }
    try {
        let orgcreds = JSON.parse(fs.readFileSync(path.resolve('authFile.json')).toString());    
        let conn = await new jsforce.Connection({
                instanceUrl: orgcreds.result.instanceUrl,
                accessToken: orgcreds.result.accessToken,
        });

        console.log('Connected to Salesforce!');
        if(notificationtype==='live'){
            for(var i = 0; i < 4; i++){
                await conn.sobject("tint__ah_Community_Event__c").create(
                { Name: upcoming.title,
                tint__ah_Start_Datetime__c: upcoming.startDate,
                tint__ah_End_Datetime__c: upcoming.endDate,
                tint__ah_Description__c: upcoming.description,
                //tint__ah_Live_Link__c: upcoming.link,
                tint__ah_Visible_in_Community__c: upcoming.isVisible,
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
            await conn.sobject("tint__ah_Community_Event__c").create(
                { Name: recorded.title,
                tint__ah_Start_Datetime__c: recorded.startDate,
                tint__ah_End_Datetime__c: recorded.endDate,
                //tint__ah_Description__c: recorded.description,
                tint__ah_Recording_Link__c: recorded.link,
                tint__ah_Visible_in_Community__c: recorded.isVisible
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
    console.log(idary); 
    return idary; 
}