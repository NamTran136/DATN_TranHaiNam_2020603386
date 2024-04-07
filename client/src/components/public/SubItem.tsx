import Title from "./Title";

const quotes = [
  '"Chúng ta sẽ trở thành gì phụ thuộc vào điều chúng ta đọc sau khi các thầy cô giáo đã xong việc với chúng ta. Trường học vĩ đại nhất chính là sách vở." - Thomas Carlyle',
  '"Bạn biết rằng bạn đã đọc một cuốn sách hay khi bạn giở đến trang cuối cùng và cảm thấy như mình vừa chia tay một người bạn." - Khuyết Danh',
  '"Bạn càng đọc nhiều, bạn càng biết nhiều thêm. Bạn càng học được nhiều thêm, bạn sẽ càng đi được nhiều nơi hơn nữa." – Dr. Seuss',
];

const SubItem = () => {
  const randomNumber = Math.random() * (2 - 0) + 0;
  return (
    <div className="generalSubItem">
      <Title text="Danh ngôn hay" />
      <div className="generalSubItem-text">{quotes[Math.floor(randomNumber)]}</div>
    </div>
  );
};

export default SubItem;
