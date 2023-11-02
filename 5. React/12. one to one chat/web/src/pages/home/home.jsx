import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./home.css";
import { Navigate, useNavigate } from "react-router-dom";

import { baseUrl } from "../../core";

const Home = () => {

  const navigate = useNavigate();

  const postTitleInputRef = useRef(null);
  const postBodyInputRef = useRef(null);
  const postFileInputRef = useRef(null);
  const searchInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [editAlert, setEditAlert] = useState(null);

  const [allPosts, setAllPosts] = useState([]);
  const [toggleRefresh, setToggleRefresh] = useState(false);

  const [selectedImage, setSelectedImage] = useState("");

  const getAllPost = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseUrl}/api/v1/feed`, {
        withCredentials: true
      });
      console.log(response.data);

      setIsLoading(false);
      setAllPosts([...response.data]);
    } catch (error) {
      console.log(error.data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllPost();

    return () => {
      // cleanup function
    };
  }, [toggleRefresh]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      // const response = await axios.post(`${baseUrl}/api/v1/post`, {
      //   title: postTitleInputRef.current.value,
      //   text: postBodyInputRef.current.value,
      // });

      let formData = new FormData();

      formData.append("title", postTitleInputRef.current.value);
      formData.append("text", postBodyInputRef.current.value);
      formData.append("image", postFileInputRef.current.files[0]);

      const response = await axios.post(
        `${baseUrl}/api/v1/post`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

      setIsLoading(false);
      console.log(response.data);
      setAlert(response.data.message);
      setToggleRefresh(!toggleRefresh);
      // getAllPost();
      setSelectedImage("");
      e.target.reset();
    } catch (error) {
      // handle error
      console.log(error?.data);
      setIsLoading(false);
    }
  };

  const deletePostHandler = async (_id) => {
    try {
      setIsLoading(true);
      const response = await axios.delete(`${baseUrl}/api/v1/post/${_id}`, {
        title: postTitleInputRef.current.value,
        text: postBodyInputRef.current.value,
      });

      setIsLoading(false);
      console.log(response.data);
      setAlert(response.data.message);
      setToggleRefresh(!toggleRefresh);
    } catch (error) {
      // handle error
      console.log(error?.data);
      setIsLoading(false);
    }
  };

  const editSaveSubmitHandler = async (e) => {
    e.preventDefault();
    const _id = e.target.elements[0].value;
    const title = e.target.elements[1].value;
    const text = e.target.elements[2].value;

    try {
      setIsLoading(true);
      const response = await axios.put(`${baseUrl}/api/v1/post/${_id}`, {
        title: title,
        text: text,
      });

      setIsLoading(false);
      console.log(response.data);
      setAlert(response?.data?.message);
      setToggleRefresh(!toggleRefresh);
    } catch (error) {
      // handle error
      console.log(error?.data);
      setIsLoading(false);
    }
  };

  const searchHandler = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseUrl}/api/v1/search?q=${searchInputRef.current.value}`);
      console.log(response.data);

      setIsLoading(false);
      setAllPosts([...response.data]);
    } catch (error) {
      console.log(error.data);
      setIsLoading(false);
    }
  };

  const doLikeHandler = async (_id) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${baseUrl}/api/v1/post/${_id}/dolike`);

      setIsLoading(false);
      console.log(response.data);
      setAlert(response.data.message);
      // setToggleRefresh(!toggleRefresh);
    } catch (error) {
      // handle error
      console.log(error?.data);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={submitHandler} className="postForm">

        <div className="left">


          <div className="section1">
            <div className="labels">
              <label htmlFor="postTitleInput"> Post Title:</label>
              <br />
              <label htmlFor="postBodyInput"> Post Body:</label>
              <br />
              <label htmlFor="postFileInput"> Photo:</label>
            </div>

            <div className="inputs">
              <input id="postTitleInput" type="text" required minLength={2} maxLength={20} ref={postTitleInputRef} />
              <br />
              <textarea
                id="postBodyInput"
                type="text"
                required
                minLength={2}
                maxLength={999}
                ref={postBodyInputRef}
              ></textarea>
              <br />
              <input ref={postFileInputRef} id="postFileInput" type="file" name="postFileInput"
                accept="image/*" onChange={(e) => {
                  const base64Url = URL.createObjectURL(e.target.files[0]);
                  setSelectedImage(base64Url)
                }} />


            </div>


          </div>


          <br />
          <button type="submit">Publish Post</button>

          <span>
            {alert && alert}
            {isLoading && "Loading..."}
          </span>
        </div>


        <div className="right">
          {selectedImage && <img height={220} src={selectedImage} alt="selected image" />}

        </div>

      </form>

      <br />

      <form onSubmit={searchHandler} style={{ textAlign: "right" }}>
        <input type="search" placeholder="Search..." ref={searchInputRef} />
        <button type="submit" hidden></button>
      </form>

      <div>
        {allPosts.map((post, index) => (
          <div key={index} className="post">
            {post.isEdit ? (
              <form onSubmit={editSaveSubmitHandler} className="editForm">
                <input type="text" disabled value={post._id} hidden />
                <input defaultValue={post.title} type="text" placeholder="title" />
                <br />
                <textarea defaultValue={post.text} type="text" placeholder="body" />
                <br />
                <button type="submit">Save</button>
                <button
                  type="button"
                  onClick={() => {
                    post.isEdit = false;
                    setAllPosts([...allPosts]);
                  }}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div>
                <h2>{post.title}</h2>
                <h4>{post.authorObject.firstName} {post.authorObject.lastName} - {post.authorObject.email}</h4>
                <p>{post.text}</p>

                {post.img &&
                  <>
                    <img width={300} src={post.img} alt="post image" />
                    <br />
                  </>
                }

                <button
                  onClick={(e) => {
                    console.log("click");
                    allPosts[index].isEdit = true;
                    setAllPosts([...allPosts]);
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={(e) => {
                    deletePostHandler(post._id);
                  }}
                >
                  Delete
                </button>

                <button
                  onClick={(e) => {
                    doLikeHandler(post._id);
                  }}
                >
                  Like ({post?.likes?.length})
                </button>

                <button
                  onClick={(e) => {
                    navigate(`/chat/${post?.authorObject?._id}`)
                  }}
                >
                  Message
                </button>




              </div>
            )}
          </div>
        ))}

        <br />
      </div>
    </div>
  );
};

export default Home;
