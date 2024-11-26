import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "./Navigation";
import "./Students.css";

const Students = () => {
    const [students, setStudents] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const authToken = sessionStorage.getItem("auth_token"); // Izvlaci token
    console.log(authToken);
    // Dohvatanje liste studenata
    useEffect(() => {
        
        axios
            .get("http://127.0.0.1:8000/api/users/studenti", {
                headers: { Authorization: `Bearer ${authToken}` },
            })
            .then((response) => setStudents(response.data.data))
            .catch((error) => console.error("Error fetching students:", error));
    }, []);

    // Funkcija za prikazivanje popup-a
    const handleDeleteClick = (student) => {
        setSelectedStudent(student);
        setShowPopup(true);
    };

    // Funkcija za potvrdu brisanja
    const confirmDelete = () => {
        
        axios
            .delete(`http://127.0.0.1:8000/api/users/${selectedStudent.id}`, {
                headers: { Authorization: `Bearer ${authToken}` },
            })
            .then(() => {
                setStudents(students.filter((s) => s.id !== selectedStudent.id)); // Ažuriraj listu
                setShowPopup(false); // Zatvori popup
            })
            .catch((error) => console.error("Error deleting student:", error));
    };

    return (
        <div className="students-body">
            <Navigation />
            <h1>Studenti</h1>
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
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td>{student.id}</td>
                            <td>{student.korisnicko_ime}</td>
                            <td>{student.email}</td>
                            <td>
                                <button onClick={() => handleDeleteClick(student)}>Obriši</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Popup za potvrdu */}
            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <p>Da li ste sigurni da želite da obrišete studenta "{selectedStudent.korisnicko_ime}"?</p>
                        <button onClick={confirmDelete}>Da</button>
                        <button onClick={() => setShowPopup(false)}>Ne</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Students;
