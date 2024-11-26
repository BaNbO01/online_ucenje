import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "./Navigation";
import "./Teachers.css"

const Teachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    const authToken = sessionStorage.getItem("auth_token");

    console.log(authToken);
    // Dohvatanje liste nastavnika
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/users/nastavnici", {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
            .then(response => setTeachers(response.data.data))
            .catch(error => console.error("Error fetching teachers:", error));
    }, [authToken]);

    // Funkcija za prikazivanje popup-a
    const handleDeleteClick = (teacher) => {
        setSelectedTeacher(teacher);
        setShowPopup(true);
    };

    // Funkcija za potvrdu brisanja
    const confirmDelete = () => {
        axios.delete(`http://127.0.0.1:8000/api/users/${selectedTeacher.id}`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
            .then(() => {
                setTeachers(teachers.filter(t => t.id !== selectedTeacher.id)); // Ažuriraj listu
                setShowPopup(false); // Zatvori popup
            })
            .catch(error => console.error("Error deleting teacher:", error));
    };

    return (
        <div className="teachers-body">
            <Navigation/>
            <h1>Nastavnici</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Korisničko ime</th>
                        <th>Email</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {teachers.map(teacher => (
                        <tr key={teacher.id}>
                            <td>{teacher.id}</td>
                            <td>{teacher.korisnicko_ime}</td>
                            <td>{teacher.email}</td>
                            <td>
                                <button onClick={() => handleDeleteClick(teacher)}>Obriši</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Popup za potvrdu */}
            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <p>Da li ste sigurni da želite da obrišete profesora "{selectedTeacher.korisnicko_ime}" i sve njegove kurseve?</p>
                        <button onClick={confirmDelete}>Da</button>
                        <button onClick={() => setShowPopup(false)}>Ne</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Teachers;
