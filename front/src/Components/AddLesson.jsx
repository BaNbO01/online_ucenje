import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddLesson.css";
import Navigation from "./Navigation";

const AddLesson = () => {
  const [lessonName, setLessonName] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [lessonVideo, setLessonVideo] = useState(null); // Za video
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ovdje možete dodati logiku za slanje podataka na server
    console.log("Novi čas:", { lessonName, lessonDescription, lessonVideo });
    navigate("/course-details"); // Nakon dodavanja časa, vraćamo korisnika na detalje kursa
  };

  const handleFileChange = (e) => {
    setLessonVideo(e.target.files[0]);
  };

  return (
    <div className="create-lesson-page">
      <Navigation />
      <div className="form-container">
        <h1>Dodaj novi čas</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="lessonName">Naziv časa</label>
            <input
              type="text"
              id="lessonName"
              value={lessonName}
              onChange={(e) => setLessonName(e.target.value)}
              placeholder="Unesite naziv časa"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lessonDescription">Opis časa</label>
            <textarea
              id="lessonDescription"
              value={lessonDescription}
              onChange={(e) => setLessonDescription(e.target.value)}
              placeholder="Unesite opis časa"
              rows="4"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="lessonVideo">Video čas</label>
            <input
              type="file"
              id="lessonVideo"
              accept="video/*" // Prihvatamo samo video fajlove
              onChange={handleFileChange}
              required
            />
          </div>

          <button type="submit" className="submit-button">Dodaj čas</button>
        </form>
      </div>
    </div>
  );
};

export default AddLesson;
