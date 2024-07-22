import axios from "axios";

// Base URL for API requests
const baseURL = "http://localhost:3001/";

// User API
export const signupUser = async (data, profileImage) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    const res = await axios.post(`${baseURL}signup`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.user;
  } catch (error) {
    console.error("Error signing up user:", error);
    return null;
  }
};

export const loginUser = async (email, password) => {
  try {
    const res = await axios.post(`${baseURL}login`, { email, password });
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

export const updateUser = async (id, data) => {
  try {
    const res = await axios.patch(`${baseURL}auth/updateUser/${id}`, data);
    return res.data.user;
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
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

// Song API
export const getAllSongs = async () => {
  try {
    const res = await axios.get(`${baseURL}songs/getAll`);
    return res.data.songs;
  } catch (error) {
    console.error("Error fetching all songs:", error);
    return null;
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
    const res = await axios.post(`${baseURL}songs/upload`, data);
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
  } catch (err) {
    console.error("Error fetching all artists:", err);
    return null;
  }
};

export const getArtistById = async (id) => {
  try {
    const res = await axios.get(`${baseURL}artist/getArtist/${id}`);
    return res.data.artist;
  } catch (err) {
    console.error(`Error fetching user ${id}:`, err);
  }
};

export const saveNewArtist = async (data) => {
  try {
    const res = await axios.post(`${baseURL}songs/upload`, data);
    return res.data.song;
  } catch (err) {
    console.error("Error saving new artist:", err);
  }
};

export const updateArtistById = async (id, data) => {
  try {
    const res = await axios.put(`${baseURL}artists/update/${id}`, data);
    return res.data.artist;
  } catch (err) {
    console.error("Error updating artist:", err);
  }
};
export const deleteArtistById = async (id) => {
  try {
    const res = await axios.delete(`${baseURL}artist/delete/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting artist:", err);
  }
};

// Album API
export const getAllAlbums = async () => {
  try {
    const res = await axios.get(`${baseURL}albums/getAll`);
    return res.data.albums;
  } catch (error) {
    console.error("Error fetching all artist", error);
  }
};

export const getAlbumById = async (id) => {
  try {
    const res = await axios.get(`${baseURL}albums/getAlbum/${id}`);
    return res.data.album;
  } catch (error) {
    console.error("Error fetching album:", error);
  }
};

export const saveNewAlbum = async (data) => {
  try {
    const res = await axios.post(`${baseURL}albums/upload`, data);
    return res.data.album;
  } catch (error) {
    console.error("Error saving new album:", error);
  }
};

export const updateAlbumById = async (id, data) => {
  try {
    const res = await axios.put(`${baseURL}albums/update/${id}`, data);
    return res.data.album;
  } catch (error) {
    console.error("Error updating album:", error);
  }
};

export const deleteAlbumByUd = async (id) => {
  try {
    const res = await axios.delete(`${baseURL}album/delete/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting album:", error);
    return null;
  }
};
