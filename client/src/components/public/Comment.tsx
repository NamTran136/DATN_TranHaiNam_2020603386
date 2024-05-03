import { useEffect, useState } from "react";
import Title from "./Title";
import axios from "axios";
import { API_URL, COMMENT, CommentDto } from "../../types";
import toast from "react-hot-toast";
import { useAppSelector } from "../../store/store";

interface CommentProps {
    bookId: number;
    email?: string;
}

const Comment = ({bookId, email}: CommentProps) => {
  const { token } = useAppSelector((state) => state.user);
  const [comments, setComments] = useState<CommentDto[]>();
  const [isLoadingComment, setIsLoadingComment] = useState(false);
  const [errorComment, setErrorComment] = useState<string | null>(null);
  useEffect(() => {
    fetchComment();
  }, []);
const fetchComment = () => {
  setIsLoadingComment(true);
  axios
    .get(API_URL + COMMENT + "/book=" + bookId)
    .then((response) => {
      setComments(response.data);
      setErrorComment(null);
    })
    .catch((err) => {
      setErrorComment("Có lỗi xảy ra khi tải.");
      console.log(err);
    })
    .finally(() => {
      setIsLoadingComment(false);
    });
};
const [value, setValue] = useState<string>("");
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  console.log({
    content: value,
    email: email,
    bookId: bookId,
  });
  if(!email) {
    toast.error("Bạn cần đăng nhập trước khi bình luận.");
    return;
  }
  await axios
    .post(`${API_URL}${COMMENT}`, {
      content: value,
      email: email,
      bookId: bookId
    }, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      if (res.status === 200) {
        setValue("");
        fetchComment();
        console.log(1);
      }
    })
    .catch((err) => {
      console.log(err.message);
      toast.error("Có lỗi xảy ra!");
    });
};
  return (
    <div className="comment">
      <Title text="Bình luận" />
      <div>
        <div className="comment-list">
          {isLoadingComment && <div>Loading...</div>}
          {comments &&
            comments?.map((comment, index) => (
              <div className="comment-list-item" key={index}>
                <div className="user-comment">
                  <div className="user-comment-img">
                    <img src={`${comment?.imageUrl}`} alt="" />
                  </div>
                  <div className="content-wrapper">
                    <h4>{comment.username}</h4>
                    {comment.content}
                    <div className="time-comment">
                      <span>{comment?.timeUp}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          {errorComment && (
            <div className="red book-message">
              <span>{"" + errorComment}</span>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="comment-form">
            <div className="comment-form-input">
              <label htmlFor="comment">Bình luận của bạn</label>
              <textarea
                id="comment"
                rows={2}
                className=""
                placeholder="Write a comment..."
                required
                onChange={(e) => setValue(e.target.value)}
                value={value}
              />
            </div>
            <div className="btn-submit">
              <button
                type="submit"
                className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800"
              >
                Post comment
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Comment