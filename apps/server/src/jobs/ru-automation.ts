import { cron } from "@elysiajs/cron";
import dayjs from "dayjs";
import { db } from "../db/schema";

interface ReservaPendente {
	id: string;
	nome: string;
	refeicao: string;
}

export const ruAutomationJob = cron({
	name: "daily-ru-automation",
	pattern: "30 9,15 * * 1-5",
	async run() {
		const today = dayjs().format("YYYY-MM-DD");
		const now = dayjs().format("HH:mm");

		console.log(`[${now}] Verificando reservas para: ${today}`);

		const pending = db
			.query(
				`
          SELECT s.id, u.nome, s.refeicao 
          FROM schedules s
          JOIN users u ON s.user_id = u.id
          WHERE s.data_reserva = ? AND s.processado = 0
        `,
			)
			.all(today) as ReservaPendente[];

		for (const row of pending) {
			try {
				// TODO: Aqui entrará a função de fetch para o Google Forms

				db.run("UPDATE schedules SET processado = 1 WHERE id = ?", [row.id]);
			} catch (error) {
				console.error(`Erro ao processar ${row.nome}:`, error);
			}
		}
	},
});
