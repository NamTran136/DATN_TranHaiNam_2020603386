import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../../components/public/OAuth";
import axios from "axios";
import { AUTH, API_URL, LoginDto } from "../../types";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { signInFailure, signInStart, signInSuccess } from "../../store/features/userSlice";


function signin() {
  const initialFormValues: LoginDto = { email: "", password: "" };
  const [formData, setFormData] = useState<LoginDto>(initialFormValues);
const dispatch = useAppDispatch();

const { loading, error } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const { data, status } = await axios.post<string>(
        `${API_URL}${AUTH}/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (status !== 200) {
        dispatch(signInFailure());
        return;
      }
      localStorage.setItem("token", data);
      var now = new Date().getTime();
      localStorage.setItem("setupTime", now.toString());
      dispatch(signInSuccess(data));
      navigate("/admin");
    } catch (err: any) {
      dispatch(signInFailure(err.message));
    }
  };
  return (
    <div className="sign-in">
      <h1 className="title">Đăng nhập</h1>
      <form onSubmit={handleSubmit} className="form">
        <input
          required
          type="email"
          placeholder="Email"
          id="email"
          onChange={handleChange}
        />
        <input
          required
          type="password"
          placeholder="Mật khẩu"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
        >
          {loading ? "Loading..." : "Đăng nhập"}
        </button>
        <OAuth />
      </form>
      <div className="sub-signin">
        <p>Bạn chưa có tài khoản.</p>
        <Link to="/signup">
          <span className="blue">Thêm mới</span>
        </Link>
      </div>
      <div className="sub-signin">
        <Link to="/">
          <span className="blue">Quay lại trang chủ</span>
        </Link>
      </div>
      <p className="error-message">
        {error ? error || "Something went wrong!" : ""}
      </p>
    </div>
  );
}
export default signin;
