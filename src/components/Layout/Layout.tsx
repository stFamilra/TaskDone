import { Outlet, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';

export const Layout = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            TaskFlow
          </Typography>
          <Button color="inherit" component={Link} to="/projects">
            Проекты
          </Button>
          <Button color="inherit" component={Link} to="/board">
            Доска
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Outlet /> {/* сюда будут подставляться страницы */}
      </Container>
    </>
  );
};
