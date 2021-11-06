import React, { useState, useEffect } from 'react'
import "./post.css"
import { Avatar } from 'antd';
import moment from "moment";
import { ClockCircleOutlined } from '@ant-design/icons';
import Loader from "react-loader-spinner";
import { collection, onSnapshot, orderBy, query, doc, where, getDoc,getDocFromCache  } from "firebase/firestore";
import { db } from "../src/firebase";

function Post({ data, postId }) {
    console.log("postId", postId);
    let time = moment.unix(data?.timestamp?.seconds);
    const [load, setLoad] = useState(false);
    const [comment, setComments] = useState();

    useEffect(async () => {
        let unsubscribe;
        if (postId) {
            let q = doc(db, 'posts', postId);
            const docSnap = await getDoc(q);
            console.log("docSnap", docSnap.data());
            // let newQ = query(collection(docSnap.data(), "comments"))
            // let snap = onSnapshot(newQ, (snapshot) => {
            //     console.log("snap: ", snapshot);
            // })
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
                <p className="comment"><strong>{data.username}</strong> {data.caption}</p>
            </div>
        </div>
    )
}

export default Post
