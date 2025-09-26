import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Autocomplete } from "@mui/material";
import { TextField } from "@mui/material";
import { useState } from "react";

export function NameDialogButton({
  existingUsernames,
  onUsernameSelect,
}: {
  existingUsernames: string[];
  onUsernameSelect: (username: string | null) => void;
}) {
  const [isUsernameDialogOpen, setIsUsernameDialogOpen] = useState(false);
  const [userInput, setUserInput] = useState("");

  return (
    <>
      {" "}
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setIsUsernameDialogOpen(true)}
        sx={{
          backgroundColor: "primary.main",
          "&:hover": {
            backgroundColor: "primary.dark",
          },
        }}
      >
        Add Availabilities
      </Button>
      <Dialog
        open={isUsernameDialogOpen}
        onClose={() => setIsUsernameDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Enter Your Name</DialogTitle>
        <DialogContent>
          <Autocomplete
            freeSolo
            options={existingUsernames}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Your Name"
                margin="normal"
                variant="outlined"
                onChange={(e) => {
                  setUserInput(e.target.value);
                }}
              />
            )}
            onChange={(_, newValue) => {
              onUsernameSelect(newValue);
              setIsUsernameDialogOpen(false);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsUsernameDialogOpen(false)}
            sx={{ color: "text.primary" }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              const value = userInput.trim();
              onUsernameSelect(value);
              setIsUsernameDialogOpen(false);
            }}
            disabled={!userInput.trim()}
            sx={{
              color: "primary.main",
              backgroundColor: "white",
              "&.Mui-disabled": {
                color: "rgba(0, 0, 0, 0.26)", // Makes disabled text visible
              },
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
