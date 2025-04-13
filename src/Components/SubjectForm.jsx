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

function SubjectForm({ onSubjectAdded }) {
  const [name, setName] = useState("");
  const [coefficient, setCoefficient] = useState("");
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

  const handleAddSubject = async () => {
    if (!name.trim() || !coefficient || !classId) {
      toast.error("Remplissez tous les champs");
      return;
    }
    const coef = parseInt(coefficient);
    if (isNaN(coef) || coef <= 0) {
      toast.error("Coefficient doit être un entier positif");
      return;
    }
    try {
      await addDoc(collection(db, "subjects"), {
        name,
        coefficient: coef,
        classId,
      });
      setName("");
      setCoefficient("");
      setClassId("");
      toast.success("Matière ajoutée avec succès");
      if (onSubjectAdded) onSubjectAdded();
    } catch (e) {
      toast.error("Erreur lors de l'ajout de la matière");
    }
  };

  return (
    <Grid container spacing={2} sx={{ mb: { xs: 2, sm: 4 } }}>
      <Grid item xs={12} sm={4}>
        <TextField
          label="Nom de la matière"
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
      <Grid item xs={12} sm={3}>
        <TextField
          label="Coefficient"
          value={coefficient}
          onChange={(e) => setCoefficient(e.target.value)}
          fullWidth
          variant="outlined"
          type="number"
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
      <Grid item xs={12} sm={2}>
        <Button
          variant="contained"
          onClick={handleAddSubject}
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

export default SubjectForm;
