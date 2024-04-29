import { useEffect, useState } from "react";
import { API_URL, BOOK, BookDto} from "../../types";
import axios from "axios";
import { useParams } from "react-router-dom";

const readingBook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [book, setBook] = useState<BookDto>();
  const [error, setError] = useState<string | null>(null);

  const { bookId } = useParams();
  useEffect(() => {
    fetchData();
  }, [bookId]);
  const fetchData = () => {
    setIsLoading(true);
    axios
      .get(API_URL + BOOK + "/" + bookId)
      .then((response) => {
        const book: BookDto = response.data;
        setBook(book);
        setError(null);
        console.log(`https://drive.google.com/file/d/${book?.code}/preview`);
      })
      .catch((err) => {
        setError("Không có sách nào có ID = " + bookId);
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
var iframe = document.getElementById("fullscreen-iframe");
  // Hàm để chuyển đổi chế độ fullscreen của iframe
  function toggleFullscreen() {
    if (
      !document.fullscreenElement
    ) {
      if (iframe?.requestFullscreen) {
        iframe.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }
  
  return (
    <div className="reading-book-wrapper">
      <button className="default-button mb-5" onClick={() => toggleFullscreen()}>
        Chế độ toàn màn hình
      </button>
      {isLoading && <span>Loading...</span>}
      {error && <span className="red">Có lỗi xảy ra trong quá trình tải</span>}
      {book && (
        <iframe
          src={`https://drive.google.com/file/d/${book.code}/preview`}
          sandbox="allow-same-origin allow-scripts"
          id="fullscreen-iframe"
        ></iframe>
      )}
    </div>
  );
};

export default readingBook;
