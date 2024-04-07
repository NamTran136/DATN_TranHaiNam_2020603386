import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import Loader from "./components/loader";
import PublicRoute from "./components/publicRoute";
import PrivateRoute from "./components/privateRoute";
import ProtectedRoute from "./components/protectedRoute";
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
