# cloneAndStartNew
You will find the following
how the project is going to be structured as
for auth we will implement the follow
auth will be token sent to client after creating account or sign in
token is custom uuuid will be stored in db alongside device_id and ip 
to not call db everytime we will use redis simply to cache the data
if case of ip change we will use gep-lite to see if request is from same country  if yes then have access if not no
you find this in

`src/api/v1/middleware/auth`
`src/api/v1/controller/auth.controller`
`src/api/v1/model/auth.models`

in project nysql tables there is
`users` // all users and sub users
`orginaztion` //once a user create a orginaztion
`orginaztion_users` //the admin role type 1 or 2 create add other users to the orginaztion 
`orginaztion_users_access` //when admins add other user to the orginaztion they add access based on this
where 1 is `write` and 2 is `read` and table_id is 
```
`table_id` `access`
   1       1
   1       2
```
and in auth midddle  VerifyHasAccess function
parse the following data 
```
{[org_id:[
    {
        table:vender,
        read:1,
        write:1,
    }
```
coming from user_org_access in models  function get_user_access

it checks orginaztion_users to see if it type 1 or 2
if not goes orginaztion_users_access

and return the row and parse them according 
```
{[org_id:[
    {
        table:vender,
        read:1,
        write:1,
    }
```

```
export const tables_id = {
  vendor: "1",
  customer: "2",
  forwarder: "3",
  bol: "4",
  so: "5",
  po: "6",
  booking: "7",
  shippiments: "8",
  invoice: "9",
  pl: "10",
};
```
every route will be protected.


this is the flow of the project

 - create user in users

 - create orginaztion in orginaztion

 - invite other users based on email and create a row in invite_orginaztion_user
     - also in same transaction he will create a row in users with status 2
     - and in orginaztion_user with staus 2
     - and in org_users_access based on the giving access giving access will
     - an email will be sent to that user with password so he can log in
     - the orginaztion can delete the user from   orginaztion_user but not from users
       
 - based on access the can create the following
   - vendors
   - customers
   - forwarder
   - items
   - extra_fields  orginaztion_user(type 1 or 2 )
   - extra_fields_value orginaztion_user(type 1 or 2 )
  
we will follow EAV model here sp

in 
  - vendors
   - customers
   - forwarder
   - items

  there will be "custom fields" 
  which are created in
  - extra_fields_value
  - extra_fields

    






