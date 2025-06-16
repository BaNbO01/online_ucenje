import React, { useState, useEffect } from "react";
import axios from "axios"; // Axios za API pozive
import "./Courses.css";
import { Link } from 'react-router-dom';
import Navigation from "./Navigation";

const Courses = () => {
  const [categories, setCategories] = useState([]); // Kategorije iz baze
  const [courses, setCourses] = useState([]); // Kursevi iz baze
  const [teachers, setTeachers] = useState([]); // Nastavnici iz baze
  const [filteredCourses, setFilteredCourses] = useState([]); // Filtrirani kursevi

  const [selectedCategory, setSelectedCategory] = useState(null); // Izabrana kategorija
  const [selectedTeacher, setSelectedTeacher] = useState(null); // Izabrani nastavnik

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const coursesPerPage = 10; // Broj kurseva po stranici
  const authToken = sessionStorage.getItem("auth_token"); // Uzimanje tokena iz sessionStorage

  // Dohvatanje podataka sa API-ja
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/kursevi", {
          params: {
            page: pagination.currentPage,
            per_page: coursesPerPage,
          },
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (response.data && response.data.data) {
          setCourses(response.data.data); // Postavljanje kurseva
          setFilteredCourses(response.data.data);
          setPagination({
            currentPage: response.data.meta.current_page,
            totalPages: response.data.meta.last_page,
            totalItems: response.data.meta.total,
          });
        } else {
          console.error("Nepravilna struktura podataka za kurseve:", response);
        }
      } catch (error) {
        console.error("Greška prilikom dobijanja kurseva:", error);
      }
    };

      axios.get("http://localhost:8000/api/kategorije", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => setCategories(response.data.data))
      .catch((error) => {
        console.error("Greška prilikom dobijanja kategorija:", error);
      });

    // Dohvatanje nastavnika
    axios
      .get("http://localhost:8000/api/users/nastavnici", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => setTeachers(response.data.data))
      .catch((error) => {
        console.error("Greška prilikom dobijanja nastavnika:", error);
      });
  

    fetchCourses();
  }, [pagination.currentPage, authToken]);

  useEffect(() => {
    let filtered = courses;

    if (selectedCategory) {
      filtered = filtered.filter((course) => {
        return course.kategorije.some(category => {
          return category.id === selectedCategory;
        });
      });
    }

    if (selectedTeacher) {
      filtered = filtered.filter((course) => {
        return course.predavac && course.predavac.id === selectedTeacher;
      });
    }

    setFilteredCourses(filtered);
  }, [selectedCategory, selectedTeacher, courses]);

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
        {/* Sidebar */}
        <div className="sidebar">
          <h3>Filteri</h3>
          <h4>Kategorije</h4>
          <ul>
            {categories.map((category) => (
              <li
                key={category.id}
                className={selectedCategory === category.id ? "selected" : ""}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )
                }
              >
                {category.naziv}
              </li>
            ))}
          </ul>
          <h4>Nastavnici</h4>
          <ul>
            {teachers.map((teacher) => (
              <li
                key={teacher.id}
                className={selectedTeacher === teacher.id ? "selected" : ""}
                onClick={() =>
                  setSelectedTeacher(
                    selectedTeacher === teacher.id ? null : teacher.id
                  )
                }
              >
                {teacher.korisnicko_ime}
              </li>
            ))}
          </ul>
          <button
            className="reset-button"
            onClick={() => {
              setSelectedCategory(null);
              setSelectedTeacher(null);
            }}
          >
            Resetuj filtere
          </button>
        </div>

        {/* Courses */}
        <div className="courses-section">
          <h2>Svi kursevi</h2>
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

export default Courses;
