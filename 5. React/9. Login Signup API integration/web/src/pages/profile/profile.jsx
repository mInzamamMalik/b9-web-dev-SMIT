import { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import "./profile.css";
import { GlobalContext } from "../../context/context";
import { useParams } from "react-router-dom";

import { baseUrl } from "../../core";

const Profile = () => {
  const { state, dispatch } = useContext(GlobalContext);

  const postTitleInputRef = useRef(null);
  const postBodyInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [editAlert, setEditAlert] = useState(null);
  const [profile, setProfile] = useState(null);

  const [allPosts, setAllPosts] = useState([]);
  const [toggleRefresh, setToggleRefresh] = useState(false);

  const { userId } = useParams();
 
  const getAllPost = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseUrl}/api/v1/posts?_id=${userId || ""}`, {
        withCredentials: true,
      });
      console.log(response.data);

      setIsLoading(false);
      setAllPosts([...response.data]);
    } catch (error) {
      console.log(error.data);
      setIsLoading(false);
    }
  };

  const getProfile = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/profile/${userId || ""}`);
      console.log(response.data);
      setProfile(response.data);
    } catch (error) {
      console.log(error.data);
    }
  };

  useEffect(() => {
    getAllPost();
    getProfile();

    return () => {
      // cleanup function
    };
  }, [toggleRefresh]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const response = await axios.post(`${baseUrl}/api/v1/post`, {
        title: postTitleInputRef.current.value,
        text: postBodyInputRef.current.value,
      });

      setIsLoading(false);
      console.log(response.data);
      setAlert(response.data.message);
      setToggleRefresh(!toggleRefresh);
      // getAllPost();
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

  return (
    <div>
      <div className="banner bg-indigo-200 h-[20rem] flex items-end flex-wrap">
        {/* <img className="bannerImg" src="./" alt="" /> */}
        {/* <img className="profileImg" src="./" alt="" /> */}
        <div className="bg-red-500 border rounded-full w-[8rem] h-[8rem] m-5"></div>
        <div className="profileName text-4xl mb-10">
          <h1>
            {profile?.data?.firstName} {profile?.data?.lastName}
          </h1>
        </div>
      </div>

      {state.user._id === userId && (
        <form onSubmit={submitHandler}>
          <label htmlFor="postTitleInput"> Post Title:</label>
          <input id="postTitleInput" type="text" required minLength={2} maxLength={20} ref={postTitleInputRef} />
          <br />

          <label htmlFor="postBodyInput"> Post Body:</label>
          <textarea
            id="postBodyInput"
            type="text"
            required
            minLength={2}
            maxLength={999}
            ref={postBodyInputRef}
          ></textarea>
          <br />

          <button type="submit">Publish Post</button>
          <span>
            {alert && alert}
            {isLoading && "Loading..."}
          </span>
        </form>
      )}
      <div>
        {allPosts.map((post, index) => (
          <div key={post._id} className="post">
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
                <p>{post.text}</p>

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
              </div>
            )}
          </div>
        ))}

        {allPosts.length === 0 && <div>No Data</div>}

        <br />
      </div>
    </div>
  );
};

export default Profile;
