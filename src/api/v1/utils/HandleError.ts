export const HandleError = (err: any, controller: string) => {
  if (!err || !err.code) {
    return "Unkonwn Error Reading Error";
  }
  if (err.errno === "1210") {
    return "Invalid Arguments";
  }
  if (err.errno === "1835") {
    return "Malformed communication packet.";
  }
  if (err.errno == "1062") {
    return "Duplicate Entry " + controller;
  }
  return 1 ? err.sqlMessage : `Internal Server Error ${controller}`;
};

//process.env.NODE_ENV === "development"
