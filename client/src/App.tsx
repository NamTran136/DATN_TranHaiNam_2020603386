import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";

import Loader from "./components/loader";
import PublicRoute from "./components/publicRoute";
import PrivateRoute from "./components/privateRoute";
import ProtectedRoute from "./components/protectedRoute";
import { useAppDispatch } from "./store/store";
import { signInSuccess, signOut } from "./store/features/userSlice";
// Public
const Home = lazy(() => import("./pages/public/home"));
const Profile = lazy(() => import("./pages/public/profile"));
const AllBook = lazy(() => import("./pages/public/allBook"));
const BooksByCategory = lazy(() => import("./pages/public/booksByCategory"));
const Book = lazy(() => import("./pages/public/book"));
const ReadingBook = lazy(() => import("./pages/public/readingBook"));

// Admin
const TransitionPage = lazy(() => import("./pages/admin/index"));
const Dashboard = lazy(() => import("./pages/admin/dashboard"));

const SignIn = lazy(() => import("./pages/public/signin"));
const SignUp = lazy(() => import("./pages/public/signup"));
const App = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    checkToken();
  }, []);
  function checkToken() {
    var hours = 3;
    var now = new Date().getTime();
    var setupTime = localStorage.getItem("setupTime");
    if (setupTime == null) {
      localStorage.setItem("setupTime", now.toString());
      localStorage.removeItem("token");
    } else {
      if (now - parseInt(setupTime) > hours * 60 * 60 * 1000) {
        localStorage.clear();
      }
      localStorage.setItem("setupTime", now.toString());
    }
    localStorage.getItem("token")
      ? dispatch(signInSuccess(localStorage.getItem("token")))
      : dispatch(signOut());
  }
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<PublicRoute />}>
            <Route path="" element={<Home />} />
            <Route path="/books" element={<AllBook />} />
            <Route
              path="/books/category/:categoryId"
              element={<BooksByCategory />}
            />
            <Route path="book/:bookId" element={<Book />} />
            <Route path="reading-book/:bookId" element={<ReadingBook />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>
          <Route path="/admin/" element={<PrivateRoute />}>
            <Route path="" element={<TransitionPage />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
