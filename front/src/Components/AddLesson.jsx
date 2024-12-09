import React, { useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import axios from "axios";

import "./AddLesson.css";
import Navigation from "./Navigation";

const AddLesson = () => {
  const [lessonName, setLessonName] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [materials, setMaterials] = useState([]);
  const { courseId } = useParams();  // Materijali
  const navigate = useNavigate();

  const handleMaterialChange = (index, field, value) => {
    const updatedMaterials = [...materials];
    updatedMaterials[index] = {
      ...updatedMaterials[index],
      [field]: value,
    };
    setMaterials(updatedMaterials);
  };

  const handleAddMaterial = () => {
    setMaterials([...materials, { naziv: "", file: null }]);
  };

  const handleRemoveMaterial = (index) => {
    const updatedMaterials = materials.filter((_, i) => i !== index);
    setMaterials(updatedMaterials);
  };

  const handleFileChange = (index, file) => {
    const updatedMaterials = [...materials];
    updatedMaterials[index].file = file;
    setMaterials(updatedMaterials);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("naziv", lessonName);
      formData.append("opis", lessonDescription);
      formData.append("kurs_id", courseId);

      materials.forEach((material, index) => {
        formData.append(`materijali[${index}][naziv]`, material.naziv);
        formData.append(`materijali[${index}][file]`, material.file);
      });

      const authToken = window.sessionStorage.getItem("auth_token");
      const response = await axios.post(
        `http://localhost:8000/api/casovi`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response:", response.data);
      navigate("/course-details"); // Nakon uspešnog dodavanja
    } catch (error) {
      console.error("Došlo je do greške:", error.response?.data || error.message);
    }
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
            ></textarea>
          </div>

         

          <div className="materials-section">
            <h3>Materijali</h3>
            {materials.map((material, index) => (
              <div key={index} className="material-item">
                <div className="form-group">
                  <label htmlFor={`materialName-${index}`}>Naziv materijala</label>
                  <input
                    type="text"
                    id={`materialName-${index}`}
                    value={material.naziv}
                    onChange={(e) =>
                      handleMaterialChange(index, "naziv", e.target.value)
                    }
                    placeholder="Unesite naziv materijala"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`materialFile-${index}`}>Fajl materijala</label>
                  <input
                    type="file"
                    id={`materialFile-${index}`}
                    accept=".pdf,.mp4"
                    onChange={(e) => handleFileChange(index, e.target.files[0])}
                    required
                  />
                </div>
                <button
                  type="button"
                  className="remove-material-button"
                  onClick={() => handleRemoveMaterial(index)}
                >
                  Ukloni materijal
                </button>
              </div>
            ))}
            <button
              type="button"
              className="add-material-button"
              onClick={handleAddMaterial}
            >
              Dodaj novi materijal
            </button>
          </div>

          <button type="submit" className="submit-button">
            Dodaj čas
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLesson;
