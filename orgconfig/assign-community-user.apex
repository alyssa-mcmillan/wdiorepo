Id profile = [SELECT Id from Profile where name ='Standard Platform User'][0].Id;
String temp = String.valueOf(profile);
Id userid = [SELECT Id from User WHERE profileId = :temp][0].Id;
Id permissionSetId = [SELECT Id FROM PermissionSet WHERE Label = 'Gather Community User'][0].Id;
PermissionSetAssignment psa = new PermissionSetAssignment(PermissionSetId = permissionSetId, AssigneeId = userId);
insert psa;