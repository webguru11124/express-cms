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
users // all users and sub users
orginaztion //once a user create a orginaztion
orginaztion_users //the admin role type 1 or 2 create add other users to the orginaztion 
orginaztion_users_access //when admins add other user to the orginaztion they add access based on this
where 1 is write and 2 is read and table_id is 
`table_id` `access`
   1       1
   1       2

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
