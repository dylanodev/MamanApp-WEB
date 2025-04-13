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
import StudentForm from "./components/StudentForm";

function Students() {
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      const snapshot = await getDocs(collection(db, "students"));
      setStudents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (e) {
      console.error("Erreur lors du chargement des élèves:", e);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <Container className="container">
      <Typography
        variant="h4"
        gutterBottom
        sx={{ mt: 4, fontSize: { xs: "1.5rem", sm: "2rem" } }}
      >
        Gestion des Élèves
      </Typography>
      <StudentForm onStudentAdded={fetchStudents} />
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
      >
        Liste des Élèves
      </Typography>
      <List>
        {students.length === 0 ? (
          <Typography
            color="text.secondary"
            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
          >
            Aucun élève disponible
          </Typography>
        ) : (
          students.map((student) => (
            <div key={student.id}>
              <ListItem>
                <ListItemText
                  primary={student.name}
                  secondary={`Parent: ${student.parentName || "Non spécifié"}`}
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
          ))
        )}
      </List>
    </Container>
  );
}

export default Students;
