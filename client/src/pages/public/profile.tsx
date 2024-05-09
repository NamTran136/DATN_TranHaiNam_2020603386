import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { API_URL, AUTH, USER, UserEditDto } from "../../types";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOut, updateUserFailure, updateUserStart, updateUserSuccess } from "../../store/features/userSlice";
import axios from "axios";
import toast from "react-hot-toast";
import SubNav from "../../components/public/SubNav";

export default function profile() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, loading, token } = useAppSelector((state) => state.user);
  const refUrl = useRef<HTMLInputElement>(null);
  const initialFormValues: UserEditDto = {
    email: user.email,
    password: "",
    username: user.username,
    imageUrl: user.image,
  };
  const [formData, setFormData] = useState<UserEditDto>(initialFormValues);
  const [image, setImage] = useState<any | undefined>(undefined);
  const [imageError, setImageError] = useState(false);
  const [imagePercent, setImagePercent] = useState(0);
  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);
  const handleFileUpload = async (image: any | undefined) => {
    console.log(image);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Update is " + progress + "% done");
        setImagePercent(Math.round(progress));
      },
      (error: any) => {
        console.log(error.message);
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, imageUrl: downloadURL })
        );
      }
    );
  };
  const handleSignOut = async () => {
    try {
      localStorage.clear();
      dispatch(signOut());
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const { data, status } = await axios.delete(`${API_URL}${USER}/email=${user.email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (status !== 200) {
          dispatch(deleteUserFailure("Có lỗi xảy ra trong quá trình!"));
          toast.error("Xóa tài khoản thất bại!");
      }
      else {
        if(data === true) {
          dispatch(deleteUserSuccess());
          toast.success("Tài khoản đã được xóa!");
          localStorage.clear();
          navigate("/");
        }
        else {
          toast.error("Xóa tài khoản thất bại!");
        }
      }
    } catch (err: any) {
      dispatch(deleteUserFailure("Có lỗi xảy ra trong quá trình!"));
      toast.error("Xóa tài khoản thất bại!");
      console.log("Có lỗi xảy ra: " + err.message);
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const { data, status } = await axios.put(`${API_URL}${AUTH}`, formData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        },
      });
      if(status !== 200) {
        if(status === 404) {
          dispatch(updateUserFailure("Người dùng không tồn tại!"));
          toast.error("Người dùng không tồn tại!");
        }
        else {
          if(status === 400) {
            dispatch(updateUserFailure("Tên người dùng đã tồn tại. Vui lòng dùng tên khác."));
            toast.error("Tên người dùng đã tồn tại. Vui lòng dùng tên khác.");
          }
          else {
            dispatch(updateUserFailure("Có lỗi xảy ra trong quá trình!"));
            toast.error("Có lỗi xảy ra trong quá trình!");
          }
        }
      }
      else{
        dispatch(updateUserSuccess(data));
        toast.success("Tài khoản đã cập nhật thành công!");
        localStorage.setItem("token", data);
        var now = new Date().getTime();
        localStorage.setItem("setupTime", now.toString());
        
      }
    } catch (err: any) {
       dispatch(updateUserFailure("Có lỗi xảy ra trong quá trình!"));
       toast.error("Có lỗi xảy ra trong quá trình!");
       console.log(err.message);
    }
  };
  return (
    <div className="profile">
      <SubNav />
      <form onSubmit={handleSubmit} className="form">
        <input
          type="file"
          ref={refUrl}
          hidden
          accept="image/*"
          onChange={(e) => {
            e.target.files !== null ? setImage(e.target.files[0]) : "";
          }}
        />
        {/* firebase storage rules
            allow read;
            allow write: if
            request.resource.size < 2 * 1024 * 1024 &&
            request.resource.contentType.matches("image/.*") */}
        <img
          src={formData.imageUrl || user.image}
          alt=""
          className="profile-image"
          onClick={() => {
            if (refUrl != null) {
              refUrl.current?.click();
            }
          }}
        />
        <p className="text-sm self-center">
          {imageError ? (
            <span className="red">
              Error uploading image (file size must be less than 2 MB)
            </span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className="slate">{`Uploading: ${imagePercent} %`}</span>
          ) : imagePercent === 100 ? (
            <span className="green">Image uploaded successfully</span>
          ) : (
            ""
          )}
        </p>
        <input
          defaultValue={user.username}
          type="text"
          id="username"
          placeholder="Username"
          className="input-text"
          onChange={handleChange}
          required
        />
        <input
          defaultValue={user.email}
          type="text"
          id="email"
          placeholder="Email"
          className="input-text"
          disabled
        />
        <input
          type="password"
          id="password"
          placeholder="Change your password"
          className="input-text"
          onChange={handleChange}
        />
        <button className="slate btn-disable">
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <div className="wrapper-function-btn">
        <span onClick={handleDeleteAccount} className="red cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignOut} className="blue cursor-pointer">
          Sign out
        </span>
      </div>
    </div>
  );
}
