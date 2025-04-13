import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import GradeForm from "./components/GradeForm";

function Grades() {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const fetchData = async () => {
    try {
      const gradeSnapshot = await getDocs(collection(db, "grades"));
      const studentSnapshot = await getDocs(collection(db, "students"));
      const subjectSnapshot = await getDocs(collection(db, "subjects"));
      setGrades(
        gradeSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setStudents(
        studentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setSubjects(
        subjectSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    } catch (e) {
      console.error("Erreur lors du chargement des données:", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container className="container">
      <Typography
        variant="h4"
        gutterBottom
        sx={{ mt: 4, fontSize: { xs: "1.5rem", sm: "2rem" } }}
      >
        Gestion des Notes
      </Typography>
      <GradeForm onGradeAdded={fetchData} />
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
      >
        Liste des Notes
      </Typography>
      <List>
        {grades.length === 0 ? (
          <Typography
            color="text.secondary"
            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
          >
            Aucune note disponible
          </Typography>
        ) : (
          grades.map((grade) => {
            const student = students.find((s) => s.id === grade.studentId);
            const subject = subjects.find((s) => s.id === grade.subjectId);
            return (
              <div key={grade.id}>
                <ListItem>
                  <ListItemText
                    primary={`${student?.name || "Inconnu"} - ${
                      subject?.name || "Inconnu"
                    }`}
                    secondary={`Note: ${grade.value}/20`}
                    primaryTypographyProps={{
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                    }}
                    secondaryTypographyProps={{
                      fontSize: { xs: "0.8rem", sm: "0.875rem" },
                    }}
                  />
                </ListItem>
                <Divider />
              </div>
            );
          })
        )}
      </List>
    </Container>
  );
}

export default Grades;
