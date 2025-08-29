const mongoose = require('mongoose');
const Review = require('./models/review');
const connectDB = require('./config/db');

connectDB();

const all_reviews = [
  {
    name: "John Smith",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    position: "Basketball Captain",
    review: "Amazing experience with the sports hub! The facilities are top-notch and the community is very supportive. I've improved my skills significantly since joining."
  },
  {
    name: "Sarah Johnson",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    position: "Tennis Player",
    review: "The tennis club has been incredible. Great coaching staff and regular tournaments keep me motivated. Highly recommend for anyone interested in tennis!"
  },
  {
    name: "Mike Davis",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    position: "Football Team Member",
    review: "Best sports community I've ever been part of. The football team is like a family, and we've won several inter-college tournaments together."
  },
  {
    name: "Lisa Chen",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    position: "Badminton Champion",
    review: "The badminton facilities are excellent and the competition is fierce. I've made great friends and improved my game tremendously."
  },
  {
    name: "Rahul Sharma",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    position: "Cricket Team Captain",
    review: "Fantastic cricket ground and equipment. The team spirit is amazing and we've had some memorable matches. Great place for cricket enthusiasts!"
  },
  {
    name: "Emma Wilson",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    position: "Swimming Coach",
    review: "The swimming pool is well-maintained and the coaching program is excellent. Students of all levels can learn and improve here."
  }
];

Review.insertMany(all_reviews)
  .then((res) => {
    console.log("✅ Reviews initialized successfully:", res.length, "reviews added");
    process.exit(0);
  })
  .catch((err) => {
    console.log("❌ Error initializing reviews:", err);
    process.exit(1);
  }); 