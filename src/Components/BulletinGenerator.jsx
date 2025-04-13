import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { jsPDF } from "jspdf";
import {
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";

function BulletinGenerator() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
      } catch (e) {
        toast.error("Erreur lors du chargement des données");
      }
    };
    fetchData();
  }, []);

  const generateBulletin = () => {
    if (!selectedStudent) {
      toast.error("Sélectionnez un élève");
      return;
    }

    const student = students.find((s) => s.id === selectedStudent);
    const studentGrades = grades.filter((g) => g.studentId === selectedStudent);
    const doc = new jsPDF();

    // Entête
    doc.setFontSize(16);
    doc.text("Bulletin de Notes", 105, 10, { align: "center" });
    doc.setFontSize(12);
    doc.text("École: École Primaire Maman Koudjou", 10, 20);
    doc.text("Enseignant: Maman Koudjou", 10, 30);
    doc.text(`Élève: ${student.name}`, 10, 40);
    doc.text(`Parent: ${student.parentName || "Non spécifié"}`, 10, 50);

    // Ajouter la photo si disponible
    if (student.photoUrl) {
      try {
        doc.addImage(student.photoUrl, "JPEG", 160, 20, 30, 30);
      } catch (e) {
        console.warn("Impossible de charger la photo:", e);
      }
    }

    // Notes
    let y = 70;
    let total = 0;
    let coefSum = 0;
    doc.setFontSize(10);
    doc.text("Matière | Note | Coef | Total", 10, y);
    y += 10;
    studentGrades.forEach((grade) => {
      const subject = subjects.find((s) => s.id === grade.subjectId);
      const coef = subject?.coefficient || 1;
      const noteTotal = (grade.value * coef).toFixed(2);
      doc.text(
        `${subject?.name || "Inconnu"} | ${
          grade.value
        }/20 | ${coef} | ${noteTotal}`,
        10,
        y
      );
      total += grade.value * coef;
      coefSum += coef;
      y += 10;
    });

    // Moyenne élève
    const studentAverage = coefSum > 0 ? (total / coefSum).toFixed(2) : 0;
    doc.setFontSize(12);
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
    y += 20;

    // Signatures
    doc.setFontSize(10);
    doc.text("Signature Enseignant: ________________", 10, y);
    doc.text("Signature Parent: ________________", 80, y);
    doc.text("Signature Directeur: ________________", 150, y);

    // Sauvegarder
    doc.save(`${student.name}_bulletin.pdf`);
    toast.success("Bulletin généré avec succès");
  };

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      <Grid item xs={12}>
        <Typography
          variant="h5"
          sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" }, mb: 2 }}
        >
          Générer un Bulletin
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth size="small">
          <InputLabel sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
            Élève
          </InputLabel>
          <Select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
          >
            {students.map((student) => (
              <MenuItem
                key={student.id}
                value={student.id}
                sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
              >
                {student.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button
          variant="contained"
          onClick={generateBulletin}
          fullWidth
          sx={{
            height: "100%",
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            bgcolor: "#1976d2",
            "&:hover": { bgcolor: "#1565c0" },
          }}
        >
          Générer PDF
        </Button>
      </Grid>
    </Grid>
  );
}

export default BulletinGenerator;
