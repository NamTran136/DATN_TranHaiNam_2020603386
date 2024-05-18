import { BsSearch } from "react-icons/bs";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { FaBlogger, FaBookOpen, FaRegBell, FaUser } from "react-icons/fa";
import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { getRandomNumber } from "../../utils/appUtils";
import { BarChart } from "../../components/admin/Charts";
import { API_URL, CategoryDto, COMMON } from "../../types";
import axios from "axios";
import { useAppSelector } from "../../store/store";
import { BiSolidCategory } from "react-icons/bi";
import AdminSidebarMobile from "../../components/admin/AdminSidebarMobile";
import { IoMdMenu } from "react-icons/io";



const dashboard = () => {
  const { token } = useAppSelector((state) => state.user);
  const [isFold, setIsFold] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [topCategories, setTopCategories] = useState<CategoryDto[]>([] as CategoryDto[]);
  const [totalBook, setTotalBook] = useState<number>(0);
  const [totalCate, setTotalCate] = useState<number>(0);
  const [totalUser, setTotalUser] = useState<number>(0);
  const [totalBlog, setTotalBlog] = useState<number>(0);
  useEffect(()=>{
    fetchedTopCategories();
    fetchedTotalBook();
    fetchedTotalCate();
    fetchedTotalUser();
    fetchedTotalBlog();
  },[]);
  const fetchedTopCategories = async () => {
    const { data, status } = await axios.get(
      API_URL + COMMON + "/topcategories",
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if(status === 200){
      setTopCategories(data);
    }
    else{
      console.log("An error occurred!");
    }
  }
  const fetchedTotalBook = async () => {
    const { data, status } = await axios.get(
      API_URL + COMMON + "/1",
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if(status === 200){
      setTotalBook(data);
    }
    else{
      console.log("An error occurred!");
    }
  }
  const fetchedTotalCate = async () => {
    const { data, status } = await axios.get(
      API_URL + COMMON + "/6",
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (status === 200) {
      setTotalCate(data);
    } else {
      console.log("An error occurred!");
    }
  };
  const fetchedTotalUser = async () => {
    const { data, status } = await axios.get(
      API_URL + COMMON + "/2",
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (status === 200) {
      setTotalUser(data);
    } else {
      console.log("An error occurred!");
    }
  };
  const fetchedTotalBlog = async () => {
    const { data, status } = await axios.get(
      API_URL + COMMON + "/7",
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (status === 200) {
      setTotalBlog(data);
    } else {
      console.log("An error occurred!");
    }
  };
  return (
    <div
      className="admin-container"
      style={{
        gap: isFold ? "0.5rem" : "2rem",
      }}
    >
      <AdminSidebar isFold={isFold} setIsFold={setIsFold} />
      <AdminSidebarMobile isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="open-menu-icon" >
        <IoMdMenu size={24} onClick={() => setIsOpen(!isOpen)} />
      </div>
      
      <main className="dashboard" onClick={() => setIsOpen(false)}>
        <div className="bar">
          <BsSearch />
          <input type="text" placeholder="Search for data, users, docs" />
          <FaRegBell />
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXPodEp1Zyixlyx1Rrq6JJlPm0hgg1pFeLNrxgt2bkYw&s"
            alt="User"
          />
        </div>
        <div
          className="widget-container"
          style={{ marginLeft: isFold ? "2rem" : "" }}
        >
          <WidgetItem
            percent={getRandomNumber(-5.0, 15.0)}
            value={totalBook}
            heading="Books"
            color="rgb(0,115,255)"
            Icon={FaBookOpen}
          />
          <WidgetItem
            percent={getRandomNumber(-5.0, 15.0)}
            value={totalCate}
            heading="Categories"
            color="rgb(0 198 202)"
            Icon={BiSolidCategory}
          />
          <WidgetItem
            percent={getRandomNumber(-5.0, 15.0)}
            value={totalUser}
            heading="Users"
            color="rgb(255 196 0)"
            Icon={FaUser}
          />
          <WidgetItem
            percent={getRandomNumber(-5.0, 15.0)}
            value={totalBlog}
            heading="Blogs"
            color="rgb(76 0 255)"
            Icon={FaBlogger}
          />
        </div>
        <section className="graph-container">
          <div
            className="revenue-chart"
            style={{
              width: isFold ? "" : "762px",
              marginLeft: isFold ? "2rem" : "",
            }}
          >
            <h2>Download & View</h2>
            {/* Grapph here */}
            <BarChart
              data_2={[20, 44, 66, 80, 112]}
              data_1={[12, 22, 34, 55, 77]}
              title_1="Downloads"
              title_2="Views"
              bgColor_1="rgb(0,115,255)"
              bgColor_2="rgba(53,162,235,0.8)"
            />
          </div>

          <div className="dashboard-categories">
            <h2>Trend</h2>
            <div>
              {topCategories &&
                topCategories.map((item, i) => (
                  <CategoryItem
                    key={item.id}
                    heading={item.name}
                    value={i + 1}
                    color={`hsl(${20 * (5 - i) * 4},${20 * (5 - i)}%,50%)`}
                  />
                ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

interface WidgetItemProps {
  heading: string;
  value: number;
  percent: number;
  color: string;
  Icon: IconType;
}

const WidgetItem = ({
  heading,
  value,
  percent,
  color,
  Icon
}: WidgetItemProps) => (
  <article className="widget">
    <div className="widget-info">
      <p>{heading}</p>
      <h4>{value}</h4>
      <p>{percent}% from previous period</p>
    </div>

    <div
      className="widget-circle"
      style={{backgroundColor: color}}
    >
      <span
        style={{
          color,
        }}
      >
        <Icon size={24} />
      </span>
    </div>
  </article>
);

interface CategoryItemProps {
  color: string;
  value: number;
  heading: string;
}

const CategoryItem = ({ color, value, heading }: CategoryItemProps) => (
  <div className="category-item">
    <h5>{heading}</h5>
    <div className="category-item-wrapper">
      <div
        style={{
          backgroundColor: color,
          width: `${(6-value)*12.5}%`,
        }}
      ></div>
      <span>Top {value}</span>
    </div>
  </div>
);
export default dashboard;
