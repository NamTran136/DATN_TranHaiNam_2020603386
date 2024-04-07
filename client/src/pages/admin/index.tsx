import { Link } from "react-router-dom";

const index = () => {
  return (
    <div>
      <Link to="/admin/dashboard">
        <button>Visit Dashboard</button>
      </Link>
    </div>
  );
}

export default index