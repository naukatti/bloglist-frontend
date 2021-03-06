import React, { useState, useEffect } from "react";
import "./styles.css";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import { Notification } from "./Notification";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({
    message: "",
    status: "",
  });

  const showNotification = (status, message) => {
    setNotification({ status, message });
    setTimeout(() => {
      clearNotification();
    }, 3000);
  };
  const clearNotification = () => {
    setNotification({ status: "", message: "" });
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (error) {
      console.log(error);
      showNotification("error", `Wrong credentials`);
    }
  };

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value);
  };

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value);
  };

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value);
  };

  const addBlog = async (event) => {
    event.preventDefault();

    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    };
    try {
      await blogService.create(blogObject);
      setBlogs(blogs.concat(blogObject));
      console.log("Onnistui");
      showNotification(
        "success",
        `a new blog ${blogObject.title} by ${blogObject.author} was posted!`
      );
    } catch (error) {
      console.log(error);
      showNotification("error", `Could not post blog`);
    }
  };

  const logout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
    setUsername("");
    setPassword("");
  };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);

      blogService.getAll().then((blogs) => {
        setBlogs(blogs);
      });
    }
  }, []);

  const blogForm = () => (
    <div>
      <form onSubmit={addBlog}>
        <label>Title</label>
        <input value={newTitle} onChange={handleTitleChange} />
        <label>Author</label>
        <input value={newAuthor} onChange={handleAuthorChange} />
        <label>Url</label>
        <input value={newUrl} onChange={handleUrlChange} />
        <button type="submit">save</button>
      </form>
      <button onClick={logout}>Logout</button>
    </div>
  );

  const loginForm = () => (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );

  return (
    <div>
      <h1>Blogs</h1>
      <Notification notification={notification} />
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p>{user.name} logged in</p>
          {blogForm()}
          <ul>
            {blogs.map((blog, i) => (
              <li key={i}>{blog.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
