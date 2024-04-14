import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
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
const SearchPage = lazy(() => import("./pages/public/searchPage"));
const Book = lazy(() => import("./pages/public/book"));
const ReadingBook = lazy(() => import("./pages/public/readingBook"));

// Admin
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const UserService = lazy(() => import("./pages/admin/UserService"));
const BookService = lazy(() => import("./pages/admin/BookService"));
const CategoryService = lazy(() => import("./pages/admin/CategoryService"));
const Comments = lazy(() => import("./pages/admin/Comments"));
const Advertisement = lazy(() => import("./pages/admin/Advertisement"));
const Confirmation = lazy(() => import("./pages/admin/Confirmation"));
const Settings = lazy(() => import("./pages/admin/Settings"));

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
    localStorage.getItem("token") !== undefined
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
            <Route path="/books/search/:searchValue" element={<SearchPage />} />
            <Route path="/books/search/" element={<AllBook />} />
            <Route path="book/:bookId" element={<Book />} />
            <Route path="reading-book/:bookId" element={<ReadingBook />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/books" element={<BookService />} />
            <Route path="/admin/categories" element={<CategoryService />} />
            <Route path="/admin/users" element={<UserService />} />
            <Route path="/admin/comments" element={<Comments />} />
            <Route path="/admin/advertisement" element={<Advertisement />} />
            <Route path="/admin/confirmation" element={<Confirmation />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
