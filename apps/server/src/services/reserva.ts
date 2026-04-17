import type { RuUpfData } from "@repo/shared";
import dayjs from "dayjs";
import { db } from "../db/schema";

export function processReserva(body: RuUpfData) {
	const existingUser = db
		.prepare("SELECT id FROM users WHERE email = ?")
		.get(body.email) as { id: string } | null;

	const userId = existingUser?.id ?? crypto.randomUUID();

	db.prepare(
		`
      INSERT INTO users (id, email, nome, perfil, matricula)
      VALUES ($id, $email, $nome, $perfil, $matricula)
      ON CONFLICT(email) DO UPDATE SET 
        nome=excluded.nome, 
        perfil=excluded.perfil,
        matricula=excluded.matricula,
        updated_at=CURRENT_TIMESTAMP
    `,
	).run({
		$id: userId,
		$email: body.email,
		$nome: body.nome,
		$perfil: body.perfil,
		$matricula: body.matricula ?? null,
	});

	const insertSchedule = db.prepare(`
      INSERT INTO schedules (id, user_id, data_reserva, refeicao)
      VALUES ($id, $user_id, $data, $refeicao)
    `);

	const transaction = db.transaction((dates: RuUpfData["data"]) => {
		for (const item of dates) {
			insertSchedule.run({
				$id: crypto.randomUUID(),
				$user_id: userId,
				$data: dayjs(item.data).format("YYYY-MM-DD"),
				$refeicao: item.refeicao,
			});
		}
	});

	transaction(body.data);

	return userId;
}
