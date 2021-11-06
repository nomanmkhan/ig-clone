import React, { useState, useEffect } from 'react'
import "./post.css"
import { Avatar, Input } from 'antd';
import moment from "moment";
import { ClockCircleOutlined, SendOutlined } from '@ant-design/icons';
import Loader from "react-loader-spinner";
import { collection, onSnapshot, orderBy, query, setDoc, serverTimestamp, doc } from "firebase/firestore";
import { db } from "../src/firebase";
import short from 'short-uuid';

function Post({ data, postId, user }) {
    let time = moment.unix(data?.timestamp?.seconds);
    const [load, setLoad] = useState(false);
    const [comments, setComments] = useState();
    const [comment, setComment] = useState();

    useEffect(async () => {
        if (postId) {
            let q = query(collection(db, "posts", postId, "comments"), orderBy('timestamp', 'desc'));
            const unsubscribe = await onSnapshot(q, (snap) => {
                setComments(snap.docs.map((doc) => doc.data()));
            });

            // const q = query(collection(db, "posts"), orderBy('timestamp', 'desc'));
            // const unsubscribe = await onSnapshot(q, (querySnapshot) => {
            //   setPosts(querySnapshot.docs.map(doc => ({ id: doc.id, post: doc.data() })));
            // });

        }
    }, [])

    useEffect(() => {
        getTime()
    }, []);

    const getTime = () => {
        setLoad(true);
        setTimeout(() => {
            setLoad(false)
        }, 1200);
    }

    const sendComment = async () => {
        if (comment === '') {
            alert("text is required")
        }
        let docData = {
            timestamp: serverTimestamp(),
            username: user.displayName,
            text: comment,
        }
        let q = query(collection(db, "posts", postId, "comments"));
        await setDoc(doc(db, "posts", postId, "comments"), short.generate(), docData);
        // await setDoc(doc(db, "posts", short.generate()), docData);


    }
    return (
        <div className="container">
            <div style={{ padding: "10px", display: "flex", flexDirection: "row" }}>
                <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>{data.username[0].toUpperCase()}</Avatar>
                <h4 style={{ paddingTop: "5px", paddingLeft: "10px" }}><strong>{data.username}</strong></h4>
            </div>
            {
                load ?
                    <Loader
                        className="loader"
                        type="Grid"
                        color="rgba(44, 62, 80,0.8)"
                        height={40}
                        width={40}
                    /> :
                    <img
                        className="post-img"
                        alt="user-upload-img"
                        src={data.img}
                    />
            }

            <div style={{ padding: "10px 10px 0 10px" }}>
                <p className="comment" > <span><ClockCircleOutlined /></span>  {moment(time).fromNow()}</p>
                <p className="comment"><strong>{data?.username}</strong> {data?.caption}</p>
                {comments && comments.map(single => {
                    return (
                        <p><strong>{single?.username}</strong> {single?.text}</p>
                    )
                })}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); sendComment(comment) }}>
                <Input
                    suffix={<SendOutlined onClick={() => { sendComment(comment.trim()) }} />}
                    defaultValue=""
                    type="comment"
                    placeholder="Comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </form>

        </div>
    )
}

export default Post
