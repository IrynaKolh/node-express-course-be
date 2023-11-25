import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { config } from "dotenv";
import { products, stocks } from '../mocks/mock-data';
config();

const client = new DynamoDBClient({
  region: "us-east-1",
});
const docClient = DynamoDBDocumentClient.from(client);

async function fillDynamoDbTable(tableName: string, items: any[]): Promise<void> {
  let itemModel: any;
  items.forEach(async (item) => {
    if (tableName === process.env.DB_PRODUCTS!) {
      itemModel = { 'id': item.id, 'title': item.title, 'description': item.description, 'price': item.price }
    } else if (tableName === process.env.DB_STOCKS!) {
      itemModel = { 'product_id': item.product_id, 'count': item.count }
    }

    const command = new PutCommand({
      TableName: tableName,
      Item: itemModel
    });
    try {
      await docClient.send(command);
      console.log(`New items added to the ${tableName}`);
    } catch (error) {
      console.error(`Something went wrong durring the adding of new items to ${tableName}`, error);
    }
  })
}

(async () => {
  await fillDynamoDbTable(process.env.DB_PRODUCTS!, products);
  await fillDynamoDbTable(process.env.DB_STOCKS!, stocks);
})();