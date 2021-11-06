import React, { useState } from 'react'
import { Button, Input, Upload, Progress, Modal } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';
import short from 'short-uuid';
import { db } from "../src/firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import './App.css'
const storage = getStorage();
const { Dragger } = Upload;
export default function ImageUpload({ user }) {
    const [caption, setCaption] = useState('')
    const [progress, setProgress] = useState(0)
    const [image, setImage] = useState({});
    const [visible, setVisible] = useState(false);
    const [load, setLoad] = useState(false);

    const handleChange = (data) => {
        console.log("111")
        if (data.fileList.length > 0) {
            setImage(data.fileList[0])
        } else {
            setImage({})
        }
    }

    const handleUpload = async () => {
        setLoad(true);
        const storageRef = ref(storage, `images/${image.name}${new Date()}`);
        const uploadTask = uploadBytesResumable(storageRef, image.originFileObj);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
            },
            (error) => {
                console.log("error 35", error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    let docData = {
                        timestamp: serverTimestamp(),
                        username: user.displayName,
                        caption: caption,
                        img: downloadURL,
                        userId: user.uid
                    }
                    await setDoc(doc(db, "posts", short.generate()), docData);
                    cleanUp();
                })

            }
        )

    }

    const doneReq = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 1000);
    };

    const cleanUp = () => {
        setCaption('')
        setImage({});
        setProgress(0);
        setVisible(false);
        setLoad(false);
    }

    const onPreview = async file => {
        let src = file.url;
        if (!src) {
            src = await new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow.document.write(image.outerHTML);
    };
    return (
        <div className="uploadImage-container" >
            <Button className="upload-btn" icon={<PlusSquareOutlined />} onClick={() => setVisible(true)} />
            <Modal
                visible={visible}
                onCancel={cleanUp}
                footer={null}
            >
                <div className="uploadForm" >
                    {/* <img
                        className="logo"
                        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                        alt="ig-logo"
                    /> */}
                    <Input
                        style={{ textAlign: "center" }}
                        placeholder="Enter a caption."
                        defaultValue=""
                        type="text"
                        placeholder="caption"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />
                    <Dragger
                        listType="picture-card"
                        maxCount={1}
                        onChange={handleChange}
                        customRequest={doneReq}
                        onPreview={onPreview}

                    >
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    </Dragger>
                    {progress !== 0 && <Progress percent={progress} />}
                    <Button loading={load} disabled={(caption === "") || (image === "")} onClick={handleUpload} >Post</Button>
                </div>
            </Modal>
        </div>
    )
}
