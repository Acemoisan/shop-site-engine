// Icon pool for food entries — emoji, so it's a huge pre-made set with zero
// bundle cost, native rendering, and universal meaning. Grouped for browsing,
// keyworded for search. `c` = character, `k` = space-separated search keywords.

export interface EmojiEntry { c: string; k: string }
export interface EmojiGroup { name: string; items: EmojiEntry[] }

export const EMOJI_GROUPS: EmojiGroup[] = [
  {
    name: "Fruit",
    items: [
      { c: "🍎", k: "apple red fruit" }, { c: "🍏", k: "apple green fruit" },
      { c: "🍐", k: "pear fruit" }, { c: "🍊", k: "orange tangerine citrus fruit" },
      { c: "🍋", k: "lemon citrus sour" }, { c: "🍌", k: "banana fruit" },
      { c: "🍉", k: "watermelon melon fruit" }, { c: "🍇", k: "grapes fruit" },
      { c: "🍓", k: "strawberry berry fruit" }, { c: "🫐", k: "blueberries berry fruit" },
      { c: "🍈", k: "melon fruit" }, { c: "🍒", k: "cherries fruit" },
      { c: "🍑", k: "peach fruit" }, { c: "🥭", k: "mango fruit tropical" },
      { c: "🍍", k: "pineapple fruit tropical" }, { c: "🥥", k: "coconut fruit" },
      { c: "🥝", k: "kiwi fruit" }, { c: "🍅", k: "tomato fruit veg" },
      { c: "🫒", k: "olive oil fruit" }, { c: "🥑", k: "avocado fat fruit" },
    ],
  },
  {
    name: "Vegetables",
    items: [
      { c: "🥦", k: "broccoli veg green" }, { c: "🥬", k: "leafy greens lettuce veg" },
      { c: "🥒", k: "cucumber veg pickle" }, { c: "🌶️", k: "chili pepper spicy hot" },
      { c: "🫑", k: "bell pepper veg" }, { c: "🌽", k: "corn maize veg" },
      { c: "🥕", k: "carrot veg" }, { c: "🧄", k: "garlic" },
      { c: "🧅", k: "onion" }, { c: "🥔", k: "potato veg carb" },
      { c: "🍠", k: "sweet potato yam veg carb" }, { c: "🫘", k: "beans legume protein" },
      { c: "🍄", k: "mushroom fungi veg" }, { c: "🥗", k: "salad veg bowl green" },
      { c: "🫛", k: "peas pods veg" }, { c: "🥜", k: "peanut nut fat protein" },
    ],
  },
  {
    name: "Protein & meat",
    items: [
      { c: "🍗", k: "chicken poultry drumstick meat protein" }, { c: "🍖", k: "meat bone protein" },
      { c: "🥩", k: "steak beef red meat protein" }, { c: "🥓", k: "bacon pork meat fat" },
      { c: "🍤", k: "shrimp prawn seafood protein" }, { c: "🦐", k: "shrimp seafood protein" },
      { c: "🦑", k: "squid calamari seafood" }, { c: "🦞", k: "lobster seafood" },
      { c: "🦀", k: "crab seafood" }, { c: "🐟", k: "fish seafood protein" },
      { c: "🐠", k: "fish seafood" }, { c: "🍣", k: "sushi fish rice" },
      { c: "🍥", k: "fishcake seafood" }, { c: "🥚", k: "egg protein" },
      { c: "🍳", k: "fried egg cooking breakfast protein" }, { c: "🌭", k: "hotdog sausage meat" },
      { c: "🧆", k: "falafel meatball protein" }, { c: "🫗", k: "pouring liquid oil" },
    ],
  },
  {
    name: "Dairy & drinks",
    items: [
      { c: "🥛", k: "milk dairy glass drink" }, { c: "🧀", k: "cheese dairy" },
      { c: "🧈", k: "butter dairy fat" }, { c: "🍦", k: "ice cream dairy dessert" },
      { c: "🥤", k: "cup drink shake protein soda" }, { c: "🧋", k: "bubble tea boba drink" },
      { c: "☕", k: "coffee drink hot caffeine" }, { c: "🍵", k: "tea green drink hot" },
      { c: "🧃", k: "juice box drink" }, { c: "🥤", k: "soda pop drink" },
      { c: "💧", k: "water drop hydration drink" }, { c: "🫖", k: "teapot drink hot" },
      { c: "🍶", k: "sake bottle drink" }, { c: "🍺", k: "beer drink alcohol" },
      { c: "🍷", k: "wine drink alcohol" }, { c: "🥂", k: "champagne cheers drink" },
      { c: "🍹", k: "cocktail drink" }, { c: "🧉", k: "mate drink" },
    ],
  },
  {
    name: "Grains & bread",
    items: [
      { c: "🍞", k: "bread loaf carb wheat" }, { c: "🥖", k: "baguette bread carb" },
      { c: "🥐", k: "croissant pastry carb" }, { c: "🥨", k: "pretzel carb snack" },
      { c: "🥯", k: "bagel bread carb" }, { c: "🫓", k: "flatbread naan pita carb" },
      { c: "🥞", k: "pancakes breakfast carb" }, { c: "🧇", k: "waffle breakfast carb" },
      { c: "🍚", k: "rice bowl carb" }, { c: "🍙", k: "rice ball onigiri carb" },
      { c: "🍘", k: "rice cracker carb snack" }, { c: "🍜", k: "noodles ramen soup carb" },
      { c: "🍝", k: "pasta spaghetti carb" }, { c: "🥣", k: "bowl cereal oats breakfast" },
      { c: "🌾", k: "grain wheat oat cereal" }, { c: "🥟", k: "dumpling carb" },
    ],
  },
  {
    name: "Meals & fast food",
    items: [
      { c: "🍔", k: "burger fast food meat" }, { c: "🍟", k: "fries chips fast food" },
      { c: "🍕", k: "pizza fast food" }, { c: "🌮", k: "taco mexican" },
      { c: "🌯", k: "burrito wrap mexican" }, { c: "🥙", k: "wrap kebab gyro pita" },
      { c: "🥪", k: "sandwich lunch" }, { c: "🍱", k: "bento box meal lunch" },
      { c: "🍲", k: "stew soup pot meal" }, { c: "🍛", k: "curry rice meal" },
      { c: "🥘", k: "paella pan meal" }, { c: "🍜", k: "ramen noodle soup" },
      { c: "🍢", k: "oden skewer" }, { c: "🍡", k: "dango skewer sweet" },
      { c: "🍧", k: "shaved ice dessert" }, { c: "🍨", k: "ice cream dessert" },
    ],
  },
  {
    name: "Sweets & snacks",
    items: [
      { c: "🍩", k: "donut sweet snack" }, { c: "🍪", k: "cookie sweet snack" },
      { c: "🎂", k: "cake birthday sweet dessert" }, { c: "🍰", k: "cake slice sweet dessert" },
      { c: "🧁", k: "cupcake sweet dessert" }, { c: "🥧", k: "pie sweet dessert" },
      { c: "🍫", k: "chocolate sweet snack" }, { c: "🍬", k: "candy sweet snack" },
      { c: "🍭", k: "lollipop sweet candy" }, { c: "🍮", k: "custard pudding sweet" },
      { c: "🍯", k: "honey sweet" }, { c: "🍿", k: "popcorn snack" },
      { c: "🧂", k: "salt seasoning" }, { c: "🥠", k: "fortune cookie snack" },
      { c: "🍡", k: "sweet dango snack" }, { c: "🍢", k: "skewer snack" },
    ],
  },
  {
    name: "Cooking & health",
    items: [
      { c: "🍽️", k: "plate fork knife meal dinner" }, { c: "🍴", k: "fork knife cutlery eat" },
      { c: "🥄", k: "spoon eat" }, { c: "🔪", k: "knife cooking prep" },
      { c: "🥢", k: "chopsticks eat" }, { c: "🧑‍🍳", k: "chef cook" },
      { c: "🫙", k: "jar storage" }, { c: "🥫", k: "canned food tin" },
      { c: "💊", k: "pill supplement vitamin" }, { c: "🧴", k: "bottle supplement oil" },
      { c: "🩸", k: "blood drop" }, { c: "🔥", k: "calories burn energy hot" },
      { c: "⚡", k: "energy fast power" }, { c: "🏋️", k: "gym lift workout" },
      { c: "💪", k: "muscle protein strength" }, { c: "🏃", k: "run cardio exercise" },
      { c: "⚖️", k: "scale weight balance" }, { c: "🎯", k: "target goal" },
    ],
  },
  {
    name: "General",
    items: [
      { c: "⭐", k: "star favorite" }, { c: "❤️", k: "heart love favorite" },
      { c: "✅", k: "check done tick" }, { c: "🔖", k: "bookmark tag" },
      { c: "📌", k: "pin marker" }, { c: "🏷️", k: "label tag" },
      { c: "🥇", k: "gold medal first" }, { c: "🌙", k: "moon night" },
      { c: "☀️", k: "sun morning day" }, { c: "🍀", k: "clover luck green" },
      { c: "🌱", k: "sprout plant vegan green" }, { c: "🧊", k: "ice cold cube" },
      { c: "🎉", k: "party celebrate treat" }, { c: "🕒", k: "clock time" },
      { c: "📦", k: "box package" }, { c: "🧺", k: "basket groceries" },
    ],
  },
];

// Flattened, de-duplicated list (drops the accidental empties/dupes above).
export const ALL_EMOJI: EmojiEntry[] = (() => {
  const seen = new Set<string>();
  const out: EmojiEntry[] = [];
  for (const g of EMOJI_GROUPS) {
    for (const it of g.items) {
      if (!it.c || it.c.length > 8 || seen.has(it.c) || !it.k) continue;
      seen.add(it.c);
      out.push(it);
    }
  }
  return out;
})();

export function searchEmoji(q: string): EmojiEntry[] {
  const s = q.trim().toLowerCase();
  if (!s) return ALL_EMOJI;
  return ALL_EMOJI.filter((e) => e.k.includes(s) || e.c === q);
}
