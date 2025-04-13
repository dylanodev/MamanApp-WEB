import { Container, Typography, Box } from "@mui/material";

function Home() {
  return (
    <Container className="container" sx={{ mt: 4, textAlign: "center" }}>
      <Typography
        variant="h3"
        gutterBottom
        sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" } }}
      >
        Bienvenue sur MamanApp-Web
      </Typography>
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
      >
        Gérez facilement les classes, élèves, matières, notes et générez des
        bulletins scolaires.
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Typography
          variant="body1"
          sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
        >
          Commencez par ajouter une classe ou explorez les autres sections via
          la barre de navigation.
        </Typography>
      </Box>
    </Container>
  );
}

export default Home;
