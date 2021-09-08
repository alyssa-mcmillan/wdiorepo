
Account newaccount = new Account(name='hysterics');
insert newaccount;
Id acc = [select id from Account where name = 'hysterics'][0].Id; 

Contact newcontact = new Contact(); 
newcontact.LastName = 'frotact';
newcontact.AccountId = acc; 
insert newcontact; 

Id conid = [select id from Contact where lastname = :newcontact.LastName][0].Id;
Id prof = [select id from Profile where name = 'Customer Community Login User'][0].Id;

User conuser = new User(
    Username = newcontact.LastName+'@test.com',
    ContactId = conid,
    ProfileId = prof,
    Alias = newcontact.LastName,
    Email = newcontact.LastName + '@test.com',
    EmailEncodingKey = 'UTF-8',
    LastName = newcontact.LastName,
    CommunityNickname = newcontact.LastName,
    TimeZoneSidKey = 'America/Los_Angeles',
    LocaleSidKey = 'en_US',
    LanguageLocaleKey = 'en_US'
);

insert conuser; 
