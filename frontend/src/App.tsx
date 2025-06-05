import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import axios from 'axios';

const App: React.FC = () => {
  const [day, setDay] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [result, setResult] = useState<{ message: string; valid: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    try {
      setError(null);
      const response = await axios.post('http://localhost:8080/api/date/validate', {
        day: parseInt(day),
        month: parseInt(month),
        year: parseInt(year),
      });
      setResult(response.data);
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred while validating the date');
      }
      setResult(null);
    }
  };

  const handleClear = () => {
    setDay('');
    setMonth('');
    setYear('');
    setResult(null);
    setError(null);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Date Time Checker
          </Typography>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Day"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              margin="normal"
              type="number"
            />
            <TextField
              fullWidth
              label="Month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              margin="normal"
              type="number"
            />
            <TextField
              fullWidth
              label="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              margin="normal"
              type="number"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCheck}
              disabled={!day || !month || !year}
            >
              Check
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClear}
            >
              Clear
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {result && (
            <Alert
              severity={result.valid ? 'success' : 'error'}
              sx={{ mt: 2 }}
            >
              {result.message}
            </Alert>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default App; 