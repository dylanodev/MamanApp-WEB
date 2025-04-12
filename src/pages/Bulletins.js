import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { jsPDF } from "jspdf";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";

function Bulletins() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      const studentSnapshot = await getDocs(collection(db, "students"));
      const gradeSnapshot = await getDocs(collection(db, "grades"));
      const subjectSnapshot = await getDocs(collection(db, "subjects"));
      setStudents(
        studentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setGrades(
        gradeSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setSubjects(
        subjectSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };
    fetchData();
  }, []);

  // Calculer les moyennes et le rang
  const generateBulletin = async () => {
    if (!selectedStudent) return;

    const student = students.find((s) => s.id === selectedStudent);
    const studentGrades = grades.filter((g) => g.studentId === selectedStudent);
    const doc = new jsPDF();

    // Entête
    doc.text("Bulletin de Notes", 10, 10);
    doc.text(`École: École Primaire Maman Koudjou`, 10, 20);
    doc.text(`Élève: ${student.name}`, 10, 30);
    doc.text(`Parent: ${student.parentName || "Non spécifié"}`, 10, 40);

    // Notes
    let y = 60;
    let total = 0;
    let coefSum = 0;
    doc.text("Matières | Note | Coef | Total", 10, y);
    y += 10;
    studentGrades.forEach((grade) => {
      const subject = subjects.find((s) => s.id === grade.subjectId);
      const coef = subject?.coefficient || 1;
      const noteTotal = grade.value * coef;
      doc.text(
        `${subject?.name || "Inconnu"} | ${
          grade.value
        }/20 | ${coef} | ${noteTotal}`,
        10,
        y
      );
      total += noteTotal;
      coefSum += coef;
      y += 10;
    });

    // Moyenne élève
    const studentAverage = coefSum > 0 ? (total / coefSum).toFixed(2) : 0;
    doc.text(`Moyenne de l'élève: ${studentAverage}/20`, 10, y);
    y += 10;

    // Moyenne classe
    const studentAverages = students.map((s) => {
      const sGrades = grades.filter((g) => g.studentId === s.id);
      const sTotal = sGrades.reduce((sum, g) => {
        const subj = subjects.find((sub) => sub.id === g.subjectId);
        return sum + g.value * (subj?.coefficient || 1);
      }, 0);
      const sCoefSum = sGrades.reduce((sum, g) => {
        const subj = subjects.find((sub) => sub.id === g.subjectId);
        return sum + (subj?.coefficient || 1);
      }, 0);
      return sCoefSum > 0 ? sTotal / sCoefSum : 0;
    });
    const classAverage =
      studentAverages.length > 0
        ? (
            studentAverages.reduce((sum, avg) => sum + avg, 0) /
            studentAverages.length
          ).toFixed(2)
        : 0;
    doc.text(`Moyenne de la classe: ${classAverage}/20`, 10, y);
    y += 10;

    // Rang
    const sortedAverages = [...studentAverages].sort((a, b) => b - a);
    const rank = sortedAverages.indexOf(parseFloat(studentAverage)) + 1;
    doc.text(`Rang: ${rank}e/${students.length}`, 10, y);

    // Sauvegarder
    doc.save(`${student.name}_bulletin.pdf`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4">Générer un Bulletin</Typography>
      <FormControl fullWidth style={{ marginTop: "20px" }}>
        <InputLabel>Élève</InputLabel>
        <Select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          {students.map((student) => (
            <MenuItem key={student.id} value={student.id}>
              {student.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        onClick={generateBulletin}
        style={{ marginTop: "20px" }}
      >
        Générer PDF
      </Button>
    </div>
  );
}

export default Bulletins;
