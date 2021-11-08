import React, { useState, useEffect } from "react"
import './App.css';
import Post from "./Post";
import { db } from "./firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import { Modal, Button, Input } from 'antd';
import ImageUpload from "./ImageUpload";
import Loader from "react-loader-spinner";

function App() {
  const auth = getAuth();
  const [posts, setPosts] = useState([]);
  const [visible, setVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [modalState, setModalState] = useState('')

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null)
      }
    });

    return () => {
      unsubscribe();
    }
  }, [user])

  useEffect(async () => {
    const q = query(collection(db, "posts"), orderBy('timestamp', 'desc'));
    const unsubscribe = await onSnapshot(q, (querySnapshot) => {
      setPosts(querySnapshot.docs.map(doc => ({ id: doc.id, post: doc.data() })));
    });

  }, [user]);

  const singUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        return updateProfile(auth.currentUser, {
          displayName: username
        })
          .catch((err) => alert(err.message))
      })
      .catch((err) => alert(err.message));
    onCancel();
  }

  const loginkey = () => {
    setVisible(true);
    setModalState("login");
  }

  const login = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user)
        setVisible(false)
      })
      .catch(err => alert(err.message));
  }

  const logout = () => {
    auth.signOut();
    onCancel()
  }

  const onCancel = () => {
    setPassword('');
    setUsername('');
    setEmail('');
    setVisible(false);
    setModalState('')
  }


  return (
    <div className="app" >
      <Modal
        title={modalState === "login" ? "Log In" : "Sign Up"}
        visible={visible}
        onOk={modalState === "login" ? login : singUp}
        onCancel={onCancel}
        footer={null}
      >
        <div className="form-singup">
          <img
            className="logo"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt="ig-logo"
          />

          <form >
            {
              modalState === '' &&
              <Input
                defaultValue=""
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            }

            <Input
              defaultValue=""
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              defaultValue=""
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              disabled={modalState === "login" ? (email === "" || password === "") : (email === "" || password === "" || username === "")}
              className="signup"
              block
              onClick={modalState === "login" ? login : singUp}>{modalState === "login" ? "Log In" : "Sign Up"}</Button>
          </form>
        </div>
      </Modal>

      <div className="header">
        <div className="logo">
          <img
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt="ig-logo"
          />
        </div>
        {
          user !== null ?
            <div className="button">
              {!user && <Button type="primary" onClick={loginkey}>Log In</Button>}
              {
                user !== null ?
                  <Button type="link" onClick={logout}>Logout</Button> :
                  <Button type="link" onClick={() => setVisible(true)}> Sign Up</Button>
              }
            </div> :
            null
        }

      </div>
      <div className="bodyContainer">
        <div className="body" style={{ height: user === null ? "94vh" : "90vh" }} >
          {
            user &&
            posts.map(({ id, post }) => {
              return (
                <Post user={user} data={post} key={id} postId={id} />
              )
            })

          }
          {!user &&
            <div className="bg" >
              <h3 style={{ paddingLeft: "15px" }}>Please complete your action</h3>
              <div className="bg-btn">
                <Button className="btn" type="primary" onClick={loginkey}>Log In</Button>
                <Button className="btn" type="primary" onClick={() => setVisible(true)}> Sign Up</Button>
              </div>
            </div>
          }
        </div>
      </div>
      {
        user !== null &&
        <div className="footer" >
          <ImageUpload user={user} />
        </div>
      }

    </div >
  );
}

export default App;

