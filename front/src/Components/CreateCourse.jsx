import React, { useState, useEffect } from 'react';
import './CreateCourse.css';
import axios from "axios";
import Navigation from './Navigation';
import { useNavigate } from 'react-router-dom';

const CreateCourse = () => {
  const [naziv, setNaziv] = useState('');
  const [opis, setOpis] = useState('');
  const [categories, setCategories] = useState([]);
  const [izabraneKategorije, setIzabraneKategorije] = useState([]);
  const [slika, setSlika] = useState(null);
  const navigate = useNavigate();

  const authToken = sessionStorage.getItem("auth_token");

  // Dohvatanje kategorija
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/kategorije", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => setCategories(response.data.data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handleDodajKategoriju = (kategorija) => {
    if (!izabraneKategorije.some((k) => k.id === kategorija.id)) {
      setIzabraneKategorije((prevState) => [...prevState, kategorija]);
    }
  };

  const handleUkloniKategoriju = (id) => {
    setIzabraneKategorije((prevState) => prevState.filter((k) => k.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (izabraneKategorije.length === 0) {
      console.error("Nema izabranih kategorija!");
      return;
    }

    const formData = new FormData();
    formData.append('naziv', naziv);
    formData.append('opis', opis);
    izabraneKategorije.forEach((kategorija, index) => {
      formData.append(`kategorije[${index}][id]`, kategorija.id);
    });

    if (slika) {
      formData.append('baner', slika); // Slika mora biti poslana sa 'baner'
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/kursevi', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authToken}`,
        },
      });
      navigate("/moji-kursevi");
    } catch (error) {
      console.error('Greška prilikom kreiranja kursa:', error.response ? error.response.data : error);
    }
  };

  return (
    <div className="napravi-kurs">
      <Navigation />
      <h1 className="page-title">Napravi Kurs</h1>
      <form onSubmit={handleSubmit} className="create-course-form">
        <div className="form-group">
          <label htmlFor="naziv" className="form-label">Naziv Kursa:</label>
          <input
            type="text"
            id="naziv"
            value={naziv}
            onChange={(e) => setNaziv(e.target.value)}
            placeholder="Unesite naziv kursa"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="opis" className="form-label">Opis Kursa:</label>
          <textarea
            id="opis"
            value={opis}
            onChange={(e) => setOpis(e.target.value)}
            placeholder="Unesite opis kursa"
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label htmlFor="kategorija" className="form-label">Dodaj Kategorije:</label>
          <select
            id="kategorija"
            onChange={(e) => {
              const kategorija = categories.find(k => k.id === parseInt(e.target.value));
              if (kategorija) handleDodajKategoriju(kategorija);
            }}
            className="form-select"
          >
            <option value="">Izaberite kategoriju</option>
            {categories.map((kategorija) => (
              <option key={kategorija.id} value={kategorija.id}>
                {kategorija.naziv}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <h4>Izabrane Kategorije:</h4>
          <ul>
            {izabraneKategorije.map((kategorija) => (
              <li key={kategorija.id}>
                {kategorija.naziv}
                <button
                  type="button"
                  onClick={() => handleUkloniKategoriju(kategorija.id)}
                >
                  Ukloni
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="form-group">
          <label htmlFor="slika" className="form-label">Slika Kursa:</label>
          <input
            type="file"
            id="slika"
            onChange={(e) => setSlika(e.target.files[0])}
            className="form-file-input"
          />
        </div>

        <button className="submit-button" type="submit">Kreiraj Kurs</button>
      </form>
    </div>
  );
};

export default CreateCourse;
