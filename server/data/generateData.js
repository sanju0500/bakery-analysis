import fs from "fs";
import { faker } from "@faker-js/faker";

const getItemCost = (type) => {
  switch (type) {
    case "Cake":
      return 500;
    case "Cookies":
      return 50;
    case "Muffins":
      return 100;
    default:
      return 0;
  }
};

const generateOrders = (numOrders) => {
  const orders = [];

  for (let i = 0; i < numOrders; i++) {
    const randomItemType = faker.helpers.arrayElement([
      "Cake",
      "Cookies",
      "Muffins",
    ]);
    orders.push({
      orderId: faker.string.uuid(),
      lastUpdatedDateTime: faker.date.between({
        from: "2023-01-01T00:00:00.000Z",
        to: "2023-12-25T00:00:00.000Z",
      }),
      itemType: randomItemType,
      orderState: faker.helpers.arrayElement([
        "Created",
        "Shipped",
        "Delivered",
        "Canceled",
      ]),
      value: getItemCost(randomItemType),
      branchId: faker.number.int({ min: 1, max: 1000 }),
    });
  }
  return orders;
};

const data = generateOrders(1000); // Generate 1000 orders

const sortedData = data.sort(
  (objA, objB) =>
    Number(objA.lastUpdatedDateTime) - Number(objB.lastUpdatedDateTime)
);

fs.writeFileSync("orders.json", JSON.stringify(sortedData, null, 2));
