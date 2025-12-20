import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import Booking from "../models/Booking.js";


dotenv.config();

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";
const img = (pathOrUrl) => {
  if (!pathOrUrl) return "";
  if (pathOrUrl.startsWith("http")) return pathOrUrl;
 return `${TMDB_IMAGE_BASE}${pathOrUrl}`;
};
const cast = (...items) =>
  items.map((item) => {

    return {
      name: item?.name || "",
      profile_path: item?.profile_path || "",
    };
  });  

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
    casts: cast(
      { name: "Leonardo DiCaprio", profile_path: "/w276_and_h350_face/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg" },
      { name: "Joseph Gordon-Levitt", profile_path: "/w276_and_h350_face/z2FA8js799xqtfiFjBTicFYdfk.jpg" },
      { name: "Elliot Page", profile_path: "/w276_and_h350_face/eCeFgzS8dYHnMfWQT0oQitCrsSz.jpg" }
    ),
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
    casts: cast(
      { name: "Leonardo DiCaprio", profile_path: "/w276_and_h350_face/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg" },
      { name: "Mark Ruffalo", profile_path: "/w276_and_h350_face/5GilHMOt5PAQh6rlUKZzGmaKEI7.jpg" },
      { name: "Ben Kingsley", profile_path: "/w276_and_h350_face/vQtBqpF2HDdzbfXHDzR4u37i1Ac.jpg" }
    ),
    release_date: "2010-02-19",
    runtime: 138,
    vote_average: 8.2,
    vote_count: 0,
    isNowShowing: false,
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
    casts: cast(
      { name: "Keanu Reeves", profile_path: "/w276_and_h350_face/8RZLOyYGsoRe9p44q3xin9QkMHv.jpg" },
      { name: "Laurence Fishburne", profile_path: "/w276_and_h350_face/2GbXERENPpl5MmlqOLlPVaVtifD.jpg" },
      { name: "Carrie-Anne Moss", profile_path: "/w276_and_h350_face/xD4jTA3KmVp5Rq3aHcymL9DUGjD.jpg" }
    ),
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
    casts: cast(
      { name: "Tom Hanks", profile_path: "/w276_and_h350_face/oFvZoKI6lvU03n4YoNGAll9rkas.jpg" },
      { name: "Michael Clarke Duncan", profile_path: "/w276_and_h350_face/3RX8OBqt3gbvFwKYZqiom4O3Ta6.jpg" },
      { name: "David Morse", profile_path: "/w276_and_h350_face/tzBIwZYV2dmWZGSrGkJJx5F7Cei.jpg" }
    ),
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
    casts: cast(
      { name: "Tom Hanks", profile_path: "/w276_and_h350_face/oFvZoKI6lvU03n4YoNGAll9rkas.jpg" },
      { name: "Robin Wright", profile_path: "/w276_and_h350_face/d3rIv0y2p0jMsQ7ViR7O1606NZa.jpg" },
      { name: "Gary Sinise", profile_path: "/w276_and_h350_face/olRjiV8ZhBixQiTvrGwXhpVXxsV.jpg" }
    ),
    release_date: "1994-07-06",
    runtime: 142,
    vote_average: 8.5,
    vote_count: 0,
    isNowShowing: false,
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
    casts: cast(
      { name: "Adrien Brody", profile_path: "/w276_and_h350_face/id5GuTduKt3yCwb7BrVLuWKqaSq.jpg" },
      { name: "Thomas Kretschmann", profile_path: "/w276_and_h350_face/kBnPu1KREhckuPpnAUppm24kkVX.jpg" },
      { name: "Emilia Fox", profile_path: "/w276_and_h350_face/lZpNRsHAOW8m0f7bRfgUDmRRjo.jpg" }
    ),
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
    casts: cast(
      { name: "Elijah Wood", profile_path: "/w276_and_h350_face/7UKRbJBNG7mxBl2QQc5XsAh6F8B.jpg" },
      { name: "Ian McKellen", profile_path: "/w276_and_h350_face/coWjgMEYJjk2OrNddlXCBm8EIr3.jpg" },
      { name: "Viggo Mortensen", profile_path: "/w276_and_h350_face/vH5gVSpHAMhDaFWfh0Q7BG61O1y.jpg" }
    ),
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
    casts: cast(
      { name: "Elijah Wood", profile_path: "/w276_and_h350_face/7UKRbJBNG7mxBl2QQc5XsAh6F8B.jpg" },
      { name: "Ian McKellen", profile_path: "/w276_and_h350_face/coWjgMEYJjk2OrNddlXCBm8EIr3.jpg" },
      { name: "Viggo Mortensen", profile_path: "/w276_and_h350_face/vH5gVSpHAMhDaFWfh0Q7BG61O1y.jpg" }
    ),
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
    casts: cast(
      { name: "Elijah Wood", profile_path: "/w276_and_h350_face/7UKRbJBNG7mxBl2QQc5XsAh6F8B.jpg" },
      { name: "Ian McKellen", profile_path: "/w276_and_h350_face/coWjgMEYJjk2OrNddlXCBm8EIr3.jpg" },
      { name: "Viggo Mortensen", profile_path: "/w276_and_h350_face/vH5gVSpHAMhDaFWfh0Q7BG61O1y.jpg" }
    ),
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
    casts: cast(
      { name: "Daniel Radcliffe", profile_path: "/w276_and_h350_face/e64VeB4Mybwm2tOhyLY1h7XQQ8N.jpg" },
      { name: "Emma Watson", profile_path: "/w276_and_h350_face/A14lLCZYDhfYdBa0fFRpwMDiwRN.jpg" },
      { name: "Rupert Grint", profile_path: "/w276_and_h350_face/q2KZZ0ltTEl7Sf8volNFV1JDEP4.jpg" }
    ),
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
    casts: cast(
      { name: "Daniel Radcliffe", profile_path: "/w276_and_h350_face/e64VeB4Mybwm2tOhyLY1h7XQQ8N.jpg" },
      { name: "Emma Watson", profile_path: "/w276_and_h350_face/A14lLCZYDhfYdBa0fFRpwMDiwRN.jpg" },
      { name: "Rupert Grint", profile_path: "/w276_and_h350_face/q2KZZ0ltTEl7Sf8volNFV1JDEP4.jpg" }
    ),
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
    casts: cast(
      { name: "Ethan Hawke", profile_path: "/w276_and_h350_face/2LoTr6x0TEM7L5em4kSx1VmGDgG.jpg" },
      { name: "Lena Headey", profile_path: "/w276_and_h350_face/xR2IBnBlUdyBe5hecaVdtRuQqUE.jpg" },
      { name: "Max Burkholder", profile_path: "/w276_and_h350_face/8uNNDZPSxLsNetHPl1zxMwKULTC.jpg" }
    ),
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
    casts: cast(
      { name: "Amy Poehler", profile_path: "/w276_and_h350_face/rwmvRonpluV6dCPiQissYrchvSD.jpg" },
      { name: "Phyllis Smith", profile_path: "/w276_and_h350_face/h9w9pQbiderRWAC2mi7spjzuIGz.jpg" },
      { name: "Bill Hader", profile_path: "/w276_and_h350_face/qyT50vQ9PQIEctE1IxDTEsBKstU.jpg" }
    ),
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
    casts: cast(
      { name: "Mike Myers", profile_path: "/w276_and_h350_face/gjfDl52Kk02MPgUYFjs9bOy33OY.jpg" },
      { name: "Eddie Murphy", profile_path: "/w276_and_h350_face/qgjMfefsKwSYsyCaIX46uyOXIpy.jpg" },
      { name: "Cameron Diaz", profile_path: "/w276_and_h350_face/d4f4cQ9EiYuvNMjT1IB2h06KoRx.jpg" }
    ),
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
    casts: cast(
      { name: "Kristen Bell", profile_path: "/w276_and_h350_face/rP74dJXl7EjinGM0shQtUOlH5s2.jpg" },
      { name: "Idina Menzel", profile_path: "/w276_and_h350_face/eGsyJmAZNV5tUU4RYy2DIRlFVpW.jpg" },
      { name: "Josh Gad", profile_path: "/w276_and_h350_face/bgRWcrD9hfaa2f7RUWJzxmJaWuD.jpg" }
    ),
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
    casts: cast(
      { name: "Mae Whitman", profile_path: "" },
      { name: "Kristin Chenoweth", profile_path: "/w276_and_h350_face/q3ENDu5n23FARhyij4FVRaTkSg4.jpg" },
      { name: "Raven-Symoné", profile_path: "/w276_and_h350_face/76x0KF5bnkxeFaq5vx9rXylPGQZ.jpg" }
    ),
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
    casts: cast(
      { name: "Margot Robbie", profile_path: "/w276_and_h350_face/euDPyqLnuwaWMHajcU3oZ9uZezR.jpg" },
      { name: "Ryan Gosling", profile_path: "/w276_and_h350_face/asoKC7CLCqpZKZDL6iovNurQUdf.jpg" },
      { name: "America Ferrera", profile_path: "/w276_and_h350_face/7F84Lh2lKpvkM3EiOvqqvlOmw93.jpg" }
    ),
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
    casts: cast(
      { name: "Ed Asner", profile_path: "/w276_and_h350_face/AeVizz1AfAB2TbsfyzgBvqeSR3G.jpg" },
      { name: "Jordan Nagai", profile_path: "/w276_and_h350_face/j1kVS2sI3wWIHCCzzYD1buXAP9e.jpg" },
      { name: "Christopher Plummer", profile_path: "/w276_and_h350_face/iZh3s9Vy9vYD4DYnAda6C1kdeco.jpg" }
    ),
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
    casts: cast(
      { name: "Patton Oswalt", profile_path: "/w276_and_h350_face/ljQvjbPmcIAl205Lb2Mu4CW8WO7.jpg" },
      { name: "Lou Romano", profile_path: "/w276_and_h350_face/1qOuqRzlp5BghzTkYSN3MsaEXgF.jpg" },
      { name: "Ian Holm", profile_path: "/w276_and_h350_face/cOJDgvgj4nMec6Inzj1H5nugTO5.jpg" }
    ),
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
    casts: cast(
      { name: "Owen Wilson", profile_path: "/w276_and_h350_face/op8sGD20k3EQZLR92XtaHoIbW0o.jpg" },
      { name: "Paul Newman", profile_path: "/w276_and_h350_face/bP2fByqNR7BorsUNuD6nSm0u2vJ.jpg" },
      { name: "Bonnie Hunt", profile_path: "/w276_and_h350_face/tT9C6uLztgN8OxJULq6F9iEzqlA.jpg" }
    ),
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
    casts: cast(
      { name: "Albert Brooks", profile_path: "/w276_and_h350_face/8iDSGu5l93N7benjf6b3AysBore.jpg" },
      { name: "Ellen DeGeneres", profile_path: "/w276_and_h350_face/z8IEEid4z63CBlJtxrTKEfsW7NA.jpg" },
      { name: "Alexander Gould", profile_path: "/w276_and_h350_face/fe4mUSp0XotA6Ku4Bs69Q9o2lqU.jpg" }
    ),
    release_date: "2003-05-30",
    runtime: 100,
    vote_average: 8.1,
    vote_count: 0,
    isNowShowing: false,
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
    casts: cast(
      { name: "Neil Patrick Harris", profile_path: "/w276_and_h350_face/r2twLWLwDpKJ7JyhWsD1YsL7rJV.jpg" },
      { name: "Jayma Mays", profile_path: "/w276_and_h350_face/n8tY5eVXje0vXTws66YAdEeHMy5.jpg" },
      { name: "Hank Azaria", profile_path: "/w276_and_h350_face/yFDw4b0jucuFWNnGcBPfpYUtn16.jpg" }
    ),
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
    casts: cast(
      { name: "Sam Worthington", profile_path: "/w276_and_h350_face/mflBcox36s9ZPbsZPVOuhf6axaJ.jpg" },
      { name: "Zoe Saldaña", profile_path: "/w276_and_h350_face/vQBwmsSOAd0JDaEcZ5p43J9xzsY.jpg" },
      { name: "Sigourney Weaver", profile_path: "/w276_and_h350_face/wTSnfktNBLd6kwQxgvkqYw6vEon.jpg" }
    ),
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
    casts: cast(
      { name: "Sam Worthington", profile_path: "/w276_and_h350_face/mflBcox36s9ZPbsZPVOuhf6axaJ.jpg" },
      { name: "Zoe Saldaña", profile_path: "/w276_and_h350_face/vQBwmsSOAd0JDaEcZ5p43J9xzsY.jpg" },
      { name: "Sigourney Weaver", profile_path: "/w276_and_h350_face/wTSnfktNBLd6kwQxgvkqYw6vEon.jpg" }
    ),
    release_date: "2022-12-16",
    runtime: 192,
    vote_average: 7.6,
    vote_count: 0,
    isNowShowing: true,
  },
  {
  title: "How to Lose a Guy in 10 Days",
  overview:
    "A journalist writes an article about how to lose a man in ten days, unaware that her chosen target has his own secret agenda.",
  poster_path: "/w1280/2dlftyPz7mTYbrsPvTogyFmYd7d.jpg",
  backdrop_path: "/w1066_and_h600_face/cdYj6HFpKp5NTmLiHHbNEGSmDT4.jpg",
  genres: [
    { id: 35, name: "Comedy" },
    { id: 10749, name: "Romance" },
  ],
  casts: cast(
    { name: "Kate Hudson", profile_path: "/w276_and_h350_face/s79lH1QzEg2fkXULKBxRmU9aNr8.jpg" },
    { name: "Matthew McConaughey", profile_path: "/w276_and_h350_face/lCySuYjhXix3FzQdS4oceDDrXKI.jpg" },
    { name: "Kathryn Hahn", profile_path: "/w276_and_h350_face/9sVllAKfEls3SJD3GoPm2JEZoa5.jpg" }
  ),
  release_date: "2003-02-07",
  runtime: 116,
  vote_average: 6.5,
  vote_count: 0,
  isNowShowing: true,
},
{
  title: "Me Before You",
  overview:
    "A young woman forms an unlikely bond with a recently paralyzed man she is caring for, changing both of their lives forever.",
  poster_path: "/w600_and_h900_face/Ia3dzj5LnCj1ZBdlVeJrbKJQxG.jpg",
  backdrop_path: "/w1066_and_h600_face/3WK7p9EdZmmvB1IbB2Vw9Rf4lXH.jpg",
  genres: [
    { id: 18, name: "Drama" },
    { id: 10749, name: "Romance" },
  ],
  casts: cast(
    { name: "Emilia Clarke", profile_path: "/w276_and_h350_face/iFY6t7Ux9r70WB7Sp0TTVz6eGtm.jpg" },
    { name: "Sam Claflin", profile_path: "/w276_and_h350_face/e5CU4tjCNZFfm7ITmZfzjZse2Bb.jpg" },
    { name: "Janet McTeer", profile_path: "/w276_and_h350_face/kl8cHLOQbwLrBfMWtAwtP4hUXFk.jpg" }
  ),
  release_date: "2016-06-03",
  runtime: 110,
  vote_average: 7.4,
  vote_count: 0,
  isNowShowing: true,
},
{
  title: "The Godfather",
  overview:
    "The aging patriarch of an organized crime dynasty transfers control of his empire to his reluctant son.",
  poster_path: "/w600_and_h900_face/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
  backdrop_path: "/w1066_and_h600_face/tSPT36ZKlP2WVHJLM4cQPLSzv3b.jpg",
  genres: [
    { id: 18, name: "Drama" },
    { id: 80, name: "Crime" },
  ],
  casts: cast(
    { name: "Marlon Brando", profile_path: "/w276_and_h350_face/iyO183LVAJ0I4ZkNibINPjfAjCP.jpg" },
    { name: "Al Pacino", profile_path: "/w276_and_h350_face/2dGBb1fOcNdZjtQToVPFxXjm4ke.jpg" },
    { name: "James Caan", profile_path: "/w276_and_h350_face/v3flJtQEyczxENi29yJyvnN6LVt.jpg" }
  ),
  release_date: "1972-03-24",
  runtime: 175,
  vote_average: 8.7,
  vote_count: 0,
  isNowShowing: false,
},
{
  title: "Fight Club",
  overview:
    "An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much more.",
  poster_path: "/w600_and_h900_face/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
  backdrop_path: "/w1066_and_h600_face/xRyINp9KfMLVjRiO5nCsoRDdvvF.jpg",
  genres: [
    { id: 18, name: "Drama" },
    { id: 53, name: "Thriller" },
  ],
  casts: cast(
    { name: "Brad Pitt", profile_path: "/w276_and_h350_face/nWyL0YMgsBOsvX4gVSFB16VfnPU.jpg" },
    { name: "Edward Norton", profile_path: "/w276_and_h350_face/8nytsqL59SFJTVYVrN72k6qkGgJ.jpg" },
    { name: "Helena Bonham Carter", profile_path: "/w276_and_h350_face/hJMbNSPJ2PCahsP3rNEU39C8GWU.jpg" }
  ),
  release_date: "1999-10-15",
  runtime: 139,
  vote_average: 8.4,
  vote_count: 0,
  isNowShowing: true,
},
{
  title: "Interstellar",
  overview:
    "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
  poster_path: "/w600_and_h900_face/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  backdrop_path: "/w1066_and_h600_face/5XNQBqnBwPA9yT0jZ0p3s8bbLh0.jpg",
  genres: [
    { id: 12, name: "Adventure" },
    { id: 18, name: "Drama" },
    { id: 878, name: "Science Fiction" },
  ],
  casts: cast(
    { name: "Matthew McConaughey", profile_path: "/w276_and_h350_face/lCySuYjhXix3FzQdS4oceDDrXKI.jpg" },
    { name: "Anne Hathaway", profile_path: "/w276_and_h350_face/s6tflSD20MGz04ZR2R1lZvhmC4Y.jpg" },
    { name: "Jessica Chastain", profile_path: "/w276_and_h350_face/lodMzLKSdrPcBry6TdoDsMN3Vge.jpg" }
  ),
  release_date: "2014-11-07",
  runtime: 169,
  vote_average: 8.6,
  vote_count: 0,
  isNowShowing: true,
},
{
  title: "Gladiator",
  overview:
    "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family.",
  poster_path: "/w600_and_h900_face/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
  backdrop_path: "/w1066_and_h600_face/jhk6D8pim3yaByu1801kMoxXFaX.jpg",
  genres: [
    { id: 28, name: "Action" },
    { id: 18, name: "Drama" },
    { id: 12, name: "Adventure" },
  ],
  casts: cast(
    { name: "Russell Crowe", profile_path: "/w276_and_h350_face/uxiXuVH4vNWrKlJMVVPG1sxAJFe.jpg" },
    { name: "Joaquin Phoenix", profile_path: "/w276_and_h350_face/u38k3hQBDwNX0VA22aQceDp9Iyv.jpg" },
    { name: "Connie Nielsen", profile_path: "/w276_and_h350_face/lvQypTfeH2Gn2PTbzq6XkT2PLmn.jpg" }
  ),
  release_date: "2000-05-05",
  runtime: 155,
  vote_average: 8.5,
  vote_count: 0,
  isNowShowing: true,
},
{
  title: "Titanic",
  overview:
    "A young aristocrat falls in love with a poor artist aboard the ill-fated RMS Titanic.",
  poster_path: "/w600_and_h900_face/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
  backdrop_path: "/w1066_and_h600_face/xnHVX37XZEp33hhCbYlQFq7ux1J.jpg",
  genres: [
    { id: 18, name: "Drama" },
    { id: 10749, name: "Romance" },
  ],
  casts: cast(
    { name: "Leonardo DiCaprio", profile_path: "/w276_and_h350_face/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg" },
    { name: "Kate Winslet", profile_path: "/w276_and_h350_face/e3tdop3WhseRnn8KwMVLAV25Ybv.jpg" },
    { name: "Billy Zane", profile_path: "/w276_and_h350_face/7CBwxqE00aZAAEBaRkapylgdi15.jpg" }
  ),
  release_date: "1997-12-19",
  runtime: 195,
  vote_average: 7.9,
  vote_count: 0,
  isNowShowing: true,
},
{
  title: "Pride & Prejudice",
  overview:
    "Sparks fly when spirited Elizabeth Bennet meets the reserved Mr. Darcy in 19th century England.",
  poster_path: "/w600_and_h900_face/v5gShop7147X33ytbcC2u05KDuc.jpg",
  backdrop_path: "/w1066_and_h600_face/x8xlGwqNRtnyMX9hDLnzxzYFy1D.jpg",
  genres: [
    { id: 18, name: "Drama" },
    { id: 10749, name: "Romance" },
  ],
  casts: cast(
    { name: "Keira Knightley", profile_path: "/w276_and_h350_face/bRC1B2VwV0wK3ElciFAK6QZf2wD.jpg" },
    { name: "Matthew Macfadyen", profile_path: "/w276_and_h350_face/2IWtWZTpAGh8QFVBjry1IZMN7F3.jpg" },
    { name: "Rosamund Pike", profile_path: "/w276_and_h350_face/8ObNklHDi2hjdz0ayzJFB9jtqzm.jpg" }
  ),
  release_date: "2005-11-11",
  runtime: 129,
  vote_average: 7.8,
  vote_count: 0,
  isNowShowing: false,
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
