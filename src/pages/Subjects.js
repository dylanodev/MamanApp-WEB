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
import SubjectForm from "../components/SubjectForm";

function Subjects() {
  const [subjects, setSubjects] = useState([]);

  const fetchSubjects = async () => {
    const snapshot = await getDocs(collection(db, "subjects"));
    setSubjects(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <Container className="container">
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        Gestion des Matières
      </Typography>
      <SubjectForm onSubjectAdded={fetchSubjects} />
      <Typography variant="h6" gutterBottom>
        Liste des Matières
      </Typography>
      <List>
        {subjects.map((subject) => (
          <div key={subject.id}>
            <ListItem>
              <ListItemText
                primary={subject.name}
                secondary={`Coefficient: ${subject.coefficient}`}
              />
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    </Container>
  );
}

export default Subjects;
