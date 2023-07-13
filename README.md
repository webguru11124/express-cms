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


    # important

    Check this before
routes

note ony for admin protected routes currently just create an empty middleware that does new()
note get opertation should be get  and post should be post
token always will be in the headers
extra information can be either in header or as query for get

for post/put/delete body data
Users - (users table) (1 table)
    endpoints

Create a user with status 0 (this happens if the user is invited)
if the user is invited and then he signs up with status is updated 1
Create a users with status 1 
disable a user to status 2 (admin protected route)
user status won’t be able to sign in and will be disable from everything 
(Admin)delete a user. (master admin protected route)
(User)delete a user. (token protected route)
retrive all users count  (master admin protected route)
retrive all users with paging  (master admin protected route)
forget password 
account verification based on link and temp uuid token match 
update user details . (token protected route)
orginaztion -(users and orginaztion and orginaztion users and orginaztion users access and invite_orginaztion_user tables)(5 tables in this route)
create an orginaztion(can be multiple to one user) (token protected route)
delete an orginaztion (token protected route)
retrive orginaztions based on user (owner or orignaztion user) (token protected route)
retrive users in an orginaztions (owner or orignaztion user) (token/access protected route)
add a user to orginazation (here you create a users then a orginaztion user and then a org user access  and invite_orginaztion_user—— should be a transaction!!!!! ) ( (token/Access protected route)
delete a user from orginaztion(here you delete from orginaztion user and org user access ——should be transaction!!!!) (token/Access protected route)
update orginaztion details . (Owner protected route)
----
----
Custom fields (extra fields)- (extra_fields and extra_field_values)
Create an an extra field if type is 0 means it is an drop down ((token/access protected route)
Create an an extra field values and fieldid is the extra field id ((token/access protected route)
retrive all extra fields to an orginaztion and a place(vendor-customer-forwarder-items)  ((token/access protected route)
retrive all extra fields based on orginaztion with pagination  ((token/access protected route)
retrive all extra fields values based on extra field_id  ((token/access protected route)
delete extra fields /extra fields values  ((token/access protected route)
Update extra fields /extra fields values  ((token/access protected route)
-----
file meda - no tables
-you can use multer here to upload a files and return a path


vendors (vendors and vendors values tables ) (2 tables)
-create a vendors and inseart extra fields values in vendors values table shoud be a transaction !!!! ((token/access protected route)
-retrive vendors and vendors_values related the vendor and vendors_values field data  incase they have a drop down the value also  ((token/access protected route)
-delete a vendor and vendors values related to vendor(transaction) ((token/access protected route)
-update a vendor and vendors values related to vendor(transaction) ((token/access protected route)


customer-forwarder-items






