import { ruFormSchema } from "@repo/shared";
import { Elysia } from "elysia";
import { processReserva } from "../services/reserva";

export const reservaRoutes = new Elysia().post(
	"/reserva",
	({ body }) => {
		const userId = processReserva(body);

		return {
			success: true,
			message: `Agendamento de ${body.data.length} dias concluído.`,
			userId,
		};
	},
	{
		body: ruFormSchema,
	},
);
