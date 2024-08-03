const DefaultClothingItems = [
  {
    _id: "default-cap",
    name: "Cap",
    weather: ["hot"],
    types: ["Sunny"],
    imageUrl:
      "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Cap.png?etag=f3dad389b22909cafa73cff9f9a3d591",
    isDefault: true,
    likes: [],
  },
  {
    _id: "default-jacket",
    name: "Jacket",
    weather: ["cold"],
    types: ["Cloudy", "Rain", "Storm"],
    imageUrl:
      "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Jacket.png?etag=f4bb188deaa25ac84ce2338be2d404ad",
    isDefault: true,
    likes: [],
  },
  {
    _id: "default-sneakers",
    name: "Sneakers",
    weather: ["hot"],
    types: ["Sunny", "Cloudy"],
    imageUrl:
      "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Sneakers.png?etag=3efeec41c1c78b8afe26859ca7fa7b6f",
    isDefault: true,
    likes: [],
  },
  {
    _id: "default-tshirt",
    name: "T-Shirt",
    weather: ["warm"],
    types: ["Sunny", "Cloudy"],
    imageUrl:
      "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/T-Shirt.png?etag=44ed1963c44ab19cd2f5011522c5fc09",
    isDefault: true,
    likes: [],
  },
];

module.exports = DefaultClothingItems;
