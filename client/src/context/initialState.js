export const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  allUsers: [],
  allSongs: [],
  allArtists: [],
  allAlbums: [],
  filterTerm: "all",
  artistFilter: null,
  languageFilter: null,
  albumFilter: null,
  alertType: null,
  isSongPlaying: false,
  songIndex: 0,
  favoriteSongs: [],
};
