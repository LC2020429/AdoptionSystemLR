import Pet from "../pet/pet.model.js";
import Appointment from "../appointment/appointment.model.js";
import { parse } from "date-fns";

export const saveAppointment = async (req, res) => {
  try {
    const data = req.body;

    const isoDate = new Date(data.date);

    if (isNaN(isoDate.getTime())) {
      return res.status(400).json({
        success: false,
        msg: "Fecha inválida",
      });
    }

    const pet = await Pet.findOne({ _id: data.pet });
    if (!pet) {
      return res.status(404).json({
        success: false,
        msg: "No se encontró la mascota",
      });
    }

    const existAppointment = await Appointment.findOne({
      pet: data.pet,
      user: data.user,
      date: {
        $gte: new Date(isoDate).setHours(0, 0, 0, 0),
        $lt: new Date(isoDate).setHours(23, 59, 59, 999),
      },
    });

    if (existAppointment) {
      return res.status(400).json({
        success: false,
        msg: "El usuario y la mascota ya tienen una cita para este día",
      });
    }

    const appointment = new Appointment({ ...data, date: isoDate });
    await appointment.save();

    return res.status(200).json({
      success: true,
      msg: `Cita creada exitosamente en fecha ${data.date}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "Error al crear la cita",
      error,
    });
  }
};

// Listar Citas
export const listAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("pet", "name")
      .populate("user", "nombre email");

    res.status(200).json({
      success: true,
      total: appointments.length,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener las citas",
      error,
    });
  }
};

//Actualizar cita
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({
        success: false,
        message: "Cita no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cita actualizada correctamente",
      appointment: updatedAppointment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar la cita",
      error: err.message,
    });
  }
};

// Cancelar lleva la misma logica que el update
export const cancelarAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    await Appointment.findByIdAndUpdate(
      id,
      { status: "CANCELLED" },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Cita cancelada exitosamente",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error al cancelar la cita",
      error: err.message,
    });
  }
};