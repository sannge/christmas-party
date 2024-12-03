import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "../Results.css";

const Results = () => {
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      const resultsCollection = collection(db, "results");
      const resultsSnapshot = await getDocs(resultsCollection);
      const resultsData = resultsSnapshot.docs.map((doc) => doc.data());
      setResults(resultsData);
    };

    fetchResults();
  }, []);

  return (
    <div className="results-container">
      <h1>🎄 Christmas Wheel Results 🎁</h1>
      <ul className="results-list">
        {results.map((entry, index) => (
          <li key={index} className="result-item">
            <span className="name">{entry.name}</span>: <span className="category">{entry.category}</span>
          </li>
        ))}
      </ul>
      <button className="back-button" onClick={() => navigate("/")}>
        Back to Home 🏠
      </button>
    </div>
  );
};

export default Results;
