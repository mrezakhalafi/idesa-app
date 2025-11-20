import { useEffect, useState } from "react";
import "./Forum.css";
import { Link } from "react-router-dom";
import axios from "axios";
import PostDrawer from "../components/PostDrawer";
import CommentDrawer from "../components/CommentDrawer";

interface ForumData {
  id: number;
  forum_id: string;
  f_pin: string;
  name: string;
  post: string;
  category_id: number;
  total_like: number;
  total_comment: number;
  created_at: string;
  is_liked: number;
  image: string;
}

interface Category {
  id: number;
  category_id: string;
  name: string;
  icon: string;
}

const Forum = () => {
  const [posts, setPosts] = useState<ForumData[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [currentForumId, setCurrentForumId] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCategory = () => {
    axios
      .get<Category[]>(`${import.meta.env.VITE_API_URL}/category_posts`)
      .then((response) => {
        setCategory(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the forum data.", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchPosts = () => {
    axios
      .get<ForumData[]>(`${import.meta.env.VITE_API_URL}/forum`, {
        params: {
          category: selectedCategory,
          f_pin: JSON.parse(localStorage.getItem("loginData") || "{}").f_pin
        },
      })
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the forum data.", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategory();
    fetchPosts();
  }, [selectedCategory]);

  const changeCategory = (category: number) => {
    setSelectedCategory(category);
  };


  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000;

    if (diff < 60) {
      return `Baru saja`;
    }

    if (diff < 3600) {
      return `${Math.round(diff / 60)} menit yang lalu`;
    }

    if (diff < 86400) {
      return `${Math.round(diff / 3600)} jam yang lalu`;
    }

    return `${Math.round(diff / 86400)} hari yang lalu`;
  };

  const deletePost = ({ id }: { id: number }) => {
    axios
      .delete(`${import.meta.env.VITE_API_URL}/forum/delete/${id}`)
      .then(() => {
        setPosts(posts.filter((p) => p.id !== id));
      })
      .catch((error) => console.error(error));
  };

  const likePost = ({ forum_id }: { forum_id: string }) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/forum/like`, {
        f_pin: JSON.parse(localStorage.getItem("loginData") || "{}").f_pin,
        forum_id: forum_id,
      })
      .then(() => {
        fetchPosts();
      })
      .catch((error) => console.error(error));
  };
  
  const openChat = () => {
    if ((window as any).Android && typeof (window as any).Android.openChat === "function") {
      (window as any).Android.openChat();
    } else {
      console.log("Android interface not available");
    }
  };

  return (
    <div className="main-container">
      <div className="background">
        <div className="header py-3">
          <div className="d-flex">
            <Link
              to="/" replace
              className="header-icon"
              style={{
                fontSize: "24px",
                color: "white",
                textDecoration: "none",
              }}
            >
              <i className="fa-solid fa-arrow-left" />
            </Link>
            <h1 className="ms-3" style={{ marginTop: "0.35rem" }}>
              Forum
            </h1>
            <div
              onClick={openChat}
              className="header-icon"
              style={{
                fontSize: "24px",
                color: "white",
                textDecoration: "none",
                position: "absolute",
                right: "5%",
              }}
            >
              <i className="fa-solid fa-comment" />
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4 px-3">
        <button
          className="btn-create-post mb-4"
          data-bs-toggle="offcanvas"
          data-bs-target="#postDrawer"
          aria-controls="postDrawer"
        >
          <i className="fas fa-edit" /> Buat Postingan
        </button>

        <h4 className="section-title-forum">Forum Terbaru</h4>

        <div className="nav nav-tabs nav-pills-container-forum d-flex flex-nowrap overflow-x-auto">

          {category.map((ctg) => (
            <button
              id={`${ctg.name.toLowerCase()}-tab`}
              key={ctg.id}
              className={`nav-link-forum ${
                selectedCategory === ctg.id ? "active" : ""
              }`}
              onClick={() => changeCategory(ctg.id)}
              >
              <i className={`fa ${ctg.icon} me-2 pe-1`} /> 
              {ctg.name}
            </button>
          ))}
         
        </div>

        <div className="tab-content" id="forumTabContent">
          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status" />
              <div className="mt-2">Memuat Data...</div>
            </div>
          )}

          {!loading && !posts.length && (
            <>
              <div className="alert alert-light text-center px-5" role="alert">
                <i className="fas fa-exclamation-circle me-2" />
                Postingan untuk kategori ini saat ini belum tersedia.
              </div>
              <img
                src="post.png"
                alt="Notifikasi"
                className="w-50 d-block mx-auto"
              />
            </>
          )}

          <div className="forum-list mt-2">
            {!loading &&
              posts.map((post) => (
                <div key={post.id} className="card-forum px-3 py-1">
                  <div className="post-header">
                    <img
                      src={post.image ? post.image : "user.png"}
                      className="rounded-circle my-1 border me-3"
                      style={{ width: "43px", height: "43px" }}
                      alt="..."
                    />
                    <div>
                      <p className="mb-0 post-name">
                        <strong>{post.name ? post.name : "User iDesa"}</strong>
                      </p>
                      <small className="post-meta">
                        {timeAgo(post.created_at)}
                      </small>
                    </div>
                    <div className={`ms-auto ${post.f_pin == JSON.parse(localStorage.getItem("loginData") || "{}").f_pin ? "" : "d-none"}`}>
                      <div className="dropdown">
                        <i
                          className="fas fa-ellipsis-h fa-lg"
                          data-bs-toggle="dropdown"
                        />
                        <ul className="dropdown-menu">
                          <li>
                            <button
                              className="dropdown-item text-danger"
                              onClick={() => {
                                deletePost({ id: post.id });
                              }}
                            >
                              Hapus
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="post-body">
                    <p className="mb-0">{post.post}</p>
                  </div>
                  <div className="post-footer">
                    <div
                      className="action-btn"
                      onClick={() => {
                        setCurrentForumId(post.forum_id);
                      }}
                      data-bs-toggle="offcanvas"
                      data-bs-target="#commentDrawer"
                      aria-controls="commentDrawer"
                    >
                      <i className="fas fa-comment me-1 fa-lg" />{" "}
                      {post.total_comment}
                    </div>
                    <div
                      className="action-btn"
                      onClick={() =>
                        post.is_liked === 0
                          ? likePost({ forum_id: post.forum_id })
                          : null
                      }
                    >
                      <i
                        className={`fas fa-thumbs-up fa-lg ${
                          post.is_liked === 1 ? "text-primary" : ""
                        } me-1`}
                      />{" "}
                      {post.total_like}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <PostDrawer onPostCreated={fetchPosts} />
      <CommentDrawer forumId={currentForumId} onCommentCreated={fetchPosts} />
    </div>
  );
};

export default Forum;
