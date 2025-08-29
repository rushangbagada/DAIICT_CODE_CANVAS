const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Gallery = require('./models/gallery');

dotenv.config();

async function main() {
  await mongoose.connect(process.env.MONGO_URI);

  const new_gallery = [
    {
      id: 1,
      title: "Football",
      image: "public/football.jpg",
      description: "Description",
      category: "Football",
      likes: 0,
      views: 0
    },
    {
      id: 2,
      title: "Basketball",
      image: "public/basketball.jpg",
      description: "Description",
      category: "Basketball",
      likes: 0,
      views: 0
    },
    {
      id: 3,
      title: "Tennis",
      image: "public/tennis.jpg",
      description: "Description",
      category: "Tennis",
      likes: 0,
      views: 0
    },
    {
      id: 4,
      title: "Volleyball",
      image: "public/volleyball.jpg",
      description: "Description",
      category: "Volleyball",
      likes: 0,
      views: 0
    },
    {
      id: 5,
      title: "Baseball",
      image: "public/baseball.jpg",
      description: "Description",
      category: "Baseball",
      likes: 0,
      views: 0
    },
    {
      id: 6,
      title: "Soccer",
      image: "public/soccer.jpg",
      description: "Description",
      category: "Soccer",
      likes: 0,
      views: 0
    }
  ];

  try {
    await Gallery.deleteMany({}); // Clear existing data
    const res = await Gallery.insertMany(new_gallery);
    console.log('Inserted gallery items:', res);
  } catch (err) {
    console.error('Error inserting gallery items:', err);
  } finally {
    mongoose.disconnect();
  }
}

main(); 