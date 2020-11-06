const MongoClient = require("mongodb").MongoClient;

class Connection {
   static async connectToMongo() {
      if (this.db) return this.db;
      const client = new MongoClient(this.url, this.options);
      this.db = await client.connect().catch((err) => console.log(err));
      return this.db;
   }
}

Connection.db = null;
Connection.url = "mongodb+srv://romeramatias:pass21@cluster0.culfq.mongodb.net/apifoxes.matches?retryWrites=true&w=majority";
Connection.options = {
   useNewUrlParser: true,
   useUnifiedTopology: true,
};

module.exports = { Connection };
