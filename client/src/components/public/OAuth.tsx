import { GoogleAuthProvider, signInWithPopup, getAuth } from "@firebase/auth";
import { app } from "../../firebase";
import axios from "axios";
import { API_URL, AUTH, GoogleDto } from "../../types";
import { useAppDispatch } from "../../store/store";
import { signInFailure, signInStart, signInSuccess } from "../../store/features/userSlice";
import toast from "react-hot-toast";

export default function OAuth() {
  const dispatch = useAppDispatch();
  function generateRandomString(length: number) {
    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let randomString = "";

    for (let i = 0; i < length; i++) {
      // Tạo một số ngẫu nhiên trong khoảng từ 0 đến chiều dài của chuỗi characters
      const randomIndex = Math.floor(Math.random() * characters.length);

      // Lấy ký tự tại vị trí ngẫu nhiên và thêm vào chuỗi
      randomString += characters.charAt(randomIndex);
    }

    return randomString;
  }
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const value: GoogleDto = {
        username: result.user.displayName ? result.user.displayName : "",
        email: result.user.email ? result.user.email : "",
        password: generateRandomString(36),
        imageUrl: result.user.photoURL ? result.user.photoURL : "",
      };
      dispatch(signInStart());
      const { data, status } = await axios.post<string>(
        `${API_URL}${AUTH}/Google`,
        value,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (status !== 200) {
        dispatch(signInFailure());
        toast.error("Có lỗi xảy ra khi đăng nhập với Google");
        return;
      }
      localStorage.setItem("token", data);
      const now = new Date().getTime();
      localStorage.setItem("setupTime", now.toString());
      dispatch(signInSuccess(data));
      toast.success("Đăng nhập thành công!")
      window.location.href =
        localStorage.getItem("previousUrl") || "http://localhost:3000/admin";
    } catch (err) {
      dispatch(signInFailure());
      console.log("Could not login with Google " + err);
      toast.error("Có lỗi xảy ra khi đăng nhập với Google")
    }
  };
  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="oauth"
    >
      Continue with google
    </button>
  );
}
