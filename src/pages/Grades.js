import { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

function Grades() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [gradeValue, setGradeValue] = useState("");
  const [grades, setGrades] = useState([]);
  const [error, setError] = useState("");

  // Charger les élèves, matières et notes
  useEffect(() => {
    const fetchData = async () => {
      const studentSnapshot = await getDocs(collection(db, "students"));
      const subjectSnapshot = await getDocs(collection(db, "subjects"));
      const gradeSnapshot = await getDocs(collection(db, "grades"));
      setStudents(
        studentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setSubjects(
        subjectSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setGrades(
        gradeSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };
    fetchData();
  }, []);

  // Ajouter une note
  const handleAddGrade = async () => {
    if (!selectedStudent || !selectedSubject || !gradeValue) {
      setError("Remplissez tous les champs");
      return;
    }
    const value = parseFloat(gradeValue);
    if (isNaN(value) || value < 0 || value > 20) {
      setError("La note doit être entre 0 et 20");
      return;
    }
    try {
      await addDoc(collection(db, "grades"), {
        studentId: selectedStudent,
        subjectId: selectedSubject,
        value,
      });
      setGradeValue("");
      setSelectedStudent("");
      setSelectedSubject("");
      setError("");
      const gradeSnapshot = await getDocs(collection(db, "grades"));
      setGrades(
        gradeSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    } catch (e) {
      setError("Erreur lors de l'ajout");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4">Gestion des Notes</Typography>
      {error && <Typography color="error">{error}</Typography>}
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
      <FormControl fullWidth style={{ marginTop: "20px" }}>
        <InputLabel>Matière</InputLabel>
        <Select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          {subjects.map((subject) => (
            <MenuItem key={subject.id} value={subject.id}>
              {subject.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Note (0-20)"
        value={gradeValue}
        onChange={(e) => setGradeValue(e.target.value)}
        fullWidth
        style={{ marginTop: "20px" }}
        type="number"
      />
      <Button
        variant="contained"
        onClick={handleAddGrade}
        style={{ marginTop: "20px" }}
      >
        Ajouter
      </Button>
      <Typography variant="h6" style={{ marginTop: "20px" }}>
        Notes
      </Typography>
      <List>
        {grades.map((grade) => {
          const student = students.find((s) => s.id === grade.studentId);
          const subject = subjects.find((s) => s.id === grade.subjectId);
          return (
            <ListItem key={grade.id}>
              <ListItemText
                primary={`${student?.name || "Inconnu"} - ${
                  subject?.name || "Inconnu"
                }: ${grade.value}/20`}
              />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}

export default Grades;
