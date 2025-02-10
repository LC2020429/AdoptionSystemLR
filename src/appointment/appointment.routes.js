import { Router } from "express";
import {
  saveAppointment,
  listAppointments,
  updateAppointment,
  cancelarAppointment,
} from "./appointment.controller.js";
import {
  createAppointmentValidator,
  listAppointmentsValidator,
  updateAppointmentValidator,
  deleteAppointment,
  listAppointmentsValidatorId,
} from "../middlewares/appointment-validators.js";

const router = Router();

router.post("/createAppointment", createAppointmentValidator, saveAppointment);
router.get("/listAppointments", listAppointmentsValidator, listAppointments);
router.put(
  "/updateAppointment/:id",
  updateAppointmentValidator,
  updateAppointment
);
router.delete("/delteAppointment/:id", deleteAppointment, cancelarAppointment);

export default router;