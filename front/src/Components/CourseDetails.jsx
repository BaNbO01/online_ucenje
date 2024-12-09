import React, { useState, useEffect } from "react";
import { useParams, useNavigate,Link  } from "react-router-dom";
import axios from "axios"; // Dodaj Axios
import "./CourseDetails.css";
import Navigation from "./Navigation";

const CourseDetails = () => {
  const { courseId } = useParams(); 
  const [courseDetails, setCourseDetails] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [isTeacher, setIsTeacher] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); 
  const navigate = useNavigate();
  const [authToken,setAuthToken]=useState(sessionStorage.getItem('auth_token'));

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/kursevi/${courseId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const courseData = response.data.data; // Pretpostavka da API vraća podatke u odgovarajućem formatu
        const userId = sessionStorage.getItem('user_id');
        setCourseDetails(courseData); // Postavi detalje kursa
        setLessons(courseData.casovi || []); // Postavi časove
        setIsTeacher(courseData.predavac?.id == userId); // Primer: Proveri da li je korisnik predavač (ID = 1 kao mock)
        setIsAdmin(sessionStorage.getItem('role')==='admin' ?true:false); // Postavi vrednost admina (mock logika ili podatak iz API-ja)
      } catch (error) {
        console.error("Greška prilikom učitavanja detalja kursa:", error);
        navigate("/404"); // Navigacija na grešku 404 ukoliko kurs nije pronađen
      }
    };

    fetchCourseDetails();
  }, [courseId, navigate]);

  const handleAddLesson = () => {
    navigate(`/dodaj-lekciju/${courseId}`);
    console.log("Dodavanje časa");
  };

  const handleDeleteCourse = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/kursevi/${courseId}`);
      console.log("Kurs obrisan");
      navigate("/courses");
    } catch (error) {
      console.error("Greška prilikom brisanja kursa:", error);
    }
  };

  if (!courseDetails) {
    return <p>Loading course details...</p>;
  }

  return (
    <div className="course-details-page">
      <Navigation />
      <div className="course-banner">
        <img
          src={courseDetails.putanja_do_slike || "https://via.placeholder.com/800x200"}
          alt={courseDetails.naziv}
        />
      </div>
      <div className="course-info">
        <h1>{courseDetails.naziv}</h1>
        <p className="course-description">{courseDetails.opis}</p>
        <p>
          <strong>Kreirano:</strong>{" "}
          {new Date(courseDetails.kreirano).toLocaleDateString()}
        </p>
        <p>
          <strong>Ažurirano:</strong>{" "}
          {new Date(courseDetails.azurirano).toLocaleDateString()}
        </p>
        <p>
          <strong>Predavač:</strong>{" "}
          {courseDetails.predavac?.korisnicko_ime || "Nepoznato"}
        </p>
        <p>
          <strong>Kategorije:</strong>{" "}
          {courseDetails?.kategorije.map((kategorija) => kategorija.naziv).join(", ")}
        </p>
      </div>

      <div className="lessons-section">
        <h2>Časovi</h2>
        <ul>
          {lessons.length === 0 ? (
            <p className="no-lessons">Nema časova za ovaj kurs.</p>
          ) : (
            lessons.map((lesson) => (
              <li key={lesson.id} className="lesson-item">
             <Link to={`/kursevi/${courseId}/casovi/${lesson.id}`} className="lesson-link">
                  {lesson.naziv}
                </Link>
                {isTeacher || isAdmin ? (
                  <button
                    onClick={() => console.log(`Brisanje časa ${lesson.id}`)}
                    className="delete-lesson-button"
                  >
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
