import { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import {
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";

function GradeForm({ onGradeAdded }) {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [gradeValue, setGradeValue] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const studentSnapshot = await getDocs(collection(db, "students"));
      const subjectSnapshot = await getDocs(collection(db, "subjects"));
      setStudents(
        studentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setSubjects(
        subjectSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };
    fetchData();
  }, []);

  const handleAddGrade = async () => {
    if (!selectedStudent || !selectedSubject || !gradeValue) {
      toast.error("Remplissez tous les champs");
      return;
    }
    const value = parseFloat(gradeValue);
    if (isNaN(value) || value < 0 || value > 20) {
      toast.error("La note doit être entre 0 et 20");
      return;
    }
    try {
      await addDoc(collection(db, "grades"), {
        studentId: selectedStudent,
        subjectId: selectedSubject,
        value,
      });
      setSelectedStudent("");
      setSelectedSubject("");
      setGradeValue("");
      toast.success("Note ajoutée avec succès");
      onGradeAdded();
    } catch (e) {
      toast.error("Erreur lors de l'ajout de la note");
    }
  };

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={4}>
        <FormControl fullWidth>
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
      </Grid>
      <Grid item xs={12} sm={3}>
        <FormControl fullWidth>
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
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          label="Note (0-20)"
          value={gradeValue}
          onChange={(e) => setGradeValue(e.target.value)}
          fullWidth
          variant="outlined"
          type="number"
          inputProps={{ step: "0.1" }}
        />
      </Grid>
      <Grid item xs={12} sm={2}>
        <Button
          variant="contained"
          onClick={handleAddGrade}
          fullWidth
          sx={{ height: "100%" }}
        >
          Ajouter
        </Button>
      </Grid>
    </Grid>
  );
}

export default GradeForm;
