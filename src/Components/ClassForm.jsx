import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { TextField, Button, Grid } from "@mui/material";
import { toast } from "react-toastify";

function ClassForm({ onClassAdded }) {
  const [className, setClassName] = useState("");

  const handleAddClass = async () => {
    if (!className.trim()) {
      toast.error("Le nom de la classe est requis");
      return;
    }
    try {
      await addDoc(collection(db, "classes"), { name: className });
      setClassName("");
      toast.success("Classe ajoutée avec succès");
      if (onClassAdded) onClassAdded();
    } catch (e) {
      toast.error("Erreur lors de l'ajout de la classe");
    }
  };

  return (
    <Grid container spacing={2} sx={{ mb: { xs: 2, sm: 4 } }}>
      <Grid item xs={12} sm={8}>
        <TextField
          label="Nom de la classe"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          fullWidth
          variant="outlined"
          size="small"
          sx={{
            "& .MuiInputBase-input": { fontSize: { xs: "0.9rem", sm: "1rem" } },
          }}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <Button
          variant="contained"
          onClick={handleAddClass}
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

export default ClassForm;
