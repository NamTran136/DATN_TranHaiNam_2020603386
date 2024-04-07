import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { UserDto } from "../../types";

export default function profile() {
  const navigate = useNavigate();
  const refUrl = useRef<HTMLInputElement>(null);
  const initialFormValues: UserDto = {
    username: "",
    email: "",
    role: "",
    image: "",
  };
  const [formData, setFormData] = useState<UserDto>(initialFormValues);
  const [image, setImage] = useState<any | undefined>(undefined);
  const [imageError, setImageError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [comfirmPassword, setComfirmPassword] = useState("");
  const [imagePercent, setImagePercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
          setFormData({ ...formData, image: downloadURL })
        );
      }
    );
  };
  const handleSignOut = async () => {
    try {
      localStorage.removeItem("token");
      
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleDeleteAccount = () => {
    try {
      
    } catch (err: any) {
      console.log("Có lỗi xảy ra: " + err.message);
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      
    } catch (error: any) {
      
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          src={""}
          alt=""
          className="h-24 w-24 self-center cursor-pointer
        rounded-full object-over mt-2 border border-gray-300"
          onClick={() => {
            if (refUrl != null) {
              refUrl.current?.click();
            }
          }}
        />
        <p className="text-sm self-center">
          {imageError ? (
            <span className="text-red-700">
              Error uploading image (file size must be less than 2 MB)
            </span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className="text-slate-700">{`Uploading: ${imagePercent} %`}</span>
          ) : imagePercent === 100 ? (
            <span className="text-green-700">Image uploaded successfully</span>
          ) : (
            ""
          )}
        </p>
        <input
          defaultValue=""
          type="text"
          id="username"
          placeholder="Username"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
          required
        />
        <input
          defaultValue=""
          type="text"
          id="email"
          placeholder="Email"
          className="bg-slate-100 rounded-lg p-3"
          disabled
        />
        <input
          type="password"
          id="password"
          placeholder="Change your password"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-88">
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteAccount}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5">
        {error && "Có lỗi xảy ra khi cập nhật!"}
      </p>
      <p className="text-green-700 mt-5">
        {updateSuccess && `Tài khoản đã được cập nhật thành công!`}
      </p>
    </div>
  );
}
