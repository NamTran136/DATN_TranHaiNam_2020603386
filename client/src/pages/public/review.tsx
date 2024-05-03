import { useNavigate } from "react-router-dom";
import SubItem from "../../components/public/SubItem";
import Menu from "../../components/public/Menu";
import Title from "../../components/public/Title";

const review = () => {
  const navigate = useNavigate();
  return (
    <div className="allBook-container">
      <div className="allBook-content">
        <Title text="Góc Review" />
        <div className="review-container">
          {/* Card 1  */}
          <div className="review-item">
            <div className="review-item-container">
              {/* Blog Thumbnail  */}
              <img
                onClick={() => navigate(`/bloginfo`)}
                className="w-full"
                src={
                  "https://nhasachmienphi.com/wp-content/uploads/Green-Garbage-Enzyme-GGE.jpg"
                }
                alt="blog"
              />
              {/* Top Items  */}
              <div className="review-item-content p-6">
                {/* Blog Date  */}
                <h2>{"25/04/2024"}</h2>
                {/* Blog Title  */}
                <h1>{"Cách làm Enzym hữu cơ Green Garbage Enzyme (GGE)"}</h1>
                {/* Blog Description  */}
                <p>
                  {
                    "Cách làm Enzym hữu cơ Green Garbage Enzyme (GGE) HÀNH ĐỘNG CÙNG CHUNG TAY BẢO VỆ BẠN - GIA ĐÌNH BẠN & TRÁI ĐẤT VỚI Green Garbage Enzyme (GGE) Vì môi trường xanh, với không khí trong lành, đất đai..."
                  }
                </p>
              </div>
            </div>
          </div>
          {/* Card 1  */}
          <div className="review-item">
            <div className="review-item-container">
              {/* Blog Thumbnail  */}
              <img
                onClick={() => navigate(`/bloginfo`)}
                className="w-full"
                src={
                  "https://nhasachmienphi.com/wp-content/uploads/Green-Garbage-Enzyme-GGE.jpg"
                }
                alt="blog"
              />
              {/* Top Items  */}
              <div className="review-item-content p-6">
                {/* Blog Date  */}
                <h2>{"25/04/2024"}</h2>
                {/* Blog Title  */}
                <h1>{"Cách làm Enzym hữu cơ Green Garbage Enzyme (GGE)"}</h1>
                {/* Blog Description  */}
                <p>
                  {
                    "Cách làm Enzym hữu cơ Green Garbage Enzyme (GGE) HÀNH ĐỘNG CÙNG CHUNG TAY BẢO VỆ BẠN - GIA ĐÌNH BẠN & TRÁI ĐẤT VỚI Green Garbage Enzyme (GGE) Vì môi trường xanh, với không khí trong lành, đất đai..."
                  }
                </p>
              </div>
            </div>
          </div>

        </div>
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
