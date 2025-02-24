import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Formik } from "formik";
import * as Yup from "yup";
import zxcvbn from 'zxcvbn'; // Add password strength checker

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import styled from "@mui/material/styles/styled";
import LoadingButton from "@mui/lab/LoadingButton";
import useTheme from "@mui/material/styles/useTheme";
import LinearProgress from "@mui/material/LinearProgress";
// GLOBAL CUSTOM COMPONENTS
import MatxDivider from "app/components/MatxDivider";
import { Paragraph } from "app/components/Typography";
// GLOBAL CUSTOM HOOKS
import useAuth from "app/hooks/useAuth";

// Password strength indicator
const PasswordStrengthBar = styled(LinearProgress)(({ strength }) => ({
  marginTop: 8,
  '& .MuiLinearProgress-bar': {
    backgroundColor: 
      strength === 0 ? '#f44336' : 
      strength === 1 ? '#ff9800' :
      strength === 2 ? '#ffeb3b' :
      strength === 3 ? '#4caf50' : '#2196f3'
  }
}));

// STYLED COMPONENTS
const ContentBox = styled("div")(({ theme }) => ({
  height: "100%",
  padding: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.background.default
}));

const IMG = styled("img")({ width: "100%" });

const GoogleButton = styled(Button)(({ theme }) => ({
  color: "rgba(0, 0, 0, 0.87)",
  backgroundColor: "#e0e0e0",
  boxShadow: theme.shadows[0],
  "&:hover": { backgroundColor: "#d5d5d5" }
}));

const RegisterRoot = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#1A2038",
  minHeight: "100vh !important",
  "& .card": { maxWidth: 750, margin: 16, borderRadius: 12 }
});

// Form validation schema with stronger password requirements
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .matches(/[0-9]/, "A senha deve conter pelo menos um número")
    .matches(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
    .matches(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .matches(/[^\w]/, "A senha deve conter pelo menos um caractere especial")
    .required("A senha é obrigatória"),
  email: Yup.string()
    .email("Email inválido")
    .required("Email é obrigatório"),
  terms: Yup.boolean()
    .oneOf([true], "Você deve aceitar os termos de serviço")
});

const initialValues = {
  email: "",
  password: "",
  terms: false
};

export default function FirebaseRegister() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const { createUserWithEmail, signInWithGoogle } = useAuth();
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleGoogleRegister = async () => {
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (e) {
      console.error(e);
      enqueueSnackbar(e.message || "Erro ao registrar com Google", { variant: "error" });
    }
  };

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      await createUserWithEmail(values.email, values.password);
      enqueueSnackbar("Cadastro realizado com sucesso!", { variant: "success" });
      navigate("/");
    } catch (error) {
      const errorMessage = 
        error.code === "auth/email-already-in-use" ? "Este email já está em uso" :
        error.code === "auth/invalid-email" ? "Email inválido" :
        error.code === "auth/operation-not-allowed" ? "Operação não permitida" :
        "Erro ao criar conta";
      
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const checkPasswordStrength = (password) => {
    const result = zxcvbn(password);
    setPasswordStrength(result.score);
  };

  return (
    <RegisterRoot>
      <Card className="card">
        <Grid container>
          <Grid size={{ md: 6, xs: 12 }}>
            <ContentBox>
              <IMG src="/assets/images/illustrations/posting_photo.svg" alt="Register" />
            </ContentBox>
          </Grid>

          <Grid size={{ md: 6, xs: 12 }}>
            <Box px={4} pt={4}>
              <GoogleButton
                fullWidth
                variant="contained"
                onClick={handleGoogleRegister}
                startIcon={<img src="/assets/images/logos/google.svg" alt="google" />}>
                Registrar com Google
              </GoogleButton>
            </Box>

            <MatxDivider sx={{ mt: 3, px: 4 }} text="Ou" />

            <Box p={4} height="100%">
              <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}>
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit
                }) => (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      name="email"
                      label="Email"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.email}
                      onChange={handleChange}
                      helperText={touched.email && errors.email}
                      error={Boolean(errors.email && touched.email)}
                      sx={{ mb: 3 }}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      name="password"
                      type="password"
                      label="Senha"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.password}
                      onChange={(e) => {
                        handleChange(e);
                        checkPasswordStrength(e.target.value);
                      }}
                      helperText={touched.password && errors.password}
                      error={Boolean(errors.password && touched.password)}
                      sx={{ mb: 1.5 }}
                    />

                    <PasswordStrengthBar
                      variant="determinate"
                      value={(passwordStrength + 1) * 20}
                      strength={passwordStrength}
                    />

                    <Box display="flex" alignItems="center" gap={1} mb={3}>
                      <Checkbox
                        size="small"
                        name="terms"
                        onChange={handleChange}
                        checked={values.terms}
                      />
                      <Paragraph fontSize={13}>
                        Eu li e aceito os{" "}
                        <NavLink
                          to="/terms"
                          style={{ color: theme.palette.primary.main }}>
                          termos de serviço
                        </NavLink>
                      </Paragraph>
                    </Box>

                    {errors.terms && touched.terms && (
                      <Paragraph color="error" fontSize={13} mb={2}>
                        {errors.terms}
                      </Paragraph>
                    )}

                    <LoadingButton
                      type="submit"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      fullWidth
                      disabled={!values.terms}>
                      Criar Conta
                    </LoadingButton>

                    <Paragraph mt={2}>
                      Já possui uma conta?{" "}
                      <NavLink
                        to="/session/signin"
                        style={{ color: theme.palette.primary.main }}>
                        Entrar
                      </NavLink>
                    </Paragraph>
                  </form>
                )}
              </Formik>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </RegisterRoot>
  );
}