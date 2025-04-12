import { Typography, Container, Button, Grid } from "@mui/material";
import { Link } from "react-router-dom";

function Home() {
  return (
    <Container className="container">
      <Typography variant="h3" gutterBottom align="center" sx={{ mt: 4 }}>
        Bienvenue sur MamanApp-Web
      </Typography>
      <Typography
        variant="h6"
        align="center"
        color="text.secondary"
        gutterBottom
      >
        Gérez vos classes, élèves, matières, notes et bulletins en ligne.
      </Typography>
      <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            component={Link}
            to="/classes"
            fullWidth
            sx={{ py: 2 }}
          >
            Gérer les Classes
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            component={Link}
            to="/students"
            fullWidth
            sx={{ py: 2 }}
          >
            Gérer les Élèves
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            component={Link}
            to="/bulletins"
            fullWidth
            sx={{ py: 2 }}
          >
            Générer des Bulletins
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
