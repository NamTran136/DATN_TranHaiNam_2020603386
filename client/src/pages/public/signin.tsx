import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../../components/public/OAuth";
import axios from "axios";
import { AUTH, API_URL, LoginDto } from "../../types";


function signin() {
  const initialFormValues: LoginDto = { email: "", password: "" };
  const [formData, setFormData] = useState<LoginDto>(initialFormValues);
const [loading, setLoading] = useState(false)
const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
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
        setError("Email hoặc mật khẩu không chính xác.")
        return;
      }
      else{
        setError(null);
      }
      localStorage.setItem("token", data);
      setLoading(false);
      
      navigate("/");
    } catch (err: any) {
      setError("Có lỗi xảy ra trong quá trình tải.");
      console.log(err.message);
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
