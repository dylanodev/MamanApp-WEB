import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <AppBar position="static" sx={{ bgcolor: "#1976d2" }}>
      <Toolbar sx={{ flexWrap: "wrap" }}>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          MamanApp-Web
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button color="inherit" component={Link} to="/">
            Accueil
          </Button>
          <Button color="inherit" component={Link} to="/classes">
            Classes
          </Button>
          <Button color="inherit" component={Link} to="/students">
            Élèves
          </Button>
          <Button color="inherit" component={Link} to="/subjects">
            Matières
          </Button>
          <Button color="inherit" component={Link} to="/grades">
            Notes
          </Button>
          <Button color="inherit" component={Link} to="/bulletins">
            Bulletins
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
