import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL, BOOK, BookDto, BookToEditDto, CATEGORY, CategoryDto } from "../../../../types";
import axios from "axios";
import { useAppSelector } from "../../../../store/store";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../../../firebase";

const update = () => {
  const navigate = useNavigate();
  useEffect(() => {
    fetchCategories();
    fetchData();
  }, []);
  const { id } = useParams();
  const [value, setValue] = useState<BookToEditDto>({
    id: 0,
    code: "",
    title: "",
    description: "",
    author: "",
    language: "",
    imageUrl: "",
    isPrivate: false,
    category: "",
  });
  const fetchData = () => {
    axios
      .get(API_URL + BOOK + "/" + id)
      .then((response) => {
        const book: BookDto = response.data;
        setValue({
          id: book.id,
          code: book.code,
          title: book.title,
          description: book.description,
          author: book.author,
          language: book.language,
          imageUrl: book.imageUrl,
          isPrivate: book.isPrivate,
          category: book.category
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const { token } = useAppSelector((state) => state.user);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const handleBack = () => {
    navigate("/admin/books");
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");
    axios
      .put(`${API_URL}${BOOK}`, value, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 204) {
          setMessage("Edit this book successfully.");
          setError("");
        }
      })
      .catch((err) => {
        console.log(err.message);
        setError("Edit this book unsuccessfully.");
        setMessage("");
      });
  };
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const refUrl = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<any | undefined>(undefined);
  const [imageError, setImageError] = useState(false);
  const [imagePercent, setImagePercent] = useState(0);
  const fetchCategories = async () => {
    await axios
      .get(API_URL + CATEGORY)
      .then((response) => {
        return response.data;
      })
      .then((objectData: CategoryDto[]) => {
        setCategories(objectData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
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
            <label htmlFor="code">Code</label>
            <input
              value={value.code}
              type="text"
              name="code"
              onChange={(e) => setValue({ ...value, code: e.target.value })}
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="title">Title</label>
            <input
              value={value.title}
              type="text"
              name="title"
              onChange={(e) => setValue({ ...value, title: e.target.value })}
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="author">Author</label>
            <input
              value={value.author}
              type="text"
              name="author"
              onChange={(e) => setValue({ ...value, author: e.target.value })}
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="language">Language</label>
            <input
              value={value.language}
              type="text"
              name="language"
              onChange={(e) => setValue({ ...value, language: e.target.value })}
            />
          </div>
          <div className="textarea-wrapper">
            <label htmlFor="description">Description</label>
            <textarea
              value={value.description}
              rows={4}
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
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={value.category}
              onChange={(e) => setValue({ ...value, category: e.target.value })}
            >
              {categories.map((category) => (
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
        <div className="mt-2">
          {message && <span className="green">{message}</span>}
          {error && <span className="red">{error}</span>}
        </div>
      </div>
    </div>
  );
};

export default update;
