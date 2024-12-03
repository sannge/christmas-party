import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Home.css";
import Gift from "../images/gift.jpg";
import Reindeer from "../images/reindeer.jpg";

const Home = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleStart = () => {
    if (name.trim()) {
      navigate("/spin", { state: { name } });
    }
  };

  return (
    <div className="home">
      <div className="content">
        <h1>🎅 Welcome to the Christmas Party Wheel! 🎄</h1>
        <p>Enter your name to get started and spin the wheel to discover your category.</p>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-name"
        />
        <button onClick={handleStart} className="start-button">
          Start Spinning 🎁
        </button>
        <div className="decorations"> 
          <img src="/images/reindeer.jpg" alt="Reindeer" className="reindeer-img" />
          <img src="/images/gift.jpg" alt="Gift" className="gift-img" />
        </div>
      </div>
    </div>
  );
};

export default Home;
