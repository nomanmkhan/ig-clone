import React, { useState, useEffect } from 'react'
import "./post.css"
import { Avatar, Divider, Input } from 'antd';
import moment from "moment";
import { ClockCircleOutlined, SendOutlined } from '@ant-design/icons';
import Loader from "react-loader-spinner";
import { collection, onSnapshot, orderBy, query, addDoc, serverTimestamp, doc, updateDoc, } from "firebase/firestore";
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
        }
    }, [])

    useEffect(() => {
        getTime()
    }, []);

    const getTime = () => {
        setLoad(true);
        setTimeout(() => {
            setLoad(false)
        }, 1500);
    }

    const sendComment = () => {
        if (comment === '') {
            alert("text is required")
        }
        else {

            let docData = {
                timestamp: serverTimestamp(),
                username: user.displayName,
                text: comment,
            }
            addDoc(collection(db, "posts", postId, "comments"), docData);
            setComment('');
        }


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
            <div className="footer-post">
                <div style={{ padding: "10px 10px 0 10px" }}>
                    <p className="comments" > <span><ClockCircleOutlined /></span>  {moment(time).fromNow()}</p>
                    <p className="comments"><strong>{data?.username}</strong> {data?.caption}</p>
                    <Divider />
                    {comments && comments.map(single => {
                        let time = moment.unix(single?.timestamp?.seconds);
                        return (
                            <div>
                                <p className="comment"> <strong>{single?.username}</strong> {single?.text} - <span className="subComment" >{moment(time).fromNow()}</span></p>
                            </div>

                        )
                    })}
                </div>
                <form onSubmit={(e) => { e.preventDefault(); sendComment(comment) }}>
                    <Input
                        suffix={<SendOutlined onClick={() => { sendComment(comment) }} />}
                        defaultValue=""
                        type="comment"
                        placeholder="Comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </form>
            </div>

        </div>
    )
}

export default Post
