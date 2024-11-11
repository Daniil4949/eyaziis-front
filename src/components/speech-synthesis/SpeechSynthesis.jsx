import React, { useState } from "react";
import axios from "../../api/axios";
import {
  Button,
  TextField,
  Slider,
  Typography,
  Box,
} from "@mui/material";

const SpeechSynthesis = () => {
  const [formData, setFormData] = useState({
    text: "",
    rate: 150,
    volume: 0.5,
    language_id: 4, // Значение по умолчанию для немецкого языка
  });

  const [responseMessage, setResponseMessage] = useState("");

  // Обработчик изменения текста и выбора языка
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Обработчик изменения темпа речи
  const handleRateChange = (e, value) => {
    setFormData({
      ...formData,
      rate: value,
    });
  };

  // Обработчик изменения громкости
  const handleVolumeChange = (e, value) => {
    setFormData({
      ...formData,
      volume: value,
    });
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Отправляем данные:", formData);
      const response = await axios.post("/v1/speech-synthesis", formData);
      setResponseMessage(`Ответ от сервера: ${response.data.message}`);
    } catch (error) {
      console.error("Ошибка при отправке данных:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "0 auto", padding: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Speech Synthesis Form
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Text"
          name="text"
          value={formData.text}
          onChange={handleChange}
          multiline
          rows={4}
          fullWidth
          margin="normal"
          required
        />

        <Typography gutterBottom>Volume: {formData.volume}</Typography>
        <Slider
          name="volume"
          value={formData.volume}
          onChange={handleVolumeChange}
          min={0}
          max={1}
          step={0.1}
          valueLabelDisplay="auto"
        />

        <Typography gutterBottom>Language id: {formData.language_id}</Typography>
        <Slider
          name="language_id"
          value={formData.language_id}
          onChange={handleChange}
          min={1}
          max={20}
          step={1}
          valueLabelDisplay="auto"
        />

        <Typography gutterBottom>Rate: {formData.rate}</Typography>
        <Slider
          name="rate"
          value={formData.rate}
          onChange={handleRateChange}
          min={50}
          max={300}
          step={10}
          valueLabelDisplay="auto"
        />

        <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: "16px" }}>
          Submit
        </Button>
      </form>

      {responseMessage && (
        <Typography variant="body1" color="secondary" style={{ marginTop: "16px" }}>
          {responseMessage}
        </Typography>
      )}
    </Box>
  );
};

export default SpeechSynthesis;
