import Con from "./db";
export type returnTypes = [Results: any | null, Errors: any | null];
export const mysqlQuery = {
  async twoTranscation({
    queryOne,
    valuesOne,
    queryTwo,
    valuesTwo,
  }: {
    queryOne: string;
    valuesOne: Array<any>;
    queryTwo: string;
    valuesTwo: Array<any>;
  }): Promise<returnTypes> {
    try {
      const transaction = await Con.getConnection();
      transaction.beginTransaction();
      try {
        const [resultOne]: any = await transaction.execute(queryOne, valuesOne);
        valuesTwo.forEach((item: any) =>
          item == "uniqueId" ? resultOne.insertId : item
        );
        const [resultTwo]: any = await transaction.execute(queryTwo, valuesTwo);
        if (resultOne.affectedRows > 0 && resultTwo.affectedRows > 0) {
          await transaction.commit();
          return [[valuesOne[0]], null];
        }

        throw new Error("An error occured while creating");
      } catch (e) {
        await transaction.rollback();
        return [null, e];
      }
    } catch (e) {
      return [null, e];
    }
  },
  async create(query: string, values: any[]): Promise<returnTypes> {
    try {
      const [result]: any = await Con.execute(query, values);

      if (result.affectedRows > 0) {
        return [
          values.map((val: any, index) => {
            if (index === 0) {
              return result.insertId == 0 ? val : result.insertId;
            }
            return val;
          }),
          null,
        ];
      }

      throw new Error("An error occured while creating");
    } catch (e) {
      return [null, e];
    }
  },
  async get(query: string, values: any[]): Promise<returnTypes> {
    try {
      const [result]: any = await Con.execute(query, values);
      return [result, null];
    } catch (e) {
      return [null, e];
    }
  },
  async get_one(query: string, values: any[]): Promise<returnTypes> {
    try {
      const [result]: any = await Con.execute(query, values);
      if (result.length > 0) {
        return [result[0], null];
      } else {
        throw new Error("Email or password is incorrect");
      }
    } catch (e) {
      return [null, e];
    }
  },
  async delete(query: string, values: any[]): Promise<returnTypes> {
    try {
      const [result]: any = await Con.execute(query, values);
      if (result.affectedRows > 0) {
        return [result, null];
      }
      throw new Error("error deleting querry");
    } catch (e) {
      return [null, e];
    }
  },
  async update(query: string, values: any[]): Promise<returnTypes> {
    try {
      const [result]: any = await Con.execute(query, values);

      if (result.affectedRows > 0) {
        return ["Updated", null];
      }
      throw new Error("Error  Updating ");
    } catch (e) {
      return [null, e];
    }
  },
};
