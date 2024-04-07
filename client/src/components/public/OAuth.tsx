import { GoogleAuthProvider, signInWithPopup, getAuth } from "@firebase/auth";
import { useNavigate } from "react-router-dom";
import { app } from "../../firebase";
import axios from "axios";
import { API_URL, AUTH, GoogleDto } from "../../types";
import { useState } from "react";

export default function OAuth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      setLoading(true)
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
        setError("Có lỗi xảy ra trong quá trình tải");
        return;
      }
      else{
        setError(null);
      }
      console.log(data)
      localStorage.setItem("token", data);
      setLoading(false);
      navigate("/");
    } catch (err) {
      setError("Có lỗi xảy ra trong quá trình tải");
      console.log("Could not login with Google " + err);
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
