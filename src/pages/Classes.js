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
import ClassForm from "./components/ClassForm";

function Classes() {
  const [classes, setClasses] = useState([]);

  const fetchClasses = async () => {
    try {
      const snapshot = await getDocs(collection(db, "classes"));
      setClasses(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (e) {
      console.error("Erreur lors du chargement des classes:", e);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <Container className="container">
      <Typography
        variant="h4"
        gutterBottom
        sx={{ mt: 4, fontSize: { xs: "1.5rem", sm: "2rem" } }}
      >
        Gestion des Classes
      </Typography>
      <ClassForm onClassAdded={fetchClasses} />
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
      >
        Liste des Classes
      </Typography>
      <List>
        {classes.length === 0 ? (
          <Typography
            color="text.secondary"
            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
          >
            Aucune classe disponible
          </Typography>
        ) : (
          classes.map((cls) => (
            <div key={cls.id}>
              <ListItem>
                <ListItemText
                  primary={cls.name}
                  primaryTypographyProps={{
                    fontSize: { xs: "0.9rem", sm: "1rem" },
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

export default Classes;
