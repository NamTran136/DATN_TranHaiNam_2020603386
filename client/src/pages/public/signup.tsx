import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../../components/public/OAuth";
import axios from "axios";
import { API_URL, AUTH, RegisterDto } from "../../types";
import toast from "react-hot-toast";


function Signup() {
  const initialFormValues: RegisterDto = {
    username: "",
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState(initialFormValues);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(formData.password !== confirmPassword) {
      toast.error("Mật khẩu nhập lại không chính xác!");
      return;
    }
    try {
      setLoading(false);
      const { status } = await axios.post(
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
        toast.error("Đăng ký tài khoản thất bại!");
        return;
      }
      toast.success("Đăng ký thành công!");
      navigate("/signin");
    } catch (err) {
      setLoading(false);
      toast.error("Username hoặc email đã tồn tại!");
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
          onChange={(e) => setConfirmPassword(e.target.value)}
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
    </div>
  );
}
export default Signup;
