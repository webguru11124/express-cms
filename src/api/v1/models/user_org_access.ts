import { mysqlQuery } from "../config/queries";
import { get_user_role_admin } from "./queries/org_users.query";
import { UserOrganizationID } from "./queries/type";
import {
  create_access,
  get_user_access,
  create_multiple
} from './queries/user_org_access'

export const tables_id: any = {
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
//to create the follow scheme from table of
/**
 * 
 * {[org_id:[
    {
        table:vender,
        read:1,
        write:1,
    }
 * 
 */
type Item = {
  orginization_id: number,
  table_id: number,
  access: number,
}
type GroupedObject = {
  [id: number]: [{
    table: number;
  }]
}

const reducedArray = (arr: [Item]) =>
  arr.reduce<GroupedObject>((tmpGroupedObject, item: Item) => {
    if (tmpGroupedObject[item.orginization_id]) {
      const index = tmpGroupedObject[item.orginization_id].findIndex(
        (d) => d.table == item.table_id
      );
      console.log(index);
      if (index !== -1) {
        tmpGroupedObject[item.orginization_id][index] = {
          ...tmpGroupedObject[item.orginization_id][index],
          ...(item.access == 1 ? { write: 1 } : {}),
          ...(item.access == 2 ? { read: 1 } : {}),
        };
      } else {
        tmpGroupedObject[item.orginization_id].push({
          table: item.table_id,
          ...(item.access == 1 ? { write: 1 } : {}),
          ...(item.access == 2 ? { read: 1 } : {}),
        });
      }
    } else {
      tmpGroupedObject[item.orginization_id] = [
        {
          table: item.table_id,
          ...(item.access == 1 ? { write: 1 } : {}),
          ...(item.access == 2 ? { read: 1 } : {}),
        },
      ];
    }
    return tmpGroupedObject;
  }, {});

//user will assing based on this
const dummny_data = [
  {
    table: "vendor",
    write: 1,
    read: 1,
  },
  {
    table: "customer",
    read: 1,
  },
];

export const userOrgAccess: any = {
  create_multiple: async ({ user_id, orginization_id, data }: UserOrganizationID) => {
    //data here will be similar to dummy_data
    let Values: any = [];
    let throwErr = false;
    if (Array.isArray(data) && data.length > 0) {
      data.map((inner_data: any) => {
        if (
          inner_data &&
          inner_data.table &&
          (inner_data.write || inner_data.read) &&
          tables_id[inner_data.table]
        ) {
          Values.push(
            user_id,
            orginization_id,
            tables_id[inner_data.table],
            inner_data.write ? 1 : 2
          );
        } else {
          throwErr = true;
        }
      });
    } else {
      return [null, "error"];
    }
    if (throwErr) {
      return [null, "wrong data "];
    }
    const Result = await mysqlQuery.get(create_multiple(Values), Values);
    return Result;
  },
  get_user: async ({ user_id, orginization_id }: any) => {
    const Values: Array<any> = [user_id, orginization_id];
    const Result = await mysqlQuery.get(get_user_access, Values);
    return Result;
  },
  get_user_access: async ({ user_id, orginization_id }: any) => {
    const Values: Array<any> = [user_id, orginization_id];

    const [isAdminResult, isAdminErr] = await mysqlQuery.get(
      get_user_role_admin,
      Values
    );
    if (isAdminErr) {
      return [null, isAdminErr];
    }
    if (isAdminResult.length > 0) {
      return [
        {
          [orginization_id]: [
            {
              admin: 1,
            },
          ],
        },
        null,
      ];
    }
    const [result, err] = await mysqlQuery.get(get_user_access, Values);
    if (err) {
      return [null, err];
    }
    if (result && result.length > 0) {
      const parsedJson = reducedArray(result);
      return [parsedJson, null];
    } else {
      return [null, "no access"];
    }

    return [result, err];
  },
  //also should have delete and update here
};
