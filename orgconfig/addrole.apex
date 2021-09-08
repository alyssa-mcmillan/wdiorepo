UserRole newrole = new UserRole(
    name = 'Admin'
); 
insert newrole; 
Id roleid = [select id from UserRole where name = 'CEO'][0].Id;
Id userid = Userinfo.getUserId();
User admin = [select name, UserRoleId from User where id = :userid]; 
admin.UserRoleId = newrole.Id; 
update admin; 