import { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

function Students() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [parentName, setParentName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      const snapshot = await getDocs(collection(db, "students"));
      setStudents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchStudents();
  }, []);

  const handleAddStudent = async () => {
    if (!name) return;
    await addDoc(collection(db, "students"), { name, parentName, photoUrl });
    setName("");
    setParentName("");
    setPhotoUrl("");
    const snapshot = await getDocs(collection(db, "students"));
    setStudents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4">Gestion des Élèves</Typography>
      <TextField
        label="Nom de l'élève"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        style={{ marginTop: "20px" }}
      />
      <TextField
        label="Nom du parent"
        value={parentName}
        onChange={(e) => setParentName(e.target.value)}
        fullWidth
        style={{ marginTop: "20px" }}
      />
      <TextField
        label="URL de la photo"
        value={photoUrl}
        onChange={(e) => setPhotoUrl(e.target.value)}
        fullWidth
        style={{ marginTop: "20px" }}
      />
      <Button
        variant="contained"
        onClick={handleAddStudent}
        style={{ marginTop: "20px" }}
      >
        Ajouter
      </Button>
      <Typography variant="h6" style={{ marginTop: "20px" }}>
        Liste des Élèves
      </Typography>
      <List>
        {students.map((student) => (
          <ListItem key={student.id}>
            <ListItemText
              primary={student.name}
              secondary={`Parent: ${student.parentName || "Non spécifié"}`}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default Students;
