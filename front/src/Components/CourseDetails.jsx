import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CourseDetails.css";
import Navigation from "./Navigation";

const CourseDetails = () => {
  const { courseId } = useParams(); // Uzima ID kursa iz URL-a
  const [courseDetails, setCourseDetails] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [isTeacher, setIsTeacher] = useState(false); // Da proverimo da li je korisnik predavač
  const [isAdmin, setIsAdmin] = useState(false); // Da proverimo da li je korisnik admin
  const navigate = useNavigate(); // Koristi se za navigaciju

  useEffect(() => {
    // Mock podaci umesto API poziva
    const mockCourseDetails = {
      id: courseId,
      naziv: "React za Početnike",
      opis: "Ovaj kurs je namenjen početnicima u React-u.",
      kreirano: "2023-01-01T12:00:00Z",
      azurirano: "2023-12-01T12:00:00Z",
      image: "https://via.placeholder.com/800x200",
    };

    const mockLessons = [
      { id: 1, naziv: "Uvod u React" },
      { id: 2, naziv: "Komponente i Props" },
      { id: 3, naziv: "State i Event Handlers" },
    ];

    // Setovanje mock podataka u state
    setCourseDetails(mockCourseDetails);
    setLessons(mockLessons);

    // Mock vrednosti za predavača i admina
    setIsTeacher(true);
    setIsAdmin(false);
  }, [courseId]);

  const handleAddLesson = () => {
    // Logika za dodavanje časa (ovde možete dodati formu za unos časa)
    navigate("/dodaj-lekciju")
    console.log("Dodavanje časa");
  };

  const handleDeleteCourse = () => {
    // Logika za brisanje kursa (mock)
    console.log("Brisanje kursa");
    navigate("/courses"); // Nakon brisanja kursa, vraćamo korisnika na listu kurseva
  };

  if (!courseDetails) {
    return <p>Loading course details...</p>;
  }

  return (
    <div className="course-details-page">
      <Navigation />
      <div className="course-banner">
        <img
          src={courseDetails.image || "https://via.placeholder.com/800x200"}
          alt={courseDetails.naziv}
        />
      </div>
      <div className="course-info">
        <h1>{courseDetails.naziv}</h1>
        <p className="course-description">{courseDetails.opis}</p>
        <p><strong>Kreirano:</strong> {new Date(courseDetails.kreirano).toLocaleDateString()}</p>
        <p><strong>Ažurirano:</strong> {new Date(courseDetails.azurirano).toLocaleDateString()}</p>
      </div>

      <div className="lessons-section">
        <h2>Časovi</h2>
        <ul>
          {lessons.length === 0 ? (
            <p className="no-lessons">Nema časova za ovaj kurs.</p>
          ) : (
            lessons.map((lesson) => (
              <li key={lesson.id} className="lesson-item">
                <p>{lesson.naziv}</p>
                {isTeacher || isAdmin ? (
                  <button onClick={() => console.log(`Brisanje časa ${lesson.id}`)} className="delete-lesson-button">
                    Obrisi čas
                  </button>
                ) : null}
              </li>
            ))
          )}
        </ul>

        {isTeacher && (
          <button onClick={handleAddLesson} className="add-lesson-button">
            Dodaj čas
          </button>
        )}
      </div>

      {(isTeacher || isAdmin) && (
        <button onClick={handleDeleteCourse} className="delete-course-button">
          Obrisi kurs
        </button>
      )}
    </div>
  );
};

export default CourseDetails;
