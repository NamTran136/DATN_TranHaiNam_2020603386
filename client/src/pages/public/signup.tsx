import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../../components/public/OAuth";
import axios from "axios";
import { API_URL, AUTH, RegisterDto } from "../../types";

interface FormValues {
  username: string;
  email: string;
  password: string;
}

function Signup() {
  const initialFormValues: RegisterDto = {
    username: "",
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState(initialFormValues);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(false);
      setError(false);
      const { data, status } = await axios.post(
        `${API_URL}${AUTH}/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (status !== 200) {
        setError(true);
        return;
      }
      navigate("/signin");
    } catch (err) {
      setLoading(false);
      setError(true);
    }
  };
  return (
    <div className="sign-in">
      <h1 className="title">Đăng ký</h1>
      <form onSubmit={handleSubmit} className="form">
        <input
          required
          type="text"
          placeholder="Tên đăng nhập"
          id="username"
          onChange={handleChange}
        />
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
        <input
          required
          type="password"
          placeholder="Nhập lại mật khẩu"
          id="repeatPassword"
          onChange={handleChange}
        />
        <button disabled={loading}>{loading ? "Loading..." : "Đăng ký"}</button>
        <OAuth />
      </form>
      <div className="sub-signin">
        <p>Bạn đã có tài khoản.</p>
        <Link to="/signin">
          <span className="blue">Đăng nhập</span>
        </Link>
      </div>
      <div className="sub-signin">
        <Link to="/">
          <span className="blue">Quay lại trang chủ</span>
        </Link>
      </div>
      <p className="error-message">
        {error && "Username hoặc email đã tồn tại"}
      </p>
    </div>
  );
}
export default Signup;
