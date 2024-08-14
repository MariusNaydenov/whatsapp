import TextField from "@mui/material/TextField";

const Input = (props) => {
  return (
    <>
      <TextField
        type={props.type}
        value={props.value}
        onChange={(e) => props.setValue(e.target.value)}
        label={props.label}
        variant="outlined"
        InputLabelProps={{
          style: { color: "#737373", fontFamily: "Nunito" },
        }}
        sx={{
          width: props.width,
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "grey",
            },
            "&:hover fieldset": {
              borderColor: "#000000",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#000000",
            },
          },
          "& .MuiInputBase-input": {
            height: "30px",
            padding: "10px",
            fontFamily: "Nunito",
          },
        }}
      />
    </>
  );
};

export default Input;
