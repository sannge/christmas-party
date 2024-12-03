import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../Spin.css";

const Spin = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState(null);

  const categories = ["🎄 Drinks", "🎁 Entree", "🎂 Dessert", "🍪 Appetizer"];
  const categoryLimits = {
    "🎄 Drinks": 1,
    "🎁 Entree": 4,
    "🎂 Dessert": 2,
    "🍪 Appetizer": 2,
  };

  useEffect(() => {
    const checkUserSpun = async () => {
      const resultsCollection = collection(db, "results");
      const userQuery = query(resultsCollection, where("name", "==", state.name));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        setHasSpun(true);
        setSelectedPrize(userData.category);
      }
    };

    checkUserSpun();
  }, [state.name]);

  const spinWheel = async () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);

    // Fetch current counts from Firestore
    const resultsCollection = collection(db, "results");
    const snapshot = await getDocs(resultsCollection);
    const categoryCounts = snapshot.docs.reduce((counts, doc) => {
      const { category } = doc.data();
      counts[category] = (counts[category] || 0) + 1;
      return counts;
    }, {});

    // Check if all categories are full
    const allCategoriesFull = categories.every(
      (category) => (categoryCounts[category] || 0) >= categoryLimits[category]
    );

    if (allCategoriesFull) {
      alert("All categories are full! No more spins are allowed.");
      setIsSpinning(false);
      return;
    }

    // Calculate spin rotation
    const segmentAngle = 360 / categories.length; // Each segment spans an equal angle
    const randomIndex = Math.floor(Math.random() * categories.length); // Random category index
    const spins = Math.floor(Math.random() * 4 + 3); // Random full spins (3-6)
    const rotation = spins * 360 + randomIndex * segmentAngle + segmentAngle / 2;

    const wheel = document.querySelector(".wheel");
    wheel.style.transform = `rotate(${rotation}deg)`;

    setTimeout(async () => {
      // Correctly determine the selected category based on the final rotation
      const finalRotation = rotation % 360; // Get the wheel's final position within 360 degrees
      const correctedIndex = Math.floor(finalRotation / segmentAngle); // Map the angle to the segment index
      const selectedCategory = categories[correctedIndex];

      // Check if the selected category has reached its limit
      if ((categoryCounts[selectedCategory] || 0) >= categoryLimits[selectedCategory]) {
        alert(
          `The category "${selectedCategory}" has already reached its limit. Please spin again.`
        );
        setIsSpinning(false);
        return; // Allow the user to spin again
      }

      // Category is valid, proceed to save and display
      setIsSpinning(false);
      setHasSpun(true);
      setSelectedPrize(selectedCategory);

      // Highlight the chosen segment
      const segments = document.querySelectorAll(".wheel-segment");
      segments.forEach((segment, index) => {
        if (index === correctedIndex) {
          segment.classList.add("highlight");
        }
      });

      // Save result to Firestore
      await addDoc(resultsCollection, { name: state.name, category: selectedCategory });
    }, 3000); // Matches CSS animation duration
  };

  const viewResults = () => {
    navigate("/results");
  };

  return (
    <div className="spin-container">
      <h1>🎅 Spin the Christmas Wheel! 🎄</h1>
      <div className="wheel-wrapper">
        <div className="arrow">🔽</div>
        <div className="wheel">
    {categories.map((category, index) => (
      <div
        key={index}
        className="wheel-segment"
        style={{
          transform: `rotate(${-(360 / categories.length) * index}deg)`, // Reverse segment order
          backgroundColor: `hsl(${index * (360 / categories.length)}, 70%, 60%)`,
        }}
      >
        <span
          style={{
            transform: `rotate(${(360 / categories.length) * index}deg)`, // Correct text orientation
          }}
        >
          {category}
        </span>
      </div>
    ))}
  </div>
      </div>
      {!hasSpun ? (
        <button onClick={spinWheel} disabled={isSpinning}>
          {isSpinning ? "Spinning..." : "Spin 🎁"}
        </button>
      ) : (
        <>
          <p className="result">🎉 You got: {selectedPrize} 🎉</p>
          <button onClick={viewResults}>View Results</button>
        </>
      )}
    </div>
  );
};

export default Spin;
