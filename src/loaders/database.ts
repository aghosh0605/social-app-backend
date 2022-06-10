import { Db, MongoClient, MongoError } from "mongodb";

export class DBInstance {
  private static instance: DBInstance;
  private database: Db;

  //Connection Configutation
  private opts: object = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  //Database Credentials
  private URL: string = process.env.MONGODB_URI || "mongodb://localhost:27017/";
  private dbName: string = process.env.DB_NAME || "test";
  private dbClient: MongoClient = new MongoClient(this.URL, this.opts);

  private async initialize(): Promise<Db> {
    try {
      const connClient: MongoClient = await this.dbClient.connect();
      console.log(`✅ Connected to MongoDB: ${this.dbName}`);
      DBInstance.instance.database = connClient.db(this.dbName);
      return DBInstance.instance.database;
    } catch (err) {
      console.error("❌ Could not connect to MongoDB\n%o", err);
      throw MongoError;
    }
  }

  //Singleton Function Implement
  public static getDatabase = async (): Promise<Db> => {
    if (!DBInstance.instance) {
      DBInstance.instance = new DBInstance();
      console.log("🔶 New Instance was Created!!");
    }
    if (!DBInstance.instance.database) {
      await DBInstance.instance.initialize();
    }
    return DBInstance.instance.database;
  };
}
