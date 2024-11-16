import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./App.css";
import ArticleDetailPage from "./pages/articleDetail/ArticleDetailPage";
import HomePage from "./pages/home/HomePage";
import RegisterPage from "./pages/register/RegisterPage";
import LoginPage from "./pages/login/LoginPage";
import ProfilePage from "./pages/profile/ProfilePage";
import AdminLayout from "./pages/admin/AdminLayout";
import Admin from "./pages/admin/screens/Admin";
import Comments from "./pages/admin/screens/comments/Comments";
import Reviews from "./pages/admin/screens/reviews/Reviews";
import ManagePosts from "./pages/admin/screens/posts/ManagePosts";
import ManageExperiences from "./pages/admin/screens/experiences/ManageExperiences";
import EditPost from "./pages/admin/screens/posts/EditPost";
import EditExperience from "./pages/admin/screens/experiences/EditExperience";
import Categories from "./pages/admin/screens/categories/Categories";
import EditCategories from "./pages/admin/screens/categories/EditCategories";
import Users from "./pages/admin/screens/users/Users";
import BlogPage from "./pages/blog/BlogPage";
import ExperiencePage from "./pages/experience/ExperiencePage";
import AboutPage from './pages/about/AboutPage';
import ExperienceDetailPage from './pages/experienceDetail/ExperienceDetailPage';
import UserLayout from "./pages/user/UserLayout"; 
import UserManagePosts from "./pages/user/screens/posts/ManagePosts";  
import UserManageExperiences from "./pages/user/screens/experiences/ManageExperiences";
import UserEditPost from "./pages/user/screens/posts/EditPost";
import UserEditExperience from "./pages/user/screens/experiences/EditExperience";
import ManageFavorites from "./pages/user/screens/favorites/ManageFavorites"; 

function App() {
  return (
    <div className="App font-opensans">
      <Routes>
        <Route index path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="/blog/:slug" element={<ArticleDetailPage />} />
        <Route path="/experience/:slug" element={<ExperienceDetailPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Admin />} />
          <Route path="comments" element={<Comments />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="posts/manage" element={<ManagePosts />} />
          <Route path="experiences/manage" element={<ManageExperiences />} />
          <Route path="posts/manage/edit/:slug" element={<EditPost />} />
          <Route path="experiences/manage/edit/:slug" element={<EditExperience />} />
          <Route path="categories/manage" element={<Categories />} />
          <Route
            path="categories/manage/edit/:slug"
            element={<EditCategories />}
          />
          <Route path="users/manage" element={<Users />} />
        </Route>
        <Route path="/user" element={<UserLayout />}> 
          <Route path="posts/manage" element={<UserManagePosts />} />
          <Route path="experiences/manage" element={<UserManageExperiences />} />
          <Route path="posts/manage/edit/:slug" element={<UserEditPost />} />
          <Route path="experiences/manage/edit/:slug" element={<UserEditExperience />} />
          <Route path="favorites/manage" element={<ManageFavorites />} />  
        </Route>
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;