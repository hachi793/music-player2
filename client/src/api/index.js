import axios from "axios";

// Base URL for API requests
const baseURL = "http://localhost:3001/";

// User API
export const signupUser = async (data) => {
  try {
    const res = await axios.post(`${baseURL}auth/signup`, data);
    return res.data.user;
  } catch (error) {
    console.error("Error signing up user:", error);
    return null;
  }
};

export const loginUser = async (email, password) => {
  try {
    const res = await axios.post(`${baseURL}auht/login`, { email, password });
    return res.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    return null;
  }
};

export const getAllUsers = async () => {
  try {
    const res = await axios.get(`${baseURL}auth/getUsers`);
    return res.data.users;
  } catch (error) {
    console.error("Error fetching all users:", error);
    return null;
  }
};

export const getUserById = async (id) => {
  try {
    const res = await axios.get(`${baseURL}auth/getUser/${id}`);
    return res.data.user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const updateUserDetails = async (data) => {
  try {
    const res = await axios.patch(`${baseURL}auth/update-details`, data);
    return res.data.user;
  } catch (error) {
    console.error("Error updating user details:", error);
    return null;
  }
};

export const updateUserPassword = async (data) => {
  try {
    const res = await axios.patch(`${baseURL}auth/update-password`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating password:", error);
    throw error.response.data.message || "Error updating password";
  }
};

export const updateUserRole = async (id, role) => {
  try {
    const res = await axios.put(`${baseURL}auth/updateRole/${id}`, { role });
    return res.data.user;
  } catch (error) {
    console.error("Error updating user role:", error);
    return null;
  }
};

export const deleteUserById = async (id) => {
  try {
    const res = await axios.delete(`${baseURL}auth/deleteUser/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    return null;
  }
};

export const addToFavorite = async (userId, songId) => {
  try {
    await axios.post(`${baseURL}auth/addToFavorite`, { userId, songId });
  } catch (error) {
    console.error("Error adding favorite song:", error);
    throw error;
  }
};

// Remove a song from favorites
export const removeFromFavorite = async (userId, songId) => {
  try {
    await axios.post(`${baseURL}auth/removeFromFavorite`, { userId, songId });
  } catch (error) {
    console.error("Error removing favorite song:", error);
    throw error;
  }
};

export const getFavoriteSongs = async (userId) => {
  try {
    const response = await axios.get(
      `${baseURL}auth/getFavoriteSongs/${userId}`,
      {
        params: { userId },
      }
    );
    return response.data.favoriteSongs;
  } catch (error) {
    console.error("Error fetching favorite songs:", error);
    throw error;
  }
};

// Song API
export const getAllSongs = async () => {
  try {
    const res = await axios.get(`${baseURL}songs/getAll`);
    return res.data.songs;
  } catch (error) {
    console.error("Error fetching all songs:", error);
    return [];
  }
};

export const getSongById = async (id) => {
  try {
    const res = await axios.get(`${baseURL}songs/getSong/${id}`);
    return res.data.song;
  } catch (error) {
    console.error("Error fetching song:", error);
    return null;
  }
};

export const saveNewSong = async (data) => {
  try {
    const res = await axios.post(`${baseURL}songs/save`, data);
    return res.data.song;
  } catch (error) {
    console.error("Error saving new song:", error);
    return null;
  }
};

export const updateSongById = async (id, data) => {
  try {
    const res = await axios.put(`${baseURL}songs/update/${id}`, data);
    return res.data.song;
  } catch (error) {
    console.error("Error updating song:", error);
    return null;
  }
};

export const deleteSongById = async (id) => {
  try {
    const res = await axios.delete(`${baseURL}songs/delete/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting song:", error);
    return null;
  }
};

// Artist API
export const getAllArtists = async () => {
  try {
    const res = await axios.get(`${baseURL}artists/getAll`);
    return res.data.artists;
  } catch (error) {
    console.error("Error fetching all artists:", error);
    return [];
  }
};

export const saveNewArtist = async (data) => {
  try {
    const res = await axios.post(`${baseURL}artists/save`, data);
    return res.data.artist;
  } catch (error) {
    console.error("Error saving new artist:", error);
    return null;
  }
};

export const getArtistById = async (id) => {
  try {
    const res = await axios.get(`${baseURL}artists/getArtist/${id}`);
    return res.data.artist;
  } catch (error) {
    console.error("Error fetching artist:", error);
    return null;
  }
};

export const updateArtistById = async (id, data) => {
  try {
    const res = await axios.put(`${baseURL}artists/update/${id}`, data);
    return res.data.artist;
  } catch (error) {
    console.error("Error updating artist:", error);
    return null;
  }
};

export const deleteArtistById = async (id) => {
  try {
    const res = await axios.delete(`${baseURL}artists/delete/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting artist:", error);
    return null;
  }
};

// Album API
export const getAllAlbums = async () => {
  try {
    const res = await axios.get(`${baseURL}albums/getAll`);
    return res.data.albums;
  } catch (error) {
    console.error("Error fetching all albums:", error);
    return [];
  }
};

export const getAlbumById = async (id) => {
  try {
    const res = await axios.get(`${baseURL}albums/getAlbum/${id}`);
    return res.data.album;
  } catch (error) {
    console.error("Error fetching album:", error);
    return null;
  }
};

export const saveNewAlbum = async (data) => {
  try {
    const res = await axios.post(`${baseURL}albums/save`, data);
    return res.data.album;
  } catch (error) {
    console.error(
      "Error saving new album:",
      error.response?.data || error.message
    );
    return null;
  }
};

export const updateAlbumById = async (id, data) => {
  try {
    const res = await axios.put(`${baseURL}albums/update/${id}`, data);
    return res.data.album;
  } catch (error) {
    console.error("Error updating album:", error);
    return null;
  }
};

export const deleteAlbumById = async (id) => {
  try {
    const res = await axios.delete(`${baseURL}albums/delete/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting album:", error);
    return null;
  }
};

// Comment API
export const saveNewComment = async (data) => {
  try {
    const res = await axios.post(`${baseURL}comments/save`, data);
    return res.data.comment;
  } catch (error) {
    console.error("Error saving new comment:", error);
    return null;
  }
};

export const getAllComments = async (data) => {
  try {
    const res = await axios.get(`${baseURL}comments/getAll`, data);
    return res.data.comments;
  } catch (error) {
    console.error("Error fetching all comments:", error);
    return [];
  }
};
export const getCommentsBySongId = async (songId) => {
  try {
    const res = await axios.get(
      `${baseURL}comments/getCommentsBySongId/${songId}`
    );
    return res.data.comments;
  } catch (error) {
    console.error(`Error fetching comments for song with id ${songId}:`, error);
    return [];
  }
};

export const getCommentsByUserId = async (userId) => {
  try {
    const res = await axios.get(
      `${baseURL}comments/getCommentsByUserId/${userId}`
    );
    return res.data.comments;
  } catch (error) {
    console.error(`Error fetch comments of ${userId}`, error);
    return [];
  }
};

export const deleteCommentsById = async (id) => {
  try {
    const res = await axios.delete(`${baseURL}comments/delete/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting comment", error);
  }
};

// Playlist
export const addNewPlaylist = async (data) => {
  try {
    const res = await axios.post(`${baseURL}playlists/add`, data);
    return res.data.playlist;
  } catch (error) {
    console.error("Error saving new playlist:", error);
    return null;
  }
};

export const getPlaylistById = async (id) => {
  try {
    const res = await axios.get(`${baseURL}playlists/getPlaylist/${id}`);
    return res.data.playlist;
  } catch (error) {
    console.error("Error fetching playlist", error);
    return null;
  }
};
export const getPlaylistsByUserId = async (userId) => {
  try {
    const res = await axios.get(
      `${baseURL}playlists/getPlaylistsByUserId/${userId}`
    );
    return res.data.playlists;
  } catch (error) {
    console.error("Error geting playlist", error);
  }
};

export const addToPlaylist = async (playlistId, songId) => {
  try {
    await axios.post(`${baseURL}playlists/addToPlaylist/${playlistId}`, {
      songId,
    });
  } catch (error) {
    console.error("Error adding song to playlist: ", error);
    throw error;
  }
};

export const removeFromPlaylist = async (playlistId, songId) => {
  try {
    await axios.post(`${baseURL}playlists/removeFromPlaylist/${playlistId}`, {
      songId,
    });
  } catch (error) {
    console.error("Error removing song from playlist: ", error);
    throw error;
  }
};

export const updatePlaylistById = async (id, data) => {
  try {
    const res = await axios.put(`${baseURL}playlists/update/${id}`, data);
    return res.data.playlist;
  } catch (error) {
    console.error("Error updating playlist info", error);
    return null;
  }
};
