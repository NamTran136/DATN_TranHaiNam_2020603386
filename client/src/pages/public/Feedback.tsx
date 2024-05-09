import { useState } from 'react';
import SubNav from '../../components/public/SubNav';
import { useAppSelector } from '../../store/store';
import { API_URL, FEEDBACK } from '../../types';
import axios from 'axios';
import toast from 'react-hot-toast';

interface FeedbackProps {
    email: string;
    title: string;
    content: string;
    file: any | undefined;
}

const Feedback = () => {
    const { user, loading, token } = useAppSelector((state) => state.user);
    const initialFormValues: FeedbackProps = {
      email: user.email,
      title: "",
      content: "",
      file: undefined,
    };
    const [formData, setFormData] = useState<FeedbackProps>(initialFormValues);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const { status } = await axios.post(
        API_URL + FEEDBACK + "/UploadFile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if(status === 200) {
        toast.success("Phản hồi đã được gửi");
        setFormData(initialFormValues);
      }
      else{
        toast.error("Có lỗi xảy ra trong quá trình gửi");
      }
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    };
  return (
    <div className="profile">
      <SubNav />
      <form
        onSubmit={handleSubmit}
        className="form"
        style={{ textAlign: "justify" }}
      >
        <div>Username: {user.username}</div>
        <div>Email: {user.email}</div>
        <label htmlFor="title">Tiêu đề: </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          placeholder=""
          className="input-text"
          required
          onChange={handleChange}
        />
        <label htmlFor="content">Nội dung phản hồi: </label>
        <textarea
          className="input-text"
          name="content"
          id="content"
          value={formData.content}
          rows={7}
          onChange={handleChange}
          required
        />
        <div>
          Bạn có thể tải hình ảnh liên quan hoặc đóng góp sách cho chúng tôi
        </div>
        <input
          type="file"
          onChange={(e) => {
            e.target.files !== null &&
              setFormData({ ...formData, file: e.target.files[0] });
          }}
        />
        <button type='submit' className="slate btn-disable">
          {loading ? "Đăng tải..." : "Gửi"}
        </button>
      </form>
    </div>
  );
}

export default Feedback