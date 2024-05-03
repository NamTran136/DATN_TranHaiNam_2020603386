import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserDto } from "../../types";
import { GetUser } from "../../utils/appUtils";

interface UserState {
  user: UserDto;
  token: string;
  searchInput: string;
  loading: boolean;
  error: string;
}

const initialState: UserState = {
  user: {
    username: "",
    email: "",
    role: "",
    image: "",
  },
  searchInput: "",
  token: "",
  loading: false,
  error: "",
};

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.token = "";
      state.error = "";
      state.user = {
        username: "",
        email: "",
        role: "",
        image: "",
      };
    },
    signInSuccess: (state, action: PayloadAction<string | null>) => {
      if (action.payload !== null) {
        const user: UserDto = GetUser(action.payload);
        state.user.username = user.username;
        state.user.email = user.email;
        state.user.role = user.role;
        state.user.image = user.image;
        state.token = action.payload;
      }
      state.loading = false;
      state.error = "";
    },
    signInFailure: (state) => {
      state.user = {
        username: "",
        email: "",
        role: "",
        image: "",
      };
      state.loading = false;
      state.token = "";
      state.error = "Email hoặc mật khẩu không chính xác";
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      const updatedUser: UserDto = GetUser(action.payload);
      state.user.username = updatedUser.username;
      state.user.email = updatedUser.email;
      state.user.role = updatedUser.role;
      state.user.image = updatedUser.image;
      state.token = action.payload;
      state.loading = false;
      state.error = "";
    },
    updateUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state) => {
      state.user = {
        username: "",
        email: "",
        role: "",
        image: "",
      };
      state.loading = false;
      state.error = "";
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signOut: (state) => {
      state.user = {
        username: "",
        email: "",
        role: "",
        image: "",
      };
      state.token = "";
      state.loading = false;
      state.error = "";
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOut,
} = UserSlice.actions;

export default UserSlice.reducer;
