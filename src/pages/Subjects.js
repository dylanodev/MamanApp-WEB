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
import SubjectForm from "./components/SubjectForm";

function Subjects() {
  const [subjects, setSubjects] = useState([]);

  const fetchSubjects = async () => {
    try {
      const snapshot = await getDocs(collection(db, "subjects"));
      setSubjects(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (e) {
      console.error("Erreur lors du chargement des matières:", e);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <Container className="container">
      <Typography
        variant="h4"
        gutterBottom
        sx={{ mt: 4, fontSize: { xs: "1.5rem", sm: "2rem" } }}
      >
        Gestion des Matières
      </Typography>
      <SubjectForm onSubjectAdded={fetchSubjects} />
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
      >
        Liste des Matières
      </Typography>
      <List>
        {subjects.length === 0 ? (
          <Typography
            color="text.secondary"
            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
          >
            Aucune matière disponible
          </Typography>
        ) : (
          subjects.map((subject) => (
            <div key={subject.id}>
              <ListItem>
                <ListItemText
                  primary={subject.name}
                  secondary={`Coefficient: ${subject.coefficient}`}
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

export default Subjects;
