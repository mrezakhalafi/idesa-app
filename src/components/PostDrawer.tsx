import { useState, useEffect, useRef } from 'react'
import axios from "axios";

interface PostDrawerProps {
  onPostCreated: () => void;
}

interface Category {
  id: number;
  category_id: string;
  name: string;
  icon: string;
}

const PostDrawer = ({ onPostCreated}: PostDrawerProps) => {

  const [post, setPost] = useState('');
  const [category, setCategory] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("1");
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const fetchCategory = () => {
    axios
      .get<Category[]>(`${import.meta.env.VITE_API_URL}/category_posts`)
      .then((response) => {
        setCategory(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the forum data.", error);
      });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    if (!post || post === '') {
      return;
    }

    axios.post(`${import.meta.env.VITE_API_URL}/forum/create`, {
      f_pin: JSON.parse(localStorage.getItem("loginData") || "{}").f_pin,
      post: post,
      category: selectedCategory
    })
    .then(response => {
      
      console.log(response);
      onPostCreated();       
      setPost("");
      setSelectedCategory("1");
      closeBtnRef.current?.click();
      
    })
    .catch(error => {
      console.error(error);
    });
  }

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <div className={`offcanvas offcanvas-bottom h-75 drawer`} id="postDrawer" aria-labelledby="postDrawerLabel">
        <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="postDrawerLabel">Buat Postingan</h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" ref={closeBtnRef}></button>
        </div>
        <div className="offcanvas-body">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="post-text" className="form-label">Postingan</label>
                    <textarea style={{height: '200px'}} className="form-control" id="post-text" aria-describedby="post-text" value={post} onChange={e => setPost(e.target.value)}></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="post-category" className="form-label">Kategori</label>
                    <select className="form-select" id="post-category" aria-label="Default select example" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                        {category.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-dark mt-3 w-100" >Buat Postingan</button>
            </form>
        </div>
    </div>
    )
}

export default PostDrawer

