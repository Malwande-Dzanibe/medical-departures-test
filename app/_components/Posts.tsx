"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type formDataType = {
  title: string;
  body: string;
  userId: number;
};

const Post = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsError, setPostsError] = useState<string>("");
  const [postLoader1, setPostLoader1] = useState<boolean>(false);
  const [postLoader, setPostLoader] = useState<boolean>(false);
  const [postSuccess, setPostSuccess] = useState<string>("");
  const [newPost, setNewPost] = useState<Post | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editId, seteditId] = useState<number | null>(null);
  const [sendButton, setSendButton] = useState<boolean>(true);
  const [editButton, seteditButton] = useState<boolean>(false);
  const [editLoad, seteditLoad] = useState<boolean>(false);

  const [formDataa, setFormDataa] = useState<formDataType>({
    title: "",
    body: "",
    userId: 1,
  });

  const getPosts = async () => {
    setPostLoader(true);
    setPostsError("");
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");

    if (!response.ok) {
      setPostLoader(false);
      setPostsError("sorry, we could not get posts");
      return;
    }
    setPostLoader(false);
    const data = await response.json();

    setPosts(data);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isEditing && formDataa.body && formDataa.title) {
      setPostLoader1(true);
      setPostsError("");

      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataa),
        }
      );

      if (response.status !== 201) {
        setPostsError("Sorry, We could not create your post");
        setPostLoader1(false);
        return;
      }

      setPostLoader1(false);

      const data = await response.json();

      console.log(data);

      setFormDataa({
        title: "",
        body: "",
        userId: 1,
      });
      setNewPost(data);
      setPostSuccess("Your Post Was Successfully Submitted");
    } else if (isEditing && formDataa.body && formDataa.title) {
      setPostsError("");
      seteditLoad(true);
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${editId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataa),
        }
      );

      console.log(formDataa);

      if (!response.ok) {
        setPostsError("Sorry, We could not edit your post");
        seteditLoad(false);
        return;
      }

      const data = await response.json();

      setFormDataa({
        title: "",
        body: "",
        userId: 1,
      });

      console.log(data);

      setNewPost(data);
      seteditLoad(false);

      setPostSuccess("Your Post Was Successfully Edited");
      setIsEditing(false);
      seteditId(null);
      setSendButton(true);
      seteditButton(false);
    }
  };

  const editPost = (id: number) => {
    const post: any = posts.find((post) => {
      return post.id === id;
    });
    setFormDataa((prev) => {
      return {
        ...prev,
        body: post?.body,
        title: post?.title,
      };
    });
    setIsEditing(true);
    seteditId(id);
    setSendButton(false);
    seteditButton(true);
  };

  useEffect(() => {
    getPosts();
  }, []);

  const deletePost = async (id: number) => {
    await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: "DELETE",
    });
    setPostSuccess("You Have Successfully Deleted A Post");
  };

  useEffect(() => {
    setTimeout(() => {
      setPostSuccess("");
    }, 3000);
  }, [postSuccess]);

  if (postLoader) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      {postsError && postsError}
      <div className="notify">
        {postSuccess ? (
          <p className="succe">{postSuccess && postSuccess}</p>
        ) : null}
      </div>

      <form onSubmit={handleSubmit}>
        <h4>{sendButton && "Create A New Post"}</h4>
        <textarea
          className="title"
          placeholder="title"
          value={formDataa.title}
          required
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            setFormDataa((prev) => {
              return {
                ...prev,
                title: event.target.value,
              };
            })
          }
        />
        <textarea
          className="bodyy"
          placeholder="body"
          value={formDataa.body}
          required
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            setFormDataa((prev) => {
              return {
                ...prev,
                body: event.target.value,
              };
            })
          }
        />
        {sendButton && (
          <button type="submit">{postLoader1 ? "Sending..." : "Send"}</button>
        )}
        {editButton && (
          <button type="submit">{editLoad ? "Editing..." : "Edit"}</button>
        )}
      </form>
      {newPost ? (
        <div>
          {newPost && (
            <div className="post">
              {" "}
              <h6>{newPost.title}</h6>
              <p>{newPost.body}</p>
            </div>
          )}
        </div>
      ) : null}

      <div>
        {posts.map((post) => {
          return (
            <div className="post" key={post.id}>
              <h6>{post.title}</h6>
              <p>{post.body}</p>
              <div className="footer">
                <button className="cb1" onClick={() => editPost(post.id)}>
                  edit
                </button>
                <button className="cb" onClick={() => deletePost(post.id)}>
                  delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Post;
