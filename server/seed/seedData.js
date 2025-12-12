import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import Booking from "../models/Booking.js";


dotenv.config();

const TMDB_IMAGE_BASE = "https://media.themoviedb.org/t/p";
const img = (pathOrUrl) => {
  if (!pathOrUrl) return "";
  if (pathOrUrl.startsWith("http")) return pathOrUrl;
 return `${TMDB_IMAGE_BASE}${pathOrUrl}`;
};
const cast = (...names) =>
  names.map((name) => ({
    name,
    profile_path: "",
  }));
const seedMovies = [
  {
    title: "Inception",
    overview:
      "A skilled thief enters people's dreams to steal secrets, but a final mission could change everything.",
    poster_path: "/w600_and_h900_face/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg", 
    backdrop_path: "/w1066_and_h600_face/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg", 
    genres: [
      { id: 28, name: "Action" },
      { id: 878, name: "Science Fiction" },
      { id: 53, name: "Thriller" },
    ],
    casts: cast("Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"),
    release_date: "2010-07-16",
    runtime: 148,
    vote_average: 8.3,
    vote_count: 0,
    isNowShowing: true,
  },
  {
    title: "Shutter Island",
    overview:
      "A U.S. Marshal investigates a psychiatric facility on an isolated island, uncovering shocking truths.",
    poster_path: "/w600_and_h900_face/nrmXQ0zcZUL8jFLrakWc90IR8z9.jpg", 
    backdrop_path: "/w1066_and_h600_face/rbZvGN1A1QyZuoKzhCw8QPmf2q0.jpg", 
    genres: [
      { id: 9648, name: "Mystery" },
      { id: 53, name: "Thriller" },
      { id: 18, name: "Drama" },
    ],
    casts: cast("Leonardo DiCaprio", "Mark Ruffalo", "Ben Kingsley"),
    release_date: "2010-02-19",
    runtime: 138,
    vote_average: 8.2,
    vote_count: 0,
    isNowShowing: true,
  },
  {
    title: "The Matrix",
    overview:
      "A computer hacker learns the truth about reality and his role in the war against its controllers.",
    poster_path: "/w600_and_h900_face/qK76PKQLd6zlMn0u83Ej9YQOqPL.jpg", 
    backdrop_path: "/w1066_and_h600_face/tlm8UkiQsitc8rSuIAscQDCnP8d.jpg", 
    genres: [
      { id: 28, name: "Action" },
      { id: 878, name: "Science Fiction" },
    ],
    casts: cast("Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"),
    release_date: "1999-03-31",
    runtime: 136,
    vote_average: 8.2,
    vote_count: 0,
    isNowShowing: true,
  },

  {
    title: "The Green Mile",
    overview:
      "A death row guard witnesses extraordinary events after meeting an inmate with a mysterious gift.",
    poster_path: "/w600_and_h900_face/o0lO84GI7qrG6XFvtsPOSV7CTNa.jpg", 
    backdrop_path: "/w1066_and_h600_face/b6HWTOxn1xevvyHU2K9ICvaRU6g.jpg", 
    genres: [
      { id: 18, name: "Drama" },
      { id: 14, name: "Fantasy" },
      { id: 80, name: "Crime" },
    ],
    casts: cast("Tom Hanks", "Michael Clarke Duncan", "David Morse"),
    release_date: "1999-12-10",
    runtime: 189,
    vote_average: 8.6,
    vote_count: 0,
    isNowShowing: true,
  },
  {
    title: "Forrest Gump",
    overview:
      "The life journey of Forrest Gump unfolds through love, friendship, and historic moments.",
    poster_path: "/w600_and_h900_face/saHP97rTPS5eLmrLQEcANmKrsFl.jpg", 
    backdrop_path: "/w1066_and_h600_face/67HggiWaP9ZLv5sPYmyRV37yAJM.jpg", 
    genres: [
      { id: 35, name: "Comedy" },
      { id: 18, name: "Drama" },
      { id: 10749, name: "Romance" },
    ],
    casts: cast("Tom Hanks", "Robin Wright", "Gary Sinise"),
    release_date: "1994-07-06",
    runtime: 142,
    vote_average: 8.5,
    vote_count: 0,
    isNowShowing: true,
  },
  {
    title: "The Pianist",
    overview:
      "A Polish Jewish musician struggles to survive during World War II in occupied Warsaw.",
    poster_path: "/w600_and_h900_face/2hFvxCCWrTmCYwfy7yum0GKRi3Y.jpg", 
    backdrop_path: "/w1066_and_h600_face/jZGNfJUGUj5U1bbr3GYrmKBnrIF.jpg", 
    genres: [
      { id: 18, name: "Drama" },
      { id: 10752, name: "War" },
    ],
    casts: cast("Adrien Brody", "Thomas Kretschmann", "Emilia Fox"),
    release_date: "2002-09-24",
    runtime: 150,
    vote_average: 8.5,
    vote_count: 0,
    isNowShowing: true,
  },

  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    overview:
      "A hobbit begins a journey with allies to destroy a powerful ring and defeat darkness.",
    poster_path: "/w600_and_h900_face/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg", 
    backdrop_path: "/w1066_and_h600_face/x2RS3uTcsJJ9IfjNPcgDmukoEcQ.jpg", 
    genres: [
      { id: 12, name: "Adventure" },
      { id: 14, name: "Fantasy" },
      { id: 28, name: "Action" },
    ],
    casts: cast("Elijah Wood", "Ian McKellen", "Viggo Mortensen"),
    release_date: "2001-12-19",
    runtime: 178,
    vote_average: 8.8,
    vote_count: 0,
    isNowShowing: true,
  },
  {
    title: "The Lord of the Rings: The Two Towers",
    overview:
      "The fellowship is broken, but the journey continues as war approaches Middle-earth.",
    poster_path: "/w600_and_h900_face/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg", 
    backdrop_path: "/w1066_and_h600_face/mshaKLtPUxcDBhzau6qiObEblhL.jpg", 
    genres: [
      { id: 12, name: "Adventure" },
      { id: 14, name: "Fantasy" },
      { id: 28, name: "Action" },
    ],
    casts: cast("Elijah Wood", "Ian McKellen", "Viggo Mortensen"),
    release_date: "2002-12-18",
    runtime: 179,
    vote_average: 8.8,
    vote_count: 0,
    isNowShowing: true,
  },
  {
    title: "The Lord of the Rings: The Return of the King",
    overview:
      "The final battle for Middle-earth begins as the ring bearer approaches Mount Doom.",
    poster_path: "/w600_and_h900_face/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg", 
    backdrop_path: "/w1066_and_h600_face/2u7zbn8EudG6kLlBzUYqP8RyFU4.jpg", 
    genres: [
      { id: 12, name: "Adventure" },
      { id: 14, name: "Fantasy" },
      { id: 28, name: "Action" },
    ],
    casts: cast("Elijah Wood", "Ian McKellen", "Viggo Mortensen"),
    release_date: "2003-12-17",
    runtime: 201,
    vote_average: 9.0,
    vote_count: 0,
    isNowShowing: true,
  },

  {
    title: "Harry Potter and the Philosopher's Stone",
    overview:
      "An orphan discovers he is a wizard and begins his first year at Hogwarts School of Witchcraft and Wizardry.",
    poster_path: "/w600_and_h900_face/wuMc08IPKEatf9rnMNXvIDxqP4W.jpg", 
    backdrop_path: "/w1066_and_h600_face/bfh9Z3Ghz4FOJAfLOAhmc3ccnHU.jpg",
    genres: [
      { id: 12, name: "Adventure" },
      { id: 14, name: "Fantasy" },
      { id: 10751, name: "Family" },
    ],
    casts: cast("Daniel Radcliffe", "Emma Watson", "Rupert Grint"),
    release_date: "2001-11-16",
    runtime: 152,
    vote_average: 7.6,
    vote_count: 0,
    isNowShowing: true,
  },
  {
    title: "Harry Potter and the Chamber of Secrets",
    overview:
      "Harry returns to Hogwarts, where a dark force threatens students and a secret chamber is rumored to be opened.",
    poster_path: "/w600_and_h900_face/sdEOH0992YZ0QSxgXNIGLq1ToUi.jpg", 
    backdrop_path: "/w1066_and_h600_face/7tbeoSTWW2cWPecjQo9fcdf0Hzv.jpg", 
    genres: [
      { id: 12, name: "Adventure" },
      { id: 14, name: "Fantasy" },
      { id: 10751, name: "Family" },
    ],
    casts: cast("Daniel Radcliffe", "Emma Watson", "Rupert Grint"),
    release_date: "2002-11-15",
    runtime: 161,
    vote_average: 7.4,
    vote_count: 0,
    isNowShowing: true,
  },

  {
    title: "The Purge",
    overview:
      "For one night each year, all crime is legal, forcing a family to survive the chaos.",
    poster_path: "/w600_and_h900_face/46X1ei9uf13nkkr0OhWldGyr5Uh.jpg", 
    backdrop_path: "/w1066_and_h600_face/k1JpGFnYhpkxxFwMKPfXdrWU9R4.jpg", 
    genres: [
      { id: 27, name: "Horror" },
      { id: 53, name: "Thriller" },
    ],
    casts: cast("Ethan Hawke", "Lena Headey", "Max Burkholder"),
    release_date: "2013-06-07",
    runtime: 85,
    vote_average: 6.4,
    vote_count: 0,
    isNowShowing: true,
  },

  {
    title: "Inside Out",
    overview:
      "A girl’s emotions—Joy, Sadness, Fear, Disgust, and Anger—guide her through a life-changing move.",
    poster_path: "/w600_and_h900_face/2H1TmgdfNtsKlU9jKdeNyYL5y8T.jpg", 
    backdrop_path: "/w1066_and_h600_face/jJKZaTBNenlFclQyjrnvzkRmvWE.jpg", 
    genres: [
      { id: 16, name: "Animation" },
      { id: 10751, name: "Family" },
      { id: 12, name: "Adventure" },
    ],
    casts: cast("Amy Poehler", "Phyllis Smith", "Bill Hader"),
    release_date: "2015-06-19",
    runtime: 95,
    vote_average: 8.1,
    vote_count: 0,
    isNowShowing: true,
  },
  {
    title: "Shrek",
    overview:
      "An ogre sets out on a quest to rescue a princess and discovers unexpected friendship and love.",
    poster_path: "/w600_and_h900_face/iB64vpL3dIObOtMZgX3RqdVdQDc.jpg", 
    backdrop_path: "/w1066_and_h600_face/40Wtp7kMG6mZ4d5T1jfrd8qrvD4.jpg", 
    genres: [
      { id: 16, name: "Animation" },
      { id: 35, name: "Comedy" },
      { id: 10751, name: "Family" },
    ],
    casts: cast("Mike Myers", "Eddie Murphy", "Cameron Diaz"),
    release_date: "2001-06-22",
    runtime: 90,
    vote_average: 7.7,
    vote_count: 0,
    isNowShowing: true,
  },
  {
    title: "Frozen",
    overview:
      "A fearless princess sets off to find her sister, whose icy powers have trapped their kingdom in eternal winter.",
    poster_path: "/w600_and_h900_face/itAKcobTYGpYT8Phwjd8c9hleTo.jpg", 
    backdrop_path: "/w1066_and_h600_face/cBeP4gkMmlPuCCZdTgCOPi1rUHZ.jpg", 
    genres: [
      { id: 16, name: "Animation" },
      { id: 10751, name: "Family" },
      { id: 12, name: "Adventure" },
    ],
    casts: cast("Kristen Bell", "Idina Menzel", "Josh Gad"),
    release_date: "2013-11-27",
    runtime: 102,
    vote_average: 7.3,
    vote_count: 0,
    isNowShowing: true,
  },
  {
    title: "Tinker Bell",
    overview:
      "A curious fairy learns where she fits in the fairy world and discovers her unique talents.",
    poster_path: "/w600_and_h900_face/3Ma0r1n8kfH7UaQMS7bJ9KsYUjT.jpg",
    backdrop_path: "/w1066_and_h600_face/maeox8nZYIxAAE4SdyLA0VOXe1x.jpg", 
    genres: [
      { id: 16, name: "Animation" },
      { id: 10751, name: "Family" },
      { id: 14, name: "Fantasy" },
    ],
    casts: cast("Mae Whitman", "Kristin Chenoweth", "Raven-Symoné"),
    release_date: "2008-10-28",
    runtime: 78,
    vote_average: 6.8,
    vote_count: 0,
    isNowShowing: true,
  },
  {
    title: "Barbie",
    overview:
      "Barbie ventures into the real world and discovers a life-changing journey of identity and belonging.",
    poster_path: "/w600_and_h900_face/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg", 
    backdrop_path: "/w1066_and_h600_face/ldFX26JW3fusyMewRoWoXYWaffw.jpg", 
    genres: [
      { id: 35, name: "Comedy" },
      { id: 12, name: "Adventure" },
      { id: 14, name: "Fantasy" },
    ],
    casts: cast("Margot Robbie", "Ryan Gosling", "America Ferrera"),
    release_date: "2023-07-21",
    runtime: 114,
    vote_average: 7.0,
    vote_count: 0,
    isNowShowing: true,
  },
  {
    title: "Up",
    overview:
      "A retired balloon salesman fulfills his dream by flying his house to South America, joined by an eager boy scout.",
    poster_path: "/w600_and_h900_face/mFvoEwSfLqbcWwFsDjQebn9bzFe.jpg", 
    backdrop_path: "/w1066_and_h600_face/hGGC9gKo7CFE3fW07RA587e5kol.jpg", 
    genres: [
      { id: 16, name: "Animation" },
      { id: 10751, name: "Family" },
      { id: 12, name: "Adventure" },
    ],
    casts: cast("Ed Asner", "Jordan Nagai", "Christopher Plummer"),
    release_date: "2009-05-29",
    runtime: 96,
    vote_average: 8.2,
    vote_count: 0,
    isNowShowing: true,
  },
  {
    title: "Ratatouille",
    overview:
      "A rat with a passion for cooking teams up with a young man in Paris to create culinary magic.",
    poster_path: "/w600_and_h900_face/t3vaWRPSf6WjDSamIkKDs1iQWna.jpg", 
    backdrop_path: "/w1066_and_h600_face/xgDj56UWyeWQcxQ44f5A3RTWuSs.jpg", 
    genres: [
      { id: 16, name: "Animation" },
      { id: 35, name: "Comedy" },
      { id: 10751, name: "Family" },
    ],
    casts: cast("Patton Oswalt", "Lou Romano", "Ian Holm"),
    release_date: "2007-06-29",
    runtime: 111,
    vote_average: 8.1,
    vote_count: 0,
    isNowShowing: true,
  },
  {
    title: "Cars",
    overview:
      "A hotshot race car finds a new perspective on life after getting stranded in a small town.",
    poster_path: "/w600_and_h900_face/2Touk3m5gzsqr1VsvxypdyHY5ci.jpg",
    backdrop_path: "/w1066_and_h600_face/sd4xN5xi8tKRPrJOWwNiZEile7f.jpg", 
    genres: [
      { id: 16, name: "Animation" },
      { id: 12, name: "Adventure" },
      { id: 10751, name: "Family" },
    ],
    casts: cast("Owen Wilson", "Paul Newman", "Bonnie Hunt"),
    release_date: "2006-06-09",
    runtime: 117,
    vote_average: 7.0,
    vote_count: 0,
    isNowShowing: true,
  },
  {
    title: "Finding Nemo",
    overview:
      "After his son is captured, a timid clownfish sets out on an ocean journey to bring him home.",
    poster_path: "/w600_and_h900_face/eHuGQ10FUzK1mdOY69wF5pGgEf5.jpg", 
    backdrop_path: "/w1066_and_h600_face/eCynaAOgYYiw5yN5lBwz3IxqvaW.jpg", 
    genres: [
      { id: 16, name: "Animation" },
      { id: 10751, name: "Family" },
      { id: 12, name: "Adventure" },
    ],
    casts: cast("Albert Brooks", "Ellen DeGeneres", "Alexander Gould"),
    release_date: "2003-05-30",
    runtime: 100,
    vote_average: 8.1,
    vote_count: 0,
    isNowShowing: true,
  },
  {
    title: "The Smurfs",
    overview:
      "Tiny blue creatures are chased into the real world by an evil wizard and must find a way back home.",
    poster_path: "/w600_and_h900_face/vRhnslP2gW0QDym7BsMeSuioUfK.jpg",
    backdrop_path: "/w1066_and_h600_face/x4fzwgAkVQN363otGdO07OkF9mA.jpg", 
    genres: [
      { id: 10751, name: "Family" },
      { id: 35, name: "Comedy" },
      { id: 14, name: "Fantasy" },
    ],
    casts: cast("Neil Patrick Harris", "Jayma Mays", "Hank Azaria"),
    release_date: "2011-07-29",
    runtime: 103,
    vote_average: 5.8,
    vote_count: 0,
    isNowShowing: true,
  },

  {
    title: "Avatar",
    overview:
      "A paraplegic Marine is sent to Pandora and becomes torn between following orders and protecting a new world.",
    poster_path: "/w600_and_h900_face/gKY6q7SjCkAU6FqvqWybDYgUKIF.jpg", 
    backdrop_path: "/w1066_and_h600_face/7JNzw1tSZZEgsBw6lu0VfO2X2Ef.jpg",
    genres: [
      { id: 28, name: "Action" },
      { id: 12, name: "Adventure" },
      { id: 14, name: "Fantasy" },
      { id: 878, name: "Science Fiction" },
    ],
    casts: cast("Sam Worthington", "Zoe Saldaña", "Sigourney Weaver"),
    release_date: "2009-12-18",
    runtime: 162,
    vote_average: 7.6,
    vote_count: 0,
    isNowShowing: true,
  },
  {
    title: "Avatar: The Way of Water",
    overview:
      "Jake Sully lives with his newfound family on Pandora, but a familiar threat returns to finish what was started.",
    poster_path: "/w600_and_h900_face/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg", 
    backdrop_path: "/w1066_and_h600_face/cd8YDn7M0lfaHhZdU6MvCDxPalP.jpg", 
    genres: [
      { id: 28, name: "Action" },
      { id: 12, name: "Adventure" },
      { id: 14, name: "Fantasy" },
      { id: 878, name: "Science Fiction" },
    ],
    casts: cast("Sam Worthington", "Zoe Saldaña", "Sigourney Weaver"),
    release_date: "2022-12-16",
    runtime: 192,
    vote_average: 7.6,
    vote_count: 0,
    isNowShowing: true,
  },
];

const toValidDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

const formatYMD = (d) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const buildShowsForDay = ({ movieId, hallName, dayStr, times, price }) =>
  times.map((t) => ({
    movie: movieId,
    hallName,
    showDateTime: new Date(`${dayStr}T${t}`),
    showPrice: price,
    occupiedSeats: {},
    isActive: true,
  }));

const seed = async () => {
  try {
    await connectDB();

    console.log("🧹 Clearing existing movies, shows & bookings...");
    await Movie.deleteMany({});
    await Show.deleteMany({});
    await Booking.deleteMany({});

    console.log("🎬 Inserting movies...");
    const moviesToInsert = seedMovies.map((m) => ({
      ...m,
      poster_path: img(m.poster_path), 
      backdrop_path: img(m.backdrop_path),
      casts: (m.casts || []).map((c) => ({
        ...c,
        profile_path: img(c.profile_path),
      })),
      release_date: toValidDate(m.release_date),
    }));

    const insertedMovies = await Movie.insertMany(moviesToInsert, { ordered: false });

    console.log("🎭 Inserting shows...");

   const now = new Date();
    const todayStr = formatYMD(now);
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = formatYMD(tomorrow);

    const timeSlots = ["14:00:00", "18:00:00", "21:00:00"];

    const dynamicShowDocs = insertedMovies
      .filter((m) => m.isNowShowing) 
      .flatMap((m, idx) => {
        const hallA = idx % 2 === 0 ? "Hall 1" : "Hall 2";
        const hallB = idx % 2 === 0 ? "Hall 2" : "Hall 3";
        const price = idx % 2 === 0 ? 120 : 150;

        return [
          ...buildShowsForDay({
            movieId: m._id,
            hallName: hallA,
            dayStr: todayStr,
            times: timeSlots,
            price,
          }),
          ...buildShowsForDay({
            movieId: m._id,
            hallName: hallB,
            dayStr: tomorrowStr,
            times: timeSlots,
            price,
          }),
        ];
      });

    await Show.insertMany(dynamicShowDocs, { ordered: false });

    console.log(`✅ Movies inserted: ${insertedMovies.length}`);
    console.log(`✅ Shows inserted: ${dynamicShowDocs.length}`);
    console.log("✅ Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
};

seed();
