export interface Product {
  id: string;
  title: string,
  description: string,
  price: number,
}

export interface Stock {
  product_id: string;
  count: number;
}

export const products: Product[] = [
  {
    title: "Pumpkin cheescake",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
    price: 25,
    description: "Contains: chocolate crackers, unsalted butter, cream cheese, heavy whipping cream, pumpkin puree, sugar, corn starch, eggs, walnuts, zest of orange.",
  },
  {
    title: "Honey cake with raspberriese",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
    price: 30,
    description: "Contains: honey, sugar, unsalted butter, eggs, baking soda, all purpose flour, milk, corn starch, sour cream, heavy whipping cream, raspberry puree, lemon juice, powered sugar, mascarpone."
  },
  {
    title: "Tender, light, vanilla cake 'Milk girl'",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
    price: 30,
    description: "Contains: berries, sugar, lemon juice, corn starch, all purpose flour, baking powder, eggs, vanilla sugar, condensed milk, unsalted butter, cream cheese, powdered sugar, heavy whipping cream, chocolate."
  },
  {
    title: "Chocolate orange cookies with nuts",
    id: "7567ec4b-b10c-48c5-9345-fc73348a80a1",
    price: 10,
    description: "Contains: all purpose flour, cocoa powder, baking powder, sunflower oil, powdered sugar, orange juice, zest of orange, cashews, almonds, pecans."
  },
  {
    title: "Cottage cheese cookies",
    id: "7567ec4b-b10c-48c5-9445-fc73c48a80a2",
    price: 10,
    description: "Contains: all purpose flour, baking powder, unsalted butter, cottage cheese, sugar, vanilla sugar."
  },
  {
    title: "Crepe cake with berry and cottage  cheese filling",
    id: "7567ec4b-b10c-45c5-9345-fc73c48a80a1",
    price: 20,
    description: "Contains: milk, eggs, all purpose flour, sugar, sunflower oil, salt, strawberry, blueberry, raspberry, water, corn starch, sour cream, cottage cheese, heavy whipping cream, powdered sugar."
  },
]

export const stocks: Stock[] = [
  {
    product_id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
    count: 5
  },
  {
    product_id: "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
    count: 6
  },
  {
    product_id: "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
    count: 7
  },
  {
    product_id: "7567ec4b-b10c-48c5-9345-fc73348a80a1",
    count: 8
  },
  {
    product_id: "7567ec4b-b10c-48c5-9445-fc73c48a80a2",
    count: 9
  },
  {
    product_id: "7567ec4b-b10c-45c5-9345-fc73c48a80a1",
    count: 10
  }
]