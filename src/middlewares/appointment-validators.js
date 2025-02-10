import { body, param } from "express-validator";
import { appointmentExists } from "../helpers/db-validators.js";
import { validarCampos } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";

export const createAppointmentValidator = [
    body("date").notEmpty().withMessage("La fecha es requerida"),
    body("pet").notEmpty().withMessage("La mascota es requerida"),
    body("pet").isMongoId().withMessage("No es un ID válido de MongoDB"),
    validarCampos,
    handleErrors
];

export const listAppointmentsValidator = [
    validarCampos,
    handleErrors
];

export const listAppointmentsValidatorId = [
    param("id").isMongoId().withMessage("No es un ID válido de MongoDB"),
    param("id").custom(appointmentExists),
    validarCampos,
    handleErrors
];


export const updateAppointmentValidator = [
    param("id").isMongoId().withMessage("No es un ID válido de MongoDB"),
    param("id").custom(appointmentExists),
    body("date").notEmpty().withMessage("La fecha es requerida"),
    body("pet").notEmpty().withMessage("La mascota es requerida"),
    body("pet").isMongoId().withMessage("No es un ID válido de MongoDB"),
    validarCampos,
    handleErrors
];

export const deleteAppointment = [
    param("id").isMongoId().withMessage("No es un ID válido de MongoDB"),
    param("id").custom(appointmentExists),
    validarCampos,
    handleErrors
];