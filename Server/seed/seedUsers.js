import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import { User } from "../model/user.js"; // Adjust the path as necessary
dotenv.config();

import connectDB from "../ConfigDatabase/mongoDb.js"; // Adjust the path as necessary

connectDB();

const createFakeUser = (role = "buyer") => {
  const baseUser = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(10),
    role,
  };

  if (role === "seller") {
    return {
      ...baseUser,
      businessName: faker.company.name(),
      businessAddress: faker.location.streetAddress(),
      businessDecription: faker.company.catchPhrase(),
      phoneNumber: faker.phone.number(),
      businessPhoneNumber: faker.phone.number(),
    };
  }

  return baseUser;
};

const seedUsers = async () => {
  await connectDB();

  console.log("Seeding users...");

  await User.deleteMany(); // Clear old data
  console.log("Old users removed");

  const users = [];

  for (let i = 0; i < 5; i++) {
    users.push(createFakeUser("buyer"));
  }

  for (let i = 0; i < 5; i++) {
    users.push(createFakeUser("seller"));
  }

  await User.insertMany(users);
  console.log("Users seeded");

  mongoose.disconnect();
};

seedUsers();
