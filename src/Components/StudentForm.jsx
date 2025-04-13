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

function StudentForm({ onStudentAdded }) {
  const [name, setName] = useState("");
  const [parentName, setParentName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [classId, setClassId] = useState("");
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const snapshot = await getDocs(collection(db, "classes"));
        setClasses(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (e) {
        toast.error("Erreur lors du chargement des classes");
      }
    };
    fetchClasses();
  }, []);

  const handleAddStudent = async () => {
    if (!name.trim() || !classId) {
      toast.error("Nom et classe requis");
      return;
    }
    try {
      await addDoc(collection(db, "students"), {
        name,
        parentName,
        photoUrl,
        classId,
      });
      setName("");
      setParentName("");
      setPhotoUrl("");
      setClassId("");
      toast.success("Élève ajouté avec succès");
      if (onStudentAdded) onStudentAdded();
    } catch (e) {
      toast.error("Erreur lors de l'ajout de l'élève");
    }
  };

  return (
    <Grid container spacing={2} sx={{ mb: { xs: 2, sm: 4 } }}>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Nom de l'élève"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          variant="outlined"
          size="small"
          sx={{
            "& .MuiInputBase-input": { fontSize: { xs: "0.9rem", sm: "1rem" } },
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Nom du parent"
          value={parentName}
          onChange={(e) => setParentName(e.target.value)}
          fullWidth
          variant="outlined"
          size="small"
          sx={{
            "& .MuiInputBase-input": { fontSize: { xs: "0.9rem", sm: "1rem" } },
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="URL de la photo"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
          fullWidth
          variant="outlined"
          size="small"
          sx={{
            "& .MuiInputBase-input": { fontSize: { xs: "0.9rem", sm: "1rem" } },
          }}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <FormControl fullWidth size="small">
          <InputLabel sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
            Classe
          </InputLabel>
          <Select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
          >
            {classes.map((cls) => (
              <MenuItem
                key={cls.id}
                value={cls.id}
                sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
              >
                {cls.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Button
          variant="contained"
          onClick={handleAddStudent}
          fullWidth
          sx={{
            height: "100%",
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            bgcolor: "#1976d2",
            "&:hover": { bgcolor: "#1565c0" },
          }}
        >
          Ajouter
        </Button>
      </Grid>
    </Grid>
  );
}

export default StudentForm;
