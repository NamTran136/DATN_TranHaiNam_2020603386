import { useParams } from "react-router-dom";
import Title from "../../components/public/Title";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL, BLOG, BlogInfoDto } from "../../types";

const blogInfo = () => {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<BlogInfoDto>({} as BlogInfoDto);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    setIsLoading(true);
    await axios
      .get(API_URL + BLOG + `/${id}`)
      .then((response) => {
        return response.data;
      })
      .then((objectData: BlogInfoDto) => {
        setData(objectData);
      })
      .catch((err) => {
        setError("List of Blogs unavailable");
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Create markup function
  function createMarkup(c: any) {
    return { __html: c };
  }
  return (
    <div className="allBook-container" style={{display: "block"}}>
      <div className="allBook-content">
        <Title text="Góc Review" />
        {isLoading && <span>Loading...</span>}
        {data && (
          <div className="preview-section mb-3">
            <div className="content">
              <div
                className="main-content"
                dangerouslySetInnerHTML={createMarkup(data.content)}
              ></div>
            </div>
          </div>
        )}
        {error && (
          <span className="red">Có lỗi xảy ra trong quá trình tải</span>
        )}
      </div>
    </div>
  );
};

export default blogInfo;
