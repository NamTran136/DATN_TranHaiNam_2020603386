import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { lazy, Suspense } from "react";

import Loader from "./components/loader";
import PublicRoute from "./components/publicRoute";
import PrivateRoute from "./components/privateRoute";
import ProtectedRoute from "./components/protectedRoute";
import { Toaster } from "react-hot-toast";
// Public
const Home = lazy(() => import("./pages/public/home"));
const Profile = lazy(() => import("./pages/public/profile"));
const Feedback = lazy(() => import("./pages/public/Feedback"));
const AllBook = lazy(() => import("./pages/public/allBook"));
const BooksByCategory = lazy(() => import("./pages/public/booksByCategory"));
const SearchPage = lazy(() => import("./pages/public/searchPage"));
const Book = lazy(() => import("./pages/public/book"));
const ReadingBook = lazy(() => import("./pages/public/readingBook"));
const Review = lazy(() => import("./pages/public/review"));
const BlogInfo = lazy(() => import("./pages/public/blogInfo"));
const LikedBooks = lazy(() => import("./pages/public/LikedBooks"));
const WatchedBooks = lazy(() => import("./pages/public/WatchedBooks"));
// Admin
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const AccountService = lazy(() => import("./pages/admin/AccountService"));
const BookService = lazy(() => import("./pages/admin/BookService"));
const CategoryService = lazy(() => import("./pages/admin/CategoryService"));
const Comments = lazy(() => import("./pages/admin/Comments"));
const Blogs = lazy(() => import("./pages/admin/Blogs"));
const Feedbacks = lazy(() => import("./pages/admin/Feedbacks"));
const Settings = lazy(() => import("./pages/admin/Settings"));
const CategoryNew = lazy(() => import("./pages/admin/management/categoryServices/create"));
const CategoryRead = lazy(() => import("./pages/admin/management/categoryServices/read"));
const CategoryUpdate = lazy(
  () => import("./pages/admin/management/categoryServices/update")
);
const CategoryDelete = lazy(() => import("./pages/admin/management/categoryServices/delete"));
const BookNew = lazy(
  () => import("./pages/admin/management/bookServices/create")
);
const BookRead = lazy(
  () => import("./pages/admin/management/bookServices/read")
);
const BookUpdate = lazy(
  () => import("./pages/admin/management/bookServices/update")
);
const BookDelete = lazy(
  () => import("./pages/admin/management/bookServices/delete")
);
const AccountRead = lazy(
  () => import("./pages/admin/management/accountServices/read")
);
const AccountDelete = lazy(
  () => import("./pages/admin/management/accountServices/delete")
);
const CommentRead = lazy(
  () => import("./pages/admin/management/commentServices/read")
);
const CommentDelete = lazy(
  () => import("./pages/admin/management/commentServices/delete")
);
const CreateBlog = lazy(
  () => import("./pages/admin/management/blogs/CreateBlog")
);

const SignIn = lazy(() => import("./pages/public/signin"));
const SignUp = lazy(() => import("./pages/public/signup"));
const NotFound = lazy(() => import("./pages/notFound"));
const App = () => {
  
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<PublicRoute />}>
            <Route index element={<Home />} />
            <Route path="/books" element={<AllBook />} />
            <Route
              path="/books/category/:categoryId"
              element={<BooksByCategory />}
            />
            <Route path="/books/search/:searchValue" element={<SearchPage />} />
            <Route path="/books/search/" element={<AllBook />} />
            <Route path="book/:bookId" element={<Book />} />
            <Route path="reading-book/:bookId" element={<ReadingBook />} />
            <Route path="/review" element={<Review />} />
            <Route path="/bloginfo/:id" element={<BlogInfo />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/favouritebooks" element={<LikedBooks />} />
              <Route path="/watchedbooks" element={<WatchedBooks />} />
            </Route>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/books" element={<BookService />} />
            <Route path="/admin/categories" element={<CategoryService />} />
            <Route path="/admin/accounts" element={<AccountService />} />
            <Route path="/admin/comments" element={<Comments />} />
            <Route path="/admin/blogs" element={<Blogs />} />
            <Route path="/admin/feedbacks" element={<Feedbacks />} />
            <Route path="/admin/settings" element={<Settings />} />
            {/* Management */}
            {/* Category */}
            <Route path="/admin/category/new" element={<CategoryNew />} />
            <Route path="/admin/category/read/:id" element={<CategoryRead />} />
            <Route
              path="/admin/category/edit/:id"
              element={<CategoryUpdate />}
            />
            <Route
              path="/admin/category/delete/:id"
              element={<CategoryDelete />}
            />
            {/* Book */}
            <Route path="/admin/book/new" element={<BookNew />} />
            <Route path="/admin/book/read/:id" element={<BookRead />} />
            <Route path="/admin/book/edit/:id" element={<BookUpdate />} />
            <Route path="/admin/book/delete/:id" element={<BookDelete />} />
            {/* Account */}
            <Route path="/admin/account/read/:id" element={<AccountRead />} />
            <Route
              path="/admin/account/delete/:id"
              element={<AccountDelete />}
            />
            {/* Comments */}
            <Route path="/admin/comment/read/:id" element={<CommentRead />} />
            <Route
              path="/admin/comment/delete/:id"
              element={<CommentDelete />}
            />
            {/* Blogs */}
            <Route path="/admin/blog/new" element={<CreateBlog />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster />
    </Router>
  );
};

export default App;
