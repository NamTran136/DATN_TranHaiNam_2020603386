import { useNavigate } from "react-router-dom";
import SubItem from "../../components/public/SubItem";
import Menu from "../../components/public/Menu";
import Title from "../../components/public/Title";
import { useEffect, useState } from "react";
import { API_URL, BLOG, BlogDto } from "../../types";
import axios from "axios";

const review = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<BlogDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    setIsLoading(true);
    await axios
      .get(API_URL + BLOG)
      .then((response) => {
        return response.data;
      })
      .then((objectData: BlogDto[]) => {
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
  return (
    <div className="allBook-container">
      <div className="allBook-content">
        <Title text="Góc Review" />

        {isLoading && <span>Loading...</span>}
        {data && (
          <div className="review-container">
            {data.map((d, i) => (
              <div className="review-item" key={i}>
                <div
                  className="review-item-container"
                  onClick={() => navigate(`/bloginfo/${d.id}`)}
                >
                  {/* Blog Thumbnail  */}
                  <img className="w-full" src={d.fileUrl} alt="blog" />
                  {/* Top Items  */}
                  <div className="review-item-content p-6">
                    {/* Blog Date  */}
                    <h2>{d.time}</h2>
                    {/* Blog Title  */}
                    <h1>{d.title}</h1>
                    {/* Blog Description  */}
                    <p>{d.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {error && <span className="red">Không có bài viết nào</span>}
      </div>
      <div className="sub-item-container">
        <SubItem />
      </div>
      <div className="menu-container">
        <Menu />
      </div>
    </div>
  );
};

export default review;
