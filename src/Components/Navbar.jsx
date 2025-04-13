import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <AppBar position="static" sx={{ bgcolor: "#1976d2", mb: 4 }}>
      <Toolbar sx={{ flexWrap: "wrap", py: { xs: 1, sm: 2 } }}>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
            fontSize: { xs: "1rem", sm: "1.25rem" },
          }}
        >
          MamanApp-Web
        </Typography>
        <Box sx={{ display: "flex", gap: { xs: 1, sm: 2 }, flexWrap: "wrap" }}>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              px: { xs: 1, sm: 2 },
            }}
          >
            Accueil
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/classes"
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              px: { xs: 1, sm: 2 },
            }}
          >
            Classes
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/students"
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              px: { xs: 1, sm: 2 },
            }}
          >
            Élèves
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/subjects"
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              px: { xs: 1, sm: 2 },
            }}
          >
            Matières
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/grades"
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              px: { xs: 1, sm: 2 },
            }}
          >
            Notes
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/bulletins"
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              px: { xs: 1, sm: 2 },
            }}
          >
            Bulletins
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
