
import { useEffect, useState } from "react";
import axios from "axios";

interface Comment {
  id: number;
  forum_id: number;
  f_pin: string;
  comment: string;
  created_at: string;
  name: string;
  image: string;
}

interface CommentDrawerProps {
  forumId: string;
  onCommentCreated: () => void;
}

const CommentDrawer = ({ forumId, onCommentCreated }: CommentDrawerProps) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [post, setPost] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchComments = () => {
        axios
        .post<Comment[]>(`${import.meta.env.VITE_API_URL}/forum/get_comments`, {
            forum_id: forumId,
        })
        .then((res) => {
          setComments(res.data);
        })
        .catch((err) => console.error("Error fetching comments:", err))
         .finally(() => {
          setLoading(false);
        });
    };

    useEffect(() => {

        if (!forumId) return;
        fetchComments();
        
    },[forumId]);

    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = (now.getTime() - date.getTime()) / 1000;

        if (diff < 60) {
        return `Baru saja`;
        }

        if (diff < 3600) {
        return `${Math.round(diff / 60)} m`;
        }

        if (diff < 86400) {
        return `${Math.round(diff / 3600)} j`;
        }

        return `${Math.round(diff / 86400)} h`;
    };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    if (!post || post === '') {
      return;
    }

    axios.post(`${import.meta.env.VITE_API_URL}/forum/comment`, {
      f_pin: JSON.parse(localStorage.getItem("loginData") || "{}").f_pin,
      forum_id: forumId,
      comment: post,
    })
    .then(response => {
      
        console.log(response);
        setPost("");
        fetchComments();
        onCommentCreated();
      
    })
    .catch(error => {
      console.error(error);
    });
  }

  const deleteComment = (commentId: number) => {

    axios.delete(`${import.meta.env.VITE_API_URL}/forum/delete_comment/${commentId}`)
    .then(response => {

      console.log(response);

      fetchComments();
      onCommentCreated();
      
    })
    .catch(error => {
      console.error(error);
    });

  }

  return (
    <div
      className="offcanvas offcanvas-bottom h-75 drawer"
      id="commentDrawer"
      aria-labelledby="commentDrawerLabel"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="commentDrawerLabel">
          Komentar Postingan
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body">

        {loading && (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status" />
            <div className="mt-2">Memuat Data...</div>
          </div>
        )}

        {!loading && !comments.length && (
          <>
            <div className="alert alert-light text-center px-5" role="alert">
              <i className="fas fa-exclamation-circle me-2" />
              Belum ada komentar.
            </div>
          </>
        )}
        {!loading &&
          comments.map((c) => (
            <div key={c.id} className="d-flex mb-4">
              <img
                src={c.image ? c.image : "user.png"}
                className="rounded-circle my-2 border"
                style={{ width: "55px", height: "55px" }}
                alt="..."
              />
              <div className="ms-3">
                <div className="d-flex">
                    <small className="mb-0 fw-bold">{c.name ? c.name : "User iDesa"}</small>
                </div>
                <small className="text-muted">{timeAgo(c.created_at)}</small>
                <p className="mb-0 mt-1">{c.comment}</p>
              </div>
               <i className={`fas fa-trash-alt text-danger ms-auto my-auto cursor-pointer mx-2 ${c.f_pin === JSON.parse(localStorage.getItem("loginData") || "{}").f_pin ? "" : "d-none"}`} onClick={() => deleteComment(c.id)}></i>
            </div>
          ))}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 mt-4">
            <label htmlFor="post-text" className="form-label">
              Tambah Komentar
            </label>
            <textarea
              style={{ height: "50px" }}
              className="form-control"
              id="post-text"
              value={post}
              onChange={(e) => setPost(e.target.value)}
            ></textarea>
          </div>
          <button type="submit" className="btn btn-dark mt-3 w-100">
            Kirim
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentDrawer;
