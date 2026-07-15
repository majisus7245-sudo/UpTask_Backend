import { transporter } from "../config/nodemailer"

interface IEmail {
    email: string
    name: string
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async (user : IEmail) => {
        await transporter.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to: user.email,
            subject: 'UpTask - Confirma tu Cuenta',
            text: 'UpTask - Confirma tu Cuenta',
            html: `<p>Hola ${user.name}, has creado tu cuenta en UpTask, ya casi esta todo lito, solo debes confirmar tu cuenta</p>
            <p>Visita el siguiente enlace: </p>
            <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar Cuenta</a>
            <p>E ingresa el codigo: <b>${user.token}</b></p>
            <p>Este token expira en 10 minutos</p>
            `
        })
    }

    static sendPasswordResetToken = async (user : IEmail) => {
        await transporter.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to: user.email,
            subject: 'UpTask - Reestablce tu Password',
            text: 'UpTask - Reestablce tu Password',
            html: `<p>Hola ${user.name}, has solicitado reestablecer tu password.</p>
            <p>Visita el siguiente enlace: </p>
            <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer Password</a>
            <p>E ingresa el codigo: <b>${user.token}</b></p>
            <p>Este token expira en 10 minutos</p>
            `
        })
    }

}