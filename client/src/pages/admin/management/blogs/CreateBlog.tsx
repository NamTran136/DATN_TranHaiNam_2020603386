import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Link } from 'react-router-dom';
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';
import { Now } from '../../../../utils/appUtils';
import { API_URL, BLOG } from '../../../../types';
import axios from 'axios';
import { useAppSelector } from '../../../../store/store';
import toast from 'react-hot-toast';

interface BlogProps {
    content: string;
    title: string;
    description: string;
    file: any | undefined;
    time: string
}



function CreateBlog() {
    const initialFormValues: BlogProps = {
      content: "",
      title: "",
      description: "",
      file: undefined,
      time: "",
    };
    const { token } = useAppSelector((state) => state.user);
    const [blogs, setBlogs] = useState<BlogProps>(initialFormValues);
    const [thumbnail, setThumbnail] = useState<any | undefined>(undefined);
    const [apiKey] = useState(import.meta.env.VITE_TINYMCE_API_KEY)
    const [text, setText] = useState('');
    console.log("Value: ", );
    console.log("text: ", text);
    // Create markup function 
    function createMarkup(c: any) {
        return { __html: c };
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setBlogs({...blogs, time: Now()});
      const { status } = await axios.post(
        API_URL + BLOG + "/UploadFile",
        blogs,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (status === 200) {
        toast.success("Add a Blog successfully");
        setBlogs(initialFormValues);
        setThumbnail(undefined);
      } else {
        toast.error("Có lỗi xảy ra trong quá trình gửi");
      }
    }
    return (
      <div className="create-blog-container">
        <div className="top-container">
          {/* Dashboard Link  */}
          <Link to={"/admin/blogs"}>
            <BsFillArrowLeftCircleFill size={25} />
          </Link>
          <h4>Create blog</h4>
        </div>
        <form onSubmit={handleSubmit} className="main-content">
          {/* Thumbnail  */}
          {thumbnail && (
            <img
              className=" w-full rounded-md mb-3 "
              src={thumbnail ? URL.createObjectURL(thumbnail) : ""}
              alt="thumbnail"
            />
          )}
          {/* First Thumbnail Input  */}
          <div className="mb-3 input-wrapper">
            <label htmlFor="file">Upload thumbnail</label>
            <input
              type="file"
              id="file"
              onChange={(e) => {
                if (e.target.files) {
                  setBlogs({ ...blogs, file: e.target.files[0] });
                  setThumbnail(e.target.files[0]);
                }
              }}
            />
          </div>

          {/* Second Title Input */}
          <div className="mb-3 input-wrapper">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              placeholder="Enter Your Title"
              name="title"
              value={blogs.title}
              type="text"
              className="input-text"
              onChange={(e) => setBlogs({ ...blogs, title: e.target.value })}
            />
          </div>
          {/* Third Category Input  */}
          <div className="mb-3 input-wrapper">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              value={blogs.description}
              placeholder="Enter Your description"
              name="description"
              className="input-text"
              onChange={(e) =>
                setBlogs({ ...blogs, description: e.target.value })
              }
            />
          </div>
          {/* Four Editor  */}
          <div className="mb-3">
            <Editor
              apiKey={apiKey}
              onEditorChange={(newValue, editor) => {
                setBlogs({ ...blogs, content: newValue });
                setText(editor.getContent({ format: "text" }));
              }}
              onInit={(evt, editor) => {
                setText(editor.getContent({ format: "text" }));
              }}
              init={{
                plugins:
                  "a11ychecker advcode advlist advtable anchor autocorrect autolink autoresize autosave casechange charmap checklist code codesample directionality editimage emoticons export footnotes formatpainter fullscreen help image importcss inlinecss insertdatetime link linkchecker lists media mediaembed mentions mergetags nonbreaking pagebreak pageembed permanentpen powerpaste preview quickbars save searchreplace table tableofcontents template  tinydrive tinymcespellchecker typography visualblocks visualchars wordcount",
                toolbar:
                  "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
              }}
              value={blogs.content}
            />
          </div>
          {/* Five Submit Button  */}
          <button type='submit' className="btn-save">Save</button>
          {/* Six Preview Section  */}
          <div className="preview-section mb-3">
            <h1>Preview</h1>
            <div className="content">
              <div
                className="main-content"
                dangerouslySetInnerHTML={createMarkup(blogs.content)}
              ></div>
            </div>
          </div>
        </form>
      </div>
    );
}

export default CreateBlog;