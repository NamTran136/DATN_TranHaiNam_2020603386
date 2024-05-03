import { Link } from "react-router-dom";

const notFound = () => {
  return (
    <div>
      <h2>Page not found!</h2>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Unde maiores
        natus porro eveniet quaerat sapiente sunt exercitationem impedit sint,
        ducimus nihil possimus! Voluptate nisi quasi ipsa debitis aliquid
        aliquam beatae?
      </p>

      <p>Go to the <Link style={{color: "blue"}} to="/">HomePage</Link></p>
    </div>
  );
};

export default notFound;
