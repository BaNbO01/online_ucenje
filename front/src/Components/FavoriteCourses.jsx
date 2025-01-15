import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FavoriteCourses.css";
import { Link } from 'react-router-dom';
import Navigation from "./Navigation";

const FavoriteCourses = () => {
  const [courses, setCourses] = useState([]); // Omiljeni kursevi
  const [filteredCourses, setFilteredCourses] = useState([]); // Filtrirani kursevi
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const coursesPerPage = 5; // Broj kurseva po stranici
  const authToken = sessionStorage.getItem("auth_token");

  useEffect(() => {
    // Dohvatanje omiljenih kurseva za trenutnog korisnika sa paginacijom
    axios
      .get("http://localhost:8000/api/users/omiljeni-kursevi", {
        params: {
          page: pagination.currentPage,
          per_page: coursesPerPage,
        },
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => {
        if (response.data && response.data.data) {
          setCourses(response.data.data); // Postavlja sve kurseve
          setFilteredCourses(response.data.data); // Inicijalno filtrirani kursevi
          setPagination({
            currentPage: response.data.meta.current_page,
            totalPages: response.data.meta.last_page,
            totalItems: response.data.meta.total,
          });
        } else {
          console.error("Nepravilna struktura podataka za omiljene kurseve:", response);
        }
      })
      .catch((error) => {
        console.error("Greška prilikom dobijanja omiljenih kurseva:", error);
      });
  }, [pagination.currentPage, authToken]);

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
  };

  const handlePrevPage = () => {
    if (pagination.currentPage > 1) {
      setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }));
    }
  };

  return (
    <div className="home-page">
      <Navigation />
      <div className="main-content">
        {/* Kursevi */}
        <div className="courses-section">
          <h2>Omiljeni kursevi</h2>
          <div className="courses-grid">
            {filteredCourses.map((course) => (
              <Link to={`/kursevi/${course.id}`} key={course.id}>
                <div className="course-card">
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

          {/* Pagination Controls */}
          <div className="pagination">
            <button
              onClick={handlePrevPage}
              disabled={pagination.currentPage === 1}
              className="pagination-button"
            >
              Prethodna
            </button>
            <span className="pagination-info">
              Stranica {pagination.currentPage} od {pagination.totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={pagination.currentPage === pagination.totalPages}
              className="pagination-button"
            >
              Sledeća
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteCourses;
