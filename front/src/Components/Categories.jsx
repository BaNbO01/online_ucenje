import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "./Navigation";
import "./Categories.css";

const Categories = () => {
    const [categories, setCategories] = useState([]); // Lista kategorija
    const [newCategory, setNewCategory] = useState(""); // Nova kategorija
    const [error, setError] = useState(""); // Greška

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

    // Dodavanje nove kategorije
    const addCategory = (e) => {
        e.preventDefault();
        axios
            .post(
                "http://127.0.0.1:8000/api/kategorije",
                { naziv: newCategory },
                {
                    headers: { Authorization: `Bearer ${authToken}` },
                }
            )
            .then((response) => {
                setCategories([...categories, response.data.data]); // Dodaj novu kategoriju u listu
                setNewCategory(""); // Očisti unos
                setError(""); // Očisti grešku
            })
            .catch((error) => {
                console.error("Error adding category:", error);
                setError("Greška pri dodavanju kategorije.");
            });
    };

    return (
        <div className="categories-body">
            <Navigation />
            <h1>Kategorije Kurseva</h1>

            {/* Lista kategorija */}
            <ul className="category-list">
                {categories.map((category) => (
                    <li key={category.id}>{category.naziv}</li>
                ))}
            </ul>

            {/* Forma za dodavanje kategorije */}
            <form onSubmit={addCategory}>
                <label htmlFor="new-category">Dodaj novu kategoriju:</label>
                <input
                    type="text"
                    id="new-category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    required
                />
                <button type="submit">Dodaj</button>
            </form>

            {/* Prikaz greške */}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default Categories;
