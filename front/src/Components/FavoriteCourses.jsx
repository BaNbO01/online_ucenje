import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FavoriteCourses.css";
import { Link } from 'react-router-dom';
import Navigation from "./Navigation";

const FavoriteCourses = () => {
  const [courses, setCourses] = useState([]); // Omiljeni kursevi
  const [filteredCourses, setFilteredCourses] = useState([]); // Filtrirani kursevi

  useEffect(() => {
    const authToken = sessionStorage.getItem("auth_token");

    // Dohvatanje omiljenih kurseva za trenutnog korisnika
    axios
      .get("http://localhost:8000/api/users/omiljeni-kursevi", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setCourses(response.data.data); // Postavlja sve omiljene kurseve
          setFilteredCourses(response.data.data); // Inicijalno filtrirani kursevi su isti
        } else {
          console.error("Nepravilna struktura podataka za omiljene kurseve:", response);
        }
      })
      .catch((error) => {
        console.error("Greška prilikom dobijanja omiljenih kurseva:", error);
      });
  }, []);

  return (
    <div className="home-page">
      <Navigation />
      <div className="main-content">
        {/* Kursevi */}
        <div className="courses-section">
          <h2>Omiljeni kursevi</h2>
          <div className="courses-grid">
            {filteredCourses.map((course) => (
              <Link to={`/kursevi/${course.id}`}>
              <div key={course.id} className="course-card">
                <img
                  src={course.putanja_do_slike || "https://via.placeholder.com/300"}
                  alt={course.title}
                  className="course-image"
                />
                <div className="course-info">
                  <h3>{course.naziv}</h3>
                  <p>{course.opis}</p>
                  <p className="course-dates">
                    Kreirano: {new Date(course.kreirano).toLocaleDateString()} | Ažurirano: {new Date(course.azurirano).toLocaleDateString()}
                  </p>
                </div>
              </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteCourses;
