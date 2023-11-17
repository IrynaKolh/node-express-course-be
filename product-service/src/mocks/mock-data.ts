interface Product {
  id: string;
  title: string,
  description: string,
  price: number,
}

export const products: Product[] = [
  {
    title: "Pumpkin cheescake",
    id: "1",
    price: 25,
    description: "Contains: chocolate crackers, unsalted butter, cream cheese, heavy whipping cream, pumpkin puree, sugar, corn starch, eggs, walnuts, zest of orange.",
  },
  {
    title: "Honey cake with raspberriese",
    id: "2",
    price: 30,
    description: "Contains: honey, sugar, unsalted butter, eggs, baking soda, all purpose flour, milk, corn starch, sour cream, heavy whipping cream, raspberry puree, lemon juice, powered sugar, mascarpone."
  },
  {
    title: "Tender, light, vanilla cake 'Milk girl'",
    id: "3",
    price: 30,
    description: "Contains: berries, sugar, lemon juice, corn starch, all purpose flour, baking powder, eggs, vanilla sugar, condensed milk, unsalted butter, cream cheese, powdered sugar, heavy whipping cream, chocolate."
  },
  {
    title: "Chocolate orange cookies with nuts",
    id: "4",
    price: 10,
    description: "Contains: all purpose flour, cocoa powder, baking powder, sunflower oil, powdered sugar, orange juice, zest of orange, cashews, almonds, pecans."
  },
  {
    title: "Cottage cheese cookies",
    id: "5",
    price: 10,
    description: "Contains: all purpose flour, baking powder, unsalted butter, cottage cheese, sugar, vanilla sugar."
  },
  {
    title: "Crepe cake with berry and cottage  cheese filling",
    id: "6",
    price: 20,
    description: "Contains: milk, eggs, all purpose flour, sugar, sunflower oil, salt, strawberry, blueberry, raspberry, water, corn starch, sour cream, cottage cheese, heavy whipping cream, powdered sugar."
  },
]
