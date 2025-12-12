import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";

dotenv.config();


const dummyCastsData = [
  { name: "Milla Jovovich", profile_path: "https://image.tmdb.org/t/p/original/usWnHCzbADijULREZYSJ0qfM00y.jpg" },
  { name: "Dave Bautista", profile_path: "https://image.tmdb.org/t/p/original/snk6JiXOOoRjPtHU5VMoy6qbd32.jpg" },
  { name: "Arly Jover", profile_path: "https://image.tmdb.org/t/p/original/zmznPrQ9GSZwcOIUT0c3GyETwrP.jpg" },
];

const dummyMovies = [
  {
    title: "In the Lost Lands",
    overview:
      "A queen sends the powerful and feared sorceress Gray Alys to the ghostly wilderness of the Lost Lands in search of a magical power, where she and her guide, the drifter Boyce, must outwit and outfight both man and demon.",
    poster_path: "https://image.tmdb.org/t/p/original/dDlfjR7gllmr8HTeN6rfrYhTdwX.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/op3qmNhvwEvyT7UFyPbIfQmKriB.jpg",
    genres: [
      { id: 28, name: "Action" },
      { id: 14, name: "Fantasy" },
      { id: 12, name: "Adventure" },
    ],
    casts: dummyCastsData,
    release_date: "2025-02-27",
    runtime: 102,
    vote_average: 6.4,
    vote_count: 15000,
    isNowShowing: true,
  },
  {
    title: "Until Dawn",
    overview:
      "One year after her sister Melanie mysteriously disappeared, Clover and her friends head into the remote valley where she vanished in search of answers.",
    poster_path: "https://img.youtube.com/vi/juA4IWO52Fecx8lhAsxmDgy3M3.jpg".replace(
      "img.youtube.com/vi/",
      "image.tmdb.org/t/p/original/"
    ), 
    backdrop_path: "https://image.tmdb.org/t/p/original/icFWIk1KfkWLZnugZAJEDauNZ94.jpg",
    genres: [
      { id: 27, name: "Horror" },
      { id: 9648, name: "Mystery" },
    ],
    casts: dummyCastsData,
    release_date: "2025-04-23",
    runtime: 103,
    vote_average: 6.4,
    vote_count: 18000,
    isNowShowing: true,
  },
  {
    title: "Lilo & Stitch",
    overview:
      "The wildly funny and touching story of a lonely Hawaiian girl and the fugitive alien who helps to mend her broken family.",
    poster_path: "https://image.tmdb.org/t/p/original/mKKqV23MQ0uakJS8OCE2TfV5jNS.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/7Zx3wDG5bBtcfk8lcnCWDOLM4Y4.jpg",
    genres: [
      { id: 10751, name: "Family" },
      { id: 35, name: "Comedy" },
      { id: 878, name: "Science Fiction" },
    ],
    casts: dummyCastsData,
    release_date: "2025-05-17",
    runtime: 108,
    vote_average: 7.1,
    vote_count: 27500,
    isNowShowing: true,
  },
  {
    title: "Havoc",
    overview:
      "When a drug heist swerves lethally out of control, a jaded cop fights his way through a corrupt city's criminal underworld to save a politician's son.",
    poster_path: "https://image.tmdb.org/t/p/original/ubP2OsF3GlfqYPvXyLw9d78djGX.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/65MVgDa6YjSdqzh7YOA04mYkioo.jpg",
    genres: [
      { id: 28, name: "Action" },
      { id: 80, name: "Crime" },
      { id: 53, name: "Thriller" },
    ],
    casts: dummyCastsData,
    release_date: "2025-04-25",
    runtime: 107,
    vote_average: 6.5,
    vote_count: 35960,
    isNowShowing: true,
  },
];

const dummyActiveShows = [
  {
    movieTitle: "In the Lost Lands",
    showDateTime: "2025-06-30T02:30:00.000Z",
    showPrice: 59,
    occupiedSeats: {
      A1: "user_demo",
      B1: "user_demo",
      C1: "user_demo",
    },
  },
  {
    movieTitle: "Until Dawn",
    showDateTime: "2025-06-30T15:30:00.000Z",
    showPrice: 81,
    occupiedSeats: {},
  },
  {
    movieTitle: "Lilo & Stitch",
    showDateTime: "2025-06-30T03:30:00.000Z",
    showPrice: 81,
    occupiedSeats: {},
  },
  {
    movieTitle: "Havoc",
    showDateTime: "2025-07-15T16:30:00.000Z",
    showPrice: 81,
    occupiedSeats: {
      A1: "user_demo",
      A2: "user_demo",
      A3: "user_demo",
      A4: "user_demo",
    },
  },
];

const seed = async () => {
  try {
    await connectDB();

    console.log("🧹 Clearing existing movies & shows...");
    await Movie.deleteMany({});
    await Show.deleteMany({});

    console.log("🎬 Inserting movies...");
    const insertedMovies = await Movie.insertMany(dummyMovies);

    const movieIdByTitle = {};
    insertedMovies.forEach((m) => {
      movieIdByTitle[m.title] = m._id;
    });

    console.log("🎭 Inserting shows...");
    const showDocs = dummyActiveShows
      .map((s) => {
        const movieId = movieIdByTitle[s.movieTitle];
        if (!movieId) return null;

        return {
          movie: movieId,
          hallName: "Hall 1",
          showDateTime: new Date(s.showDateTime),
          showPrice: s.showPrice,
          occupiedSeats: s.occupiedSeats || {},
          isActive: true,
        };
      })
      .filter(Boolean);

    await Show.insertMany(showDocs);

    console.log("✅ Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
};

seed();
