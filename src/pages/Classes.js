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
import ClassForm from "../components/ClassForm";

function Classes() {
  const [classes, setClasses] = useState([]);

  const fetchClasses = async () => {
    const snapshot = await getDocs(collection(db, "classes"));
    setClasses(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <Container className="container">
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        Gestion des Classes
      </Typography>
      <ClassForm onClassAdded={fetchClasses} />
      <Typography variant="h6" gutterBottom>
        Liste des Classes
      </Typography>
      <List>
        {classes.map((cls) => (
          <div key={cls.id}>
            <ListItem>
              <ListItemText primary={cls.name} />
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    </Container>
  );
}

export default Classes;
