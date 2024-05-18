import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL, BOOK,  BookToEditDto, CATEGORY, CategoryDto,  } from "../../../../types";
import axios from "axios";
import { useAppSelector } from "../../../../store/store";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../../../firebase";
import toast from "react-hot-toast";
const create = () => {
    const navigate = useNavigate();
    const { token } = useAppSelector((state) => state.user);
    const [value, setValue] = useState<BookToEditDto>({
      id: 0,
      file: undefined,
      title: "",
      description: "",
      author: "",
      language: "",
      imageUrl: "",
      isPrivate: false,
      category: "Cổ tích - Thần thoại",
    });
    const [data, setData] = useState<CategoryDto[]>([]);
    
    useEffect(() => {
      fetchData();
    }, []);

    const fetchData = async () => {
      await axios
        .get(API_URL + CATEGORY)
        .then((response) => {
          return response.data;
        })
        .then((objectData: CategoryDto[]) => {
          setData(objectData);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Có lỗi xảy ra khi tải");
        });
    };
    const handleBack = () => {
        navigate("/admin/books");
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log(value);
      const { status } = await axios.post(API_URL+BOOK+"/UploadFileAdd", value, {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (status === 200) {
          toast.success("Add a category successfully.");
          setValue({
            ...value,
            file: undefined,
            title: "",
            description: "",
            author: "",
            language: "",
            imageUrl: "",
            isPrivate: false,
            category: "Cổ tích - Thần thoại",
          });
          setImagePercent(0);
        } else {
          toast.error("Có lỗi xảy ra trong quá trình gửi");
        }
    };

    const refUrl = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState<any | undefined>(undefined);
    const [imageError, setImageError] = useState(false);
    const [imagePercent, setImagePercent] = useState(0);
    useEffect(() => {
      if (image) {
        handleFileUpload(image);
      }
    }, [image]);
    const handleFileUpload = async (image: any | undefined) => {
      //console.log(image);
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
            setValue({ ...value, imageUrl: downloadURL })
          );
        }
      );
    };
  return (
    <div className="create-container" onClick={handleBack}>
      <div
        className="create-content"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h1>Add Book</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <label htmlFor="file">File Book:</label>
            <input
              type="file"
              required
              onChange={(e) => {
                e.target.files !== null &&
                  setValue({ ...value, file: e.target.files[0] });
              }}
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="title">Title</label>
            <input
              value={value.title}
              type="text"
              name="title"
              required
              onChange={(e) => setValue({ ...value, title: e.target.value })}
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="author">Author</label>
            <input
              value={value.author}
              type="text"
              required
              name="author"
              onChange={(e) => setValue({ ...value, author: e.target.value })}
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="language">Language</label>
            <input
              value={value.language}
              type="text"
              required
              name="language"
              onChange={(e) => setValue({ ...value, language: e.target.value })}
            />
          </div>
          <div className="textarea-wrapper">
            <label htmlFor="description">Description</label>
            <textarea
              value={value.description}
              rows={4}
              required
              name="description"
              onChange={(e) =>
                setValue({ ...value, description: e.target.value })
              }
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="imageUrl">Image</label>
            <input
              className="none"
              type="file"
              ref={refUrl}
              hidden
              required
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
              src={value.imageUrl || "/NoImage.png"}
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
          </div>
          <div className="switch-wrapper">
            <label>Status</label>
            <div>
              <input
                checked={value.isPrivate}
                onChange={(e) =>
                  setValue({ ...value, isPrivate: e.target.checked })
                }
                type="checkbox"
                id="isPrivate"
              />
              <label htmlFor="isPrivate" className="button"></label>
            </div>
          </div>
          <div className="input-wrapper mt-32">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={value.category}
              onChange={(e) => setValue({ ...value, category: e.target.value })}
            >
              {data.map((category) => (
                <option value={category.name} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="btn-wrapper">
            <button type="submit" className="btn-primary">
              Submit
            </button>
            <Link to="/admin/books" className="btn-secondary">
              Back
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default create