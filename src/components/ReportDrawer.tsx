import { useState, useRef, useEffect } from 'react'
import axios from "axios";

interface ReportDrawerProps {
  onReportCreated: () => void;
}

interface Category {
  id: number;
  category_id: string;
  name: string;
  icon: string;
}
const ReportDrawer = ({ onReportCreated}: ReportDrawerProps) => {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
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

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    if (!title || title === '') {
      return;
    }

    axios.post(`${import.meta.env.VITE_API_URL}/report/create`, {
      f_pin: JSON.parse(localStorage.getItem("loginData") || "{}").f_pin,
      title: title,
      description: description,
      category: selectedCategory
    })
    .then(response => {
      
      console.log(response);
      onReportCreated();       
      setTitle("");
      setDescription("");
      setSelectedCategory("1");
      closeBtnRef.current?.click();
      
    })
    .catch(error => {
      console.error(error);
    });

  }

  return (
    <div className={`offcanvas offcanvas-bottom h-75 drawer`} id="reportDrawer" aria-labelledby="reportDrawerLabel">
        <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="reportDrawerLabel">Buat Aduan</h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" ref={closeBtnRef}></button>
        </div>
        <div className="offcanvas-body">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="post-category" className="form-label">Sektor</label>
                    <select className="form-select" id="post-category" aria-label="Default select example" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                        {category.map(ctg => (
                            <option key={ctg.id} value={ctg.id}>{ctg.name}</option>
                        ))}
                    </select>
                </div>
                  <div className="mb-3">
                    <label htmlFor="post-text" className="form-label">Judul Aduan</label>
                    <input type="text" className="form-control" id="post-text" aria-describedby="post-text" value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="post-text" className="form-label">Deskripsi Aduan</label>
                    <textarea style={{height: '200px'}} className="form-control" id="post-text" aria-describedby="post-text" value={description} onChange={e => setDescription(e.target.value)}></textarea>
                </div>
                <button type="submit" className="btn btn-dark mt-3 w-100" >Buat Aduan</button>
            </form>
        </div>
    </div>
    )
}

export default ReportDrawer

