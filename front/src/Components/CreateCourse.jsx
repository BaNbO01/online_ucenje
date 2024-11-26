import React, { useState, useEffect } from 'react';
import './CreateCourse.css';
import axios from "axios";
import Navigation from './Navigation';

const CreateCourse = () => {
  const [naziv, setNaziv] = useState('');
  const [opis, setOpis] = useState('');
  const [categories, setCategories] = useState([]);
  const [izabranaKategorija, setIzabranaKategorija] = useState('');
  const [slika, setSlika] = useState(null);

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

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      if (!izabranaKategorija) {
        console.error("Kategorija nije izabrana!");
        return; // Prekida slanje formulara ako kategorija nije izabrana
      }
    
      console.log(izabranaKategorija);
      const formData = new FormData();
      formData.append('naziv', naziv);
      formData.append('opis', opis);
      formData.append('kategorije[]', izabranaKategorija);  // Dodajte kategoriju u niz


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
        console.log('Kurs je uspešno kreiran:', response.data);
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
      <label htmlFor="kategorija" className="form-label">Kategorija:</label>
      <select
        id="kategorija"
        value={izabranaKategorija}
        onChange={(e) => setIzabranaKategorija(e.target.value)}
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
